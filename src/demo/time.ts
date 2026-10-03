const TZ = "America/Toronto";

/** 0 = Monday ... 6 = Sunday, in Toronto. */
export function torontoWeekday(now = new Date()) {
  const name = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, weekday: "short" }).format(now);
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(name.slice(0, 3));
}

/** YYYY-MM-DD in Toronto. */
export function torontoDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}

export function mmss(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
