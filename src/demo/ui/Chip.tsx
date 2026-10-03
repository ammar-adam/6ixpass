export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`shrink-0 rounded-full border-[1.5px] px-3.5 py-2 text-sm font-semibold ${
        on ? "border-ink bg-ink text-white" : "border-ink/20 bg-white text-ink"
      }`}
    >
      {children}
    </button>
  );
}
