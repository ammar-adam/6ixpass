import {
  appPreview,
  countdown,
  faq,
  hero,
  howItWorks,
  neighbourhoods,
  offers,
  owners,
  positioning,
  site,
} from "@/content/site";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PassCard } from "@/components/PassCard";
import { MobileJoinBar } from "@/components/MobileJoinBar";
import { PhoneShot } from "@/components/PhoneShot";
import { WaitlistForm } from "@/components/WaitlistForm";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { Countdown } from "@/components/Countdown";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";

const h2 = "font-serif text-[clamp(38px,5vw,70px)] font-normal leading-none tracking-[-0.02em]";
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
            <p className="inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold">
              <span className="rounded-full bg-peach px-2.5 py-0.5">{site.launchShort}</span>
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className="mt-6 font-serif text-[clamp(50px,7.8vw,116px)] font-normal leading-[0.98] tracking-[-0.025em]">
              {hero.headline}{hero.headlineItalic && <> <em className="italic">{hero.headlineItalic}</em></>}
            </h1>
            <p className="mt-6 max-w-[33ch] text-lg text-muted md:text-xl">{hero.lede}</p>
            <div id="join" className="mt-8 max-w-[520px] scroll-mt-6">
              <h2 className="sr-only">Join the waitlist</h2>
              <WaitlistForm placement="hero" />
              <p className="mt-3 text-sm text-muted">{hero.formNote}</p>
              {site.mailingAddress && <p className="mt-1 text-sm text-muted">{site.name}, {site.mailingAddress}</p>}
            </div>
          </div>
          <div className="flex md:justify-end">
            <PassCard />
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-0 border-t border-ink/10 bg-white py-16 md:py-24">
          <div className="wrap">
            <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-10">
              <h2 id="how-title" className={h2}>
                {howItWorks.title}{howItWorks.titleItalic && <> <em className="italic">{howItWorks.titleItalic}</em></>}
              </h2>
              <p className="max-w-[36ch] text-muted md:justify-self-end">{howItWorks.intro}</p>
            </div>
            <ol className="mt-10 grid border-t border-ink/15 md:mt-16 md:grid-cols-3">
              {howItWorks.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[56px_1fr] gap-x-3 border-b border-ink/15 py-6 md:block md:border-b-0 md:py-7 md:pr-7 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-7"
                >
                  <span aria-hidden="true" className="row-span-2 font-serif text-[44px] italic leading-none text-muted md:text-[54px]">
                    {i + 1}
                  </span>
                  <h3 className="mt-1 text-[21px] font-semibold md:mt-4">{s.title}</h3>
                  <p className="mt-1.5 max-w-[30ch] text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Offers */}
        <section id="offers" aria-labelledby="offers-title" className="bg-white py-16 md:py-24">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end">
              <h2 id="offers-title" className={h2}>{offers.title}</h2>
              <p className="max-w-[36ch] text-lg text-muted md:justify-self-end">{offers.intro}</p>
            </div>
            <ul className="mt-10 border-t-[1.5px] border-ink md:mt-14">
              {offers.items.map((o, i) => (
                <li
                  key={o.category}
                  className="grid grid-cols-[40px_1fr_88px] items-center gap-x-3 gap-y-1 border-b border-ink/15 py-5 md:grid-cols-[64px_minmax(0,0.8fr)_minmax(0,1.4fr)_168px] md:gap-x-6 md:py-6"
                >
                  <span aria-hidden="true" className="self-start font-serif text-xl italic text-muted md:self-center md:text-2xl">{num(i)}</span>
                  <h3 className="self-end text-[13px] font-semibold uppercase tracking-[0.1em] md:self-center md:text-sm">{o.category}</h3>
                  <p className="col-start-2 self-start font-serif text-[26px] leading-[1.1] md:col-start-3 md:row-start-1 md:self-center md:text-[38px]">
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
                    className="col-start-3 row-span-2 row-start-1 aspect-square w-full rounded-[14px] object-cover md:col-start-4 md:row-span-1 md:aspect-[4/3]"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{offers.caption}</p>
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

        {/* Positioning */}
        <section aria-labelledby="pos-title" className="bg-mist py-16 md:py-24">
          <div className="wrap grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            <h2 id="pos-title" className="font-serif text-[clamp(52px,8vw,124px)] font-normal leading-[0.95] tracking-[-0.03em]">
              {positioning.title}{positioning.titleItalic && <> <em className="italic">{positioning.titleItalic}</em></>}
            </h2>
            <ul className="self-end border-t border-ink/30">
              {positioning.points.map((p) => (
                <li key={p.title} className="border-b border-ink/30 py-5">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-ink/85">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Neighbourhoods */}
        <section id="neighbourhoods" aria-labelledby="hood-title" className="py-16 md:py-24">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end">
              <h2 id="hood-title" className={h2}>{neighbourhoods.title}</h2>
              <p className="max-w-[36ch] text-lg text-muted md:justify-self-end">{neighbourhoods.intro}</p>
            </div>
            <ol className="mt-10 grid gap-x-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
              {neighbourhoods.items.map((n, i) => (
                <li key={n.name} className="flex gap-4 border-t-[1.5px] border-ink py-5 md:py-6">
                  <span aria-hidden="true" className="mt-2 size-3 shrink-0 rounded-full border-[1.8px] border-ink bg-peach" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      <span className="sr-only">Neighbourhood </span>{num(i)}
                    </p>
                    <h3 className="mt-1 font-serif text-[32px] leading-tight md:text-[38px]">{n.name}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* For owners */}
        <section id="owners" aria-labelledby="owners-title" className="bg-white py-16 md:py-24">
          <div className="wrap grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{owners.eyebrow}</p>
              <h2 id="owners-title" className={`${h2} mt-4`}>{owners.title}</h2>
              <p className="mt-6 max-w-[38ch] text-xl">{owners.text}</p>
              <ul className="mt-8 max-w-[52ch] border-t border-ink/15">
                {owners.points.map((p) => (
                  <li key={p} className="flex gap-3 border-b border-ink/15 py-3.5">
                    <span aria-hidden="true" className="mt-[9px] size-2 shrink-0 rounded-full bg-ink" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <Link href="/owners" className="font-semibold underline underline-offset-4">
                  {owners.more}
                </Link>
              </p>
              <p className="mt-8 text-muted">{owners.contactLead}</p>
              <p className="mt-1 font-serif text-[clamp(28px,3.4vw,40px)] italic">
                <a href={`mailto:${site.email}`} className="underline decoration-peach decoration-[3px] underline-offset-[6px] hover:decoration-ink">
                  {site.email}
                </a>
              </p>
            </div>
            <figure className="self-start rounded-[28px] border border-ink/10 bg-mist p-6 md:mt-12 md:p-8">
              <p className="font-serif text-[28px]">{owners.panel.title}</p>
              <dl className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
                {owners.panel.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-sm text-muted">{r.label}</dt>
                    <dd className="text-right font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <figcaption className="mt-4 text-sm text-muted">{owners.panel.note}</figcaption>
            </figure>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="py-16 md:py-24">
          <div className="wrap grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 id="faq-title" className={h2}>{faq.title}</h2>
            <div className="border-t-[1.5px] border-ink">
              {faq.items.map((f) => (
                <details key={f.q} className="group border-b border-ink/20">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-xl leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[56ch] pb-6 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Countdown */}
        <section data-waitlist-cta aria-labelledby="count-title" className="on-dark bg-ink py-16 text-mist md:py-24">
          <div className="wrap">
            <div className="grid gap-5 md:grid-cols-2 md:items-end">
              <h2 id="count-title" className={h2}>{countdown.title}</h2>
              <p className="max-w-[34ch] text-lg text-pale md:justify-self-end">{countdown.text}</p>
            </div>
            <div className="mt-10 md:mt-14">
              <Countdown />
            </div>
            <OpenWaitlistButton className="mt-10 rounded-xl bg-peach px-6 py-3.5 font-semibold text-ink hover:bg-peach-soft">
              {countdown.cta}
            </OpenWaitlistButton>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MobileJoinBar />
      <WaitlistPopup />
    </>
  );
}
