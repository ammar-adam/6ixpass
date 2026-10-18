"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { copy } from "@/demo/data";
import { NoPlaceYet } from "./owner/NoPlaceYet";
import { PlaceBody } from "./PlaceScreen";
import { blockFor, CODE_LIFE_MS, latestFor, mock, place, usesLeft, useMock, type Place } from "../store";
import { ICheck } from "../icons";
import { Guide, haptic, nextDay, Photo, Sheet, splitCode, UseDots, useEscape, useNow, Wordmark } from "../ui";
import { announceCancel, qrText, useLiveSettings } from "../live";
import { LiveStatus } from "../LiveLink";
import { ScanCodes } from "../codes";
import { appCopy } from "@/content/app";
import { auth, onDemoAccounts, useAuth } from "@/lib/auth";

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
  const settings = useLiveSettings();
  // Two phones: this phone is the member and this is the place being visited. Staff confirm on their phone.
  const twoPhones = settings?.role === "member" && !!p?.isOwner;
  const a = useAuth();
  // Nida's meeting: the owner taps Confirm on the member's phone ("No scanner, no app, no login").
  // Everyone else shows the code and waits for staff to scan it.
  const meeting = !!a.partner?.demo && !!a.member?.demo;
  const [fallback, setFallback] = useState(false);
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
          {p.isOwner && meeting && !twoPhones && <Guide className="mt-4">Now see the visit on your dashboard.</Guide>}
        </div>
        <div className="m mt-6 space-y-2.5">
          {p.isOwner && meeting && !twoPhones ? (
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
  const scanMode = !expired && ((twoPhones && !fallback) || !meeting);
  const cancelAndClose = () => {
    if (live && r) {
      void auth.cancel(r.id);
      announceCancel(r.code);
    }
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
        <Sheet title={scanMode ? appCopy.redeem.show : "Show this to your server"} close="Close" onClose={cancelAndClose} tall id="redeem">
          <div className="m pt-2">
            <div className="pass a-pop" style={{ animationDuration: "0.6s" }}>
              {scanMode ? (
                // Wallet-style pass with the code on white, so it scans from across the host stand.
                <>
                  <div className="flex items-center justify-between px-5 pt-4">
                    <Wordmark size={16} light />
                    <span className="seal light">Member</span>
                  </div>
                  <div className="px-5 pt-3">
                    <p className="display truncate text-[26px]">{p.name}</p>
                    <p className="mt-0.5 truncate text-[15px]" style={{ color: "var(--passSec)" }}>
                      {r.offer}
                    </p>
                  </div>
                  <div className="mx-4 mt-3">
                    <ScanCodes text={qrText(r.code)} qrSize={196} />
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
              <div className={scanMode ? "px-5 pb-4 pt-3" : "px-5 pb-5 pt-4"}>
                <h1 id="redeem-h" className="eyebrow" style={{ color: "var(--passSec)" }}>
                  {expired ? "Code expired" : "Member code"}
                </h1>
                <p aria-label={`Code ${r.code.split("").join(" ")}`} data-testid="code" className={`tnum mt-0.5 font-semibold leading-tight tracking-[0.06em] ${scanMode ? "text-[34px]" : "text-[46px]"}`} style={{ opacity: expired ? 0.35 : 1 }}>
                  {splitCode(r.code)}
                </p>
                <div className="mb-1.5 mt-2 flex justify-between text-[13px]" style={{ color: "var(--passSec)" }}>
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
                <button type="button" onClick={() => void auth.issue(slug)} className="btn press mt-4">
                  Get a new code
                </button>
              )}
            </div>
          ) : scanMode ? (
            <section className="m mt-4" aria-label="Waiting for staff">
              <p className="t-foot flex items-center justify-center gap-2 text-center" role="status" data-testid="waiting-staff">
                <span aria-hidden="true" className="spinner" style={{ width: 12, height: 12, borderColor: "var(--line)", borderTopColor: "var(--sec)" }} />
                {twoPhones ? "Waiting for staff to confirm on their phone." : appCopy.redeem.waiting}
              </p>
              {twoPhones ? (
                <>
                  <LiveStatus className="mt-1 justify-center" />
                  <button type="button" className="t-foot mx-auto mt-2 block min-h-[44px] underline" onClick={() => setFallback(true)}>
                    No signal? Confirm on this phone instead
                  </button>
                </>
              ) : (
                <>
                  <p className="t-foot mt-1 text-center">{appCopy.redeem.showLine} {appCopy.redeem.brighter}</p>
                  {onDemoAccounts() && (
                    <p className="t-foot mt-3 text-center" data-testid="redeem-demo-hint">
                      Demo: in another window, tap I&apos;m a business, sign in as staff, and scan or type this code.
                    </p>
                  )}
                </>
              )}
            </section>
          ) : (
            <>
              <section className="m mt-5" aria-labelledby="staff-h">
                <div className="group p-4">
                  <h2 id="staff-h" className="eyebrow accent">
                    {copy.redeem.staffTitle}
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-[1.4]">{copy.redeem.staffLine}</p>
                  <button type="button" onClick={() => {
                      haptic("success");
                      mock.confirm(r.id);
                    }} className="btn press mt-3.5">
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
