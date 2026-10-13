import { ImageResponse } from "next/og";

/** App icon in the app's look: a cream 6 on ink, with the logo's red as a small mark. `safe` shrinks it for maskable crops. */
export function appIcon(size: number, safe = false) {
  const k = safe ? 0.7 : 1;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16140F" }}>
        <div style={{ display: "flex", position: "relative", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#F4F1EC", fontSize: Math.round(size * 0.62 * k), fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>6</span>
          <span
            style={{
              position: "absolute",
              right: -Math.round(size * 0.07 * k),
              bottom: Math.round(size * 0.1 * k),
              width: Math.round(size * 0.075 * k),
              height: Math.round(size * 0.075 * k),
              borderRadius: 9999,
              background: "#E0382A",
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
