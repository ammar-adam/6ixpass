"use client";

/*
 * The first screen for someone who isn't signed in: one photo, one line,
 * Create account and Sign in, and a quieter way in for businesses.
 * Holding the logo opens Nida's tools, as on Explore.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { appCopy } from "@/content/app";
import { haptic, Wordmark } from "../../ui";

const L = appCopy.landing;

export function Landing({ onBrowse }: { onBrowse: () => void }) {
  const router = useRouter();
  const timer = useRef<number | null>(null);
  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  return (
    <div className="a-fade relative flex min-h-full flex-col" data-testid="landing">
      <div className="relative h-[50dvh] min-h-[300px] shrink-0 md:h-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
        <img src={`${L.image}-1200.webp`} alt="" decoding="async" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
        <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 32%, rgba(250,248,245,0) 62%, var(--bg) 100%)" }} />
        <button
          type="button"
          className="absolute left-3 flex h-11 items-center px-2"
          style={{ top: "calc(var(--top) + 6px)" }}
          aria-label="The 6 Pass. Hold for partner tools."
          data-testid="logo"
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={() => {
            stop();
            timer.current = window.setTimeout(() => {
              haptic("medium");
              router.push("/partners-demo");
            }, 800);
          }}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
        >
          <Wordmark size={24} light />
        </button>
      </div>
      <div className="m relative z-10 -mt-4 flex flex-1 flex-col" style={{ paddingBottom: "calc(var(--bottom) + 20px)" }}>
        <h1 className="t-large text-[30px] leading-[1.12]">{L.line}</h1>
        <p className="t-sub mt-3 text-[17px]">{L.sub}</p>
        <div className="mt-auto space-y-2.5 pt-8">
          <Link href="/app/account/sign-up" className="btn press">
            {L.create}
          </Link>
          <Link href="/app/account/sign-in" className="btn secondary press">
            {L.signIn}
          </Link>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={onBrowse} className="navtext -ml-2 text-[15px]" style={{ color: "var(--sec)" }}>
              {L.browse}
            </button>
            <Link href="/app/business" className="navtext -mr-2 text-[15px] font-semibold">
              {L.business}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
