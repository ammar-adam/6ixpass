"use client";

/*
 * Right after sign-up: first name, home and work, notifications. One
 * question per screen, then into Explore.
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { appCopy, GTA_AREAS } from "@/content/app";
import { auth, useAuth } from "@/lib/auth";
import { Field, FormError, Select, Submit } from "../../forms";
import { nextPath } from "../../Guard";
import { IBack } from "../../icons";
import { haptic, NavBar } from "../../ui";

const T = appCopy.setup;

export function Setup() {
  const a = useAuth();
  const router = useRouter();
  const me = a.member;
  const [step, setStep] = useState(0);
  const [name, setName] = useState(me?.firstName ?? "");
  const [home, setHome] = useState(me?.homeHood ?? "");
  const [work, setWork] = useState(me?.workHood ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async (patch: Parameters<typeof auth.updateProfile>[0], next: number | "done") => {
    setBusy(true);
    setErr(null);
    const r = await auth.updateProfile(patch);
    setBusy(false);
    if (!r.ok) return setErr(r.message);
    if (next === "done") {
      haptic("success");
      router.replace(nextPath("/app"));
    } else setStep(next);
  };

  const askNotify = async (yes: boolean) => {
    let on = false;
    if (yes && typeof Notification !== "undefined") {
      try {
        on = (await Notification.requestPermission()) === "granted";
      } catch {
        on = false;
      }
    } else on = yes;
    await save({ notify: on, onboarded: true }, "done");
  };

  return (
    <div className="a-fade flex min-h-full flex-col pb-12">
      <NavBar
        left={
          step > 0 ? (
            <button type="button" aria-label="Back" className="iconbtn" onClick={() => setStep(step - 1)}>
              <IBack />
            </button>
          ) : undefined
        }
        title={<span className="t-foot" data-testid="setup-step">Step {step + 1} of {T.steps}</span>}
      />
      <div className="m mt-1" aria-hidden="true">
        <div className="steps">
          {Array.from({ length: T.steps }, (_, i) => (
            <i key={i} className={i <= step ? "on" : ""} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <form
          className="m mt-6 space-y-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return setErr("Add your first name.");
            void save({ firstName: name.trim() }, 1);
          }}
        >
          <h1 className="t-large">{T.nameTitle}</h1>
          <p className="t-sub text-[17px]">{T.nameLine}</p>
          <Field label="First name" value={name} onChange={(v) => { setName(v); setErr(null); }} autoComplete="given-name" autoFocus maxLength={40} error={err} />
          <Submit busy={busy} busyText="Saving" disabled={!name.trim()}>
            Next
          </Submit>
        </form>
      )}

      {step === 1 && (
        <form
          className="m mt-6 space-y-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void save({ homeHood: home, workHood: work }, 2);
          }}
        >
          <h1 className="t-large">{T.hoodTitle}</h1>
          <p className="t-sub text-[17px]">{T.hoodLine}</p>
          <Select label={T.home} value={home} onChange={setHome} options={GTA_AREAS} />
          <Select label={T.work} value={work} onChange={setWork} options={GTA_AREAS} />
          <FormError>{err}</FormError>
          <Submit busy={busy} busyText="Saving">
            {home || work ? "Next" : "Skip for now"}
          </Submit>
        </form>
      )}

      {step === 2 && (
        <div className="m mt-6 space-y-5">
          <h1 className="t-large">{T.notifyTitle}</h1>
          <p className="t-sub text-[17px]">{T.notifyLine}</p>
          <FormError>{err}</FormError>
          <div className="space-y-2.5 pt-2">
            <button type="button" className="btn press" disabled={busy} onClick={() => askNotify(true)}>
              {T.notifyYes}
            </button>
            <button type="button" className="btn secondary press" disabled={busy} onClick={() => askNotify(false)}>
              {T.notifyNo}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
