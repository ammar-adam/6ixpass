import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

type Card = { headline: string; headlineItalic: string; pill: string; note: string; fontSize?: number };

/**
 * The share image shown when a link is posted in a chat or on social.
 * Same look as the site and app: warm white, ink, Cormorant, the settled logo
 * (Cormorant bold, the 6 in red italic), and an example photo on the right.
 */
export async function ogCard({ headline, headlineItalic, pill, note, fontSize = 104 }: Card) {
  const dir = join(process.cwd(), "src/app/_og");
  const [display, logo, logoItalic, sans, photo] = await Promise.all([
    readFile(join(dir, "cormorant-garamond-latin-600-normal.woff")),
    readFile(join(dir, "cormorant-garamond-latin-700-normal.woff")),
    readFile(join(dir, "cormorant-garamond-latin-700-italic.woff")),
    readFile(join(dir, "inter-latin-600-normal.woff")),
    readFile(join(dir, "photo.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FAF8F5", color: "#16140F", padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, paddingRight: 40 }}>
          <div style={{ display: "flex", fontFamily: "Logo", fontWeight: 700, fontSize: 52, letterSpacing: -1, lineHeight: 1 }}>
            the
            <span style={{ fontStyle: "italic", color: "#E0382A", margin: "0 12px" }}>6</span>
            pass
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontWeight: 600, fontSize, lineHeight: 1, letterSpacing: -2 }}>
            <div style={{ display: "flex" }}>{headline}</div>
            {headlineItalic ? <div style={{ display: "flex", fontFamily: "Logo", fontStyle: "italic", fontWeight: 700 }}>{headlineItalic}</div> : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "UI", fontWeight: 600, fontSize: 22, lineHeight: 1.3, color: "#2B2823" }}>
            <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap", background: "#16140F", color: "#FFFFFF", borderRadius: 999, padding: "8px 20px", marginRight: 16 }}>{pill}</div>
            <div style={{ display: "flex", flex: 1 }}>{note}</div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, borderRadius: 24, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered into a PNG at build time */}
          <img src={photoSrc} alt="" width={432} height={502} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Display", data: display, style: "normal", weight: 600 },
        { name: "Logo", data: logo, style: "normal", weight: 700 },
        { name: "Logo", data: logoItalic, style: "italic", weight: 700 },
        { name: "UI", data: sans, style: "normal", weight: 600 },
      ],
    },
  );
}
