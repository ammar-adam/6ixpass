"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { appCopy } from "@/content/app";
import { DEMO_MEMBER, DEMO_PASSWORD, useAuth } from "@/lib/auth";
import { nextPath } from "../../Guard";
import { IBack } from "../../icons";
import { NavBar } from "../../ui";
import { SignInForm } from "./SignInForm";

const S = appCopy.signIn;

export function SignIn() {
  const router = useRouter();
  const a = useAuth();
  // Already signed in (another window, or Back): go on.
  useEffect(() => {
    if (a.ready && a.member) router.replace(a.member.onboarded ? nextPath("/app") : `/app/account/setup?next=${encodeURIComponent(nextPath("/app"))}`);
  }, [a.ready, a.member, router]);
  return (
    <div className="a-fade pb-12">
      <NavBar
        left={
          <Link href="/app" aria-label="Back" className="iconbtn">
            <IBack />
          </Link>
        }
      />
      <header className="m pt-1">
        <h1 className="t-large">{S.title}</h1>
        <p className="t-sub mt-1.5 text-[17px]">{S.sub}</p>
      </header>
      <div className="m mt-6">
        <SignInForm side="member" onDone={() => {}} demoText={appCopy.demoNote.member} demoFill={[{ email: DEMO_MEMBER, password: DEMO_PASSWORD }]} />
      </div>
      <p className="m t-sub mt-8 text-center">
        {S.noAccount}{" "}
        <Link href="/app/account/sign-up" className="link inline-flex min-h-[44px] items-center">
          {S.create}
        </Link>
      </p>
      <p className="m text-center">
        <Link href="/app/business" className="navtext text-[15px]" style={{ color: "var(--sec)" }}>
          {appCopy.landing.business}
        </Link>
      </p>
    </div>
  );
}
