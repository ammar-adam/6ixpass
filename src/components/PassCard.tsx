import { hero } from "@/content/site";
import { DayStrip } from "./DayStrip";
import { PlaceArt, type ArtKind } from "./PlaceArt";

export type PassCardData = {
  neighbourhood: string;
  badge?: string;
  name: string;
  kind: string;
  offer: string;
  days: boolean[];
  uses: string;
  art?: ArtKind;
};

/** The offer card. With no props it shows the example from the home page hero. */
export function PassCard({
  data = { ...hero.card, art: "restaurant" },
  today,
  animate = false,
  tilt = true,
  caption = "An example offer as it appears on your pass. The place is made up.",
  footer,
}: {
  data?: PassCardData;
  today?: number;
  animate?: boolean;
  tilt?: boolean;
  caption?: string;
  footer?: React.ReactNode;
}) {
  return (
    <figure
      className={`w-full max-w-[400px] rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(15,46,51,0.35)] ${
        tilt ? "md:rotate-[1.5deg] motion-reduce:rotate-0" : ""
      }`}
    >
      <div className="flex items-center justify-between text-[13px] font-semibold text-muted">
        <span>{data.neighbourhood}</span>
        {data.badge && <span className="rounded-full bg-mist px-2.5 py-1 text-ink">{data.badge}</span>}
      </div>
      <PlaceArt kind={data.art ?? "restaurant"} className="mt-4 h-[150px] rounded-[18px]" />
      <p className="mt-[18px] font-serif text-[28px] leading-tight">{data.name}</p>
      <p className="text-sm text-muted">{data.kind}</p>
      <p className="mt-3 text-lg font-semibold">{data.offer}</p>
      <div className="mt-4">
        <DayStrip days={data.days} today={today} animate={animate} />
      </div>
      {footer ?? (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>{data.uses}</span>
          <span aria-hidden="true" className="rounded-[10px] bg-peach px-4 py-2 font-bold text-ink">
            Redeem
          </span>
        </div>
      )}
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
