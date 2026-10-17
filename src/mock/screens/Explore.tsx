"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CATEGORIES, DAY_NAMES, TODAY, type Category } from "@/demo/data";
import { daysText } from "../owner";
import { blockFor, places, useMock, type Block, type Place } from "../store";
import { kindLabel } from "./PlaceScreen";
import { IChev, IClose, ISearch } from "../icons";
import { Guide, haptic, NavBar, nextDay, Photo, Wordmark } from "../ui";

const CAT_LABEL: Record<Category, string> = {
  Dining: "Dining",
  "Spa and wellness": "Spas",
  Studios: "Studios",
  Hotels: "Hotels",
  Experiences: "Experiences",
};

/** Short status for lists: "Tonight", "Next: Thu", "Paused". */
export const statusText = (block: Block, p: Place) =>
  !block
    ? "Today"
    : block.reason === "paused"
      ? "Paused"
      : block.reason === "not-today"
        ? `Next: ${nextDay(p.settings.days).slice(0, 3)}`
        : block.reason === "used-up"
          ? "Used"
          : "Blackout";

/** The big photo card: a member's first look at a place. Also used by the owner's review and the start screen. */
export function PlaceCard({ p, block, priority = false, href = `/app/place/${p.id}`, testId }: { p: Place; block: Block; priority?: boolean; href?: string | null; testId?: string }) {
  const body = (
    <div className="relative h-[300px]">
      <Photo p={p} size={1200} className="absolute inset-0 size-full" priority={priority} />
      <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.66) 100%)" }} />
      <div className="absolute left-3 top-3 flex gap-2">
        <span className="seal light">{p.isOwner ? "New · Founding Partner" : p.founding ? "Founding Partner" : kindLabel(p)}</span>
      </div>
      {block && (
        <span className="seal absolute right-3 top-3" style={{ background: "rgba(20,18,15,0.6)", color: "#fff" }}>
          {statusText(block, p)}
        </span>
      )}
      <div className="absolute inset-x-4 bottom-3.5 text-white">
        <h2 className="display block break-words text-[34px]">{p.name}</h2>
        <p className="mt-1.5 text-[15px] opacity-95">
          {p.settings.offer.replace(/\.$/, "")} · {daysText(p.settings.days)}
        </p>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="card press" data-testid={testId}>
      {body}
    </Link>
  ) : (
    <div className="card" data-testid={testId}>
      {body}
    </div>
  );
}

/** A row in a grouped list: photo, name, offer, status. */
export function PlaceRow({ p, block }: { p: Place; block: Block }) {
  return (
    <Link href={`/app/place/${p.id}`} className="row inset press">
      <span className="flex min-w-0 items-center gap-3">
        <Photo p={p} className="thumb" />
        <span className="min-w-0">
          <span className="block truncate text-[16px] font-semibold">{p.name}</span>
          <span className="t-foot block truncate">
            {p.neighbourhood} · {p.settings.offer.replace(/\.$/, "")}
          </span>
        </span>
      </span>
      <span className="v">
        <span className="text-[13px]" style={{ color: block ? undefined : "var(--ok)", fontWeight: block ? 400 : 600 }}>
          {statusText(block, p)}
        </span>
        <IChev className="chev" />
      </span>
    </Link>
  );
}

