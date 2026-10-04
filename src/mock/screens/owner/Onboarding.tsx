"use client";

/*
 * Owner onboarding at /app/owner/setup. One question per screen, Back and a
 * progress line. Every tap is saved, so a refresh lands on the same step.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { CaretLeft, Check, Eye, SquaresFour } from "@phosphor-icons/react";
import { copy } from "@/demo/data";
import { mock, useMock, type Place } from "../../store";
import { OFFER_START, OWNER_CATEGORIES, OWNER_HOODS, OWNER_ID, blankDraft, categoryLabel, daysText, detailFor, type OwnerDraft } from "../../owner";
import { C, Guide, label, serif, useEscape } from "../../ui";
import { PlaceCard } from "../Explore";
import { Blackouts, Choices, ColourPicker, DaysPicker, KindToggle, OfferLine, PhotoPicker, UsesStepper, fieldCls, fieldStyle } from "./controls";

const STEPS = [
  { title: "Your place", guide: "Type the name of your place, then pick the rest." },
  { title: "Your offer", guide: "Pick the offer. You can change the words." },
  { title: "Your days", guide: "Tap the days it runs. Leave out your busy nights." },
  { title: "Your limits", guide: "Set how often each member can use it." },
  { title: "Your look", guide: "Add a photo, or just pick a colour." },
  { title: "Check it", guide: "This is exactly what members will see." },
] as const;
const DONE = STEPS.length;

/** The draft dressed up as a place, so the review uses the real member card. */
export function draftAsPlace(d: OwnerDraft): Place {
  const cat = OWNER_CATEGORIES.find((c) => c.id === d.category) ?? OWNER_CATEGORIES[0];
  const settings = { kind: d.kind, offer: d.offer, detail: detailFor(d.category, d.kind, d.offer), saving: 0, days: d.days, usesPerYear: d.usesPerYear, blackoutDates: d.blackoutDates };
  return {
    id: OWNER_ID,
    name: d.name.trim() || "Your place",
    category: cat.appCategory,
    kind: cat.label,
    neighbourhood: d.neighbourhood,
    blurb: "",
    offer: d.offer,
    detail: settings.detail,
    days: d.days,
    usesPerYear: d.usesPerYear,
    saving: 0,
    founding: true,
    image: "",
    settings,
    photo: d.photo,
    colour: d.colour,
    isOwner: true,
  };
}

/** True while the offer is still one of the suggested lines, so switching category can swap it. */
const isSuggested = (offer: string) => Object.values(OFFER_START).some((c) => c.two_for_one.offer === offer || c.upgrade.offer === offer);

