"use client";

/*
 * Direction C: "Weekend". Warm, friendly, lots of photos at once. For
 * newcomers and students finding their way around the city: browsing
 * feels like flicking through a feed, and the code is a ticket stub.
 */
import { useState } from "react";
import {
  Barbell, Bed, CalendarCheck, CaretLeft, CheckCircle, Compass, ForkKnife, FlowerLotus, Heart, MagnifyingGlass,
  MapPin, Receipt, Scan, ShareNetwork, Ticket, Ticket as TicketIcon, Sparkle, X, CaretDown,
} from "@phosphor-icons/react";
import { CATEGORIES, DAY_LETTERS, NEIGHBOURHOODS, PARTNERS, TODAY, copy, type Category, type Partner } from "../data";
import { daysLabel, mmss, nextDay, offerKind, photo, runsToday, useFlow, useSecondsLeft, type ScreenName } from "./shared";

const C = { bg: "#F5F2EC", card: "#FFFFFF", ink: "#1C2620", muted: "#5A625C", green: "#1E6A44", greenSoft: "#DDEEE3", sun: "#F3C14B", line: "#E7E2D9" };
const font = { body: "var(--f-jakarta)" };
const catIcon: Record<Category, typeof ForkKnife> = {
  Dining: ForkKnife,
  "Spa and wellness": FlowerLotus,
  Studios: Barbell,
  Hotels: Bed,
  Experiences: TicketIcon,
};
const shortCat: Record<Category, string> = { Dining: "Eat", "Spa and wellness": "Spa", Studios: "Move", Hotels: "Hotels", Experiences: "Do" };

export function DirectionC({ initial }: { initial: ScreenName }) {
  const f = useFlow(initial);
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:h-[844px] sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl" style={{ background: C.bg, color: C.ink, fontFamily: font.body }}>
      {f.screen === "browse" && <Browse onOpen={f.open} />}
      {f.screen === "place" && <Place p={f.place} onBack={f.back} onRedeem={f.redeem} />}
      {f.screen === "redeem" && <Redeem f={f} />}
      {f.screen === "browse" && <TabBar />}
    </div>
  );
}

