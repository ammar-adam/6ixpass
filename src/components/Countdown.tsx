"use client";

import { useSyncExternalStore } from "react";
import { countdown as copy, site } from "@/content/site";

const target = new Date(site.launchAt).getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

// A one-second clock. On the server (and the first paint) it reads null,
// so the static HTML never shows a stale count.
function subscribe(onTick: () => void) {
  const t = window.setInterval(onTick, 1000);
  return () => window.clearInterval(t);
}
const readClock = () => Math.floor(Date.now() / 1000) * 1000;
const readServerClock = () => null;

/** One quiet line under the form: "Opens Tuesday, March 16 · 149 days, 21 hours to go". */
export function Countdown() {
  const now = useSyncExternalStore(subscribe, readClock, readServerClock);
  if (now !== null && now >= target) {
    return <p className="mt-6 text-[15px] font-semibold">{copy.live}</p>;
  }
  const p = now === null ? null : parts(target - now);
  return (
    <p className="mt-6 text-[15px] text-muted">
      <span className="mr-2 inline-block size-2 rounded-full bg-ok align-middle" aria-hidden="true" />
      {copy.label}.{" "}
      {p && (
        <span className="whitespace-nowrap tabular-nums" data-testid="countdown">
          {p.days} days to go.
        </span>
      )}
    </p>
  );
}
