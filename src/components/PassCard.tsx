import type { DemoPlace } from "@/demo/places";
import { TODAY } from "@/demo/data";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** A made-up place, drawn the way the app shows one. */
export function PassCard({ place: p, className = "" }: { place: DemoPlace; className?: string }) {
  const runs = DAY_NAMES.filter((_, i) => p.days[i]);
  return (
    <figure className={`w-full overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(22,20,15,0.06),0_34px_64px_-30px_rgba(15,46,51,0.5)] ${className}`}>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
        <img src={`${p.image}-640.webp`} alt="" width={640} height={427} fetchPriority="high" decoding="async" className="h-[190px] w-full object-cover" />
        {p.founding && (
          <span className="absolute left-3 top-3 inline-flex h-6 items-center gap-1.5 rounded-full bg-white/95 px-2.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-peach ring-1 ring-ink/40" />
            Founding Partner
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="font-serif text-[30px] font-semibold leading-none tracking-[-0.01em]">{p.name}</p>
        <p className="mt-1.5 text-[15px] text-muted">
          {p.kind} · {p.neighbourhood}
        </p>
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-copper">{/upgrade/i.test(p.offer) ? "Free upgrade" : "Two for one"}</p>
        <p className="mt-1 text-[19px] font-semibold tracking-[-0.015em]">{p.offer}</p>
        <p className="sr-only">Runs {runs.join(", ")}.</p>
        <div aria-hidden="true" className="mt-4 flex justify-between border-t border-line pt-4">
          {DAY_LETTERS.map((d, i) => (
            <span
              key={i}
              className={`grid size-8 place-items-center rounded-full text-[12px] font-semibold ${
                p.days[i] ? (i === TODAY ? "bg-deep text-mint" : "text-ink ring-1 ring-inset ring-line") : "text-[#b3aca1]"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-[15px] text-muted">
          <span>{p.usesPerYear} uses this year</span>
          <span aria-hidden="true" className="rounded-full bg-peach px-5 py-2.5 text-[15px] font-semibold text-ink">
            Redeem
          </span>
        </div>
      </div>
      <figcaption className="sr-only">An example offer as it appears in the app. The place is made up.</figcaption>
    </figure>
  );
}
