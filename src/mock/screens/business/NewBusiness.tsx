"use client";

/* A new business signs up: its name, the owner's email and password, and which place in the app it runs. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { appCopy } from "@/content/app";
import { auth, isEmail, MESSAGES, MIN_PASSWORD, useAuth } from "@/lib/auth";
import { Field, FormError, Select, Submit } from "../../forms";
import { IBack } from "../../icons";
import { places, useMock } from "../../store";
import { haptic, NavBar } from "../../ui";
import { BusinessMark } from "./common";
import { landingFor } from "./BusinessSignIn";

const B = appCopy.business;

export function NewBusiness() {
  const a = useAuth();
  const s = useMock();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [placeLabel, setPlaceLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ name?: string; email?: string; pw?: string; place?: string; form?: string }>({});
  const options = useMemo(() => places(s).map((p) => ({ id: p.id, label: `${p.name}, ${p.neighbourhood}` })), [s]);
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
        <h1 className="t-large mt-4">{B.newTitle}</h1>
        <p className="t-sub mt-1.5 text-[17px]">{B.newLine}</p>
      </header>
      <form
        className="m mt-6 space-y-5"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          const placeId = options.find((o) => o.label === placeLabel)?.id ?? "";
          if (!name.trim()) return setErr({ name: "Enter your business name." });
          if (!isEmail(email)) return setErr({ email: MESSAGES["invalid-email"] });
          if (pw.length < MIN_PASSWORD) return setErr({ pw: MESSAGES["weak-password"] });
          if (!placeId) return setErr({ place: "Choose your place." });
          setBusy(true);
          setErr({});
          const r = await auth.createBusiness(email, pw, name, placeId);
          setBusy(false);
          if (r.ok) haptic("success");
          else setErr({ form: r.message });
        }}
      >
        <Field label="Business name" value={name} onChange={(v) => { setName(v); setErr({}); }} error={err.name} autoFocus maxLength={80} />
        <Field label="Your email" type="email" value={email} onChange={(v) => { setEmail(v); setErr({}); }} error={err.email} placeholder="name@example.com" />
        <Field label="Choose a password" type="password" autoComplete="new-password" value={pw} onChange={(v) => { setPw(v); setErr({}); }} error={err.pw} hint={appCopy.signUp.passwordHint} />
        <div>
          <Select label="Your place" value={placeLabel} onChange={(v) => { setPlaceLabel(v); setErr({}); }} options={options.map((o) => o.label)} placeholder="Choose your place" />
          {err.place ? <p className="mt-2 text-[15px]" style={{ color: "var(--warn)" }} role="alert">{err.place}</p> : <p className="group-foot">{B.newPlaceHint}</p>}
        </div>
        <FormError>{err.form}</FormError>
        <Submit busy={busy} busyText="Setting up">
          {B.newSubmit}
        </Submit>
      </form>
    </div>
  );
}
