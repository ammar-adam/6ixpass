import {
  appStrip,
  closing,
  countdown,
  faq,
  founders,
  hero,
  launchAreas,
  offers,
  owners,
  placesPreview,
  site,
} from "@/content/site";
import Link from "next/link";
import { PLACES } from "@/demo/places";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileJoinBar } from "@/components/MobileJoinBar";
import { Phone } from "@/components/Phone";
import { WaitlistForm } from "@/components/WaitlistForm";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { Countdown } from "@/components/Countdown";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";
import { Reveal } from "@/components/Reveal";
import { PlaceCard } from "@/components/PlaceCard";
import { PartnerWall } from "@/components/PartnerWall";

const h2 = "font-serif text-[clamp(38px,4.4vw,60px)] font-normal leading-[1.02] tracking-[-0.015em] text-balance";
const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.16em] text-copper";
const num = (i: number) => String(i + 1).padStart(2, "0");
const pill = "inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-[15px] font-semibold";
const accentLink = "font-semibold text-ink underline decoration-copper decoration-2 underline-offset-4 hover:decoration-ink";

function Headline({ text, italic }: { text: string; italic: string }) {
  return (
    <>
      {text.split(italic).map((part, i) => (
        <span key={i}>
          {i > 0 && <em className="italic text-accent">{italic}</em>}
          {part}
        </span>
      ))}
    </>
  );
}

function Check() {
  return (
    <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-peach-soft text-copper">
      <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2.5 6.2l2.3 2.3 4.7-5" />
      </svg>
    </span>
  );
}

