"use client";

/*
 * Direction A: "Streetcar". Bright, photo-led, confident type. For the
 * downtown 25 to 35 crowd who use Resy and Instagram. Streetcar red is
 * the only colour, kept for actions and the offer badge.
 */
import { useState } from "react";
import {
  BedDouble, ChevronLeft, Compass, Dumbbell, Flower2, Heart, MapPin, Receipt, ScanLine, Search,
  Share, SlidersHorizontal, Ticket, UtensilsCrossed, WalletCards, Clock, Check, X,
} from "lucide-react";
import { CATEGORIES, PARTNERS, copy, type Category, type Partner } from "../data";
import { daysLabel, mmss, nextDay, offerKind, photo, runsToday, useFlow, useSecondsLeft, type ScreenName } from "./shared";
import { DAY_LETTERS, TODAY } from "../data";

const RED = "#C8241A";
const catIcon: Record<Category, typeof UtensilsCrossed> = {
  Dining: UtensilsCrossed,
  "Spa and wellness": Flower2,
  Studios: Dumbbell,
  Hotels: BedDouble,
  Experiences: Ticket,
};

const font = { display: "var(--f-bricolage)", body: "var(--f-instrument)" };

export function DirectionA({ initial }: { initial: ScreenName }) {
  const f = useFlow(initial);
  return (
    <div
      className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white text-[#121212] sm:h-[844px] sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl"
      style={{ fontFamily: font.body }}
    >
      {f.screen === "browse" && <Browse onOpen={f.open} />}
      {f.screen !== "browse" && <Place p={f.place} onBack={f.back} onRedeem={f.redeem} />}
      {f.screen === "redeem" && <Redeem f={f} />}
      {f.screen === "browse" && <TabBar />}
    </div>
  );
}

function TabBar() {
  const tabs = [
    { label: "Explore", Icon: Compass, on: true },
    { label: "My pass", Icon: WalletCards, on: false },
    { label: "For staff", Icon: ScanLine, on: false },
  ];
  return (
    <nav aria-label="Main" className="absolute inset-x-0 bottom-0 z-20 border-t border-black/[0.06] bg-white/90 pb-[max(env(safe-area-inset-bottom),18px)] pt-2 backdrop-blur-xl">
      <ul className="grid grid-cols-3">
        {tabs.map(({ label, Icon, on }) => (
          <li key={label}>
            <button type="button" aria-current={on ? "page" : undefined} className="flex min-h-[48px] w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold" style={{ color: on ? RED : "#6B6B66" }}>
              <Icon size={24} strokeWidth={on ? 2.2 : 1.7} aria-hidden="true" />
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
  const [q, setQ] = useState("");
  const list = PARTNERS.filter((p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.neighbourhood} ${p.kind}`.toLowerCase().includes(q.toLowerCase())));
  const today = list.filter(runsToday);

  return (
    <div className="m-enter no-scrollbar flex-1 overflow-y-auto pb-28">
      <header className="px-5 pt-[max(env(safe-area-inset-top),18px)]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#55554F]">
            <MapPin size={15} aria-hidden="true" style={{ color: RED }} /> Toronto · Tuesday
          </p>
          <span className="rounded-full bg-[#F2F2EF] px-2.5 py-1 text-[11px] font-semibold text-[#55554F]">Demo</span>
        </div>
        <h1 className="mt-3 text-[38px] font-extrabold leading-[0.98] tracking-[-0.03em]" style={{ fontFamily: font.display }}>
          Two for one,
          <br />
          tonight.
        </h1>
        <div className="mt-4 flex gap-2">
          <label className="flex h-12 flex-1 items-center gap-2 rounded-full bg-[#F2F2EF] px-4 focus-within:ring-2 focus-within:ring-black">
            <Search size={18} aria-hidden="true" className="text-[#6B6B66]" />
            <span className="sr-only">Search places</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places or neighbourhoods" className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#6B6B66]" />
          </label>
          <button type="button" aria-label="Filters" className="grid size-12 place-items-center rounded-full bg-[#121212] text-white">
            <SlidersHorizontal size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {CATEGORIES.map((c) => {
          const Icon = catIcon[c];
          const on = cat === c;
          return (
            <button key={c} type="button" aria-pressed={on} onClick={() => setCat(on ? null : c)} className="m-press flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold" style={on ? { background: "#121212", color: "#fff", borderColor: "#121212" } : { borderColor: "#E2E2DE" }}>
              <Icon size={17} aria-hidden="true" />
              {c}
            </button>
          );
        })}
      </div>

      {today.length > 0 && (
        <section className="mt-6" aria-labelledby="a-today">
          <div className="flex items-baseline justify-between px-5">
            <h2 id="a-today" className="text-[21px] font-bold tracking-[-0.02em]" style={{ fontFamily: font.display }}>Running today</h2>
            <span className="text-[13px] font-semibold text-[#6B6B66]">{today.length} places</span>
          </div>
          <ul className="no-scrollbar m-stagger mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
            {today.map((p) => (
              <li key={p.id} className="snap-start">
                <button type="button" onClick={() => onOpen(p.id)} className="m-press relative block h-[300px] w-[250px] overflow-hidden rounded-[22px] text-left text-white">
                  <img src={photo(p)} alt="" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: RED }}>{offerKind(p)}</span>
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/30 backdrop-blur"><Heart size={17} aria-hidden="true" /></span>
                  <span className="absolute inset-x-4 bottom-4">
                    <span className="block text-[12px] font-semibold text-white/85">{p.neighbourhood} · {p.kind}</span>
                    <span className="mt-0.5 block text-[22px] font-bold leading-tight tracking-[-0.02em]" style={{ fontFamily: font.display }}>{p.name}</span>
                    <span className="mt-1 block text-[14px] text-white/90">{p.offer}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-7 px-5" aria-labelledby="a-all">
        <h2 id="a-all" className="text-[21px] font-bold tracking-[-0.02em]" style={{ fontFamily: font.display }}>All places</h2>
        <ul className="m-stagger mt-2 divide-y divide-[#EDEDEA]">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => onOpen(p.id)} className="m-press flex w-full items-center gap-3.5 py-3 text-left">
                <img src={photo(p)} alt="" loading="lazy" className="size-[76px] shrink-0 rounded-2xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[17px] font-bold tracking-[-0.01em]" style={{ fontFamily: font.display }}>{p.name}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[13px] text-[#6B6B66]"><MapPin size={13} aria-hidden="true" />{p.neighbourhood} · {p.kind}</span>
                  <span className="mt-1 block truncate text-[14px] font-semibold">{p.offer}</span>
                </span>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold" style={runsToday(p) ? { background: "#FBE7E5", color: "#9E1C14" } : { background: "#F2F2EF", color: "#55554F" }}>
                  {runsToday(p) ? "Today" : nextDay(p.days).slice(0, 3)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <p className="px-5 pt-4 text-center text-[12px] text-[#6B6B66]">Demo. Places shown are examples.</p>
    </div>
  );
}

function Place({ p, onBack, onRedeem }: { p: Partner; onBack: () => void; onRedeem: () => void }) {
  const Icon = catIcon[p.category];
  const today = runsToday(p);
  return (
    <>
    <div className="m-push no-scrollbar relative flex-1 overflow-y-auto pb-32">
      <div className="relative h-[380px]">
        <img src={photo(p, 1200)} alt="" className="absolute inset-0 size-full object-cover" />
        <span className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute inset-x-4 top-[max(env(safe-area-inset-top),16px)] flex justify-between">
          <button type="button" onClick={onBack} aria-label="Back" className="grid size-11 place-items-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur"><ChevronLeft size={22} aria-hidden="true" /></button>
          <div className="flex gap-2">
            <button type="button" aria-label="Share" className="grid size-11 place-items-center rounded-full bg-white/90 text-black shadow-sm"><Share size={19} aria-hidden="true" /></button>
            <button type="button" aria-label="Save" className="grid size-11 place-items-center rounded-full bg-white/90 text-black shadow-sm"><Heart size={19} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <div className="relative -mt-7 rounded-t-[28px] bg-white px-5 pt-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2.5 py-1 text-[12px] font-bold text-white" style={{ background: RED }}>{offerKind(p)}</span>
          {p.founding && <span className="rounded-full bg-[#F2F2EF] px-2.5 py-1 text-[12px] font-semibold">{copy.place.founding}</span>}
        </div>
        <h1 className="mt-3 text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em]" style={{ fontFamily: font.display }}>{p.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#55554F]">
          <span className="flex items-center gap-1"><MapPin size={15} aria-hidden="true" />{p.neighbourhood}</span>
          <span className="flex items-center gap-1"><Icon size={15} aria-hidden="true" />{p.kind}</span>
          <span className="flex items-center gap-1" style={{ color: today ? "#1C7C43" : undefined }}><Clock size={15} aria-hidden="true" />{today ? "Runs today" : `Next: ${nextDay(p.days)}`}</span>
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-[#33332F]">{p.blurb}</p>

        <div className="mt-5 rounded-[22px] border border-[#ECECE8] p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: RED }}>The offer</p>
          <p className="mt-1 text-[22px] font-bold leading-tight tracking-[-0.02em]" style={{ fontFamily: font.display }}>{p.offer}</p>
          <p className="mt-1 text-[15px] text-[#55554F]">{p.detail}</p>
          <div className="mt-4 grid grid-cols-7 gap-1.5" aria-label={`Runs ${daysLabel(p.days)}`}>
            {DAY_LETTERS.map((d, i) => (
              <span key={i} aria-hidden="true" className="grid h-10 place-items-center rounded-xl text-[13px] font-bold" style={p.days[i] ? { background: "#121212", color: "#fff", outline: i === TODAY ? `2px solid ${RED}` : undefined, outlineOffset: 2 } : { background: "#F2F2EF", color: "#8A8A84" }}>
                {d}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[14px] font-semibold">{copy.place.usesLeft(p.usesPerYear, p.usesPerYear)}</p>
        </div>

        <ul className="mt-5 space-y-3 pb-4 text-[15px] text-[#33332F]">
          {[MapPin, UtensilsCrossed, Receipt].map((RIcon, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F2F2EF]"><RIcon size={17} aria-hidden="true" /></span>
              <span className="pt-1.5">{copy.place.rules[i]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-black/[0.06] bg-white/95 px-5 pb-[max(env(safe-area-inset-bottom),18px)] pt-3 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-[13px] text-[#6B6B66]">You save about</p>
          <p className="text-[20px] font-extrabold tracking-[-0.02em]" style={{ fontFamily: font.display }}>${p.saving}</p>
        </div>
        <button type="button" onClick={onRedeem} disabled={!today} className="m-press h-14 rounded-full px-9 text-[17px] font-bold text-white disabled:opacity-40" style={{ background: RED }}>
          {copy.place.redeem}
        </button>
      </div>
    </>
  );
}

function Redeem({ f }: { f: ReturnType<typeof useFlow> }) {
  const p = f.place;
  const left = useSecondsLeft(f.issuedAt);
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end" role="dialog" aria-modal="true" aria-labelledby="a-redeem-title">
      <div className="m-fade absolute inset-0 bg-black/45" onClick={f.back} />
      <div className="m-sheet relative rounded-t-[30px] bg-white px-5 pb-[max(env(safe-area-inset-bottom),22px)] pt-2.5">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#DADAD6]" />
        <button type="button" onClick={f.back} aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-[#F2F2EF]"><X size={18} aria-hidden="true" /></button>
        {!f.confirmed ? (
          <>
            <div className="mt-5 flex items-center gap-3">
              <img src={photo(p)} alt="" className="size-12 rounded-xl object-cover" />
              <div>
                <p className="text-[13px] text-[#6B6B66]">{p.neighbourhood}</p>
                <p className="text-[17px] font-bold" style={{ fontFamily: font.display }}>{p.name}</p>
              </div>
            </div>
            <h2 id="a-redeem-title" className="mt-6 text-center text-[15px] font-semibold text-[#55554F]">{copy.redeem.title}</h2>
            <p className="tabular mt-2 text-center text-[58px] font-extrabold leading-none tracking-[0.04em]" style={{ fontFamily: font.display }} aria-live="polite">{f.code}</p>
            <div className="mx-auto mt-5 h-2 w-full overflow-hidden rounded-full bg-[#F2F2EF]" aria-hidden="true">
              <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(left / 600) * 100}%`, background: RED }} />
            </div>
            <p className="tabular mt-2 text-center text-[14px] text-[#55554F]">{copy.redeem.expires} <b className="text-[#121212]">{mmss(left)}</b></p>
            <div className="mt-5 rounded-2xl bg-[#F7F7F5] p-4 text-[14px]">
              <p className="font-bold">{p.offer}</p>
              <p className="mt-0.5 text-[#55554F]">{p.detail}</p>
            </div>
            <button type="button" onClick={f.confirm} className="m-press mt-5 h-14 w-full rounded-full text-[17px] font-bold text-white" style={{ background: "#121212" }}>
              Staff confirmed it (demo)
            </button>
            <button type="button" onClick={f.back} className="mt-1 h-12 w-full text-[15px] font-semibold text-[#55554F]">{copy.redeem.cancel}</button>
          </>
        ) : (
          <div className="py-8 text-center" aria-live="polite">
            <div className="m-pop mx-auto grid size-24 place-items-center rounded-full" style={{ background: RED }}>
              <Check size={52} strokeWidth={3} className="m-draw text-white" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-[34px] font-extrabold tracking-[-0.03em]" style={{ fontFamily: font.display }}>{copy.redeem.doneTitle}</h2>
            <p className="mt-1 text-[17px] text-[#33332F]">{copy.redeem.doneText(p.saving)}</p>
            <p className="mt-1 text-[14px] text-[#6B6B66]">{p.name} · {p.neighbourhood}</p>
            <button type="button" onClick={() => f.setScreen("browse")} className="m-press mt-8 h-14 w-full rounded-full text-[17px] font-bold text-white" style={{ background: "#121212" }}>
              {copy.redeem.doneBack}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
