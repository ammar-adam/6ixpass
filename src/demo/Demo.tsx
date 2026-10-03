"use client";

import { useEffect, useMemo, useState } from "react";
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
 * The clickable demo. Everything lives in memory: nothing is saved and
 * nothing talks to a server. Refresh the page and it starts again.
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
};

const CODE_LIFE_MS = 10 * 60 * 1000;

// Kept outside the component: these give a different answer every call.
const timestamp = () => Date.now();
const newCode = () => String(Math.floor(100000 + Math.random() * 900000));

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

/* A small drawn picture per category, in the site's colours. */
function Art({ category, className = "" }: { category: Category; className?: string }) {
  const base = "var(--color-peach-soft)";
  const mid = "var(--color-peach)";
  const cool = "var(--color-mist-2)";
  const ink = "var(--color-ink)";
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="320" height="160" fill={category === "Spa and wellness" || category === "Studios" ? cool : base} />
      {category === "Dining" && (
        <>
          <rect y="108" width="320" height="52" fill={cool} />
          <rect y="104" width="320" height="6" fill={mid} />
          <circle cx="112" cy="112" r="44" fill="#fff" />
          <circle cx="112" cy="112" r="30" fill="none" stroke={ink} strokeOpacity="0.18" strokeWidth="2" />
          <circle cx="214" cy="118" r="36" fill="#fff" />
          <circle cx="214" cy="118" r="24" fill={mid} fillOpacity="0.7" />
        </>
      )}
      {category === "Hotels" && (
        <>
          <rect y="112" width="320" height="48" fill={cool} />
          <rect x="52" y="30" width="56" height="82" rx="28" fill="#fff" />
          <rect x="132" y="30" width="56" height="82" rx="28" fill="#fff" />
          <rect x="212" y="30" width="56" height="82" rx="28" fill={mid} />
          <rect y="110" width="320" height="4" fill={ink} fillOpacity="0.2" />
        </>
      )}
      {category === "Spa and wellness" && (
        <>
          <circle cx="238" cy="52" r="30" fill={mid} />
          {[92, 112, 132].map((y, i) => (
            <path
              key={y}
              d={`M0 ${y} q40 -16 80 0 t80 0 t80 0 t80 0 V160 H0 Z`}
              fill={i === 1 ? "#fff" : base}
              fillOpacity={i === 2 ? 1 : 0.85}
            />
          ))}
        </>
      )}
      {category === "Studios" && (
        <>
          <path d="M40 160 a120 120 0 0 1 240 0 Z" fill={base} />
          <path d="M84 160 a76 76 0 0 1 152 0 Z" fill="#fff" />
          <path d="M124 160 a36 36 0 0 1 72 0 Z" fill={mid} />
        </>
      )}
      {category === "Experiences" && (
        <>
          <rect x="40" y="26" width="72" height="108" rx="14" fill="#fff" />
          <rect x="124" y="46" width="72" height="88" rx="14" fill={mid} />
          <rect x="208" y="26" width="72" height="108" rx="14" fill={cool} />
          <circle cx="160" cy="90" r="16" fill="#fff" />
        </>
      )}
    </svg>
  );
}

