// The app screens on the website, shot fresh at 3x from a local build.
// Build and serve first (never shoot the live site):
//   npm run build && npx serve out -l 4320
//   BASE=http://localhost:4320 node scripts/site-shots.mjs
// Writes 1179x2556 PNG masters to docs/site/screens/app/ and
// public/preview/v2/<name>-{600,900,1179}.webp for the site.
//
// One visit, start to finish: Alex (demo member) at Fennel & Ash, served by
// the Fennel & Ash staff login. Demo-only text (Demo lines, demo emails,
// account cards, counts) is hidden before each shot, and every shot is
// checked for it again afterwards. The run fails if anything slips through.
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "node:fs";
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");

const BASE = process.env.BASE || "http://localhost:4320";
const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const MASTERS = "docs/site/screens/app";
const WEB = "public/preview/v2";
fs.mkdirSync(MASTERS, { recursive: true });
fs.mkdirSync(WEB, { recursive: true });

// Text that must never be in a screenshot on the website.
const BANNED = /Demo|example\.com|partner\.example|Partner Group|\bnearby\b|How a month could look|Sample month|\$0|You pay|commission|no fees|What it costs|12 months|days' notice|days’ notice|Founding Partners get|Switch place|Sign out/i;

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

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
await ctx.clock.install();
// iPhone safe area: the app pads with --top and --bottom.
await ctx.addInitScript(() => {
  const s = document.createElement("style");
  s.textContent = ".app-mock{--top:54px!important;--bottom:28px!important}";
  document.addEventListener("DOMContentLoaded", () => document.head.appendChild(s));
});
const go = (p, url) => p.goto(`${BASE}${url}`, { waitUntil: "networkidle" });

/** Hide demo-only text and draw a 9:41 status bar. */
async function dress(p, light) {
  await p.evaluate((light) => {
    const frame = document.getElementById("app-frame");
    // The account card at the bottom of business screens.
    document.querySelector('[data-testid="partner-role"]')?.closest(".m")?.setAttribute("hidden", "");
    document.querySelector('[data-testid="redeem-demo-hint"]')?.setAttribute("hidden", "");
    frame.querySelectorAll(".t-sub").forEach((el) => /\bnearby\b/.test(el.textContent) && (el.style.visibility = "hidden"));
    const bad = /^(You saved about|Demo\b|.*\d+ nearby$|.*@(example\.com|partner\.example))/;
    const walk = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
    const hide = [];
    while (walk.nextNode()) if (bad.test(walk.currentNode.textContent.trim())) hide.push(walk.currentNode.parentElement);
    hide.forEach((el) => (el.style.display = "none"));
    document.getElementById("shot-status")?.remove();
    const bar = document.createElement("div");
    bar.id = "shot-status";
    bar.setAttribute("aria-hidden", "true");
    bar.style.cssText = `position:absolute;left:0;right:0;top:0;height:54px;z-index:9999;display:flex;align-items:center;justify-content:space-between;padding:6px 32px 0 44px;font:600 17px/1 -apple-system,"SF Pro Text",Inter,system-ui,sans-serif;letter-spacing:-0.01em;color:${light ? "#fff" : "#16140F"};pointer-events:none;${light ? "background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.2) 75%,rgba(0,0,0,0))" : ""}`;
    bar.innerHTML = `<span style="font-variant-numeric:tabular-nums">9:41</span><span style="display:flex;align-items:center;gap:7px"><svg width="19" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="17" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 4.2a10 10 0 0 1 14 0M3.6 6.9a6.3 6.3 0 0 1 8.8 0"/><circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4"/><rect x="2.5" y="2.5" width="19" height="8" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span>`;
    frame.appendChild(bar);
  }, light);
}

const shots = [];
async function shoot(p, name, light) {
  await dress(p, light);
  await p.waitForTimeout(400);
  // Check what is visible in the viewport only (hidden and off-screen text does not show).
  const seen = await p.evaluate(() => {
    const out = [];
    const walk = document.createTreeWalker(document.getElementById("app-frame"), NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const el = walk.currentNode.parentElement;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.bottom > 0 && r.top < innerHeight && r.width > 0 && cs.visibility !== "hidden" && !el.closest("[hidden]")) out.push(walk.currentNode.textContent.trim());
    }
    return out.filter(Boolean).join(" | ");
  });
  const hit = BANNED.exec(seen);
  if (hit) throw new Error(`${name}: banned text in shot: "${hit[0]}"\n${seen}`);
  const file = `${MASTERS}/${name}.png`;
  await p.screenshot({ path: file });
  for (const w of [600, 900, 1179]) await sharp(file).resize(w).webp({ quality: 82 }).toFile(`${WEB}/${name}-${w}.webp`);
  shots.push(name);
  console.log(`shot ${name}: ${seen.slice(0, 160)}`);
}

