"use client";

import Link from "next/link";
import { copy, PARTNERS } from "@/demo/data";
import { REAL_PLACES } from "@/demo/places-active";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth, useAuth } from "@/lib/auth";
import { markLeaving } from "../Guard";
import { isLive, place, useMock } from "../store";
import { IChev, IMail } from "../icons";
import { NavBar, Photo, replaceSaved, splitCode, useNow, useSaved, Wordmark } from "../ui";
import { placeHref, redeemHref } from "../links";

/*
 * Visits from the member's first week, so the pass reads like one that's
 * been used. Dates fit each place's days (the demo's today is Tuesday,
 * March 23, 2027). They're shown, not stored, so New meeting never touches them.
 */
const PAST = [
  { partnerId: "hearth", date: "Mon, Mar 22", offer: "A free upgrade on your massage.", saving: 60 },
  { partnerId: "half-past-nine", date: "Fri, Mar 19", offer: "Second brunch plate, on us.", saving: 18 },
  { partnerId: "kaito", date: "Thu, Mar 18", offer: "Second bowl, on us.", saving: 19 },
  { partnerId: "fennel-ash", date: "Wed, Mar 17", offer: "Second pasta, on us.", saving: 24 },
];

const SITE = "https://the6pass.ca";

const day = (t: number) => {
  const d = new Date(t);
  const today = new Date();
  return d.toDateString() === today.toDateString() ? "Today" : d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
};

