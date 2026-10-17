import { appPreview, countdown, faq, hero, howItWorks, neighbourhoods, offers, owners, positioning, site } from "@/content/site";
import { PLACES } from "@/demo/places";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PassCard } from "@/components/PassCard";
import { PhoneShot } from "@/components/PhoneShot";
import { WaitlistForm } from "@/components/WaitlistForm";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { Countdown } from "@/components/Countdown";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";

/*
 * The home page: warm white, with colour in full-width bands (deep green
 * and peach), Cormorant headings, real photos and real screens from the app.
 * All words: src/content/site.ts.
 */
// The website always shows the made-up places (never the private real-places build).
const [front, back] = hero.cards.map((id) => PLACES.find((p) => p.id === id)!);
const num = (i: number) => String(i + 1).padStart(2, "0");

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="wrap pb-16 pt-8 md:pb-24 md:pt-14">
          <div className="grid items-center gap-14 md:grid-cols-[1fr_400px] md:gap-16 lg:grid-cols-[1fr_440px]">
            <div className="max-w-[560px]">
              <p className="inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-[14px] font-semibold shadow-card">
                <span className="rounded-full bg-peach px-2.5 py-0.5">{hero.date}</span>
                {hero.eyebrow}
              </p>
              <h1 id="hero-title" className="s-hero mt-6">
                {hero.headline.split(hero.headlineItalicWord).map((part, i) => (
                  <span key={i}>
                    {i > 0 && <em className="italic">{hero.headlineItalicWord}</em>}
                    {part}
                  </span>
                ))}
              </h1>
              <p className="s-lede mt-5 max-w-[34ch]">{hero.lede}</p>
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
            </div>
            {/* An example place, with a second one's photo tucked behind it */}
            <div className="relative mx-auto w-full max-w-[380px] md:max-w-none">
              <span aria-hidden="true" className="absolute -inset-x-3 -inset-y-5 -z-10 rounded-[36px] bg-peach-soft md:-inset-10 md:rounded-[44px]" />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
              <img
                src={`${back.image}-640.webp`}
                alt=""
                width={640}
                height={427}
                decoding="async"
                className="absolute -left-2 -top-10 hidden h-[300px] w-[72%] -rotate-[6deg] rounded-[22px] object-cover shadow-[0_30px_60px_-30px_rgba(15,46,51,0.5)] motion-reduce:rotate-0 md:block"
              />
              <PassCard place={front} className="relative md:ml-auto md:w-[88%] md:translate-y-6 md:rotate-[2deg] motion-reduce:rotate-0" />
            </div>
          </div>

          {/* Countdown to launch, on the deep green */}
          <div className="band-deep on-dark mt-16 rounded-[24px] p-5 md:mt-24 md:p-8">
            <p className="text-[14px] font-semibold text-sage">{countdown.label}</p>
            <div className="mt-4">
              <Countdown />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="how-title" className="band-deep on-dark s-section">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-10">
              <h2 id="how-title" className="s-title">
                {howItWorks.title} <em className="italic text-peach">{howItWorks.titleItalic}</em>
              </h2>
              <p className="max-w-[38ch] text-sage md:justify-self-end">{howItWorks.intro}</p>
            </div>
            <ol className="mt-10 grid border-t border-white/20 md:mt-14 md:grid-cols-3">
              {howItWorks.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[52px_1fr] gap-x-3 border-b border-white/20 py-6 md:block md:border-b-0 md:py-8 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8"
                >
                  <span aria-hidden="true" className="row-span-2 font-serif text-[46px] font-semibold italic leading-none text-peach md:text-[60px]">
                    {i + 1}
                  </span>
                  <h3 className="mt-1 text-[20px] font-semibold md:mt-5">{s.title}</h3>
                  <p className="mt-1.5 max-w-[30ch] text-sage">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What a pass gets you */}
        <section id="offers" aria-labelledby="offers-title" className="s-section bg-white">
          <div className="wrap">
            <div className="grid gap-4 md:grid-cols-2 md:items-end">
              <h2 id="offers-title" className="s-title">
                {offers.title}
              </h2>
              <p className="s-lede max-w-[34ch] md:justify-self-end">{offers.intro}</p>
            </div>
            <ul className="mt-10 border-t-[1.5px] border-ink md:mt-14">
              {offers.items.map((o, i) => (
                <li
                  key={o.category}
                  className="group grid grid-cols-[34px_1fr_92px] items-center gap-x-3 gap-y-1 border-b border-line py-5 md:grid-cols-[56px_minmax(0,0.8fr)_minmax(0,1.5fr)_200px] md:gap-x-6 md:py-6"
                >
                  <span aria-hidden="true" className="self-start font-serif text-[22px] italic text-copper md:self-center md:text-[26px]">
                    {num(i)}
                  </span>
                  <h3 className="self-end text-[12px] font-semibold uppercase tracking-[0.1em] text-muted md:self-center md:text-[13px]">{o.category}</h3>
                  <p className="col-start-2 self-start font-serif text-[26px] font-semibold leading-[1.08] md:col-start-3 md:row-start-1 md:self-center md:text-[36px]">{o.offer}</p>
                  <span className="col-start-3 row-span-2 row-start-1 block overflow-hidden rounded-[14px] md:col-start-4 md:row-span-1">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                    <img
                      src={`${o.image}-640.webp`}
                      alt={o.alt}
                      width={640}
                      height={427}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] md:aspect-[3/2]"
                    />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-muted">{offers.caption}</p>
          </div>
        </section>

        {/* The app */}
        <section id="app" aria-labelledby="app-title" className="band-deep on-dark s-section overflow-hidden">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-10">
              <div>
                <p className="s-eyebrow text-peach">{appPreview.eyebrow}</p>
                <h2 id="app-title" className="s-title mt-3">
                  {appPreview.title}
                </h2>
              </div>
              <div className="md:justify-self-end">
                <p className="max-w-[38ch] text-sage">{appPreview.text}</p>
                <p className="mt-4">
                  <Link href="/app" className="inline-block py-1 font-semibold text-mint underline decoration-peach decoration-2 underline-offset-[6px] hover:decoration-mint">
                    {appPreview.link}
                  </Link>
                </p>
              </div>
            </div>
            <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 pt-2 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-12 md:overflow-visible md:px-0">
              {appPreview.screens.map((sc, i) => (
                <li key={sc.src} className={`w-[64%] max-w-[270px] shrink-0 snap-center md:w-auto md:max-w-none ${i === 1 ? "md:-translate-y-6" : ""}`}>
                  <figure className="mx-auto max-w-[270px]">
                    <PhoneShot src={sc.src} alt={sc.alt} className="shadow-[0_0_0_7px_#05191c,0_0_0_8px_#2f5258,0_30px_60px_-20px_rgba(0,0,0,0.55)]" />
                    <figcaption className="mt-6 text-center text-sage">{sc.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] text-sage">{appPreview.label}</p>
          </div>
        </section>

        {/* Fewer places, better ones */}
        <section aria-labelledby="pos-title" className="s-section bg-peach-soft">
          <div className="wrap grid gap-10 md:grid-cols-2 md:gap-16">
            <h2 id="pos-title" className="font-serif text-[clamp(56px,8vw,112px)] font-semibold leading-[0.92] tracking-[-0.025em]">
              {positioning.title}
              <br />
              <em className="italic">{positioning.titleItalic}</em>
            </h2>
            <ul className="self-end border-t border-ink/25">
              {positioning.points.map((p) => (
                <li key={p.title} className="border-b border-ink/25 py-5">
                  <h3 className="text-[18px] font-semibold">{p.title}</h3>
                  <p className="mt-1 text-ink/80">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Neighbourhoods */}
        <section id="neighbourhoods" aria-labelledby="hood-title" className="s-section">
          <div className="wrap">
            <div className="grid gap-4 md:grid-cols-2 md:items-end">
              <h2 id="hood-title" className="s-title">
                {neighbourhoods.title}
              </h2>
              <p className="s-lede max-w-[34ch] md:justify-self-end">{neighbourhoods.intro}</p>
            </div>
            <ol className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-3 md:gap-5">
              {neighbourhoods.items.map((n, i) => (
                <li key={n.name} className="group relative overflow-hidden rounded-[18px] bg-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img
                    src={`${n.image}-640.webp`}
                    alt=""
                    width={640}
                    height={427}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:aspect-[4/3]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/25 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-3 bottom-3 text-mint md:inset-x-5 md:bottom-5">
                    <span className="block text-[12px] font-semibold tracking-[0.1em] text-peach">
                      <span className="sr-only">Neighbourhood </span>
                      {num(i)}
                    </span>
                    <span className="mt-1 block font-serif text-[24px] font-semibold leading-none md:text-[32px]">{n.name}</span>
                    <span className="mt-1.5 hidden text-[15px] text-mint/90 sm:block">{n.kinds}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* For owners */}
        <section id="owners" aria-labelledby="owners-title" className="s-section overflow-hidden bg-white">
          <div className="wrap grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-20">
            <div className="max-w-[580px]">
              <p className="s-eyebrow text-copper">{owners.eyebrow}</p>
              <h2 id="owners-title" className="s-title mt-3">
                {owners.title}
              </h2>
              <p className="mt-5 text-[19px] leading-snug">{owners.text}</p>
              <ul className="mt-7 border-t border-line">
                {owners.points.map((p) => (
                  <li key={p} className="flex gap-3 border-b border-line py-3.5">
                    <span aria-hidden="true" className="mt-[9px] size-2 shrink-0 rounded-full bg-peach ring-1 ring-ink/50" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-muted">{owners.contactLead}</p>
              <p className="mt-1 font-serif text-[clamp(30px,3.4vw,40px)] font-semibold italic">
                <a href={`mailto:${site.email}`} className="underline decoration-peach decoration-[3px] underline-offset-[7px] hover:decoration-ink">
                  {site.email}
                </a>
              </p>
              <p className="mt-6">
                <Link href="/owners" className="s-btn">
                  {owners.more}
                </Link>
              </p>
            </div>
            <figure className="relative mx-auto w-[230px] md:w-[270px]">
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-peach-soft md:size-[420px]" />
              <PhoneShot src={owners.screen.src} alt={owners.screen.alt} className="relative" />
            </figure>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="s-section">
          <div className="wrap grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 id="faq-title" className="s-title">
              {faq.title}
            </h2>
            <div className="border-t-[1.5px] border-ink">
              {faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[18px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-peach-soft text-xl leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[56ch] pb-6 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Opening day */}
        <section data-waitlist-cta aria-labelledby="open-title" className="band-deep on-dark s-section">
          <div className="wrap grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
            <div>
              <h2 id="open-title" className="font-serif text-[clamp(52px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.02em]">
                {countdown.title}
              </h2>
              <p className="mt-4 max-w-[40ch] text-[19px] text-sage">{countdown.text}</p>
            </div>
            <OpenWaitlistButton className="s-btn s-btn-peach self-start md:self-end">{countdown.cta}</OpenWaitlistButton>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
