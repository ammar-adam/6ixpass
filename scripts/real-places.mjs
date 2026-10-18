// The private build with real Toronto places, for Ammar and Nida to see the
// app with businesses they know. NOT for merchants or the public site.
//
//   node scripts/real-places.mjs        switch this checkout to real places
//   node scripts/real-places.mjs --undo switch back to the made-up ones
//
// Only facts from our research go in (name, neighbourhood, address, cuisine,
// price level; data/real-places.csv). No invented menus, hours or
// quotes for real businesses. Offers are examples. Photos are our stock
// photos matched by cuisine, never the places' own.
// The iPhone workflow runs this when "places" is "real" (the default).
import fs from "node:fs";

const ACTIVE = "src/demo/places-active.ts";
const OUT = "src/demo/places-real.ts";
const FICTIONAL = `// Which places the app shows. scripts/real-places.mjs points this at the real ones for the private build.\nexport { PLACES, REAL_PLACES } from "./places";\n`;

if (process.argv.includes("--undo")) {
  fs.writeFileSync(ACTIVE, FICTIONAL);
  fs.rmSync(OUT, { force: true });
  console.log("Back to the made-up places.");
  process.exit(0);
}

// ---- Read the research
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") row.push(cell), (cell = "");
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell), (cell = "");
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
};
// The 50 places, already chosen from the partner pipeline (which lives in Google Drive,
// not in this repository): public names, neighbourhoods, addresses and cuisines only.
const picked = parseCsv(fs.readFileSync("data/real-places.csv", "utf8")).slice(0, 50);

// ---- Photos by subject: stock photos only, rotated so neighbours don't match
const SUBJECTS = [
  [/pizza|neapolitan/, ["pizza", "pizza-2"]],
  [/sushi|omakase|japanese(?!.*ramen)|izakaya|kaiseki/, ["sushi"]],
  [/ramen|noodle|udon|soba/, ["kaito", "kaito-2", "kaito-3"]],
  [/thai/, ["thai", "thai-2"]],
  [/korean/, ["kbbq", "dimsum-2"]],
  [/vietnam|pho|banh/, ["pho", "pho-2"]],
  [/burger|diner|american|smash/, ["burger", "burger-2"]],
  [/chinese|dim sum|dumpling|cantonese|szechuan|sichuan|hunan|taiwan/, ["dimsum", "dimsum-2", "harbour-bao", "harbour-bao-2"]],
  [/ethiopian|eritrean|african/, ["ethiopian"]],
  [/mexican|taco|latin|peruvian|oaxaca/, ["comal", "comal-2", "comal-3"]],
  [/persian|iranian|afghan/, ["little-saffron", "little-saffron-2"]],
  [/lebanese|middle eastern|mediterranean|levant|israeli|greek|turkish|syrian|palestin/, ["cedar-salt", "cedar-salt-2", "cedar-salt-3"]],
  [/indian|south asian|pakistani|sri lank|nepal/, ["marigold-room", "marigold-room-2"]],
  [/italian|pasta|trattoria|osteria/, ["fennel-ash", "pizza", "fennel-ash-2", "pizza-2", "fennel-ash-3"]],
  [/french|bistro|brasserie/, ["aurele", "aurele-2"]],
  [/dessert|gelato|ice cream|chocolate|patisserie/, ["dessert"]],
  [/bakery|pastry|bread|croissant|bagel/, ["linden", "linden-2", "linden-3", "linden-4"]],
  [/brunch|breakfast|all-day/, ["half-past-nine", "half-past-nine-2", "morning-ledger-4"]],
  [/\b(coffee|café|cafe|espresso|tea)\b/, ["coffee", "coffee-2", "morning-ledger-2", "morning-ledger-3"]],
  [/vegan|plant|salad|healthy|bowl/, ["greyfield-2", "greyfield-3"]],
  [/steak|grill|chop|seafood|fish|oyster|portuguese/, ["lantern-house", "lantern-house-2"]],
  [/tasting|contemporary|canadian|modern|new american|farm/, ["juniper-table", "lantern-house"]],
];
const SPA = ["quiet-hours", "hearth", "slow-tide", "hearth-3", "quiet-hours-2", "hearth-2"];
const STUDIO = [[/yoga|meditat|breath/, ["morning-light"]], [/pilates|reformer|barre/, ["fieldnote"]], [/cycl|spin|ride/, ["lowlight", "lowlight-2"]]];
const FALLBACK = ["marigold-room-3", "juniper-table", "greyfield", "lantern-house"];
const turn = {};
const rotate = (key, list) => {
  const i = (turn[key] = (turn[key] ?? -1) + 1);
  const hero = list[i % list.length];
  return [hero, list.filter((x) => x !== hero).slice(0, 2)];
};
function photos(r) {
  const text = `${r.cuisine} ${r.name}`.toLowerCase();
  if (r.category === "Spa" || /spa\b|massage|bath|sauna|facial|hammam/.test(text)) return rotate("spa", SPA);
  if (r.category === "Studio") {
    const hit = STUDIO.find(([re]) => re.test(text));
    return rotate(`studio-${hit?.[1][0] ?? "x"}`, hit?.[1] ?? ["fieldnote", "morning-light", "lowlight"]);
  }
  if (r.category === "Hotel restaurant or spa") return rotate("hotel", ["calloway-dining", "aurele-2", "marigold-room-3"]);
  if (r.category === "Café") return rotate("coffee", ["coffee", "coffee-2", "morning-ledger-2"]);
  if (r.category === "Bakery") return rotate("bakery", ["linden", "linden-2", "linden-3", "linden-4"]);
  if (r.category === "Brunch") return rotate("brunch", ["half-past-nine", "half-past-nine-2", "morning-ledger-4"]);
  const hit = SUBJECTS.find(([re]) => re.test(text));
  return hit ? rotate(hit[1][0], hit[1]) : rotate("fallback", FALLBACK);
}

