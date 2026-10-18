// Accounts, end to end, on the demo accounts (accounts kept in the browser).
// Run against the static export: npx serve out -l 4190, then
//   BASE=http://localhost:4190 node scripts/accounts-walk.mjs
// SHOTS=dir saves screenshots (docs/app/screens). Needs ffmpeg for the camera test.
//
// Covers: landing, route guards, sign up (with errors), setup, sign out, wrong
// password, sign in with ?next=, emailed code, forgot password, profile edit,
// session kept after a restart, business login (owner and staff), place
// picker, owner vs staff permissions, staff invite and join, redeem and
// confirm (typed and by camera), used, expired, wrong place and made-up codes,
// uses counting down, history and dashboard updates, delete account, and the
// meeting demo still working with no login.
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
const QR = createRequire(import.meta.url)("qrcode");

const BASE = process.env.BASE || "http://localhost:4190";
const SHOTS = process.env.SHOTS || "";
const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const ALCOHOL = /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?)\b/i;
let pass = 0;
let fail = 0;
const check = (name, ok, extra = "") => {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${!ok && extra ? `  (${extra})` : ""}`);
};
const until = async (fn, ms = 8000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if (await fn()) return true;
    } catch {
      /* not yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
};
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
await ctx.clock.install();
const errors = [];
const watch = (p, who) => {
  p.on("pageerror", (e) => errors.push(`${who}: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource/.test(m.text()) && errors.push(`${who}: ${m.text()}`));
  p.shot = async (n) => SHOTS && (await p.waitForTimeout(350), await p.locator("#app-frame").screenshot({ path: `${SHOTS}/${n}.png` }));
  p.text = () => p.locator("#app-scroll").innerText();
  return p;
};
const m = watch(await ctx.newPage(), "member");
const go = (p, url) => p.goto(`${BASE}${url}`, { waitUntil: "networkidle" });
const tabs = async (p) => (await p.getByRole("navigation", { name: "App" }).getByRole("link").allInnerTexts().catch(() => [])).map((t) => t.trim());
const plainCopy = (t) => !/[—–]/.test(t) && !ALCOHOL.test(t) && !/\$\d/.test(t);

// ---------- Signed out
await go(m, "/app");
await m.evaluate(() => localStorage.clear());
await m.reload({ waitUntil: "networkidle" });
check("signed out: landing screen", await m.getByTestId("landing").isVisible());
const landing = await m.text();
check("landing: one line, Create account, Sign in, I'm a business", landing.includes("Two-for-one at hand-picked places across Toronto and the GTA.") && (await m.getByRole("link", { name: "Create account" }).count()) === 1 && (await m.getByRole("link", { name: "Sign in", exact: true }).count()) === 1 && (await m.getByRole("link", { name: "I'm a business" }).count()) === 1);
check("landing: no tab bar, plain copy", (await tabs(m)).length === 0 && plainCopy(landing));
await m.shot("01-landing");

// Guards
for (const [url, want, name] of [
  ["/app/pass", /\/app\/account\/sign-in\?next=%2Fapp%2Fpass$/, "My pass needs a member login"],
  ["/app/redeem/kaito", /\/app\/account\/sign-in\?next=%2Fapp%2Fredeem%2Fkaito$/, "Redeem needs a member login"],
  ["/app/account", /\/app\/account\/sign-in\?next=/, "Account needs a member login"],
  ["/app/owner", /\/app\/business\?next=%2Fapp%2Fowner$/, "Owner dashboard needs a business login"],
  ["/app/business/scan", /\/app\/business\?next=%2Fapp%2Fbusiness%2Fscan$/, "Scan needs a business login"],
  ["/app/business/team", /\/app\/business\?next=/, "Team needs a business login"],
]) {
  await go(m, url);
  check(`guard: ${name}`, await until(async () => want.test(m.url())), m.url());
}
await go(m, "/app/place/kaito");
check("signed out: a place page opens, Redeem asks to sign in", (await m.getByRole("button", { name: "Sign in to redeem" }).count()) === 1);
await go(m, "/app");
await m.getByRole("button", { name: "Look around first" }).click();
check("look around first: Explore with Sign in, no account", (await m.getByTestId("hero").count()) === 1 && (await m.getByRole("link", { name: "Sign in", exact: true }).count()) === 1);
await m.evaluate(() => sessionStorage.clear());

