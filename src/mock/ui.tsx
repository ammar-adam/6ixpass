"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
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
    // A deep tile in their colour, like a cover photo, with the initial in the place-name serif.
    const c = p.colour ?? "#C8372A";
    return (
      <span
        aria-hidden="true"
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{
          background: `radial-gradient(90% 70% at 25% 10%, rgba(255,255,255,0.14), transparent 60%), linear-gradient(160deg, color-mix(in oklab, ${c} 88%, #fff) 0%, ${c} 45%, color-mix(in oklab, ${c} 55%, #16140F) 100%)`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          containerType: "size",
        }}
      >
        <span className="display italic leading-none text-[#F4F1EC]/90" style={{ fontSize: "min(44cqh, 36cqw)", textShadow: "0 2px 18px rgba(0,0,0,0.18)" }}>
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

/* Tap hints for practising the demo. Off by default, so owners see a clean app. Kept apart from the demo state, so New meeting doesn't reset it. */
const HINTS_KEY = "t6p_hints";
const HINTS_EVENT = "t6p-hints";
function subscribeHints(l: () => void) {
  window.addEventListener(HINTS_EVENT, l);
  window.addEventListener("storage", l);
  return () => {
    window.removeEventListener(HINTS_EVENT, l);
    window.removeEventListener("storage", l);
  };
}
function readHints() {
  try {
    return window.localStorage.getItem(HINTS_KEY) === "1";
  } catch {
    return false;
  }
}
export function useHints() {
  return useSyncExternalStore(subscribeHints, readHints, () => false);
}
export function setHints(on: boolean) {
  try {
    window.localStorage.setItem(HINTS_KEY, on ? "1" : "0");
  } catch {
    /* blocked storage: hints just stay off */
  }
  window.dispatchEvent(new Event(HINTS_EVENT));
}

/*
 * Saved places (the heart). Kept apart from the demo state like the hints,
 * so a member's saved list survives New meeting.
 */
const SAVED_KEY = "t6p_saved";
const SAVED_EVENT = "t6p-saved";
let savedCache: string[] | null = null;
function readSaved(): string[] {
  if (savedCache) return savedCache;
  try {
    const v = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
    savedCache = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    savedCache = [];
  }
  return savedCache;
}
const NO_SAVED: string[] = [];
function subscribeSaved(l: () => void) {
  const h = () => {
    savedCache = null;
    l();
  };
  window.addEventListener(SAVED_EVENT, h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener(SAVED_EVENT, h);
    window.removeEventListener("storage", h);
  };
}
export function useSaved() {
  return useSyncExternalStore(subscribeSaved, readSaved, () => NO_SAVED);
}
export function toggleSaved(id: string) {
  const cur = readSaved();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  } catch {
    /* blocked storage: it just won't be remembered */
  }
  window.dispatchEvent(new Event(SAVED_EVENT));
}

/*
 * A tap you can feel, in the iPhone app (Capacitor's Haptics plugin).
 * On the website it does nothing.
 */
type HapticKind = "light" | "medium" | "success";
export function haptic(kind: HapticKind = "light") {
  if (!Capacitor.isNativePlatform()) return;
  const p = kind === "success" ? Haptics.notification({ type: NotificationType.Success }) : Haptics.impact({ style: kind === "medium" ? ImpactStyle.Medium : ImpactStyle.Light });
  p.catch(() => {});
}

/** One quiet line telling whoever holds the phone what to tap next. Shown only with tap hints on, unless `always`. */
export function Guide({ children, className = "", always = false }: { children: React.ReactNode; className?: string; always?: boolean }) {
  const hints = useHints();
  if (!always && !hints) return null;
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
