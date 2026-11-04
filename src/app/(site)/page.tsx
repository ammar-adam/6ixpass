import {
  appStrip,
  closing,
  faq,
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
        {/* Hero: fits one screen (banner and header included). */}
        <section aria-labelledby="hero-title" className="hero-glow relative overflow-hidden">
          <div className="wrap grid items-center gap-x-12 gap-y-10 py-8 md:min-h-[calc(100svh-112px)] md:grid-cols-[1.15fr_0.85fr] md:py-6">
            <div>
              <h1 id="hero-title" className="rise font-serif text-[clamp(50px,6.4vw,88px)] font-normal leading-[0.95] tracking-[-0.02em] text-balance">
                <Headline text={hero.headline} italic={hero.headlineItalicWord} />
              </h1>
              <p className="rise mt-5 max-w-[40ch] text-[17px] leading-relaxed text-ink/80 [--d:120ms] md:text-[18px]">{hero.lede}</p>
              <div id="join" className="rise mt-6 max-w-[540px] scroll-mt-28 [--d:240ms]">
                <h2 className="sr-only">Join the waitlist</h2>
                <WaitlistForm placement="hero" />
                <p className="mt-2.5 text-sm text-muted">{hero.formNote}</p>
              </div>
              <ul className="rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-ink-2 [--d:360ms]">
                {hero.facts.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* The app's opening screen, with two small cards floating beside it. */}
            <figure className="rise relative isolate mx-auto [--d:200ms] w-[210px] sm:w-[230px] md:mr-8 md:w-[min(260px,32svh)]">
              <span aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(243_201_166/0.9),transparent)] blur-2xl" />
              <Phone src={hero.phone.src} alt={hero.phone.alt} priority sizes="(min-width: 768px) 260px, 230px" />
              {places[0] && (
                <div aria-hidden="true" className="bob absolute -left-10 top-[16%] flex items-center gap-3 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 shadow-card sm:-left-14 md:-left-24">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img src={`${places[0].image}-640.webp`} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                  <div className="leading-tight">
                    <p className="text-[12px] text-muted">{places[0].name} (example)</p>
                    <p className="text-[14px] font-semibold">{places[0].offer.replace(/\.$/, "")}</p>
                  </div>
                </div>
              )}
              <div aria-hidden="true" className="bob-late absolute -bottom-5 -right-6 flex items-center gap-2 rounded-full bg-night py-2 pl-2 pr-4 text-[14px] font-semibold text-white shadow-card md:-right-14">
                <span className="grid size-6 place-items-center rounded-full bg-ok">
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 6.2l2.3 2.3 4.7-5" />
                  </svg>
                </span>
                Redeemed. Enjoy!
              </div>
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

        {/* How a visit works: five real app screens, sized to fit one screen. */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-24 py-12 md:py-14">
          <div className="wrap flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={eyebrow}>{appStrip.eyebrow}</p>
              <h2 id="how-title" className="mt-2 font-serif text-[clamp(34px,3.6vw,50px)] font-normal leading-[1.02] tracking-[-0.015em]">{appStrip.title}</h2>
              <p className="mt-2 max-w-[44ch] text-[16px] text-ink/75">{appStrip.intro}</p>
            </div>
            <OpenWaitlistButton className={`${pill} border border-line bg-white shadow-card hover:border-ink/30`}>
              {appStrip.link} <span aria-hidden="true">→</span>
            </OpenWaitlistButton>
          </div>
          <div
            role="region"
            aria-label="How a visit works, five screens"
            tabIndex={0}
            className="no-scrollbar mx-auto mt-8 max-w-[1240px] snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain px-4 md:scroll-px-10 md:px-10 min-[1100px]:overflow-visible"
          >
            <ol data-stagger className="flex gap-5 pb-2 min-[1100px]:grid min-[1100px]:grid-cols-5">
              {appStrip.screens.map((sc, i) => (
                <li key={sc.src} className="flex w-[52vw] max-w-[200px] shrink-0 snap-start flex-col gap-4 min-[1100px]:w-auto! min-[1100px]:max-w-none!">
                  <Phone src={sc.src} alt={sc.alt} sizes="(min-width: 1100px) 190px, 52vw" className="mx-auto w-full max-w-[min(190px,24svh)]" />
                  <div className="flex gap-2.5">
                    <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[12px] font-semibold text-white">{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-[19px] leading-snug">{sc.caption}</h3>
                      <p className="mt-0.5 max-w-[26ch] text-[13px] leading-snug text-muted">{sc.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="offers-title" className="bg-mist py-16 md:py-24">
          <div className="wrap">
            <h2 id="offers-title" className={h2}>{offers.title}</h2>
            <p className="mt-4 max-w-[46ch] text-[17px] text-ink/75">{offers.intro}</p>
            <ul data-stagger className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
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
          </div>
        </section>

        {/* Real Founding Partners (only once there are some) */}
        <PartnerWall className="pt-16 md:pt-24" />

        {/* One sample business, so people can picture it. Not a partner. */}
        {places[0] && (
          <section id="places" aria-labelledby="places-title" className="py-16 md:py-24">
            <div className="wrap grid gap-10 md:grid-cols-[1fr_minmax(0,420px)] md:items-center md:gap-16">
              <div data-reveal>
                <p className={eyebrow}>{placesPreview.eyebrow}</p>
                <h2 id="places-title" className={`${h2} mt-3`}>{placesPreview.title}</h2>
                <p className="mt-5 max-w-[42ch] text-[17px] text-ink/80">{placesPreview.text}</p>
                <OpenWaitlistButton className={`${pill} mt-7 bg-accent text-white hover:bg-accent-2`}>
                  {placesPreview.link} <span aria-hidden="true">→</span>
                </OpenWaitlistButton>
              </div>
              <div data-reveal>
                <PlaceCard p={places[0]} />
              </div>
            </div>
          </section>
        )}

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
        <section id="owners" aria-labelledby="owners-title" className="scroll-mt-24 py-12 md:py-16">
          <div data-reveal className="wrap">
            <div className="grid items-center gap-10 overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#f8e1cf_0%,#f6d2b7_60%,#f3c9a6_100%)] px-6 pt-8 md:grid-cols-[1fr_auto] md:gap-14 md:px-12 md:pt-0">
              <div className="max-w-[600px] md:py-12">
                <p className={eyebrow}>{owners.eyebrow}</p>
                <h2 id="owners-title" className={`${h2} mt-3`}>{owners.title}</h2>
                <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed text-ink/80">{owners.text}</p>
                <ul className="mt-6 grid gap-3">
                  {owners.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[16px]">
                      <Check />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/owners#apply" className={`${pill} bg-accent text-white shadow-[0_8px_20px_-10px_rgb(194_69_45/0.8)] hover:bg-accent-2`}>
                    {owners.apply}
                  </Link>
                  <Link href="/owners/how-it-works" className={`${pill} border border-ink/15 bg-white/80 hover:border-ink/30`}>
                    {owners.more}
                  </Link>
                </div>
              </div>
              {/* The owner view, whole and centred beside the text. */}
              <figure className="mx-auto w-[210px] pb-8 md:w-[230px] md:py-10">
                <Phone src={owners.screen.src} alt={owners.screen.alt} sizes="230px" />
              </figure>
            </div>
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
          <div data-reveal className="on-dark relative isolate grid gap-8 overflow-hidden rounded-[28px] p-7 text-white md:p-12 lg:grid-cols-2 lg:items-center lg:gap-14">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img
              src="/demo/dimsum-1200.webp"
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