// ---------- Sign up
await go(m, "/app/account/sign-up");
await m.getByLabel("Email").fill("not-an-email");
await m.getByLabel("Password", { exact: true }).fill("short");
await m.getByRole("button", { name: "Create account" }).click();
const errs = await m.getByTestId("field-error").allInnerTexts();
check("sign up: inline errors for email and password", errs.some((e) => /email like/.test(e)) && errs.some((e) => /8 characters/.test(e)), errs.join(" | "));
check("sign up: fields have the right autofill", (await m.getByLabel("Email").getAttribute("autocomplete")) === "email" && (await m.getByLabel("Password", { exact: true }).getAttribute("autocomplete")) === "new-password" && (await m.getByLabel("Email").getAttribute("type")) === "email");
await m.getByRole("button", { name: "Show password" }).click();
check("sign up: show password", (await m.getByLabel("Password", { exact: true }).getAttribute("type")) === "text");
await m.getByLabel("Email").fill("alex@example.com");
await m.getByLabel("Password", { exact: true }).fill("longenough1");
await m.getByRole("button", { name: "Create account" }).click();
check("sign up: an email already used is refused", await until(async () => (await m.getByTestId("form-error").innerText()).includes("already an account")));
await m.getByLabel("Email").fill("Riley.New@Example.com");
await m.getByLabel("Password", { exact: true }).fill("tuesday-night-7");
await m.shot("02-sign-up");
await m.getByRole("button", { name: "Create account" }).click();
check("sign up: goes to setup, step 1 of 3", await until(async () => /\/app\/account\/setup/.test(m.url()) && (await m.getByTestId("setup-step").innerText()) === "Step 1 of 3"), m.url());
await m.getByLabel("First name").fill("Riley");
await m.shot("03-setup-name");
await m.getByRole("button", { name: "Next" }).click();
await m.getByLabel("Home").selectOption("Leslieville");
await m.getByLabel("Work").selectOption("Financial District");
await m.shot("04-setup-areas");
await m.getByRole("button", { name: "Next" }).click();
check("setup: notifications asked in one line", await until(async () => (await m.text()).includes("A short note when a place opens near you.")));
await m.shot("05-setup-notify");
await m.getByRole("button", { name: "Not now" }).click();
check("setup done: Explore with tabs Explore and My pass", await until(async () => /\/app$/.test(m.url()) && (await m.getByTestId("hero").count()) === 1) && JSON.stringify(await tabs(m)) === JSON.stringify(["Explore", "My pass"]), JSON.stringify(await tabs(m)));
await go(m, "/app/pass");
const riley = await m.text();
check("new member's pass: their name, a new number, no visits yet", (await m.getByTestId("card-name").innerText()) === "Riley" && /no\. 04\d\d/i.test(riley) && riley.includes("No visits yet") && riley.includes("Leslieville"), riley.slice(0, 600));
check("new member's pass: email, no other member's history", riley.includes("riley.new@example.com") && !riley.includes("Kaito"));

// Session survives closing the app
const m2 = watch(await ctx.newPage(), "member-restart");
await go(m2, "/app/pass");
check("session kept after a restart (new tab)", (await m2.getByTestId("card-name").innerText().catch(() => "")) === "Riley");
await m2.close();

// Profile edit
await go(m, "/app/account");
await m.getByLabel("First name").fill("Riles");
await m.getByRole("button", { name: "Save changes" }).click();
check("account: name saved", await until(async () => (await m.text()).includes("Saved.")));
await go(m, "/app/pass");
check("account: pass shows the new name", (await m.getByTestId("card-name").innerText()) === "Riles");

// Sign out
await m.getByRole("button", { name: "Sign out" }).click();
check("sign out: back to the landing screen", await until(async () => /\/app$/.test(m.url()) && (await m.getByTestId("landing").count()) === 1), m.url());

// Wrong password, then sign in and land where you were going
await go(m, "/app/pass");
await m.waitForURL(/sign-in/);
await m.getByLabel("Email").fill("riley.new@example.com");
await m.getByLabel("Password", { exact: true }).fill("wrong-password");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
check("wrong password: plain message", await until(async () => (await m.getByTestId("form-error").innerText()).includes("don't match")));
await m.shot("06-sign-in-error");
await m.getByLabel("Password", { exact: true }).fill("tuesday-night-7");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
check("sign in: lands on My pass (next=)", await until(async () => /\/app\/pass$/.test(m.url())), m.url());
await m.getByRole("button", { name: "Sign out" }).click();
await m.waitForURL(/\/app$/);

