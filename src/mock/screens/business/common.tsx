"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, useAuth } from "@/lib/auth";
import { markLeaving, usePartnerRole } from "../../Guard";
import { place, useMock } from "../../store";
import { Wordmark } from "../../ui";

/** "the 6 pass for Business": the business side's own mark. */
export function BusinessMark({ size = 20 }: { size?: number }) {
  return (
    <span className="inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
      <Wordmark size={size} />
      <span className="eyebrow accent" style={{ fontSize: Math.max(11, size * 0.55) }}>
        for Business
      </span>
    </span>
  );
}

/** The place this business login is working at. */
export function usePartnerPlace() {
  const s = useMock();
  const p = useAuth().partner;
  return p?.placeId ? place(s, p.placeId) : undefined;
}

/** Signed in as, switch place, sign out. At the bottom of the business screens. */
export function PartnerFooter() {
  const a = useAuth();
  const router = useRouter();
  const role = usePartnerRole();
  const p = a.partner;
  if (!p || p.demo) return null;
  const many = p.businesses.flatMap((b) => b.placeIds).length > 1;
  return (
    <div className="m mt-8">
      <div className="group">
        <div className="row">
          <span className="min-w-0">
            <span className="block truncate">{p.email}</span>
            <span className="t-foot block" data-testid="partner-role">
              {role === "owner" ? "Owner" : "Staff"} · {p.businesses.map((b) => b.businessName).join(", ")}
            </span>
          </span>
        </div>
        {many && (
          <Link href="/app/business/places" className="row press">
            <span>Switch place</span>
          </Link>
        )}
        <button
          type="button"
          className="row press"
          onClick={async () => {
            markLeaving();
            await auth.signOut("partner");
            router.replace("/app/business");
          }}
        >
          <span style={{ color: "var(--warn)" }}>Sign out</span>
        </button>
      </div>
    </div>
  );
}
