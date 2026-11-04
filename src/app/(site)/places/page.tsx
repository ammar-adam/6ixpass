import type { Metadata } from "next";
import { placesPage as c } from "@/content/site";
import { PLACES } from "@/demo/places";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PlacesBrowser } from "@/components/PlacesBrowser";
import { WaitlistPopup } from "@/components/WaitlistPopup";

export const metadata: Metadata = {
  title: c.seo.title,
  description: c.seo.description,
  alternates: { canonical: "/places" },
  openGraph: { type: "website", title: c.seo.title, description: c.seo.description, url: "/places" },
};

export default function Places() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="hero-glow">
        <div className="wrap pb-20 pt-10 md:pb-28 md:pt-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">{c.eyebrow}</p>
          <h1 className="mt-3 font-serif text-[clamp(48px,6.4vw,84px)] font-normal leading-[0.98] tracking-[-0.02em]">{c.title}</h1>
          <p className="mt-5 max-w-[46ch] text-[18px] leading-relaxed text-ink/75">{c.intro}</p>
          <div className="mt-10">
            <PlacesBrowser places={PLACES} />
          </div>
        </div>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
