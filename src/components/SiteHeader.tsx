import Link from "next/link";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { OpenWaitlistButton } from "./WaitlistPopup";

export function SiteHeader({ home = true }: { home?: boolean }) {
  return (
    <header className="wrap flex items-center justify-between gap-4 py-5 md:py-6">
      <Link href="/" className="rounded-md">
        <Wordmark />
      </Link>
      <nav aria-label="Main" className="flex items-center gap-7 text-[15px] font-medium">
        {home &&
          nav.map((n) => (
            <a key={n.href} href={n.href} className="hidden underline-offset-4 hover:underline lg:inline">
              {n.label}
            </a>
          ))}
        {home ? (
          <OpenWaitlistButton className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-2 md:px-5 md:py-3 md:text-[15px]">
            Join the waitlist
          </OpenWaitlistButton>
        ) : (
          <Link href="/" className="font-semibold underline underline-offset-4">
            Back to home
          </Link>
        )}
      </nav>
    </header>
  );
}
