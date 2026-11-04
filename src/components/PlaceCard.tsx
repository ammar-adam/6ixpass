import Link from "next/link";
import { placesPage } from "@/content/site";
import { DAY_SHORT } from "@/demo/data";
import type { DemoPlace } from "@/demo/places";

/** "Tue to Thu" for a run of three or more days, otherwise "Sun, Tue, Wed". Monday first. */
export function daysLabel(days: boolean[]) {
  const on = days.flatMap((d, i) => (d ? [i] : []));
  if (on.length === 7) return "Every day";
  const run = on.length > 2 && on.every((d, i) => i === 0 || d === on[i - 1] + 1);
  return run ? `${DAY_SHORT[on[0]]} to ${DAY_SHORT[on[on.length - 1]]}` : on.map((d) => DAY_SHORT[d]).join(", ");
}

export const offerLine = (offer: string) => offer.replace(/\.$/, "");

// One example place: photo, area, name, offer, days and uses.
// today: Monday-first index of today. Left out (or null before the page knows
// it), the "On today" pill is hidden rather than guessed.
export function PlaceCard({ p }: { p: DemoPlace; today?: number | null }) {
  return (
    <Link
      href={`/places/${p.id}`}
      className="group block h-full overflow-hidden rounded-[24px] border border-line bg-[#fffaf4] shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(42_31_25/0.06),0_24px_40px_-20px_rgb(42_31_25/0.35)] motion-reduce:transition-none"
    >
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
        <img
          src={`${p.image}-640.webp`}
          alt=""
          width={640}
          height={427}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span className="absolute left-3 top-3 flex gap-1.5 text-[12px] font-semibold">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-ink">{placesPage.singular[p.category] ?? p.category}</span>
          <span className="rounded-full bg-night/70 px-2.5 py-1 text-white">{placesPage.example}</span>
        </span>
      </div>
      <div className="p-5">
        <p className="flex items-center gap-1.5 text-[13px] text-muted">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 14s5-4.3 5-8.2A5 5 0 0 0 3 5.8C3 9.7 8 14 8 14z" />
            <circle cx="8" cy="6" r="1.8" />
          </svg>
          {p.neighbourhood}
        </p>
        <h3 className="mt-1.5 font-serif text-[26px] leading-tight">{p.name}</h3>
        <p className="mt-1 text-[15px] font-semibold text-copper">{offerLine(p.offer)}</p>
        <p className="mt-1 text-[13px] text-muted">
          {daysLabel(p.days)} · {p.usesPerYear} {p.usesPerYear === 1 ? "use" : "uses"} a year
        </p>
      </div>
    </Link>
  );
}
