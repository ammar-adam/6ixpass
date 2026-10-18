"use client";

/* /app/account: the member's profile, sign out and delete account. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { appCopy, GTA_AREAS } from "@/content/app";
import { auth, useAuth } from "@/lib/auth";
import { Field, FormError, Select, Submit } from "../../forms";
import { markLeaving } from "../../Guard";
import { IBack } from "../../icons";
import { haptic, NavBar, Sheet } from "../../ui";

const A = appCopy.account;

export function Account() {
  const me = useAuth().member!;
  const router = useRouter();
  const [name, setName] = useState(me.firstName);
  const [home, setHome] = useState(me.homeHood);
  const [work, setWork] = useState(me.workHood);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const changed = name.trim() !== me.firstName || home !== me.homeHood || work !== me.workHood;

  return (
    <>
      <div className="a-fade pb-16">
        <NavBar
          left={
            <Link href="/app/pass" aria-label="Back to My pass" className="iconbtn">
              <IBack />
            </Link>
          }
          title={A.title}
        />
        <form
          className="m mt-2 space-y-5"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return setErr("Add your first name.");
            setBusy(true);
            const r = await auth.updateProfile({ firstName: name.trim(), homeHood: home, workHood: work });
            setBusy(false);
            if (!r.ok) return setErr(r.message);
            haptic("success");
            setSaved(true);
          }}
        >
          <div>
            <p className="group-label">Email</p>
            <p className="group px-4 py-3 text-[17px]" data-testid="account-email">
              {me.email}
            </p>
          </div>
          <Field label="First name" value={name} onChange={(v) => { setName(v); setSaved(false); setErr(null); }} autoComplete="given-name" maxLength={40} />
          <Select label="Home neighbourhood" value={home} onChange={(v) => { setHome(v); setSaved(false); }} options={GTA_AREAS} />
          <Select label="Work neighbourhood" value={work} onChange={(v) => { setWork(v); setSaved(false); }} options={GTA_AREAS} />
          <FormError>{err}</FormError>
          <Submit busy={busy} busyText="Saving" disabled={!changed}>
            Save changes
          </Submit>
          <p className="t-foot text-center" role="status">
            {saved ? A.saved : ""}
          </p>
        </form>

        <div className="m mt-4 space-y-2.5">
          <button
            type="button"
            className="btn secondary press"
            onClick={async () => {
              markLeaving();
              await auth.signOut("member");
              router.replace("/app");
            }}
          >
            {A.signOut}
          </button>
          <button type="button" className="btn press" style={{ background: "transparent", color: "var(--warn)" }} onClick={() => setAsking(true)}>
            {A.delete}
          </button>
        </div>
      </div>
      {asking && (
        <Sheet title={A.deleteTitle} onClose={() => setAsking(false)} close={null} id="delete">
          <div className="m pb-2 pt-2">
            <p className="t-sub text-[16px] leading-[1.45]">{A.deleteLine}</p>
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                className="btn danger press"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  markLeaving();
                  const r = await auth.deleteAccount();
                  setBusy(false);
                  if (r.ok) router.replace("/app");
                  else setErr(r.message);
                }}
              >
                {A.deleteYes}
              </button>
              <button type="button" className="btn secondary press" onClick={() => setAsking(false)}>
                {A.deleteNo}
              </button>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}
