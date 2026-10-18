"use client";

import Link from "next/link";
import { useState } from "react";
import { appCopy } from "@/content/app";
import { auth, isEmail, MESSAGES } from "@/lib/auth";
import { Field, FormError, Submit } from "../../forms";
import { useQueryParam } from "../../Guard";
import { IBack } from "../../icons";
import { NavBar } from "../../ui";

const F = appCopy.forgot;

export function Forgot() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<null | { demo: boolean }>(null);
  const side = useQueryParam("side") === "partner" ? "partner" : "member";
  const back = side === "partner" ? "/app/business" : "/app/account/sign-in";
  return (
    <div className="a-fade pb-12">
      <NavBar
        left={
          <Link href={back} aria-label="Back" className="iconbtn">
            <IBack />
          </Link>
        }
      />
      <header className="m pt-1">
        <h1 className="t-large">{F.title}</h1>
        <p className="t-sub mt-1.5 text-[17px]">{F.line}</p>
      </header>
      {done ? (
        <div className="m mt-6 space-y-4" role="status" data-testid="forgot-done">
          <p className="group p-4 text-[16px] leading-[1.4]">{done.demo ? F.demo : F.sent}</p>
          <Link href={back} className="btn press">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form
          className="m mt-6 space-y-5"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isEmail(email)) return setErr(MESSAGES["invalid-email"]);
            setBusy(true);
            const r = await auth.resetPassword(email, side);
            setBusy(false);
            if (r.ok) setDone(r.value);
            else setErr(r.message);
          }}
        >
          <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErr(null); }} autoFocus placeholder="name@example.com" />
          <FormError>{err}</FormError>
          <Submit busy={busy} busyText="Sending">
            {F.submit}
          </Submit>
        </form>
      )}
    </div>
  );
}
