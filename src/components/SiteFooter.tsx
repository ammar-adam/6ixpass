import Link from "next/link";
import { footer, site } from "@/content/site";
import { Wordmark } from "./Wordmark";

const link = "inline-block py-1 underline-offset-4 hover:underline";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/15 bg-mist">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1fr_auto] md:gap-16 md:py-14">
        <div>
          <Wordmark />
          <address className="mt-4 not-italic leading-relaxed text-muted">
            {site.name}
            <br />
            {site.mailingAddress || site.city}
            <br />
            <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-ink">
              {site.email}
            </a>
          </address>
          <p className="mt-4 text-sm text-muted">{footer.opening}</p>
          <p className="mt-1 text-sm text-muted">
            {footer.teams} {site.email}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:gap-x-16">
          {footer.columns.map((col, i) => (
            <div key={col.title}>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{col.title}</h2>
              <ul className="mt-3 grid gap-1 text-[15px] font-medium">
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
        <p className="border-t border-ink/10 py-6 text-sm text-muted">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
