/*
 * Placeholder art for a place, in the site palette. Swapped for real,
 * credited photography once it can be added (see docs/IMAGE-CREDITS.md).
 */
export type ArtKind = "restaurant" | "cafe" | "spa" | "studio" | "hotel" | "experience";

export function PlaceArt({ kind, className = "" }: { kind: ArtKind; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative overflow-hidden bg-peach-soft ${className}`}>
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {kind === "restaurant" && (
          <>
            <rect width="400" height="240" fill="#f9d6c3" />
            <rect y="150" width="400" height="90" fill="#d3e0df" />
            <rect y="146" width="400" height="6" fill="#f4b393" />
            <ellipse cx="140" cy="182" rx="58" ry="16" fill="#fff" />
            <ellipse cx="140" cy="180" rx="34" ry="9" fill="#e3eceb" />
            <ellipse cx="270" cy="186" rx="58" ry="16" fill="#fff" />
            <ellipse cx="270" cy="184" rx="34" ry="9" fill="#e3eceb" />
            <rect x="196" y="160" width="4" height="40" rx="2" fill="#0f2e33" opacity=".35" />
            <circle cx="320" cy="70" r="26" fill="#fff" opacity=".7" />
          </>
        )}
        {kind === "cafe" && (
          <>
            <rect width="400" height="240" fill="#e3eceb" />
            <rect y="160" width="400" height="80" fill="#f9d6c3" />
            <path d="M150 120h90v40a45 45 0 0 1-90 0z" fill="#fff" />
            <path d="M240 130a18 18 0 0 1 0 36" fill="none" stroke="#fff" strokeWidth="8" />
            <ellipse cx="195" cy="122" rx="45" ry="8" fill="#f4b393" />
            <path d="M180 100c-8-12 8-18 0-30M205 100c-8-12 8-18 0-30" fill="none" stroke="#0f2e33" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {kind === "spa" && (
          <>
            <rect width="400" height="240" fill="#d3e0df" />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx="200" cy="170" rx={40 + i * 42} ry={10 + i * 11} fill="none" stroke="#fff" strokeOpacity={0.8 - i * 0.13} strokeWidth="3" />
            ))}
            <circle cx="200" cy="80" r="30" fill="#f9d6c3" />
            <ellipse cx="200" cy="170" rx="22" ry="6" fill="#f4b393" />
          </>
        )}
        {kind === "studio" && (
          <>
            <rect width="400" height="240" fill="#f9d6c3" />
            <rect x="0" y="0" width="130" height="240" fill="#e3eceb" />
            <rect x="60" y="150" width="280" height="40" rx="6" fill="#0f2e33" opacity=".85" transform="rotate(-8 200 170)" />
            <rect x="80" y="196" width="260" height="30" rx="6" fill="#f4b393" transform="rotate(-8 200 210)" />
            <circle cx="300" cy="70" r="34" fill="#fff" opacity=".75" />
          </>
        )}
        {kind === "hotel" && (
          <>
            <rect width="400" height="240" fill="#0f2e33" />
            {Array.from({ length: 24 }).map((_, i) => (
              <rect key={i} x={40 + (i % 6) * 55} y={30 + Math.floor(i / 6) * 48} width="34" height="28" rx="3" fill={[2, 9, 15, 20].includes(i) ? "#f4b393" : "#1d4b52"} />
            ))}
          </>
        )}
        {kind === "experience" && (
          <>
            <rect width="400" height="240" fill="#e3eceb" />
            <ellipse cx="200" cy="200" rx="120" ry="22" fill="#d3e0df" />
            <path d="M140 110c0 60 20 90 60 90s60-30 60-90z" fill="#f4b393" />
            <ellipse cx="200" cy="110" rx="60" ry="14" fill="#f9d6c3" />
            <ellipse cx="200" cy="110" rx="40" ry="8" fill="#e3eceb" />
          </>
        )}
      </svg>
    </div>
  );
}
