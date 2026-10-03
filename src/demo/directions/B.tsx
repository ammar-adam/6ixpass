"use client";

/*
 * Direction B: "Concierge". Evening navy, photos that glow against it,
 * a pass that looks like a card in your wallet. For Bay Street people
 * who live in the Amex app and want this to feel like a private club.
 */
import { useState } from "react";
import {
  Barbell, Bed, CaretLeft, Check, Clock, Compass, ForkKnife, FlowerLotus, Heart, MagnifyingGlass, MapPin,
  Receipt, Scan, ShareNetwork, Ticket, Wallet, X, Storefront,
} from "@phosphor-icons/react";
import { CATEGORIES, DAY_LETTERS, PARTNERS, TODAY, copy, type Category, type Partner } from "../data";
import { daysLabel, mmss, nextDay, offerKind, photo, runsToday, useFlow, useSecondsLeft, type ScreenName } from "./shared";

const C = { bg: "#0A1424", panel: "#122038", line: "rgba(255,255,255,0.09)", text: "#F3F6FB", muted: "#A9B5C9", ice: "#A9D1FF", iceInk: "#0A1424" };
const font = { display: "var(--f-dmserif)", body: "var(--f-figtree)" };
const catIcon: Record<Category, typeof ForkKnife> = {
  Dining: ForkKnife,
  "Spa and wellness": FlowerLotus,
  Studios: Barbell,
  Hotels: Bed,
  Experiences: Ticket,
};

export function DirectionB({ initial }: { initial: ScreenName }) {
  const f = useFlow(initial);
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:h-[844px] sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl" style={{ background: C.bg, color: C.text, fontFamily: font.body }}>
      {f.screen === "browse" && <Browse onOpen={f.open} />}
      {f.screen === "place" && <Place p={f.place} onBack={f.back} onRedeem={f.redeem} />}
      {f.screen === "redeem" && <Redeem f={f} />}
      {f.screen === "browse" && <TabBar />}
    </div>
  );
}

