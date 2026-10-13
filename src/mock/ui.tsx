"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { DAY_LETTERS, DAY_NAMES, TODAY } from "@/demo/data";
import { initialOf } from "./owner";
import type { Place } from "./store";
import { IClose } from "./icons";

/* C2 light. The same values live as CSS variables in app.css; these are for inline use. */
export const C = {
  bg: "#FAF8F5",
  card: "#FFFFFF",
  text: "#16140F",
  sec: "#6E685E",
  line: "rgba(22,20,15,0.12)",
  accent: "#9A5A32",
  ok: "#2E7D57",
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
      <span
        aria-hidden="true"
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{ background: `radial-gradient(120% 90% at 30% 15%, rgba(255,255,255,0.16), transparent 60%), ${p.colour ?? "#C8372A"}`, containerType: "size" }}
      >
        <span className="display leading-none text-white/90" style={{ fontSize: "min(50cqh, 40cqw)" }}>
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

/** One quiet line telling whoever holds the phone what to tap next. */
export function Guide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`hint ${className}`} data-testid="guide">
      <span>{children}</span>
    </p>
  );
}

/** Mon to Sun: the days it runs outlined, today filled. */
export function DayStrip({ days }: { days: boolean[] }) {
  return (
    <>
      <p className="sr-only">
        Runs {DAY_NAMES.filter((_, i) => days[i]).join(", ")}. Today is {DAY_NAMES[TODAY]}.
      </p>
      <div aria-hidden="true" className="days">
        {DAY_LETTERS.map((d, i) => (
          <span key={i} className={days[i] ? (i === TODAY ? "today" : "on") : ""}>
            {d}
          </span>
        ))}
      </div>
    </>
  );
}

/** Uses as dots: dark for each one left. */
export function UseDots({ left, total }: { left: number; total: number }) {
  return (
    <span className="dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < total - left ? "used" : ""} />
      ))}
    </span>
  );
}

// Same logo as the site: Cormorant Garamond bold, the 6 in red italic. Settled; don't redesign.
export function Wordmark({ size = 20, light = false }: { size?: number; light?: boolean }) {
  return (
    <span className="font-bold leading-none" style={{ fontFamily: "var(--font-logo), Georgia, serif", fontSize: size * 1.25, letterSpacing: "-0.3px", color: light ? "#fff" : undefined }}>
      the <span className="italic" style={{ color: light ? "#FF6B5A" : "#E0382A" }}>6</span> pass
    </span>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * A bottom sheet, like iOS: the page dims behind it, grabber, title, Done.
 * Esc closes, Tab stays inside, focus goes back where it was.
 */
export function Sheet({
  title,
  onClose,
  children,
  tall = false,
  close = "Done",
  left,
  right,
  focusFirst,
  id = "sheet",
}: {
  title?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  tall?: boolean;
  close?: "Done" | "Close" | null;
  left?: React.ReactNode;
  right?: React.ReactNode;
  focusFirst?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const first = focusFirst ? ref.current?.querySelector<HTMLElement>(focusFirst) : null;
    (first ?? ref.current)?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const els = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const a = els[0];
      const z = els[els.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z?.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a?.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [focusFirst]);

  return (
    <div className="sheet-wrap">
      <div className="sheet-dim a-fade" onClick={onClose} aria-hidden="true" />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : "Sheet"} className={`sheet a-up outline-none ${tall ? "tall" : ""}`}>
        <div className="sheet-head">
          <div className="flex items-center">{left}</div>
          {title ? (
            <h2 id={`${id}-title`} className="t-head truncate px-2 text-center">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <div className="flex items-center">
            {right ? (
              right
            ) : close === "Close" ? (
              <button type="button" onClick={onClose} aria-label="Close" className="iconbtn">
                <IClose />
              </button>
            ) : close === "Done" ? (
              <button type="button" onClick={onClose} className="navtext font-semibold">
                Done
              </button>
            ) : null}
          </div>
        </div>
        <div className="grabber pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

/** A translucent bar that sticks to the top, with room for the status bar. */
export function NavBar({ left, title, right }: { left?: React.ReactNode; title?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="navbar blur-bar">
      <div className="navbar-row">
        <div className="flex items-center">{left}</div>
        <div className="t-head truncate text-center">{title}</div>
        <div className="flex items-center">{right}</div>
      </div>
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
