/*
 * `npm run app`: starts the site in development mode and points you at the
 * app mock. Works the same on Windows, macOS and Linux.
 * Set OPEN_BROWSER=1 to open the browser by itself (run-app.bat does).
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const port = process.env.PORT || "3000";

const child = spawn(process.execPath, [nextBin, "dev", "-p", port], { stdio: ["inherit", "pipe", "inherit"], env: process.env });

let announced = false;
let base = `http://localhost:${port}`;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  const local = text.match(/Local:\s+(http:\/\/[^\s]+)/);
  if (local) base = local[1].replace(/\/$/, "");
  if (!announced && /Ready in|ready started/i.test(text)) {
    announced = true;
    const url = `${base}/app`;
    console.log("\n  ==============================================");
    console.log(`  The 6 Pass app mock is running:  ${url}`);
    console.log("  Leave this window open while you use it.");
    console.log("  To stop it, close this window or press Ctrl+C.");
    console.log("  ==============================================\n");
    if (process.env.OPEN_BROWSER === "1") openBrowser(url);
  }
});

function openBrowser(url) {
  const [cmd, args] =
    process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    /* no browser to open: the address is printed above */
  }
}

const stop = () => child.kill("SIGINT");
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", (code) => process.exit(code ?? 0));
