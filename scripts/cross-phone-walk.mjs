// Demo accounts on two separate phones (two browsers that share nothing): a new
// business signs itself up, a member redeems on the other phone, and the staff
// phone confirms the code through the code relay (Supabase Realtime, public key,
// broadcast only; nothing is stored). Needs network access to Supabase.
//   npx serve out -l 4190, then BASE=http://localhost:4190 node scripts/cross-phone-walk.mjs
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://localhost:4190";
const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let pass = 0;
let fail = 0;
const check = (name, ok, extra = "") => {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${!ok && extra ? `  (${extra})` : ""}`);
};
const until = async (fn, ms = 15000) => {
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

const browser = await chromium.launch({ executablePath: CHROME });
const errors = [];
const phone = async (who) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(`${who}: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource/.test(m.text()) && !(process.env.NO_SW && /fetching the script/.test(m.text())) && errors.push(`${who}: ${m.text()}`));
  return p;
};
const go = (p, url) => p.goto(`${BASE}${url}`, { waitUntil: "networkidle" });

const o = await phone("business");
const m = await phone("member");

// ---------- A new business signs up
await go(o, "/app/business");
check("partner login offers a new business account", (await o.getByRole("link", { name: "New business? Create an account" }).count()) === 1);
await o.getByRole("link", { name: "New business? Create an account" }).click();
await o.waitForURL(/\/app\/business\/new$/);
await o.getByRole("button", { name: "Create account" }).click();
check("new business: asks for the business name first", await until(async () => (await o.locator("#app-scroll").innerText()).includes("Enter your business name.")));
await o.getByLabel("Business name").fill("Union Test Co");
await o.getByLabel("Your email").fill("Owner.Test@Example.com");
await o.getByLabel("Choose a password").fill("hoststand-77");
await o.getByRole("button", { name: "Create account" }).click();
check("new business: asks for the place", await until(async () => (await o.locator("#app-scroll").innerText()).includes("Choose your place.")));
const label = await o.getByLabel("Your place").locator("option").nth(1).innerText();
await o.getByLabel("Your place").selectOption({ label });
await o.getByRole("button", { name: "Create account" }).click();
check("new business: signed in as the owner, on the dashboard", await until(async () => /\/app\/owner$/.test(o.url())), o.url());

// Which place did they pick? The owner dashboard names it.
const placeName = label.split(",")[0];
await go(o, "/app/business/scan");
check("owner can open Scan for their place", await until(async () => (await o.locator("#app-scroll").innerText()).includes(placeName)));

// ---------- The member on the other phone redeems there
await go(m, "/app/account/sign-in");
await m.getByLabel("Email").fill("alex@example.com");
await m.getByLabel("Password", { exact: true }).fill("demo1234");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
await until(async () => /\/app$/.test(m.url()));
const placeId = await o.evaluate(() => JSON.parse(localStorage.getItem("t6p_accounts_v1")).businesses.find((b) => b.name === "Union Test Co").placeIds[0]);
await go(m, `/app/place/${placeId}`);
check("member opens the place", (await m.locator("#app-scroll").innerText()).includes(placeName), placeId);
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/\/app\/redeem\//);
const code = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
check("member has a 6-digit code", /^\d{6}$/.test(code), code);

const typeCode = async (c) => {
  await o.getByLabel("Or type the code").fill(c);
  await o.getByRole("button", { name: "Confirm", exact: true }).click();
  await until(async () => (await o.getByTestId("result").count()) === 1, 20000);
  const r = (await o.getByTestId("result").getAttribute("data-result")) ?? "";
  return r;
};
const t0 = Date.now();
check("staff phone confirms the member's code from the other phone", (await typeCode(code)) === "ok");
console.log(`  (took ${Date.now() - t0} ms)`);
const res = await o.getByTestId("result").innerText();
check("confirmed shows the offer and the member's first name", res.includes("For Alex"), res);
check("member's phone flips to Redeemed by itself", await until(async () => (await m.locator("#app-frame").innerText()).includes("Confirmed by staff")));
await o.getByRole("button", { name: "Scan next" }).click().catch(() => {});
check("the same code again is Already used", (await typeCode(code)) === "used");
await o.getByRole("button", { name: /Scan next|Try again/ }).click().catch(() => {});
check("a made-up code is not valid", (await typeCode(code === "123456" ? "654321" : "123456")) === "unknown");
await go(o, "/app/business/today");
check("the visit shows on the business phone", await until(async () => (await o.locator("#app-scroll").innerText()).includes("Alex")));

check("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
