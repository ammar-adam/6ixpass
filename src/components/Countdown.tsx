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

export function Countdown() {
  const now = useSyncExternalStore(subscribe, readClock, readServerClock);

  if (now !== null && now >= target) {
    return <p className="font-serif text-4xl">{copy.live}</p>;
  }

  const p = now === null ? null : parts(target - now);
  const units = [
    { label: "Days", value: p?.days },
    { label: "Hours", value: p?.hours },
    { label: "Minutes", value: p?.minutes },
    { label: "Seconds", value: p?.seconds },
  ];

  return (
    <div>
      <p className="sr-only">
        {p ? `${p.days} days and ${p.hours} hours to go.` : copy.text}
      </p>
      <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((u) => (
          <div key={u.label} className="rounded-2xl bg-white/[0.06] px-2 py-4 text-center ring-1 ring-mist/20 sm:px-4 sm:py-6">
            <p className="font-serif text-[clamp(34px,7vw,80px)] leading-none tabular-nums">
              {u.value === undefined ? "–" : String(u.value).padStart(2, "0")}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-pale sm:text-sm">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
