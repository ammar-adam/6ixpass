"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { mock } from "../../store";
import { IReset } from "../../icons";

/** Wipes the place, visits and history for the next restaurant. Two taps, so it can't happen by accident. */
export function NewMeeting({ to = "/partners-demo" }: { to?: string }) {
  const router = useRouter();
  const [sure, setSure] = useState(false);
  if (!sure) {
    return (
      <div className="group">
        <button type="button" onClick={() => setSure(true)} className="row press" style={{ color: "var(--warn)" }}>
          <span className="flex items-center gap-2">
            <IReset size={18} />
            New meeting
          </span>
        </button>
      </div>
    );
  }
  return (
    <div className="group a-fade p-4" role="alertdialog" aria-labelledby="nm-h" aria-describedby="nm-p">
      <p id="nm-h" className="t-head">Start a new meeting?</p>
      <p id="nm-p" className="t-sub mt-1">This clears the place, its photo and every visit on this device.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setSure(false)} className="btn secondary" autoFocus>
          Keep it
        </button>
        <button
          type="button"
          onClick={() => {
            mock.reset();
            setSure(false);
            router.push(to);
          }}
          className="btn danger"
        >
          Yes, clear it
        </button>
      </div>
    </div>
  );
}
