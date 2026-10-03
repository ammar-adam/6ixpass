import { hero } from "@/content/site";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function PassCard() {
  const c = hero.card;
  const runs = DAY_NAMES.filter((_, i) => c.days[i]);
  return (
    <figure className="w-full max-w-[400px] rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(15,46,51,0.35)] md:rotate-[1.5deg] motion-reduce:rotate-0">
      <div className="flex items-center justify-between text-[13px] font-semibold text-muted">
        <span>{c.neighbourhood}</span>
        <span className="rounded-full bg-mist px-2.5 py-1 text-ink">{c.badge}</span>
      </div>
      <div aria-hidden="true" className="relative mt-4 h-[150px] overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,var(--color-peach-soft)_0_55%,var(--color-peach)_55%_62%,var(--color-mist-2)_62%_100%)]">
        <span className="absolute inset-x-0 bottom-[22%] h-[2px] bg-ink/25" />
      </div>
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
      <figcaption className="sr-only">An example offer as it appears on your pass. The place is made up.</figcaption>
    </figure>
  );
}
