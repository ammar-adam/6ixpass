"use client";

/*
 * /app/place/view?id=<id> and /app/redeem/view?id=<id>: the place and Redeem
 * screens for places that exist only in the database (src/mock/links.ts).
 * The static export can't make a page per database place, so this one page
 * reads the id in the browser.
 */
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { appCopy } from "@/content/app";
import { onDemoAccounts } from "@/lib/auth";
import { RequireMember } from "../Guard";
import { place, useMock } from "../store";
import { NavBar } from "../ui";
import { PlaceScreen } from "./PlaceScreen";
import { RedeemScreen } from "./RedeemScreen";

const Wait = () => <div className="min-h-full" aria-busy="true" data-testid="place-wait" />;

function ById({ screen }: { screen: "place" | "redeem" }) {
  const id = useSearchParams().get("id") ?? "";
  const s = useMock();
  if (!place(s, id)) {
    // The database's places arrive a moment after the page opens; wait for the first load.
    if (!s.serverPlacesAt && !onDemoAccounts()) return <Wait />;
    return (
      <div className="a-fade">
        <NavBar />
        <div className="m pt-6" data-testid="place-missing">
          <h1 className="t-large">{appCopy.business.placeMissingTitle}</h1>
          <p className="t-sub mt-2 text-[17px]">{appCopy.business.placeMissingLine}</p>
          <Link href="/app" className="btn press mt-6">
            {appCopy.business.placeMissingBack}
          </Link>
        </div>
      </div>
    );
  }
  if (screen === "place") return <PlaceScreen key={id} slug={id} />;
  return (
    <RequireMember>
      <RedeemScreen key={id} slug={id} />
    </RequireMember>
  );
}

export function ViewById({ screen }: { screen: "place" | "redeem" }) {
  return (
    <Suspense fallback={<Wait />}>
      <ById screen={screen} />
    </Suspense>
  );
}