// Emailed code
await go(m, "/app/account/sign-in");
await m.getByRole("button", { name: "Email me a sign-in code" }).click();
await m.getByLabel("Email").fill("riley.new@example.com");
await m.getByRole("button", { name: "Send code" }).click();
await until(async () => /Your code is \d{6}/.test(await m.text()));
const demoCode = /Your code is (\d{6})/.exec(await m.text())?.[1];
check("code sign-in: demo shows the code on screen (no email sent)", !!demoCode);
check("code field: one-time-code autofill, number pad", (await m.getByLabel("6-digit code").getAttribute("autocomplete")) === "one-time-code" && (await m.getByLabel("6-digit code").getAttribute("inputmode")) === "numeric");
await m.getByLabel("6-digit code").fill(demoCode === "000000" ? "111111" : "000000");
await m.getByRole("button", { name: "Continue" }).click();
check("code sign-in: a wrong code is refused", await until(async () => (await m.getByTestId("field-error").innerText()).includes("didn't work")));
await m.getByLabel("6-digit code").fill(demoCode);
await m.shot("07-sign-in-code");
await m.getByRole("button", { name: "Continue" }).click();
check("code sign-in: signed in", await until(async () => /\/app$/.test(m.url()) && (await m.getByTestId("hero").count()) === 1), m.url());
await m.getByRole("link", { name: "My pass" }).click();
await m.getByRole("button", { name: "Sign out" }).click();
await m.waitForURL(/\/app$/);

// Forgot password
await go(m, "/app/account/forgot");
await m.getByLabel("Email").fill("alex@example.com");
await m.getByRole("button", { name: "Send reset link" }).click();
check("forgot password: the demo explains no email is sent", await until(async () => (await m.getByTestId("forgot-done").innerText()).includes("no email is sent")));

// Sign in as the demo member for the visits below
await go(m, "/app/account/sign-in");
check("sign in screen: demo accounts labelled", (await m.getByTestId("demo-note").innerText()).includes("Demo"));
await m.getByRole("button", { name: "Fill in" }).click();
await m.shot("08-sign-in");
const signInText = await m.text();
check("sign in screen: plain copy, no Apple or Google buttons we can't wire", plainCopy(signInText) && !/Apple|Google/.test(signInText));
const smallTargets = await m.evaluate(() => [...document.querySelectorAll("#app-frame button, #app-frame a, #app-frame input")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40; }).map((e) => e.textContent.trim() || e.getAttribute("aria-label")));
check("sign in screen: tap targets at least 40px", smallTargets.length === 0, smallTargets.join(" | "));
await m.getByRole("button", { name: "Sign in", exact: true }).click();
await m.waitForURL(/\/app$/);

