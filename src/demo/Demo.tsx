"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Barbell, Bed, CaretLeft, ChartBar, Check, Clock, Compass, DoorOpen, FlowerLotus, ForkKnife, Heart, MagnifyingGlass,
  MapPin, Minus, Plus, Receipt, Scan, ShareNetwork, Sliders, Storefront, Ticket, Wallet, X,
} from "@phosphor-icons/react";
import {
  CATEGORIES,
  DAY_LETTERS,
  DAY_NAMES,
  DAY_SHORT,
  HOME_PARTNER_ID,
  NEIGHBOURHOODS,
  OFFER_PRESETS,
  PARTNERS,
  TODAY,
  copy,
  type Category,
  type Partner,
} from "./data";

/*
 * The clickable demo, in design direction B ("Concierge"): evening navy,
 * photos that glow against it, a pass like a card in your wallet.
 * Everything lives in memory: nothing is saved and nothing talks to a
 * server. Refresh the page and it starts again.
 */

type Screen =
  | { name: "explore" }
  | { name: "place"; id: string }
  | { name: "redeem"; id: string; redemptionId: number }
  | { name: "pass" };

type Redemption = {
  id: number;
  partnerId: string;
  code: string;
  issuedAt: number;
  status: "issued" | "confirmed" | "cancelled";
  saving: number;
  /** The offer as it was when redeemed, so later edits don't rewrite history. */
  offer: string;
};

const CODE_LIFE_MS = 10 * 60 * 1000;

// Kept outside the component: these give a different answer every call.
const timestamp = () => Date.now();
const newCode = () => String(Math.floor(100000 + Math.random() * 900000));

const C = { bg: "#0A1424", panel: "#122038", line: "rgba(255,255,255,0.09)", text: "#F3F6FB", soft: "#D5DCE8", muted: "#A9B5C9", ice: "#A9D1FF", iceInk: "#0A1424", ok: "#7CE2A4" };
const serif = { fontFamily: "var(--f-dmserif)" };
const catIcon: Record<Category, typeof ForkKnife> = {
  Dining: ForkKnife,
  "Spa and wellness": FlowerLotus,
  Studios: Barbell,
  Hotels: Bed,
  Experiences: Ticket,
};
const RULE_ICONS = [MapPin, ForkKnife, Receipt];

const photo = (p: Partner, size: 640 | 1200 = 640) => `${p.image}-${size}.webp`;
const UPGRADE_PRESET = OFFER_PRESETS.find((o) => o.id === "upgrade");
const offerKind = (p: Partner) =>
  p.offer === UPGRADE_PRESET?.offer ? "Free add-on" : /upgrade|add-on|longer/i.test(p.offer + p.detail) ? "Free upgrade" : "2 for 1";
const splitCode = (c: string) => `${c.slice(0, 3)} ${c.slice(3)}`;
const cardGlow = { background: "linear-gradient(135deg,#1C3560 0%,#0F1E38 55%,#2A4A7A 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 18px 40px -20px rgba(0,0,0,0.8)" };

function nextDay(days: boolean[]) {
  for (let i = 1; i <= 7; i++) {
    const d = (TODAY + i) % 7;
    if (days[d]) return DAY_NAMES[d];
  }
  return DAY_NAMES[TODAY];
}

function daysLabel(days: boolean[]) {
  return DAY_SHORT.filter((_, i) => days[i]).join(", ");
}

function Photo({ p, size = 640, className = "", priority = false }: { p: Partner; size?: 640 | 1200; className?: string; priority?: boolean }) {
  return (
    // Static export: photos are pre-sized WebP files in public/demo.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo(p, size)} alt="" loading={priority ? "eager" : "lazy"} decoding="async" className={`object-cover ${className}`} />
  );
}

