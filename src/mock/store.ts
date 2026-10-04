"use client";

/*
 * State for the phone app mock at /app. Kept in this browser's
 * localStorage so refresh, Back and closing the window all keep where
 * you were. Two windows of /app stay in sync (the "storage" event), so
 * the member side and the partner side can sit next to each other.
 * Nothing here talks to a server.
 */
import { useSyncExternalStore } from "react";
import { HOME_PARTNER_ID, OFFER_PRESETS, PARTNERS, TODAY, type Partner } from "@/demo/data";

export const CODE_LIFE_MS = 10 * 60 * 1000;
/** The demo always pretends today is Tuesday, March 23, 2027 (a Tuesday after launch). */
export const DEMO_DATE = "2027-03-23";
const KEY = "t6p_app_mock_v1";

export type OfferKind = "two_for_one" | "upgrade";

export type OfferSettings = {
  kind: OfferKind;
  offer: string;
  detail: string;
  saving: number;
  days: boolean[];
  usesPerYear: number;
  blackoutDates: string[];
};

export type Redemption = {
  id: string;
  partnerId: string;
  code: string;
  issuedAt: number;
  status: "issued" | "confirmed" | "cancelled";
  confirmedAt?: number;
  saving: number;
  /** The offer as it was when redeemed, so editing the offer later doesn't rewrite history. */
  offer: string;
};

export type MockState = {
  v: 1;
  offers: Record<string, OfferSettings>;
  used: Record<string, number>;
  redemptions: Redemption[];
  /** Which place the partner view is showing. */
  partnerId: string;
};

export type Place = Partner & { settings: OfferSettings };

const kindOf = (p: Partner): OfferKind => (/upgrade|add-on|longer/i.test(p.offer + p.detail) ? "upgrade" : "two_for_one");

function initial(): MockState {
  return {
    v: 1,
    offers: Object.fromEntries(
      PARTNERS.map((p) => [
        p.id,
        { kind: kindOf(p), offer: p.offer, detail: p.detail, saving: p.saving, days: [...p.days], usesPerYear: p.usesPerYear, blackoutDates: [] },
      ]),
    ),
    used: {},
    redemptions: [],
    partnerId: HOME_PARTNER_ID,
  };
}

const SERVER_STATE = initial();
let cache: MockState | null = null;
const listeners = new Set<() => void>();

function read(): MockState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as MockState;
      if (saved && saved.v === 1) {
        const base = initial();
        cache = { ...base, ...saved, offers: { ...base.offers, ...saved.offers } };
        return cache;
      }
    }
  } catch {
    /* storage blocked or corrupt: start fresh */
  }
  cache = initial();
  return cache;
}

function write(next: MockState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode or full: the demo still works for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useMock() {
  return useSyncExternalStore(subscribe, read, () => SERVER_STATE);
}

/* ---------- Derived values ---------- */

export function places(s: MockState): Place[] {
  return PARTNERS.map((p) => {
    const settings = s.offers[p.id] ?? initial().offers[p.id];
    // Copy the offer fields over the seed, but not `kind`: on a place that's
    // the type of place ("Dinner"), on the settings it's the offer type.
    return { ...p, offer: settings.offer, detail: settings.detail, saving: settings.saving, days: settings.days, usesPerYear: settings.usesPerYear, settings };
  });
}

export function place(s: MockState, id: string): Place | undefined {
  return places(s).find((p) => p.id === id);
}

export function usesLeft(s: MockState, p: Place) {
  return Math.max(0, p.settings.usesPerYear - (s.used[p.id] ?? 0));
}

export type Block = { reason: "blackout" | "not-today" | "used-up"; message: string } | null;

export function blockFor(s: MockState, p: Place, nextDayName: string): Block {
  if (usesLeft(s, p) === 0) return { reason: "used-up", message: "You've used this one for the year." };
  if (p.settings.blackoutDates.includes(DEMO_DATE)) return { reason: "blackout", message: "Not running today. It's a blackout date." };
  if (!p.settings.days[TODAY]) return { reason: "not-today", message: `Not running today. Next: ${nextDayName}.` };
  return null;
}

/** The redemption a member sees for a place: the latest one that wasn't cancelled. */
export function latestFor(s: MockState, id: string) {
  return [...s.redemptions].reverse().find((r) => r.partnerId === id && r.status !== "cancelled");
}

export const isLive = (r: Redemption, now: number) => r.status === "issued" && now - r.issuedAt < CODE_LIFE_MS;

export const offerLabel = (p: Place) =>
  p.settings.kind === "two_for_one" ? "2 for 1" : p.settings.offer === OFFER_PRESETS.find((o) => o.id === "upgrade")?.offer ? "Free add-on" : "Free upgrade";

/* ---------- Actions ---------- */

const newCode = () => String(Math.floor(100000 + Math.random() * 900000));

export const mock = {
  /** Issue a code, or return the one already live for this place. */
  issue(id: string): Redemption | null {
    const s = read();
    const p = place(s, id);
    if (!p) return null;
    const now = Date.now();
    const existing = s.redemptions.find((r) => r.partnerId === id && isLive(r, now));
    if (existing) return existing;
    const r: Redemption = { id: `${now}-${Math.floor(Math.random() * 1e6)}`, partnerId: id, code: newCode(), issuedAt: now, status: "issued", saving: p.settings.saving, offer: p.settings.offer };
    write({ ...s, redemptions: [...s.redemptions, r] });
    return r;
  },
  confirm(redemptionId: string) {
    const s = read();
    const r = s.redemptions.find((x) => x.id === redemptionId);
    if (!r || !isLive(r, Date.now())) return false;
    write({
      ...s,
      redemptions: s.redemptions.map((x) => (x.id === redemptionId ? { ...x, status: "confirmed", confirmedAt: Date.now() } : x)),
      used: { ...s.used, [r.partnerId]: (s.used[r.partnerId] ?? 0) + 1 },
    });
    return true;
  },
  /** Staff typed a code instead of tapping: find it among live codes at this place. */
  confirmCode(partnerId: string, code: string) {
    const r = read().redemptions.find((x) => x.partnerId === partnerId && x.code === code.replace(/\D/g, "") && isLive(x, Date.now()));
    return r ? mock.confirm(r.id) : false;
  },
  cancel(redemptionId: string) {
    const s = read();
    write({ ...s, redemptions: s.redemptions.map((x) => (x.id === redemptionId && x.status === "issued" ? { ...x, status: "cancelled" } : x)) });
  },
  updateOffer(id: string, patch: Partial<OfferSettings>) {
    const s = read();
    const cur = s.offers[id];
    if (!cur) return;
    write({ ...s, offers: { ...s.offers, [id]: { ...cur, ...patch } } });
  },
  setPartner(id: string) {
    write({ ...read(), partnerId: id });
  },
  reset() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    write(initial());
  },
};
