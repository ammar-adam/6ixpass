// Website checks against the static export (Supabase is faked, nothing is written):
//   npx serve out -l 4320, then BASE=http://localhost:4320 node scripts/site-walk.mjs
// Waitlist form (errors, loading, success, already on the list, server error, CASL label, consent_text, source and campaign),
// popup (5s, Esc, close, focus trap, snooze, never after joining), no horizontal scroll, labels, alt text, links, the /about button.
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const BASE = process.env.BASE || "http://localhost:4320";
const LABEL = "Yes, email me about The 6 Pass launch and founding member pricing. I can unsubscribe any time.";
let pass = 0, fail = 0;
const check = (n, ok, x = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${n}${!ok && x ? "  (" + x + ")" : ""}`); };
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const errors = [];
async function page(w, status = 201, delay = 300) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 844 } });
  const bodies = [];
  await ctx.route("**/rest/v1/waitlist**", async (r) => { bodies.push({ body: r.request().postDataJSON(), headers: r.request().headers() }); await new Promise((x) => setTimeout(x, delay)); await r.fulfill({ status, body: status === 409 ? '{"code":"23505"}' : "" }); });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  p.bodies = bodies;
  return p;
}
for (const w of [1440, 390]) {
  // Hero form: errors, loading, success
  let p = await page(w);
  await p.addInitScript(() => localStorage.setItem("t6p_popup_snooze_until", String(Date.now() + 1e9)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const hero = p.locator("#join form");
  check(`${w} hero: consent label exact and linked`, (await hero.getByLabel(LABEL).count()) === 1 && !(await hero.getByLabel(LABEL).isChecked()));
  check(`${w} hero: email has a label`, (await hero.getByLabel("Email", { exact: true }).count()) === 1);
  await hero.getByRole("button", { name: "Join the waitlist" }).click();
  check(`${w} hero: empty email error`, (await hero.innerText()).includes("Enter your email address."));
  await hero.getByLabel("Email", { exact: true }).fill("nope");
  await hero.getByRole("button", { name: "Join the waitlist" }).click();
  check(`${w} hero: invalid email error`, (await hero.innerText()).includes("doesn't look right"));
  await hero.getByLabel("Email", { exact: true }).fill("test@example.org");
  await hero.getByRole("button", { name: "Join the waitlist" }).click();
  check(`${w} hero: consent required`, (await hero.innerText()).includes("Tick the box"));
  await hero.getByLabel(LABEL).check();
  await hero.getByRole("button", { name: "Join the waitlist" }).click();
  check(`${w} hero: loading state`, await p.getByText("Joining…").isVisible().catch(() => false));
  await p.getByText("You're on the list.").waitFor({ timeout: 5000 }).catch(() => {});
  check(`${w} hero: success state`, await p.getByText("You're on the list.").isVisible());
  const sent = p.bodies[0];
  check(`${w} insert: consent_text verbatim, source direct, no Bearer`, sent?.body?.consent_text === LABEL && sent?.body?.consent === true && sent?.body?.source === "direct" && !sent?.headers?.authorization && sent?.headers?.prefer === "return=minimal", JSON.stringify(sent?.body));
  await p.context().close();

  // Closing form: 409 already, and 500 error
  p = await page(w, 409);
  await p.addInitScript(() => localStorage.setItem("t6p_popup_snooze_until", String(Date.now() + 1e9)));
  await p.goto(BASE + "/?utm_source=ig&utm_campaign=launch", { waitUntil: "networkidle" });
  const closing = p.locator("section[data-waitlist-cta] form");
  check(`${w} closing: consent label present`, (await closing.getByLabel(LABEL).count()) === 1);
  await closing.getByLabel("Email", { exact: true }).fill("again@example.org");
  await closing.getByLabel(LABEL).check();
  await closing.getByRole("button", { name: "Join the waitlist" }).click();
  await p.getByText("You're already on the list.").waitFor({ timeout: 5000 }).catch(() => {});
  check(`${w} closing: already-on-list state`, await p.getByText("You're already on the list.").isVisible());
  check(`${w} closing: utm source and campaign`, p.bodies[0]?.body?.source === "ig" && p.bodies[0]?.body?.campaign === "launch");
  await p.context().close();
  p = await page(w, 500);
  await p.addInitScript(() => localStorage.setItem("t6p_popup_snooze_until", String(Date.now() + 1e9)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const h2 = p.locator("#join form");
  await h2.getByLabel("Email", { exact: true }).fill("x@example.org");
  await h2.getByLabel(LABEL).check();
  await h2.getByRole("button", { name: "Join the waitlist" }).click();
  check(`${w} hero: server error message`, await p.getByText("Something went wrong on our end").isVisible({ timeout: 5000 }).catch(() => false) || (await p.getByText("Something went wrong on our end").waitFor({ timeout: 4000 }).then(() => true).catch(() => false)));
  await p.context().close();

  // Popup: opens after ~5s, Esc closes and snoozes, focus trap, button opens
  p = await page(w);
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const dlg = p.locator("dialog.waitlist-dialog");
  await p.waitForTimeout(6000);
  check(`${w} popup: opens by itself after about 5s`, await dlg.evaluate((d) => d.open));
  check(`${w} popup: consent label and name/neighbourhood fields`, (await dlg.getByLabel(LABEL).count()) === 1 && (await dlg.getByLabel(/First name/).count()) === 1 && (await dlg.getByLabel(/Neighbourhood/).count()) === 1);
  for (let i = 0; i < 12; i++) await p.keyboard.press("Tab");
  check(`${w} popup: focus stays inside`, await p.evaluate(() => !!document.activeElement?.closest("dialog")));
  await p.keyboard.press("Escape");
  check(`${w} popup: Esc closes`, !(await dlg.evaluate((d) => d.open)));
  check(`${w} popup: snoozed after closing`, Number(await p.evaluate(() => localStorage.getItem("t6p_popup_snooze_until"))) > Date.now() + 2 * 864e5);
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(6000);
  check(`${w} popup: does not reopen while snoozed`, !(await dlg.evaluate((d) => d.open)));
  await p.getByRole("button", { name: "Join the waitlist" }).first().click();
  check(`${w} popup: header button opens it`, await dlg.evaluate((d) => d.open));
  await dlg.getByRole("button", { name: /close/i }).first().click();
  check(`${w} popup: close button works`, !(await dlg.evaluate((d) => d.open)));
  await p.getByRole("button", { name: "Join the waitlist and tell us where." }).click();
  check(`${w} where: link opens the popup`, await dlg.evaluate((d) => d.open));
  await p.keyboard.press("Escape");
  // Layout
  check(`${w} no horizontal page scroll`, (await p.evaluate(() => document.documentElement.scrollWidth)) === w);
  if (w === 390) {
    const r = await p.locator("#join input[type=checkbox]").boundingBox();
    check("390: form and consent above the fold", r && r.y + r.height < 844);
    const strip = p.getByRole("region", { name: "How a visit works, five screens" });
    const sw = await strip.evaluate((e) => [e.scrollWidth, e.clientWidth]);
    check("390: swipe row scrolls and next phone peeks", sw[0] > sw[1]);
  }
  await p.context().close();
  // Joined: popup never again
  p = await page(w);
  await p.addInitScript(() => localStorage.setItem("t6p_joined", "1"));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(6000);
  check(`${w} popup: never after joining`, !(await p.locator("dialog.waitlist-dialog").evaluate((d) => d.open)));
  await p.context().close();
}
// Pages, links, images, alt, headings, reduced motion
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const p = await ctx.newPage();
p.on("pageerror", (e) => errors.push(e.message));
for (const url of ["/", "/owners", "/about", "/privacy", "/terms"]) {
  await p.goto(BASE + url, { waitUntil: "networkidle" });
  const t = await p.locator("body").innerText();
  check(`${url}: no em dashes, no Toronto first, no owner terms`, !/—/.test(t) && !/Toronto first/.test(t) && !/12 months|\bcommission\b|You pay|30 days/i.test(t));
  check(`${url}: one h1`, (await p.locator("h1").count()) === 1);
  check(`${url}: every img has alt`, await p.evaluate(() => [...document.images].every((i) => i.hasAttribute("alt"))));
  check(`${url}: every input labelled`, await p.evaluate(() => [...document.querySelectorAll("input:not([type=hidden]):not([tabindex='-1']), select")].every((i) => i.labels?.length || i.getAttribute("aria-label"))));
  const links = await p.evaluate(() => [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")));
  for (const l of [...new Set(links)].filter((l) => !l.startsWith("/app") && !l.startsWith("/partners"))) {
    const r = await p.request.get(BASE + l.split("#")[0]);
    if (r.status() >= 400) check(`${url}: link ${l} works`, false, r.status());
  }
}
await p.goto(BASE + "/about", { waitUntil: "networkidle" });
const btn = p.locator("#about-cta").locator("xpath=../..").getByRole("button", { name: "Join the waitlist" });
const col = await btn.evaluate((e) => [getComputedStyle(e).backgroundColor, getComputedStyle(e).color]);
check("/about: CTA button has a visible fill", col[0] !== "rgba(0, 0, 0, 0)" && col[0] !== "rgb(22, 20, 15)", col.join(" "));
check("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await b.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