export function Explore() {
  const s = useMock();
  const [category, setCategory] = useState<Category | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtering = !!category || !!q;

  const all = places(s).map((p) => ({ p, block: blockFor(s, p, nextDay(p.settings.days)) }));
  const list = all
    .filter(({ p }) => !category || p.category === category)
    .filter(({ p }) => !q || `${p.name} ${p.kind} ${p.neighbourhood} ${p.settings.offer} ${p.dish ?? ""} ${p.details?.menu.map((m) => m.name).join(" ") ?? ""}`.toLowerCase().includes(q))
    // The owner's place first, then what runs today; the rest keep their order.
    .sort((a, b) => Number(!!b.p.isOwner) - Number(!!a.p.isOwner) || Number(!!a.block) - Number(!!b.block));

  const own = all.find((x) => x.p.isOwner);
  const hero = own ?? list.find((x) => !x.block) ?? list[0];
  const tonight = all.filter((x) => !x.block && x.p.id !== hero?.p.id);
  const rest = list.filter((x) => x.p.id !== hero?.p.id);

  return (
    <div className="a-fade pb-28">
      <NavBar
        left={<LogoButton />}
        right={
          <button type="button" className="iconbtn" aria-label={searching ? "Close search" : "Search"} aria-expanded={searching} onClick={() => { setSearching(!searching); setQuery(""); }}>
            {searching ? <IClose /> : <ISearch />}
          </button>
        }
      />

      <header className="m pt-2">
        <p className="eyebrow">
          {DAY_NAMES[TODAY]} · {own ? own.p.neighbourhood : "Toronto"}
        </p>
        <h1 className="t-large mt-1">Tonight</h1>
        {own && <Guide className="mt-2">Tap {own.p.name} to see your offer the way members do.</Guide>}
      </header>

      {searching && (
        <div className="m mt-4">
          <label className="field-box flex items-center gap-2 pl-4">
            <ISearch size={18} className="shrink-0 text-[color:var(--sec)]" />
            <span className="sr-only">Search places or neighbourhoods</span>
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setQuery("")} placeholder="Places, dishes, neighbourhoods" className="field pl-0" />
          </label>
        </div>
      )}

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5" role="group" aria-label="Category">
        {[null, ...CATEGORIES].map((c) => (
          <button key={c ?? "all"} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className="chip press">
            {c ? CAT_LABEL[c] : "All"}
          </button>
        ))}
      </div>

      {filtering ? (
        <>
          <p className="m t-foot mt-5" aria-live="polite">
            {list.length} {list.length === 1 ? "place" : "places"}
          </p>
          {list.length ? (
            <ul className="m mt-2" data-testid="places">
              <li className="group">
                {list.map(({ p, block }) => (
                  <PlaceRow key={p.id} p={p} block={block} />
                ))}
              </li>
            </ul>
          ) : (
            <p className="m t-sub mt-4">Nothing here yet. Try another search.</p>
          )}
        </>
      ) : (
        <>
          {hero && (
            <div className="m mt-4">
              <PlaceCard p={hero.p} block={hero.block} priority testId="hero" />
            </div>
          )}

          {tonight.length > 0 && (
            <>
              <div className="section-h">
                <h2 className="t-title">Two for one tonight</h2>
                <span className="t-sub">{tonight.length} nearby</span>
              </div>
              <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">
                {tonight.map(({ p }) => (
                  <li key={p.id} className="mini">
                    <Link href={`/app/place/${p.id}`} className="press block">
                      <Photo p={p} className="block h-[190px] w-[152px] rounded-[12px]" />
                      <span className="eyebrow accent mt-2.5 block text-[11px]">{kindLabel(p)}</span>
                      <span className="mt-0.5 block text-[16px] font-semibold leading-tight">{p.name}</span>
                      <span className="t-foot block">{p.neighbourhood}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="section-h">
            <h2 className="t-title">All places</h2>
            <span className="t-sub">{rest.length}</span>
          </div>
          <ul className="m mt-3" data-testid="places">
            <li className="group">
              {rest.map(({ p, block }) => (
                <PlaceRow key={p.id} p={p} block={block} />
              ))}
            </li>
          </ul>
        </>
      )}

    </div>
  );
}

/**
 * The logo. A tap scrolls back to the top, like tapping the status bar.
 * Holding it for a second opens Nida's tools (set up a place, new meeting,
 * tap hints), so owners never see a demo start screen.
 */
function LogoButton() {
  const router = useRouter();
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  return (
    <button
      type="button"
      className="ml-1 flex h-11 items-center px-2"
      aria-label="The 6 Pass. Hold for partner tools."
      data-testid="logo"
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={() => {
        fired.current = false;
        stop();
        timer.current = window.setTimeout(() => {
          fired.current = true;
          haptic("medium");
          router.push("/partners-demo");
        }, 800);
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onClick={() => {
        if (!fired.current) document.getElementById("app-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <Wordmark size={21} />
    </button>
  );
}
