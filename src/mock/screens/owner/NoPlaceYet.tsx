import Link from "next/link";
import { C, serif } from "../../ui";

/** Shown at /app/place/your-place before anyone has set up a place, instead of a blank screen. */
export function NoPlaceYet() {
  return (
    <div className="m-enter px-5 pt-10">
      <h1 className="text-[30px] leading-tight" style={serif}>No place set up yet.</h1>
      <p className="mt-2" style={{ color: C.muted }}>Set one up in about a minute, then come back here.</p>
      <Link href="/partners-demo" className="m-press mt-6 inline-flex h-12 items-center rounded-[16px] px-6 font-bold" style={{ background: C.ice, color: C.iceInk }}>
        Set up a place
      </Link>
    </div>
  );
}
