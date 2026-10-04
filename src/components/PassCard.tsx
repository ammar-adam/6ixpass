import { hero } from "@/content/site";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function PassCard() {
  const c = hero.card;
  const runs = DAY_NAMES.filter((_, i) => c.days[i]);
  return (
    <figure className="w-full max-w-[400px] rounded-[28px] bg-white p-6 border border-ink/10 shadow-[0_30px_60px_-30px_rgba(21,25,28,0.35)] md:rotate-[1.5deg] motion-reduce:rotate-0">
      <div className="flex items-center justify-between text-[13px] font-semibold text-muted">
        <span>{c.neighbourhood}</span>
        <span className="rounded-full bg-mist px-2.5 py-1 text-ink">{c.badge}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
      <img
        src={`${c.image}-640.webp`}
        alt=""
        width={640}
        height={427}
        fetchPriority="high"
        decoding="async"
        className="mt-4 h-[170px] w-full rounded-[18px] object-cover"
      />
      <p className="mt-[18px] font-serif text-[28px] leading-tight">{c.name}</p>
      <p className="text-sm text-muted">{c.kind}</p>
      <p className="mt-3 text-lg font-semibold">{c.offer}</p>
      <p className="sr-only">Runs {runs.join(", ")}.</p>
      <div aria-hidden="true" className="mt-4 grid grid-cols-7 gap-[5px]">
        {DAY_LETTERS.map((d, i) => (
          <span
            key={i}
            className={`rounded-lg py-2 text-center text-xs font-semibold ${c.days[i] ? "bg-ink text-white" : "bg-mist text-muted"}`}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>{c.uses}</span>
        <span aria-hidden="true" className="rounded-[10px] bg-peach px-4 py-2 font-bold text-ink">
          Redeem
        </span>
      </div>
      <figcaption className="sr-only">An example offer as it appears in the app. The place is made up.</figcaption>
    </figure>
  );
}
