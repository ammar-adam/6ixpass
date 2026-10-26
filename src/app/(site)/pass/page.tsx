import type { Metadata } from "next";
import { buy } from "@/content/buy";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone } from "@/components/Phone";
import { PlanPicker } from "@/components/PlanPicker";
import { WaitlistPopup } from "@/components/WaitlistPopup";

// Preview: kept out of search and the sitemap until passes go on sale.
export const metadata: Metadata = {
  title: buy.seo.title,
  description: buy.seo.description,
  robots: { index: false, follow: false },
};

export default function Pass() {
  return (
    <>
      <SiteHeader home={false} />
      <main id="main">
        <section aria-labelledby="pass-title" className="wrap max-w-[640px] pb-14 pt-8 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-copper">{buy.eyebrow}</p>
          <h1 id="pass-title" className="mt-3 font-serif text-[clamp(40px,5.4vw,64px)] font-semibold leading-[1] tracking-[-0.025em]">
            {buy.title}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{buy.sub}</p>
          <div className="mt-8">
            <PlanPicker />
          </div>
        </section>

        <section aria-labelledby="included-title" className="bg-mist py-14 md:py-20">
          <h2 id="included-title" className="wrap font-serif text-[clamp(32px,3.9vw,48px)] font-semibold leading-[1.02] tracking-[-0.02em]">
            {buy.includedTitle}
          </h2>
          <ul className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(16px,calc((100vw-1200px)/2))] pb-4" aria-label={buy.includedTitle}>
            {buy.screens.map((s) => (
              <li key={s.src} className="w-[220px] shrink-0 snap-center md:w-[250px]">
                <Phone src={s.src} alt={s.alt} sizes="250px" />
                <p className="mt-4 text-center font-semibold">{s.caption}</p>
              </li>
            ))}
          </ul>
          <p className="wrap mt-4 text-sm text-muted">{buy.screensLabel}</p>
        </section>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
