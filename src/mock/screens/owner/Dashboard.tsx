"use client";

/*
 * The owner dashboard at /app/owner. Nida's four numbers (always labelled as
 * illustrative), the visits that really happened in this demo, the offer
 * controls and the Pause switch.
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Eye, GearSix, Storefront } from "@phosphor-icons/react";
import { copy } from "@/demo/data";
import { isLive, mock, place, useMock } from "../../store";
import { OWNER_ID, blankDraft, categoryLabel, daysText } from "../../owner";
import { C, Guide, label, Photo, serif, splitCode, useNow } from "../../ui";
import { Blackouts, DaysPicker, KindToggle, OfferLine, PauseSwitch, UsesStepper } from "./controls";
import { QuickSetup } from "./QuickSetup";

/** Nida's sample month. Illustrative only: never shown as real results. */
const SAMPLE = [
  { value: "38", label: "tables from members" },
  { value: "27", label: "first-time visitors" },
  { value: "11", label: "came back a second time" },
  { value: "$0", label: "fees or commission", ok: true },
];

export const COSTS = "Free for founding partners for the first 12 months. No commission. No setup.";
export const NOTICE = "Leave any time with 30 days' notice.";

function ago(ms: number) {
  if (ms < 60_000) return "Just now";
  const m = Math.round(ms / 60_000);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h} hr ago`;
}

export function Dashboard() {
  const s = useMock();
  const now = useNow();
  const [setup, setSetup] = useState(false);
  const p = place(s, OWNER_ID);

  if (!p || !s.owner) {
    return (
      <div className="m-enter px-5 pb-32 pt-8">
        <Storefront size={40} aria-hidden="true" style={{ color: C.ice }} />
        <h1 className="mt-4 text-[34px] leading-[1.05]" style={serif}>Owner view</h1>
        <p className="mt-3 text-[16px]" style={{ color: C.soft }}>Set up a place first. It takes about a minute, and then this becomes its dashboard.</p>
        <Link href="/app/owner/setup" onClick={() => mock.setDraft(0, blankDraft())} className="m-press mt-6 flex h-14 w-full items-center justify-center rounded-[20px] text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
          Set up a place
        </Link>
      </div>
    );
  }

  const o = p.settings;
  const mine = s.redemptions.filter((r) => r.partnerId === OWNER_ID);
  const waiting = mine.filter((r) => isLive(r, now || r.issuedAt)).reverse();
  const visits = mine.filter((r) => r.status === "confirmed").sort((a, b) => (b.confirmedAt ?? 0) - (a.confirmedAt ?? 0));
  const fresh = visits[0] && now > 0 && now - (visits[0].confirmedAt ?? 0) < 60_000;

  const guide = waiting.length
    ? "A guest is waiting. Check the code, then tap Confirm."
    : fresh
      ? "There's the visit, at the top of Recent visits."
      : o.paused
        ? "Paused. Switch it back on to let members redeem."
        : visits.length
          ? "Try Pause, or change the offer below."
          : "Open the member view and tap Redeem. The visit lands here.";

  return (
    <div className="m-enter pb-32">
      <Guide>{guide}</Guide>
      <div className="relative h-[150px]">
        <Photo p={p} priority className="absolute inset-0 size-full" />
        <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(10,20,36,0.25), ${C.bg})` }} />
        <button type="button" onClick={() => setSetup(true)} aria-label="Set up for a restaurant" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur">
          <GearSix size={22} aria-hidden="true" />
        </button>
        <div className="absolute inset-x-5 bottom-2">
          <p className={label} style={{ color: C.ice }}>Owner dashboard</p>
          <h1 className="mt-1 break-words text-[32px] leading-none" style={serif}>{p.name}</h1>
        </div>
      </div>
      <p className="mt-2 px-5 text-[14px]" style={{ color: C.muted }}>{categoryLabel(s.owner.category)} · {p.neighbourhood} · {copy.place.founding}</p>

      <section className="mt-6 px-5" aria-labelledby="visits-h">
        <h2 id="visits-h" className="text-[24px] leading-tight" style={serif}>Recent visits</h2>
        {waiting.map((r) => (
          <div key={r.id} className="m-pop mt-3 rounded-[22px] border p-5" style={{ background: C.panel, borderColor: C.ice }}>
            <p className={label} style={{ color: C.ice }}>Waiting at the host stand</p>
            <p className="tabular mt-2 text-[40px] font-bold leading-none tracking-[0.06em]">{splitCode(r.code)}</p>
            <p className="mt-2 text-[14px]" style={{ color: C.soft }}>{copy.redeem.staffLine}</p>
            <button type="button" onClick={() => mock.confirm(r.id)} className="m-press mt-4 h-14 w-full rounded-[18px] text-[17px] font-bold" style={{ background: C.ok, color: C.iceInk }}>
              {copy.staff.confirm}
            </button>
          </div>
        ))}
        {visits.length === 0 && waiting.length === 0 ? (
          <div className="mt-3 rounded-[22px] border p-5" style={{ borderColor: C.line }}>
            <p className="text-[15px]" style={{ color: C.soft }}>No visits yet. When a member redeems, it shows up here straight away.</p>
            <Link href={`/app/place/${OWNER_ID}`} className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-bold" style={{ color: C.ice }}>
              Try it in the member view
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2" data-testid="visits">
            {visits.map((r, i) => {
              const when = ago(now ? now - (r.confirmedAt ?? r.issuedAt) : 0);
              const isNew = i === 0 && when === "Just now";
              return (
                <li key={r.id} className={`flex items-center gap-3 rounded-[18px] border px-4 py-3.5 ${isNew ? "m-pop" : ""}`} style={{ background: C.panel, borderColor: isNew ? C.ok : C.line }}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full" style={{ background: "rgba(124,226,164,0.16)", color: C.ok }}>
                    <Check size={20} weight="bold" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Member visit · {r.offer.replace(/\.$/, "")}</span>
                    <span className="block text-[13px]" style={{ color: C.muted }}>Code {splitCode(r.code)}</span>
                  </span>
                  <span className="shrink-0 text-[13px] font-bold" style={{ color: isNew ? C.ok : C.muted }} data-testid={i === 0 ? "latest-visit-time" : undefined}>{when}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8 px-5" aria-labelledby="sample-h">
        <h2 id="sample-h" className="text-[24px] leading-tight" style={serif}>How a month could look</h2>
        <p className={`${label} mt-1`} style={{ color: C.warn }}>Sample month · illustrative numbers</p>
        <dl className="mt-3 grid grid-cols-2 gap-2.5">
          {SAMPLE.map((st) => (
            <div key={st.label} className="flex flex-col-reverse rounded-[18px] border p-4" style={{ background: C.panel, borderColor: C.line }}>
              <dt className="mt-1.5 text-[13px]" style={{ color: C.soft }}>{st.label}</dt>
              <dd className="text-[34px] leading-none" style={{ ...serif, color: st.ok ? C.ok : C.text }}>{st.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[13px]" style={{ color: C.muted }}>Not real results. Your own numbers would show here.</p>
      </section>

      <section className="mt-8 px-5" aria-labelledby="control-h">
        <h2 id="control-h" className="text-[24px] leading-tight" style={serif}>You control the offer</h2>
        <p className="mt-1 text-[14px]" style={{ color: C.muted }}>Change anything here and the member view updates straight away.</p>
        <div className="mt-3 space-y-6 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }}>
          <PauseSwitch value={!!o.paused} onChange={(paused) => mock.updateOwnerOffer({ paused })} />
          <KindToggle value={o.kind} onChange={(kind) => mock.updateOwnerOffer({ kind })} />
          <OfferLine id="d-offer" value={o.offer} onChange={(offer) => mock.updateOwnerOffer({ offer })} />
          <DaysPicker strict value={o.days} onChange={(days) => mock.updateOwnerOffer({ days })} />
          <UsesStepper value={o.usesPerYear} onChange={(usesPerYear) => mock.updateOwnerOffer({ usesPerYear })} />
          <Blackouts value={o.blackoutDates} onChange={(blackoutDates) => mock.updateOwnerOffer({ blackoutDates })} />
        </div>
        <p className="mt-2 text-[13px]" style={{ color: C.muted }}>Members see: {o.offer} {daysText(o.days)}, {o.usesPerYear} {o.usesPerYear === 1 ? "use" : "uses"} a year.</p>
        <Link href={`/app/place/${OWNER_ID}`} className="m-press mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] border text-[16px] font-bold" style={{ borderColor: C.line }}>
          <Eye size={20} aria-hidden="true" />
          See what members see
        </Link>
      </section>

      <section className="mt-8 px-5" aria-labelledby="costs-h">
        <div className="rounded-[24px] p-5" style={{ background: "rgba(124,226,164,0.1)" }}>
          <h2 id="costs-h" className={label} style={{ color: C.ok }}>What it costs</h2>
          <p className="mt-2 text-[20px] leading-snug" style={serif}>{COSTS}</p>
          <p className="mt-2 text-[14px]" style={{ color: C.soft }}>{NOTICE}</p>
        </div>
        <Link href="/app/owner/next" className="m-press mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
          Next step
          <ArrowRight size={20} weight="bold" aria-hidden="true" />
        </Link>
      </section>

      {setup && <QuickSetup onClose={() => setSetup(false)} />}
    </div>
  );
}
