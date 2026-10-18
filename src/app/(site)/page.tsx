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
  site,
} from "@/content/site";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileJoinBar } from "@/components/MobileJoinBar";
import { Phone } from "@/components/Phone";
import { WaitlistForm } from "@/components/WaitlistForm";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { Countdown } from "@/components/Countdown";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";

const h2 = "font-serif text-[clamp(34px,3.9vw,52px)] font-semibold leading-[1.02] tracking-[-0.02em] text-balance";
const eyebrow = "text-sm font-semibold uppercase tracking-[0.12em]";
const num = (i: number) => String(i + 1).padStart(2, "0");

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="wrap grid items-center gap-x-16 gap-y-10 pb-14 pt-6 md:grid-cols-[1.15fr_0.85fr] md:pb-20 md:pt-12">
          <div>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold shadow-card">
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-white">{site.launchShort}</span>
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className="mt-6 font-serif text-[clamp(46px,6.2vw,84px)] font-semibold leading-[0.98] tracking-[-0.025em] text-balance">
              {hero.headline.split(hero.headlineItalicWord).map((part, i) => (
                <span key={i}>
                  {i > 0 && <em className="italic">{hero.headlineItalicWord}</em>}
                  {part}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-[36ch] text-[17px] leading-relaxed text-muted md:text-[19px]">{hero.lede}</p>
            <div id="join" className="mt-8 max-w-[560px] scroll-mt-24">
              <h2 className="sr-only">Join the waitlist</h2>
              <WaitlistForm placement="hero" />
              <p className="mt-3 text-sm text-muted">{hero.formNote}</p>
              <p className="mt-1 text-sm text-muted">{hero.areasLine}</p>
              <p className="mt-2 text-sm">
                <a href="#how" className="inline-block py-1 font-semibold text-ink underline underline-offset-4">
                  {hero.appLink}
                </a>
              </p>
              {site.mailingAddress && <p className="mt-1 text-sm text-muted">{site.name}, {site.mailingAddress}</p>}
            </div>
          </div>
          {/* Countdown: under the join form on phones, a slim bar under the hero row on wider screens. */}
          <div className="on-dark grid gap-4 rounded-[20px] bg-ink p-5 text-mist md:col-span-2 md:row-start-2 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:px-8 md:py-6">
            <p className="text-sm font-semibold text-pale md:max-w-[22ch] md:text-[17px] md:leading-snug md:text-mist">{countdown.label}</p>
            <div className="md:w-[520px]">
              <Countdown />
            </div>
          </div>
          {/* The app's opening screen. On phones it comes after the countdown, so the form stays near the top. */}
          <figure className="mx-auto w-[260px] md:col-start-2 md:row-start-1 md:mr-0 md:w-[300px]">
            <Phone src={hero.phone.src} alt={hero.phone.alt} priority sizes="(min-width: 768px) 300px, 260px" />
            <figcaption className="mt-5 text-center text-sm text-muted">{hero.phone.caption}</figcaption>
          </figure>
        </section>

        {/* How a visit works: five real app screens */}
        <section id="how" aria-labelledby="how-title" className="on-dark bg-ink py-16 text-mist md:py-24">
          <div className="wrap">
            <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-10">
              <div>
                <p className={`${eyebrow} text-pale`}>{appStrip.eyebrow}</p>
                <h2 id="how-title" className={`${h2} mt-4`}>{appStrip.title}</h2>
              </div>
              <p className="max-w-[38ch] text-lg text-pale md:justify-self-end">{appStrip.intro}</p>
            </div>
          </div>
          <div
            role="region"
            aria-label="How a visit works, five screens"
            tabIndex={0}
            className="no-scrollbar mx-auto mt-10 max-w-[1360px] snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain px-4 md:mt-14 md:scroll-px-10 md:px-10 min-[1200px]:overflow-visible"
          >
            <ol className="flex gap-5 pb-2 md:gap-7 min-[1200px]:grid min-[1200px]:grid-cols-5">
              {appStrip.screens.map((sc, i) => (
                <li key={sc.src} className="flex w-[72vw] max-w-[300px] shrink-0 snap-start flex-col gap-5 md:w-[280px] min-[1200px]:w-auto min-[1200px]:max-w-none">
                  <div className="flex gap-3">
                    <span aria-hidden="true" className="w-5 shrink-0 font-serif text-[30px] font-semibold italic leading-none text-peach">{i + 1}</span>
                    <div>
                      <h3 className="text-[17px] font-semibold leading-snug text-mist">{sc.caption}</h3>
                      <p className="mt-1 max-w-[26ch] text-[15px] leading-snug text-pale">{sc.text}</p>
                    </div>
                  </div>
                  <Phone src={sc.src} alt={sc.alt} onDark sizes="(min-width: 1200px) 250px, (min-width: 768px) 280px, 72vw" className="mt-auto" />
                </li>
              ))}
            </ol>
          </div>
          <div className="wrap mt-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm text-pale">{appStrip.label}</p>
            <Link href="/app" className="font-semibold text-mist underline underline-offset-4">
              {appStrip.link}
            </Link>
          </div>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="offers-title" className="py-16 md:py-24">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end">
              <h2 id="offers-title" className={h2}>{offers.title}</h2>
              <p className="max-w-[38ch] text-lg text-muted md:justify-self-end">{offers.intro}</p>
            </div>
            <ul className="mt-10 overflow-hidden rounded-[20px] bg-white px-5 shadow-card md:mt-14 md:px-8">
              {offers.items.map((o, i) => (
                <li
                  key={o.category}
                  className="grid grid-cols-[40px_1fr_88px] items-center gap-x-3 gap-y-1 border-b border-line py-5 last:border-b-0 md:grid-cols-[56px_minmax(0,0.7fr)_minmax(0,1.5fr)_220px] md:gap-x-6 md:py-5"
                >
                  <span aria-hidden="true" className="self-start font-serif text-xl italic text-copper md:self-center md:text-2xl">{num(i)}</span>
                  <h3 className="self-end text-[12px] font-semibold uppercase tracking-[0.08em] text-copper md:self-center md:text-[13px]">{o.category}</h3>
                  <div className="col-start-2 self-start md:col-start-3 md:row-start-1 md:self-center">
                    <p className="font-serif text-[26px] leading-[1.1] md:text-[28px]">{o.offer}</p>
                    <p className="mt-1.5 text-[15px] leading-snug text-muted">{o.detail}</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img
                    src={`${o.image}-640.webp`}
                    alt={o.alt}
                    width={640}
                    height={427}
                    loading="lazy"
                    decoding="async"
                    className="col-start-3 row-span-2 row-start-1 aspect-square w-full self-start rounded-[12px] object-cover md:col-start-4 md:row-span-1 md:aspect-[16/10] md:self-center"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{offers.caption}</p>
          </div>
        </section>

        {/* Where we open first */}
        <section id="where" aria-labelledby="where-title" className="border-t border-line py-16 md:py-24">
          <div className="wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <h2 id="where-title" className={h2}>{launchAreas.title}</h2>
              <p className="mt-5 max-w-[34ch] text-lg text-muted">{launchAreas.text}</p>
            </div>
            <div>
              <ul className="grid grid-cols-2 gap-x-8 border-t border-line md:grid-cols-3">
                {launchAreas.areas.map((a) => (
                  <li key={a} className="border-b border-line py-4 font-serif text-[24px] leading-tight md:text-[28px]">
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-muted">
                {launchAreas.noteLead}{" "}
                <OpenWaitlistButton className="font-semibold text-ink underline decoration-copper decoration-2 underline-offset-4 hover:decoration-ink">
                  {launchAreas.noteLink}
                </OpenWaitlistButton>{" "}
                {launchAreas.noteTail}
              </p>
            </div>
          </div>
        </section>

        {/* For owners */}
        <section id="owners" aria-labelledby="owners-title" className="border-t border-line py-16 md:py-24">
          <div className="wrap grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-20">
            <div className="max-w-[580px]">
              <p className={`${eyebrow} text-copper`}>{owners.eyebrow}</p>
              <h2 id="owners-title" className={`${h2} mt-4`}>{owners.title}</h2>
              <p className="mt-5 max-w-[40ch] text-[19px] leading-relaxed">{owners.text}</p>
              <ul className="mt-7 border-t border-line">
                {owners.points.map((pt) => (
                  <li key={pt} className="flex gap-3 border-b border-line py-3.5">
                    <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-copper" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/owners" className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 text-[16px] font-semibold text-white hover:bg-ink-2">
                  {owners.more}
                </Link>
                <p className="text-muted">
                  {owners.contactLead}:{" "}
                  <a href={`mailto:${site.email}`} className="font-semibold text-ink underline decoration-copper decoration-2 underline-offset-4 hover:decoration-ink">
                    {site.email}
                  </a>
                </p>
              </div>
            </div>
            <figure className="mx-auto w-[250px] md:w-[280px]">
              <Phone src={owners.screen.src} alt={owners.screen.alt} sizes="(min-width: 768px) 280px, 250px" />
              <figcaption className="mt-5 text-center text-sm text-muted">{owners.screen.caption}</figcaption>
            </figure>
          </div>
        </section>

        {/* From the founders */}
        <section aria-labelledby="founders-title" className="bg-mist py-16 md:py-24">
          <div className="wrap">
            <div className="max-w-[640px]">
              <p className={`${eyebrow} text-copper`}>{founders.eyebrow}</p>
              <h2 id="founders-title" className={`${h2} mt-4`}>{founders.title}</h2>
              <div className="mt-7 space-y-4 text-lg leading-relaxed">
                {founders.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-8 font-serif text-[28px] italic leading-none">{founders.signoff}</p>
              <p className="mt-2 text-muted">{founders.signoffLine}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="py-16 md:py-24">
          <div className="wrap grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 id="faq-title" className={h2}>{faq.title}</h2>
            <div className="overflow-hidden rounded-[20px] bg-white px-5 shadow-card md:px-7">
              {faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line last:border-b-0">
                  <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-xl leading-none transition-transform group-open:rotate-45 motion-reduce:transition-none">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[56ch] pb-6 text-muted">
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

        {/* Closing join */}
        <section aria-labelledby="closing-title" data-waitlist-cta className="on-dark bg-ink py-16 text-mist md:py-20">
          <div className="wrap grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <h2 id="closing-title" className={h2}>{closing.title}</h2>
              <p className="mt-4 max-w-[36ch] text-lg text-pale">{closing.text}</p>
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
    </>
  );
}
