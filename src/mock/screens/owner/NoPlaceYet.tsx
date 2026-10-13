import Link from "next/link";
import { NavBar } from "../../ui";

/** Shown at /app/place/your-place before anyone has set up a place, instead of a blank screen. */
export function NoPlaceYet() {
  return (
    <div className="a-fade">
      <NavBar />
      <div className="m pt-6">
        <h1 className="t-large">No place yet</h1>
        <p className="t-sub mt-2 text-[17px]">Set one up in about a minute, then come back here.</p>
        <Link href="/partners-demo" className="btn press mt-6">
          Set up a place
        </Link>
      </div>
    </div>
  );
}
