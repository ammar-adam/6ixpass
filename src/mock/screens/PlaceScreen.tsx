"use client";

import { auth, useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { NoPlaceYet } from "./owner/NoPlaceYet";
import { DEMO_DATE, blockFor, isLive, latestFor, place, usesLeft, useMock, type Block, type MockState, type Place } from "../store";
import { daysText } from "../owner";
import { hoursStatus, priceLevel, weekLines } from "../hours";
import { IBack, IChev, IHeart, IShare } from "../icons";
import { DayStrip, Guide, haptic, nextDay, Photo, toggleSaved, UseDots, useEscape, useNow, useSaved } from "../ui";

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
        <Gallery p={p} />
        <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 32%)" }} />
        <div className="absolute inset-x-0 top-0 flex justify-between px-4" style={{ paddingTop: "calc(var(--top) + 4px)" }}>
          <Link href="/app" aria-label="Back" className="glass press">
            <IBack />
          </Link>
          <div className="flex gap-2">
            <button type="button" aria-label="Share" className="glass press" onClick={() => share(p)}>
              <IShare size={20} />
            </button>
            <SaveButton id={p.id} />
          </div>
        </div>
        {p.credit && <p className="absolute bottom-2 left-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{p.credit}</p>}
      </div>

      <div className="m pt-5">
        {p.founding && <span className="seal soft">Founding Partner</span>}
        <h1 className="display mt-3 break-words text-[40px]">{p.name}</h1>
        <p className="t-sub mt-2">
          {p.kind} · {p.neighbourhood}
          {p.details?.price && ` · ${priceLevel(p.details.price)}`} · <span style={{ color: block ? undefined : "var(--ok)", fontWeight: block ? 400 : 600 }}>{statusLine(block, p)}</span>
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

      {p.details && <Details d={p.details} />}

      <div className="m mt-4">
        {p.details && <h2 className="group-label mt-4">How it works</h2>}
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
  const a = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const p = place(s, slug);
  if (!p) return <NoPlaceYet />;
  const block = blockFor(s, p, nextDay(p.settings.days));
  const mine = latestFor(s, p.id);
  const live = now > 0 && !!mine && isLive(mine, now);

  async function redeem() {
    if (!p || block) return;
    if (!a.member) return router.push(`/app/account/sign-in?next=${encodeURIComponent(`/app/place/${p.id}`)}`);
    haptic("medium");
    if (!live) {
      setBusy(true);
      setErr(null);
      const r = await auth.issue(p.id);
      setBusy(false);
      if (!r.ok) return setErr(r.message);
    }
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
          <>
            {err && (
              <p role="alert" className="note mb-2">
                {err}
              </p>
            )}
            <button type="button" onClick={redeem} className="btn press" disabled={busy} aria-busy={busy || undefined}>
              {a.ready && !a.member ? "Sign in to redeem" : live ? "Show my code" : "Redeem"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

/** Swipe through the place's photos. One photo: just the photo. */
function Gallery({ p }: { p: Place }) {
  const shots = [p.image, ...(p.details?.gallery ?? [])];
  const [i, setI] = useState(0);
  if (shots.length < 2 || !p.image) return <Photo p={p} size={1200} priority className="absolute inset-0 size-full" />;
  return (
    <>
      <div
        className="no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto"
        role="group"
        aria-label={`Photos of ${p.name}`}
        data-testid="gallery"
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {shots.map((img, n) => (
          <Photo key={img} p={{ ...p, image: img }} size={1200} priority={n === 0} className="size-full flex-none snap-center" />
        ))}
      </div>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-semibold text-white tnum" aria-hidden="true">
        {i + 1} / {shots.length}
      </span>
    </>
  );
}

function share(p: Place) {
  haptic("light");
  const text = `${p.name}, ${p.neighbourhood}. ${p.settings.offer} With The 6 Pass.`;
  try {
    if (navigator.share) navigator.share({ title: p.name, text }).catch(() => {});
  } catch {
    /* no share sheet here: nothing to do */
  }
}

function SaveButton({ id }: { id: string }) {
  const saved = useSaved().includes(id);
  return (
    <button
      type="button"
      aria-label={saved ? "Saved" : "Save"}
      aria-pressed={saved}
      className="glass press"
      onClick={() => {
        haptic(saved ? "light" : "success");
        toggleSaved(id);
      }}
    >
      <span style={{ color: saved ? "#FF6B5A" : undefined }}>
        <IHeart size={20} filled={saved} />
      </span>
    </button>
  );
}

/** Hours, address, transit, the menu and a note from the owner: whichever the place has. */
function Details({ d }: { d: NonNullable<Place["details"]> }) {
  const now = useNow();
  const [week, setWeek] = useState(false);
  const hours = d.hours;
  const status = now && hours ? hoursStatus(hours, new Date(now).getHours() * 60 + new Date(now).getMinutes()) : null;
  const maps = `https://maps.apple.com/?q=${encodeURIComponent(`${d.address}, Toronto`)}`;
  return (
    <>
      <div className="m mt-4">
        <div className="group" data-testid="details">
          {hours && (
            <button type="button" className="row press" aria-expanded={week} onClick={() => setWeek(!week)}>
              <span>Hours</span>
              <span className="v">
                <span data-testid="hours" style={{ color: status?.open ? "var(--ok)" : undefined, fontWeight: status?.open ? 600 : 400 }}>
                  {status?.text ?? "\u00a0"}
                </span>
                <IChev className={`chev transition-transform ${week ? "rotate-90" : ""}`} />
              </span>
            </button>
          )}
          {hours && week && (
            <ul className="px-4 pb-3" data-testid="week">
              {weekLines(hours).map((w) => (
                <li key={w.day} className="flex justify-between py-1 text-[15px]" style={{ fontWeight: w.today ? 600 : 400, color: w.today ? "var(--text)" : "var(--sec)" }}>
                  <span>{w.day}</span>
                  <span className="tnum">{w.text}</span>
                </li>
              ))}
            </ul>
          )}
          <a href={maps} target="_blank" rel="noopener noreferrer" className="row press">
            <span className="min-w-0">
              <span className="block">{d.address}</span>
              {d.transit && <span className="t-foot block">{d.transit}</span>}
            </span>
            <span className="v shrink-0">
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>Directions</span>
            </span>
          </a>
        </div>
      </div>

      {d.menu && d.menu.length > 0 && (
        <section className="m mt-6" aria-labelledby="menu-h">
          <h2 id="menu-h" className="group-label">
            {d.menuTitle ?? "What to order"}
          </h2>
          <ul className="group" data-testid="menu">
            {d.menu.map((m) => (
              <li key={m.name} className="row">
                <span className="min-w-0 text-[16px]">{m.name}</span>
                <span className="v tnum shrink-0 text-[16px]">${m.price}</span>
              </li>
            ))}
          </ul>
          <p className="group-foot">Prices before tax and tip, and can change.</p>
        </section>
      )}

      {d.note && (
        <figure className="m mt-6" data-testid="note">
          <div className="card p-5">
            <blockquote className="display text-[22px] italic leading-[1.3]">{d.note}</blockquote>
            {d.noteBy && <figcaption className="t-sub mt-3">{d.noteBy}</figcaption>}
          </div>
        </figure>
      )}
    </>
  );
}
