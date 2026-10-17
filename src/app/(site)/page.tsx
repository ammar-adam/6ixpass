import { appPreview, faq, hero, howItWorks, offers, owners, site } from "@/content/site";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PhoneShot } from "@/components/PhoneShot";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WaitlistPopup } from "@/components/WaitlistPopup";
import { Countdown } from "@/components/Countdown";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";

/*
 * The home page, in the app's look: the iPhone system font, bold compact
 * headings, white cards with hairlines, real screens from the app.
 * The serif is only for the logo and place names. All words: src/content/site.ts.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="wrap grid items-center gap-12 pb-16 pt-8 md:grid-cols-[1fr_auto] md:gap-20 md:pb-24 md:pt-16">
          <div className="max-w-[540px]">
            <p className="s-eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-title" className="s-hero mt-3">
              {hero.headline}
            </h1>
            <p className="s-lede mt-4">{hero.lede}</p>
            <div id="join" className="mt-8 scroll-mt-24">
              <h2 className="sr-only">Join the waitlist</h2>
              <WaitlistForm placement="hero" />
              <p className="mt-3 text-[15px] text-muted">{hero.formNote}</p>
              {site.mailingAddress && (
                <p className="mt-1 text-[13px] text-muted">
                  {site.name}, {site.mailingAddress}
                </p>
              )}
            </div>
            <Countdown />
          </div>
          <figure className="mx-auto w-[248px] md:w-[300px]">
            <PhoneShot src={appPreview.hero.src} alt={appPreview.hero.alt} priority />
          </figure>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="offers-title" className="s-section">
          <div className="wrap">
            <h2 id="offers-title" className="s-title">
              {offers.title}
            </h2>
            <p className="s-lede mt-2 max-w-[44ch]">{offers.intro}</p>
            {/* Phones: a grouped list like the app's. Wider: three cards. */}
            <ul className="s-card mt-8 grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:rounded-none sm:bg-transparent sm:shadow-none">
              {offers.items.map((o) => (
                <li key={o.category} className="grid grid-cols-[88px_1fr] items-center gap-4 border-b border-line p-3 last:border-b-0 sm:s-card sm:block sm:border-b-0 sm:p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img src={`${o.image}-640.webp`} alt={o.alt} width={640} height={427} loading="lazy" decoding="async" className="aspect-square w-full rounded-[10px] object-cover sm:aspect-[3/2] sm:rounded-none" />
                  <div className="sm:p-5">
                    <h3 className="s-eyebrow text-copper">{o.category}</h3>
                    <p className="mt-1 text-[18px] font-semibold leading-snug tracking-[-0.015em] sm:mt-1.5 sm:text-[20px]">{o.offer}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-muted">{offers.caption}</p>
          </div>
        </section>

        {/* How it works, on real screens from the app */}
        <section id="how" aria-labelledby="how-title" className="s-section">
          <div className="wrap">
            <h2 id="how-title" className="s-title">
              {howItWorks.title}
            </h2>
            <p className="s-lede mt-2 max-w-[48ch]">{howItWorks.intro}</p>
            <ol className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0">
              {howItWorks.steps.map((s, i) => (
                <li key={s.title} className="w-[66%] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none">
                  <PhoneShot src={s.screen.src} alt={s.screen.alt} className="mx-auto max-w-[260px]" />
                  <div className="mx-auto mt-6 max-w-[260px]">
                    <p className="s-eyebrow text-copper">Step {i + 1}</p>
                    <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.015em]">{s.title}</h3>
                    <p className="mt-1 text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[15px] text-muted">
              {appPreview.label}{" "}
              <Link href="/app" className="font-semibold text-ink underline underline-offset-4">
                {appPreview.link}
              </Link>
            </p>
          </div>
        </section>

        {/* For owners */}
        <section id="owners" aria-labelledby="owners-title" className="s-section">
          <div className="wrap">
            <div className="s-card grid items-center gap-10 p-6 md:grid-cols-[1fr_auto] md:gap-16 md:p-12">
              <div className="max-w-[520px]">
                <p className="s-eyebrow text-copper">{owners.eyebrow}</p>
                <h2 id="owners-title" className="s-title mt-2">
                  {owners.title}
                </h2>
                <p className="s-lede mt-3">{owners.text}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/owners" className="s-btn">
                    {owners.more}
                  </Link>
                  <a href={`mailto:${site.email}`} className="s-btn s-btn-quiet">
                    {site.email}
                  </a>
                </div>
              </div>
              <figure className="mx-auto w-[220px] md:w-[250px]">
                <PhoneShot src={owners.screen.src} alt={owners.screen.alt} />
              </figure>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="s-section">
          <div className="wrap max-w-[860px]">
            <h2 id="faq-title" className="s-title">
              {faq.title}
            </h2>
            <div className="s-card mt-6 px-5 md:px-6">
              {faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line last:border-b-0">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-6 py-3 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="text-[22px] font-normal leading-none text-muted transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pb-5 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