function DayDots({ days }: { days: boolean[] }) {
  return (
    <>
      <p className="sr-only">Runs {DAY_NAMES.filter((_, i) => days[i]).join(", ")}. Today is {DAY_NAMES[TODAY]}.</p>
      <div aria-hidden="true" className="flex justify-between">
        {DAY_LETTERS.map((d, i) => (
          <span
            key={i}
            className="grid size-9 place-items-center rounded-full text-[13px] font-bold"
            style={
              days[i]
                ? { background: i === TODAY ? C.ice : "rgba(169,209,255,0.18)", color: i === TODAY ? C.iceInk : C.text }
                : { border: `1px solid ${C.line}`, color: "#5D6B84" }
            }
          >
            {d}
          </span>
        ))}
      </div>
    </>
  );
}

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

function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <span className="flex items-baseline" style={{ ...serif, fontSize: size }}>
      the
      <span
        className="mx-1 inline-grid -translate-y-[2px] place-items-center rounded-full border font-bold"
        style={{ width: size * 1.1, height: size * 1.1, fontSize: size * 0.6, borderColor: C.text, fontFamily: "var(--f-figtree)" }}
      >
        6
      </span>
      pass
    </span>
  );
}

function Ring({ fraction, children }: { fraction: number; children: React.ReactNode }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[108px] shrink-0">
      <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={C.ice} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - fraction)} style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

const label = "text-[11px] font-semibold uppercase tracking-[0.16em]";

