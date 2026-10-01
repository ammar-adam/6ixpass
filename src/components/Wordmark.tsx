export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-serif text-[25px] tracking-tight ${className}`}>
      <span aria-hidden="true" className="inline-flex items-baseline">
        the
        <span className="mx-1.5 inline-grid size-[26px] -translate-y-[3px] place-items-center rounded-full border-[1.8px] border-current font-sans text-[15px] font-bold">
          6
        </span>
        pass
      </span>
      <span className="sr-only">The 6 Pass</span>
    </span>
  );
}
