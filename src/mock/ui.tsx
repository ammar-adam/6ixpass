"use client";

import { useEffect, useSyncExternalStore } from "react";
import { HandPointing } from "@phosphor-icons/react";
import { DAY_LETTERS, DAY_NAMES, TODAY } from "@/demo/data";
import { initialOf } from "./owner";
import type { Place } from "./store";

/* Direction B ("Concierge"). */
export const C = {
  bg: "#0A1424",
  panel: "#122038",
  line: "rgba(255,255,255,0.09)",
  text: "#F3F6FB",
  soft: "#D5DCE8",
  muted: "#A9B5C9",
  ice: "#A9D1FF",
  iceInk: "#0A1424",
  ok: "#7CE2A4",
  warn: "#FFC9A3",
};
export const serif = { fontFamily: "var(--f-dmserif)" };
export const label = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const cardGlow = {
  background: "linear-gradient(135deg,#1C3560 0%,#0F1E38 55%,#2A4A7A 100%)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 18px 40px -20px rgba(0,0,0,0.8)",
};

export function nextDay(days: boolean[]) {
  for (let i = 1; i <= 7; i++) {
    const d = (TODAY + i) % 7;
    if (days[d]) return DAY_NAMES[d];
  }
  return DAY_NAMES[TODAY];
}

export const splitCode = (c: string) => `${c.slice(0, 3)} ${c.slice(3)}`;

type PhotoPlace = Pick<Place, "image" | "name"> & { photo?: string; colour?: string };

export function Photo({ p, size = 640, className = "", priority = false }: { p: PhotoPlace; size?: 640 | 1200; className?: string; priority?: boolean }) {
  // The owner's place: their own photo, or their colour with the first letter of the name. Never placeholder text.
  if (!p.image) {
    if (p.photo) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={p.photo} alt="" decoding="async" className={`object-cover ${className}`} />;
    }
    return (
      <span aria-hidden="true" className={`flex items-center justify-center overflow-hidden ${className}`} style={{ background: p.colour ?? "#C8372A", containerType: "size" }}>
        <span className="font-bold leading-none text-white/90" style={{ fontFamily: "var(--font-logo), Georgia, serif", fontSize: "min(50cqh, 40cqw)" }}>
          {initialOf(p.name)}
        </span>
      </span>
    );
  }
  return (
    // Static export: photos are pre-sized WebP files in public/demo.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${p.image}-${size}.webp`} alt="" loading={priority ? "eager" : "lazy"} decoding="async" className={`object-cover ${className}`} />
  );
}

/** One short line at the top of a screen, telling whoever holds the phone what to tap next. */
export function Guide({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold" style={{ background: "rgba(169,209,255,0.1)", color: C.ice }} data-testid="guide">
      <HandPointing size={18} weight="fill" aria-hidden="true" className="shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function DayDots({ days }: { days: boolean[] }) {
  return (
    <>
      <p className="sr-only">
        Runs {DAY_NAMES.filter((_, i) => days[i]).join(", ")}. Today is {DAY_NAMES[TODAY]}.
      </p>
      <div aria-hidden="true" className="flex justify-between">
        {DAY_LETTERS.map((d, i) => (
          <span
            key={i}
            className="grid size-9 place-items-center rounded-full text-[13px] font-bold"
            style={
              days[i]
                ? { background: i === TODAY ? C.ice : "rgba(169,209,255,0.18)", color: i === TODAY ? C.iceInk : C.text }
                : { border: `1px solid ${C.line}`, color: "#6B7A93" }
            }
          >
            {d}
          </span>
        ))}
      </div>
    </>
  );
}

// Same logo as the site: Cormorant Garamond bold, the 6 in red italic.
export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <span
      className="font-bold leading-none"
      style={{ fontFamily: "var(--font-logo), Georgia, serif", fontSize: size * 1.25, letterSpacing: "-0.3px" }}
    >
      the <span className="italic" style={{ color: "#FF5A4A" }}>6</span> pass
    </span>
  );
}

export function Ring({ fraction, children }: { fraction: number; children: React.ReactNode }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[108px] shrink-0">
      <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={C.ice} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - fraction)} style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

function subscribeClock(tick: () => void) {
  const t = window.setInterval(tick, 1000);
  return () => window.clearInterval(t);
}
const readClock = () => Math.floor(Date.now() / 1000) * 1000;

/** The time, ticking once a second. 0 while the page is still the static HTML. */
export function useNow() {
  return useSyncExternalStore(subscribeClock, readClock, () => 0);
}

/** Esc does what the screen's back or close button does. */
export function useEscape(onEscape: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) onEscape();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onEscape]);
}