export default function Home() {
  const places = placesPreview.ids.map((id) => PLACES.find((p) => p.id === id)).filter((p) => p !== undefined);
  const areas = launchAreas.areas;

  return (
    <>
      <JsonLd data={faqLd} />
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="hero-glow relative overflow-hidden">
          <div className="wrap grid items-center gap-x-16 gap-y-12 pb-16 pt-8 md:grid-cols-[1.1fr_0.9fr] md:pb-24 md:pt-14">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full bg-white/80 py-1.5 pl-1.5 pr-3.5 text-sm font-medium shadow-card">
                <span className="rounded-full bg-ink px-2.5 py-0.5 text-[13px] font-semibold text-white">{site.launchShort}</span>
                {hero.eyebrow}
              </p>
              <h1 id="hero-title" className="mt-7 font-serif text-[clamp(56px,7.4vw,104px)] font-normal leading-[0.95] tracking-[-0.02em] text-balance">
                <Headline text={hero.headline} italic={hero.headlineItalicWord} />
              </h1>
              <p className="mt-6 max-w-[38ch] text-[17px] leading-relaxed text-ink/75 md:text-[18px]">{hero.lede}</p>
              <div id="join" className="mt-8 max-w-[540px] scroll-mt-24">
                <h2 className="sr-only">Join the waitlist</h2>
                <WaitlistForm placement="hero" />
                <p className="mt-3 text-sm text-muted">{hero.formNote}</p>
                {site.mailingAddress && <p className="mt-1 text-sm text-muted">{site.name}, {site.mailingAddress}</p>}
              </div>
            </div>
            {/* The app's opening screen, with two small cards floating beside it. */}
            <figure className="relative isolate mx-auto w-[230px] sm:w-[250px] md:mr-6 md:w-[300px]">
              <span aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(243_201_166/0.9),transparent)] blur-2xl" />
              <Phone src={hero.phone.src} alt={hero.phone.alt} priority sizes="(min-width: 768px) 300px, 250px" />
              {places[0] && (
                <div aria-hidden="true" className="bob absolute -left-10 top-[16%] flex items-center gap-3 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 shadow-card sm:-left-14 md:-left-24">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img src={`${places[0].image}-640.webp`} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                  <div className="leading-tight">
                    <p className="text-[12px] text-muted">{places[0].name}</p>
                    <p className="text-[14px] font-semibold">{places[0].offer.replace(/\.$/, "")}</p>
                  </div>
                </div>
              )}
              <div aria-hidden="true" className="bob-late absolute -right-8 bottom-[22%] flex items-center gap-2 rounded-full bg-night py-2 pl-2 pr-4 text-[14px] font-semibold text-white shadow-card md:-right-14">
                <span className="grid size-6 place-items-center rounded-full bg-ok">
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 6.2l2.3 2.3 4.7-5" />
                  </svg>
                </span>
                Redeemed. Enjoy!
              </div>
              <figcaption className="mt-6 text-balance text-center text-sm text-muted">{hero.phone.caption}</figcaption>
            </figure>
          </div>
        </section>

        {/* Neighbourhood ticker */}
        <div aria-hidden="true" className="overflow-hidden border-y border-line bg-mist py-3">
          <div className="marquee flex w-max gap-8 whitespace-nowrap font-serif text-[22px] italic text-ink/70">
            {[0, 1, 2, 3].flatMap((k) =>
              areas.map((a) => (
                <span key={`${k}-${a}`} className="flex items-center gap-8">
                  {a}
                  <span className="text-[14px] not-italic text-accent">✦</span>
                </span>
              )),
            )}
          </div>
        </div>

        {/* Countdown */}
        <section aria-labelledby="countdown-title" className="wrap py-14 md:py-20">
          <div data-reveal className="on-dark relative isolate grid gap-8 overflow-hidden rounded-[28px] bg-night bg-[radial-gradient(60%_120%_at_0%_0%,rgb(194_69_45/0.35),transparent_60%)] p-7 text-[#f3e9de] md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:p-12">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-peach">{countdown.eyebrow}</p>
              <h2 id="countdown-title" className="mt-3 max-w-[16ch] font-serif text-[clamp(32px,3.4vw,46px)] font-normal leading-[1.1]">{countdown.label}</h2>
            </div>
            <div className="md:w-[460px]">
              <Countdown />
            </div>
          </div>
        </section>

        {/* How a visit works: five real app screens */}
        <section id="how" aria-labelledby="how-title" className="pb-16 pt-4 md:pb-24">
          <div className="wrap">
            <p className={eyebrow}>{appStrip.eyebrow}</p>
            <h2 id="how-title" className={`${h2} mt-3`}>{appStrip.title}</h2>
            <p className="mt-4 max-w-[44ch] text-[17px] text-ink/75">{appStrip.intro}</p>
          </div>
          <div
            role="region"
            aria-label="How a visit works, five screens"
            tabIndex={0}
            className="no-scrollbar mx-auto mt-10 max-w-[1240px] snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain px-4 md:mt-12 md:scroll-px-10 md:px-10 min-[1200px]:overflow-visible"
          >
            <ol className="flex gap-5 pb-2 md:gap-6 min-[1200px]:grid min-[1200px]:grid-cols-5">
              {appStrip.screens.map((sc, i) => (
                <li key={sc.src} className="flex w-[64vw] max-w-[260px] shrink-0 snap-start flex-col gap-5 md:w-[240px] min-[1200px]:w-auto! min-[1200px]:max-w-none!">
                  <Phone src={sc.src} alt={sc.alt} sizes="(min-width: 1200px) 220px, (min-width: 768px) 240px, 64vw" />
                  <div className="flex gap-3">
                    <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[12px] font-semibold text-white">{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-[21px] leading-snug">{sc.caption}</h3>
                      <p className="mt-1 max-w-[26ch] text-[14px] leading-snug text-muted">{sc.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="wrap mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link href="/places" className={`${pill} self-start border border-line bg-white shadow-card hover:border-ink/30`}>
              {appStrip.link} <span aria-hidden="true">→</span>
            </Link>
            <p className="text-sm text-muted">{appStrip.label}</p>
          </div>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="offers-title" className="bg-mist py-16 md:py-24">
          <div className="wrap">
            <h2 id="offers-title" className={h2}>{offers.title}</h2>
            <p className="mt-4 max-w-[46ch] text-[17px] text-ink/75">{offers.intro}</p>
            <ul data-reveal className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
              {offers.items.map((o, i) => (
                <li key={o.category} className="group relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[24px] p-6 text-white shadow-card md:min-h-[460px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img
                    src={`${o.image}-1200.webp`}
                    srcSet={`${o.image}-640.webp 640w, ${o.image}-1200.webp 1200w`}
                    sizes="(min-width: 768px) 400px, 92vw"
                    alt={o.alt}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/0" />
                  <span aria-hidden="true" className="text-[12px] font-semibold tracking-[0.1em] text-peach">{num(i)}</span>
                  <h3 className="mt-1 font-serif text-[34px] leading-none">{o.category}</h3>
                  <p className="mt-3 text-[17px] font-semibold">{o.offer}</p>
                  <p className="mt-2 text-[14px] leading-snug text-white/85">{o.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">{offers.caption}</p>
          </div>
        </section>

        {/* Real Founding Partners (only once there are some) */}
        <PartnerWall className="pt-16 md:pt-24" />

        {/* Your new regulars: three example places */}
        <section id="places" aria-labelledby="places-title" className="py-16 md:py-24">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={eyebrow}>{placesPreview.eyebrow}</p>
                <h2 id="places-title" className={`${h2} mt-3`}>{placesPreview.title}</h2>
              </div>
              <Link href="/places" className="pb-2 text-[15px] font-semibold underline underline-offset-4">
                {placesPreview.link} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul data-reveal className="mt-10 grid gap-5 md:grid-cols-3">
              {places.map((p) => (
                <li key={p.id}>
                  <PlaceCard p={p} />
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">{placesPreview.note}</p>
          </div>
        </section>

        {/* Opening across the GTA */}
        <section id="where" aria-labelledby="where-title" className="wrap pb-4 md:pb-8">
          <div data-reveal className="grid gap-10 rounded-[28px] bg-[linear-gradient(120deg,#f8e1cf_0%,#f6d2b7_60%,#f3c9a6_100%)] p-7 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-14 md:p-14">
            <div>
              <h2 id="where-title" className={h2}>{launchAreas.title}</h2>
              <p className="mt-5 max-w-[38ch] text-[17px] text-ink/80">{launchAreas.text}</p>
              <p className="mt-5 max-w-[44ch] text-[15px] text-ink/80">
                {launchAreas.noteLead}{" "}
                <OpenWaitlistButton className={accentLink}>{launchAreas.noteLink}</OpenWaitlistButton>{" "}
                {launchAreas.noteTail}
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {areas.map((a) => (
                <li key={a} className="rounded-2xl bg-white/70 px-5 py-4 font-serif text-[22px] leading-tight shadow-[0_1px_2px_rgb(42_31_25/0.06)]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* For owners */}
        <section id="owners" aria-labelledby="owners-title" className="py-16 md:py-24">
          <div data-reveal className="wrap grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-20">
            <div className="max-w-[600px]">
              <p className={eyebrow}>{owners.eyebrow}</p>
              <h2 id="owners-title" className={`${h2} mt-3`}>{owners.title}</h2>
              <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ink/75">{owners.text}</p>
              <ul className="mt-7 grid gap-3.5">
                {owners.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[16px]">
                    <Check />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/owners#apply" className={`${pill} bg-accent text-white shadow-[0_8px_20px_-10px_rgb(194_69_45/0.8)] hover:bg-accent-2`}>
                  {owners.apply}
                </Link>
                <Link href="/owners" className={`${pill} border border-line bg-white hover:border-ink/30`}>
                  {owners.more}
                </Link>
              </div>
            </div>
            <figure className="mx-auto w-[250px] md:w-[280px]">
              <Phone src={owners.screen.src} alt={owners.screen.alt} sizes="(min-width: 768px) 280px, 250px" />
              <figcaption className="mt-5 text-balance text-center text-sm text-muted">{owners.screen.caption}</figcaption>
            </figure>
          </div>
        </section>

        {/* A note from Nida */}
        <section aria-labelledby="founders-title" className="bg-mist py-16 md:py-24">
          <div data-reveal className="wrap mx-auto max-w-[820px] text-center">
            <h2 id="founders-title" className={h2}>{founders.title}</h2>
            <figure className="relative mt-10 rounded-[28px] bg-paper px-6 pb-10 pt-14 shadow-card md:px-14 md:pt-16">
              <span aria-hidden="true" className="absolute left-1/2 top-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent font-serif text-[44px] leading-none text-white">
                <span className="mt-4">“</span>
              </span>
              <blockquote className="font-serif text-[clamp(24px,2.6vw,32px)] leading-[1.35] text-ink/90 text-balance">
                <p>{founders.body.slice(0, 2).join(" ")}</p>
              </blockquote>
              {founders.body[2] && (
                <p className="mx-auto mt-6 max-w-[48ch] text-[16px] leading-relaxed text-muted">
                  {founders.body[2].split(site.email).map((part, i) => (
                    <span key={i}>
                      {i > 0 && (
                        <a href={`mailto:${site.email}`} className={accentLink}>
                          {site.email}
                        </a>
                      )}
                      {part}
                    </span>
                  ))}
                </p>
              )}
              <figcaption className="mt-8">
                <span className="block font-serif text-[30px] italic leading-none text-copper">{founders.signoff}</span>
                <span className="mt-2 block text-sm text-muted">{founders.signoffLine}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="py-16 md:py-24">
          <div className="wrap grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div className="md:sticky md:top-28 md:self-start">
              <h2 id="faq-title" className={h2}>{faq.title}</h2>
              <p className="mt-5 max-w-[30ch] text-[16px] text-muted">
                {faq.more}{" "}
                <a href={`mailto:${site.email}`} className={accentLink}>
                  {site.email}
                </a>
                .
              </p>
            </div>
            <div className="border-t border-line">
              {faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 font-serif text-[22px] leading-snug [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3.5 6l4.5 4.5L12.5 6" />
                    </svg>
                  </summary>
                  <p className="max-w-[58ch] pb-6 text-[16px] leading-relaxed text-ink/75">
                    {f.a}
                    {"link" in f && f.link && (
                      <>
                        {" "}
                        <Link href={f.link.href} className="font-semibold text-ink underline underline-offset-4">
                          {f.link.label}
                        </Link>
                      </>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing join, on a photo */}
        <section aria-labelledby="closing-title" data-waitlist-cta className="wrap pb-16 md:pb-24">
          <div data-reveal className="on-dark relative isolate grid gap-8 overflow-hidden rounded-[28px] p-7 text-white md:grid-cols-2 md:items-center md:gap-14 md:p-12">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img
              src="/demo/marigold-room-2-1200.webp"
              alt=""
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(30_23_19/0.92)_0%,rgb(30_23_19/0.78)_45%,rgb(30_23_19/0.45)_100%)]" />
            <div>
              <h2 id="closing-title" className="font-serif text-[clamp(36px,4vw,54px)] font-normal leading-[1.05]">{closing.title}</h2>
              <p className="mt-4 max-w-[36ch] text-[17px] text-white/85">{closing.text}</p>
            </div>
            <div className="on-light rounded-[20px] bg-paper p-5 text-ink md:p-7">
              <WaitlistForm placement="footer" />
              <p className="mt-3 text-sm text-muted">{hero.formNote}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MobileJoinBar />
      <WaitlistPopup />
      <Reveal />
    </>
  );
}
