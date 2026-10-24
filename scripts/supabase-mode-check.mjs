// Checks the real-accounts code path (NEXT_PUBLIC_AUTH_MODE=supabase) WITHOUT touching
// the real Supabase project: every request to *.supabase.co is answered here by a fake,
// and anything unexpected fails the run. Proves the app sends the right calls with the
// public key only, and handles the answers.
//   NEXT_PUBLIC_AUTH_MODE=supabase npm run build && npx serve out -l 4193
//   BASE=http://localhost:4193 node scripts/supabase-mode-check.mjs
// Also covers a new business signing up (create_my_business) and places that exist only in the database.
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://localhost:4193";
const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
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

const MEMBER = "11111111-1111-4111-8111-111111111111";
const STAFF = "22222222-2222-4222-8222-222222222222";
const NEW_OWNER = "33333333-3333-4333-8333-333333333333";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub, email) => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, email, role: "authenticated", aud: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.c2ln`;
const session = (sub, email) => ({ access_token: jwt(sub, email), token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: `r-${sub}`, user: { id: sub, aud: "authenticated", role: "authenticated", email, email_confirmed_at: new Date().toISOString(), app_metadata: { provider: "email" }, user_metadata: {}, identities: [{ id: sub }], created_at: new Date().toISOString() } });

const log = [];
let redemptionStatus = "issued";
const ISSUED = new Date().toISOString();
// Who sent a request: the "sub" of the signed-in user's token (null for the public key alone).
const subOf = (auth) => {
  try {
    return JSON.parse(Buffer.from(auth.replace(/^Bearer /, "").split(".")[1], "base64url").toString()).sub ?? null;
  } catch {
    return null;
  }
};
const LANTERN = { id: "lantern-house", name: "Lantern House", neighbourhood: "Ossington", category: "restaurant", published: true, offer: "Second main, on us (from the database).", offer_detail: "", offer_kind: "two_for_one", days: [true, true, true, true, true, true, true], uses_per_year: 4, blackout_dates: [], paused: false, saving: 31 };
// Places that exist only in the database (fictional test names).
const DB_CAFE = { id: "fake-corner-cafe", name: "Fake Corner Cafe", neighbourhood: "Leslieville", category: "cafe", published: true, offer: "Second coffee, on us (database place).", offer_detail: "", offer_kind: "two_for_one", days: [true, true, true, true, true, true, true], uses_per_year: 2, blackout_dates: [], paused: false, saving: 6 };
// Unpublished, and sent to everyone here (as if this phone also had a team login): the app must still keep it off Explore.
const DB_HIDDEN = { ...DB_CAFE, id: "fake-hidden-spa", name: "Fake Hidden Spa", category: "spa", published: false, offer: "A free upgrade on your treatment." };
// The new business's own place: Row Level Security shows it only to its owner.
let newPlace = null;
const statuses = new Map([["aaaaaaaa-0000-4000-8000-000000000001", () => redemptionStatus]]);

async function fake(route) {
  const req = route.request();
  const url = new URL(req.url());
  const body = req.postData() ? JSON.parse(req.postData() || "{}") : {};
  const headers = req.headers();
  const auth = headers.authorization ?? "";
  log.push({ method: req.method(), path: url.pathname, search: url.search, body, apikey: headers.apikey, auth });
  const json = (status, data) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
  const p = url.pathname;
  if (p === "/auth/v1/token" && url.searchParams.get("grant_type") === "password") {
    if (body.password !== "right-password") return json(400, { code: "invalid_credentials", error_code: "invalid_credentials", msg: "Invalid login credentials" });
    return json(200, body.email.startsWith("staff") ? session(STAFF, body.email) : session(MEMBER, body.email));
  }
  if (p === "/auth/v1/signup") {
    // "Confirm email" on: a user and no session until they tap the link.
    if (body.email.startsWith("confirm-later")) return json(200, { ...session(NEW_OWNER, body.email).user, email_confirmed_at: null });
    return json(200, session(NEW_OWNER, body.email));
  }
  if (p === "/auth/v1/logout") return route.fulfill({ status: 204 });
  if (p === "/auth/v1/user") return json(200, subOf(auth) === NEW_OWNER ? session(NEW_OWNER, "newowner@example.com").user : session(MEMBER, "member@example.com").user);
  if (p === "/rest/v1/profiles") return json(200, req.method() === "PATCH" ? null : { first_name: "Sam", home_hood: "Ossington", work_hood: "King West", notify: false, onboarded: true });
  if (p === "/rest/v1/passes") return json(200, { number: 1001, starts_on: "2027-03-16", ends_on: "2028-03-16", status: "active" });
  if (p === "/rest/v1/places") return json(200, [LANTERN, DB_CAFE, DB_HIDDEN, ...(newPlace && subOf(auth) === NEW_OWNER ? [newPlace] : [])]);
  if (p === "/rest/v1/redemptions") {
    const id = url.searchParams.get("id")?.replace(/^eq\./, "");
    if (id) {
      const st = statuses.get(id)?.() ?? "issued";
      return json(200, { status: st, confirmed_at: st === "confirmed" ? new Date().toISOString() : null });
    }
    return json(200, []);
  }
  if (p === "/rest/v1/saved_places") return json(200, []);
  if (p === "/rest/v1/rpc/issue_code") {
    if (body.p_place === DB_CAFE.id) return json(200, [{ redemption_id: "aaaaaaaa-0000-4000-8000-000000000002", code: "731005", issued_at: new Date().toISOString(), expires_at: new Date(Date.now() + 600000).toISOString(), offer_text: DB_CAFE.offer, saving: 6 }]);
    if (body.p_place !== "lantern-house") return json(400, { code: "P0001", message: "not_found" });
    return json(200, [{ redemption_id: "aaaaaaaa-0000-4000-8000-000000000001", code: "042917", issued_at: ISSUED, expires_at: new Date(Date.now() + 600000).toISOString(), offer_text: "Second main, on us (from the database).", saving: 31 }]);
  }
  if (p === "/rest/v1/rpc/create_my_business") {
    if (subOf(auth) !== NEW_OWNER) return json(401, { message: "not_signed_in" });
    newPlace = { id: "new-test-bistro", name: body.p_name, neighbourhood: body.p_neighbourhood, category: body.p_category, published: false, offer: "Second one, on us.", offer_detail: null, offer_kind: "two_for_one", days: [false, true, true, true, false, false, false], uses_per_year: 2, blackout_dates: [], paused: false, saving: null };
    return json(200, newPlace.id);
  }
  if (p === "/rest/v1/rpc/cancel_code") return json(200, null);
  if (p === "/rest/v1/rpc/accept_invites") return json(200, 0);
  if (p === "/rest/v1/rpc/my_businesses") {
    if (subOf(auth) === NEW_OWNER) return json(200, newPlace ? [{ business_id: "bbbbbbbb-0000-4000-8000-000000000002", business_name: newPlace.name, role: "owner", place_ids: [newPlace.id] }] : []);
    return json(200, [{ business_id: "bbbbbbbb-0000-4000-8000-000000000001", business_name: "Test Group", role: "staff", place_ids: ["lantern-house"] }]);
  }
  if (p === "/rest/v1/rpc/place_visits") return json(200, body.p_place === "lantern-house" && redemptionStatus === "confirmed" ? [{ id: "aaaaaaaa-0000-4000-8000-000000000001", confirmed_at: new Date().toISOString(), offer_text: "Second main, on us (from the database).", member_name: "Sam", saving: 31 }] : []);
  if (p === "/rest/v1/rpc/confirm_code") {
    if (body.p_code !== "042917") return json(200, { result: "unknown" });
    if (redemptionStatus === "confirmed") return json(200, { result: "used" });
    redemptionStatus = "confirmed";
    return json(200, { result: "ok", offer: "Second main, on us (from the database).", member_name: "Sam", uses_left: 3, uses_per_year: 4 });
  }
  log.push({ unexpected: `${req.method()} ${p}` });
  return json(500, { message: "unexpected in test" });
}

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await ctx.route(/supabase\.co/, fake);
const errors = [];
const m = await ctx.newPage();
m.on("pageerror", (e) => errors.push(e.message));

await m.goto(`${BASE}/app`, { waitUntil: "networkidle" });
check("signed out: landing", (await m.getByTestId("landing").count()) === 1);
await m.goto(`${BASE}/app/account/sign-in`, { waitUntil: "networkidle" });
check("no demo accounts box in real mode", (await m.getByTestId("demo-note").count()) === 0);
await m.getByLabel("Email").fill("member@example.com");
await m.getByLabel("Password", { exact: true }).fill("wrong");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
check("wrong password from Supabase: plain message", await until(async () => (await m.getByTestId("form-error").innerText()).includes("don't match")));
await m.getByLabel("Password", { exact: true }).fill("right-password");
await m.getByRole("button", { name: "Sign in", exact: true }).click();
check("signed in: Explore", await until(async () => /\/app$/.test(m.url()) && (await m.getByTestId("hero").count()) === 1), m.url());
const tokenCall = log.find((l) => l.path === "/auth/v1/token");
check("sign in went to Supabase Auth with the publishable key", tokenCall?.apikey?.startsWith("sb_publishable_"));
await m.goto(`${BASE}/app/pass`, { waitUntil: "networkidle" });
check("pass from the database: name and number", await until(async () => (await m.getByTestId("card-name").innerText()) === "Sam" && /no\. 1001/i.test(await m.locator("#app-scroll").innerText())));
await m.goto(`${BASE}/app/place/lantern-house`, { waitUntil: "networkidle" });
check("offer comes from the database", await until(async () => (await m.locator("#app-scroll").innerText()).includes("from the database")));
await m.getByRole("button", { name: "Redeem", exact: true }).click();
await m.waitForURL(/redeem\/lantern-house/);
const issue = log.find((l) => l.path === "/rest/v1/rpc/issue_code");
check("Redeem calls issue_code for the place, with the member's token", issue?.body?.p_place === "lantern-house" && issue.auth.startsWith("Bearer ") && issue.auth !== `Bearer ${issue.apikey}`);
check("the code from the database is on screen (leading zero kept)", (await m.getByTestId("code").innerText()).replace(/\D/g, "") === "042917");

// Staff, in a separate business session on another phone
const sctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await sctx.route(/supabase\.co/, fake);
const s = await sctx.newPage();
s.on("pageerror", (e) => errors.push(`staff: ${e.message}`));
await s.goto(`${BASE}/app/business`, { waitUntil: "networkidle" });
await s.getByLabel("Email").fill("staff@example.com");
await s.getByLabel("Password", { exact: true }).fill("right-password");
await s.getByRole("button", { name: "Sign in", exact: true }).click();
check("staff lands on Scan", await until(async () => /\/app\/business\/scan$/.test(s.url())), s.url());
await s.getByLabel("Or type the code").fill("042917");
await s.getByRole("button", { name: "Confirm", exact: true }).click();
check("confirm_code: Confirmed for Sam, 3 of 4 left", await until(async () => (await s.getByTestId("result").getAttribute("data-result")) === "ok" && (await s.getByTestId("result").innerText()).includes("For Sam")));
const conf = log.find((l) => l.path === "/rest/v1/rpc/confirm_code");
check("confirm_code got the place and the code", conf?.body?.p_place === "lantern-house" && conf?.body?.p_code === "042917");
check("member's phone flips to Redeemed (polls its own row)", await until(async () => (await m.locator("#app-frame").innerText()).includes("Confirmed by staff"), 12000));
await s.getByLabel("Or type the code").fill("042917");
await s.getByRole("button", { name: "Confirm", exact: true }).click();
check("the same code again: Already used", await until(async () => (await s.getByTestId("result").getAttribute("data-result")) === "used"));

// ---- A new business signs up from the app (a third phone)
const bctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await bctx.route(/supabase\.co/, fake);
const b = await bctx.newPage();
b.on("pageerror", (e) => errors.push(`new business: ${e.message}`));
await b.goto(`${BASE}/app/business`, { waitUntil: "networkidle" });
const newLink = b.getByRole("link", { name: "New business? Create an account" });
check("partner login shows New business? Create an account with real accounts", (await newLink.count()) === 1);
await newLink.click();
await b.waitForURL(/\/app\/business\/new$/);
check("real accounts: the form asks for neighbourhood and type, not a place in the app", (await b.getByLabel("Neighbourhood").count()) === 1 && (await b.getByLabel("Type of place").count()) === 1 && (await b.getByLabel("Your place").count()) === 0);
await b.getByLabel("Business name").fill("New Test Bistro");
await b.getByLabel("Your email").fill("confirm-later@example.com");
await b.getByLabel("Choose a password", { exact: true }).fill("right-password");
await b.getByLabel("Neighbourhood").selectOption("Ossington");
await b.getByLabel("Type of place").selectOption("Restaurant");
await b.getByRole("button", { name: "Create account", exact: true }).click();
check("confirm email on: a clear message to confirm first", await until(async () => (await b.getByTestId("form-error").innerText()).includes("confirm it")));
check("no business is made before the email is confirmed", !log.some((l) => l.path === "/rest/v1/rpc/create_my_business"));
await b.getByLabel("Your email").fill("newowner@example.com");
await b.getByRole("button", { name: "Create account", exact: true }).click();
check("the new business lands on its owner dashboard", await until(async () => /\/app\/owner$/.test(b.url()) && (await b.locator("h1").first().innerText()) === "New Test Bistro"), b.url());
const cmb = log.find((l) => l.path === "/rest/v1/rpc/create_my_business");
check(
  "create_my_business: name, neighbourhood and type, public key plus the owner's own token",
  cmb?.body?.p_name === "New Test Bistro" && cmb.body.p_neighbourhood === "Ossington" && cmb.body.p_category === "restaurant" && cmb.apikey?.startsWith("sb_publishable_") && subOf(cmb.auth) === NEW_OWNER,
  JSON.stringify(cmb?.body),
);
check("signed up on the business side (partner session), with the public key", log.some((l) => l.path === "/auth/v1/signup" && l.body?.email === "newowner@example.com" && l.apikey?.startsWith("sb_publishable_")));
check("dashboard says it shows in the app once The 6 Pass approves it", await until(async () => (await b.getByTestId("pending-approval").innerText()).includes("once The 6 Pass approves it")));
await b.getByRole("link", { name: "See what members see" }).click();
check("the owner previews their unpublished place (view?id=)", await until(async () => /\/app\/place\/view\?id=new-test-bistro$/.test(b.url()) && (await b.locator("#app-scroll").innerText()).includes("New Test Bistro")), b.url());

// ---- Places that exist only in the database, on the member's phone
await m.goto(`${BASE}/app`, { waitUntil: "networkidle" });
const explore = async () => m.locator("#app-scroll").innerText();
check("a published database place shows on Explore", await until(async () => (await explore()).includes("Fake Corner Cafe")));
check("an unpublished place is not on Explore for a member", !(await explore()).includes("Fake Hidden Spa") && !(await explore()).includes("New Test Bistro"));
await m.getByRole("link", { name: /Fake Corner Cafe/ }).first().click();
check("its page opens at /app/place/view?id=", await until(async () => /\/app\/place\/view\?id=fake-corner-cafe$/.test(m.url()) && (await m.locator("#app-scroll").innerText()).includes("Second coffee, on us (database place).")), m.url());
await m.getByRole("button", { name: "Redeem", exact: true }).click();
check("Redeem opens /app/redeem/view?id=", await until(async () => /\/app\/redeem\/view\?id=fake-corner-cafe$/.test(m.url())), m.url());
const issue2 = log.find((l) => l.path === "/rest/v1/rpc/issue_code" && l.body?.p_place === "fake-corner-cafe");
check("issue_code for the database place, with the member's token", !!issue2 && subOf(issue2.auth) === MEMBER);
check("its code is on screen", await until(async () => (await m.getByTestId("code").innerText()).replace(/\D/g, "") === "731005"));
await m.goto(`${BASE}/app/place/view?id=fake-corner-cafe`, { waitUntil: "networkidle" });
check("the view page also opens straight from a link", await until(async () => (await m.locator("#app-scroll").innerText()).includes("Fake Corner Cafe")));
check("the member's phone never has the new business's unpublished place", !(await m.evaluate(() => localStorage.getItem("t6p_app_mock_v1") ?? "")).includes("new-test-bistro"));

const all = JSON.stringify(log);
check("never a secret or service role key", !/service_role|sb_secret_/.test(all));
check("no unexpected calls", !log.some((l) => l.unexpected), log.filter((l) => l.unexpected).map((l) => l.unexpected).join(", "));
check("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