// ---------- Business login: owner
const o = watch(await ctx.newPage(), "owner");
await go(o, "/app/business");
check("partner login is its own entry (for Business)", /for business/i.test(await o.text()) && (await o.text()).includes("Partner login"));
await o.shot("09-partner-login");
await o.getByLabel("Email").fill("alex@example.com");
await o.getByLabel("Password", { exact: true }).fill("demo1234");
await o.getByRole("button", { name: "Sign in", exact: true }).click();
check("a member login can't open the business side", await until(async () => (await o.getByTestId("form-error").innerText()).includes("isn't linked to a business")));
await o.getByRole("button", { name: "Fill in owner" }).click();
await o.getByRole("button", { name: "Sign in", exact: true }).click();
check("owner with two places: choose a place", await until(async () => /\/app\/business\/places/.test(o.url()) && (await o.getByTestId("pick-place").count()) === 2), o.url());
await o.shot("10-choose-place");
await o.getByTestId("pick-place").first().click();
check("owner lands on the dashboard", await until(async () => /\/app\/owner$/.test(o.url())));
await until(async () => (await tabs(o)).length === 4);
check("owner tabs: Dashboard, Scan, Today, Team", JSON.stringify(await tabs(o)) === JSON.stringify(["Dashboard", "Scan", "Today", "Team"]), JSON.stringify(await tabs(o)));
const dash = await o.text();
check("dashboard: the owner's place, no costs or terms, no sample numbers", dash.includes("Lantern House") && !/\$0|You pay|commission|no fees|What it costs|days' notice|Sample month/i.test(dash));
await o.shot("11-owner-dashboard");
await o.getByRole("button", { name: /^Uses per member/ }).click();
await o.getByRole("button", { name: "More uses" }).click();
await o.getByRole("button", { name: "Done" }).click();
await go(m, "/app/place/lantern-house");
check("owner's change reaches members: 3 uses a year", /3 of 3 left this year/.test(await m.text()));

// Team: invite a new staff member
await o.getByRole("link", { name: "Team" }).click();
await o.waitForURL(/team$/);
check("team lists owner and staff", await until(async () => { const t = await o.getByTestId("team").innerText(); return t.includes("owner@partner.example (you)") && t.includes("staff@partner.example"); }));
await o.getByLabel("Their email").fill("Casey@Partner.example");
await o.getByRole("button", { name: "Send invite" }).click();
check("invite sent (demo says no email is sent)", await until(async () => (await o.getByTestId("invite-sent").innerText()).includes("Demo: no email is sent")));
check("invite listed as Invited", (await o.getByTestId("team").innerText()).includes("casey@partner.example") && (await o.getByTestId("team").innerText()).includes("Invited"));
await o.shot("12-team");
check("the last owner can't be removed by anyone (only owner has no Remove on self)", (await o.getByRole("button", { name: "Remove owner@partner.example" }).count()) === 0);
await o.getByRole("button", { name: "Sign out" }).click();
await o.waitForURL(/\/app\/business$/);

// The new staff member sets up their login from the invite
await go(o, "/app/business/join");
await o.getByLabel("Email").fill("someone-else@partner.example");
await o.getByLabel("Choose a password").fill("hoststand-22");
await o.getByRole("button", { name: "Create login" }).click();
check("join: an email with no invite is refused", await until(async () => (await o.getByTestId("form-error").innerText()).includes("no invite")));
await o.getByLabel("Email").fill("casey@partner.example");
await o.getByRole("button", { name: "Create login" }).click();
check("join: staff signs in and picks a place", await until(async () => /\/app\/business\/places/.test(o.url())), o.url());
await o.getByTestId("pick-place").first().click();
check("staff lands straight on Scan", await until(async () => /\/app\/business\/scan$/.test(o.url())), o.url());
await until(async () => (await tabs(o)).length === 2);
check("staff tabs: Scan and Today only", JSON.stringify(await tabs(o)) === JSON.stringify(["Scan", "Today"]), JSON.stringify(await tabs(o)));
check("staff footer says Staff", (await o.getByTestId("partner-role").innerText()).startsWith("Staff"));
await o.shot("13-staff-scan");
await go(o, "/app/owner");
check("staff can't open the owner dashboard", await until(async () => (await o.getByTestId("not-owner").count()) === 1));
await o.shot("14-staff-not-owner");
await go(o, "/app/business/team");
check("staff can't open Team", await until(async () => (await o.getByTestId("not-owner").count()) === 1));
await go(o, "/app/business/scan");

// ---------- Redeem, scan, confirm
await go(m, "/app/place/lantern-house");
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/\/app\/redeem\/lantern-house$/);
const code1 = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
check("member: 6-digit code, QR and barcode, waiting for staff", /^\d{6}$/.test(code1) && (await until(async () => (await m.getByTestId("qr").locator("svg").count()) === 1)) && (await m.getByTestId("barcode").locator("rect").count()) > 20 && (await m.getByTestId("waiting-staff").isVisible()));
check("member: no Confirm button on a real member's phone", (await m.getByRole("button", { name: "Confirm", exact: true }).count()) === 0);
const qrWidth = await m.getByTestId("qr").evaluate((e) => e.offsetWidth);
check("member: QR big enough to scan from a phone (at least 200px)", qrWidth >= 200, `${qrWidth}`);
await m.shot("15-pass-qr");

const typeCode = async (c) => {
  await o.getByLabel("Or type the code").fill(c);
  await o.getByRole("button", { name: "Confirm", exact: true }).click();
  await until(async () => (await o.getByTestId("result").count()) === 1);
  return (await o.getByTestId("result").getAttribute("data-result")) ?? "";
};
check("staff: a made-up code is not valid", (await typeCode(code1 === "123456" ? "654321" : "123456")) === "unknown");
await o.shot("16-scan-not-valid");
check("staff: the real code is Confirmed", (await typeCode(code1)) === "ok");
const ok1 = await o.getByTestId("result").innerText();
check("confirmed shows the offer, the member's first name and uses left", ok1.includes("Second main, on us.") && ok1.includes("For Alex") && ok1.includes("2 of 3 uses left"), ok1);
await o.shot("17-scan-confirmed");
check("member flips to Redeemed by itself", await until(async () => (await m.locator("#app-frame").innerText()).includes("Confirmed by staff")));
await m.shot("18-member-redeemed");
check("staff: the same code again is Already used", (await typeCode(code1)) === "used");
await o.shot("19-scan-used");
check("staff: Today shows the visit with the member's name", (await o.getByTestId("staff-visits").innerText()).includes("Alex"));

