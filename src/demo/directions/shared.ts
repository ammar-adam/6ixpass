"use client";

/*
 * Shared logic for the three design directions (redesign step 2).
 * Same data and rules as the real demo; only the look differs.
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { DAY_NAMES, DAY_SHORT, PARTNERS, TODAY, type Partner } from "../data";

import type { ScreenName } from "./screens";
export type { ScreenName } from "./screens";
export const DEMO_PLACE = "lantern-house";
export const CODE_LIFE_MS = 10 * 60 * 1000;

export const photo = (p: Partner, size: 640 | 1200 = 640) => `${p.image}-${size}.webp`;
export const runsToday = (p: Partner) => p.days[TODAY];
export const daysLabel = (days: boolean[]) => DAY_SHORT.filter((_, i) => days[i]).join(", ");
export const offerKind = (p: Partner) => (/upgrade|add-on|longer|extra/i.test(p.offer + p.detail) ? "Free upgrade" : "2 for 1");

export function nextDay(days: boolean[]) {
  for (let i = 1; i <= 7; i++) {
    const d = (TODAY + i) % 7;
    if (days[d]) return DAY_NAMES[d];
  }
  return DAY_NAMES[TODAY];
}

export const byId = (id: string) => PARTNERS.find((p) => p.id === id) ?? PARTNERS[0];

/** Screen state for one direction: which screen, which place, the code and its status. */
export function useFlow(initial: ScreenName) {
  const [screen, setScreen] = useState<ScreenName>(initial);
  const [placeId, setPlaceId] = useState(DEMO_PLACE);
  const [code, setCode] = useState("482 913");
  const [issuedAt, setIssuedAt] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const open = useCallback((id: string) => {
    setPlaceId(id);
    setScreen("place");
  }, []);
  const redeem = useCallback(() => {
    const n = String(Math.floor(100000 + Math.random() * 900000));
    setCode(`${n.slice(0, 3)} ${n.slice(3)}`);
    setIssuedAt(Date.now());
    setConfirmed(false);
    setScreen("redeem");
  }, []);
  const back = useCallback(() => setScreen((s) => (s === "redeem" ? "place" : "browse")), []);

  return { screen, setScreen, place: byId(placeId), open, redeem, back, code, issuedAt, confirmed, confirm: () => setConfirmed(true) };
}

function subscribe(tick: () => void) {
  const t = window.setInterval(tick, 1000);
  return () => window.clearInterval(t);
}
const readNow = () => Math.floor(Date.now() / 1000) * 1000;

/** Seconds left on a code: 600 before hydration or when the code is fresh. */
export function useSecondsLeft(issuedAt: number) {
  const now = useSyncExternalStore(subscribe, readNow, () => 0);
  if (!issuedAt || !now) return 600;
  return Math.max(0, Math.min(600, Math.ceil((CODE_LIFE_MS - (now - issuedAt)) / 1000)));
}

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Restarts a CSS animation when `key` changes (for screen transitions). */
export function useEnterKey(key: string) {
  const [k, setK] = useState(key);
  useEffect(() => {
    const t = window.setTimeout(() => setK(key), 0);
    return () => window.clearTimeout(t);
  }, [key]);
  return k;
}
