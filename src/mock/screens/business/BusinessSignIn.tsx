"use client";

/*
 * /app/business: "The 6 Pass for Business". Owners and staff sign in here,
 * separately from the member app. Signed in already: straight to work
 * (owners to the dashboard, staff to the scanner).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { appCopy } from "@/content/app";
import { DEMO_OWNER, DEMO_PASSWORD, DEMO_STAFF, onDemoAccounts, useAuth } from "@/lib/auth";
import { nextPath } from "../../Guard";
import { IBack, IChev } from "../../icons";
import { NavBar } from "../../ui";
import { SignInForm } from "../account/SignInForm";
import { BusinessMark } from "./common";

const B = appCopy.business;

export function landingFor(p: NonNullable<ReturnType<typeof useAuth>["partner"]>) {
  if (!p.placeId) return "/app/business/places";
  const role = p.businesses.find((b) => b.placeIds.includes(p.placeId!))?.role;
  return role === "owner" ? "/app/owner" : "/app/business/scan";
}

export function BusinessSignIn() {
  const a = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!a.ready || !a.partner) return;
    const dest = landingFor(a.partner);
    router.replace(dest === "/app/business/places" ? `${dest}?next=${encodeURIComponent(nextPath(""))}` : nextPath(dest));
  }, [a.ready, a.partner, router]);

  return (
    <div className="a-fade pb-12">
      <NavBar
        left={
          <Link href="/app" aria-label={B.memberApp} className="iconbtn">
            <IBack />
          </Link>
        }
      />
      <header className="m pt-1">
        <BusinessMark size={22} />
        <h1 className="t-large mt-4">{B.title}</h1>
        <p className="t-sub mt-1.5 text-[17px]">{B.sub}</p>
      </header>
      <div className="m mt-6">
        <SignInForm
          side="partner"
          onDone={() => {}}
          demoText={appCopy.demoNote.partner}
          demoFill={[
            { email: DEMO_OWNER, password: DEMO_PASSWORD },
            { email: DEMO_STAFF, password: DEMO_PASSWORD },
          ]}
        />
      </div>
      <div className="m mt-6">
        <div className="group">
          {onDemoAccounts() && (
            <Link href="/app/business/new" className="row press">
              <span>{B.newLink}</span>
              <IChev className="chev" />
            </Link>
          )}
          <Link href="/app/business/join" className="row press">
            <span>{B.join}</span>
            <IChev className="chev" />
          </Link>
        </div>
        <p className="group-foot">{B.notPartner}</p>
      </div>
    </div>
  );
}