export function Demo() {
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [mode, setMode] = useState<"member" | "partner">("member");
  const [screen, setScreen] = useState<Screen>({ name: "explore" });
  const [category, setCategory] = useState<Category | null>(null);
  const [hood, setHood] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [staffTab, setStaffTab] = useState<"door" | "offer" | "week">("door");
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [now, setNow] = useState(timestamp);

  // A ticking clock, only while a code is live.
  const live = redemptions.some((r) => r.status === "issued");
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setNow(timestamp()), 1000);
    return () => clearInterval(t);
  }, [live]);

  const byId = useMemo(() => Object.fromEntries(partners.map((p) => [p.id, p])), [partners]);
  const confirmed = redemptions.filter((r) => r.status === "confirmed");
  const usedAt = (id: string) => confirmed.filter((r) => r.partnerId === id).length;
  const saved = confirmed.reduce((sum, r) => sum + r.saving, 0);

  function issue(p: Partner) {
    const id = redemptions.length + 1;
    const code = newCode();
    const issuedAt = timestamp();
    setNow(issuedAt);
    setRedemptions((rs) => [...rs, { id, partnerId: p.id, code, issuedAt, status: "issued", saving: p.saving, offer: p.offer }]);
    setScreen({ name: "redeem", id: p.id, redemptionId: id });
  }
  function setStatus(id: number, status: Redemption["status"]) {
    setRedemptions((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }
  function updateHome(patch: Partial<Partner>) {
    setPartners((ps) => ps.map((p) => (p.id === HOME_PARTNER_ID ? { ...p, ...patch } : p)));
  }

  const q = query.trim().toLowerCase();
  const list = partners.filter(
    (p) =>
      (!category || p.category === category) &&
      (!hood || p.neighbourhood === hood) &&
      (!q || `${p.name} ${p.kind} ${p.neighbourhood} ${p.offer}`.toLowerCase().includes(q)),
  );

  /* ---------- Member screens ---------- */

  function renderExplore() {
    const today = list.filter((p) => p.days[TODAY]).length;
    return (
      <div key="explore" className="m-enter pb-32">
        <header className="px-5 pt-5">
          <p className="text-[13px] font-medium" style={{ color: C.muted }}>{copy.todayLabel} · Toronto</p>
          <h1 className="mt-1 text-[34px] leading-[1.05]" style={serif}>{copy.explore.title}</h1>
          <label className="mt-4 flex h-12 items-center gap-2.5 rounded-2xl border px-4 focus-within:ring-2 focus-within:ring-[#A9D1FF]" style={{ background: C.panel, borderColor: C.line }}>
            <MagnifyingGlass size={19} aria-hidden="true" style={{ color: C.muted }} />
            <span className="sr-only">Search places</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
          {list.map((p, i) => {
            const runs = p.days[TODAY];
            return (
              <li key={p.id}>
                <button type="button" onClick={() => setScreen({ name: "place", id: p.id })} className="m-press block w-full text-left">
                  <span className="relative block aspect-[16/10] overflow-hidden rounded-[22px]">
                    <Photo p={p} className="absolute inset-0 size-full" priority={i < 2} />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#0A1424]/60 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: C.ice, color: C.iceInk }}>{offerKind(p)}</span>
                    <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/35 backdrop-blur"><Heart size={18} aria-hidden="true" /></span>
                    <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-semibold backdrop-blur">
                      <span className="size-2 rounded-full" style={{ background: runs ? C.ok : "#8A97AD" }} />
                      {runs ? copy.explore.runsToday : `Next: ${nextDay(p.days).slice(0, 3)}`}
                    </span>
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="text-[24px] leading-tight" style={serif}>{p.name}</span>
                    <span className="shrink-0 text-[13px]" style={{ color: C.muted }}>{p.neighbourhood}</span>
                  </span>
                  <span className="mt-0.5 block text-[15px]" style={{ color: C.muted }}>{p.kind} · {p.offer}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {list.length === 0 && <p className="mt-6 px-5" style={{ color: C.muted }}>{copy.explore.empty}</p>}
      </div>
    );
  }

  function renderPlace(p: Partner) {
    const left = Math.max(0, p.usesPerYear - usedAt(p.id));
    const runsToday = p.days[TODAY];
    const Icon = catIcon[p.category];
    return (
      <div key={`place-${p.id}`} className="m-push">
        <div className="relative h-[430px]">
          <Photo p={p} size={1200} priority className="absolute inset-0 size-full" />
          <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(10,20,36,0.5) 0%, transparent 25%, transparent 45%, ${C.bg} 100%)` }} />
          <div className="absolute inset-x-4 top-4 flex justify-between">
            <button type="button" onClick={() => setScreen({ name: "explore" })} aria-label={copy.place.back} className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-md">
              <CaretLeft size={22} weight="bold" aria-hidden="true" />
            </button>
            <div className="flex gap-2">
              <button type="button" aria-label="Share" className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-md"><ShareNetwork size={20} aria-hidden="true" /></button>
              <button type="button" aria-label="Save" className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-md"><Heart size={20} aria-hidden="true" /></button>
            </div>
          </div>
          {p.credit && <p className="absolute right-4 top-[72px] rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{p.credit}</p>}
          <div className="absolute inset-x-5 bottom-1">
            {p.founding && <p className={label} style={{ color: C.ice }}>{copy.place.founding}</p>}
            <h1 className="mt-1 text-[40px] leading-[1]" style={serif}>{p.name}</h1>
          </div>
        </div>

        <div className="px-5">
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px]" style={{ color: C.muted }}>
            <span className="flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" />{p.neighbourhood}</span>
            <span className="flex items-center gap-1.5"><Icon size={16} aria-hidden="true" />{p.kind}</span>
            <span className="flex items-center gap-1.5" style={{ color: runsToday ? C.ok : undefined }}>
              <Clock size={16} aria-hidden="true" />{runsToday ? copy.explore.runsToday : `Next: ${nextDay(p.days)}`}
            </span>
          </p>
          <p className="mt-4 text-[16px] leading-relaxed" style={{ color: C.soft }}>{p.blurb}</p>

          <section className="mt-6 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }} aria-labelledby="offer-h">
            <p className={label} style={{ color: C.ice }}>{offerKind(p)}</p>
            <h2 id="offer-h" className="mt-2 text-[26px] leading-tight" style={serif}>{p.offer}</h2>
            <p className="mt-1 text-[15px]" style={{ color: C.muted }}>{p.detail}</p>
            <p className={`${label} mb-2.5 mt-5`} style={{ color: C.muted }}>{copy.place.days}</p>
            <DayDots days={p.days} />
            <div className="mt-5 flex items-center gap-3">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {Array.from({ length: p.usesPerYear }).map((_, i) => (
                  <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < left ? C.ice : "rgba(255,255,255,0.14)" }} />
                ))}
              </div>
              <span className="text-[13px] font-semibold">{copy.place.usesLeft(left, p.usesPerYear)}</span>
            </div>
          </section>

          <ul className="mt-5 space-y-3.5 text-[15px]" style={{ color: C.soft }}>
            {copy.place.rules.map((r, i) => {
              const RIcon = RULE_ICONS[i] ?? Receipt;
              return (
                <li key={r} className="flex gap-3">
                  <RIcon size={20} aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: C.ice }} />
                  {r}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sticky bottom-0 z-10 mt-6 px-5 pb-[max(env(safe-area-inset-bottom),18px)] pt-6" style={{ background: `linear-gradient(to top, ${C.bg} 72%, transparent)` }}>
          {left === 0 ? (
            <p className="rounded-[20px] border px-4 py-4 text-center font-semibold" style={{ borderColor: C.line, color: C.soft }}>{copy.place.usedUp}</p>
          ) : runsToday ? (
            <button type="button" onClick={() => issue(p)} className="m-press flex h-[58px] w-full items-center justify-between rounded-[20px] px-6 text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
              <span>{copy.place.redeem}</span>
              <span className="text-[15px] font-semibold">Save about ${p.saving}</span>
            </button>
          ) : (
            <p className="rounded-[20px] border px-4 py-4 text-center font-semibold" style={{ borderColor: C.line, color: C.soft }}>{copy.place.notToday(nextDay(p.days))}</p>
          )}
        </div>
      </div>
    );
  }

  function renderRedeem(p: Partner, r: Redemption) {
    const msLeft = Math.min(CODE_LIFE_MS, Math.max(0, r.issuedAt + CODE_LIFE_MS - now));
    const secs = Math.ceil(msLeft / 1000);
    const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    const expired = r.status === "issued" && msLeft === 0;
    const done = r.status === "confirmed";

    return (
      <div key={`redeem-${r.id}`} className="m-enter flex min-h-full flex-col px-5 pb-8 pt-4" role="region" aria-labelledby="redeem-h">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (!done) setStatus(r.id, "cancelled");
              setScreen(done ? { name: "explore" } : { name: "place", id: p.id });
            }}
            aria-label="Close"
            className="grid size-11 place-items-center rounded-full border"
            style={{ borderColor: C.line }}
          >
            <X size={20} aria-hidden="true" />
          </button>
          <p className="text-[13px] font-semibold" style={{ color: C.muted }}>{done ? "Confirmed" : "Show at the table"}</p>
          <span className="size-11" />
        </div>

        <div className="my-auto py-6">
          <div className="m-pop overflow-hidden rounded-[28px]" style={cardGlow}>
            <div className="relative h-[130px]">
              <Photo p={p} priority className="absolute inset-0 size-full" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#0F1E38] to-transparent" />
              <span className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
              <div className="absolute left-5 top-4"><Wordmark size={16} /></div>
              <p className="absolute bottom-3 left-5 text-[26px] leading-none" style={serif}>{p.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-y-3 px-5 pt-4 text-[14px]">
              <div><p className={label} style={{ color: C.muted, fontSize: 10 }}>Member</p><p className="font-semibold">Alex</p></div>
              <div className="text-right"><p className={label} style={{ color: C.muted, fontSize: 10 }}>Neighbourhood</p><p className="font-semibold">{p.neighbourhood}</p></div>
              <div className="col-span-2"><p className={label} style={{ color: C.muted, fontSize: 10 }}>Offer</p><p className="font-semibold">{p.offer}</p></div>
            </div>
            <div className="mx-5 my-4 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.18)" }} />
            {done ? (
              <div className="flex items-center gap-4 px-5 pb-6" role="status">
                <span className="m-pop grid size-16 shrink-0 place-items-center rounded-full" style={{ background: C.ice, color: C.iceInk }}>
                  <Check size={34} weight="bold" aria-hidden="true" />
                </span>
                <div>
                  <h1 id="redeem-h" className="text-[30px] leading-none" style={serif}>{copy.redeem.doneTitle}</h1>
                  <p className="mt-1 text-[15px]" style={{ color: C.soft }}>{copy.redeem.doneText(r.saving)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 px-5 pb-5">
                <div>
                  <h1 id="redeem-h" className={label} style={{ color: C.ice, fontSize: 12 }}>{copy.redeem.title}</h1>
                  <p aria-label={`Code ${r.code.split("").join(" ")}`} className="tabular mt-1 text-[42px] font-bold leading-none tracking-[0.06em]">{splitCode(r.code)}</p>
                </div>
                <Ring fraction={msLeft / CODE_LIFE_MS}>
                  <span className="text-center">
                    <span className="tabular block text-[20px] font-bold">{mmss}</span>
                    <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>left</span>
                  </span>
                </Ring>
              </div>
            )}
          </div>

          {done ? (
            <button type="button" onClick={() => setScreen({ name: "explore" })} className="m-press mt-6 h-14 w-full rounded-[20px] text-[16px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
              {copy.redeem.doneBack}
            </button>
          ) : expired ? (
            <p className="mt-6 rounded-[20px] border px-4 py-4 text-center font-semibold" style={{ borderColor: C.line, color: C.soft }} role="status">{copy.redeem.expired}</p>
          ) : (
            <>
              <p className="mt-5 text-center text-[14px]" style={{ color: C.muted }} role="status">{copy.redeem.waiting}</p>
              <button
                type="button"
                onClick={() => {
                  setStaffTab("door");
                  setMode("partner");
                }}
                className="m-press mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-[20px] text-[15px] font-bold"
                style={{ background: C.ice, color: C.iceInk }}
              >
                <Scan size={20} weight="bold" aria-hidden="true" />
                See what your staff see
              </button>
              <button type="button" onClick={() => setStatus(r.id, "confirmed")} className="m-press mt-4 min-h-14 w-full rounded-[20px] border border-dashed px-4 py-3 text-[14px] font-semibold" style={{ borderColor: C.ice, color: C.ice }}>
                {copy.redeem.demoConfirm}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus(r.id, "cancelled");
                  setScreen({ name: "place", id: p.id });
                }}
                className="mt-1 h-12 w-full text-[15px] font-semibold"
                style={{ color: C.muted }}
              >
                {copy.redeem.cancel}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  function renderPass() {
    return (
      <div key="pass" className="m-enter px-5 pb-32 pt-5">
        <h1 className="text-[34px] leading-none" style={serif}>{copy.pass.title}</h1>
        <div className="relative mt-5 aspect-[1.586] overflow-hidden rounded-[24px] p-5" style={cardGlow}>
          <div aria-hidden="true" className="absolute -right-10 -top-12 size-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(169,209,255,0.35), transparent 70%)" }} />
          <div className="relative flex items-center justify-between">
            <Wordmark size={22} />
            <span className={label} style={{ color: C.ice }}>Member</span>
          </div>
          <div className="absolute inset-x-5 bottom-5">
            <p className={label} style={{ color: C.muted, fontSize: 10 }}>Name</p>
            <p className="text-[18px] font-semibold">Alex</p>
            <p className="mt-0.5 text-[13px]" style={{ color: C.muted }}>{copy.pass.holder}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border p-4" style={{ background: C.panel, borderColor: C.line }}>
            <p className={label} style={{ color: C.muted }}>{copy.pass.saved}</p>
            <p className="tabular mt-1 text-[36px] leading-none" style={{ ...serif, color: C.ice }}>${saved}</p>
          </div>
          <div className="rounded-[22px] border p-4" style={{ background: C.panel, borderColor: C.line }}>
            <p className={label} style={{ color: C.muted }}>{copy.pass.used}</p>
            <p className="tabular mt-1 text-[36px] leading-none" style={serif}>{confirmed.length}</p>
          </div>
        </div>

        <h2 className={`${label} mt-8`} style={{ color: C.muted }}>{copy.pass.history}</h2>
        {confirmed.length === 0 ? (
          <p className="mt-3" style={{ color: C.muted }}>{copy.pass.none}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {[...confirmed].reverse().map((r) => {
              const p = byId[r.partnerId];
              return (
                <li key={r.id} className="flex items-center gap-3 rounded-[18px] border p-2.5" style={{ background: C.panel, borderColor: C.line }}>
                  {p && <Photo p={p} className="size-14 shrink-0 rounded-[14px]" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px]" style={serif}>{p?.name}</span>
                    <span className="block truncate text-[13px]" style={{ color: C.muted }}>{r.offer}</span>
                  </span>
                  <span className="tabular shrink-0 pr-2 text-[14px] font-semibold" style={{ color: C.ice }}>about ${r.saving}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  /* ---------- Partner (staff) view ---------- */

  function renderStaff() {
    const home = byId[HOME_PARTNER_ID];
    const mine = redemptions.filter((r) => r.partnerId === HOME_PARTNER_ID && r.status !== "cancelled");
    const waiting = mine.filter((r) => r.status === "issued" && r.issuedAt + CODE_LIFE_MS > now);
    const done = mine.filter((r) => r.status === "confirmed");
    const dayCount = home.days.filter(Boolean).length;
    const preset = OFFER_PRESETS.find((o) => o.offer === home.offer)?.id ?? OFFER_PRESETS[0].id;
    const tabs = [
      { id: "door", name: copy.staff.door, Icon: DoorOpen },
      { id: "offer", name: copy.staff.offer, Icon: Sliders },
      { id: "week", name: copy.staff.week, Icon: ChartBar },
    ] as const;

    return (
      <div key="staff" className="m-enter pb-32">
        <div className="relative h-[150px]">
          <Photo p={home} priority className="absolute inset-0 size-full" />
          <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(10,20,36,0.25), ${C.bg})` }} />
          <button
            type="button"
            onClick={() => setMode("member")}
            className="absolute left-4 top-4 flex min-h-[44px] items-center gap-1.5 rounded-full bg-black/45 px-4 text-[13px] font-semibold backdrop-blur-md"
          >
            <CaretLeft size={16} weight="bold" aria-hidden="true" />
            Back to member view
          </button>
          <div className="absolute inset-x-5 bottom-2">
            <p className={label} style={{ color: C.ice }}>{copy.staff.sub}</p>
            <h1 className="mt-1 text-[34px] leading-none" style={serif}>{copy.staff.title}</h1>
          </div>
        </div>

        <div className="mx-5 mt-4 grid grid-cols-3 rounded-2xl border p-1" style={{ background: C.panel, borderColor: C.line }} role="tablist" aria-label="Staff sections">
          {tabs.map(({ id, name, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={staffTab === id}
              onClick={() => setStaffTab(id)}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold"
              style={staffTab === id ? { background: C.ice, color: C.iceInk } : { color: C.muted }}
            >
              <Icon size={16} weight={staffTab === id ? "fill" : "regular"} aria-hidden="true" />
              {name}
            </button>
          ))}
        </div>

        {staffTab === "door" && (
          <section key="door" className="m-enter mt-5 px-5" aria-label={copy.staff.door}>
            {waiting.length === 0 && done.length === 0 && (
              <div className="rounded-[22px] border p-5 text-center" style={{ borderColor: C.line }}>
                <Scan size={34} aria-hidden="true" className="mx-auto" style={{ color: C.ice }} />
                <p className="mt-3 text-[15px]" style={{ color: C.soft }}>{copy.staff.noCode}</p>
              </div>
            )}
            <ul className="space-y-3">
              {waiting.map((r) => (
                <li key={r.id} className="m-pop rounded-[24px] p-5" style={cardGlow}>
                  <p className={label} style={{ color: C.ice }}>New at the table</p>
                  <p className="tabular mt-2 text-[44px] font-bold leading-none tracking-[0.06em]">{splitCode(r.code)}</p>
                  <p className="mt-2 text-[14px]" style={{ color: C.soft }}>Alex · {home.offer}</p>
                  <p className="text-[13px]" style={{ color: C.muted }}>Check the guest&apos;s screen shows the same code.</p>
                  <button type="button" onClick={() => setStatus(r.id, "confirmed")} className="m-press mt-4 h-14 w-full rounded-[18px] text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
                    {copy.staff.confirm}
                  </button>
                </li>
              ))}
              {done.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 rounded-[18px] border px-4 py-3.5" style={{ background: C.panel, borderColor: C.line }}>
                  <span className="tabular tracking-[0.06em]">{splitCode(r.code)}</span>
                  <span className="flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: C.ok }}>
                    <Check size={16} weight="bold" aria-hidden="true" />{copy.staff.confirmed}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {staffTab === "offer" && (
          <section key="offer" className="m-enter mt-5 px-5" aria-labelledby="offer-title">
            <h2 id="offer-title" className="sr-only">{copy.staff.offer}</h2>
            <p className="text-[14px]" style={{ color: C.muted }}>{copy.staff.offerNote}</p>
            <div className="mt-3 space-y-5 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }}>
              <fieldset>
                <legend className={label} style={{ color: C.muted }}>{copy.staff.type}</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {OFFER_PRESETS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={preset === o.id}
                      onClick={() => updateHome({ offer: o.offer, detail: o.detail, saving: o.saving })}
                      className="min-h-[48px] rounded-2xl border px-3 text-[14px] font-semibold"
                      style={preset === o.id ? { background: C.ice, color: C.iceInk, borderColor: C.ice } : { borderColor: C.line, color: C.soft }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className={label} style={{ color: C.muted }}>{copy.staff.days}</legend>
                <div className="mt-2 grid grid-cols-7 gap-1.5">
                  {DAY_SHORT.map((d, i) => {
                    const on = home.days[i];
                    const locked = on && dayCount <= 3;
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        aria-label={DAY_NAMES[i]}
                        disabled={locked}
                        onClick={() => updateHome({ days: home.days.map((v, j) => (j === i ? !v : v)) })}
                        className="min-h-[44px] rounded-xl text-[12px] font-bold"
                        style={on ? { background: C.ice, color: C.iceInk } : { border: `1px solid ${C.line}`, color: C.muted }}
                      >
                        {d.slice(0, 2)}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[13px]" style={{ color: C.muted }}>{copy.staff.daysMin}</p>
              </fieldset>

              <div className="flex items-center justify-between gap-4">
                <p id="uses-label" className={`${label} max-w-[10rem]`} style={{ color: C.muted }}>{copy.staff.uses}</p>
                <div className="flex items-center gap-3" role="group" aria-labelledby="uses-label">
                  <button type="button" aria-label="Fewer uses" disabled={home.usesPerYear <= 1} onClick={() => updateHome({ usesPerYear: home.usesPerYear - 1 })} className="grid size-11 place-items-center rounded-full border disabled:opacity-40" style={{ borderColor: C.line }}>
                    <Minus size={18} weight="bold" aria-hidden="true" />
                  </button>
                  <span className="tabular w-8 text-center text-[30px] leading-none" style={serif} aria-live="polite">{home.usesPerYear}</span>
                  <button type="button" aria-label="More uses" disabled={home.usesPerYear >= 12} onClick={() => updateHome({ usesPerYear: home.usesPerYear + 1 })} className="grid size-11 place-items-center rounded-full border disabled:opacity-40" style={{ borderColor: C.line }}>
                    <Plus size={18} weight="bold" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <p className={`${label} mb-2 mt-6`} style={{ color: C.muted }}>{copy.staff.preview}</p>
            <div className="overflow-hidden rounded-[22px] border" style={{ background: C.panel, borderColor: C.line }}>
              <div className="relative aspect-[16/8]">
                <Photo p={home} className="absolute inset-0 size-full" />
                <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: C.ice, color: C.iceInk }}>{offerKind(home)}</span>
              </div>
              <div className="p-4">
                <p className="text-[22px] leading-tight" style={serif}>{home.name}</p>
                <p className="mt-1 font-semibold">{home.offer}</p>
                <p className="mt-1 text-[13px]" style={{ color: C.muted }}>
                  {daysLabel(home.days)} · {home.usesPerYear} {home.usesPerYear === 1 ? "use" : "uses"} a year
                </p>
                <div className="mt-3"><DayDots days={home.days} /></div>
              </div>
            </div>
          </section>
        )}

        {staffTab === "week" && (
          <section key="week" className="m-enter mt-5 px-5" aria-labelledby="week-title">
            <h2 id="week-title" className="text-[26px] leading-tight" style={serif}>{copy.staff.week}</h2>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              {copy.staff.weekStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse rounded-[18px] border p-3.5" style={{ background: C.panel, borderColor: C.line }}>
                  <dt className="mt-1.5 text-[12px] font-semibold" style={{ color: C.muted }}>{s.label}</dt>
                  <dd className="text-[30px] leading-none" style={serif}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[13px]" style={{ color: C.muted }}>{copy.staff.weekNote}</p>
          </section>
        )}
      </div>
    );
  }

  /* ---------- Shell ---------- */

  let body: React.ReactNode;
  if (mode === "partner") body = renderStaff();
  else if (screen.name === "place" && byId[screen.id]) body = renderPlace(byId[screen.id]);
  else if (screen.name === "redeem" && byId[screen.id]) {
    const r = redemptions.find((x) => x.id === screen.redemptionId);
    body = r ? renderRedeem(byId[screen.id], r) : renderExplore();
  } else if (screen.name === "pass") body = renderPass();
  else body = renderExplore();

  const showTabs = mode === "partner" || screen.name === "explore" || screen.name === "pass";
  const current = mode === "partner" ? "staff" : screen.name === "pass" ? "pass" : "explore";
  const tabs = [
    { id: "explore", name: copy.pass.exploreTab, Icon: Compass },
    { id: "pass", name: copy.pass.tab, Icon: Wallet },
    { id: "staff", name: "Staff view", Icon: Scan },
  ] as const;

  return (
    <div
      className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:my-6 sm:h-[min(880px,calc(100dvh-48px))] sm:rounded-[44px] sm:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
      style={{ background: C.bg, color: C.text, fontFamily: "var(--f-figtree)" }}
    >
      <p className="border-b px-5 py-2 text-center text-[12px] font-medium" style={{ borderColor: C.line, color: C.muted }}>
        {copy.banner}
      </p>

      <div className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto">{body}</div>

      {showTabs && (
        <nav aria-label="Demo" className="absolute inset-x-4 bottom-[max(env(safe-area-inset-bottom),14px)] z-20 rounded-[26px] border px-2 py-1.5 backdrop-blur-xl" style={{ background: "rgba(18,32,56,0.88)", borderColor: C.line }}>
          <ul className="grid grid-cols-3">
            {tabs.map(({ id, name, Icon }) => {
              const on = current === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={on ? "page" : undefined}
                    onClick={() => {
                      if (id === "staff") setMode("partner");
                      else {
                        setMode("member");
                        setScreen(id === "pass" ? { name: "pass" } : { name: "explore" });
                      }
                    }}
                    className="flex min-h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-semibold"
                    style={on ? { background: "rgba(169,209,255,0.14)", color: C.ice } : { color: C.muted }}
                  >
                    <Icon size={24} weight={on ? "fill" : "regular"} aria-hidden="true" />
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
