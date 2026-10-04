"use client";

/*
 * /partners-demo: the link Nida opens across the table. "Start demo" goes
 * straight to the member view of the place she set up; "Set up a place"
 * runs the onboarding with the owner.
 */
import Link from "next/link";
import { useState } from "react";
import { GearSix, Play, Storefront } from "@phosphor-icons/react";
import { mock, place, useMock } from "../../store";
import { OWNER_ID, blankDraft } from "../../owner";
import { C, Guide, label, serif, Wordmark } from "../../ui";
import { PlaceCard } from "../Explore";
import { NewMeeting } from "./NewMeeting";
import { QuickSetup } from "./QuickSetup";

export function Start() {
  const s = useMock();
  const [setup, setSetup] = useState(false);
  const p = place(s, OWNER_ID);

  return (
    <div className="m-enter pb-12">
      <Guide>{p ? "Tap Start demo and hand the phone over." : "Tap Set up a place to begin with the owner's own place."}</Guide>
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <Wordmark size={24} />
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ borderColor: "rgba(169,209,255,0.4)", color: C.ice }}>Preview · Mar 2027</span>
            <button type="button" onClick={() => setSetup(true)} aria-label="Set up for a restaurant" className="grid size-11 place-items-center rounded-full border" style={{ borderColor: C.line, color: C.soft }}>
              <GearSix size={22} aria-hidden="true" />
            </button>
          </div>
        </div>

        <h1 className="mt-8 text-[38px] leading-[1.02]" style={serif}>Two go out. One pays for mains.</h1>
        <p className="mt-3 text-[16px]" style={{ color: C.soft }}>See The 6 Pass as a member, then as the owner. On your own place, in about two minutes.</p>

        {p ? (
          <>
            <p className={`${label} mb-2 mt-7`} style={{ color: C.muted }}>Ready for this meeting</p>
            <PlaceCard p={p} block={null} href={null} />
            <Link href={`/app/place/${OWNER_ID}`} className="m-press mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-[22px] text-[18px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
              <Play size={22} weight="fill" aria-hidden="true" />
              Start demo
            </Link>
            <Link href="/app/owner/setup" onClick={() => mock.setDraft(0, blankDraft())} className="m-press mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] border text-[16px] font-bold" style={{ borderColor: C.line }}>
              <Storefront size={20} aria-hidden="true" />
              Set up a different place
            </Link>
            <div className="mt-8">
              <NewMeeting />
            </div>
          </>
        ) : (
          <>
            <Link href="/app/owner/setup" onClick={() => mock.setDraft(0, blankDraft())} className="m-press mt-8 flex h-16 w-full items-center justify-center gap-2 rounded-[22px] text-[18px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
              <Storefront size={22} weight="fill" aria-hidden="true" />
              Set up a place
            </Link>
            <Link href="/app" className="m-press mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] border text-[16px] font-bold" style={{ borderColor: C.line }}>
              <Play size={20} aria-hidden="true" />
              Start demo with example places
            </Link>
            <p className="mt-4 text-[14px]" style={{ color: C.muted }}>Before a meeting, tap the gear to fill in the place ahead of time.</p>
          </>
        )}

        <p className="mt-10 text-[13px]" style={{ color: C.muted }}>
          A demo. Everything stays on this phone. No account, no sign-up, no internet needed after the first visit.
        </p>
      </div>
      {setup && <QuickSetup onClose={() => setSetup(false)} />}
    </div>
  );
}
