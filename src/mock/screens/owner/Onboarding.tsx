"use client";

/*
 * Owner onboarding at /app/owner/setup. One question per screen, Back and a
 * progress line. Every tap is saved, so a refresh lands on the same step.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { mock, useMock, type Place } from "../../store";
import { OFFER_START, OWNER_CATEGORIES, OWNER_HOODS, OWNER_ID, blankDraft, categoryLabel, daysText, detailFor, type OwnerDraft } from "../../owner";
import { IBack, ICheck } from "../../icons";
import { Guide, NavBar, useEscape } from "../../ui";
import { PlaceCard } from "../Explore";
import { Blackouts, Choices, ColourPicker, DaysPicker, KindToggle, OfferLine, PhotoPicker, TextField, UsesStepper } from "./controls";

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
      <div className="a-fade flex min-h-full flex-col" style={{ paddingTop: "var(--top)", paddingBottom: "calc(var(--bottom) + 24px)" }}>
        <div className="m flex flex-1 flex-col items-center justify-center py-10 text-center">
          <span className="a-pop grid size-[84px] place-items-center rounded-full text-white" style={{ background: "var(--ok)" }}>
            <ICheck size={40} strokeWidth={2.4} />
          </span>
          <p className="eyebrow accent mt-7">Founding Partner</p>
          <h1 className="t-title mt-2 max-w-[18ch] text-[28px] leading-[1.15]">You&apos;re set up as a Founding Partner (demo).</h1>
          <p className="t-sub mt-3 max-w-[32ch] text-[17px] leading-[1.4]">
            {d.name.trim()} is now first in the member app, with {d.offer.trim().replace(/\.$/, "").toLowerCase()} on {daysText(d.days)}.
          </p>
          <Guide className="mt-5 text-left">Tap See what members see, then try a redeem.</Guide>
        </div>
        <div className="m space-y-2.5">
          <Link href={`/app/place/${OWNER_ID}`} onClick={() => mock.clearDraft()} className="btn press">
            See what members see
          </Link>
          <Link href="/app/owner" onClick={() => mock.clearDraft()} className="btn secondary press">
            See your dashboard
          </Link>
        </div>
      </div>
    );
  }

  const preview = draftAsPlace(d);

  return (
    <>
      <div className="a-push pb-36">
        <NavBar
          left={
            <button type="button" onClick={back} className="navtext -ml-1">
              <IBack size={22} />
              Back
            </button>
          }
          title={
            <span className="t-foot font-semibold" data-testid="step">
              Step {step + 1} of {STEPS.length}
            </span>
          }
        />
        <div className="mx-5 h-[3px] overflow-hidden rounded-full" style={{ background: "var(--fill)" }} role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
          <span className="block h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--text)" }} />
        </div>
        <header className="m pt-5">
          <h1 className="t-large">{STEPS[step].title}</h1>
          <Guide className="mt-2">{STEPS[step].guide}</Guide>
        </header>

        <div className="m space-y-6 pt-6">
          {step === 0 && (
            <>
              <TextField id="o-name" label="Name of your place" value={d.name} onChange={(name) => set({ name })} onEnter={next} />
              <Choices
                legend="What kind of place"
                value={d.category}
                options={OWNER_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
                onChange={(category) => {
                  const start = OFFER_START[category];
                  set(isSuggested(d.offer) ? { category, kind: start.kind, offer: start[start.kind].offer } : { category });
                }}
              />
              <Choices legend="Neighbourhood" value={d.neighbourhood} options={OWNER_HOODS.map((h) => ({ id: h, label: h }))} onChange={(neighbourhood) => set({ neighbourhood })} />
            </>
          )}

          {step === 1 && (
            <>
              <KindToggle value={d.kind} onChange={(kind) => set(isSuggested(d.offer) ? { kind, offer: OFFER_START[d.category][kind].offer } : { kind })} />
              <OfferLine id="o-offer" value={d.offer} onChange={(offer) => set({ offer })} />
              <p className="t-foot px-4">Suggested for a {categoryLabel(d.category).toLowerCase()}. Write it the way you would say it at the table.</p>
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
                <p className="group-label">Preview</p>
                <PlaceCard p={preview} block={null} href={null} />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <PlaceCard p={preview} block={null} href={null} />
              <section aria-label="Your offer">
                <p className="group-label">Your offer</p>
                <div className="group">
                  <div className="px-4 pb-1 pt-3.5">
                    <p className="eyebrow accent">{d.kind === "two_for_one" ? "Two for one" : "Free upgrade"}</p>
                    <p className="mt-1 text-[20px] font-semibold leading-tight tracking-[-0.02em]">{d.offer}</p>
                  </div>
                  <dl>
                    {[
                      ["When", daysText(d.days)],
                      ["Uses per member", `${d.usesPerYear} a year`],
                      ["Blackout dates", d.blackoutDates.length ? `${d.blackoutDates.length} set` : "None"],
                      ["Where", "In person only"],
                      ["Applies to", "Food and non-alcoholic"],
                    ].map(([k, v]) => (
                      <div key={k} className="row">
                        <dt>{k}</dt>
                        <dd className="v">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="group-foot">Founding Partner badge included. You can change any of this later from your dashboard.</p>
              </section>
            </>
          )}
        </div>
      </div>

      <div className="bottom-bar blur-bar">
        {!valid && why && (
          <p className="t-foot mb-2 text-center font-semibold" style={{ color: "var(--warn)" }} role="status">
            {why}
          </p>
        )}
        <button type="button" onClick={next} disabled={!valid} className="btn press">
          {step === DONE - 1 ? "Looks right" : "Next"}
        </button>
      </div>
    </>
  );
}
