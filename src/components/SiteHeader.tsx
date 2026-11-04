import Link from "next/link";
import QRCode from "qrcode";
import { getApp, nav, topBanner } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { OpenWaitlistButton } from "./WaitlistPopup";
import { GetApp } from "./GetApp";
import { HeaderNav } from "./HeaderNav";

const button = "shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-8px_rgb(194_69_45/0.7)] hover:bg-accent-2 md:px-5 md:text-[15px]";
const appButton = "hidden shrink-0 rounded-full border border-line bg-white/80 px-4 py-2.5 text-sm font-semibold hover:border-ink/30 sm:inline-block md:text-[15px]";

// The partner banner, then a translucent cream bar that sticks to the top.
// popup: the page has the waitlist popup; without it the button goes to the
// form on the home page.
export async function SiteHeader({ popup = true }: { home?: boolean; popup?: boolean }) {
  const qr = await QRCode.toString(getApp.url, { type: "svg", margin: 0, color: { dark: "#1e1713", light: "#ffffff" } });
  return (
    <>
      <div className="on-dark bg-night text-[#f3e9de]">
        <p className="wrap flex min-h-[40px] flex-wrap items-center justify-center gap-x-2 py-1.5 text-center text-[13px] sm:text-[14px]">
          <span className="text-pale">{topBanner.text}</span>
          <Link href={topBanner.href} className="font-semibold text-white underline decoration-peach underline-offset-4 hover:decoration-white">
            {topBanner.link} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
      <div className="sticky top-0 z-30 bg-paper/85 backdrop-blur-xl backdrop-saturate-150">
        <header className="wrap flex items-center justify-between gap-4 py-2.5 md:py-3">
          <Link href="/" className="rounded-md">
            <Wordmark className="text-[30px] md:text-[34px]" />
          </Link>
          <HeaderNav />
          <div className="flex items-center gap-2.5 text-[15px] sm:gap-3">
            <GetApp qr={qr} className={appButton} />
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
                  {nav.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="flex min-h-[48px] items-center rounded-xl px-4 text-[16px] font-medium hover:bg-mist">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={getApp.url} className="flex min-h-[48px] items-center rounded-xl px-4 text-[16px] font-medium hover:bg-mist">
                      {getApp.button}
                    </Link>
                  </li>
                </ul>
              </nav>
            </details>
          </div>
        </header>
      </div>
    </>
  );
}
