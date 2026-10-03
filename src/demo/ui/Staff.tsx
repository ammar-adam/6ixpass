"use client";

import { useState } from "react";
import { exampleWeek, member } from "../data";
import { actions, CODE_TTL_MS, remainingMs, getPlace, useDemo } from "../store";
import { mmss } from "../time";
import { useNow } from "../useNow";
import { DAY_SHORT } from "@/components/DayStrip";
import { StaffPlacePicker } from "./StaffPlacePicker";

export function Staff() {
  const s = useDemo();
  const now = useNow();
  const p = getPlace(s, s.staffSlug);
  const [typed, setTyped] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const a = s.active;
  const incoming = a && a.slug === s.staffSlug && a.status === "issued" && (now === 0 || now - a.issuedAt <= CODE_TTL_MS) ? a : null;
  const justConfirmed = a && a.slug === s.staffSlug && a.status === "confirmed" ? a : null;
  const max = Math.max(...exampleWeek.redemptions, 1);

  function confirmTyped(e: React.FormEvent) {
    e.preventDefault();
    const ok = actions.confirm(typed.trim());
    setMsg(ok ? "Confirmed. The guest's second one is on the house." : "That code doesn't match an open redemption here. Check it with the guest.");
    if (ok) setTyped("");
  }

  return (
    <div>
      <StaffPlacePicker />

      <h1 className="mt-6 font-serif text-[30px] leading-tight">Redemptions</h1>

      <section aria-live="polite" className="mt-3">
        {incoming ? (
          <div className="rounded-[24px] border-[1.5px] border-ink p-5">
            <p className="text-sm font-semibold text-muted">New at the table</p>
            <p className="mt-1 text-lg font-semibold">{member.firstName}, {p?.offer.title}</p>
            <p className="mt-3 font-mono text-[44px] font-semibold leading-none tracking-[0.18em]">{incoming.code}</p>
            <p className="mt-2 text-sm text-muted">
              Check the guest&apos;s screen shows the same code. Expires in {now ? mmss(remainingMs(incoming.issuedAt, now)) : "10:00"}.
            </p>
            <button type="button" onClick={() => actions.confirm(incoming.code)} className="mt-4 w-full rounded-xl bg-ink py-3.5 font-semibold text-white">
              Confirm
            </button>
          </div>
        ) : justConfirmed ? (
          <p className="rounded-[24px] bg-mist p-5 font-semibold">Confirmed. Code {justConfirmed.code}. The second one is on the house.</p>
        ) : (
          <p className="rounded-[24px] bg-mist p-5 text-muted">
            No one waiting. When a member taps Redeem here, their code shows up on this screen.
          </p>
        )}
      </section>

      <form onSubmit={confirmTyped} className="mt-4">
        <label htmlFor="code" className="text-sm font-semibold">
          Or type the code from the guest&apos;s phone
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={typed}
            onChange={(e) => setTyped(e.target.value.replace(/\D/g, ""))}
            className="min-w-0 flex-1 rounded-xl border-[1.5px] border-ink/30 px-4 py-3 font-mono text-xl tracking-[0.2em]"
            placeholder="000000"
          />
          <button type="submit" className="rounded-xl bg-ink px-5 font-semibold text-white">
            Check
          </button>
        </div>
        {msg && <p className="mt-2 text-sm font-medium" role="status">{msg}</p>}
      </form>

      <section aria-labelledby="week-h" className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 id="week-h" className="text-lg font-semibold">This week</h2>
          <p className="text-xs text-muted">Example numbers</p>
        </div>
        <div className="mt-3 grid grid-cols-7 items-end gap-1.5" role="img" aria-label={`Redemptions this week: ${exampleWeek.redemptions.map((n, i) => `${DAY_SHORT[i]} ${n}`).join(", ")}`}>
          {exampleWeek.redemptions.map((n, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold">{n || ""}</span>
              <div className="flex h-28 w-full flex-col justify-end overflow-hidden rounded-lg bg-mist">
                <div className="w-full bg-ink" style={{ height: `${(n / max) * 100}%` }}>
                  <div className="w-full bg-peach" style={{ height: `${n ? (exampleWeek.firstTime[i] / n) * 100 : 0}%` }} />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-muted">{DAY_SHORT[i]}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 flex gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-ink" />Redemptions</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-peach" />First-time guests</span>
        </p>
        <p className="mt-3 text-sm">
          {exampleWeek.redemptions.reduce((a, b) => a + b, 0)} redemptions, {exampleWeek.firstTime.reduce((a, b) => a + b, 0)} of them first-time guests.
        </p>
      </section>
    </div>
  );
}
