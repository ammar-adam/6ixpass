"use client";

/*
 * Sign in with a password, or with a 6-digit code sent by email. Shared by
 * the member app and the business login; `side` keeps the two sessions apart.
 */
import Link from "next/link";
import { useState } from "react";
import { appCopy } from "@/content/app";
import { auth, isEmail, MESSAGES, onDemoAccounts, type Result } from "@/lib/auth";
import { DemoNote, Field, FormError, Submit } from "../../forms";
import { haptic } from "../../ui";

const S = appCopy.signIn;
const K = appCopy.code;

export function SignInForm({ side, onDone, demoText, demoFill }: { side: "member" | "partner"; onDone: () => void; demoText: string; demoFill: { email: string; password: string }[] }) {
  const [mode, setMode] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState<{ demoCode?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string; code?: string; form?: string }>({});

  const finish = (r: Result<unknown>) => {
    setBusy(false);
    if (r.ok) {
      haptic("success");
      onDone();
      return;
    }
    haptic("light");
    if (r.error === "invalid-email") setErr({ email: r.message });
    else if (r.error === "weak-password") setErr({ password: r.message });
    else if (r.error === "bad-code") setErr({ code: r.message });
    else setErr({ form: r.message });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setErr({ email: MESSAGES["invalid-email"] });
    if (mode === "password") {
      if (!password) return setErr({ password: "Enter your password." });
      setBusy(true);
      setErr({});
      return finish(side === "member" ? await auth.signIn(email, password) : await auth.partnerSignIn(email, password));
    }
    if (!sent) {
      setBusy(true);
      setErr({});
      const r = await auth.sendCode(email, side);
      setBusy(false);
      if (r.ok) setSent(r.value);
      else finish(r);
      return;
    }
    if (code.length !== 6) return setErr({ code: "The code is 6 digits." });
    setBusy(true);
    setErr({});
    finish(await auth.verifyCode(email, code, side));
  };

  const switchMode = () => {
    setMode(mode === "password" ? "code" : "password");
    setSent(null);
    setCode("");
    setErr({});
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-label={side === "member" ? "Sign in" : "Partner sign in"}>
      <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErr({}); setSent(null); }} error={err.email} autoFocus placeholder="name@example.com" />
      {mode === "password" ? (
        <div>
          <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(v) => { setPassword(v); setErr({}); }} error={err.password} />
          <p className="mt-2 text-right">
            <Link href={`/app/account/forgot${side === "partner" ? "?side=partner" : ""}`} className="link inline-flex min-h-[44px] items-center text-[15px]">
              {S.forgot}
            </Link>
          </p>
        </div>
      ) : (
        sent && (
          <div className="space-y-3">
            <p className="t-sub" role="status">
              {sent.demoCode ? K.demoSent(sent.demoCode) : K.sent(email.trim())}
            </p>
            <Field label={K.label} type="code" value={code} onChange={(v) => { setCode(v); setErr({}); }} error={err.code} autoFocus placeholder="123456" />
          </div>
        )
      )}
      <FormError>{err.form}</FormError>
      <Submit busy={busy} busyText={mode === "password" ? S.busy : sent ? "Checking" : "Sending"}>
        {mode === "password" ? S.submit : sent ? K.submit : "Send code"}
      </Submit>
      {mode === "code" && sent && (
        <button type="button" className="btn secondary press" onClick={() => { setSent(null); setCode(""); }}>
          {K.resend}
        </button>
      )}
      <div className="divider">or</div>
      <button type="button" className="btn secondary press" onClick={switchMode}>
        {mode === "password" ? S.codeInstead : S.passwordInstead}
      </button>
      {onDemoAccounts() && (
        <DemoNote>
          {demoText}
          <span className="mt-2 flex flex-wrap gap-2">
            {demoFill.map((d) => (
              <button
                key={d.email}
                type="button"
                className="chip press"
                onClick={() => {
                  setMode("password");
                  setEmail(d.email);
                  setPassword(d.password);
                  setErr({});
                }}
              >
                {demoFill.length > 1 ? `Fill in ${d.email.split("@")[0]}` : appCopy.demoNote.fill}
              </button>
            ))}
          </span>
        </DemoNote>
      )}
    </form>
  );
}
