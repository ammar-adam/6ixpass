"use client";

/* Where the reset-password email lands (Supabase mode). The link signs them in for long enough to choose a new password. */
import Link from "next/link";
import { useState } from "react";
import { appCopy } from "@/content/app";
import { auth, MIN_PASSWORD, MESSAGES } from "@/lib/auth";
import { Field, FormError, Submit } from "../../forms";
import { useQueryParam } from "../../Guard";
import { NavBar } from "../../ui";

const R = appCopy.reset;

export function Reset() {
  const side = useQueryParam("side") === "partner" ? "partner" : "member";
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  return (
    <div className="a-fade pb-12">
      <NavBar />
      <header className="m pt-1">
        <h1 className="t-large">{R.title}</h1>
      </header>
      {done ? (
        <div className="m mt-6 space-y-4" role="status">
          <p className="t-sub text-[17px]">{R.done}</p>
          <Link href={side === "partner" ? "/app/business" : "/app"} className="btn press">
            Continue
          </Link>
        </div>
      ) : (
        <form
          className="m mt-6 space-y-5"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (pw.length < MIN_PASSWORD) return setErr(MESSAGES["weak-password"]);
            setBusy(true);
            const r = await auth.setPassword(pw, side);
            setBusy(false);
            if (r.ok) setDone(true);
            else setErr(r.error === "unknown" ? "This link has run out. Ask for a new one from Forgot password." : r.message);
          }}
        >
          <Field label="New password" type="password" autoComplete="new-password" value={pw} onChange={(v) => { setPw(v); setErr(null); }} hint={appCopy.signUp.passwordHint} autoFocus />
          <FormError>{err}</FormError>
          <Submit busy={busy} busyText="Saving">
            {R.submit}
          </Submit>
        </form>
      )}
    </div>
  );
}
