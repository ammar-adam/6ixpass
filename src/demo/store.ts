"use client";

/*
 * Demo state: kept in this browser only (localStorage), so Nida can change
 * an offer on the staff side and see it on the member side. "Reset demo"
 * puts everything back.
 */
import { useSyncExternalStore } from "react";
import { torontoDate } from "./time";
import { places as seedPlaces, seedHistory, type Offer, type Place } from "./data";

export type Redemption = {
  slug: string;
  code: string;
  issuedAt: number;
  status: "issued" | "confirmed";
  confirmedAt?: number;
};

export type DemoState = {
  offers: Record<string, Offer>;
  used: Record<string, number>;
  history: { slug: string; date: string; saving: number }[];
  active: Redemption | null;
  staffSlug: string;
};

export const CODE_TTL_MS = 10 * 60 * 1000;

/** Time left on a code, never more than the full 10 minutes. */
export function remainingMs(issuedAt: number, now: number) {
  return Math.min(CODE_TTL_MS, CODE_TTL_MS - (now - issuedAt));
}
const KEY = "t6p_demo_v1";

function initial(): DemoState {
  const used: Record<string, number> = {};
  for (const h of seedHistory) used[h.slug] = (used[h.slug] ?? 0) + 1;
  return {
    offers: Object.fromEntries(seedPlaces.map((p) => [p.slug, p.offer])),
    used,
    history: [...seedHistory],
    active: null,
    staffSlug: "lantern-house",
  };
}

const SERVER_STATE = initial();
let state: DemoState | null = null;
const listeners = new Set<() => void>();

function load(): DemoState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as DemoState;
      state = { ...initial(), ...saved, offers: { ...initial().offers, ...saved.offers } };
      return state;
    }
  } catch {
    /* ignore */
  }
  state = initial();
  return state;
}

function set(next: DemoState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDemo() {
  return useSyncExternalStore(subscribe, load, () => SERVER_STATE);
}

export function getPlaces(s: DemoState): Place[] {
  return seedPlaces.map((p) => ({ ...p, offer: s.offers[p.slug] ?? p.offer }));
}

export function getPlace(s: DemoState, slug: string): Place | undefined {
  return getPlaces(s).find((p) => p.slug === slug);
}

export function usesLeft(s: DemoState, slug: string) {
  const p = getPlace(s, slug);
  if (!p) return 0;
  return Math.max(0, p.offer.usesPerYear - (s.used[slug] ?? 0));
}

export const actions = {
  issue(slug: string) {
    const s = load();
    const code = String(Math.floor(100000 + Math.random() * 900000));
    set({ ...s, active: { slug, code, issuedAt: Date.now(), status: "issued" } });
  },
  confirm(code: string) {
    const s = load();
    const a = s.active;
    if (!a || a.code !== code || a.status !== "issued") return false;
    if (Date.now() - a.issuedAt > CODE_TTL_MS) return false;
    const p = getPlace(s, a.slug);
    const today = torontoDate();
    set({
      ...s,
      active: { ...a, status: "confirmed", confirmedAt: Date.now() },
      used: { ...s.used, [a.slug]: (s.used[a.slug] ?? 0) + 1 },
      history: [{ slug: a.slug, date: today, saving: p?.offer.estimatedSaving ?? 0 }, ...s.history],
    });
    return true;
  },
  cancel() {
    set({ ...load(), active: null });
  },
  updateOffer(slug: string, patch: Partial<Offer>) {
    const s = load();
    const current = s.offers[slug];
    if (!current) return;
    set({ ...s, offers: { ...s.offers, [slug]: { ...current, ...patch } } });
  },
  setStaffPlace(slug: string) {
    set({ ...load(), staffSlug: slug });
  },
  reset() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    set(initial());
  },
};
