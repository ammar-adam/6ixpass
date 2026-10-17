import {
  appPreview,
  countdown,
  faq,
  hero,
  howItWorks,
  offers,
  owners,
  site,
} from "@/content/site";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PassCard } from "@/components/PassCard";
import { MobileJoinBar } from "@/components/MobileJoinBar";
import { PhoneShot } from "@/components/PhoneShot";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WaitlistPopup } from "@/components/WaitlistPopup";
import { Countdown } from "@/components/Countdown";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";
import { ownersPage } from "@/content/owners";

const h2 = "font-serif text-[clamp(34px,3.9vw,52px)] font-semibold leading-[1.02] tracking-[-0.02em] text-balance";
const num = (i: number) => String(i + 1).padStart(2, "0");

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="wrap grid items-center gap-12 pb-16 pt-6 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:pb-24 md:pt-14">
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
            <div id="join" className="mt-8 max-w-[520px] scroll-mt-6">
              <h2 className="sr-only">Join the waitlist</h2>
              <WaitlistForm placement="hero" />
              <p className="mt-3 text-sm text-muted">{hero.formNote}</p>
              {site.mailingAddress && <p className="mt-1 text-sm text-muted">{site.name}, {site.mailingAddress}</p>}
            </div>
          </div>
          {/* Countdown: under the join form on phones, full width under the hero row on wider screens. */}
          <div className="on-dark rounded-[20px] bg-ink p-4 text-mist sm:p-5 md:col-span-2 md:row-start-2">
            <p className="mb-3 text-sm font-semibold text-pale">{countdown.label}</p>
            <Countdown />
          </div>
          <div className="flex md:justify-end">
            <PassCard />
          </div>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="offers-title" className="py-16 md:py-24">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end">
              <h2 id="offers-title" className={h2}>{offers.title}</h2>
              <p className="max-w-[38ch] text-muted md:justify-self-end">{offers.intro}</p>
            </div>
            <ul className="mt-10 overflow-hidden rounded-[20px] bg-white px-5 shadow-card md:mt-14 md:px-8">
              {offers.items.map((o, i) => (
                <li
                  key={o.category}
                  className="grid grid-cols-[40px_1fr_88px] items-center gap-x-3 gap-y-1 border-b border-line py-5 last:border-b-0 md:grid-cols-[64px_minmax(0,0.8fr)_minmax(0,1.4fr)_168px] md:gap-x-6 md:py-6"
                >
                  <span aria-hidden="true" className="self-start font-serif text-xl italic text-copper md:self-center md:text-2xl">{num(i)}</span>
                  <h3 className="self-end text-[12px] font-semibold uppercase tracking-[0.08em] text-copper md:self-center md:text-[13px]">{o.category}</h3>
                  <p className="col-start-2 self-start font-serif text-[26px] leading-[1.1] md:col-start-3 md:row-start-1 md:self-center md:text-[30px]">
                    {o.offer}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img
                    src={`${o.image}-640.webp`}
                    alt={o.alt}
                    width={640}
                    height={427}
                    loading="lazy"
                    decoding="async"
                    className="col-start-3 row-span-2 row-start-1 aspect-square w-full rounded-[12px] object-cover md:col-start-4 md:row-span-1 md:aspect-[4/3]"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{offers.caption}</p>
          </div>
        </section>

        {/* For owners */}
        <section id="owners" aria-labelledby="owners-title" className="py-16 md:py-24">
          <div className="wrap grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{owners.eyebrow}</p>
              <h2 id="owners-title" className={`${h2} mt-4`}>{owners.title}</h2>
              <p className="mt-5 max-w-[40ch] text-[19px] leading-relaxed">{owners.text}</p>
              <p className="mt-8 text-muted">{owners.contactLead}</p>
              <p className="mt-1 font-serif text-[clamp(26px,2.8vw,34px)] italic">
                <a href={`mailto:${site.email}`} className="underline decoration-copper decoration-2 underline-offset-[6px] hover:decoration-ink">
                  {site.email}
                </a>
              </p>
              <p className="mt-6">
                <Link href="/owners" className="font-semibold underline underline-offset-4">
                  {owners.more}
                </Link>
              </p>
            </div>
            <figure className="mx-auto w-[260px] md:mr-0 md:w-[300px]">
              <PhoneShot src={ownersPage.control.screen.src} alt={ownersPage.control.screen.alt} />
            </figure>
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-0 border-t border-ink/10 py-16 md:py-24">
          <div className="wrap">
            <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-10">
              <h2 id="how-title" className={h2}>
                {howItWorks.title}{howItWorks.titleItalic && <> <em className="italic">{howItWorks.titleItalic}</em></>}
              </h2>
              <p className="max-w-[36ch] text-muted md:justify-self-end">{howItWorks.intro}</p>
            </div>
            <ol className="mt-10 grid gap-3 md:mt-16 md:grid-cols-3 md:gap-5">
              {howItWorks.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[56px_1fr] gap-x-3 rounded-[20px] bg-white p-6 shadow-card md:block md:p-8"
                >
                  <span aria-hidden="true" className="row-span-2 font-serif text-[40px] font-semibold italic leading-none text-copper md:text-[48px]">
                    {i + 1}
                  </span>
                  <h3 className="mt-1 text-[19px] font-semibold md:mt-4">{s.title}</h3>
                  <p className="mt-1.5 max-w-[30ch] text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* App preview */}
        <section id="app" aria-labelledby="app-title" className="on-dark bg-ink py-16 text-mist md:py-24">
          <div className="wrap">
            <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-pale">{appPreview.eyebrow}</p>
                <h2 id="app-title" className={`${h2} mt-4`}>{appPreview.title}</h2>
              </div>
              <div className="md:justify-self-end">
                <p className="max-w-[38ch] text-pale">{appPreview.text}</p>
                <p className="mt-4">
                  <Link href="/app" className="font-semibold text-mist underline underline-offset-4">
                    {appPreview.link}
                  </Link>
                </p>
              </div>
            </div>
            <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
              {appPreview.screens.map((sc) => (
                <li key={sc.src} className="w-[72%] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none">
                  <figure>
                    <PhoneShot src={sc.src} alt={sc.alt} />
                    <figcaption className="mt-3 text-pale">{sc.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-pale">{appPreview.label}</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="py-16 md:py-24">
          <div className="wrap grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 id="faq-title" className={h2}>{faq.title}</h2>
            <div className="self-start overflow-hidden rounded-[20px] bg-white px-5 shadow-card md:px-7">
              {faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-xl leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[56ch] pb-6 text-muted">{f.a}</p>
                </details>
              ))}
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