export function Onboarding() {
  const s = useMock();
  const router = useRouter();
  const step = s.draft?.step ?? 0;
  const d = s.draft?.data ?? blankDraft();
  const set = (patch: Partial<OwnerDraft>, nextStep = step) => mock.setDraft(nextStep, { ...d, ...patch });

  const back = useCallback(() => {
    if (step === 0 || step === DONE) router.push(s.owner ? "/app/owner" : "/partners-demo");
    else mock.setDraft(step - 1, d);
  }, [step, d, router, s.owner]);
  useEscape(back);

  const valid = [d.name.trim().length > 0, d.offer.trim().length > 0, d.days.filter(Boolean).length >= 3, true, true, true][step] ?? true;
  const why = ["Type the name of your place to go on.", "Write what members get to go on.", "Pick at least 3 days to go on.", "", "", ""][step] ?? "";

  function next() {
    if (!valid) return;
    if (step === DONE - 1) {
      mock.saveOwner(d);
      mock.setDraft(DONE, d);
    } else set({}, step + 1);
    document.getElementById("app-scroll")?.scrollTo(0, 0);
  }

  if (step === DONE) {
    return (
      <div className="m-enter flex min-h-full flex-col">
        <Guide>Tap See what members see, then try a redeem.</Guide>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <span className="m-pop grid size-24 place-items-center rounded-full" style={{ background: "rgba(124,226,164,0.16)", color: C.ok }}>
            <Check size={46} weight="bold" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-[34px] leading-[1.05]" style={serif}>You&apos;re set up as a Founding Partner (demo).</h1>
          <p className="mt-3 max-w-[30ch] text-[16px]" style={{ color: C.soft }}>
            {d.name.trim()} is now first in the member app, with {d.offer.trim().replace(/\.$/, "").toLowerCase()} on {daysText(d.days)}.
          </p>
          <div className="mt-8 w-full space-y-3">
            <Link
              href={`/app/place/${OWNER_ID}`}
              onClick={() => mock.clearDraft()}
              className="m-press flex h-14 w-full items-center justify-center gap-2 rounded-[20px] text-[17px] font-bold"
              style={{ background: C.ice, color: C.iceInk }}
            >
              <Eye size={20} weight="bold" aria-hidden="true" />
              See what members see
            </Link>
            <Link href="/app/owner" onClick={() => mock.clearDraft()} className="m-press flex h-14 w-full items-center justify-center gap-2 rounded-[20px] border text-[16px] font-bold" style={{ borderColor: C.line }}>
              <SquaresFour size={20} aria-hidden="true" />
              See your dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const preview = draftAsPlace(d);

  return (
    <div className="m-enter flex min-h-full flex-col">
      <Guide>{STEPS[step].guide}</Guide>
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between">
          <button type="button" onClick={back} className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-full px-2 text-[15px] font-semibold" style={{ color: C.soft }}>
            <CaretLeft size={18} weight="bold" aria-hidden="true" />
            Back
          </button>
          <p className="text-[13px] font-semibold" style={{ color: C.muted }} data-testid="step">Step {step + 1} of {STEPS.length}</p>
        </div>
        <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }} role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
          {STEPS.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full" style={{ background: i <= step ? C.ice : "rgba(255,255,255,0.14)" }} />
          ))}
        </div>
        <h1 className="mt-5 text-[34px] leading-[1.05]" style={serif}>{STEPS[step].title}</h1>
      </div>

      <div className="flex-1 space-y-6 px-5 pb-6 pt-5">
        {step === 0 && (
          <>
            <div>
              <label htmlFor="o-name" className={label} style={{ color: C.muted }}>Name of your place</label>
              <input
                id="o-name"
                value={d.name}
                maxLength={40}
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="next"
                onChange={(e) => set({ name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && next()}
                className={`${fieldCls} mt-2 text-[18px]`}
                style={fieldStyle}
              />
            </div>
            <Choices
              legend="What kind of place"
              cols={2}
              value={d.category}
              options={OWNER_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
              onChange={(category) => {
                const start = OFFER_START[category];
                set(isSuggested(d.offer) ? { category, kind: start.kind, offer: start[start.kind].offer } : { category });
              }}
            />
            <Choices legend="Neighbourhood" cols={2} value={d.neighbourhood} options={OWNER_HOODS.map((h) => ({ id: h, label: h }))} onChange={(neighbourhood) => set({ neighbourhood })} />
          </>
        )}

        {step === 1 && (
          <>
            <KindToggle
              value={d.kind}
              onChange={(kind) => set(isSuggested(d.offer) ? { kind, offer: OFFER_START[d.category][kind].offer } : { kind })}
            />
            <OfferLine id="o-offer" value={d.offer} onChange={(offer) => set({ offer })} />
            <p className="text-[14px]" style={{ color: C.muted }}>
              Suggested for a {categoryLabel(d.category).toLowerCase()}. Write it the way you would say it at the table.
            </p>
          </>
        )}

        {step === 2 && <DaysPicker value={d.days} onChange={(days) => set({ days })} />}

        {step === 3 && (
          <>
            <UsesStepper value={d.usesPerYear} onChange={(usesPerYear) => set({ usesPerYear })} />
            <Blackouts value={d.blackoutDates} onChange={(blackoutDates) => set({ blackoutDates })} />
          </>
        )}

        {step === 4 && (
          <>
            <PhotoPicker value={d.photo} onChange={(photo) => set({ photo })} />
            <ColourPicker value={d.colour} onChange={(colour) => set({ colour })} />
            <div>
              <p className={`${label} mb-2`} style={{ color: C.muted }}>Preview</p>
              <PlaceCard p={preview} block={null} href={null} />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <PlaceCard p={preview} block={null} href={null} />
            <section className="rounded-[22px] border p-5" style={{ background: C.panel, borderColor: C.line }} aria-label="Your offer">
              <p className={label} style={{ color: C.ice }}>Your offer</p>
              <p className="mt-2 text-[22px] leading-tight" style={serif}>{d.offer}</p>
              <dl className="mt-4 space-y-2.5 text-[15px]">
                {[
                  ["When", daysText(d.days)],
                  ["Uses per member", `${d.usesPerYear} a year`],
                  ["Blackout dates", d.blackoutDates.length ? `${d.blackoutDates.length} set` : "None"],
                  ["Where", "In person only"],
                  ["Applies to", "Food and non-alcoholic"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt style={{ color: C.muted }}>{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <p className="text-[14px]" style={{ color: C.muted }}>{copy.place.founding} badge included. You can change any of this later from your dashboard.</p>
          </>
        )}
      </div>

      <div className="sticky bottom-0 px-5 pb-6 pt-4" style={{ background: `linear-gradient(to top, ${C.bg} 75%, transparent)` }}>
        {!valid && why && <p className="mb-2 text-center text-[14px] font-semibold" style={{ color: C.warn }} role="status">{why}</p>}
        <button type="button" onClick={next} disabled={!valid} className="m-press h-14 w-full rounded-[20px] text-[17px] font-bold disabled:opacity-45" style={{ background: C.ice, color: C.iceInk }}>
          {step === DONE - 1 ? "Looks right" : "Next"}
        </button>
      </div>
    </div>
  );
}
