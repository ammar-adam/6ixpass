import Link from "next/link";
import { footer, getApp, site } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { StoreBadge } from "./GetApp";

const link = "inline-block py-1 text-[#f3e9de] underline-offset-4 hover:underline";

const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.4 2.3 1.9 3.9 4.2 4.1v3.1c-1.5 0-2.9-.4-4.2-1.2v6.3c0 3.6-2.9 6.2-6.3 6.2S4 18.8 4 15.3c0-3.6 3.1-6.3 6.7-6v3.2c-1.8-.3-3.4 1-3.4 2.8 0 1.6 1.3 2.9 2.9 2.9 1.7 0 3-1.2 3-3.1V3h3.4z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M4.5 3.5a2 2 0 110 4 2 2 0 010-4zM3 9h3v12H3zM9 9h2.9v1.7c.4-.8 1.5-1.9 3.4-1.9 3.6 0 4.2 2.3 4.2 5.4V21h-3v-6c0-1.4 0-3.3-2-3.3s-2.4 1.6-2.4 3.2V21H9z" />
    </svg>
  ),
};

// The dark footer: what it is, one contact block, links, socials and the apps.
export function SiteFooter() {
  return (
    <footer className="on-dark bg-night text-[#f3e9de]">
      <div className="wrap grid gap-12 py-14 md:grid-cols-[1.1fr_1.9fr] md:gap-16 md:py-16">
        <div className="max-w-[40ch]">
          <Wordmark className="text-[32px]" />
          <p className="mt-3 leading-relaxed text-pale">{footer.tagline}</p>
          <p className="mt-2 text-sm text-pale">{footer.opening}</p>

          <div className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="font-serif text-[24px] leading-tight text-white">{footer.contactTitle}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-pale">{footer.contactText}</p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-semibold text-white hover:bg-accent-2">
              {site.email}
            </a>
          </div>

          <ul className="mt-6 flex gap-3" aria-label="Follow us">
            {footer.socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener" className="grid size-11 place-items-center rounded-full border border-white/20 text-white hover:border-white/60">
                  {ICONS[s.name]}
                  <span className="sr-only">The 6 Pass on {s.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10">
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-pale">{col.title}</h2>
                <ul className="mt-3 grid gap-1 text-[15px]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={link}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-pale">{getApp.button}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <StoreBadge top="Download on the" name="App Store" dark={false} />
              <StoreBadge top="Get it on" name="Google Play" dark={false} />
            </div>
            <p className="mt-2 text-sm text-pale">
              {getApp.soon}{" "}
              <Link href="/app" className="text-white underline underline-offset-4">
                Open it in your browser
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6 text-sm text-pale">
          <p>
            © {new Date().getFullYear()} {site.name}, {site.mailingAddress || site.city}
          </p>
          <p>{footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
