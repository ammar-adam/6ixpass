import type { Metadata } from "next";
import { Suspense } from "react";
import { waitlist } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { InvitePage } from "@/components/InvitePage";

export const metadata: Metadata = {
  title: waitlist.invite.pageTitle,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

// /invite?c=CODE: the link in the welcome email, to check invites and share.
export default function Invite() {
  return (
    <>
      <SiteHeader popup={false} />
      <main id="main" className="hero-glow">
        <div className="wrap max-w-[640px] py-16 md:py-24">
          <h1 className="font-serif text-[clamp(44px,6vw,72px)] font-normal leading-none">{waitlist.invite.pageTitle}</h1>
          <Suspense>
            <InvitePage />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