// ---------- Landing, signed out
const m = await ctx.newPage();
await go(m, "/app");
await m.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await m.reload({ waitUntil: "networkidle" });
await m.getByTestId("landing").waitFor();
await m.waitForTimeout(600);
await shoot(m, "landing", true);

// ---------- Sign in as the demo member (Alex)
await go(m, "/app/account/sign-in");
await m.getByRole("button", { name: "Fill in" }).click();
await m.getByRole("button", { name: "Sign in", exact: true }).click();
await m.waitForURL(/\/app$/);
await m.getByTestId("hero").waitFor();
await m.waitForTimeout(800);
await shoot(m, "explore", false);

// ---------- Place
await go(m, "/app/place/fennel-ash");
await m.waitForTimeout(800);
// Bring the days line and uses left above the Redeem bar.
await m.evaluate(() => document.getElementById("app-scroll").scrollTo(0, 150));
await m.waitForTimeout(400);
await shoot(m, "place", true);

// ---------- Pass with QR and barcode
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/\/app\/redeem\/fennel-ash$/);
await until(async () => (await m.getByTestId("qr").locator("svg").count()) === 1);
const code = (await m.getByTestId("code").innerText()).replace(/\D/g, "");
await m.waitForTimeout(3200);
await shoot(m, "pass", true);

// ---------- Staff at Fennel & Ash scan it (types the code here)
const s = await ctx.newPage();
await go(s, "/app/business");
await s.getByRole("button", { name: "Fill in staff" }).click();
await s.getByRole("button", { name: "Sign in", exact: true }).click();
await s.waitForURL(/places|scan/);
if (/places/.test(s.url())) {
  const picks = s.getByTestId("pick-place");
  const n = await picks.count();
  for (let i = 0; i < n; i++) if ((await picks.nth(i).innerText()).includes("Fennel")) await picks.nth(i).click();
}
await s.waitForURL(/scan$/);
await s.getByLabel("Or type the code").fill(code);
await s.getByRole("button", { name: "Confirm", exact: true }).click();
await until(async () => (await s.getByTestId("result").getAttribute("data-result")) === "ok");
await s.getByLabel("Or type the code").fill("");
await s.evaluate(() => document.activeElement?.blur());
await s.waitForTimeout(600);
await shoot(s, "scan-confirmed", false);

// ---------- Member flips to Redeemed
await m.bringToFront();
await until(async () => (await m.locator("#app-frame").innerText()).includes("Confirmed by staff"));
await m.waitForTimeout(800);
await shoot(m, "redeemed", true);

// ---------- Owner view: the offer controls
const o = s;
await go(o, "/app/business/scan");
await o.getByRole("button", { name: "Sign out" }).click();
await o.waitForURL(/\/app\/business$/);
await o.getByRole("button", { name: "Fill in owner" }).click();
await o.getByRole("button", { name: "Sign in", exact: true }).click();
await o.waitForURL(/\/app\/(owner|business\/places)/);
if (/places/.test(o.url())) {
  const picks = o.getByTestId("pick-place");
  const n = await picks.count();
  for (let i = 0; i < n; i++) if ((await picks.nth(i).innerText()).includes("Lantern")) await picks.nth(i).click();
}
await o.waitForURL(/\/app\/owner$/);
await o.locator("#control-h").waitFor();
await o.evaluate(() => {
  const sc = document.getElementById("app-scroll");
  const h = document.getElementById("control-h");
  // Room below, so the offer list can sit near the top like a scrolled screen.
  sc.firstElementChild.style.paddingBottom = "420px";
  sc.scrollTo(0, h.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 112);
});
await o.waitForTimeout(600);
await shoot(o, "owner-offer", false);

await browser.close();
console.log(`\n${shots.length} screens: ${shots.join(", ")}`);
