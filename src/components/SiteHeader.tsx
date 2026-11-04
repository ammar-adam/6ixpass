import Link from "next/link";
import { nav, signIn } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { OpenWaitlistButton } from "./WaitlistPopup";

const link = "text-ink-2 underline-offset-4 hover:underline";
const button = "shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-8px_rgb(194_69_45/0.7)] hover:bg-accent-2 md:px-5 md:text-[15px]";

// A translucent cream bar that sticks to the top.
// popup: the page has the waitlist popup; without it the button goes to the
// form on the home page.
export function SiteHeader({ popup = true }: { home?: boolean; popup?: boolean }) {
  return (
    <div className="sticky top-0 z-30 bg-paper/80 backdrop-blur-xl backdrop-saturate-150">
      <header className="wrap flex items-center justify-between gap-4 py-3 md:py-4">
        <Link href="/" className="rounded-md">
          <Wordmark className="text-[26px]" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={link}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-[15px] sm:gap-5">
          <Link href={signIn.href} className="hidden font-semibold text-ink underline-offset-4 hover:underline sm:inline">
            {signIn.label}
          </Link>
          {popup ? (
            <OpenWaitlistButton className={button}>Join the waitlist</OpenWaitlistButton>
          ) : (
            <Link href="/#join" className={button}>
              Join the waitlist
            </Link>
          )}
          {/* Phones and tablets: the same links in a small menu. */}
          <details className="group relative lg:hidden">
            <summary
              aria-label="Menu"
              className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-line bg-white/80 [&::-webkit-details-marker]:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path className="group-open:hidden" d="M3 6h14M3 10h14M3 14h14" />
                <path className="hidden group-open:block" d="M5 5l10 10M15 5L5 15" />
              </svg>
            </summary>
            <nav aria-label="Main" className="absolute right-0 top-[calc(100%+8px)] w-[min(260px,calc(100vw-32px))] rounded-[20px] border border-line bg-paper p-2 shadow-card">
              <ul>
                {[...nav, signIn].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="flex min-h-[48px] items-center rounded-xl px-4 text-[16px] font-medium hover:bg-mist">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </header>
    </div>
  );
}
