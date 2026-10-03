"use client";

import { places } from "../data";
import { actions, useDemo } from "../store";

/** Lets Nida show the staff side as any of the example places. */
export function StaffPlacePicker() {
  const s = useDemo();
  return (
    <div className="mt-2">
      <label htmlFor="staff-place" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        Showing as
      </label>
      <select
        id="staff-place"
        value={s.staffSlug}
        onChange={(e) => actions.setStaffPlace(e.target.value)}
        className="mt-1 block w-full appearance-none rounded-xl border-[1.5px] border-ink/20 bg-white px-4 py-3 font-serif text-xl"
      >
        {places.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
