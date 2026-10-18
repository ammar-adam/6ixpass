// Full-page screenshots of /, /owners and /about at 1440 and 390 into docs/site/screens/.
//   BASE=http://localhost:4320 node scripts/site-page-shots.mjs
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const BASE = process.env.BASE || "http://localhost:4320";
const OUT = process.env.OUT || "docs/site/screens";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 844 }, deviceScaleFactor: w > 500 ? 1 : 2 });
  // No popup in the shots: pretend it was closed a moment ago.
  await ctx.addInitScript(() => { try { localStorage.setItem("t6p_popup_snooze_until", String(Date.now() + 1e9)); } catch {} });
  const p = await ctx.newPage();
  for (const [name, url] of [["home", "/"], ["owners", "/owners"], ["about", "/about"]]) {
    await p.goto(BASE + url, { waitUntil: "networkidle" });
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(250); }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(1500);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    const imgs = await p.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src));
    console.log(name, w, "scrollWidth", sw, "broken", imgs.join(" "));
    await p.addStyleTag({ content: "div.fixed.inset-x-0.bottom-0{display:none!important}" }); await p.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close();
