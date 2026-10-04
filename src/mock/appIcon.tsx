import { ImageResponse } from "next/og";

/** App icon: the ringed 6 in ice on navy. `safe` shrinks it for maskable crops. */
export function appIcon(size: number, safe = false) {
  const ring = Math.round(size * (safe ? 0.42 : 0.6));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1424" }}>
        <div
          style={{
            width: ring,
            height: ring,
            borderRadius: 9999,
            border: `${Math.round(size * 0.04)}px solid #a9d1ff`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f6fb",
            fontSize: Math.round(ring * 0.58),
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