// Wrong place
await go(m, "/app/place/fennel-ash");
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/redeem\/fennel-ash/);
const codeF = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
await go(o, "/app/business/scan");
check("staff at Lantern House: a Fennel & Ash code is Not for this place", (await typeCode(codeF)) === "wrong-place");
await m.getByRole("button", { name: "Close" }).click();

// Expired
await go(m, "/app/place/lantern-house");
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/redeem\/lantern-house/);
const code2 = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
await ctx.clock.fastForward("11:00");
check("member: the code shows as expired after 10 minutes", await until(async () => /code expired/i.test(await m.locator("#app-frame").innerText())));
await go(o, "/app/business/scan");
check("staff: an expired code is refused", (await typeCode(code2)) === "expired");
await o.shot("20-scan-expired");

// Uses count down to zero
const redeemAndConfirm = async () => {
  await go(m, "/app/place/lantern-house");
  await m.getByRole("button", { name: "Redeem", exact: true }).click();
  await m.waitForURL(/redeem\/lantern-house/);
  const c = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
  await go(o, "/app/business/scan");
  return typeCode(c);
};
check("second visit confirmed", (await redeemAndConfirm()) === "ok" && (await o.getByTestId("result").innerText()).includes("1 of 3 uses left"));
check("third visit confirmed: 0 of 3 left", (await redeemAndConfirm()) === "ok" && (await o.getByTestId("result").innerText()).includes("0 of 3 uses left"));
await go(m, "/app/place/lantern-house");
check("member: used up, no Redeem", (await m.getByRole("button", { name: "Redeem", exact: true }).count()) === 0 && (await m.text()).includes("used this one for the year"));

// History on My pass
await go(m, "/app/pass");
const hist = await m.getByTestId("history").innerText();
check("My pass: the three new visits at Lantern House, marked Today", (hist.match(/Lantern House/g) ?? []).length >= 3 && hist.includes("Today"));
await m.shot("21-my-pass");

// Owner sees the visits on the dashboard
await o.getByRole("button", { name: "Sign out" }).click();
await o.waitForURL(/\/app\/business$/);
await o.getByRole("button", { name: "Fill in owner" }).click();
await o.getByRole("button", { name: "Sign in", exact: true }).click();
await o.waitForURL(/\/app\/(owner|business\/places)/);
if (/places/.test(o.url())) await o.getByTestId("pick-place").first().click();
await o.waitForURL(/\/app\/owner$/);
check("owner dashboard: 3 visits, with the member's name", await until(async () => (await o.getByTestId("visit-count").innerText()) === "3" && (await o.getByTestId("visits").innerText()).includes("Alex")));
await o.getByRole("link", { name: "Today" }).click();
check("owner Today: 3 member visits so far", await until(async () => (await o.getByTestId("today-count").innerText()).startsWith("3 member visits")));
await o.shot("22-owner-today");

