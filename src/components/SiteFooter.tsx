import Link from "next/link";
import { footer, site } from "@/content/site";
import { Wordmark } from "./Wordmark";

const link = "inline-block py-1 text-[#f3e9de] underline-offset-4 hover:underline";

// The dark footer.
export function SiteFooter() {
  return (
    <footer className="on-dark bg-night text-[#f3e9de]">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_auto] md:gap-16 md:py-16">
        <div className="max-w-[34ch]">
          <Wordmark className="text-[28px]" />
          <address className="mt-4 not-italic leading-relaxed text-pale">
            {site.name}
            <br />
            {site.mailingAddress || site.city}
            <br />
            <a href={`mailto:${site.email}`} className="text-[#f3e9de] underline underline-offset-4">
              {site.email}
            </a>
          </address>
          <p className="mt-4 text-sm text-pale">{footer.opening}</p>
          <p className="mt-1 text-sm text-pale">
            {footer.teams} {site.email}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:gap-x-20">
          {footer.columns.map((col, i) => (
            <div key={col.title}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-pale">{col.title}</h2>
              <ul className="mt-3 grid gap-1 text-[15px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {i === footer.columns.length - 1 && (
                  <li>
                    <a href={`https://www.instagram.com/${site.instagram}/`} className={link}>
                      @{site.instagram}
                      <span className="sr-only"> on Instagram</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap">
        <p className="border-t border-white/10 py-6 text-sm text-pale">© {new Date().getFullYear()} {site.name}, Toronto</p>
      </div>
    </footer>
  );
}
