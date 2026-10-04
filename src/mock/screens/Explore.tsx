"use client";

import Link from "next/link";
import { useState } from "react";
import { Barbell, Bed, FlowerLotus, ForkKnife, Heart, MagnifyingGlass, Storefront, Ticket, X } from "@phosphor-icons/react";
import { CATEGORIES, NEIGHBOURHOODS, copy, type Category } from "@/demo/data";
import { blockFor, offerLabel, places, useMock, type Block, type Place } from "../store";
import { C, Guide, nextDay, Photo, serif } from "../ui";

export const catIcon: Record<Category, typeof ForkKnife> = {
  Dining: ForkKnife,
  "Spa and wellness": FlowerLotus,
  Studios: Barbell,
  Hotels: Bed,
  Experiences: Ticket,
};

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="m-press min-h-[40px] shrink-0 rounded-full border px-3.5 text-[13px] font-semibold"
      style={active ? { background: C.ice, color: C.iceInk, borderColor: C.ice } : { borderColor: C.line, color: C.soft }}
    >
      {children}
    </button>
  );
}

const badge = (block: Block, p: Place) =>
  !block
    ? copy.explore.runsToday
    : block.reason === "paused"
      ? "Paused"
      : block.reason === "not-today"
        ? `Next: ${nextDay(p.settings.days).slice(0, 3)}`
        : block.reason === "used-up"
          ? "Used for the year"
          : "Blackout today";

/** A place as members see it in the list. Also used by the owner onboarding's review step. */
export function PlaceCard({ p, block, priority = false, href = `/app/place/${p.id}` }: { p: Place; block: Block; priority?: boolean; href?: string | null }) {
  const body = (
    <>
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[22px]">
        <Photo p={p} className="absolute inset-0 size-full" priority={priority} />
        <span className="absolute inset-0 bg-gradient-to-t from-[#0A1424]/60 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: C.ice, color: C.iceInk }}>{offerLabel(p)}</span>
        {p.isOwner ? (
          <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ background: "rgba(10,20,36,0.7)", color: C.ice }}>{copy.place.founding}</span>
        ) : (
          <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/35 backdrop-blur"><Heart size={18} aria-hidden="true" /></span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-semibold backdrop-blur">
          <span className="size-2 rounded-full" style={{ background: block ? (block.reason === "paused" ? C.warn : "#8A97AD") : C.ok }} />
          {badge(block, p)}
        </span>
      </span>
      <span className="mt-3 flex items-baseline justify-between gap-3">
        <span className="min-w-0 break-words text-[24px] leading-tight" style={serif}>{p.name}</span>
        <span className="shrink-0 text-[13px]" style={{ color: C.muted }}>{p.neighbourhood}</span>
      </span>
      <span className="mt-0.5 block text-[15px]" style={{ color: C.muted }}>{p.kind} · {p.settings.offer}</span>
    </>
  );
  return href ? (
    <Link href={href} className="m-press block w-full rounded-[22px] text-left">{body}</Link>
  ) : (
    <div className="w-full">{body}</div>
  );
}

export function Explore() {
  const s = useMock();
  const [category, setCategory] = useState<Category | null>(null);
  const [hood, setHood] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const list = places(s)
    .filter((p) => (!category || p.category === category) && (!hood || p.neighbourhood === hood))
    .filter((p) => !q || `${p.name} ${p.kind} ${p.neighbourhood} ${p.offer}`.toLowerCase().includes(q))
    .map((p) => ({ p, block: blockFor(s, p, nextDay(p.settings.days)) }))
    // The owner's place first, then runs today; the rest keep their order.
    .sort((a, b) => Number(!!b.p.isOwner) - Number(!!a.p.isOwner) || Number(!!a.block) - Number(!!b.block));
  const own = s.owner ? list.find((x) => x.p.isOwner) : undefined;
  const today = list.filter((x) => !x.block).length;

  return (
    <div className="m-enter pb-32">
      {own && <Guide>This is the member app. Tap {own.p.name} to see your offer.</Guide>}
      <header className="px-5 pt-5">
        <p className="text-[13px] font-medium" style={{ color: C.muted }}>{copy.todayLabel} · Toronto</p>
        <h1 className="mt-1 text-[34px] leading-[1.05]" style={serif}>{copy.explore.title}</h1>
        <label className="mt-4 flex h-12 items-center gap-2.5 rounded-2xl border px-4 focus-within:ring-2 focus-within:ring-[#A9D1FF]" style={{ background: C.panel, borderColor: C.line }}>
          <MagnifyingGlass size={19} aria-hidden="true" style={{ color: C.muted }} />
          <span className="sr-only">Search places</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search places or neighbourhoods"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#8593AA]"
            style={{ color: C.text }}
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="grid size-8 place-items-center rounded-full" style={{ color: C.muted }}>
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </label>
      </header>

      <div className="no-scrollbar mt-5 flex gap-5 overflow-x-auto border-b px-5" style={{ borderColor: C.line }} role="group" aria-label="Category">
        {[null, ...CATEGORIES].map((c) => {
          const on = category === c;
          const Icon = c ? catIcon[c] : Storefront;
          return (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={on}
              onClick={() => setCategory(c)}
              className="flex min-h-[56px] shrink-0 flex-col items-center gap-1 border-b-2 pb-2.5 pt-1 text-[12px] font-semibold"
              style={{ borderColor: on ? C.ice : "transparent", color: on ? C.text : C.muted }}
            >
              <Icon size={24} weight={on ? "fill" : "light"} aria-hidden="true" style={{ color: on ? C.ice : undefined }} />
              {c ?? copy.explore.all}
            </button>
          );
        })}
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5" role="group" aria-label="Neighbourhood">
        <Pill active={!hood} onClick={() => setHood(null)}>{copy.explore.anywhere}</Pill>
        {NEIGHBOURHOODS.map((n) => (
          <Pill key={n} active={hood === n} onClick={() => setHood(hood === n ? null : n)}>{n}</Pill>
        ))}
      </div>

      <p className="mt-5 px-5 text-[13px] font-semibold" style={{ color: C.muted }} aria-live="polite">
        {list.length} {list.length === 1 ? "place" : "places"} · {today} {copy.explore.runsToday.toLowerCase()}
      </p>

      <ul className="m-stagger mt-3 space-y-6 px-5">
        {list.map(({ p, block }, i) => (
          <li key={p.id}>
            <PlaceCard p={p} block={block} priority={i < 2} />
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-6 px-5" style={{ color: C.muted }}>{copy.explore.empty}</p>}
    </div>
  );
}
