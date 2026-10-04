"use client";

import { useState } from "react";
import { ArrowCounterClockwise, DownloadSimple } from "@phosphor-icons/react";
import { copy } from "@/demo/data";
import { mock, place, useMock } from "../store";
import { C, cardGlow, label, Photo, serif, Wordmark } from "../ui";

export function PassScreen() {
  const s = useMock();
  const [confirmReset, setConfirmReset] = useState(false);
  const confirmed = s.redemptions.filter((r) => r.status === "confirmed");
  const saved = confirmed.reduce((sum, r) => sum + r.saving, 0);

  return (
    <div className="m-enter px-5 pb-32 pt-5">
      <h1 className="text-[34px] leading-none" style={serif}>{copy.pass.title}</h1>
      <div className="relative mt-5 aspect-[1.586] overflow-hidden rounded-[24px] p-5" style={cardGlow}>
        <div aria-hidden="true" className="absolute -right-10 -top-12 size-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(169,209,255,0.35), transparent 70%)" }} />
        <div className="relative flex items-center justify-between">
          <Wordmark size={22} />
          <span className={label} style={{ color: C.ice }}>Member</span>
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <p className={label} style={{ color: C.muted, fontSize: 10 }}>Name</p>
          <p className="text-[18px] font-semibold">Alex</p>
          <p className="mt-0.5 text-[13px]" style={{ color: C.muted }}>{copy.pass.holder}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] border p-4" style={{ background: C.panel, borderColor: C.line }}>
          <p className={label} style={{ color: C.muted }}>{copy.pass.saved}</p>
          <p className="tabular mt-1 text-[36px] leading-none" style={{ ...serif, color: C.ice }} data-testid="saved">${saved}</p>
        </div>
        <div className="rounded-[22px] border p-4" style={{ background: C.panel, borderColor: C.line }}>
          <p className={label} style={{ color: C.muted }}>{copy.pass.used}</p>
          <p className="tabular mt-1 text-[36px] leading-none" style={serif} data-testid="visits">{confirmed.length}</p>
        </div>
      </div>
      <p className="mt-2 text-[12px]" style={{ color: C.muted }}>Savings are estimates, based on the free item.</p>

      <h2 className={`${label} mt-8`} style={{ color: C.muted }}>{copy.pass.history}</h2>
      {confirmed.length === 0 ? (
        <p className="mt-3" style={{ color: C.muted }}>{copy.pass.none}</p>
      ) : (
        <ul className="mt-3 space-y-2" data-testid="history">
          {[...confirmed].reverse().map((r) => {
            const p = place(s, r.partnerId);
            return (
              <li key={r.id} className="flex items-center gap-3 rounded-[18px] border p-2.5" style={{ background: C.panel, borderColor: C.line }}>
                {p && <Photo p={p} className="size-14 shrink-0 rounded-[14px]" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px]" style={serif}>{p?.name}</span>
                  <span className="block truncate text-[13px]" style={{ color: C.muted }}>{r.offer}</span>
                </span>
                <span className="tabular shrink-0 pr-2 text-[14px] font-semibold" style={{ color: C.ice }}>about ${r.saving}</span>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-10 rounded-[22px] border p-4" style={{ borderColor: C.line }} aria-labelledby="demo-h">
        <h2 id="demo-h" className={label} style={{ color: C.muted }}>About this demo</h2>
        <p className="mt-2 text-[14px]" style={{ color: C.soft }}>
          Everything here is saved in this browser only. Reset puts the places, offers and history back to the start.
        </p>
        <div className="mt-2 flex items-start gap-2 text-[13px]" style={{ color: C.muted }}>
          <DownloadSimple size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          To keep it on your laptop, open the browser menu and choose Install The 6 Pass (Chrome) or Apps, then Install this site as an app (Edge).
        </div>
        {confirmReset ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                mock.reset();
                setConfirmReset(false);
              }}
              className="m-press h-12 flex-1 rounded-[16px] text-[15px] font-bold"
              style={{ background: C.warn, color: C.iceInk }}
            >
              Yes, reset everything
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="h-12 rounded-[16px] border px-5 text-[15px] font-semibold" style={{ borderColor: C.line }}>
              Keep
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="m-press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border text-[15px] font-semibold" style={{ borderColor: C.line }}>
            <ArrowCounterClockwise size={18} aria-hidden="true" />
            Reset demo
          </button>
        )}
      </section>
    </div>
  );
}
