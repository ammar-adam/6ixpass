"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, neighbourhoods, member, type Category, type Neighbourhood } from "../data";
import { getPlaces, usesLeft, useDemo } from "../store";
import { useToday } from "../useNow";
import { PlaceArt } from "@/components/PlaceArt";
import { Chip } from "./Chip";

export function Explore() {
  const s = useDemo();
  const [cat, setCat] = useState<Category | null>(null);
  const [hood, setHood] = useState<Neighbourhood | null>(null);
  const today = useToday().weekday;
  const list = getPlaces(s).filter(
    (p) => !p.offer.paused && (!cat || p.category === cat) && (!hood || p.neighbourhood === hood),
  );

  return (
    <div>
      <h1 className="mt-2 font-serif text-[34px] leading-tight">Hi {member.firstName}.</h1>
      <p className="text-muted">Where are you going this week?</p>

      <fieldset className="mt-5 min-w-0">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Category</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <Chip on={!cat} onClick={() => setCat(null)}>All</Chip>
          {categories.map((c) => (
            <Chip key={c} on={cat === c} onClick={() => setCat(cat === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-3 min-w-0">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Neighbourhood</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <Chip on={!hood} onClick={() => setHood(null)}>Anywhere</Chip>
          {neighbourhoods.map((n) => (
            <Chip key={n} on={hood === n} onClick={() => setHood(hood === n ? null : n)}>
              {n}
            </Chip>
          ))}
        </div>
      </fieldset>

      <p className="mt-6 text-sm font-semibold" aria-live="polite">
        {list.length} {list.length === 1 ? "place" : "places"}
      </p>
      <ul className="mt-3 grid gap-3">
        {list.map((p) => {
          const runsToday = today >= 0 && p.offer.days[today];
          const left = usesLeft(s, p.slug);
          return (
            <li key={p.slug}>
              <Link href={`/demo/place/${p.slug}`} className="flex gap-3 rounded-[22px] bg-white p-3 active:scale-[0.99]">
                <PlaceArt kind={p.art} className="size-[88px] shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-xs font-semibold text-muted">
                    {p.neighbourhood} · {p.category}
                  </p>
                  <p className="truncate font-serif text-[21px] leading-tight">{p.name}</p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-snug">{p.offer.title}</p>
                  <p className="mt-1.5 flex flex-wrap gap-1.5 text-[12px] font-semibold">
                    {today >= 0 && (
                      <span className={`rounded-full px-2 py-0.5 ${runsToday ? "bg-ink text-white" : "bg-mist text-muted"}`}>
                        {runsToday ? "On today" : "Not today"}
                      </span>
                    )}
                    <span className="rounded-full bg-mist px-2 py-0.5 text-muted">
                      {left} of {p.offer.usesPerYear} left
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="mt-4 rounded-2xl bg-white p-5 text-muted">Nothing here yet. Try another neighbourhood.</p>}
    </div>
  );
}