// ---- Offers: examples by kind of place
const OFFERS = {
  Restaurant: ["Second main, on us.", "Order two mains and the second one is on the house."],
  Brunch: ["Second brunch plate, on us.", "Two brunch plates, and the second one is on the house."],
  "Café": ["Second coffee, on us.", "Order two coffees and the second one is on the house."],
  Bakery: ["Second pastry, on us.", "Buy two pastries and the second one is on the house."],
  Spa: ["A free upgrade on your treatment.", "Book a 60-minute treatment and it becomes 90 minutes."],
  Studio: ["Bring a friend to class, free.", "Book a class and bring a friend to the same one, free."],
  "Hotel restaurant or spa": ["Second main, on us.", "Order two mains and the second one is on the house."],
};
const PRICE = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
const SAVE_BY_PRICE = { 1: 14, 2: 22, 3: 32, 4: 48 };
const DAYS = ["1111000", "0111001", "1110000", "0011100", "1101100", "0111100"];
const CATEGORY = { Restaurant: "Dining", Brunch: "Dining", "Café": "Dining", Bakery: "Dining", Spa: "Spa and wellness", Studio: "Studios", "Hotel restaurant or spa": "Hotels" };
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const kindOf = (r) => {
  const c = (r.cuisine || r.category).split(/[,;/(]/)[0].trim();
  const k = c.length > 26 ? c.slice(0, 26).replace(/\s+\S*$/, "") : c;
  return k ? k[0].toUpperCase() + k.slice(1) : r.category;
};
const clean = (s) => s.replace(/[—–]/g, ",").replace(/\s+/g, " ").trim();

const ids = new Set();
const places = picked.map((r, i) => {
  let id = slug(r.name);
  while (ids.has(id)) id += "-2";
  ids.add(id);
  const spa = r.category === "Spa" || (r.category === "Hotel restaurant or spa" && /\bspa\b/i.test(`${r.name} ${r.cuisine}`));
  const [offer, detail] = spa ? OFFERS.Spa : (OFFERS[r.category] ?? OFFERS.Restaurant);
  const price = PRICE[r.price];
  const kind = r.category;
  const saving = kind === "Café" ? 6 : kind === "Bakery" ? 6 : spa ? 60 : kind === "Studio" ? 30 : kind === "Brunch" ? 18 : (SAVE_BY_PRICE[price] ?? 24);
  const [hero, gallery] = photos(r);
  return {
    id,
    image: `/demo/${hero}`,
    ...(hero === "fieldnote" ? { credit: "Photo: Ajrehman, CC BY 3.0" } : {}),
    name: clean(r.name),
    category: spa && kind !== "Spa" ? "Hotels" : (CATEGORY[kind] ?? "Dining"),
    kind: clean(kindOf(r)),
    neighbourhood: r.neighbourhood,
    blurb: "",
    offer,
    detail,
    days: [...DAYS[i % DAYS.length]].map((d) => d === "1"),
    usesPerYear: kind === "Café" || kind === "Bakery" ? 4 : 2,
    saving,
    founding: true,
    details: { address: clean(r.address), ...(price ? { price } : {}), gallery: gallery.map((g) => `/demo/${g}`) },
  };
});

// Check the photos exist before writing anything.
for (const p of places) for (const b of [p.image, ...p.details.gallery]) if (!fs.existsSync(`public${b}-640.webp`) || !fs.existsSync(`public${b}-1200.webp`)) throw new Error(`Missing photo ${b} for ${p.name}`);

fs.writeFileSync(
  OUT,
  `// Generated by scripts/real-places.mjs from our research. Private build only. Do not commit.\n// Real places, shown for illustration: none of them has signed. Offers are examples.\nimport type { DemoPlace } from "./places";\n\nexport const REAL_PLACES = true;\nexport const PLACES: DemoPlace[] = ${JSON.stringify(places, null, 1)};\n`,
);
fs.writeFileSync(ACTIVE, `// Switched to real places by scripts/real-places.mjs. Undo: node scripts/real-places.mjs --undo\nexport { PLACES, REAL_PLACES } from "./places-real";\n`);
const by = {};
for (const p of places) by[p.neighbourhood] = (by[p.neighbourhood] ?? 0) + 1;
console.log(`${places.length} real places:`, by);
