"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { mock } from "../../store";
import { C } from "../../ui";

/** Wipes the place, visits and history for the next restaurant. Two taps, so it can't happen by accident. */
export function NewMeeting({ to = "/partners-demo" }: { to?: string }) {
  const router = useRouter();
  const [sure, setSure] = useState(false);
  if (!sure) {
    return (
      <button type="button" onClick={() => setSure(true)} className="m-press flex h-14 w-full items-center justify-center gap-2 rounded-[20px] border text-[16px] font-bold" style={{ borderColor: C.line }}>
        <ArrowCounterClockwise size={20} aria-hidden="true" />
        New meeting
      </button>
    );
  }
  return (
    <div className="rounded-[22px] border p-4" style={{ borderColor: C.warn }} role="alertdialog" aria-labelledby="nm-h" aria-describedby="nm-p">
      <p id="nm-h" className="text-[17px] font-bold">Start a new meeting?</p>
      <p id="nm-p" className="mt-1 text-[14px]" style={{ color: C.soft }}>This clears the place, its photo and every visit on this phone.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setSure(false)} className="h-12 rounded-[16px] border font-bold" style={{ borderColor: C.line }} autoFocus>
          Keep it
        </button>
        <button
          type="button"
          onClick={() => {
            mock.reset();
            setSure(false);
            router.push(to);
          }}
          className="h-12 rounded-[16px] font-bold"
          style={{ background: C.warn, color: C.iceInk }}
        >
          Yes, clear it
        </button>
      </div>
    </div>
  );
}
