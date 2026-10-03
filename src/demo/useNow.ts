"use client";

import { useSyncExternalStore } from "react";
import { torontoDate, torontoWeekday } from "./time";

function subscribe(tick: () => void) {
  const t = window.setInterval(tick, 1000);
  return () => window.clearInterval(t);
}
const read = () => Math.floor(Date.now() / 1000) * 1000;

/** The time, updated every second. 0 during the static render. */
export function useNow() {
  return useSyncExternalStore(subscribe, read, () => 0);
}

const readDay = () => {
  const d = new Date();
  return `${torontoWeekday(d)}|${torontoDate(d)}`;
};
function subscribeDay(tick: () => void) {
  const t = window.setInterval(tick, 60_000);
  return () => window.clearInterval(t);
}

/**
 * Today in Toronto: weekday (0 = Monday) and YYYY-MM-DD. During the static
 * render it's unknown (-1, ""), so the HTML never bakes in the build day.
 */
export function useToday() {
  const v = useSyncExternalStore(subscribeDay, readDay, () => "-1|");
  const [w, date] = v.split("|");
  return { weekday: Number(w), date };
}
