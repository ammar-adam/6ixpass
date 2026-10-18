import Link from "next/link";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { OpenWaitlistButton } from "./WaitlistPopup";

const link = "hidden text-ink-2 underline-offset-4 hover:underline lg:inline";
const button = "shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-2 md:px-5 md:text-[15px]";

// A translucent bar that sticks to the top, like the app's.
// home: links jump within the page. popup: the page has the waitlist popup;
// without it the button goes to the form on the home page.
export function SiteHeader({ home = true, popup = true }: { home?: boolean; popup?: boolean }) {
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150">
      <header className="wrap flex items-center justify-between gap-4 py-3 md:py-3.5">
        <Link href="/" className="rounded-md">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-7 text-[15px] font-medium">
          {nav.map((n) =>
            home ? (
              <a key={n.href} href={n.href} className={link}>
                {n.label}
              </a>
            ) : (
              <Link key={n.href} href={`/${n.href}`} className={link}>
                {n.label}
              </Link>
            ),
          )}
          {popup ? (
            <OpenWaitlistButton className={button}>Join the waitlist</OpenWaitlistButton>
          ) : (
            <Link href="/#join" className={button}>
              Join the waitlist
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
}