// ---------- Camera: a second browser with a fake camera showing the member's QR
await go(m, "/app/place/fennel-ash");
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/redeem\/fennel-ash/);
const code3 = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "t6p-cam-"));
await QR.toFile(`${tmp}/qr.png`, `T6P:${code3}`, { width: 640, margin: 4 });
// Two seconds of an empty host stand, then the member's screen: time for a screenshot of the viewfinder first.
execFileSync("ffmpeg", ["-loglevel", "error", "-f", "lavfi", "-i", "color=c=0x3a342d:s=640x640:d=2:r=10", "-loop", "1", "-t", "3", "-i", `${tmp}/qr.png`, "-filter_complex", "[1]scale=640:640,fps=10[q];[0][q]concat=n=2:v=1,format=yuv420p", `${tmp}/qr.y4m`]);
const store = await m.evaluate(() => ({ ...localStorage }));
// The camera phone is the place's phone: same device storage, but nobody signed in on the business side yet.
store.t6p_sessions_v1 = JSON.stringify({ ...JSON.parse(store.t6p_sessions_v1), partner: undefined });
const camBrowser = await chromium.launch({ executablePath: CHROME, args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-video-capture=${tmp}/qr.y4m`] });
const camCtx = await camBrowser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, permissions: ["camera"] });
// Same device storage as the member's phone (the demo accounts live in the browser).
await camCtx.addInitScript((s) => {
  if (sessionStorage.getItem("seeded")) return;
  sessionStorage.setItem("seeded", "1");
  for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
}, store);
const c = watch(await camCtx.newPage(), "camera");
await go(c, "/app/business");
await c.getByRole("button", { name: "Fill in staff" }).click();
await c.getByRole("button", { name: "Sign in", exact: true }).click();
await c.waitForURL(/places|scan/);
if (/places/.test(c.url())) await c.getByTestId("pick-place").nth(1).click();
check("camera: scan opens straight to the camera with a viewfinder", await until(async () => (await c.getByTestId("scanner").count()) === 1 && (await c.locator(".viewfinder").count()) === 1));
await c.waitForTimeout(500);
if (SHOTS && (await c.getByTestId("scanner").count())) await c.locator("#app-frame").screenshot({ path: `${SHOTS}/23-scanner-camera.png` });
check("camera: scanning the QR confirms it", await until(async () => (await c.getByTestId("result").getAttribute("data-result")) === "ok", 20000), await c.getByTestId("result").innerText().catch(() => "no result"));
await c.shot("24-scanner-confirmed");
await c.getByRole("button", { name: "Scan next" }).click();
check("camera: Scan next opens the camera again, and the same QR is Already used", await until(async () => (await c.getByTestId("result").getAttribute("data-result")) === "used", 20000));
await camBrowser.close();
fs.rmSync(tmp, { recursive: true, force: true });

// ---------- Delete account
await m.getByRole("button", { name: "Close" }).click().catch(() => {});
await go(m, "/app/pass");
await m.getByRole("button", { name: "Sign out" }).click();
await m.waitForURL(/\/app$/);
await go(m, "/app/account/sign-in");
await m.getByLabel("Email").fill("riley.new@example.com");
await m.getByLabel("Password", { exact: true }).fill("tuesday-night-7");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
await m.waitForURL(/\/app$/);
await go(m, "/app/account");
await m.getByRole("button", { name: "Delete account" }).click();
check("delete: asks first, in plain words", (await m.getByRole("dialog").innerText()).includes("can't be undone"));
await m.shot("25-delete-account");
await m.getByRole("button", { name: "Delete my account" }).click();
check("delete: back to the landing screen", await until(async () => (await m.getByTestId("landing").count()) === 1));
await go(m, "/app/account/sign-in");
await m.getByLabel("Email").fill("riley.new@example.com");
await m.getByLabel("Password", { exact: true }).fill("tuesday-night-7");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
check("delete: the account is gone", await until(async () => (await m.getByTestId("form-error").innerText()).includes("don't match")));

// ---------- The meeting demo needs no login
const d = watch(await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage(), "meeting");
await go(d, "/partners-demo");
check("meeting demo: start screen opens with no login", (await d.getByRole("link", { name: "Set up a place" }).count()) === 1);
await d.getByRole("link", { name: "Start demo with example places" }).click();
check("meeting demo: Start demo opens Explore with the Owner tab", await until(async () => /\/app$/.test(d.url()) && (await tabs(d)).includes("Owner")));
await go(d, "/app/place/kaito");
await d.getByRole("button", { name: "Redeem", exact: true }).click();
check("meeting demo: staff line and Confirm on the member's phone", await until(async () => (await d.getByText("Check the code matches, then tap Confirm. No scanner, no app, no login at the host stand.").count()) === 1));
await d.getByRole("button", { name: "Confirm", exact: true }).click();
check("meeting demo: redeemed", await until(async () => (await d.locator("#app-frame").innerText()).includes("Redeemed.")));

// ---------- Copy and accessibility on the new screens
const e = watch(await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage(), "copy");
for (const url of ["/app/account/sign-up", "/app/business", "/app/business/join", "/app/account/forgot"]) {
  await go(e, url);
  const t = await e.text();
  check(`${url}: plain copy (no em dashes, prices or alcohol)`, plainCopy(t));
  check(`${url}: one h1, every input labelled`, (await e.locator("#app-frame h1").count()) === 1 && (await e.evaluate(() => [...document.querySelectorAll("#app-frame input, #app-frame select")].every((i) => i.labels?.length || i.getAttribute("aria-label")))));
}

check("no page errors", errors.length === 0, errors.slice(0, 4).join(" | "));
await browser.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
