import { hero } from "@/content/site";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// The example card shows a Tuesday, like the app demo.
const TODAY = 1;

/** An example place, drawn the way the app shows one. */
export function PassCard() {
  const c = hero.card;
  const runs = DAY_NAMES.filter((_, i) => c.days[i]);
  return (
    <figure className="w-full max-w-[400px] overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgba(22,20,15,0.06),0_30px_60px_-30px_rgba(22,20,15,0.35)]">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
        <img
          src={`${c.image}-640.webp`}
          alt=""
          width={640}
          height={427}
          fetchPriority="high"
          decoding="async"
          className="h-[200px] w-full object-cover"
        />
        <span className="absolute left-3 top-3 inline-flex h-[22px] items-center gap-1.5 rounded-full bg-white/90 px-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ink" />
          {c.badge}
        </span>
      </div>
      <div className="p-5">
        <p className="font-serif text-[32px] font-semibold leading-none tracking-[-0.015em]">{c.name}</p>
        <p className="mt-1.5 text-[15px] text-muted">
          {c.kind} · {c.neighbourhood}
        </p>
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-copper">Two for one</p>
        <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">{c.offer}</p>
        <div className="my-4 h-px bg-line" />
        <p className="sr-only">Runs {runs.join(", ")}.</p>
        <div aria-hidden="true" className="flex justify-between">
          {DAY_LETTERS.map((d, i) => (
            <span
              key={i}
              className={`grid size-9 place-items-center rounded-full text-[13px] font-semibold ${
                c.days[i] ? (i === TODAY ? "bg-ink text-white" : "text-ink ring-1 ring-inset ring-line") : "bg-ink/[0.06] text-[#a9a298]"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-[15px] text-muted">
          <span>{c.uses}</span>
          <span aria-hidden="true" className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-white">
            Redeem
          </span>
        </div>
      </div>
      <figcaption className="sr-only">An example offer as it appears in the app. The place is made up.</figcaption>
    </figure>
  );
}
