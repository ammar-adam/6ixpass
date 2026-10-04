// The logo Ammar chose: "the 6 pass" in Cormorant Garamond bold, the 6 in red italic.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block text-[30px] font-bold leading-none tracking-[-0.3px] ${className}`}
      style={{ fontFamily: "var(--font-logo), Georgia, 'Times New Roman', serif" }}
    >
      <span aria-hidden="true">
        the <span className="italic text-[#E0382A]">6</span> pass
      </span>
      <span className="sr-only">The 6 Pass</span>
    </span>
  );
}