export function PassScreen() {
  const s = useMock();
  const saved = useSaved();
  const me = useAuth().member!;
  const router = useRouter();
  const now = useNow();
  useEffect(() => {
    void auth.refresh("member");
    void auth.loadSaved().then((list) => list && replaceSaved(list));
  }, []);
  const confirmed = s.redemptions.filter((r) => r.status === "confirmed" && !r.remote && r.memberId === me.userId);
  const liveCode = now ? [...s.redemptions].reverse().find((r) => !r.remote && r.memberId === me.userId && isLive(r, now)) : undefined;
  // The seeded demo member has a first week of visits, so the pass reads like one that's been used.
  const past = me.userId === "u-alex" ? PAST : [];
  const visits = [
    ...[...confirmed].sort((a, b) => (b.confirmedAt ?? 0) - (a.confirmedAt ?? 0)).map((r) => ({ key: r.id, partnerId: r.partnerId, date: day(r.confirmedAt ?? r.issuedAt), offer: r.offer, saving: r.saving })),
    // With real places (the private build), the same four dates at the first four places on the list.
    ...past.map((v, i) => {
      const alt = PARTNERS[i];
      return place(s, v.partnerId) || !alt ? { key: `${v.partnerId}-${v.date}`, ...v } : { key: `${alt.id}-${v.date}`, partnerId: alt.id, date: v.date, offer: alt.offer, saving: alt.saving };
    }),
  ].filter((v) => place(s, v.partnerId));
  const total = visits.reduce((sum, v) => sum + v.saving, 0);
  const savedPlaces = saved.map((id) => place(s, id)).filter((p) => !!p);

  return (
    <div className="a-fade pb-28">
      <NavBar />
      <header className="m pt-2">
        <h1 className="t-large">{copy.pass.title}</h1>
      </header>

      {/* The membership card, like a card in Wallet. */}
      <div className="m mt-4">
        <div className="pass aspect-[1.586] p-5" data-testid="member-card">
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 100% 0%, rgba(244,241,236,0.10), transparent 60%)" }} />
          <div className="relative flex items-center justify-between">
            <Wordmark size={22} light />
            <span className="eyebrow" style={{ color: "var(--passSec)" }}>Founding member</span>
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[10px]" style={{ color: "var(--passSec)" }}>Name</p>
              <p className="mt-0.5 text-[19px] font-semibold" data-testid="card-name">{me.firstName || "Member"}</p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-[10px]" style={{ color: "var(--passSec)" }}>No. {me.pass.number}</p>
              <p className="mt-0.5 text-[13px]" style={{ color: "var(--passSec)" }}>{me.pass.since ? `Member since ${me.pass.since}` : copy.pass.holder}</p>
            </div>
          </div>
        </div>
      </div>

      {me.pass.status !== "active" && (
        <p className="m mt-3 t-foot" data-testid="pass-pending">Your pass isn&apos;t active yet. We&apos;ll email you when it is.</p>
      )}

      {liveCode && (
        <div className="m mt-4">
          <Link href={redeemHref(liveCode.partnerId)} className="group row press" data-testid="live-code">
            <span className="min-w-0">
              <span className="eyebrow accent block">Code on screen</span>
              <span className="block truncate text-[16px] font-semibold">
                {place(s, liveCode.partnerId)?.name} · <span className="tnum">{splitCode(liveCode.code)}</span>
              </span>
            </span>
            <IChev className="chev" />
          </Link>
        </div>
      )}

      <div className="m mt-4">
        <div className="group grid grid-cols-2">
          <div className="px-5 py-4">
            <p className="eyebrow">{copy.pass.saved}</p>
            <p className="tnum mt-1 text-[34px] font-bold leading-none tracking-[-0.03em]" data-testid="saved">${total}</p>
          </div>
          <div className="px-5 py-4" style={{ borderLeft: "0.5px solid var(--line)" }}>
            <p className="eyebrow">{copy.pass.used}</p>
            <p className="tnum mt-1 text-[34px] font-bold leading-none tracking-[-0.03em]" data-testid="visits">{visits.length}</p>
          </div>
        </div>
        <p className="group-foot">Savings are estimates, based on the menu price of the free item.</p>
      </div>

      <div className="section-h">
        <h2 className="t-title">{copy.pass.history}</h2>
      </div>
      <div className="m mt-3">
        {visits.length === 0 && <p className="group t-sub p-4">{copy.pass.none}</p>}
        <ul className="group" data-testid="history" hidden={visits.length === 0}>
          {visits.map((v) => {
            const p = place(s, v.partnerId)!;
            return (
              <li key={v.key}>
                <Link href={placeHref(p.id)} className="row inset press">
                  <span className="flex min-w-0 items-center gap-3">
                    <Photo p={p} className="thumb" />
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] font-semibold">{p.name}</span>
                      <span className="t-foot block truncate">
                        {v.date} · {v.offer.replace(/\.$/, "")}
                      </span>
                    </span>
                  </span>
                  <span className="v tnum text-[15px]">{v.saving > 0 ? `$${v.saving}` : "Redeemed"}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {savedPlaces.length > 0 && (
        <>
          <div className="section-h">
            <h2 className="t-title">Saved</h2>
            <span className="t-sub">{savedPlaces.length}</span>
          </div>
          <div className="m mt-3">
            <ul className="group" data-testid="saved-places">
              {savedPlaces.map((p) => (
                <li key={p.id}>
                  <Link href={placeHref(p.id)} className="row inset press">
                    <span className="flex min-w-0 items-center gap-3">
                      <Photo p={p} className="thumb" />
                      <span className="min-w-0">
                        <span className="block truncate text-[16px] font-semibold">{p.name}</span>
                        <span className="t-foot block truncate">
                          {p.neighbourhood} · {p.settings.offer.replace(/\.$/, "")}
                        </span>
                      </span>
                    </span>
                    <IChev className="chev" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="section-h">
        <h2 className="t-title">Account</h2>
      </div>
      <div className="m mt-3">
        <div className="group">
          <Link href="/app/account" className="row press">
            <span className="min-w-0">
              <span className="block truncate">{me.firstName || "Your profile"}</span>
              <span className="t-foot block truncate">{me.email}</span>
            </span>
            <IChev className="chev" />
          </Link>
          <div className="row">
            <span>Home neighbourhood</span>
            <span className="v">{me.homeHood || "Not set"}</span>
          </div>
          <div className="row">
            <span>Membership</span>
            <span className="v">{me.pass.renews ? `Renews ${me.pass.renews}` : "Pending"}</span>
          </div>
          <div className="row">
            <span>Notifications</span>
            <span className="v">{me.notify ? "New places, weekly" : "Off"}</span>
          </div>
        </div>
        <div className="group mt-4">
          <a href="mailto:hello@the6pass.ca" className="row press">
            <span className="flex items-center gap-2">
              <IMail size={18} />
              Help and contact
            </span>
            <IChev className="chev" />
          </a>
          <a href={`${SITE}/terms`} target="_blank" rel="noopener noreferrer" className="row press">
            <span>Terms</span>
            <IChev className="chev" />
          </a>
          <a href={`${SITE}/privacy`} target="_blank" rel="noopener noreferrer" className="row press">
            <span>Privacy</span>
            <IChev className="chev" />
          </a>
        </div>
        <div className="group mt-4">
          <button
            type="button"
            className="row press"
            onClick={async () => {
              markLeaving();
              await auth.signOut("member");
              router.replace("/app");
            }}
          >
            <span style={{ color: "var(--warn)" }}>Sign out</span>
          </button>
        </div>
      </div>
      <p className="m t-foot mt-6 text-center">{REAL_PLACES ? "Private preview. Real places shown for illustration; none have signed. Offers are examples." : "Preview. Places, menus and prices are examples."}</p>
    </div>
  );
}
