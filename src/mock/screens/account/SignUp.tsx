"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { appCopy } from "@/content/app";
import { joinWaitlist } from "@/lib/waitlist";
import { auth, isEmail, MESSAGES, MIN_PASSWORD, onDemoAccounts, useAuth } from "@/lib/auth";
import { DemoNote, Field, FormError, Submit } from "../../forms";
import { nextPath } from "../../Guard";
import { IBack } from "../../icons";
import { haptic, NavBar } from "../../ui";

const U = appCopy.signUp;
const SITE = "https://the6pass.ca";

export function SignUp() {
  const router = useRouter();
  const a = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string; form?: string }>({});
  const [confirm, setConfirm] = useState(false);
  const [code, setCode] = useState("");
  const [updates, setUpdates] = useState(false);
  const updatesId = useId();

  useEffect(() => {
    if (a.ready && a.member) router.replace(a.member.onboarded ? nextPath("/app") : `/app/account/setup?next=${encodeURIComponent(nextPath("/app"))}`);
  }, [a.ready, a.member, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bad: typeof err = {};
    if (!isEmail(email)) bad.email = MESSAGES["invalid-email"];
    if (password.length < MIN_PASSWORD) bad.password = MESSAGES["weak-password"];
    if (bad.email || bad.password) return setErr(bad);
    setBusy(true);
    setErr({});
    const r = await auth.signUp(email, password);
    setBusy(false);
    if (!r.ok) {
      haptic("light");
      return setErr(r.error === "invalid-email" ? { email: r.message } : r.error === "weak-password" ? { password: r.message } : { form: r.message });
    }
    haptic("success");
    // Ticked: add them to the same email list as the website, with the words they agreed to.
    if (updates && !onDemoAccounts()) await joinWaitlist({ email, consent: true, consentText: U.consentLabel, source: "app" });
    if (r.value.confirmEmail) setConfirm(true);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setErr({ form: "The code is 6 digits." });
    setBusy(true);
    const r = await auth.verifyCode(email, code, "member");
    setBusy(false);
    if (!r.ok) setErr({ form: r.message });
  };

  const back = (
    <Link href="/app" aria-label="Back" className="iconbtn">
      <IBack />
    </Link>
  );

  if (confirm) {
    return (
      <div className="a-fade pb-12">
        <NavBar left={back} />
        <header className="m pt-1">
          <h1 className="t-large">{U.checkEmail}</h1>
          <p className="t-sub mt-1.5 text-[17px]">{U.checkEmailLine(email.trim())}</p>
        </header>
        <form className="m mt-6 space-y-5" onSubmit={verify} noValidate>
          <Field label={appCopy.code.label} type="code" value={code} onChange={setCode} autoFocus placeholder="123456" />
          <FormError>{err.form}</FormError>
          <Submit busy={busy} busyText="Checking">
            {appCopy.code.submit}
          </Submit>
        </form>
      </div>
    );
  }

  return (
    <div className="a-fade pb-12">
      <NavBar left={back} />
      <header className="m pt-1">
        <h1 className="t-large">{U.title}</h1>
        <p className="t-sub mt-1.5 text-[17px]">{U.sub}</p>
      </header>
      <form className="m mt-6 space-y-5" onSubmit={submit} noValidate aria-label="Create account">
        <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErr({}); }} error={err.email} autoFocus placeholder="name@example.com" />
        <Field label="Password" type="password" autoComplete="new-password" value={password} onChange={(v) => { setPassword(v); setErr({}); }} error={err.password} hint={U.passwordHint} />
        <div className="flex items-start gap-3">
          <input id={updatesId} type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-current" />
          <label htmlFor={updatesId} className="t-foot cursor-pointer text-[15px] leading-snug">
            {U.consentLabel}
          </label>
        </div>
        <FormError>{err.form}</FormError>
        <Submit busy={busy} busyText={U.busy}>
          {U.submit}
        </Submit>
        <p className="t-foot">
          By creating an account you agree to the{" "}
          <a href={`${SITE}/terms`} target="_blank" rel="noopener noreferrer" className="underline">
            Terms
          </a>{" "}
          and the{" "}
          <a href={`${SITE}/privacy`} target="_blank" rel="noopener noreferrer" className="underline">
            Privacy policy
          </a>
          .
        </p>
        {onDemoAccounts() && <DemoNote>An account made here lives on this device only. No email is sent.</DemoNote>}
      </form>
      <p className="m t-sub mt-8 text-center">
        {U.haveAccount}{" "}
        <Link href="/app/account/sign-in" className="link inline-flex min-h-[44px] items-center">
          Sign in
        </Link>
      </p>
    </div>
  );
}
