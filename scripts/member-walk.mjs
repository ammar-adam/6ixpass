// Walks the member app the way a member would, on every demo place.
// Run against the static export: npx serve out -l 4190, then
//   BASE=http://localhost:4190 node --experimental-strip-types scripts/member-walk.mjs
// SHOTS=dir saves screenshots. NO_SW=1 skips the offline part (for the iPhone app's routing).
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import { PLACES } from "../src/demo/places.ts";

const BASE = process.env.BASE || "http://localhost:4190";
const SHOTS = process.env.SHOTS || "";
const ALCOHOL = /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?)\b/i;
let pass = 0;
let fail = 0;
const check = (name, ok, extra = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${!ok && extra ? `  (${extra})` : ""}`);
};

const browser = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

for (const width of [390, 1280]) {
  const T = `[${width}]`;
  const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 2, hasTouch: width === 390 });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  // NO_SW: the routing simulator blocks the offline worker like the iPhone app, so its 404 is expected there.
  p.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource/.test(m.text()) && !(process.env.NO_SW && /fetching the script/.test(m.text())) && errors.push(m.text()));
  const shot = async (name) => SHOTS && (await p.locator("#app-frame").screenshot({ path: `${SHOTS}/${width}-${name}.png` }));
  const text = () => p.locator("#app-scroll").innerText();
  // A fixed clock: Tuesday-looking demo, 6:15 pm, so dinner places are open.
  await p.clock.install({ time: new Date("2027-03-23T18:15:00") });

  // ---- Explore
  await p.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: "networkidle" });
  const rows = await p.getByTestId("places").locator("a").count();
  check(`${T} Explore lists every place (hero + list)`, rows + 1 === PLACES.length, `${rows + 1} of ${PLACES.length}`);
  check(`${T} Explore has no "examples" or demo words`, !/example|demo/i.test(await text()));
  await shot("explore");

  // Search finds dishes and neighbourhoods
  await p.getByRole("button", { name: "Search" }).click();
  const search = p.getByPlaceholder("Places, dishes, neighbourhoods");
  for (const [q, want] of [["ramen", "Kaito Noodle House"], ["pappardelle", "Fennel & Ash"], ["koobideh", "Little Saffron"], ["leslieville", "Linden Bakehouse"]]) {
    await search.fill(q);
    check(`${T} search "${q}" finds ${want}`, (await p.getByTestId("places").innerText().catch(() => "")).includes(want));
  }
  await search.fill("zzzz");
  check(`${T} search with no match says so`, (await text()).includes("Nothing here yet"));
  await p.getByRole("button", { name: "Close search" }).click();

  // Logo: tap scrolls to top (smooth scrolling needs the real clock, so a second page), hold opens partner tools
  {
    const q = await ctx.newPage();
    await q.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    await q.locator("#app-scroll").evaluate((e) => e.scrollTo(0, 800));
    await q.getByTestId("logo").click();
    await q.waitForTimeout(1200);
    check(`${T} tapping the logo scrolls to the top`, (await q.locator("#app-scroll").evaluate((e) => e.scrollTop)) < 50);
    await q.close();
  }
  const box = await p.getByTestId("logo").boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.clock.runFor(1000);
  await p.mouse.up();
  await p.waitForURL(/partners-demo$/, { timeout: 5000 }).catch(() => {});
  check(`${T} holding the logo opens partner tools`, /partners-demo$/.test(p.url()), p.url());

  // ---- Every place page
  for (const place of PLACES) {
    await p.goto(`${BASE}/app/place/${place.id}`, { waitUntil: "networkidle" });
    const t = await text();
    const P = `${T} ${place.id}:`;
    check(`${P} name, kind, neighbourhood, price`, t.includes(place.name) && t.includes(place.neighbourhood) && t.includes("$".repeat(place.details.price)));
    check(`${P} offer shows`, t.includes(place.offer));
    check(`${P} hours status`, /Open now · until|Opens at|Closed (today|now) · opens/.test(await p.getByTestId("hours").innerText()), await p.getByTestId("hours").innerText());
    check(`${P} address and transit`, t.includes(place.details.address) && t.includes(place.details.transit));
    const href = await p.getByRole("link", { name: /Directions/ }).getAttribute("href");
    check(`${P} directions open Apple Maps`, href.startsWith("https://maps.apple.com/?q=") && decodeURIComponent(href).includes(place.details.address));
    const menu = await p.getByTestId("menu").locator("li").allInnerTexts();
    check(`${P} menu: 3 items with prices`, menu.length === 3 && place.details.menu.every((m, i) => menu[i].includes(m.name) && menu[i].includes(`$${m.price}`)));
    check(`${P} owner note`, t.includes(place.details.note) && t.includes(place.details.noteBy));
    check(`${P} no alcohol words`, !ALCOHOL.test(t));
    check(`${P} no em dashes`, !/[—–]/.test(t));
    const shots = 1 + place.details.gallery.length;
    const imgs = await p.locator("#app-scroll img").evaluateAll((els) => els.filter((e) => e.closest("[data-testid=gallery]") || e.getBoundingClientRect().top < 400).length);
    check(`${P} photos (${shots})`, shots === 1 ? imgs >= 1 : (await p.getByTestId("gallery").locator("img").count()) === shots, `${imgs}`);
  }

  // Every photo actually loads (scroll each gallery so lazy ones load)
  const broken = [];
  for (const place of PLACES.filter((x) => x.details.gallery.length)) {
    await p.goto(`${BASE}/app/place/${place.id}`, { waitUntil: "networkidle" });
    const g = p.getByTestId("gallery");
    for (let i = 1; i <= place.details.gallery.length; i++) {
      await g.evaluate((e, n) => e.scrollTo(e.clientWidth * n, 0), i);
      await p.waitForTimeout(150);
    }
    await p.waitForLoadState("networkidle");
    const bad = await g.locator("img").evaluateAll((els) => els.filter((e) => !(e.complete && e.naturalWidth > 0)).map((e) => e.getAttribute("src")));
    broken.push(...bad);
  }
  check(`${T} every gallery photo loads`, broken.length === 0, broken.join(", "));

  // Gallery counter follows the swipe
  await p.goto(`${BASE}/app/place/fennel-ash`, { waitUntil: "networkidle" });
  check(`${T} gallery starts at 1 / 3`, (await p.locator("#app-scroll").innerText()).includes("1 / 3"));
  await p.getByTestId("gallery").evaluate((e) => e.scrollTo(e.clientWidth, 0));
  await p.waitForTimeout(300);
  check(`${T} swiping shows 2 / 3`, (await p.locator("#app-scroll").innerText()).includes("2 / 3"));
  await shot("place-fennel");

  // Hours: tapping shows the week, today marked
  await p.getByRole("button", { name: /Hours/ }).click();
  const week = await p.getByTestId("week").locator("li").allInnerTexts();
  check(`${T} hours open to the full week`, week.length === 7 && week[0].startsWith("Mon") && week[6].startsWith("Sun"));
  check(`${T} Fennel & Ash is closed Monday`, /Mon\s+Closed/.test(week[0]));
  await p.locator("#app-scroll").evaluate((e) => e.scrollTo(0, 500));
  await shot("place-details");
  await p.locator("#app-scroll").evaluate((e) => e.scrollTo(0, 1200));
  await shot("place-menu");

  // Hours at different times of day
  const hoursAt = async (iso, id) => {
    await p.clock.setFixedTime(new Date(iso));
    await p.goto(`${BASE}/app/place/${id}`, { waitUntil: "networkidle" });
    return p.getByTestId("hours").innerText();
  };
  check(`${T} 10:00, Lantern House: Opens at 5 pm`, (await hoursAt("2027-03-23T10:00:00", "lantern-house")) === "Opens at 5 pm");
  check(`${T} 18:15, Lantern House: Open now · until 10:30 pm`, (await hoursAt("2027-03-23T18:15:00", "lantern-house")) === "Open now · until 10:30 pm");
  check(`${T} 23:30, Lantern House: Closed now · opens Wed 5 pm`, (await hoursAt("2027-03-23T23:30:00", "lantern-house")) === "Closed now · opens Wed 5 pm");
  check(`${T} Tuesday, Juniper Table: Closed today · opens Wed 5:30 pm`, (await hoursAt("2027-03-23T12:00:00", "juniper-table")) === "Closed today · opens Wed 5:30 pm");
  check(`${T} 9:00, Morning Ledger: Open now · until 4 pm`, (await hoursAt("2027-03-23T09:00:00", "morning-ledger")) === "Open now · until 4 pm");
  await p.clock.setFixedTime(new Date("2027-03-23T18:15:00"));

  // ---- Save a place, see it on My pass, survives a reload and New meeting
  await p.goto(`${BASE}/app/place/kaito`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Save" }).click();
  check(`${T} heart turns on`, (await p.getByRole("button", { name: "Saved" }).getAttribute("aria-pressed")) === "true");
  await p.getByRole("button", { name: "Share" }).click(); // no share sheet in a test browser: must not throw
  await p.goto(`${BASE}/app/pass`, { waitUntil: "networkidle" });
  check(`${T} saved place on My pass`, (await p.getByTestId("saved-places").innerText()).includes("Kaito Noodle House"));
  await p.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
  if (await p.getByRole("button", { name: "New meeting" }).isVisible().catch(() => false)) {
    await p.getByRole("button", { name: "New meeting" }).click();
    await p.getByRole("button", { name: "Yes, clear it" }).click();
  }
  await p.goto(`${BASE}/app/pass`, { waitUntil: "networkidle" });
  check(`${T} saved places survive New meeting`, (await p.getByTestId("saved-places").innerText().catch(() => "")).includes("Kaito Noodle House"));

  // ---- My pass
  const pass = await text();
  check(`${T} member card: name, number, since`, /Alex Morgan/.test(pass) && /No\. 0412/i.test(pass) && /Member since March 2027/i.test(pass));
  check(`${T} four past visits, $121 saved`, (await p.getByTestId("history").locator("li").count()) === 4 && (await p.getByTestId("saved").innerText()) === "$121" && (await p.getByTestId("visits").innerText()) === "4");
  check(`${T} account: terms, privacy, help`, (await p.getByRole("link", { name: "Terms" }).getAttribute("href")) === "https://the6pass.ca/terms" && (await p.getByRole("link", { name: "Privacy" }).getAttribute("href")) === "https://the6pass.ca/privacy" && (await p.getByRole("link", { name: /Help and contact/ }).getAttribute("href")) === "mailto:hello@the6pass.ca");
  check(`${T} My pass has no demo or reset words`, !/reset|demo/i.test(pass));
  await shot("pass");

  // ---- Redeem at a place that runs today, then the visit shows on My pass
  await p.goto(`${BASE}/app/place/kaito`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Redeem", exact: true }).click();
  await p.waitForURL(/\/app\/redeem\/kaito$/);
  const code = await p.locator("#app-frame").innerText();
  check(`${T} code sheet shows a 6-digit code`, /\b\d{3} \d{3}\b/.test(code));
  await shot("code");
  await p.getByRole("button", { name: "Confirm", exact: true }).click();
  check(`${T} confirmed`, (await p.locator("#app-frame").innerText()).includes("Redeemed"));
  await p.goto(`${BASE}/app/pass`, { waitUntil: "networkidle" });
  check(`${T} the new visit is first, marked Today, $140 saved`, (await p.getByTestId("history").locator("li").first().innerText()).includes("Today") && (await p.getByTestId("saved").innerText()) === "$140");

  // A place that doesn't run today can't be redeemed
  await p.goto(`${BASE}/app/place/linden`, { waitUntil: "networkidle" });
  check(`${T} not-today place has no Redeem button`, (await p.getByRole("button", { name: "Redeem", exact: true }).count()) === 0 && (await text()).includes("Next: Wed"));

  // ---- Accessibility spot checks on the place page
  await p.goto(`${BASE}/app/place/cedar-salt`, { waitUntil: "networkidle" });
  const small = await p.evaluate(() => [...document.querySelectorAll("#app-frame button, #app-frame a")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40; }).map((e) => e.textContent.trim() || e.getAttribute("aria-label")));
  check(`${T} place page targets at least 40px tall`, small.length === 0, small.join(" | "));
  check(`${T} one h1 on the place page`, (await p.locator("#app-frame h1").count()) === 1);
  check(`${T} gallery is labelled`, (await p.getByRole("group", { name: "Photos of Cedar & Salt" }).count()) === 1);

  check(`${T} no page errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---- Offline: the service worker saves the new photos too (not in the iPhone app, which ships every file)
if (!process.env.NO_SW) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
  // Wait until the worker has saved everything (the count stops growing).
  let cached = [];
  for (let i = 0, last = -1, still = 0; i < 120 && still < 4; i++) {
    cached = await p.evaluate(async () => { const c = await caches.open("t6p-demo-v5"); return (await c.keys()).map((r) => new URL(r.url).pathname); });
    still = cached.length === last && cached.length > 100 ? still + 1 : 0;
    last = cached.length;
    await p.waitForTimeout(1000);
  }
  check("[offline] service worker saved the gallery photos and new pages", cached.includes("/demo/kaito-2-1200.webp") && cached.includes("/app/place/linden"), `${cached.length} files`);
  await ctx.setOffline(true);
  await p.goto(`${BASE}/app/place/little-saffron`, { waitUntil: "load" }).catch(() => {});
  check("[offline] a new place opens with no signal", (await p.locator("#app-scroll").innerText().catch(() => "")).includes("Koobideh kebab"));
  await ctx.close();
}

await browser.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
