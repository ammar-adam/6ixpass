"use client";

/*
 * /partners-demo: Nida's screen before she hands the phone over. "Start demo"
 * opens the member app with the owner's place first; "Set up a place" runs the
 * onboarding with the owner. Nothing here is shown to the owner.
 */
import Link from "next/link";
import { useState } from "react";
import { mock, place, useMock } from "../../store";
import { OWNER_ID, blankDraft } from "../../owner";
import { IChev, IGear, IPlay } from "../../icons";
import { Guide, NavBar, Wordmark } from "../../ui";
import { PlaceCard } from "../Explore";
import { NewMeeting } from "./NewMeeting";
import { QuickSetup } from "./QuickSetup";

export function Start() {
  const s = useMock();
  const [setup, setSetup] = useState(false);
  const p = place(s, OWNER_ID);

  return (
    <>
      <div className="a-fade pb-10">
        <NavBar
          left={
            <span className="pl-3">
              <Wordmark size={21} />
            </span>
          }
          right={
            <button type="button" onClick={() => setSetup(true)} aria-label="Set up for a restaurant" className="iconbtn">
              <IGear />
            </button>
          }
        />

        <header className="m pt-2">
          <p className="eyebrow">Partner demo · March 2027</p>
          <h1 className="t-large mt-1">{p ? "Ready" : "Partner demo"}</h1>
          <p className="t-sub mt-1.5 text-[17px] leading-[1.4]">
            {p ? `${p.name} is set up as a Founding Partner.` : "The member app and the owner view, on their own place, in about two minutes."}
          </p>
        </header>

        {p ? (
          <>
            <div className="m mt-5">
              <PlaceCard p={p} block={null} href={null} />
            </div>
            <div className="m mt-5">
              <Guide>Tap Start demo and hand the phone over.</Guide>
              <Link href="/app" className="btn press mt-3">
                <IPlay />
                Start demo
              </Link>
            </div>
            <div className="m mt-6">
              <div className="group">
                <button type="button" onClick={() => setSetup(true)} className="row press">
                  <span>Edit details</span>
                  <IChev className="chev" />
                </button>
                <Link href="/app/owner/setup" onClick={() => mock.setDraft(0, blankDraft())} className="row press">
                  <span>Set up a different place</span>
                  <IChev className="chev" />
                </Link>
              </div>
            </div>
            <div className="m mt-6">
              <NewMeeting />
            </div>
          </>
        ) : (
          <div className="m mt-6">
            <Guide>Tap Set up a place to begin with the owner&apos;s own place.</Guide>
            <Link href="/app/owner/setup" onClick={() => mock.setDraft(0, blankDraft())} className="btn press mt-3">
              Set up a place
            </Link>
            <Link href="/app" className="btn secondary press mt-2.5">
              Start demo with example places
            </Link>
            <p className="t-foot mt-4">Before a meeting, tap the gear to fill in the place ahead of time.</p>
          </div>
        )}

        <p className="m t-foot mt-10 text-center">A demo. Everything stays on this device. No account, no sign-up, no internet needed after the first visit.</p>
      </div>
      {setup && <QuickSetup onClose={() => setSetup(false)} />}
    </>
  );
}
