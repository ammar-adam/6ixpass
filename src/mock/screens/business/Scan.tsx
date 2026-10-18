"use client";

/*
 * Scan: the host stand. Opens straight to the camera. Staff point it at the
 * member's code (QR or barcode) or type the six digits, and get a clear
 * answer: Confirmed (with the offer and the member's first name), or why not.
 * Silent; a haptic on the iPhone.
 *
 * Also the staff phone in the two-phone meeting demo (/app/staff), where the
 * code is checked against the member phone over the live link instead.
 */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { appCopy } from "@/content/app";
import { auth, useAuth, type ConfirmOutcome } from "@/lib/auth";
import { confirmCode as confirmLive, useLiveSettings, useLiveView } from "../../live";
import { LiveStatus } from "../../LiveLink";
import { OWNER_ID } from "../../owner";
import { Scanner } from "../../scanner";
import { place, useMock } from "../../store";
import { Spinner } from "../../forms";
import { IBack, ICamera, ICheck, IWarn } from "../../icons";
import { haptic, NavBar, splitCode, useNow } from "../../ui";
import { BusinessMark, PartnerFooter } from "./common";
import { ago } from "./Today";

const C = appCopy.scan;

export function ScanScreen({ twoPhones = false }: { twoPhones?: boolean }) {
  const s = useMock();
  const a = useAuth();
  const live = useLiveSettings();
  const view = useLiveView();
  const now = useNow();
  const liveStaff = twoPhones && live?.role === "staff";
  const placeId = liveStaff ? OWNER_ID : (a.partner?.placeId ?? null);
  const p = placeId ? place(s, placeId) : undefined;
  const [camera, setCamera] = useState(true);
  const [camError, setCamError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ConfirmOutcome | null>(null);

  const check = useCallback(
    async (raw: string) => {
      if (!placeId) return;
      setBusy(true);
      setCamera(false);
      let out: ConfirmOutcome;
      if (liveStaff) {
        // The member's code reaches this phone a moment after it goes on their screen. A quick
        // scan can beat it, so give it a few seconds before saying no.
        let r = confirmLive(raw);
        for (let i = 0; i < 6 && (r === "unknown" || r === "offline"); i++) {
          await new Promise((res) => setTimeout(res, 700));
          r = confirmLive(raw);
        }
        const c = raw.replace(/\D/g, "");
        out = r === "ok" ? { result: "ok", code: c, offer: place(s, OWNER_ID)?.settings.offer ?? "", memberName: "Member", usesLeft: -1, usesPerYear: 0 } : { result: r === "unknown" ? "unknown" : r, code: c };
      } else out = await auth.confirm(placeId, raw);
      setBusy(false);
      setResult(out);
      haptic(out.result === "ok" ? "success" : "warning");
      if (out.result === "ok") setCode("");
    },
    [placeId, liveStaff, s],
  );
  const onScanError = useCallback((m: string) => {
    setCamera(false);
    setCamError(m);
  }, []);

  // Keep today's list fresh while the scanner is open (Supabase; local is live already).
  useEffect(() => {
    if (liveStaff) return;
    void auth.refresh("place");
  }, [liveStaff]);

  const again = () => {
    setResult(null);
    setCamError(null);
    setCamera(true);
  };

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const visits = placeId
    ? s.redemptions.filter((r) => r.partnerId === placeId && r.status === "confirmed" && (liveStaff || (r.confirmedAt ?? 0) >= today.getTime())).sort((x, y) => (y.confirmedAt ?? 0) - (x.confirmedAt ?? 0)).slice(0, 8)
    : [];

  if (!p) {
    return (
      <div className="a-fade pb-10">
        <NavBar title="Check a code" left={<Link href="/app/owner" aria-label="Back to the owner view" className="iconbtn"><IBack /></Link>} />
        <div className="m mt-4">
          <p className="t-sub">This phone isn’t set up as the place yet.</p>
          <Link href="/app/live" className="btn press mt-4">
            Set up two phones
          </Link>
        </div>
      </div>
    );
  }

  const [title, detail] = result && result.result !== "ok" ? (C.results[result.result] ?? C.results.unknown) : ["", ""];

  return (
    <div className="a-fade pb-28">
      <NavBar
        left={
          liveStaff ? (
            <Link href="/app/owner" aria-label="Back to the owner view" className="iconbtn">
              <IBack />
            </Link>
          ) : (
            <span className="pl-3">
              <BusinessMark />
            </span>
          )
        }
        title={liveStaff ? "Check a code" : undefined}
      />
      <header className="m pt-1">
        <p className="eyebrow">{liveStaff ? `For staff · Room ${live?.room}` : C.title}</p>
        <h1 className="display mt-1.5 break-words text-[34px]">{p.name}</h1>
        {liveStaff && <LiveStatus className="mt-2" />}
        {liveStaff && view.waiting > 0 && (
          <p className="mt-2 text-[15px] font-semibold" style={{ color: "var(--accent)" }} data-testid="waiting">
            {view.waiting === 1 ? "A member has a code ready." : `${view.waiting} members have codes ready.`}
          </p>
        )}
      </header>

      <div className="m mt-4">
        <div className="overflow-hidden rounded-[16px]" style={{ boxShadow: "var(--shadow)" }}>
          {result ? (
            <div className={`a-pop p-5 ${result.result === "ok" ? "result-ok" : "result-bad"}`} role="status" aria-live="assertive" data-testid="result" data-result={result.result} style={{ minHeight: 220 }}>
              <span className="grid size-12 place-items-center rounded-full bg-white/20">{result.result === "ok" ? <ICheck size={26} /> : <IWarn size={26} />}</span>
              {result.result === "ok" ? (
                <>
                  <p className="mt-3 text-[28px] font-bold tracking-[-0.02em]">{C.ok}</p>
                  <p className="mt-1 text-[19px] font-semibold leading-snug">{result.offer}</p>
                  <p className="mt-2 text-[15px] opacity-95">
                    {result.memberName !== "Member" ? `For ${result.memberName}. ` : ""}Code {splitCode(result.code)}.
                    {result.usesLeft >= 0 ? ` ${result.usesLeft} of ${result.usesPerYear} uses left this year.` : ""}
                  </p>
                  <p className="mt-1 text-[15px] opacity-95">{C.okLine}</p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-[28px] font-bold tracking-[-0.02em]">{title}</p>
                  <p className="mt-1 text-[16px] leading-[1.4] opacity-95">{detail}</p>
                  {/^\d{6}$/.test(result.code) && <p className="tnum mt-2 text-[15px] opacity-90">Code {splitCode(result.code)}</p>}
                </>
              )}
              <button type="button" onClick={again} className="btn press mt-5" style={{ background: "#fff", color: "#16140F" }}>
                <ICamera />
                {C.next}
              </button>
            </div>
          ) : busy ? (
            <div className="scanbox grid place-items-center" style={{ height: 300 }}>
              <Spinner />
            </div>
          ) : camera ? (
            <Scanner onCode={check} onError={onScanError} />
          ) : (
            <div className="scanbox grid place-items-center p-6 text-center" style={{ height: 300 }}>
              <div>
                {camError && (
                  <p className="text-[15px] leading-[1.4] text-white" role="alert" data-testid="scan-error">
                    {camError}
                  </p>
                )}
                <button type="button" onClick={again} className="btn press mx-auto mt-4 w-auto px-6" style={{ background: "#fff", color: "#16140F" }}>
                  <ICamera />
                  {camError ? C.tryAgain : C.openCamera}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        className="m mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) void check(code);
        }}
      >
        <label htmlFor="staff-code" className="group-label block">
          {C.type}
        </label>
        <div className="field-box">
          <input
            id="staff-code"
            value={code}
            onChange={(e) => {
              setResult(null);
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            }}
            onFocus={() => setCamera(false)}
            inputMode="numeric"
            autoComplete="off"
            placeholder="6 digits"
            className="field tnum text-[22px] tracking-[0.2em]"
          />
        </div>
        <button type="submit" className="btn secondary press mt-3" disabled={code.length !== 6 || busy}>
          {C.confirm}
        </button>
      </form>

      <div className="section-h">
        <h2 className="t-title">{liveStaff ? "Tonight" : "Today"}</h2>
        <span className="t-sub" data-testid="tonight-count">
          {visits.length} {visits.length === 1 ? "visit" : "visits"}
        </span>
      </div>
      <div className="m mt-3">
        {visits.length ? (
          <ul className="group" data-testid="staff-visits">
            {visits.map((r) => (
              <li key={r.id} className="row">
                <span className="min-w-0">
                  <span className="block truncate text-[16px] font-semibold">{r.memberName || r.offer.replace(/\.$/, "")}</span>
                  <span className="t-foot block tnum">{r.memberName ? r.offer.replace(/\.$/, "") : `Code ${splitCode(r.code)}`}</span>
                </span>
                <span className="v text-[15px]">{ago(now ? now - (r.confirmedAt ?? 0) : 0)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="t-sub">No visits yet {liveStaff ? "tonight" : "today"}.</p>
        )}
      </div>
      {liveStaff ? (
        <div className="m mt-6">
          <Link href="/app/owner" className="btn secondary press">
            See the owner view
          </Link>
        </div>
      ) : (
        <PartnerFooter />
      )}
    </div>
  );
}
