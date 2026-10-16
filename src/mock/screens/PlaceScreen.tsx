"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { NoPlaceYet } from "./owner/NoPlaceYet";
import { DEMO_DATE, blockFor, isLive, mock, place, usesLeft, useMock, type Block, type MockState, type Place } from "../store";
import { daysText } from "../owner";
import { IBack, IHeart, IShare } from "../icons";
import { DayStrip, Guide, nextDay, Photo, UseDots, useEscape, useNow } from "../ui";

export const kindLabel = (p: Place) => (p.settings.kind === "two_for_one" ? "Two for one" : "Free upgrade");

const statusLine = (block: Block, p: Place) =>
  !block
    ? "Runs today"
    : block.reason === "paused"
      ? "Paused"
      : block.reason === "not-today"
        ? `Next: ${nextDay(p.settings.days)}`
        : block.reason === "blackout"
          ? "Blackout today"
          : "Used for the year";

/** The place page itself. The redeem sheet slides up over it. */
export function PlaceBody({ s, p, block, guide }: { s: MockState; p: Place; block: Block; guide?: React.ReactNode }) {
  const left = usesLeft(s, p);
  const total = p.settings.usesPerYear;
  return (
    <>
      <div className="relative h-[360px]">
        <Photo p={p} size={1200} priority className="absolute inset-0 size-full" />
        <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 32%)" }} />
        <div className="absolute inset-x-0 top-0 flex justify-between px-4" style={{ paddingTop: "calc(var(--top) + 4px)" }}>
          <Link href="/app" aria-label="Back" className="glass press">
            <IBack />
          </Link>
          <div className="flex gap-2">
            <button type="button" aria-label="Share" className="glass press">
              <IShare size={20} />
            </button>
            <button type="button" aria-label="Save" className="glass press">
              <IHeart size={20} />
            </button>
          </div>
        </div>
        {p.credit && <p className="absolute bottom-2 right-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{p.credit}</p>}
      </div>

      <div className="m pt-5">
        {p.founding && <span className="seal soft">Founding Partner</span>}
        <h1 className="display mt-3 break-words text-[40px]">{p.name}</h1>
        <p className="t-sub mt-2">
          {p.kind} · {p.neighbourhood} · <span style={{ color: block ? undefined : "var(--ok)", fontWeight: block ? 400 : 600 }}>{statusLine(block, p)}</span>
        </p>
        {p.blurb && <p className="mt-3 text-[16px] leading-[1.45]" style={{ color: "var(--sec)" }}>{p.blurb}</p>}
        {guide && <Guide className="mt-3">{guide}</Guide>}
      </div>

      <section className="m mt-6" aria-labelledby="offer-h">
        <div className="card p-5">
          <p className="eyebrow accent">{kindLabel(p)}</p>
          <h2 id="offer-h" className="mt-1.5 text-[24px] font-semibold leading-tight tracking-[-0.02em]">
            {p.settings.offer}
          </h2>
          {p.settings.detail && <p className="t-sub mt-1">{p.settings.detail}</p>}
          <div className="hair my-4" />
          <DayStrip days={p.settings.days} />
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="t-sub">{daysText(p.settings.days)}</span>
            <span className="t-sub flex items-center gap-2" data-testid="uses-left">
              <UseDots left={left} total={total} />
              {left} of {total} left this year
            </span>
          </div>
          {p.settings.blackoutDates.length > 0 && (
            <p className="t-foot mt-3">
              Not on {p.settings.blackoutDates.map((d) => (d === DEMO_DATE ? "today" : new Date(`${d}T12:00:00`).toLocaleDateString("en-CA", { month: "short", day: "numeric" }))).join(", ")}
            </p>
          )}
        </div>
      </section>

      <div className="m mt-4">
        <div className="group">
          {p.dish && (
            <div className="row">
              <span>Known for</span>
              <span className="v">{p.dish}</span>
            </div>
          )}
          <div className="row">
            <span>Where</span>
            <span className="v">In person only</span>
          </div>
          <div className="row">
            <span>Applies to</span>
            <span className="v">Food and non-alcoholic</span>
          </div>
          <div className="row">
            <span>Show your code</span>
            <span className="v">Before the bill</span>
          </div>
        </div>
      </div>
      <div className="h-[132px]" />
    </>
  );
}

export function PlaceScreen({ slug }: { slug: string }) {
  const s = useMock();
  const router = useRouter();
  const now = useNow();
  const goBack = useCallback(() => router.push("/app"), [router]);
  useEscape(goBack);

  const p = place(s, slug);
  if (!p) return <NoPlaceYet />;
  const block = blockFor(s, p, nextDay(p.settings.days));
  const live = now > 0 && s.redemptions.some((r) => r.partnerId === p.id && isLive(r, now));

  function redeem() {
    if (!p || block) return;
    mock.issue(p.id);
    router.push(`/app/redeem/${p.id}`);
  }

  const guide = p.isOwner ? (block?.reason === "paused" ? "Paused. Members can't redeem until you switch it back on." : live ? "Tap Show my code to see it again." : "Now tap Redeem, as your guest would.") : null;

  return (
    <>
      <div className="a-push">
        <PlaceBody s={s} p={p} block={block} guide={guide} />
      </div>
      <div className="bottom-bar blur-bar">
        {block?.reason === "paused" ? (
          <>
            <p role="status" className="t-foot mb-2 text-center font-semibold" style={{ color: "var(--accent)" }}>
              {block.message}
            </p>
            <button type="button" disabled className="btn">
              Redeem
            </button>
          </>
        ) : block ? (
          <p role="status" className="t-sub py-3 text-center">
            {block.message}
          </p>
        ) : (
          <button type="button" onClick={redeem} className="btn press">
            {live ? "Show my code" : "Redeem"}
          </button>
        )}
      </div>
    </>
  );
}
