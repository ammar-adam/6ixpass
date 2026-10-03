"use client";

import Link from "next/link";
import { member, places } from "../data";
import { useDemo } from "../store";
import { formatDate } from "../time";

export function MyPass() {
  const s = useDemo();
  const total = s.history.reduce((n, h) => n + h.saving, 0);
  const name = (slug: string) => places.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <div>
      <h1 className="mt-2 font-serif text-[34px] leading-tight">My pass</h1>

      <div className="relative mt-4 overflow-hidden rounded-[26px] bg-ink p-6 text-white">
        <div aria-hidden="true" className="absolute -right-10 -top-10 size-44 rounded-full border-[14px] border-white/5" />
        <div className="flex items-baseline font-serif text-2xl">
          the
          <span className="mx-1.5 inline-grid size-[24px] -translate-y-[3px] place-items-center rounded-full border-[1.8px] border-white font-sans text-[13px] font-bold">6</span>
          pass
        </div>
        <p className="mt-10 font-serif text-3xl">{member.firstName}</p>
        <p className="mt-1 text-sm text-pale">Member since {member.since} · Toronto</p>
        <p className="mt-4 inline-block rounded-full bg-peach px-3 py-1 text-xs font-semibold text-ink">Demo member</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Saved so far</p>
          <p className="mt-1 font-serif text-4xl">${total}</p>
        </div>
        <div className="rounded-[22px] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Visits</p>
          <p className="mt-1 font-serif text-4xl">{s.history.length}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">Savings are estimates, based on the free item.</p>

      <h2 className="mt-7 text-lg font-semibold">Past visits</h2>
      {s.history.length === 0 ? (
        <p className="mt-2 text-muted">No visits yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-ink/10 rounded-[22px] bg-white px-4">
          {s.history.map((h, i) => (
            <li key={`${h.slug}-${i}`} className="flex items-center justify-between gap-3 py-3.5">
              <div>
                <Link href={`/demo/place/${h.slug}`} className="font-semibold underline-offset-4 hover:underline">
                  {name(h.slug)}
                </Link>
                <p className="text-sm text-muted">{formatDate(h.date)}</p>
              </div>
              <p className="text-sm font-semibold">about ${h.saving}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
