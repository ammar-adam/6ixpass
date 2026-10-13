"use client";

import Link from "next/link";
import { useState } from "react";
import { copy } from "@/demo/data";
import { mock, place, useMock } from "../store";
import { IChev, IReset } from "../icons";
import { NavBar, Photo, Wordmark } from "../ui";

export function PassScreen() {
  const s = useMock();
  const [confirmReset, setConfirmReset] = useState(false);
  const confirmed = s.redemptions.filter((r) => r.status === "confirmed");
  const saved = confirmed.reduce((sum, r) => sum + r.saving, 0);

  return (
    <div className="a-fade pb-28">
      <NavBar />
      <header className="m pt-2">
        <h1 className="t-large">{copy.pass.title}</h1>
      </header>

      {/* The membership card, like a card in Wallet. */}
      <div className="m mt-4">
        <div className="pass aspect-[1.586] p-5">
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 100% 0%, rgba(244,241,236,0.10), transparent 60%)" }} />
          <div className="relative flex items-center justify-between">
            <Wordmark size={22} light />
            <span className="eyebrow" style={{ color: "var(--passSec)" }}>Member</span>
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[10px]" style={{ color: "var(--passSec)" }}>Name</p>
              <p className="mt-0.5 text-[19px] font-semibold">Alex</p>
            </div>
            <p className="text-right text-[13px]" style={{ color: "var(--passSec)" }}>{copy.pass.holder}</p>
          </div>
        </div>
      </div>

      <div className="m mt-4">
        <div className="group grid grid-cols-2">
          <div className="px-5 py-4">
            <p className="eyebrow">{copy.pass.saved}</p>
            <p className="tnum mt-1 text-[34px] font-bold leading-none tracking-[-0.03em]" data-testid="saved">${saved}</p>
          </div>
          <div className="px-5 py-4" style={{ borderLeft: "0.5px solid var(--line)" }}>
            <p className="eyebrow">{copy.pass.used}</p>
            <p className="tnum mt-1 text-[34px] font-bold leading-none tracking-[-0.03em]" data-testid="visits">{confirmed.length}</p>
          </div>
        </div>
        <p className="group-foot">Savings are estimates, based on the free item.</p>
      </div>

      <div className="section-h">
        <h2 className="t-title">{copy.pass.history}</h2>
      </div>
      <div className="m mt-3">
        {confirmed.length === 0 ? (
          <div className="group">
            <Link href="/app" className="row press">
              <span className="t-sub">{copy.pass.none}</span>
              <IChev className="chev" />
            </Link>
          </div>
        ) : (
          <ul className="group" data-testid="history">
            {[...confirmed].reverse().map((r) => {
              const p = place(s, r.partnerId);
              return (
                <li key={r.id} className="row inset">
                  <span className="flex min-w-0 items-center gap-3">
                    {p && <Photo p={p} className="thumb" />}
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] font-semibold">{p?.name}</span>
                      <span className="t-foot block truncate">{r.offer}</span>
                    </span>
                  </span>
                  <span className="v tnum text-[15px]">{r.saving > 0 ? `about $${r.saving}` : "Redeemed"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="section-h">
        <h2 className="t-title">About this demo</h2>
      </div>
      <div className="m mt-3">
        <div className="group">
          <p className="px-4 py-3.5 text-[15px] leading-[1.4]" style={{ color: "var(--sec)" }}>
            Everything here is saved in this browser only. Reset puts the places, offers and history back to the start.
          </p>
          {confirmReset ? (
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              <button type="button" onClick={() => setConfirmReset(false)} className="btn secondary">
                Keep
              </button>
              <button
                type="button"
                onClick={() => {
                  mock.reset();
                  setConfirmReset(false);
                }}
                className="btn danger text-[15px]"
              >
                Yes, reset everything
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmReset(true)} className="row press" style={{ color: "var(--warn)" }}>
              <span className="flex items-center gap-2">
                <IReset size={18} />
                Reset demo
              </span>
            </button>
          )}
        </div>
      </div>
      <p className="m t-foot mt-6 text-center">Places shown are examples.</p>
    </div>
  );
}
