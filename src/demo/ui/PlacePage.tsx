"use client";

import Link from "next/link";
import { actions, CODE_TTL_MS, remainingMs, getPlace, usesLeft, useDemo } from "../store";
import { mmss, formatDate } from "../time";
import { useNow, useToday } from "../useNow";
import { DayStrip, describeDays } from "@/components/DayStrip";
import { PlaceArt } from "@/components/PlaceArt";

export function PlacePage({ slug }: { slug: string }) {
  const s = useDemo();
  const now = useNow();
  const { weekday: today, date } = useToday();
  const p = getPlace(s, slug);
  if (!p) return null;

  const o = p.offer;
  const left = usesLeft(s, slug);
  const blackoutToday = o.blackoutDates.includes(date);
  const active = s.active?.slug === slug ? s.active : null;
  const expired = active?.status === "issued" && now > 0 && now - active.issuedAt > CODE_TTL_MS;

  let blocked: string | null = null;
  if (o.paused) blocked = "This offer is paused for now.";
  else if (left === 0) blocked = "You've used this offer for the year.";
  else if (blackoutToday) blocked = "Not running today. It's a blackout date.";
  else if (today >= 0 && !o.days[today]) blocked = `Not running today. It runs ${describeDays(o.days)}.`;

  const rules = [
    "In person only. No takeout or delivery.",
    p.food ? "Food and non-alcoholic drinks only." : "Covers the service shown.",
    `Runs ${describeDays(o.days)}${o.blackoutDates.length ? ", except blackout dates" : ""}.`,
    `You can use it ${o.usesPerYear} ${o.usesPerYear === 1 ? "time" : "times"} a year.`,
  ];

  return (
    <article>
      <Link href="/demo" className="inline-flex items-center gap-1 rounded-md py-1 text-sm font-semibold text-muted">
        <span aria-hidden="true">←</span> All places
      </Link>
      <PlaceArt kind={p.art} className="mt-2 h-[200px] rounded-[26px]" />
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-muted">
          {p.neighbourhood} · {p.category}
        </p>
        {p.founding && <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold">Founding Partner</span>}
      </div>
      <h1 className="mt-1 font-serif text-[34px] leading-[1.05]">{p.name}</h1>
      <p className="mt-2 text-muted">{p.blurb}</p>

      <section aria-labelledby="offer-h" className="mt-5 rounded-[26px] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {o.kind === "two_for_one" ? "Two for one" : "Free upgrade"}
        </p>
        <h2 id="offer-h" className="mt-1 text-xl font-semibold leading-snug">{o.title}</h2>
        <p className="mt-1 text-muted">{o.details}</p>
        <div className="mt-4">
          <DayStrip days={o.days} today={today >= 0 ? today : undefined} />
        </div>
        <p className="mt-3 text-sm font-semibold">
          {left} of {o.usesPerYear} uses left this year
        </p>
        <ul className="mt-4 grid gap-2 border-t border-ink/10 pt-4 text-[15px]">
          {rules.map((r) => (
            <li key={r} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ink" />
              {r}
            </li>
          ))}
        </ul>
        {o.blackoutDates.length > 0 && (
          <p className="mt-2 text-sm text-muted">Blackout dates: {o.blackoutDates.map(formatDate).join(", ")}</p>
        )}
      </section>

      <section aria-live="polite" className="mt-4">
        {active?.status === "confirmed" ? (
          <div className="rounded-[26px] bg-ink p-6 text-white">
            <div className="grid size-12 place-items-center rounded-full bg-peach text-ink">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12l5 5L19 7" />
              </svg>
            </div>
            <p className="mt-4 font-serif text-3xl">Confirmed by staff.</p>
            <p className="mt-1 text-pale">Enjoy. You saved about ${o.estimatedSaving}.</p>
            <p className="mt-1 text-sm text-pale">
              {left} of {o.usesPerYear} uses left this year.
            </p>
            <button type="button" onClick={() => actions.cancel()} className="mt-5 w-full rounded-xl bg-peach py-3.5 font-semibold text-ink">
              Done
            </button>
          </div>
        ) : active && !expired ? (
          <div className="rounded-[26px] bg-ink p-6 text-center text-white">
            <p className="text-sm font-semibold text-pale">Show this to staff</p>
            <p className="mt-2 font-mono text-[52px] font-semibold leading-none tracking-[0.18em] text-peach">{active.code}</p>
            <p className="mt-3 text-sm text-pale">
              Expires in <span className="font-semibold tabular-nums text-white">{now ? mmss(remainingMs(active.issuedAt, now)) : "10:00"}</span>
            </p>
            <div className="mt-5 grid gap-2">
              <button type="button" onClick={() => actions.confirm(active.code)} className="rounded-xl bg-peach py-3.5 font-semibold text-ink">
                Staff confirmed it (demo)
              </button>
              <Link href="/demo/staff" className="rounded-xl bg-white/10 py-3 text-sm font-semibold">
                See what your staff see
              </Link>
              <button type="button" onClick={() => actions.cancel()} className="py-2 text-sm font-semibold text-pale underline underline-offset-4">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {expired && <p className="mb-3 rounded-xl bg-peach-soft px-4 py-3 text-sm font-medium">That code ran out after 10 minutes. Get a new one when you&apos;re at the table.</p>}
            {blocked && <p className="mb-3 rounded-xl bg-white px-4 py-3 text-sm font-medium">{blocked}</p>}
            <button
              type="button"
              disabled={!!blocked}
              onClick={() => actions.issue(slug)}
              className="w-full rounded-xl bg-ink py-4 text-lg font-semibold text-white disabled:bg-ink/30"
            >
              Redeem
            </button>
            <p className="mt-2 text-center text-sm text-muted">Tap when you&apos;re at the table or front desk.</p>
            {blocked && !o.paused && (
              <button type="button" onClick={() => actions.issue(slug)} className="mt-2 w-full py-2 text-sm font-semibold underline underline-offset-4">
                Try it anyway (demo)
              </button>
            )}
          </div>
        )}
      </section>
    </article>
  );
}
