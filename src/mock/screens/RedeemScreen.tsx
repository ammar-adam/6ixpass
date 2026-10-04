"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Check, Storefront, X } from "@phosphor-icons/react";
import { copy } from "@/demo/data";
import { NoPlaceYet } from "./owner/NoPlaceYet";
import { blockFor, CODE_LIFE_MS, latestFor, mock, place, usesLeft, useMock } from "../store";
import { C, cardGlow, Guide, label, nextDay, Photo, Ring, serif, splitCode, useEscape, useNow, Wordmark } from "../ui";

export function RedeemScreen({ slug }: { slug: string }) {
  const s = useMock();
  const router = useRouter();
  const now = useNow();
  const p = place(s, slug);
  const r = latestFor(s, slug);
  const done = r?.status === "confirmed";
  const close = useCallback(() => router.push(done ? "/app" : `/app/place/${slug}`), [router, done, slug]);
  useEscape(close);
  if (!p) return <NoPlaceYet />;

  const msLeft = r ? Math.min(CODE_LIFE_MS, Math.max(0, r.issuedAt + CODE_LIFE_MS - (now || r.issuedAt))) : 0;
  const secs = Math.ceil(msLeft / 1000);
  const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const expired = r?.status === "issued" && msLeft === 0;
  const block = blockFor(s, p, nextDay(p.settings.days));

  const live = r && r.status === "issued" && !expired;
  const guide = done ? (p.isOwner ? "Now see the visit on your dashboard." : null) : live ? "Staff check the code matches, then tap Confirm." : null;

  return (
    <div className="m-enter flex min-h-full flex-col pb-8" role="region" aria-labelledby="redeem-h">
      {guide && <Guide>{guide}</Guide>}
      <div className="flex flex-1 flex-col px-5 pt-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (r && r.status === "issued" && !expired) mock.cancel(r.id);
            close();
          }}
          aria-label={done ? "Close" : "Cancel and close"}
          className="grid size-11 place-items-center rounded-full border"
          style={{ borderColor: C.line }}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <p className="text-[13px] font-semibold" style={{ color: C.muted }}>{done ? "Confirmed" : "Show at the table"}</p>
        <span className="size-11" />
      </div>

      <div className="my-auto py-6">
        {!r || (expired && block) ? (
          <div className="rounded-[24px] border p-6 text-center" style={{ borderColor: C.line }}>
            <h1 id="redeem-h" className="text-[26px] leading-tight" style={serif}>{block ? block.message : "No code yet."}</h1>
            <p className="mt-2" style={{ color: C.muted }}>{block ? p.name : "Open the place and tap Redeem when you're at the table."}</p>
            <Link href={`/app/place/${slug}`} className="m-press mt-6 inline-flex h-12 items-center rounded-[16px] px-6 font-bold" style={{ background: C.ice, color: C.iceInk }}>
              Back to {p.name}
            </Link>
          </div>
        ) : (
          <>
            <div className="m-pop overflow-hidden rounded-[28px]" style={cardGlow}>
              <div className="relative h-[124px]">
                <Photo p={p} priority className="absolute inset-0 size-full" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#0F1E38] to-transparent" />
                <span className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
                <div className="absolute left-5 top-4"><Wordmark size={16} /></div>
                <p className="absolute bottom-3 left-5 text-[26px] leading-none" style={serif}>{p.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 px-5 pt-4 text-[14px]">
                <div><p className={label} style={{ color: C.muted, fontSize: 10 }}>Member</p><p className="font-semibold">Alex</p></div>
                <div className="text-right"><p className={label} style={{ color: C.muted, fontSize: 10 }}>Neighbourhood</p><p className="font-semibold">{p.neighbourhood}</p></div>
                <div className="col-span-2"><p className={label} style={{ color: C.muted, fontSize: 10 }}>Offer</p><p className="font-semibold">{r.offer}</p></div>
              </div>
              <div className="mx-5 my-4 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.18)" }} />
              {done ? (
                <div className="flex items-center gap-4 px-5 pb-6" role="status">
                  <span className="m-pop grid size-16 shrink-0 place-items-center rounded-full" style={{ background: C.ice, color: C.iceInk }}>
                    <Check size={34} weight="bold" aria-hidden="true" />
                  </span>
                  <div>
                    <h1 id="redeem-h" className="text-[30px] leading-none" style={serif}>{copy.redeem.doneTitle}</h1>
                    <p className="mt-1 text-[15px]" style={{ color: C.soft }}>{r.saving > 0 ? copy.redeem.doneText(r.saving) : copy.redeem.doneOwner}</p>
                    <p className="mt-0.5 text-[13px]" style={{ color: C.muted }} data-testid="uses-left">{copy.place.usesLeft(usesLeft(s, p), p.settings.usesPerYear)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 px-5 pb-5">
                  <div>
                    <h1 id="redeem-h" className={label} style={{ color: C.ice, fontSize: 12 }}>{expired ? "Code expired" : copy.redeem.title}</h1>
                    <p aria-label={`Code ${r.code.split("").join(" ")}`} data-testid="code" className="tabular mt-1 text-[42px] font-bold leading-none tracking-[0.06em]" style={{ opacity: expired ? 0.35 : 1 }}>
                      {splitCode(r.code)}
                    </p>
                  </div>
                  <Ring fraction={msLeft / CODE_LIFE_MS}>
                    <span className="text-center">
                      <span className="tabular block text-[20px] font-bold">{mmss}</span>
                      <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>left</span>
                    </span>
                  </Ring>
                </div>
              )}
            </div>

            {done ? (
              <>
                {p.isOwner && (
                  <Link href="/app/owner" className="m-press mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] text-[16px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
                    <Storefront size={20} weight="bold" aria-hidden="true" />
                    {copy.redeem.seeOwner}
                  </Link>
                )}
                <Link
                  href="/app"
                  className={`m-press flex h-14 w-full items-center justify-center rounded-[20px] text-[16px] font-bold ${p.isOwner ? "mt-3 border" : "mt-6"}`}
                  style={p.isOwner ? { borderColor: C.line } : { background: C.ice, color: C.iceInk }}
                >
                  {copy.redeem.doneBack}
                </Link>
              </>
            ) : expired ? (
              <>
                <p className="mt-6 rounded-[20px] border px-4 py-4 text-center font-semibold" style={{ borderColor: C.line, color: C.soft }} role="status">{copy.redeem.expired}</p>
                {!block && (
                  <button type="button" onClick={() => mock.issue(slug)} className="m-press mt-3 h-14 w-full rounded-[20px] text-[16px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
                    Get a new code
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="mt-5 text-center text-[14px]" style={{ color: C.muted }} role="status">{copy.redeem.waiting}</p>
                <section className="mt-4 rounded-[22px] border p-5" style={{ background: C.panel, borderColor: C.line }} aria-labelledby="staff-h">
                  <h2 id="staff-h" className={label} style={{ color: C.ice }}>{copy.redeem.staffTitle}</h2>
                  <p className="mt-2 text-[15px]" style={{ color: C.soft }}>{copy.redeem.staffLine}</p>
                  <button type="button" onClick={() => mock.confirm(r.id)} className="m-press mt-4 h-14 w-full rounded-[18px] text-[17px] font-bold" style={{ background: C.ok, color: C.iceInk }}>
                    {copy.staff.confirm}
                  </button>
                </section>
              </>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
