"use client";

/* Pick your place, when a business login has more than one. */
import { useRouter } from "next/navigation";
import { appCopy } from "@/content/app";
import { auth, useAuth } from "@/lib/auth";
import { nextPath } from "../../Guard";
import { IChev } from "../../icons";
import { place, useMock } from "../../store";
import { NavBar, Photo } from "../../ui";
import { BusinessMark, PartnerFooter } from "./common";
import { landingFor } from "./BusinessSignIn";

const B = appCopy.business;

export function Places() {
  const p = useAuth().partner!;
  const s = useMock();
  const router = useRouter();
  return (
    <div className="a-fade pb-16">
      <NavBar left={<span className="pl-3"><BusinessMark /></span>} />
      <header className="m pt-1">
        <h1 className="t-large">{B.pickTitle}</h1>
        <p className="t-sub mt-1.5">{B.pickLine}</p>
      </header>
      {p.businesses.map((b) => (
        <section key={b.businessId} className="mt-6" aria-label={b.businessName}>
          <p className="m group-label">
            {b.businessName} · {b.role === "owner" ? "Owner" : "Staff"}
          </p>
          <ul className="m">
            <li className="group">
              {b.placeIds.map((id) => {
                const pl = place(s, id);
                if (!pl) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    className="row inset press"
                    data-testid="pick-place"
                    onClick={async () => {
                      await auth.choosePlace(id);
                      const dest = landingFor({ ...p, placeId: id });
                      router.replace(nextPath(dest));
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Photo p={pl} className="thumb" />
                      <span className="min-w-0">
                        <span className="display block truncate text-[22px]">{pl.name}</span>
                        <span className="t-foot block truncate">{pl.neighbourhood}{id === p.placeId ? " · Working here now" : ""}</span>
                      </span>
                    </span>
                    <IChev className="chev" />
                  </button>
                );
              })}
            </li>
          </ul>
        </section>
      ))}
      <PartnerFooter />
    </div>
  );
}
