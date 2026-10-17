"use client";

/*
 * /app/staff: the place's phone in two-phone mode. Staff scan the member's QR
 * (or type the 6 digits) and tap Confirm. The visit lands on this phone's
 * owner dashboard and the member's phone turns to "Confirmed by staff".
 */
import Link from "next/link";
import { useCallback, useState } from "react";
import { confirmCode, useLiveSettings, useLiveView, type ConfirmResult } from "../live";
import { LiveStatus, QrScanner } from "../LiveLink";
import { OWNER_ID } from "../owner";
import { place, useMock } from "../store";
import { IBack, ICamera, ICheck } from "../icons";
import { haptic, NavBar, splitCode, useNow } from "../ui";

const MESSAGES: Record<Exclude<ConfirmResult, "ok">, string> = {
  unknown: "That code isn't waiting here. Check the six digits on the member's screen.",
  used: "That code was already confirmed.",
  expired: "That code ran out. Ask the member to tap Redeem again.",
  offline: "No connection to the member's phone yet. Check both phones have signal, then try again.",
};

export function StaffScreen() {
  const s = useMock();
  const settings = useLiveSettings();
  const view = useLiveView();
  const now = useNow();
  const own = place(s, OWNER_ID);
  const [code, setCode] = useState("");
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string; code?: string } | null>(null);

  const check = useCallback(
    (c: string) => {
      const r = confirmCode(c);
      if (r === "ok") {
        haptic("success");
        setResult({ ok: true, text: own?.settings.offer ?? "Confirmed.", code: c });
        setCode("");
      } else {
        haptic("light");
        setResult({ ok: false, text: MESSAGES[r] });
      }
      setScan(false);
    },
    [own],
  );
  const scanError = useCallback((m: string) => {
    setScan(false);
    setResult({ ok: false, text: m });
  }, []);

  const back = (
    <Link href="/app/owner" aria-label="Back to the owner view" className="iconbtn">
      <IBack />
    </Link>
  );

  if (settings?.role !== "staff" || !own) {
    return (
      <div className="a-fade pb-10">
        <NavBar left={back} title="Check a code" />
        <div className="m mt-4">
          <p className="t-sub">This phone isn’t set up as the place yet.</p>
          <Link href="/app/live" className="btn press mt-4">
            Set up two phones
          </Link>
        </div>
      </div>
    );
  }

  const visits = s.redemptions.filter((r) => r.partnerId === OWNER_ID && r.status === "confirmed").reverse().slice(0, 8);
  const ago = (t?: number) => {
    const m = now ? Math.max(0, Math.floor((now - (t ?? 0)) / 60000)) : 0;
    return m < 1 ? "Just now" : m === 1 ? "1 min ago" : `${m} min ago`;
  };

  return (
    <div className="a-fade pb-28">
      <NavBar left={back} title="Check a code" />
      <header className="m pt-2">
        <p className="eyebrow">For staff · Room {settings.room}</p>
        <h1 className="display mt-2 text-[34px]">{own.name}</h1>
        <LiveStatus className="mt-2" />
        {view.waiting > 0 && (
          <p className="mt-2 text-[15px] font-semibold" style={{ color: "var(--accent)" }} data-testid="waiting">
            {view.waiting === 1 ? "A member has a code ready." : `${view.waiting} members have codes ready.`}
          </p>
        )}
      </header>

      {result && (
        <div className="m mt-5" role="status" aria-live="polite" data-testid="result">
          {result.ok ? (
            <div className="card a-pop p-5">
              <p className="flex items-center gap-2 text-[17px] font-semibold" style={{ color: "var(--ok)" }}>
                <span className="grid size-7 place-items-center rounded-full text-white" style={{ background: "var(--ok)" }}>
                  <ICheck size={16} />
                </span>
                Confirmed
              </p>
              <p className="mt-2 text-[20px] font-semibold tracking-[-0.01em]">{result.text}</p>
              <p className="t-sub mt-1">Code {result.code && splitCode(result.code)}. Take it off the bill as you normally would.</p>
            </div>
          ) : (
            <p className="note">{result.text}</p>
          )}
        </div>
      )}

      <div className="m mt-5">
        {scan ? (
          <>
            <QrScanner onCode={check} onError={scanError} />
            <button type="button" className="btn secondary press mt-3" onClick={() => setScan(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn press"
            onClick={() => {
              setResult(null);
              setScan(true);
            }}
          >
            <ICamera />
            Scan the member’s code
          </button>
        )}
      </div>

      <form
        className="m mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          check(code);
        }}
      >
        <label htmlFor="staff-code" className="group-label block">
          Or type the code
        </label>
        <div className="field-box">
          <input
            id="staff-code"
            value={code}
            onChange={(e) => {
              setResult(null);
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="6 digits"
            className="field tnum text-[22px] tracking-[0.2em]"
          />
        </div>
        <button type="submit" className="btn secondary press mt-3" disabled={code.length !== 6}>
          Confirm
        </button>
      </form>

      <div className="section-h">
        <h2 className="t-title">Tonight</h2>
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
                  <span className="block truncate text-[16px] font-semibold">{r.offer.replace(/\.$/, "")}</span>
                  <span className="t-foot block tnum">Code {splitCode(r.code)}</span>
                </span>
                <span className="v text-[15px]">{ago(r.confirmedAt)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="t-sub">No visits yet tonight.</p>
        )}
      </div>
      <div className="m mt-6">
        <Link href="/app/owner" className="btn secondary press">
          See the owner view
        </Link>
      </div>
    </div>
  );
}
