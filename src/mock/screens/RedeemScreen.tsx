"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { copy } from "@/demo/data";
import { NoPlaceYet } from "./owner/NoPlaceYet";
import { PlaceBody } from "./PlaceScreen";
import { blockFor, CODE_LIFE_MS, latestFor, mock, place, usesLeft, useMock, type Place } from "../store";
import { ICheck } from "../icons";
import { Guide, nextDay, Photo, Sheet, splitCode, UseDots, useEscape, useNow, Wordmark } from "../ui";

/** The second line of "Redeemed." Fits the kind of place. */
function enjoy(s: ReturnType<typeof useMock>, p: Place) {
  if (p.isOwner) {
    const c = s.owner?.category;
    return c === "restaurant" ? "Enjoy dinner." : c === "cafe" ? "Enjoy your coffee." : c === "spa" ? "Enjoy the spa." : c === "studio" ? "Enjoy class." : "Enjoy.";
  }
  return p.category === "Dining" ? "Enjoy your meal." : p.category === "Spa and wellness" ? "Enjoy the spa." : p.category === "Studios" ? "Enjoy class." : "Enjoy.";
}

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

  /* ---------- Redeemed ---------- */
  if (r && done) {
    const left = usesLeft(s, p);
    return (
      <div className="a-fade flex min-h-full flex-col" style={{ paddingBottom: "calc(var(--bottom) + 24px)" }}>
        <div className="relative h-[280px] shrink-0">
          <Photo p={p} size={1200} priority className="absolute inset-0 size-full" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, var(--bg) 100%)" }} />
        </div>
        <div className="m mt-3 flex-1" role="status">
          <p className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--ok)" }}>
            <span className="a-pop grid size-6 place-items-center rounded-full text-white" style={{ background: "var(--ok)" }}>
              <ICheck size={14} />
            </span>
            Confirmed by staff
          </p>
          <h1 className="display mt-3.5 text-[46px]">
            {copy.redeem.doneTitle}
            <br />
            <i>{enjoy(s, p)}</i>
          </h1>
          <p className="t-sub mt-3.5 text-[17px] leading-[1.4]">
            {r.offer.replace(/\.$/, "")} at {p.name}.{" "}
            {r.saving > 0 ? `You saved about $${r.saving}.` : "The owner sees this visit on their dashboard right away."}
          </p>
          <p className="t-foot mt-3 flex items-center gap-2" data-testid="uses-left">
            <UseDots left={left} total={p.settings.usesPerYear} />
            {copy.place.usesLeft(left, p.settings.usesPerYear)}
          </p>
          {p.isOwner && <Guide className="mt-4">Now see the visit on your dashboard.</Guide>}
        </div>
        <div className="m mt-6 space-y-2.5">
          {p.isOwner ? (
            <>
              <Link href="/app/owner" className="btn press">
                {copy.redeem.seeOwner}
              </Link>
              <Link href="/app" className="btn secondary press">
                Done
              </Link>
            </>
          ) : (
            <Link href="/app" className="btn press">
              Done
            </Link>
          )}
        </div>
      </div>
    );
  }

  const live = !!r && r.status === "issued" && !expired;
  const cancelAndClose = () => {
    if (live && r) mock.cancel(r.id);
    close();
  };

  return (
    <>
      <div inert>
        <PlaceBody s={s} p={p} block={block} />
      </div>

      {!r || (expired && block) ? (
        <Sheet title={p.name} close="Close" onClose={close} id="redeem">
          <div className="m pb-2 pt-4 text-center">
            <h1 id="redeem-h" className="t-title">{block ? block.message : "No code yet."}</h1>
            <p className="t-sub mt-2">{block ? "Try another place tonight." : "Open the place and tap Redeem when you're at the table."}</p>
            <Link href={`/app/place/${slug}`} className="btn press mt-6">
              Back to {p.name}
            </Link>
          </div>
        </Sheet>
      ) : (
        <Sheet title="Show this to your server" close="Close" onClose={cancelAndClose} tall id="redeem">
          <div className="m pt-2">
            <div className="pass a-pop" style={{ animationDuration: "0.6s" }}>
              <div className="relative h-[150px]">
                <Photo p={p} priority className="absolute inset-0 size-full" />
                <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0.04) 60%)" }} />
                <span className="absolute left-4 top-3.5">
                  <Wordmark size={16} light />
                </span>
                <span className="seal light absolute right-3.5 top-3.5">Member</span>
              </div>
              <div className="px-5 pb-4 pt-4">
                <p className="display text-[28px]">{p.name}</p>
                <p className="mt-1 text-[15px]" style={{ color: "var(--passSec)" }}>
                  {r.offer}
                </p>
              </div>
              <div className="relative h-0">
                <span className="notch -top-[10px] -left-[10px]" />
                <span className="notch -top-[10px] -right-[10px]" />
                <div className="mx-5 border-t border-dashed" style={{ borderColor: "rgba(244,241,236,0.3)" }} />
              </div>
              <div className="px-5 pb-5 pt-4">
                <h1 id="redeem-h" className="eyebrow" style={{ color: "var(--passSec)" }}>
                  {expired ? "Code expired" : "Member code"}
                </h1>
                <p aria-label={`Code ${r.code.split("").join(" ")}`} data-testid="code" className="tnum mt-0.5 text-[46px] font-semibold leading-tight tracking-[0.06em]" style={{ opacity: expired ? 0.35 : 1 }}>
                  {splitCode(r.code)}
                </p>
                <div className="mb-1.5 mt-2.5 flex justify-between text-[13px]" style={{ color: "var(--passSec)" }}>
                  <span>Valid for 10 minutes</span>
                  <span className="tnum" aria-label={`${mmss} left`}>{mmss}</span>
                </div>
                <div className="timerbar" aria-hidden="true">
                  <i style={{ width: `${(msLeft / CODE_LIFE_MS) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {expired ? (
            <div className="m mt-5">
              <p className="t-sub text-center" role="status">
                {copy.redeem.expired}
              </p>
              {!block && (
                <button type="button" onClick={() => mock.issue(slug)} className="btn press mt-4">
                  Get a new code
                </button>
              )}
            </div>
          ) : (
            <>
              <section className="m mt-5" aria-labelledby="staff-h">
                <div className="group p-4">
                  <h2 id="staff-h" className="eyebrow accent">
                    {copy.redeem.staffTitle}
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-[1.4]">{copy.redeem.staffLine}</p>
                  <button type="button" onClick={() => mock.confirm(r.id)} className="btn press mt-3.5">
                    {copy.staff.confirm}
                  </button>
                </div>
              </section>
              <p className="t-foot mt-3 text-center" role="status">
                {copy.redeem.waiting}
              </p>
            </>
          )}
        </Sheet>
      )}
    </>
  );
}