function DayStrip({ days, dark = false }: { days: boolean[]; dark?: boolean }) {
  return (
    <>
      <p className="sr-only">Runs {DAY_NAMES.filter((_, i) => days[i]).join(", ")}.</p>
      <div aria-hidden="true" className="grid grid-cols-7 gap-[5px]">
        {DAY_LETTERS.map((d, i) => (
          <span
            key={i}
            className={`rounded-lg py-2 text-center text-xs font-semibold ${
              days[i] ? (dark ? "bg-peach text-ink" : "bg-ink text-white") : dark ? "bg-white/10 text-pale" : "bg-mist text-muted"
            } ${i === TODAY ? "ring-2 ring-peach ring-offset-1" : ""}`}
          >
            {d}
          </span>
        ))}
      </div>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold ${
        active ? "bg-ink text-white" : "bg-white text-ink hover:bg-mist-2"
      }`}
    >
      {children}
    </button>
  );
}

export function Demo() {
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [mode, setMode] = useState<"member" | "partner">("member");
  const [screen, setScreen] = useState<Screen>({ name: "explore" });
  const [category, setCategory] = useState<Category | null>(null);
  const [hood, setHood] = useState<string | null>(null);
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
    setRedemptions((rs) => [...rs, { id, partnerId: p.id, code, issuedAt, status: "issued", saving: p.saving }]);
    setScreen({ name: "redeem", id: p.id, redemptionId: id });
  }
  function setStatus(id: number, status: Redemption["status"]) {
    setRedemptions((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }
  function updateHome(patch: Partial<Partner>) {
    setPartners((ps) => ps.map((p) => (p.id === HOME_PARTNER_ID ? { ...p, ...patch } : p)));
  }

  const list = partners.filter((p) => (!category || p.category === category) && (!hood || p.neighbourhood === hood));

  /* ---------- Member screens ---------- */

  function renderExplore() {
    return (
      <div className="px-4 pb-6 pt-5">
        <p className="text-sm font-semibold text-muted">{copy.todayLabel}</p>
        <h1 className="mt-1 font-serif text-[40px] leading-none tracking-tight">{copy.explore.title}</h1>

        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Category">
          <Chip active={!category} onClick={() => setCategory(null)}>{copy.explore.all}</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>{c}</Chip>
          ))}
        </div>
        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Neighbourhood">
          <Chip active={!hood} onClick={() => setHood(null)}>{copy.explore.anywhere}</Chip>
          {NEIGHBOURHOODS.map((n) => (
            <Chip key={n} active={hood === n} onClick={() => setHood(hood === n ? null : n)}>{n}</Chip>
          ))}
        </div>

        <ul className="mt-5 grid gap-4">
          {list.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setScreen({ name: "place", id: p.id })}
                className="block w-full overflow-hidden rounded-[22px] bg-white text-left shadow-[0_16px_32px_-24px_rgba(15,46,51,0.5)]"
              >
                <Art category={p.category} className={`h-[112px] w-full ${i % 2 ? "-scale-x-100" : ""}`} />
                <span className="block p-4">
                  <span className="flex items-center justify-between gap-3 text-[13px] font-semibold text-muted">
                    <span>{p.neighbourhood} · {p.kind}</span>
                    <span className={`rounded-full px-2.5 py-1 ${p.days[TODAY] ? "bg-peach text-ink" : "bg-mist text-muted"}`}>
                      {p.days[TODAY] ? copy.explore.runsToday : copy.explore.notToday}
                    </span>
                  </span>
                  <span className="mt-2 block font-serif text-[26px] leading-tight">{p.name}</span>
                  <span className="mt-1 block font-semibold">{p.offer}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="mt-8 text-muted">{copy.explore.empty}</p>}
      </div>
    );
  }

  function renderPlace(p: Partner) {
    const left = Math.max(0, p.usesPerYear - usedAt(p.id));
    const runsToday = p.days[TODAY];
    return (
      <div className="pb-6">
        <div className="relative">
          <Art category={p.category} className="h-[190px] w-full" />
          <button
            type="button"
            onClick={() => setScreen({ name: "explore" })}
            className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow"
          >
            ← {copy.place.back}
          </button>
        </div>
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between gap-3 text-[13px] font-semibold text-muted">
            <span>{p.neighbourhood} · {p.kind}</span>
            {p.founding && <span className="rounded-full bg-white px-2.5 py-1 text-ink">{copy.place.founding}</span>}
          </div>
          <h1 className="mt-2 font-serif text-[36px] leading-[1.05] tracking-tight">{p.name}</h1>
          <p className="mt-2 text-muted">{p.blurb}</p>

          <div className="mt-5 rounded-[22px] bg-white p-5">
            <p className="font-serif text-[26px] leading-tight">{p.offer}</p>
            <p className="mt-1.5 text-muted">{p.detail}</p>
            <p className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{copy.place.days}</p>
            <DayStrip days={p.days} />
            <p className="mt-4 text-sm font-semibold">{copy.place.usesLeft(left, p.usesPerYear)}</p>
          </div>

          <ul className="mt-5 grid gap-2 text-sm text-muted">
            {copy.place.rules.map((r) => (
              <li key={r} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ink" />
                {r}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {left === 0 ? (
              <p className="rounded-xl bg-mist-2 px-4 py-3.5 text-center font-semibold">{copy.place.usedUp}</p>
            ) : runsToday ? (
              <button
                type="button"
                onClick={() => issue(p)}
                className="w-full rounded-xl bg-ink px-6 py-4 text-lg font-semibold text-white hover:bg-ink-2"
              >
                {copy.place.redeem}
              </button>
            ) : (
              <p className="rounded-xl bg-mist-2 px-4 py-3.5 text-center font-semibold">{copy.place.notToday(nextDay(p.days))}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderRedeem(p: Partner, r: Redemption) {
    const msLeft = Math.max(0, r.issuedAt + CODE_LIFE_MS - now);
    const mm = String(Math.floor(msLeft / 60000));
    const ss = String(Math.floor((msLeft % 60000) / 1000)).padStart(2, "0");
    const expired = r.status === "issued" && msLeft === 0;

    if (r.status === "confirmed") {
      return (
        <div className="flex min-h-full flex-col items-center justify-center bg-ink px-6 py-16 text-center text-mist">
          <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-peach text-3xl text-ink">✓</span>
          <h1 className="mt-6 font-serif text-[56px] italic leading-none text-peach">{copy.redeem.doneTitle}</h1>
          <p className="mt-4 text-lg" role="status">{copy.redeem.doneText(r.saving)}</p>
          <p className="mt-1 text-pale">{p.name}</p>
          <button
            type="button"
            onClick={() => setScreen({ name: "explore" })}
            className="mt-10 rounded-xl bg-peach px-6 py-3.5 font-semibold text-ink"
          >
            {copy.redeem.doneBack}
          </button>
        </div>
      );
    }

    return (
      <div className="on-dark flex min-h-full flex-col bg-ink px-5 pb-8 pt-8 text-mist">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-pale">{copy.redeem.title}</p>
        <p className="mt-2 font-serif text-[30px] leading-tight">{p.name}</p>
        <p className="text-pale">{p.offer}</p>

        <div className="mt-8 rounded-[24px] bg-white px-4 py-8 text-center text-ink">
          <p aria-label={`Code ${r.code.split("").join(" ")}`} className="font-serif text-[64px] leading-none tracking-[0.08em] tabular-nums">
            {r.code.slice(0, 3)} {r.code.slice(3)}
          </p>
          {expired ? (
            <p className="mt-4 font-semibold text-error">{copy.redeem.expired}</p>
          ) : (
            <p className="mt-4 text-sm font-semibold text-muted">
              {copy.redeem.expires} <span className="tabular-nums text-ink">{mm}:{ss}</span>
            </p>
          )}
        </div>

        {!expired && (
          <>
            <p className="mt-6 text-center text-pale" role="status">{copy.redeem.waiting}</p>
            <button
              type="button"
              onClick={() => setStatus(r.id, "confirmed")}
              className="mt-4 rounded-xl border-[1.5px] border-dashed border-peach px-4 py-3.5 text-sm font-semibold text-peach"
            >
              {copy.redeem.demoConfirm}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus(r.id, "cancelled");
            setScreen({ name: "place", id: p.id });
          }}
          className="mt-auto pt-8 text-sm font-semibold text-pale underline underline-offset-4"
        >
          {copy.redeem.cancel}
        </button>
      </div>
    );
  }

  function renderPass() {
    return (
      <div className="px-4 pb-6 pt-5">
        <h1 className="font-serif text-[40px] leading-none tracking-tight">{copy.pass.title}</h1>
        <div className="mt-5 rounded-[24px] bg-ink p-6 text-mist">
          <p className="font-serif text-[26px] tracking-tight">
            the <span className="mx-0.5 inline-grid size-7 -translate-y-0.5 place-items-center rounded-full border-[1.8px] border-current font-sans text-[15px] font-bold">6</span> pass
          </p>
          <p className="mt-10 text-sm text-pale">{copy.pass.holder}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-mist/25 pt-4">
            <div>
              <p className="text-sm text-pale">{copy.pass.saved}</p>
              <p className="font-serif text-[40px] leading-none text-peach tabular-nums">${saved}</p>
            </div>
            <div>
              <p className="text-sm text-pale">{copy.pass.used}</p>
              <p className="font-serif text-[40px] leading-none tabular-nums">{confirmed.length}</p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{copy.pass.history}</h2>
        {confirmed.length === 0 ? (
          <p className="mt-3 text-muted">{copy.pass.none}</p>
        ) : (
          <ul className="mt-2 border-t border-ink/15">
            {[...confirmed].reverse().map((r) => (
              <li key={r.id} className="flex items-baseline justify-between gap-4 border-b border-ink/15 py-3.5">
                <span>
                  <span className="block font-semibold">{byId[r.partnerId]?.name}</span>
                  <span className="text-sm text-muted">{byId[r.partnerId]?.offer}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">about ${r.saving}</span>
              </li>
            ))}
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

    return (
      <div className="px-4 pb-8 pt-5">
        <p className="text-sm font-semibold text-muted">{copy.staff.sub}</p>
        <h1 className="mt-1 font-serif text-[40px] leading-none tracking-tight">{copy.staff.title}</h1>

        <section className="mt-6 rounded-[22px] bg-ink p-5 text-mist" aria-labelledby="door-title">
          <h2 id="door-title" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-pale">{copy.staff.door}</h2>
          {waiting.length === 0 && done.length === 0 && <p className="mt-3 text-pale">{copy.staff.noCode}</p>}
          <ul className="mt-2 grid gap-3">
            {waiting.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 text-ink">
                <span>
                  <span className="block font-serif text-[34px] leading-none tabular-nums tracking-[0.06em]">
                    {r.code.slice(0, 3)} {r.code.slice(3)}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{home.offer}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStatus(r.id, "confirmed")}
                  className="rounded-xl bg-peach px-5 py-3 font-bold text-ink"
                >
                  {copy.staff.confirm}
                </button>
              </li>
            ))}
            {done.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                <span className="tabular-nums tracking-[0.06em]">{r.code.slice(0, 3)} {r.code.slice(3)}</span>
                <span className="text-sm font-semibold text-peach">{copy.staff.confirmed}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6" aria-labelledby="offer-title">
          <h2 id="offer-title" className="font-serif text-[28px] leading-tight">{copy.staff.offer}</h2>
          <p className="text-sm text-muted">{copy.staff.offerNote}</p>

          <div className="mt-4 rounded-[22px] bg-white p-5">
            <fieldset>
              <legend className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{copy.staff.type}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {OFFER_PRESETS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={preset === o.id}
                    onClick={() => updateHome({ offer: o.offer, detail: o.detail, saving: o.saving })}
                    className={`rounded-xl border-[1.5px] px-3 py-3 text-sm font-semibold ${
                      preset === o.id ? "border-ink bg-ink text-white" : "border-ink/25 bg-white"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{copy.staff.days}</legend>
              <div className="mt-2 grid grid-cols-7 gap-[5px]">
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
                      className={`rounded-lg py-3 text-xs font-semibold ${on ? "bg-ink text-white" : "bg-mist text-muted"} disabled:opacity-100`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-muted">{copy.staff.daysMin}</p>
            </fieldset>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{copy.staff.uses}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Fewer uses"
                  disabled={home.usesPerYear <= 1}
                  onClick={() => updateHome({ usesPerYear: home.usesPerYear - 1 })}
                  className="grid size-11 place-items-center rounded-full bg-mist text-xl font-semibold disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-6 text-center font-serif text-[30px] leading-none tabular-nums" aria-live="polite">{home.usesPerYear}</span>
                <button
                  type="button"
                  aria-label="More uses"
                  disabled={home.usesPerYear >= 12}
                  onClick={() => updateHome({ usesPerYear: home.usesPerYear + 1 })}
                  className="grid size-11 place-items-center rounded-full bg-mist text-xl font-semibold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <p className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{copy.staff.preview}</p>
          <div className="overflow-hidden rounded-[22px] bg-white">
            <Art category={home.category} className="h-[96px] w-full" />
            <div className="p-4">
              <p className="font-serif text-[24px] leading-tight">{home.name}</p>
              <p className="mt-1 font-semibold">{home.offer}</p>
              <p className="mt-1 text-sm text-muted">{daysLabel(home.days)} · {home.usesPerYear} {home.usesPerYear === 1 ? "use" : "uses"} a year</p>
              <div className="mt-3"><DayStrip days={home.days} /></div>
            </div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="week-title">
          <h2 id="week-title" className="font-serif text-[28px] leading-tight">{copy.staff.week}</h2>
          <dl className="mt-3 grid grid-cols-3 gap-2">
            {copy.staff.weekStats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-3.5">
                <dd className="font-serif text-[30px] leading-none">{s.value}</dd>
                <dt className="mt-1.5 text-xs font-semibold text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-sm text-muted">{copy.staff.weekNote}</p>
        </section>
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

  const showTabs = mode === "member" && (screen.name === "explore" || screen.name === "pass");

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[440px] flex-col bg-mist sm:my-6 sm:h-[min(880px,calc(100dvh-48px))] sm:overflow-hidden sm:rounded-[40px] sm:border-[10px] sm:border-ink sm:shadow-[0_40px_80px_-40px_rgba(15,46,51,0.6)]">
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-2.5">
        <p className="text-xs font-semibold text-muted">{copy.banner}</p>
        <div className="flex shrink-0 rounded-full bg-mist p-1" role="group" aria-label="View">
          {(["member", "partner"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${mode === m ? "bg-ink text-white" : "text-ink"}`}
            >
              {m === "member" ? copy.member : copy.partner}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>

      {showTabs && (
        <nav aria-label="Demo" className="grid grid-cols-2 border-t border-ink/15 bg-white pb-[env(safe-area-inset-bottom)]">
          {(
            [
              ["explore", copy.pass.exploreTab],
              ["pass", copy.pass.tab],
            ] as const
          ).map(([name, label]) => (
            <button
              key={name}
              type="button"
              aria-current={screen.name === name ? "page" : undefined}
              onClick={() => setScreen(name === "pass" ? { name: "pass" } : { name: "explore" })}
              className={`py-4 text-sm font-semibold ${screen.name === name ? "text-ink" : "text-muted"}`}
            >
              <span className={`mx-auto mb-1.5 block h-1 w-8 rounded-full ${screen.name === name ? "bg-peach" : "bg-transparent"}`} />
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
