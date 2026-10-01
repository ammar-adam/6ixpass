import Link from "next/link";
import { footer, site } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/15 bg-mist">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Wordmark />
          <address className="mt-4 not-italic leading-relaxed text-muted">
            {site.name}
            <br />
            {site.city}
            <br />
            <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-ink">
              {site.email}
            </a>
          </address>
          <p className="mt-4 text-sm text-muted">
            {footer.teams} {site.email}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <li>
            <Link href="/privacy" className="underline-offset-4 hover:underline">Privacy</Link>
          </li>
          <li>
            <Link href="/terms" className="underline-offset-4 hover:underline">Terms</Link>
          </li>
          <li>
            <a href={`https://www.instagram.com/${site.instagram}/`} className="underline-offset-4 hover:underline">
              @{site.instagram}
              <span className="sr-only"> on Instagram</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="wrap pb-8 text-sm text-muted">© {new Date().getFullYear()} {site.name}</div>
    </footer>
  );
}
