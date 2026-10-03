import { ImageResponse } from "next/og";

/** The app icon: a "6" in a ring on mist, with room for maskable cropping. */
export function appIcon(size: number) {
  const ring = Math.round(size * 0.52);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e3eceb" }}>
        <div
          style={{
            width: ring,
            height: ring,
            borderRadius: 9999,
            border: `${Math.round(size * 0.035)}px solid #0f2e33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0f2e33",
            fontSize: Math.round(size * 0.3),
            fontWeight: 700,
          }}
        >
          6
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
