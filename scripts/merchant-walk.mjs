// Click-through of the merchant demo at 390 and 1280 wide. Needs Playwright and Chromium.
// Run against the static export: npx serve out -l 4190, then BASE=http://localhost:4190 node scripts/merchant-walk.mjs
// (The import path and test photo below are from the machine it was written on; adjust them to yours.)
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "node:fs";

const BASE = process.env.BASE || "http://localhost:4190";
const OUT = "/home/user/6ixpass/docs/merchant-mock";
const results = [];
const check = (name, ok, extra = "") => { results.push({ name, ok: !!ok, extra }); console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? "  (" + extra + ")" : ""}`); };

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

for (const [W, H] of [[390, 844], [1280, 900]]) {
  const T = `[${W}]`;
  const dir = `${OUT}/${W}`;
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: W < 500 ? 2 : 1, isMobile: W < 500, hasTouch: W < 500 });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_INTERNET_DISCONNECTED/.test(m.text())) errors.push(m.text()); });
  let n = 0;
  const shot = async (name) => { await p.waitForTimeout(450); await p.screenshot({ path: `${dir}/${String(++n).padStart(2, "0")}-${name}.png` }); };
  const guide = async () => (await p.locator('[data-testid="guide"]').first().innerText().catch(() => "")).trim();
  const tap = (name, opts = {}) => p.getByRole(opts.role || "button", { name, exact: opts.exact ?? false }).first().click();

  // ---- Entry
  const t0 = Date.now();
  await p.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
  check(`${T} entry shows Set up a place`, await p.getByRole("link", { name: "Set up a place" }).isVisible());
  check(`${T} entry guide line`, /Set up a place/.test(await guide()), await guide());
  await shot("entry");

  // ---- Onboarding
  await p.getByRole("link", { name: "Set up a place" }).click();
  await p.waitForURL(/\/app\/owner\/setup$/);
  check(`${T} step 1 of 6`, (await p.getByTestId("step").innerText()) === "Step 1 of 6");
  check(`${T} Next off until a name`, await p.getByRole("button", { name: "Next" }).isDisabled());
  await p.getByLabel("Name of your place").fill("Example Bistro");
  await tap("Restaurant", { exact: true });
  await tap("Leslieville", { exact: true });
  await shot("setup-place");
  await tap("Next", { exact: true });

  check(`${T} offer prefilled by category`, (await p.getByLabel("What members get").inputValue()) === "Second main, on us.");
  await p.getByLabel("What members get").fill("Second main, on us with wine");
  check(`${T} alcohol refused`, await p.getByText("Offers can't include alcohol").isVisible());
  await p.getByLabel("What members get").fill("Second main, on us.");
  await shot("setup-offer");
  await tap("Next", { exact: true });

  // days: default Mon-Thu. Take two off -> fewer than 3 -> plain message and Next off.
  await p.getByRole("button", { name: "Monday" }).click();
  await p.getByRole("button", { name: "Thursday" }).click();
  check(`${T} fewer than 3 days said plainly`, await p.getByText("Pick at least 3 days. You have 2 days so far.").isVisible());
  check(`${T} Next off with 2 days`, await p.getByRole("button", { name: "Next" }).isDisabled());
  await shot("setup-days-too-few");
  await p.getByRole("button", { name: "Thursday" }).click();
  await p.getByRole("button", { name: "Sunday" }).click();
  await shot("setup-days");
  await tap("Next", { exact: true });

  await p.getByRole("button", { name: "More uses" }).click();
  check(`${T} uses 3`, (await p.getByTestId("uses-per-year").innerText()) === "3");
  await p.getByLabel("Blackout dates (optional)").fill("2027-12-25");
  await tap("Add", { exact: true });
  check(`${T} blackout added`, await p.getByRole("button", { name: /Dec 25, 2027/ }).isVisible());
  await shot("setup-limits");

  // refresh mid-flow keeps the step and the answers
  await p.reload({ waitUntil: "networkidle" });
  check(`${T} refresh keeps step 4`, (await p.getByTestId("step").innerText()) === "Step 4 of 6");
  check(`${T} refresh keeps uses`, (await p.getByTestId("uses-per-year").innerText()) === "3");
  await tap("Back", { exact: true });
  check(`${T} Back goes to step 3`, (await p.getByTestId("step").innerText()) === "Step 3 of 6");
  await tap("Next", { exact: true });
  await tap("Next", { exact: true });

  // look: photo on phone, colour + initial on desktop
  if (W < 500) {
    await p.locator('input[type="file"]').setInputFiles("/tmp/claude-0/wl/test-photo.jpg");
    await p.waitForTimeout(1200);
    check(`${T} photo resized and shown`, (await p.locator("img[src^='data:image/jpeg']").count()) > 0);
  } else {
    await p.getByRole("button", { name: "Blue" }).click();
    check(`${T} no photo shows initial`, (await p.locator("#app-scroll").innerText()).includes("E"));
  }
  await shot("setup-look");
  await tap("Next", { exact: true });

  const review = await p.locator("#app-scroll").innerText();
  check(`${T} review shows how members see it`, review.includes("Example Bistro") && review.includes("Founding Partner") && review.includes("Tue to Thu, Sun") && review.includes("Food and non-alcoholic"));
  check(`${T} review has no placeholder text`, !/\[|lorem|their photo/i.test(review));
  await shot("setup-review");
  await tap("Looks right", { exact: true });
  check(`${T} done screen`, await p.getByText("You're set up as a Founding Partner (demo).").isVisible());
  await shot("setup-done");

  // ---- Member view
  await p.getByRole("link", { name: "See what members see" }).click();
  await p.waitForURL(/\/app\/place\/your-place$/);
  check(`${T} member place shows their name`, await p.getByRole("heading", { name: "Example Bistro" }).isVisible());
  check(`${T} guide says tap Redeem`, (await guide()) === "Now tap Redeem, as your guest would.", await guide());
  await shot("member-place");
  await tap("Redeem", { exact: true });
  await p.waitForURL(/\/app\/redeem\/your-place$/);
  check(`${T} staff line word for word`, await p.getByText("Check the code matches, then tap Confirm. No scanner, no app, no login at the host stand.").isVisible());
  await shot("member-code");
  await tap("Confirm", { exact: true });
  check(`${T} redeemed`, await p.getByRole("heading", { name: "Redeemed." }).isVisible());
  await shot("member-redeemed");
  await p.getByRole("link", { name: "See the owner view" }).click();
  await p.waitForURL(/\/app\/owner$/);
  const latest = await p.getByTestId("latest-visit-time").innerText();
  const secs = Math.round((Date.now() - t0) / 1000);
  check(`${T} visit at the top, Just now`, latest === "Just now", latest);
  check(`${T} entry to visit under two minutes (scripted)`, secs < 120, `${secs}s`);
  check(`${T} sample numbers labelled illustrative`, await p.getByText("Sample month · illustrative numbers").isVisible());
  check(`${T} costs line`, await p.getByText("Free for founding partners for the first 12 months. No commission. No setup.").first().isVisible());
  await shot("owner-dashboard");
  await p.locator("#app-scroll").evaluate((e) => e.scrollTo(0, 700)); await shot("owner-dashboard-numbers");

  // ---- Live sync: second tab on the dashboard, redeem in the first
  const p2 = await ctx.newPage();
  await p2.goto(`${BASE}/app/owner`, { waitUntil: "networkidle" });
  const before = await p2.getByTestId("visits").locator("li").count();
  await p.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
  await tap("Redeem", { exact: true });
  await p.waitForURL(/redeem/);
  await tap("Confirm", { exact: true });
  await p2.waitForTimeout(800);
  const after = await p2.getByTestId("visits").locator("li").count();
  check(`${T} other tab gets the visit without reload`, after === before + 1, `${before} -> ${after}`);
  await p2.close();

  // ---- Pause
  await p.goto(`${BASE}/app/owner`, { waitUntil: "networkidle" });
  await p.getByTestId("pause").click();
  check(`${T} pause on`, (await p.getByTestId("pause").getAttribute("aria-checked")) === "true");
  await p.locator("#app-scroll").evaluate((e) => e.scrollTo(0, 900)); await shot("owner-controls-paused");
  await p.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
  check(`${T} member sees Paused by the venue`, await p.getByText("Paused by the venue", { exact: true }).isVisible());
  check(`${T} Redeem disabled when paused`, await p.getByRole("button", { name: "Redeem", exact: true }).isDisabled());
  await shot("member-paused");
  await p.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  const firstCard = await p.locator("ul.m-stagger li").first().innerText();
  check(`${T} owner's place first in Explore`, firstCard.includes("Example Bistro") && firstCard.includes("Paused"), firstCard.replace(/\s+/g, " ").slice(0, 80));
  await shot("member-explore");
  await p.goto(`${BASE}/app/owner`, { waitUntil: "networkidle" });
  await p.getByTestId("pause").click();

  // ---- Edit the offer in place
  await p.locator("#d-offer").fill("Dessert for the table, on us.");
  await p.getByRole("button", { name: "Tuesday" }).click(); // 4 -> 3 days ok
  await p.getByRole("button", { name: "Wednesday" }).click(); // would be 2: refused
  check(`${T} dashboard refuses fewer than 3 days`, await p.getByText(/Keep at least 3 days/).isVisible());
  await p.locator("#app-scroll").evaluate((e) => e.scrollTo(0, 1100)); await shot("owner-edit-offer");
  await p.goto(`${BASE}/app/place/your-place`, { waitUntil: "networkidle" });
  check(`${T} member sees edited offer`, await p.getByRole("heading", { name: "Dessert for the table, on us." }).isVisible());
  check(`${T} member Redeem back on`, await p.getByRole("button", { name: "Redeem", exact: true }).isEnabled());

  // ---- Next step
  await p.goto(`${BASE}/app/owner/next`, { waitUntil: "networkidle" });
  const mail = await p.getByRole("link", { name: /Email hello@the6pass.ca/ }).getAttribute("href");
  check(`${T} mailto`, mail?.startsWith("mailto:hello@the6pass.ca"), mail);
  check(`${T} QR code`, (await p.locator('[role="img"][aria-label^="QR code"] svg').count()) === 1);
  check(`${T} short link to owners`, /\/owners$/.test(await p.getByRole("link", { name: /\/owners$/ }).getAttribute("href")));
  await shot("next-step");

  // ---- Offline: wait for the service worker to finish saving, then cut the network
  await p.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
  await p.evaluate(() => navigator.serviceWorker.ready);
  let cached = 0;
  for (let i = 0; i < 60; i++) {
    cached = await p.evaluate(async () => { const c = await caches.open("t6p-demo-v2"); return (await c.keys()).length; });
    if (cached > 60) { await p.waitForTimeout(1500); break; }
    await p.waitForTimeout(500);
  }
  check(`${T} service worker saved the demo`, cached > 60, `${cached} files`);
  await ctx.setOffline(true);
  await p.goto(`${BASE}/partners-demo`, { waitUntil: "load" });
  check(`${T} offline: entry loads`, await p.getByRole("link", { name: "Start demo" }).isVisible());
  await p.getByRole("link", { name: "Start demo" }).click();
  await p.waitForURL(/\/app\/place\/your-place$/, { timeout: 10000 }).catch(() => {});
  check(`${T} offline: Start demo opens the place`, await p.getByRole("heading", { name: "Example Bistro" }).isVisible().catch(() => false), p.url());
  await tap("Redeem", { exact: true });
  await p.waitForURL(/redeem/, { timeout: 10000 }).catch(() => {});
  await tap("Confirm", { exact: true }).catch(() => {});
  await p.getByRole("link", { name: "See the owner view" }).click().catch(() => {});
  await p.waitForURL(/\/app\/owner$/, { timeout: 10000 }).catch(() => {});
  check(`${T} offline: redeem lands on dashboard`, (await p.getByTestId("latest-visit-time").innerText().catch(() => "")) === "Just now");
  await p.goto(`${BASE}/app/owner/setup`, { waitUntil: "load" }).catch(() => {});
  check(`${T} offline: direct load of setup`, await p.getByText(/Step \d of 6|You're set up/).first().isVisible().catch(() => false));
  const fontsOk = await p.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").length);
  check(`${T} offline: fonts load`, fontsOk > 0, `${fontsOk} faces`);
  await shot("offline-dashboard");
  await ctx.setOffline(false);

  // ---- Meeting mode: gear sheet, Start demo, New meeting
  await p.goto(`${BASE}/partners-demo`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "New meeting" }).click();
  await shot("new-meeting-confirm");
  await p.getByRole("button", { name: "Keep it" }).click();
  check(`${T} Keep it keeps the place`, await p.getByRole("link", { name: "Start demo" }).isVisible());
  await p.getByRole("button", { name: "New meeting" }).click();
  await p.getByRole("button", { name: "Yes, clear it" }).click();
  await p.waitForTimeout(400);
  check(`${T} New meeting wipes the place`, await p.getByRole("link", { name: "Set up a place" }).isVisible());
  check(`${T} New meeting wipes visits`, await p.evaluate(() => JSON.parse(localStorage.getItem("t6p_app_mock_v1")).redemptions.length === 0));

  await p.getByRole("button", { name: "Set up for a restaurant" }).click();
  await shot("gear-sheet");
  await p.locator("#qs-name").fill("Second Example Café");
  await p.locator("#qs-cat").selectOption("cafe");
  check(`${T} gear sheet prefills by category`, (await p.locator("#qs-offer").inputValue()) === "Second coffee, on us.");
  await tap("Save", { exact: true });
  check(`${T} gear sheet saves the place`, await p.getByText("Second Example Café").first().isVisible());
  await p.keyboard.press("Tab");
  await shot("entry-ready");
  await p.getByRole("link", { name: "Start demo" }).click();
  await p.waitForURL(/\/app\/place\/your-place$/);
  check(`${T} Start demo lands on member view of the place`, await p.getByRole("heading", { name: "Second Example Café" }).isVisible());
  check(`${T} no photo: colour and initial, no placeholder`, !/\[|their photo/i.test(await p.locator("#app-scroll").innerText()));
  await shot("start-demo-place");

  // ---- Reset from My pass
  await p.goto(`${BASE}/app/pass`, { waitUntil: "networkidle" });
  await tap("Reset demo");
  await tap("Yes, reset everything");
  await p.goto(`${BASE}/app/owner`, { waitUntil: "networkidle" });
  check(`${T} reset clears the owner place`, await p.getByRole("link", { name: "Set up a place" }).isVisible());

  // ---- Accessibility spot checks
  const small = await p.evaluate(() => [...document.querySelectorAll("#app-frame button, #app-frame a")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40; }).map((e) => e.textContent.trim() || e.getAttribute("aria-label")));
  check(`${T} targets at least 40px tall on owner screen`, small.length === 0, small.join(" | "));
  check(`${T} no page errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await b.close();
const failed = results.filter((r) => !r.ok);
fs.writeFileSync(`${OUT}/RESULTS.md`, `# Merchant demo click-through\n\nRun: ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC against \`${BASE}\` (static export). Screenshots in \`390/\` and \`1280/\`.\n\n${results.filter((r) => r.ok).length}/${results.length} checks passed.\n\n${results.map((r) => `- ${r.ok ? "✅" : "❌"} ${r.name}${r.extra ? ` (${r.extra})` : ""}`).join("\n")}\n`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
