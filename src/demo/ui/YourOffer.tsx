"use client";

import Link from "next/link";
import { useState } from "react";
import { actions, getPlace, useDemo } from "../store";
import { formatDate } from "../time";
import { useToday } from "../useNow";
import { DAY_NAMES, DAY_SHORT, describeDays } from "@/components/DayStrip";
import { PassCard } from "@/components/PassCard";
import { StaffPlacePicker } from "./StaffPlacePicker";

const MIN_DAYS = 3;
const MAX_USES = 12;
// Ontario doesn't allow two-for-one on alcohol, so offers never mention it.
const ALCOHOL = /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?|alcohol)\b/i;

export function YourOffer() {
  const s = useDemo();
  const today = useToday().weekday;
  const p = getPlace(s, s.staffSlug);
  const [note, setNote] = useState<string | null>(null);
  const [blackout, setBlackout] = useState("");
  if (!p) return null;
  const o = p.offer;
  const update = (patch: Parameters<typeof actions.updateOffer>[1]) => actions.updateOffer(p.slug, patch);

  function toggleDay(i: number) {
    const next = o.days.map((v, j) => (j === i ? !v : v));
    if (next.filter(Boolean).length < MIN_DAYS) {
      setNote(`Offers run at least ${MIN_DAYS} days a week.`);
      return;
    }
    setNote(null);
    update({ days: next });
  }

  function setText(field: "title" | "details", value: string) {
    if (ALCOHOL.test(value)) {
      setNote("Offers can't include alcohol. Food, services and non-alcoholic drinks only.");
      return;
    }
    setNote(null);
    update({ [field]: value });
  }

  const input = "mt-1.5 block w-full rounded-xl border-[1.5px] border-ink/25 bg-white px-4 py-3 text-[16px]";

  return (
    <div>
      <StaffPlacePicker />
      <h1 className="mt-6 font-serif text-[30px] leading-tight">Your offer</h1>
      <p className="text-muted">Change anything. Members see it straight away.</p>

      <div className="mt-5 flex justify-center">
        <PassCard
          tilt={false}
          today={today >= 0 ? today : undefined}
          caption="Live preview of your offer."
          data={{
            neighbourhood: p.neighbourhood,
            badge: p.founding ? "Founding Partner" : undefined,
            name: p.name,
            kind: o.paused ? "Paused" : p.category,
            offer: o.title || "Your offer",
            days: o.days,
            uses: `${o.usesPerYear} ${o.usesPerYear === 1 ? "use" : "uses"} a year`,
            art: p.art,
          }}
        />
      </div>
      <p className="mt-3 text-center">
        <Link href={`/demo/place/${p.slug}`} className="text-sm font-semibold underline underline-offset-4">
          See it as a member
        </Link>
      </p>

      <div role="status" aria-live="polite">
        {note && <p className="mt-4 rounded-xl bg-peach-soft px-4 py-3 text-sm font-medium">{note}</p>}
      </div>

      <form className="mt-5 grid gap-6" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="text-sm font-semibold">Type of offer</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["two_for_one", "Two for one"],
                ["upgrade", "Free upgrade or add-on"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className={`cursor-pointer rounded-xl border-[1.5px] px-3 py-3 text-sm font-semibold has-[:focus-visible]:outline-2 ${o.kind === k ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"}`}>
                <input type="radio" name="kind" value={k} checked={o.kind === k} onChange={() => update({ kind: k })} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="title" className="text-sm font-semibold">What members get</label>
          <input id="title" value={o.title} maxLength={60} onChange={(e) => setText("title", e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="details" className="text-sm font-semibold">The details</label>
          <textarea id="details" rows={2} value={o.details} maxLength={160} onChange={(e) => setText("details", e.target.value)} className={input} />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold">Days it runs</legend>
          <p className="text-sm text-muted">At least {MIN_DAYS} a week. Now: {describeDays(o.days)}.</p>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {DAY_SHORT.map((d, i) => (
              <button
                key={d}
                type="button"
                aria-pressed={o.days[i]}
                aria-label={DAY_NAMES[i]}
                onClick={() => toggleDay(i)}
                className={`rounded-xl py-3 text-xs font-semibold ${o.days[i] ? "bg-ink text-white" : "bg-mist text-muted"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <p id="uses-label" className="text-sm font-semibold">Uses per member, per year</p>
          <div className="mt-2 flex items-center gap-3" role="group" aria-labelledby="uses-label">
            <button type="button" aria-label="Fewer" disabled={o.usesPerYear <= 1} onClick={() => update({ usesPerYear: o.usesPerYear - 1 })} className="grid size-12 place-items-center rounded-xl bg-mist text-2xl disabled:opacity-40">
              −
            </button>
            <output aria-live="polite" className="w-12 text-center font-serif text-4xl">{o.usesPerYear}</output>
            <button type="button" aria-label="More" disabled={o.usesPerYear >= MAX_USES} onClick={() => update({ usesPerYear: o.usesPerYear + 1 })} className="grid size-12 place-items-center rounded-xl bg-mist text-2xl disabled:opacity-40">
              +
            </button>
            <p className="text-sm text-muted">The default is 2. Up to {MAX_USES}.</p>
          </div>
        </div>

        <div>
          <label htmlFor="blackout" className="text-sm font-semibold">Blackout dates</label>
          <p className="text-sm text-muted">Busy nights, holidays, private events.</p>
          <div className="mt-1.5 flex gap-2">
            <input id="blackout" type="date" value={blackout} onChange={(e) => setBlackout(e.target.value)} className={`${input} mt-0`} />
            <button
              type="button"
              disabled={!blackout}
              onClick={() => {
                if (!o.blackoutDates.includes(blackout)) update({ blackoutDates: [...o.blackoutDates, blackout].sort() });
                setBlackout("");
              }}
              className="shrink-0 rounded-xl bg-ink px-5 font-semibold text-white disabled:opacity-40"
            >
              Add
            </button>
          </div>
          {o.blackoutDates.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {o.blackoutDates.map((dt) => (
                <li key={dt}>
                  <button type="button" onClick={() => update({ blackoutDates: o.blackoutDates.filter((x) => x !== dt) })} className="rounded-full bg-mist px-3 py-1.5 text-sm font-semibold">
                    {formatDate(dt)} <span aria-hidden="true">×</span>
                    <span className="sr-only">, remove</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 rounded-2xl bg-mist p-4">
          <div>
            <p id="pause-label" className="font-semibold">Pause the offer</p>
            <p className="text-sm text-muted">Need a break? Members get 7 days&apos; notice.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={o.paused}
            aria-labelledby="pause-label"
            onClick={() => update({ paused: !o.paused })}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${o.paused ? "bg-ink" : "bg-ink/25"}`}
          >
            <span className={`absolute top-1 size-6 rounded-full bg-white transition-all ${o.paused ? "left-7" : "left-1"}`} />
          </button>
        </div>
      </form>
    </div>
  );
}
