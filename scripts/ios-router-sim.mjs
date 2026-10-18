// Serves out/ the way the iPhone app does (ios/App/App/AppDelegate.swift, StaticExportRouter):
// "/" -> /app.html, a path with no extension -> path + ".html", anything else as is.
// No service worker (the app doesn't use one), so /app-sw.js is a 404 here.
//   node scripts/ios-router-sim.mjs 4192   then   BASE=http://localhost:4192 NO_SW=1 node ... scripts/member-walk.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "out");
const PORT = Number(process.argv[2] || 4192);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain; charset=utf-8", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".webmanifest": "application/manifest+json", ".jpg": "image/jpeg" };

function route(p) {
  let clean = p;
  while (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
  if (!clean || clean === "/") return "/app.html";
  return path.extname(clean) ? clean : `${clean}.html`;
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    const file = path.join(ROOT, decodeURIComponent(route(url.pathname)));
    if (url.pathname === "/app-sw.js" || !file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`iPhone routing on http://localhost:${PORT}`));
