"use client";

/* Staff accept an invite: the invited email and a new password. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appCopy } from "@/content/app";
import { auth, isEmail, MESSAGES, MIN_PASSWORD, useAuth } from "@/lib/auth";
import { Field, FormError, Submit } from "../../forms";
import { IBack } from "../../icons";
import { haptic, NavBar } from "../../ui";
import { BusinessMark } from "./common";
import { landingFor } from "./BusinessSignIn";

const B = appCopy.business;

export function Join() {
  const a = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ email?: string; pw?: string; form?: string }>({});
  useEffect(() => {
    if (a.ready && a.partner) router.replace(landingFor(a.partner));
  }, [a.ready, a.partner, router]);
  return (
    <div className="a-fade pb-12">
      <NavBar
        left={
          <Link href="/app/business" aria-label="Back to partner login" className="iconbtn">
            <IBack />
          </Link>
        }
      />
      <header className="m pt-1">
        <BusinessMark />
        <h1 className="t-large mt-4">{B.joinTitle}</h1>
        <p className="t-sub mt-1.5 text-[17px]">{B.joinLine}</p>
      </header>
      <form
        className="m mt-6 space-y-5"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isEmail(email)) return setErr({ email: MESSAGES["invalid-email"] });
          if (pw.length < MIN_PASSWORD) return setErr({ pw: MESSAGES["weak-password"] });
          setBusy(true);
          setErr({});
          const r = await auth.acceptInvite(email, pw);
          setBusy(false);
          if (r.ok) haptic("success");
          else setErr({ form: r.message });
        }}
      >
        <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErr({}); }} error={err.email} autoFocus placeholder="name@example.com" />
        <Field label="Choose a password" type="password" autoComplete="new-password" value={pw} onChange={(v) => { setPw(v); setErr({}); }} error={err.pw} hint={appCopy.signUp.passwordHint} />
        <FormError>{err.form}</FormError>
        <Submit busy={busy} busyText="Setting up">
          {B.joinSubmit}
        </Submit>
      </form>
    </div>
  );
}