function TabBar() {
  const tabs = [
    { label: "Discover", Icon: Compass, on: true },
    { label: "My pass", Icon: Ticket, on: false },
    { label: "Staff", Icon: Scan, on: false },
  ];
  return (
    <nav aria-label="Main" className="absolute inset-x-0 bottom-0 z-20 border-t bg-white pb-[max(env(safe-area-inset-bottom),16px)] pt-1.5" style={{ borderColor: C.line }}>
      <ul className="grid grid-cols-3">
        {tabs.map(({ label, Icon, on }) => (
          <li key={label}>
            <button type="button" aria-current={on ? "page" : undefined} className="flex min-h-[50px] w-full flex-col items-center justify-center gap-0.5 text-[11px] font-bold" style={{ color: on ? C.green : "#6E756F" }}>
              <Icon size={26} weight={on ? "duotone" : "regular"} aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Browse({ onOpen }: { onOpen: (id: string) => void }) {
  const [cat, setCat] = useState<Category | null>(null);
  const list = PARTNERS.filter((p) => !cat || p.category === cat);
  return (
    <div className="m-enter no-scrollbar flex-1 overflow-y-auto pb-28">
      <header className="px-4 pt-[max(env(safe-area-inset-top),18px)]">
        <div className="flex items-center justify-between">
          <button type="button" className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[14px] font-bold shadow-sm">
            <MapPin size={18} weight="fill" aria-hidden="true" style={{ color: C.green }} /> All six neighbourhoods <CaretDown size={14} weight="bold" aria-hidden="true" />
          </button>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: C.sun }}>Demo</span>
        </div>
        <h1 className="mt-4 text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em]">What are we doing<br />this week?</h1>
        <label className="mt-4 flex h-[52px] items-center gap-2.5 rounded-2xl border bg-white px-4 focus-within:ring-2" style={{ borderColor: C.line }}>
          <MagnifyingGlass size={20} weight="bold" aria-hidden="true" style={{ color: C.muted }} />
          <span className="sr-only">Search</span>
          <input placeholder="Brunch, massage, pottery…" className="w-full bg-transparent text-[15px] outline-none" />
        </label>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto px-4">
        {CATEGORIES.map((c) => {
          const Icon = catIcon[c];
          const on = cat === c;
          return (
            <button key={c} type="button" aria-pressed={on} aria-label={c} onClick={() => setCat(on ? null : c)} className="m-press flex w-[70px] shrink-0 flex-col items-center gap-1.5">
              <span className="grid size-[60px] place-items-center rounded-[20px]" style={on ? { background: C.green, color: "#fff" } : { background: C.card, color: C.green }}>
                <Icon size={30} weight="duotone" aria-hidden="true" />
              </span>
              <span className="text-[12px] font-bold">{shortCat[c]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between px-4">
        <h2 className="text-[19px] font-extrabold">On this week</h2>
        <span className="text-[13px] font-semibold" style={{ color: C.muted }}>{list.length} places</span>
      </div>
      <ul className="m-stagger mt-3 grid grid-cols-2 gap-3 px-4">
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onOpen(p.id)} className="m-press block w-full overflow-hidden rounded-[20px] bg-white text-left shadow-[0_8px_24px_-16px_rgba(28,38,32,0.5)]">
              <span className="relative block aspect-[4/5]">
                <img src={photo(p)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: C.sun, color: C.ink }}>{offerKind(p)}</span>
                <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90"><Heart size={16} weight="bold" aria-hidden="true" /></span>
              </span>
              <span className="block p-3">
                <span className="block truncate text-[15px] font-extrabold leading-tight">{p.name}</span>
                <span className="mt-0.5 block truncate text-[12px] font-semibold" style={{ color: C.muted }}>{p.neighbourhood}</span>
                <span className="mt-1.5 flex items-center gap-1 text-[12px] font-bold" style={{ color: runsToday(p) ? C.green : C.muted }}>
                  <CalendarCheck size={14} weight="bold" aria-hidden="true" />{runsToday(p) ? "On today" : `Next ${nextDay(p.days).slice(0, 3)}`}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="px-4 pt-5 text-center text-[12px]" style={{ color: C.muted }}>Demo. Places shown are examples. Starting in {NEIGHBOURHOODS.length} neighbourhoods.</p>
    </div>
  );
}

function Place({ p, onBack, onRedeem }: { p: Partner; onBack: () => void; onRedeem: () => void }) {
  const Icon = catIcon[p.category];
  const today = runsToday(p);
  return (
    <>
      <div className="m-push no-scrollbar flex-1 overflow-y-auto pb-32">
        <div className="relative px-3 pt-[max(env(safe-area-inset-top),10px)]">
          <div className="relative h-[340px] overflow-hidden rounded-[30px]">
            <img src={photo(p, 1200)} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-x-3 top-3 flex justify-between">
              <button type="button" onClick={onBack} aria-label="Back" className="grid size-11 place-items-center rounded-full bg-white shadow"><CaretLeft size={20} weight="bold" aria-hidden="true" /></button>
              <div className="flex gap-2">
                <button type="button" aria-label="Share" className="grid size-11 place-items-center rounded-full bg-white shadow"><ShareNetwork size={20} weight="bold" aria-hidden="true" /></button>
                <button type="button" aria-label="Save" className="grid size-11 place-items-center rounded-full bg-white shadow"><Heart size={20} weight="bold" aria-hidden="true" /></button>
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-5 rounded-full bg-white" /><span className="size-1.5 rounded-full bg-white/60" /><span className="size-1.5 rounded-full bg-white/60" />
            </div>
          </div>
        </div>
        <div className="px-4 pt-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full px-2.5 py-1 text-[12px] font-extrabold" style={{ background: C.sun }}>{offerKind(p)}</span>
            {p.founding && <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold"><Sparkle size={13} weight="fill" aria-hidden="true" style={{ color: C.green }} />{copy.place.founding}</span>}
          </div>
          <h1 className="mt-2.5 text-[30px] font-extrabold leading-tight tracking-[-0.02em]">{p.name}</h1>
          <p className="mt-1 text-[15px]" style={{ color: C.muted }}>{p.blurb}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { Icon: MapPin, label: "Where", value: p.neighbourhood },
              { Icon, label: "What", value: p.kind },
              { Icon: CalendarCheck, label: "When", value: today ? "On today" : nextDay(p.days).slice(0, 3) },
            ].map(({ Icon: I, label, value }) => (
              <div key={label} className="rounded-2xl bg-white p-3">
                <I size={22} weight="duotone" aria-hidden="true" style={{ color: C.green }} />
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: C.muted }}>{label}</p>
                <p className="truncate text-[14px] font-extrabold">{value}</p>
              </div>
            ))}
          </div>

          <section className="mt-3 rounded-[24px] p-4" style={{ background: C.green, color: "#fff" }}>
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/80">The offer</p>
            <p className="mt-1 text-[22px] font-extrabold leading-tight">{p.offer}</p>
            <p className="mt-1 text-[14px] text-white/85">{p.detail}</p>
            <div className="mt-4 grid grid-cols-7 gap-1.5" aria-label={`Runs ${daysLabel(p.days)}`}>
              {DAY_LETTERS.map((d, i) => (
                <span key={i} aria-hidden="true" className="grid h-9 place-items-center rounded-xl text-[13px] font-extrabold" style={p.days[i] ? { background: i === TODAY ? C.sun : "#fff", color: C.ink } : { background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.6)" }}>{d}</span>
              ))}
            </div>
            <p className="mt-3 text-[13px] font-bold">{copy.place.usesLeft(p.usesPerYear, p.usesPerYear)}</p>
          </section>

          <ul className="mt-4 space-y-2">
            {[MapPin, ForkKnife, Receipt].map((RIcon, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-[14px] font-semibold">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: C.greenSoft, color: C.green }}><RIcon size={19} weight="bold" aria-hidden="true" /></span>
                {copy.place.rules[i]}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t bg-white px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3" style={{ borderColor: C.line }}>
        <div className="flex-1">
          <p className="text-[12px] font-bold" style={{ color: C.muted }}>You save about</p>
          <p className="text-[22px] font-extrabold">${p.saving}</p>
        </div>
        <button type="button" onClick={onRedeem} disabled={!today} className="m-press h-14 rounded-2xl px-8 text-[17px] font-extrabold text-white disabled:opacity-40" style={{ background: C.green }}>{copy.place.redeem}</button>
      </div>
    </>
  );
}

function Redeem({ f }: { f: ReturnType<typeof useFlow> }) {
  const p = f.place;
  const left = useSecondsLeft(f.issuedAt);
  return (
    <div className="m-enter no-scrollbar flex flex-1 flex-col overflow-y-auto px-4 pb-8 pt-[max(env(safe-area-inset-top),14px)]" role="dialog" aria-modal="true" aria-labelledby="c-redeem-title" style={{ background: C.green }}>
      <div className="flex items-center justify-between text-white">
        <button type="button" onClick={f.back} aria-label="Close" className="grid size-11 place-items-center rounded-full bg-white/15"><X size={20} weight="bold" aria-hidden="true" /></button>
        <p className="text-[14px] font-bold">Your ticket</p>
        <span className="size-11" />
      </div>
      <div className="my-auto pb-6">
      <div className="m-pop relative mt-5">
        <div className="overflow-hidden rounded-t-[26px] bg-white">
          <img src={photo(p)} alt="" className="h-[120px] w-full object-cover" />
          <div className="p-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: C.muted }}>{p.neighbourhood}</p>
            <p className="text-[24px] font-extrabold leading-tight">{p.name}</p>
            <p className="mt-1 text-[15px] font-semibold" style={{ color: C.green }}>{p.offer}</p>
          </div>
        </div>
        <div className="relative h-6 bg-white" aria-hidden="true">
          <span className="absolute -left-3 top-0 size-6 rounded-full" style={{ background: C.green }} />
          <span className="absolute -right-3 top-0 size-6 rounded-full" style={{ background: C.green }} />
          <span className="absolute inset-x-5 top-1/2 border-t-2 border-dashed" style={{ borderColor: C.line }} />
        </div>
        <div className="relative rounded-b-[26px] bg-white p-5 text-center">
          {!f.confirmed ? (
            <>
              <h2 id="c-redeem-title" className="text-[14px] font-bold" style={{ color: C.muted }}>{copy.redeem.title}</h2>
              <p className="tabular mt-1 text-[52px] font-extrabold leading-none tracking-[0.05em]" aria-live="polite">{f.code}</p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ background: C.greenSoft }} aria-hidden="true">
                <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(left / 600) * 100}%`, background: C.green }} />
              </div>
              <p className="tabular mt-2 text-[14px] font-semibold" style={{ color: C.muted }}>{copy.redeem.expires} <b style={{ color: C.ink }}>{mmss(left)}</b></p>
            </>
          ) : (
            <div aria-live="polite" className="py-2">
              <span className="m-stamp mx-auto inline-flex items-center gap-2 rounded-xl border-[3px] px-4 py-2 text-[22px] font-extrabold uppercase tracking-[0.08em]" style={{ borderColor: C.green, color: C.green }}>
                <CheckCircle size={28} weight="fill" aria-hidden="true" />Confirmed
              </span>
              <p className="mt-4 text-[17px] font-bold">{copy.redeem.doneText(p.saving)}</p>
            </div>
          )}
        </div>
      </div>
      {!f.confirmed ? (
        <>
          <button type="button" onClick={f.confirm} className="m-press mt-5 h-14 w-full rounded-2xl text-[16px] font-extrabold" style={{ background: C.sun, color: C.ink }}>Staff confirmed it (demo)</button>
          <button type="button" onClick={f.back} className="mt-1 h-12 w-full text-[15px] font-bold text-white/90">{copy.redeem.cancel}</button>
        </>
      ) : (
        <button type="button" onClick={() => f.setScreen("browse")} className="m-press mt-5 h-14 w-full rounded-2xl text-[16px] font-extrabold" style={{ background: C.sun, color: C.ink }}>{copy.redeem.doneBack}</button>
      )}
      </div>
    </div>
  );
}
