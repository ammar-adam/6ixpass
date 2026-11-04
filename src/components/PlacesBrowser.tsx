"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { placesPage as c } from "@/content/site";
import type { DemoPlace } from "@/demo/places";
import { PlaceCard } from "./PlaceCard";

const chip = "min-h-[44px] rounded-full border px-4 text-[15px] font-medium transition-colors";
const off = "border-line bg-white/70 text-ink hover:border-ink/40";
const on = "border-night bg-night text-white";

const noop = () => () => {};

// Filters for the places page: category, "on today" and neighbourhood.
export function PlacesBrowser({ places }: { places: DemoPlace[] }) {
  const categories = useMemo(() => [...new Set(places.map((p) => p.category))], [places]);
  const areas = useMemo(() => [...new Set(places.map((p) => p.neighbourhood))].sort(), [places]);
  const [cat, setCat] = useState<string | null>(null);
  const [todayOnly, setTodayOnly] = useState(false);
  const [area, setArea] = useState("");
  // Monday-first index of today, known only in the browser.
  const today = useSyncExternalStore(
    noop,
    () => (new Date().getDay() + 6) % 7,
    () => null,
  );

  const shown = places.filter(
    (p) => (!cat || p.category === cat) && (!area || p.neighbourhood === area) && (!todayOnly || today == null || p.days[today]),
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter places">
        <button type="button" aria-pressed={cat === null} onClick={() => setCat(null)} className={`${chip} ${cat === null ? on : off}`}>
          {c.all}
        </button>
        {categories.map((k) => (
          <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(cat === k ? null : k)} className={`${chip} ${cat === k ? on : off}`}>
            {c.labels[k] ?? k}
          </button>
        ))}
        <span aria-hidden="true" className="mx-1.5 hidden h-7 w-px bg-line sm:block" />
        <button type="button" aria-pressed={todayOnly} onClick={() => setTodayOnly(!todayOnly)} className={`${chip} ${todayOnly ? on : off}`}>
          {c.today}
        </button>
        <label className="sr-only" htmlFor="area">
          Neighbourhood
        </label>
        <select
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className={`${chip} ${area ? on : off} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%221.8%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
        >
          <option value="">{c.allAreas}</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} places shown
      </p>
      {shown.length ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id}>
              <PlaceCard p={p} today={today} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted">{c.empty}</p>
      )}
    </>
  );
}
