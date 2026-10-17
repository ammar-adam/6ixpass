// Checks the demo places (src/demo/places.ts) follow the rules.
// Run: node --experimental-strip-types scripts/places-check.mjs
import fs from "node:fs";
import { PLACES } from "../src/demo/places.ts";

const ALCOHOL = /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?|alcohol|bar)\b/i;
const NEIGHBOURHOODS = ["Financial District", "King West", "Queen West", "Ossington", "Yorkville", "Leslieville"];
const CATEGORIES = ["Dining", "Spa and wellness", "Studios", "Hotels", "Experiences"];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
let fails = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${!ok && extra ? `  (${extra})` : ""}`);
};
const photo = (base, size) => fs.existsSync(`public${base}-${size}.webp`);

check("at least 24 places", PLACES.length >= 24, PLACES.length);
check("ids are unique", new Set(PLACES.map((p) => p.id)).size === PLACES.length);
check("names are unique", new Set(PLACES.map((p) => p.name)).size === PLACES.length);
check("every launch neighbourhood has 3 or more places", NEIGHBOURHOODS.every((n) => PLACES.filter((p) => p.neighbourhood === n).length >= 3));

for (const p of PLACES) {
  const d = p.details;
  const text = JSON.stringify(p);
  check(`${p.id}: neighbourhood and category are known`, NEIGHBOURHOODS.includes(p.neighbourhood) && CATEGORIES.includes(p.category));
  check(`${p.id}: no em or en dashes`, !/[\u2014\u2013]/.test(text));
  check(`${p.id}: no alcohol words`, !ALCOHOL.test(text.replace(/non-alcoholic/gi, "")), text.match(ALCOHOL)?.[0]);
  check(`${p.id}: address has no street number`, !/\d/.test(d.address), d.address);
  check(`${p.id}: offer runs at least 3 days`, p.days.filter(Boolean).length >= 3);
  check(`${p.id}: uses per year 1 to 12`, p.usesPerYear >= 1 && p.usesPerYear <= 12);
  check(`${p.id}: seven days of hours, valid times`, d.hours.length === 7 && d.hours.every((h) => h === null || (HHMM.test(h[0]) && HHMM.test(h[1]) && h[0] < h[1])));
  check(`${p.id}: offer only on open days`, p.days.every((on, i) => !on || d.hours[i] !== null));
  check(`${p.id}: three menu items with prices`, d.menu.length === 3 && d.menu.every((m) => Number.isInteger(m.price) && m.price > 0 && m.name.length > 2));
  // Two-for-one: the saving is the price of the free item. Upgrades (60 to 90 minutes) save the difference, so they're only checked to be positive.
  const upgrade = /upgrade/i.test(p.offer);
  check(`${p.id}: saving matches a menu price`, upgrade ? p.saving > 0 : d.menu.some((m) => m.price === p.saving), `saving ${p.saving}`);
  check(`${p.id}: note and who wrote it`, d.note.length > 10 && d.noteBy.length > 1);
  check(`${p.id}: every photo exists at both sizes`, [p.image, ...d.gallery].every((b) => photo(b, 640) && photo(b, 1200)), [p.image, ...d.gallery].filter((b) => !photo(b, 640) || !photo(b, 1200)).join(", "));
  check(`${p.id}: price level 1 to 4`, [1, 2, 3, 4].includes(d.price));
}

// Every photo file is used by a place or the site, and every place photo is credited.
const credits = fs.readFileSync("docs/IMAGE-CREDITS.md", "utf8");
for (const p of PLACES) for (const b of [p.image, ...p.details.gallery]) check(`credited: ${b}`, credits.includes(`${b.split("/").pop()}-1200.webp`));
const used = new Set(PLACES.flatMap((p) => [p.image, ...p.details.gallery].map((b) => b.split("/").pop())));
const files = fs.readdirSync("public/demo").map((f) => f.replace(/-(640|1200)\.webp$/, ""));
check("no unused photo files in public/demo", files.every((f) => used.has(f)), [...new Set(files.filter((f) => !used.has(f)))].join(", "));

console.log(`\n${fails ? `${fails} failed` : "all passed"}`);
process.exit(fails ? 1 : 0);
