"use client";

import { useSearchParams } from "next/navigation";
import { InviteBox } from "./InviteBox";
import { waitlist } from "@/content/site";

export function InvitePage() {
  const code = useSearchParams().get("c")?.trim().toLowerCase() ?? "";
  if (!/^[a-z0-9]{8}$/.test(code)) return <p className="mt-6 text-[17px] text-ink/80">{waitlist.invite.pageMissing}</p>;
  return <InviteBox code={code} />;
}
