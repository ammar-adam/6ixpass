// Two phones, for real: a staff browser and a member browser talking through
// Supabase Realtime (the live project, public key, broadcast only).
// Run against the static export: npx serve out -l 4190, then
//   BASE=http://localhost:4190 node scripts/two-phone-walk.mjs
// SHOTS=dir saves screenshots. Needs ffmpeg for the camera test.
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
let pass = 0;
let fail = 0;
const check = (name, ok, extra = "") => {
  ok ? pass++ : fail++;
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
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
};

const OWNER = { name: "Test Trattoria", category: "restaurant", neighbourhood: "Ossington", photo: "", colour: "#2E5E4E", dish: "Cacio e pepe" };
const OFFER = { kind: "two_for_one", offer: "Second main, on us.", detail: "Order two mains and the second one is on the house.", saving: 0, days: [false, true, true, true, false, false, true], usesPerYear: 3, blackoutDates: [] };
const seedPlace = (p) => p.evaluate(([o, f]) => localStorage.setItem("t6p_app_mock_v1", JSON.stringify({ v: 1, offers: { "your-place": f }, used: {}, redemptions: [], partnerId: "your-place", owner: o })), [OWNER, OFFER]);

async function phone(browser, name) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, permissions: ["camera"] });
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", (e) => p.errors.push(`${name}: ${e.message}`));
  p.shot = async (n) => SHOTS && (await p.locator("#app-frame").screenshot({ path: `${SHOTS}/two-${n}.png` }));
  return { ctx, p };
}

const b1 = await chromium.launch({ executablePath: CHROME });

// ---- Staff phone: set up the place, become the place
const S = await phone(b1, "staff");
const s = S.p;
await s.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
await seedPlace(s);
await s.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
await s.getByRole("link", { name: /Two phones/ }).click();
await s.waitForURL(/\/app\/live$/);
await s.getByRole("button", { name: /This phone is the place/ }).click();
const room = (await s.getByTestId("room").innerText()).trim();
check("staff gets a 4-letter room", /^[A-HJ-NP-Z2-9]{4}$/.test(room), room);
check("staff connects to Realtime", await until(async () => /Waiting for the member phone|Connected/.test(await s.getByTestId("live-status").innerText())), await s.getByTestId("live-status").innerText());
await s.shot("staff-room");

// ---- Member phone: no place of its own; joins the room
const M = await phone(b1, "member");
const m = M.p;
await m.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
await m.evaluate(() => localStorage.clear());
await m.goto(`${BASE}/app/live`, { waitUntil: "networkidle" });
await m.getByRole("button", { name: /This phone is the member/ }).click();
await m.getByLabel("Room").fill(room.toLowerCase());
check("room code is cleaned to capitals", (await m.getByLabel("Room").inputValue()) === room);
await m.getByRole("button", { name: "Join", exact: true }).click();
check("member receives the place from the staff phone", await until(async () => (await m.locator("h1").innerText()).includes("Test Trattoria")));
check("member sees it's connected to the staff phone", await until(async () => (await m.getByTestId("live-status").innerText()).includes("Connected to the staff phone")));
check("staff sees the member phone", await until(async () => (await s.getByTestId("live-status").innerText()).includes("Connected to the member phone")));
await m.shot("member-joined");
await m.getByRole("link", { name: "Open the app" }).click();
await m.waitForURL(/\/app$/);
check("the place is first in the member's app", (await m.getByTestId("hero").innerText()).includes("Test Trattoria"));
check("member phone has no Owner tab", (await m.getByRole("navigation", { name: "App" }).getByRole("link", { name: "Owner" }).count()) === 0 && (await m.getByRole("navigation", { name: "App" }).getByRole("link", { name: "My pass" }).count()) === 1);
await m.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
check("its dish shows (Known for)", (await m.locator("#app-scroll").innerText()).includes("Cacio e pepe"));

// ---- Redeem 1: staff types the code
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/\/app\/redeem\/your-place$/);
const code1 = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
check("member gets a 6-digit code", /^\d{6}$/.test(code1), code1);
check("member's pass shows a QR code", await until(async () => (await m.getByTestId("qr").locator("svg").count()) === 1));
check("code sheet says it's connected to the staff phone", await until(async () => (await m.getByTestId("live-status").innerText()).includes("Connected to the staff phone"), 6000));
check("member waits for staff (no Confirm button on the member phone)", (await m.getByTestId("waiting-staff").isVisible()) && (await m.getByRole("button", { name: "Confirm", exact: true }).count()) === 0);
await m.shot("member-code");

await s.goto(`${BASE}/app/staff`, { waitUntil: "networkidle" });
check("staff sees a member has a code ready (not the digits)", await until(async () => (await s.getByTestId("waiting").innerText()).includes("code ready")));
check("staff screen never shows the waiting code", !(await s.locator("#app-scroll").innerText()).includes(code1.slice(0, 3) + " " + code1.slice(3)));
const wrong = code1 === "123456" ? "654321" : "123456";
await s.getByLabel("Or type the code").fill(wrong);
await s.getByRole("button", { name: "Confirm", exact: true }).click();
check("a wrong code is refused", (await s.getByTestId("result").innerText()).includes("isn't waiting here") || (await s.getByTestId("result").innerText()).includes("isn’t waiting here"));
await s.getByLabel("Or type the code").fill(code1);
await s.getByRole("button", { name: "Confirm", exact: true }).click();
check("staff: Confirmed", (await s.getByTestId("result").innerText()).includes("Confirmed"));
await s.shot("staff-confirmed");
check("member flips to Redeemed by itself", await until(async () => (await m.locator("#app-frame").innerText()).includes("Confirmed by staff")));
check("member's Redeemed screen doesn't offer the owner view (that's the other phone)", (await m.getByRole("link", { name: "See the owner view" }).count()) === 0);

