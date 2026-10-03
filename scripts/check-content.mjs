/*
 * Fails the build if the site says something it must not.
 * Usage: node scripts/check-content.mjs <dir> [<dir> ...]
 *
 * Rules come from the Oct 3, 2026 audit: no "Inc.", no invented prices or
 * counts, one name (The 6 Pass), no app-store claims, and no real business
 * names. To add a name, add it to BANNED_NAMES.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const BANNED_NAMES = [
  "Alo",
  "The Drake",
  "Drake Hotel",
  "Hammam",
  "Don Alfonso",
  "Buca",
  "Hazelton",
  "Edulis",
  "Body Blitz",
  "Toronto Islands Tour",
  "Antler",
  "Civello",
  "Equinox",
];

// [label, regex, file types it applies to]
const TEXT = [".html", ".txt", ".xml", ".json", ".md", ".ts", ".tsx", ".mjs"];
const ALL = [...TEXT, ".js", ".css"];
const RULES = [
  ["Inc.", /\bInc\b\.?/, ALL],
  ["incorporated", /\bincorporated\b/i, ALL],
  ["$199", /\$\s?199\b/, ALL],
  ["199", /\b199\b/, TEXT],
  ["230", /\b230\b/, TEXT],
  ["6ix / 6ixpass", /6ix/i, ALL],
  ["App Store", /App Store/i, ALL],
  ["Google Play", /Google Play/i, ALL],
  ["Buy now", /Buy now/i, ALL],
  ["the6ixpass.ca email", /the6ixpass\.ca/i, ALL],
  // Secret keys must never reach the browser (rule 5 of the Oct 3 brief).
  ["service role key", /service_role/, ALL, { outputOnly: true }],
  ["Supabase secret key", /sb_secret_/, ALL, { outputOnly: true }],
  ["alcohol in copy", /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?)\b/i, [".html", ".txt", ".xml"], { outputOnly: true }],
  ...BANNED_NAMES.map((n) => [`business name "${n}"`, new RegExp(`\\b${n.replace(/ /g, "\\s+")}\\b`), ALL]),
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "media"]);
const SKIP_FILES = new Set(["check-content.mjs", "package-lock.json"]);

function* walk(dir) {
  if (!statSync(dir).isDirectory()) {
    yield dir;
    return;
  }
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(name)) yield* walk(p);
    } else if (!SKIP_FILES.has(name)) {
      yield p;
    }
  }
}

const dirs = process.argv.slice(2);
if (!dirs.length) {
  console.error("Usage: node scripts/check-content.mjs <dir> [<dir> ...]");
  process.exit(2);
}

const problems = [];
for (const dir of dirs) {
  for (const file of walk(dir)) {
    const ext = extname(file) || ".html"; // extensionless output files are pages or images
    if (!ALL.includes(ext)) continue;
    const text = readFileSync(file, "utf8");
    if (text.includes("\u0000")) continue; // binary, e.g. the share image
    const isOutput = /(^|\/)(out|\.next)(\/|$)/.test(dir);
    for (const [label, re, types, opts] of RULES) {
      if (!types.includes(ext)) continue;
      if (opts?.outputOnly && !isOutput) continue;
      const m = text.match(re);
      if (m) {
        const i = m.index ?? 0;
        const snippet = text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, " ");
        problems.push(`${file}: ${label} … ${snippet} …`);
      }
    }
  }
}

if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n` + problems.join("\n"));
  process.exit(1);
}
console.log(`Content check passed (${dirs.join(", ")}).`);
