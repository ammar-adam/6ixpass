/*
 * Opening hours for the place page: "Open now · until 10:30 pm",
 * "Opens at 5 pm", "Closed today · opens Wed 5 pm". The demo's day is always
 * Tuesday (TODAY); the time of day is the phone's real clock.
 */
import { DAY_SHORT, TODAY } from "@/demo/data";
import type { PlaceDetails } from "@/demo/places";

type Hours = NonNullable<PlaceDetails["hours"]>;

const mins = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "17:00" -> "5 pm", "22:30" -> "10:30 pm", "12:00" -> "12 pm". */
export function clock(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

function nextOpening(hours: Hours, fromDay: number) {
  for (let i = 1; i <= 7; i++) {
    const d = (fromDay + i) % 7;
    const h = hours[d];
    if (h) return `${DAY_SHORT[d]} ${clock(h[0])}`;
  }
  return null;
}

export type HoursStatus = { open: boolean; text: string };

/** Where the place is right now, from the minutes since midnight. */
export function hoursStatus(hours: Hours, minuteOfDay: number, day = TODAY): HoursStatus {
  const today = hours[day];
  if (!today) {
    const next = nextOpening(hours, day);
    return { open: false, text: next ? `Closed today · opens ${next}` : "Closed" };
  }
  const [o, c] = [mins(today[0]), mins(today[1])];
  if (minuteOfDay < o) return { open: false, text: `Opens at ${clock(today[0])}` };
  if (minuteOfDay < c) return { open: true, text: `Open now · until ${clock(today[1])}` };
  const next = nextOpening(hours, day);
  return { open: false, text: next ? `Closed now · opens ${next}` : "Closed" };
}

/** The week, Monday first: "5 pm to 10:30 pm" or "Closed". */
export const weekLines = (hours: Hours) => hours.map((h, i) => ({ day: DAY_SHORT[i], text: h ? `${clock(h[0])} to ${clock(h[1])}` : "Closed", today: i === TODAY }));

export const priceLevel = (n: number) => "$".repeat(n);
