"use client";

/*
 * Route guards. Member screens need a member session; business screens need
 * a business session (and, for some, the Owner role). Signed-out visitors go
 * to the right sign-in with ?next= so they land back where they were.
 * Nothing renders until the session is known, so a guarded screen never
 * flashes.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuth, type Role } from "@/lib/auth";
import { useLiveSettings } from "./live";
import { NavBar } from "./ui";
import { IStore } from "./icons";

/** Where to go after signing in: only paths inside the app. */
export function nextPath(fallback: string) {
  if (typeof window === "undefined") return fallback;
  const n = new URLSearchParams(window.location.search).get("next");
  return n && /^\/app(\/|$)/.test(n) && !n.startsWith("//") ? n : fallback;
}

/** Sign out and delete account go to the landing screen themselves; the guards shouldn't send them to sign in. */
let leavingUntil = 0;
export function markLeaving() {
  leavingUntil = Date.now() + 1500;
}
const leaving = () => Date.now() < leavingUntil;

const here = (path: string) => (typeof window === "undefined" ? path : `${path}${window.location.search}`);

function Blank() {
  return <div className="min-h-full" aria-busy="true" data-testid="guard-wait" />;
}

export function RequireMember({ children, allowSetup = false }: { children: React.ReactNode; allowSetup?: boolean }) {
  const a = useAuth();
  const router = useRouter();
  const path = usePathname() || "/app";
  const need = a.ready && !a.member ? "sign-in" : a.ready && a.member && !a.member.onboarded && !allowSetup ? "setup" : null;
  useEffect(() => {
    if (leaving()) return;
    if (need === "sign-in") router.replace(`/app/account/sign-in?next=${encodeURIComponent(here(path))}`);
    if (need === "setup") router.replace(`/app/account/setup?next=${encodeURIComponent(here(path))}`);
  }, [need, router, path]);
  if (!a.ready || need) return <Blank />;
  return <>{children}</>;
}

/** The role this business login has at the place it's working at. */
export function usePartnerRole(): Role | null {
  const p = useAuth().partner;
  if (!p?.placeId) return null;
  return p.businesses.find((b) => b.placeIds.includes(p.placeId!))?.role ?? null;
}

export function RequirePartner({ children, role, allowLiveStaff = false, needPlace = true }: { children: React.ReactNode; role?: Role; allowLiveStaff?: boolean; needPlace?: boolean }) {
  const a = useAuth();
  const live = useLiveSettings();
  const router = useRouter();
  const path = usePathname() || "/app";
  const myRole = usePartnerRole();
  const liveOk = allowLiveStaff && live?.role === "staff";
  const need = liveOk || !a.ready ? null : !a.partner ? "sign-in" : needPlace && !a.partner.placeId ? "place" : null;
  useEffect(() => {
    if (leaving()) return;
    if (need === "sign-in") router.replace(`/app/business?next=${encodeURIComponent(here(path))}`);
    if (need === "place") router.replace(`/app/business/places?next=${encodeURIComponent(here(path))}`);
  }, [need, router, path]);
  if (liveOk) return <>{children}</>;
  if (!a.ready || need) return <Blank />;
  if (role === "owner" && myRole !== "owner") return <NotOwner />;
  return <>{children}</>;
}

function NotOwner() {
  return (
    <div className="a-fade pb-28" data-testid="not-owner">
      <NavBar title="Owners only" />
      <div className="m pt-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full" style={{ background: "var(--fill)" }}>
          <IStore size={30} />
        </span>
        <h1 className="t-title mt-5">Only owners can change the offer</h1>
        <p className="t-sub mx-auto mt-2 max-w-[30ch]">Your login is for staff: you can scan codes and see today&apos;s visits.</p>
        <Link href="/app/business/scan" className="btn press mt-7">
          Go to Scan
        </Link>
      </div>
    </div>
  );
}

const noop = () => () => {};
/** A query parameter, read after hydration (the static HTML has none). */
export function useQueryParam(name: string) {
  return useSyncExternalStore(noop, () => new URLSearchParams(window.location.search).get(name), () => null);
}
