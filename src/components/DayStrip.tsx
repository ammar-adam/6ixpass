export const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "Tue, Wed, Thu and Sun" from a Mon-first boolean[7]. */
export function describeDays(days: boolean[]) {
  const on = DAY_SHORT.filter((_, i) => days[i]);
  if (on.length === 7) return "Every day";
  if (on.length <= 1) return on.join("");
  return `${on.slice(0, -1).join(", ")} and ${on[on.length - 1]}`;
}

/**
 * The Mon to Sun strip. `today` (0 = Monday) gets an outline. With
 * `animate`, the lit days fill in one after another on load.
 */
export function DayStrip({
  days,
  today,
  animate = false,
  size = "md",
}: {
  days: boolean[];
  today?: number;
  animate?: boolean;
  size?: "sm" | "md";
}) {
  let lit = 0;
  return (
    <>
      <p className="sr-only">Runs {describeDays(days)}.</p>
      <div aria-hidden="true" className="grid grid-cols-7 gap-[5px]">
        {DAY_LETTERS.map((d, i) => {
          const on = days[i];
          const delay = on ? lit++ * 160 : 0;
          return (
            <span
              key={i}
              style={animate && on ? { animationDelay: `${300 + delay}ms` } : undefined}
              className={`rounded-lg text-center font-semibold ${size === "sm" ? "py-1.5 text-[11px]" : "py-2 text-xs"} ${
                on ? "bg-ink text-white" : "bg-mist text-muted"
              } ${animate && on ? "day-fill" : ""} ${today === i ? "ring-2 ring-peach ring-offset-1 ring-offset-white" : ""}`}
            >
              {d}
            </span>
          );
        })}
      </div>
    </>
  );
}