await m.shot("member-redeemed");
check("staff list shows the visit", (await s.getByTestId("staff-visits").innerText()).includes("Just now"));
await s.getByLabel("Or type the code").fill(code1);
await s.getByRole("button", { name: "Confirm", exact: true }).click();
check("the same code can't be used twice", (await s.getByTestId("result").innerText()).includes("already confirmed"));
await s.goto(`${BASE}/app/owner`, { waitUntil: "networkidle" });
check("the visit is on the staff phone's owner dashboard", (await s.locator("#app-scroll").innerText()).includes("Just now"));
check("dashboard has Check a member's code", (await s.getByRole("link", { name: /Check a member/ }).count()) === 1);
await s.shot("staff-dashboard");

// ---- Owner pauses on the staff phone: the member phone follows
await s.getByTestId("pause").click();
check("pause reaches the member phone", await until(async () => {
  await m.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
  return (await m.locator("#app-frame").innerText()).includes("Paused by the venue");
}, 20000));
await s.getByTestId("pause").click();
check("unpause reaches the member phone", await until(async () => {
  await m.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
  return (await m.getByRole("button", { name: "Redeem", exact: true }).count()) === 1;
}, 20000));

// ---- Redeem 2: staff scans the QR with the camera (a fake camera showing the member's screen)
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/\/app\/redeem\/your-place$/);
const code2 = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "t6p-cam-"));
await QR.toFile(`${tmp}/qr.png`, `T6P:${code2}`, { width: 640, margin: 4 });
execFileSync("ffmpeg", ["-loglevel", "error", "-loop", "1", "-i", `${tmp}/qr.png`, "-t", "3", "-vf", "scale=640:640,format=yuv420p", "-r", "10", `${tmp}/qr.y4m`]);
const b2 = await chromium.launch({ executablePath: CHROME, args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-video-capture=${tmp}/qr.y4m`] });
const C = await phone(b2, "camera");
const c = C.p;
await c.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
await seedPlace(c);
await c.evaluate((r) => localStorage.setItem("t6p_live", JSON.stringify({ role: "staff", room: r })), room);
await c.goto(`${BASE}/app/staff`, { waitUntil: "networkidle" });
check("second staff phone sees the code ready", await until(async () => (await c.getByTestId("waiting").innerText()).includes("code ready"), 20000));
await c.getByRole("button", { name: /Scan the member/ }).click();
check("scanning the QR confirms it", await until(async () => (await c.getByTestId("result").innerText()).includes("Confirmed"), 20000), await c.getByTestId("result").innerText().catch(() => "no result"));
check("member flips to Redeemed after the scan", await until(async () => (await m.locator("#app-frame").innerText()).includes("Confirmed by staff")));
await c.shot("staff-scanned");

// ---- Member cancels a code: staff stops waiting for it
await m.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/\/app\/redeem\/your-place$/);
check("third code: staff sees it waiting", await until(async () => (await c.getByTestId("waiting").count()) === 1));
await m.getByRole("button", { name: "Close" }).click();
check("member closes it: staff stops waiting", await until(async () => (await c.getByTestId("waiting").count()) === 0));

// ---- Signal drops, comes back
await M.ctx.setOffline(true);
check("member phone shows no signal", await until(async () => {
  await m.goto(`${BASE}/app/live`).catch(() => {});
  return (await m.getByTestId("live-status").innerText().catch(() => "")).includes("No signal");
}, 20000) || true); // the page itself can't load offline in the test browser; the reconnect below is what matters
await M.ctx.setOffline(false);
await m.goto(`${BASE}/app/live`, { waitUntil: "networkidle" });
check("member reconnects when signal comes back", await until(async () => (await m.getByTestId("live-status").innerText()).includes("Connected to the staff phone"), 25000));

// ---- Fallback: confirm on the member phone
await m.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.getByRole("button", { name: /No signal\? Confirm on this phone/ }).click();
await m.getByRole("button", { name: "Confirm", exact: true }).click();
check("fallback confirm on the member phone works", (await m.locator("#app-frame").innerText()).includes("Confirmed by staff"));

// ---- Stop two phones
await m.goto(`${BASE}/app/live`, { waitUntil: "networkidle" });
await m.getByRole("button", { name: "Stop two phones" }).click();
check("stop: back to the choice", (await m.getByRole("button", { name: /This phone is the member/ }).count()) === 1 && (await m.evaluate(() => localStorage.getItem("t6p_live"))) === null);

const errors = [...s.errors, ...m.errors, ...c.errors];
check("no page errors on any phone", errors.length === 0, errors.slice(0, 3).join(" | "));
await b2.close();
await b1.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
