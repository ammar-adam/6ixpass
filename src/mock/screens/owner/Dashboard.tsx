"use client";

/*
 * The owner dashboard at /app/owner. A summary card (like a hotel stay card),
 * the visits that really happened in this demo, Nida's sample month (always
 * labelled as illustrative), the offer controls and the Pause switch.
 */
import Link from "next/link";
import { useState } from "react";
import { copy } from "@/demo/data";
import { isLive, mock, place, useMock } from "../../store";
import { OWNER_ID, blankDraft, categoryLabel, daysText } from "../../owner";
import { ICheck, IChev, IStore } from "../../icons";
import { Guide, haptic, NavBar, Photo, Sheet, splitCode, useNow } from "../../ui";
import { Blackouts, DaysPicker, KindToggle, OfferLine, PauseSwitch, UsesStepper } from "./controls";
import { QuickSetup } from "./QuickSetup";

/** Nida's sample month. Illustrative only: never shown as real results. */
const SAMPLE = [
  { value: "38", label: "tables from members" },
  { value: "27", label: "first-time visitors" },
  { value: "11", label: "came back again" },
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

type Edit = "offer" | "days" | "uses" | "blackouts" | null;

export function Dashboard() {
  const s = useMock();
  const now = useNow();
  const [setup, setSetup] = useState(false);
  const [edit, setEdit] = useState<Edit>(null);
  const p = place(s, OWNER_ID);

  if (!p || !s.owner) {
    return (
      <div className="a-fade pb-28">
        <NavBar />
        <div className="m pt-10 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full" style={{ background: "var(--fill)" }}>
            <IStore size={30} />
          </span>
          <h1 className="t-large mt-5">Owner view</h1>
          <p className="t-sub mx-auto mt-2 max-w-[30ch] text-[17px]">Set up a place first. It takes about a minute, and then this becomes its dashboard.</p>
          <Link href="/app/owner/setup" onClick={() => mock.setDraft(0, blankDraft())} className="btn press mt-7">
            Set up a place
          </Link>
        </div>
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

  const rows: { id: Exclude<Edit, null>; label: string; value: string }[] = [
    { id: "offer", label: "Offer", value: o.offer.replace(/\.$/, "") },
    { id: "days", label: "Days", value: daysText(o.days) },
    { id: "uses", label: "Uses per member", value: `${o.usesPerYear} a year` },
    { id: "blackouts", label: "Blackout dates", value: o.blackoutDates.length ? `${o.blackoutDates.length} set` : "None" },
  ];

  return (
    <>
      <div className="a-fade pb-28">
        <NavBar
          right={
            <button type="button" onClick={() => setSetup(true)} className="navtext">
              Edit
            </button>
          }
        />
        <header className="m pt-1">
          <p className="eyebrow">Owner view</p>
          <h1 className="display mt-1.5 break-words text-[40px]">{p.name}</h1>
          <p className="t-sub mt-1.5">
            {categoryLabel(s.owner.category)} · {p.neighbourhood}
          </p>
          <Guide className="mt-3">{guide}</Guide>
        </header>

        {/* The summary card. */}
        <div className="m mt-5">
          <div className="card">
            <div className="relative h-[110px]">
              <Photo p={p} priority className="absolute inset-0 size-full" />
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.45))" }} />
              <span className="seal light absolute bottom-3 left-3.5">{copy.place.founding}</span>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-5 py-4">
                <p className="eyebrow">Tonight</p>
                <p className="tnum mt-1 text-[34px] font-bold leading-none tracking-[-0.03em]">{visits.length}</p>
                <p className="t-foot mt-1">{visits.length === 1 ? "member visit" : "member visits"}</p>
              </div>
              <div className="px-5 py-4" style={{ borderLeft: "0.5px solid var(--line)" }}>
                <p className="eyebrow">You pay</p>
                <p className="tnum mt-1 text-[34px] font-bold leading-none tracking-[-0.03em]" style={{ color: "var(--ok)" }}>
                  $0
                </p>
                <p className="t-foot mt-1">no fees, no commission</p>
              </div>
            </div>
          </div>
        </div>

        {waiting.map((r) => (
          <div key={r.id} className="m mt-4">
            <div className="group a-pop p-4" style={{ boxShadow: "inset 0 0 0 1.5px var(--text)" }}>
              <p className="eyebrow accent">Waiting at the host stand</p>
              <p className="tnum mt-1 text-[40px] font-semibold leading-tight tracking-[0.06em]">{splitCode(r.code)}</p>
              <p className="mt-1 text-[15px] leading-[1.4]">{copy.redeem.staffLine}</p>
              <button type="button" onClick={() => {
                  haptic("success");
                  mock.confirm(r.id);
                }} className="btn press mt-3.5">
                {copy.staff.confirm}
              </button>
            </div>
          </div>
        ))}

        <section aria-labelledby="visits-h">
          <div className="section-h">
            <h2 id="visits-h" className="t-title">Recent visits</h2>
          </div>
          <div className="m mt-3">
            {visits.length === 0 ? (
              <div className="group">
                <p className="t-sub px-4 pt-3.5">No visits yet. When a member redeems, it shows up here straight away.</p>
                <Link href={`/app/place/${OWNER_ID}`} className="row press">
                  <span className="link">Try it in the member view</span>
                  <IChev className="chev" />
                </Link>
              </div>
            ) : (
              <ul className="group" data-testid="visits">
                {visits.map((r, i) => {
                  const when = ago(now ? now - (r.confirmedAt ?? r.issuedAt) : 0);
                  const isNew = i === 0 && when === "Just now";
                  return (
                    <li key={r.id} className={`row inset ${isNew ? "a-fade" : ""}`}>
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full" style={isNew ? { background: "var(--ok)", color: "#fff" } : { background: "var(--fill)", color: "var(--sec)" }}>
                          <ICheck size={15} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[16px] font-semibold">{r.offer.replace(/\.$/, "")}</span>
                          <span className="t-foot block">Member · code {splitCode(r.code)}</span>
                        </span>
                      </span>
                      <span className="shrink-0 text-[15px] font-semibold" style={{ color: isNew ? "var(--ok)" : "var(--sec)" }} data-testid={i === 0 ? "latest-visit-time" : undefined}>
                        {when}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="sample-h">
          <div className="m mt-8">
            <h2 id="sample-h" className="t-title">How a month could look</h2>
            <p className="t-foot mt-0.5">Sample month · illustrative numbers</p>
          </div>
          <div className="m mt-3">
            <dl className="group grid grid-cols-3">
              {SAMPLE.map((st, i) => (
                <div key={st.label} className="flex flex-col-reverse px-3.5 py-4" style={i ? { borderLeft: "0.5px solid var(--line)" } : undefined}>
                  <dt className="t-foot mt-0.5 leading-tight">{st.label}</dt>
                  <dd className="tnum text-[26px] font-bold tracking-[-0.02em]">{st.value}</dd>
                </div>
              ))}
            </dl>
            <p className="group-foot">Not real results. Your own numbers would show here.</p>
          </div>
        </section>

        <section aria-labelledby="control-h">
          <div className="section-h">
            <h2 id="control-h" className="t-title">You control the offer</h2>
          </div>
          <div className="m mt-3">
            <div className="group">
              {rows.map((r) => (
                <button key={r.id} type="button" onClick={() => setEdit(r.id)} className="row">
                  <span className="shrink-0">{r.label}</span>
                  <span className="v">
                    <span>{r.value}</span>
                    <IChev className="chev" />
                  </span>
                </button>
              ))}
              <PauseSwitch value={!!o.paused} onChange={(paused) => {
                  haptic("light");
                  mock.updateOwnerOffer({ paused });
                }} />
            </div>
            <p className="group-foot">{o.paused ? "Paused. Members see “Paused by the venue” and can’t redeem." : "Changes show in the member view straight away."}</p>
          </div>
          <div className="m mt-4">
            <Link href={`/app/place/${OWNER_ID}`} className="btn secondary press">
              See what members see
            </Link>
          </div>
        </section>

        <section className="m mt-8" aria-labelledby="costs-h">
          <div className="group p-4">
            <h2 id="costs-h" className="eyebrow accent">What it costs</h2>
            <p className="mt-1.5 text-[16px] leading-[1.4]">{COSTS}</p>
            <p className="t-foot mt-1.5">{NOTICE}</p>
          </div>
          <Link href="/app/owner/next" className="btn press mt-4">
            Next step
          </Link>
        </section>
      </div>

      {edit && (
        <Sheet title={rows.find((r) => r.id === edit)?.label} onClose={() => setEdit(null)} focusFirst={edit === "offer" ? "#d-offer" : undefined} id="edit">
          <div className="m space-y-6 pt-2">
            {edit === "offer" && (
              <>
                <KindToggle value={o.kind} onChange={(kind) => mock.updateOwnerOffer({ kind })} />
                <OfferLine id="d-offer" value={o.offer} onChange={(offer) => mock.updateOwnerOffer({ offer })} />
              </>
            )}
            {edit === "days" && <DaysPicker strict value={o.days} onChange={(days) => mock.updateOwnerOffer({ days })} />}
            {edit === "uses" && <UsesStepper value={o.usesPerYear} onChange={(usesPerYear) => mock.updateOwnerOffer({ usesPerYear })} />}
            {edit === "blackouts" && <Blackouts value={o.blackoutDates} onChange={(blackoutDates) => mock.updateOwnerOffer({ blackoutDates })} />}
            <p className="t-foot px-4">Members see: {o.offer} {daysText(o.days)}, {o.usesPerYear} {o.usesPerYear === 1 ? "use" : "uses"} a year.</p>
          </div>
        </Sheet>
      )}
      {setup && <QuickSetup onClose={() => setSetup(false)} />}
    </>
  );
}
