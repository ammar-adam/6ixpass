import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hero, site } from "@/content/site";

export const dynamic = "force-static";
export const alt = "The 6 Pass. Toronto, two for one.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const dir = join(process.cwd(), "src/app/_og");
  const [serif, serifItalic, sans] = await Promise.all([
    readFile(join(dir, "newsreader-latin-400-normal.woff")),
    readFile(join(dir, "newsreader-latin-400-italic.woff")),
    readFile(join(dir, "schibsted-grotesk-latin-600-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#e3eceb",
          color: "#0f2e33",
          padding: "64px 72px",
          fontFamily: "Newsreader",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 40 }}>
          the
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              margin: "0 10px",
              borderRadius: 999,
              border: "3px solid #0f2e33",
              fontFamily: "Schibsted",
              fontSize: 24,
            }}
          >
            6
          </div>
          pass
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>
          <div style={{ display: "flex" }}>{hero.headline}</div>
          <div style={{ display: "flex", fontStyle: "italic" }}>{hero.headlineItalic}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Schibsted", fontSize: 26 }}>
          <div style={{ display: "flex", background: "#f4b393", borderRadius: 999, padding: "6px 18px", marginRight: 16 }}>
            {site.launchShort}
          </div>
          Join the waitlist for founding member pricing
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 400 },
        { name: "Newsreader", data: serifItalic, style: "italic", weight: 400 },
        { name: "Schibsted", data: sans, style: "normal", weight: 600 },
      ],
    },
  );
}
