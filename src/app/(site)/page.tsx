import { appPreview, band, faq, hero, howItWorks, neighbourhoods, owners, showcase, site } from "@/content/site";
import { PLACES } from "@/demo/places";
import { NEIGHBOURHOODS } from "@/demo/data";
import { daysText } from "@/mock/owner";
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
// The website always shows the made-up places (never the private real-places build).
const shown = showcase.ids.map((id) => PLACES.find((p) => p.id === id)).filter((p) => !!p);
const hoods = NEIGHBOURHOODS.map((name) => {
  const here = PLACES.filter((p) => p.neighbourhood === name);
  const kinds = [...new Set(here.map((p) => p.kind.toLowerCase()))].slice(0, 3).join(", ");
  return { name, image: (here.find((p) => p.details.gallery.length) ?? here[0]).image, kinds: kinds.charAt(0).toUpperCase() + kinds.slice(1) };
});

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
              {hero.headline.split(hero.headlineItalicWord).map((part, i) => (
                <span key={i}>
                  {i > 0 && <em className="italic">{hero.headlineItalicWord}</em>}
                  {part}
                </span>
              ))}
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

        {/* A few example places, like a listing in the app */}
        <section id="offers" aria-labelledby="offers-title" className="s-section">
          <div className="wrap">
            <h2 id="offers-title" className="s-title">
              {showcase.title}
            </h2>
            <p className="s-lede mt-3 max-w-[48ch]">{showcase.intro}</p>
            {/* Phones: a row you swipe, like the app's. Wider: a grid. */}
            <ul className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 md:gap-5 lg:grid-cols-3">
              {shown.map((p) => (
                <li key={p.id} className="w-[78%] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                  <Link href={`/app/place/${p.id}`} className="s-card group block h-full">
                    <span className="relative block">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                      <img src={`${p.image}-640.webp`} alt="" width={640} height={427} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      {p.founding && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]">Founding Partner</span>}
                    </span>
                    <span className="block p-5">
                      <span className="block font-serif text-[28px] font-semibold leading-none tracking-[-0.01em]">{p.name}</span>
                      <span className="mt-1.5 block text-[15px] text-muted">
                        {p.kind} · {p.neighbourhood}
                      </span>
                      <span className="mt-3 block border-t border-line pt-3">
                        <span className="s-eyebrow block text-copper">{/upgrade/i.test(p.offer) ? "Free upgrade" : "Two for one"}</span>
                        <span className="mt-1 block text-[17px] font-semibold tracking-[-0.01em]">{p.offer}</span>
                        <span className="mt-0.5 block text-[15px] text-muted">{daysText(p.days)}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-muted">{showcase.caption}</p>
          </div>
        </section>

        {/* The six launch neighbourhoods */}
        <section aria-labelledby="hoods-title" className="s-section pt-0 md:pt-0">
          <div className="wrap">
            <h2 id="hoods-title" className="s-title">
              {neighbourhoods.title}
            </h2>
            <p className="s-lede mt-3 max-w-[48ch]">{neighbourhoods.intro}</p>
            <ul className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
              {hoods.map((h) => (
                <li key={h.name} className="relative w-[70%] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[16px] md:w-auto md:max-w-none">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img src={`${h.image}-640.webp`} alt="" width={640} height={427} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-4 bottom-4 text-white">
                    <span className="block font-serif text-[30px] font-semibold leading-none">{h.name}</span>
                    <span className="mt-1.5 block text-[15px] text-white/90">{h.kinds}</span>
                  </span>
                </li>
              ))}
            </ul>
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

        {/* A full-width photo */}
        <section aria-label={band.title} className="relative isolate">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
          <img src={`${band.image}-1200.webp`} alt={band.alt} width={1200} height={800} loading="lazy" decoding="async" className="h-[420px] w-full object-cover md:h-[560px]" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/0" aria-hidden="true" />
          <div className="wrap absolute inset-x-0 bottom-0 pb-10 text-white md:pb-14">
            <p className="font-serif text-[clamp(40px,5.4vw,72px)] font-semibold leading-[0.98] tracking-[-0.02em]">{band.title}</p>
            <p className="mt-3 text-[19px] text-white/90">{band.text}</p>
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
