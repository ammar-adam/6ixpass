"use client";

/* /app/business/team: owners see who's on the team, invite by email, and remove people. */
import { useCallback, useEffect, useState } from "react";
import { appCopy } from "@/content/app";
import { auth, isEmail, MESSAGES, onDemoAccounts, useAuth, type Role, type StaffEntry } from "@/lib/auth";
import { Field, FormError, Submit } from "../../forms";
import { NavBar } from "../../ui";
import { BusinessMark, PartnerFooter } from "./common";

const T = appCopy.team;

export function Team() {
  const p = useAuth().partner!;
  const biz = p.businesses.find((b) => b.placeIds.includes(p.placeId!)) ?? p.businesses[0];
  const [team, setTeam] = useState<StaffEntry[] | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ email?: string; form?: string }>({});
  const [sent, setSent] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await auth.listTeam(biz.businessId);
    setTeam(r.ok ? r.value : []);
    if (!r.ok) setErr({ form: r.message });
  }, [biz.businessId]);
  useEffect(() => {
    let on = true;
    auth.listTeam(biz.businessId).then((r) => on && setTeam(r.ok ? r.value : []));
    return () => {
      on = false;
    };
  }, [biz.businessId]);

  return (
    <div className="a-fade pb-28">
      <NavBar left={<span className="pl-3"><BusinessMark /></span>} />
      <header className="m pt-1">
        <p className="eyebrow">{biz.businessName}</p>
        <h1 className="t-large mt-1">{T.title}</h1>
        <p className="t-sub mt-1.5">{T.line}</p>
      </header>

      <div className="m mt-6">
        <ul className="group" data-testid="team" aria-busy={!team}>
          {(team ?? []).map((m) => (
            <li key={m.id} className="row">
              <span className="min-w-0">
                <span className="block truncate">
                  {m.email}
                  {m.you ? " (you)" : ""}
                </span>
                <span className="t-foot block">
                  {m.role === "owner" ? "Owner" : "Staff"}
                  {m.status === "invited" ? ` · ${T.pending}` : ""}
                </span>
              </span>
              {!m.you && (
                <button
                  type="button"
                  className="navtext text-[15px]"
                  style={{ color: "var(--warn)" }}
                  aria-label={`${T.remove} ${m.email}`}
                  onClick={async () => {
                    const r = await auth.removeFromTeam(biz.businessId, m);
                    if (!r.ok) setErr({ form: r.message });
                    await load();
                  }}
                >
                  {T.remove}
                </button>
              )}
            </li>
          ))}
          {team && team.length === 0 && <li className="row t-sub">No one yet.</li>}
        </ul>
      </div>

      <section className="m mt-8" aria-labelledby="invite-h">
        <h2 id="invite-h" className="t-title">
          {T.invite}
        </h2>
        <form
          className="mt-4 space-y-5"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isEmail(email)) return setErr({ email: MESSAGES["invalid-email"] });
            setBusy(true);
            setErr({});
            setSent(null);
            const r = await auth.invite(biz.businessId, email, role);
            setBusy(false);
            if (!r.ok) return setErr({ form: r.message });
            setSent(r.value.demo ? T.sentDemo(email.trim().toLowerCase()) : T.sent(email.trim().toLowerCase()));
            setEmail("");
            await load();
          }}
        >
          <Field label={T.email} type="email" value={email} onChange={(v) => { setEmail(v); setErr({}); }} error={err.email} placeholder="name@example.com" autoComplete="off" />
          <div>
            <p className="group-label" id="role-label">
              {T.role}
            </p>
            <div className="segmented" role="group" aria-labelledby="role-label">
              {(["staff", "owner"] as Role[]).map((r) => (
                <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(r)}>
                  {r === "owner" ? "Owner" : "Staff"}
                </button>
              ))}
            </div>
            <p className="group-foot">{role === "owner" ? "Can change the offer, see every visit and manage the team." : "Can scan codes and see today's visits."}</p>
          </div>
          <FormError>{err.form}</FormError>
          <Submit busy={busy} busyText="Sending">
            {T.send}
          </Submit>
          {sent && (
            <p className="group p-4 text-[15px] leading-[1.4]" role="status" data-testid="invite-sent">
              {sent}
            </p>
          )}
          {!sent && onDemoAccounts() && <p className="t-foot">Demo: invites stay on this device. No email is sent.</p>}
        </form>
      </section>
      <PartnerFooter />
    </div>
  );
}
