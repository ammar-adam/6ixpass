"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { InviteBox } from "./InviteBox";
import { waitlist } from "@/content/site";

export function InvitePage() {
  const code = useSearchParams().get("c")?.trim().toLowerCase() ?? "";
  if (!/^[a-z0-9]{8}$/.test(code))
    return (
      <div className="mt-6">
        <p className="text-[17px] text-ink/80">{waitlist.invite.pageMissing}</p>
        <Link href="/#join" className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-accent px-6 font-semibold text-white hover:bg-accent-2">
          {waitlist.invite.getYours}
        </Link>
      </div>
    );
  return <InviteBox code={code} />;
}
