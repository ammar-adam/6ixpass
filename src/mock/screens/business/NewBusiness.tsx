"use client";

/*
 * A new business signs up: its name, the owner's email and password, then
 *   demo accounts: which place in the app it runs (any place, for testing);
 *   real accounts: its neighbourhood and type of place. That makes a new place,
 *   hidden from members until The 6 Pass approves it (create_my_business).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { appCopy, GTA_AREAS } from "@/content/app";
import { AUTH_MODE, auth, isEmail, MESSAGES, MIN_PASSWORD, onDemoAccounts, useAuth, type NewBusinessPlace } from "@/lib/auth";
import { Field, FormError, Select, Submit } from "../../forms";
import { IBack } from "../../icons";
import { OWNER_CATEGORIES } from "../../owner";
import { places, useMock } from "../../store";
import { haptic, NavBar } from "../../ui";
import { BusinessMark } from "./common";
import { landingFor } from "./BusinessSignIn";

const B = appCopy.business;
const noop = () => () => {};

type Errors = { name?: string; email?: string; pw?: string; place?: string; hood?: string; type?: string; form?: string };

const Hint = ({ error, children }: { error?: string; children?: React.ReactNode }) =>
  error ? (
    <p className="mt-2 text-[15px]" style={{ color: "var(--warn)" }} role="alert">
      {error}
    </p>
  ) : children ? (
    <p className="group-foot">{children}</p>
  ) : null;

export function NewBusiness() {
  const a = useAuth();
  const s = useMock();
  const router = useRouter();
  // Demo accounts (or Nida's meeting on this device): pick a place in the app. Real accounts: describe a new one.
  const demo = useSyncExternalStore(noop, onDemoAccounts, () => AUTH_MODE === "local");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [placeLabel, setPlaceLabel] = useState("");
  const [hood, setHood] = useState("");
  const [typeLabel, setTypeLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Errors>({});
  const options = useMemo(() => places(s).map((p) => ({ id: p.id, label: `${p.name}, ${p.neighbourhood}` })), [s]);
  useEffect(() => {
    if (a.ready && a.partner) router.replace(landingFor(a.partner));
  }, [a.ready, a.partner, router]);
  const clear = () => setErr({});

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
        <p className="t-sub mt-1.5 text-[17px]">{demo ? B.newLine : B.newRealLine}</p>
      </header>
      <form
        className="m mt-6 space-y-5"
        noValidate
        data-testid="new-business"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return setErr({ name: B.newNameError });
          if (!isEmail(email)) return setErr({ email: MESSAGES["invalid-email"] });
          if (pw.length < MIN_PASSWORD) return setErr({ pw: MESSAGES["weak-password"] });
          let where: NewBusinessPlace;
          if (demo) {
            const placeId = options.find((o) => o.label === placeLabel)?.id ?? "";
            if (!placeId) return setErr({ place: "Choose your place." });
            where = { id: placeId };
          } else {
            const category = OWNER_CATEGORIES.find((c) => c.label === typeLabel)?.id;
            if (!hood) return setErr({ hood: B.newHoodError });
            if (!category) return setErr({ type: B.newTypeError });
            where = { neighbourhood: hood, category };
          }
          setBusy(true);
          setErr({});
          const r = await auth.createBusiness(email, pw, name, where);
          setBusy(false);
          if (r.ok) haptic("success");
          else setErr({ form: r.message });
        }}
      >
        <Field label={B.newName} value={name} onChange={(v) => { setName(v); clear(); }} error={err.name} autoFocus maxLength={80} />
        <Field label={B.newEmail} type="email" value={email} onChange={(v) => { setEmail(v); clear(); }} error={err.email} placeholder="name@example.com" />
        <Field label={B.newPassword} type="password" autoComplete="new-password" value={pw} onChange={(v) => { setPw(v); clear(); }} error={err.pw} hint={appCopy.signUp.passwordHint} />
        {demo ? (
          <div>
            <Select label="Your place" value={placeLabel} onChange={(v) => { setPlaceLabel(v); clear(); }} options={options.map((o) => o.label)} placeholder="Choose your place" />
            <Hint error={err.place}>{B.newPlaceHint}</Hint>
          </div>
        ) : (
          <>
            <div>
              <Select label={B.newHood} value={hood} onChange={(v) => { setHood(v); clear(); }} options={GTA_AREAS} placeholder={B.newHoodPick} />
              <Hint error={err.hood} />
            </div>
            <div>
              <Select label={B.newType} value={typeLabel} onChange={(v) => { setTypeLabel(v); clear(); }} options={OWNER_CATEGORIES.map((c) => c.label)} placeholder={B.newTypePick} />
              <Hint error={err.type}>{B.newRealHint}</Hint>
            </div>
          </>
        )}
        <FormError>{err.form}</FormError>
        <Submit busy={busy} busyText="Setting up">
          {B.newSubmit}
        </Submit>
      </form>
    </div>
  );
}
