import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

type Card = { headline: string; headlineItalic: string; pill: string; note: string; fontSize?: number };

/** The share image shown when a link is posted in a chat or on social. */
export async function ogCard({ headline, headlineItalic, pill, note, fontSize = 112 }: Card) {
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
          background: "#ffffff",
          color: "#15191c",
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
              border: "3px solid #15191c",
              fontFamily: "Schibsted",
              fontSize: 24,
            }}
          >
            6
          </div>
          pass
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize, lineHeight: 1, letterSpacing: -3 }}>
          <div style={{ display: "flex" }}>{headline}</div>
          <div style={{ display: "flex", fontStyle: "italic" }}>{headlineItalic}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Schibsted", fontSize: 26 }}>
          <div style={{ display: "flex", background: "#f4b393", borderRadius: 999, padding: "6px 18px", marginRight: 16 }}>
            {pill}
          </div>
          {note}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 400 },
        { name: "Newsreader", data: serifItalic, style: "italic", weight: 400 },
        { name: "Schibsted", data: sans, style: "normal", weight: 600 },
      ],
    },
  );
}
