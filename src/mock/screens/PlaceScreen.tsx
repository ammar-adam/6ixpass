"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { CalendarX, CaretLeft, Clock, ForkKnife, Heart, MapPin, Receipt, ShareNetwork } from "@phosphor-icons/react";
import { copy } from "@/demo/data";
import { blockFor, isLive, mock, offerLabel, place, usesLeft, useMock, DEMO_DATE } from "../store";
import { C, DayDots, label, nextDay, Photo, serif, useEscape, useNow } from "../ui";
import { catIcon } from "./Explore";

const RULE_ICONS = [MapPin, ForkKnife, Receipt];

export function PlaceScreen({ slug }: { slug: string }) {
  const s = useMock();
  const router = useRouter();
  const now = useNow();
  const goBack = useCallback(() => router.push("/app"), [router]);
  useEscape(goBack);

  const p = place(s, slug);
  if (!p) return null;
  const left = usesLeft(s, p);
  const block = blockFor(s, p, nextDay(p.settings.days));
  const live = now > 0 && s.redemptions.some((r) => r.partnerId === p.id && isLive(r, now));
  const Icon = catIcon[p.category];

  function redeem() {
    if (!p || block) return;
    mock.issue(p.id);
    router.push(`/app/redeem/${p.id}`);
  }

  return (
    <div className="m-push">
      <div className="relative h-[400px]">
        <Photo p={p} size={1200} priority className="absolute inset-0 size-full" />
        <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(10,20,36,0.5) 0%, transparent 25%, transparent 45%, ${C.bg} 100%)` }} />
        <div className="absolute inset-x-4 top-4 flex justify-between">
          <Link href="/app" aria-label={copy.place.back} className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-md">
            <CaretLeft size={22} weight="bold" aria-hidden="true" />
          </Link>
          <div className="flex gap-2">
            <button type="button" aria-label="Share" className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-md"><ShareNetwork size={20} aria-hidden="true" /></button>
            <button type="button" aria-label="Save" className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-md"><Heart size={20} aria-hidden="true" /></button>
          </div>
        </div>
        {p.credit && <p className="absolute right-4 top-[72px] rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{p.credit}</p>}
        <div className="absolute inset-x-5 bottom-1">
          {p.founding && <p className={label} style={{ color: C.ice }}>{copy.place.founding}</p>}
          <h1 className="mt-1 text-[38px] leading-[1]" style={serif}>{p.name}</h1>
        </div>
      </div>

      <div className="px-5">
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px]" style={{ color: C.muted }}>
          <span className="flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" />{p.neighbourhood}</span>
          <span className="flex items-center gap-1.5"><Icon size={16} aria-hidden="true" />{p.kind}</span>
          <span className="flex items-center gap-1.5" style={{ color: block ? undefined : C.ok }}>
            <Clock size={16} aria-hidden="true" />
            {block ? (block.reason === "not-today" ? `Next: ${nextDay(p.settings.days)}` : block.reason === "blackout" ? "Blackout today" : "Used for the year") : copy.explore.runsToday}
          </span>
        </p>
        <p className="mt-4 text-[16px] leading-relaxed" style={{ color: C.soft }}>{p.blurb}</p>

        <section className="mt-6 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }} aria-labelledby="offer-h">
          <p className={label} style={{ color: C.ice }}>{offerLabel(p)}</p>
          <h2 id="offer-h" className="mt-2 text-[26px] leading-tight" style={serif}>{p.settings.offer}</h2>
          <p className="mt-1 text-[15px]" style={{ color: C.muted }}>{p.settings.detail}</p>
          <p className={`${label} mb-2.5 mt-5`} style={{ color: C.muted }}>{copy.place.days}</p>
          <DayDots days={p.settings.days} />
          <div className="mt-5 flex items-center gap-3">
            <div className="flex flex-1 gap-1.5" aria-hidden="true">
              {Array.from({ length: p.settings.usesPerYear }).map((_, i) => (
                <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < left ? C.ice : "rgba(255,255,255,0.14)" }} />
              ))}
            </div>
            <span className="text-[13px] font-semibold" data-testid="uses-left">{copy.place.usesLeft(left, p.settings.usesPerYear)}</span>
          </div>
          {p.settings.blackoutDates.length > 0 && (
            <p className="mt-4 flex items-start gap-2 text-[13px]" style={{ color: C.muted }}>
              <CalendarX size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              Blackout dates: {p.settings.blackoutDates.map((d) => (d === DEMO_DATE ? "today" : new Date(`${d}T12:00:00`).toLocaleDateString("en-CA", { month: "short", day: "numeric" }))).join(", ")}
            </p>
          )}
        </section>

        <ul className="mt-5 space-y-3.5 text-[15px]" style={{ color: C.soft }}>
          {copy.place.rules.map((r, i) => {
            const RIcon = RULE_ICONS[i] ?? Receipt;
            return (
              <li key={r} className="flex gap-3">
                <RIcon size={20} aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: C.ice }} />
                {r}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky bottom-0 z-10 mt-6 px-5 pb-6 pt-6" style={{ background: `linear-gradient(to top, ${C.bg} 72%, transparent)` }}>
        {block ? (
          <p role="status" className="rounded-[20px] border px-4 py-4 text-center font-semibold" style={{ borderColor: C.line, color: C.soft }}>{block.message}</p>
        ) : (
          <button type="button" onClick={redeem} className="m-press flex h-[58px] w-full items-center justify-between rounded-[20px] px-6 text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
            <span>{live ? "Show my code" : copy.place.redeem}</span>
            <span className="text-[15px] font-semibold">Save about ${p.settings.saving}</span>
          </button>
        )}
      </div>
    </div>
  );
}