function TabBar() {
  const tabs = [
    { label: "Explore", Icon: Compass, on: true },
    { label: "Pass", Icon: Wallet, on: false },
    { label: "Staff", Icon: Scan, on: false },
  ];
  return (
    <nav aria-label="Main" className="absolute inset-x-4 bottom-[max(env(safe-area-inset-bottom),14px)] z-20 rounded-[26px] border px-2 py-1.5 backdrop-blur-xl" style={{ background: "rgba(18,32,56,0.82)", borderColor: C.line }}>
      <ul className="grid grid-cols-3">
        {tabs.map(({ label, Icon, on }) => (
          <li key={label}>
            <button type="button" aria-current={on ? "page" : undefined} className="flex min-h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-semibold" style={on ? { background: "rgba(169,209,255,0.14)", color: C.ice } : { color: C.muted }}>
              <Icon size={24} weight={on ? "fill" : "regular"} aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PassStrip() {
  return (
    <div className="relative overflow-hidden rounded-[22px] p-4" style={{ background: "linear-gradient(135deg,#1C3560 0%,#0F1E38 55%,#2A4A7A 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 18px 40px -20px rgba(0,0,0,0.8)" }}>
      <div aria-hidden="true" className="absolute -right-8 -top-10 size-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(169,209,255,0.35), transparent 70%)" }} />
      <div className="relative flex items-center justify-between">
        <span className="flex items-baseline text-[20px]" style={{ fontFamily: font.display }}>
          the<span className="mx-1 inline-grid size-[22px] -translate-y-[2px] place-items-center rounded-full border text-[12px] font-bold" style={{ borderColor: C.text, fontFamily: font.body }}>6</span>pass
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ice }}>Member</span>
      </div>
      <div className="relative mt-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>Name</p>
          <p className="text-[16px] font-semibold">Alex</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>Since</p>
          <p className="text-[16px] font-semibold">March 2027</p>
        </div>
      </div>
    </div>
  );
}

function Browse({ onOpen }: { onOpen: (id: string) => void }) {
  const [cat, setCat] = useState<Category | null>(null);
  const list = PARTNERS.filter((p) => !cat || p.category === cat);
  return (
    <div className="m-enter no-scrollbar flex-1 overflow-y-auto pb-32">
      <header className="px-5 pt-[max(env(safe-area-inset-top),20px)]">
        <p className="text-[13px] font-medium" style={{ color: C.muted }}>Tuesday evening · Toronto</p>
        <h1 className="mt-1 text-[34px] leading-[1.05]" style={{ fontFamily: font.display }}>Good evening, Alex.</h1>
        <div className="mt-4"><PassStrip /></div>
        <label className="mt-4 flex h-12 items-center gap-2.5 rounded-2xl border px-4 focus-within:ring-2" style={{ background: C.panel, borderColor: C.line }}>
          <MagnifyingGlass size={19} aria-hidden="true" style={{ color: C.muted }} />
          <span className="sr-only">Search</span>
          <input placeholder="Search places" className="w-full bg-transparent text-[15px] outline-none" style={{ color: C.text }} />
        </label>
      </header>

      <div className="no-scrollbar mt-5 flex gap-5 overflow-x-auto border-b px-5" style={{ borderColor: C.line }}>
        {[null, ...CATEGORIES].map((c) => {
          const on = cat === c;
          const Icon = c ? catIcon[c] : Storefront;
          return (
            <button key={c ?? "all"} type="button" aria-pressed={on} onClick={() => setCat(c)} className="flex shrink-0 flex-col items-center gap-1 border-b-2 pb-2.5 pt-1 text-[12px] font-semibold" style={{ borderColor: on ? C.ice : "transparent", color: on ? C.text : C.muted }}>
              <Icon size={24} weight={on ? "fill" : "light"} aria-hidden="true" style={{ color: on ? C.ice : undefined }} />
              {c ?? "All"}
            </button>
          );
        })}
      </div>

      <ul className="m-stagger mt-5 space-y-6 px-5">
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onOpen(p.id)} className="m-press block w-full text-left">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[22px]">
                <img src={photo(p)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#0A1424]/60 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: C.ice, color: C.iceInk }}>{offerKind(p)}</span>
                <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/35 backdrop-blur"><Heart size={18} aria-hidden="true" /></span>
                {runsToday(p) && <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-semibold backdrop-blur"><span className="size-2 rounded-full bg-[#7CE2A4]" />Tonight</span>}
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-[24px] leading-tight" style={{ fontFamily: font.display }}>{p.name}</span>
                <span className="shrink-0 text-[13px]" style={{ color: C.muted }}>{p.neighbourhood}</span>
              </span>
              <span className="mt-0.5 block text-[15px]" style={{ color: C.muted }}>{p.offer}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="px-5 pt-6 text-center text-[12px]" style={{ color: C.muted }}>Demo. Places shown are examples.</p>
    </div>
  );
}

function Place({ p, onBack, onRedeem }: { p: Partner; onBack: () => void; onRedeem: () => void }) {
  const Icon = catIcon[p.category];
  const today = runsToday(p);
  return (
    <>
      <div className="m-push no-scrollbar flex-1 overflow-y-auto pb-36">
        <div className="relative h-[440px]">
          <img src={photo(p, 1200)} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(10,20,36,0.5) 0%, transparent 25%, transparent 45%, ${C.bg} 100%)` }} />
          <div className="absolute inset-x-4 top-[max(env(safe-area-inset-top),16px)] flex justify-between">
            <button type="button" onClick={onBack} aria-label="Back" className="grid size-11 place-items-center rounded-full bg-black/35 backdrop-blur-md"><CaretLeft size={22} weight="bold" aria-hidden="true" /></button>
            <div className="flex gap-2">
              <button type="button" aria-label="Share" className="grid size-11 place-items-center rounded-full bg-black/35 backdrop-blur-md"><ShareNetwork size={20} aria-hidden="true" /></button>
              <button type="button" aria-label="Save" className="grid size-11 place-items-center rounded-full bg-black/35 backdrop-blur-md"><Heart size={20} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="absolute inset-x-5 bottom-2">
            {p.founding && <p className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ice }}>{copy.place.founding}</p>}
            <h1 className="mt-1 text-[40px] leading-[1]" style={{ fontFamily: font.display }}>{p.name}</h1>
          </div>
        </div>
        <div className="px-5">
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px]" style={{ color: C.muted }}>
            <span className="flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" />{p.neighbourhood}</span>
            <span className="flex items-center gap-1.5"><Icon size={16} aria-hidden="true" />{p.kind}</span>
            <span className="flex items-center gap-1.5" style={{ color: today ? "#7CE2A4" : undefined }}><Clock size={16} aria-hidden="true" />{today ? "Tonight" : `Next ${nextDay(p.days)}`}</span>
          </p>
          <p className="mt-4 text-[16px] leading-relaxed" style={{ color: "#D5DCE8" }}>{p.blurb}</p>

          <section className="mt-6 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ice }}>Your offer</p>
            <p className="mt-2 text-[26px] leading-tight" style={{ fontFamily: font.display }}>{p.offer}</p>
            <p className="mt-1 text-[15px]" style={{ color: C.muted }}>{p.detail}</p>
            <div className="mt-5 flex justify-between" aria-label={`Runs ${daysLabel(p.days)}`}>
              {DAY_LETTERS.map((d, i) => (
                <span key={i} aria-hidden="true" className="flex flex-col items-center gap-1.5">
                  <span className="grid size-9 place-items-center rounded-full text-[13px] font-bold" style={p.days[i] ? { background: i === TODAY ? C.ice : "rgba(169,209,255,0.18)", color: i === TODAY ? C.iceInk : C.text } : { border: `1px solid ${C.line}`, color: "#5D6B84" }}>{d}</span>
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {Array.from({ length: p.usesPerYear }).map((_, i) => <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: C.ice }} />)}
              </div>
              <span className="text-[13px] font-semibold">{p.usesPerYear} of {p.usesPerYear} left this year</span>
            </div>
          </section>

          <ul className="mt-5 space-y-3.5 text-[15px]" style={{ color: "#D5DCE8" }}>
            {[MapPin, ForkKnife, Receipt].map((RIcon, i) => (
              <li key={i} className="flex gap-3"><RIcon size={20} aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: C.ice }} />{copy.place.rules[i]}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(env(safe-area-inset-bottom),18px)] pt-4" style={{ background: `linear-gradient(to top, ${C.bg} 70%, transparent)` }}>
        <button type="button" onClick={onRedeem} disabled={!today} className="m-press flex h-[58px] w-full items-center justify-between rounded-[20px] px-6 text-[17px] font-bold disabled:opacity-40" style={{ background: C.ice, color: C.iceInk }}>
          <span>{copy.place.redeem}</span>
          <span className="text-[15px] font-semibold opacity-80">Save about ${p.saving}</span>
        </button>
      </div>
    </>
  );
}

function Ring({ fraction, children }: { fraction: number; children: React.ReactNode }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <div className="relative size-[112px]">
      <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={C.ice} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - fraction)} style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

function Redeem({ f }: { f: ReturnType<typeof useFlow> }) {
  const p = f.place;
  const left = useSecondsLeft(f.issuedAt);
  return (
    <div className="m-enter no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-[max(env(safe-area-inset-top),16px)]" role="dialog" aria-modal="true" aria-labelledby="b-redeem-title">
      <div className="flex items-center justify-between">
        <button type="button" onClick={f.back} aria-label="Close" className="grid size-11 place-items-center rounded-full border" style={{ borderColor: C.line }}><X size={20} aria-hidden="true" /></button>
        <p className="text-[13px] font-semibold" style={{ color: C.muted }}>Show at the table</p>
        <span className="size-11" />
      </div>
      <div className="my-auto pb-6">
      <div className="m-pop mt-5 overflow-hidden rounded-[28px]" style={{ background: "linear-gradient(160deg,#1C3560,#0F1E38)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 30px 60px -30px rgba(0,0,0,0.9)" }}>
        <div className="relative h-[130px]">
          <img src={photo(p)} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-[#0F1E38] to-transparent" />
          <p className="absolute bottom-3 left-5 text-[26px] leading-none" style={{ fontFamily: font.display }}>{p.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-y-3 px-5 pt-4 text-[14px]">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.muted }}>Member</p><p className="font-semibold">Alex</p></div>
          <div className="text-right"><p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.muted }}>Neighbourhood</p><p className="font-semibold">{p.neighbourhood}</p></div>
          <div className="col-span-2"><p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.muted }}>Offer</p><p className="font-semibold">{p.offer}</p></div>
        </div>
        <div className="mx-5 my-4 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.18)" }} />
        {!f.confirmed ? (
          <div className="flex items-center justify-between px-5 pb-5">
            <div>
              <h2 id="b-redeem-title" className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.ice }}>{copy.redeem.title}</h2>
              <p className="tabular mt-1 text-[44px] font-bold leading-none tracking-[0.06em]" aria-live="polite">{f.code}</p>
            </div>
            <Ring fraction={left / 600}>
              <span className="text-center">
                <span className="tabular block text-[20px] font-bold">{mmss(left)}</span>
                <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>left</span>
              </span>
            </Ring>
          </div>
        ) : (
          <div className="flex items-center gap-4 px-5 pb-6" aria-live="polite">
            <span className="m-pop grid size-16 shrink-0 place-items-center rounded-full" style={{ background: C.ice, color: C.iceInk }}><Check size={34} weight="bold" aria-hidden="true" /></span>
            <div>
              <p className="text-[28px] leading-none" style={{ fontFamily: font.display }}>{copy.redeem.doneTitle}</p>
              <p className="mt-1 text-[15px]" style={{ color: "#D5DCE8" }}>{copy.redeem.doneText(p.saving)}</p>
            </div>
          </div>
        )}
      </div>
      {!f.confirmed ? (
        <>
          <p className="mt-5 text-center text-[14px]" style={{ color: C.muted }}>{copy.redeem.waiting}</p>
          <button type="button" onClick={f.confirm} className="m-press mt-4 h-14 w-full rounded-[20px] text-[16px] font-bold" style={{ background: C.ice, color: C.iceInk }}>Staff confirmed it (demo)</button>
          <button type="button" onClick={f.back} className="mt-1 h-12 w-full text-[15px] font-semibold" style={{ color: C.muted }}>{copy.redeem.cancel}</button>
        </>
      ) : (
        <button type="button" onClick={() => f.setScreen("browse")} className="m-press mt-6 h-14 w-full rounded-[20px] text-[16px] font-bold" style={{ background: C.ice, color: C.iceInk }}>{copy.redeem.doneBack}</button>
      )}
      </div>
    </div>
  );
}
