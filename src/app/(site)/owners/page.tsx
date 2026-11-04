import type { Metadata } from "next";
import Link from "next/link";
import { ownersPage as c } from "@/content/owners";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone } from "@/components/Phone";
import { ApplyForm } from "@/components/ApplyForm";
import { EarningsCalculator } from "@/components/EarningsCalculator";

export const metadata: Metadata = {
  title: c.seo.title,
  description: c.seo.description,
  alternates: { canonical: "/owners" },
  openGraph: { type: "website", title: c.seo.title, description: c.seo.description, url: "/owners" },
};

const h2 = "font-serif text-[clamp(36px,4.2vw,58px)] font-normal leading-[1.02] tracking-[-0.015em] text-balance";
const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.16em] text-copper";
const pill = "inline-flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-semibold";
const money = (n: number) => `$${Math.round(n)}`;

export default function Owners() {
  const e = c.example;
  const fullBill = e.mainPrice * 2 + e.otherFood + e.drinks;
  const passBill = fullBill - e.mainPrice;
  const cost = (e.mainPrice * 2 + e.otherFood) * e.foodCostRate + e.drinks * e.drinkCostRate;
  const rows = [
    { label: e.labels.bill, full: money(fullBill), pass: money(passBill) },
    { label: e.labels.cost, full: `about ${money(cost)}`, pass: `about ${money(cost)}` },
    { label: e.labels.left, full: `about ${money(fullBill - cost)}`, pass: `about ${money(passBill - cost)}`, strong: true },
  ];

  return (
    <>
      <SiteHeader popup={false} />
      <main id="main">
        <header className="hero-glow">
          <div className="wrap grid items-center gap-12 pb-16 pt-8 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-14">
            <div>
              <p className={eyebrow}>{c.eyebrow}</p>
              <h1 className="mt-4 font-serif text-[clamp(46px,6vw,84px)] font-normal leading-[0.98] tracking-[-0.02em] text-balance">
                {c.title} <em className="italic text-accent">{c.titleItalic}</em>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[18px] leading-relaxed text-ink/75">{c.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#apply" className={`${pill} bg-accent text-white shadow-[0_8px_20px_-10px_rgb(194_69_45/0.8)] hover:bg-accent-2`}>
                  {c.applyButton}
                </a>
                <Link href={c.signIn.href} className={`${pill} border border-line bg-white hover:border-ink/30`}>
                  {c.signIn.label}
                </Link>
              </div>
            </div>
            <figure className="relative mx-auto w-full max-w-[520px] pb-10 md:pb-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
              <img src={`${c.heroImage.src}-1200.webp`} srcSet={`${c.heroImage.src}-640.webp 640w, ${c.heroImage.src}-1200.webp 1200w`} sizes="(min-width: 768px) 520px, 92vw" alt={c.heroImage.alt} width={1200} height={800} className="ml-auto aspect-[5/4] w-[86%] rounded-[28px] object-cover shadow-card" />
              <div className="absolute -bottom-2 left-0 w-[40%] max-w-[210px] md:-bottom-10">
                <Phone src={c.heroScreen.src} alt={c.heroScreen.alt} priority sizes="210px" />
              </div>
            </figure>
          </div>
        </header>

        <section aria-labelledby="terms-title" className="py-16 md:py-24">
          <div className="wrap">
            <h2 id="terms-title" className={h2}>{c.terms.title}</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.terms.items.map((t, i) => (
                <li key={t.title} className="rounded-[24px] border border-line bg-[#fffaf4] p-6 shadow-card">
                  <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-peach-soft font-serif text-[20px] text-copper">{i + 1}</span>
                  <h3 className="mt-5 font-serif text-[26px] leading-tight">{t.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="benefits-title" className="on-dark bg-night py-16 text-[#f3e9de] md:py-24">
          <div className="wrap">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-peach">{c.benefits.eyebrow}</p>
            <h2 id="benefits-title" className={`${h2} mt-3 max-w-[18ch]`}>{c.benefits.title}</h2>
            <p className="mt-5 max-w-[46ch] text-[17px] text-pale">{c.benefits.intro}</p>
            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.items.map((b) => (
                <li key={b.title} className="border-t border-white/15 pt-5">
                  <h3 className="font-serif text-[26px] leading-tight text-white">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-pale">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="earnings" aria-labelledby="earnings-title" className="scroll-mt-24 py-16 md:py-24">
          <div className="wrap">
            <p className={eyebrow}>{c.calculator.eyebrow}</p>
            <h2 id="earnings-title" className={`${h2} mt-3`}>{c.calculator.title}</h2>
            <p className="mt-5 max-w-[46ch] text-[17px] text-ink/75">{c.calculator.intro}</p>
            <div className="mt-10 rounded-[28px] border border-line bg-[#fffaf4] p-5 shadow-card md:p-10">
              <EarningsCalculator />
            </div>
          </div>
        </section>

        <section aria-labelledby="control-title" className="bg-mist py-16 md:py-24">
          <div className="wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <h2 id="control-title" className={h2}>{c.control.title}</h2>
              <figure className="mt-10 hidden max-w-[260px] md:block">
                <Phone src={c.control.screen.src} alt={c.control.screen.alt} sizes="260px" />
                <figcaption className="mt-5 text-sm text-muted">{c.control.screen.caption}</figcaption>
              </figure>
            </div>
            <div>
              <ul className="overflow-hidden rounded-[24px] border border-line bg-[#fffaf4] px-5 shadow-card md:px-6">
                {c.control.items.map((i) => (
                  <li key={i.title} className="grid gap-1 border-b border-line last:border-b-0 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                    <h3 className="font-serif text-[22px] leading-snug">{i.title}</h3>
                    <p className="text-muted">{i.text}</p>
                  </li>
                ))}
              </ul>
              <figure className="mt-10 rounded-[20px] bg-white shadow-card p-6 md:p-8">
                <p className="font-serif text-[28px]">{c.control.panel.title}</p>
                <dl className="mt-4 divide-y divide-line">
                  {c.control.panel.rows.map((r) => (
                    <div key={r.label} className="flex items-baseline justify-between gap-4 py-3.5">
                      <dt className="text-sm text-muted">{r.label}</dt>
                      <dd className="text-right font-semibold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <figcaption className="mt-4 text-sm text-muted">{c.control.panel.note}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section aria-labelledby="example-title" className="py-16 md:py-24">
          <div className="wrap grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 id="example-title" className={h2}>{e.title}</h2>
              <p className="mt-5 max-w-[40ch] text-lg">{e.intro}</p>
              <ul className="mt-8 border-t border-ink/30">
                {e.takeaways.map((t) => (
                  <li key={t.title} className="border-b border-ink/30 py-5">
                    <h3 className="text-lg font-semibold">{t.title}</h3>
                    <p className="mt-1 text-ink/85">{t.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="self-start rounded-[20px] bg-white shadow-card p-6 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px] border-collapse text-left">
                  <caption className="sr-only">Example: one table of two, at full price and with the pass</caption>
                  <thead>
                    <tr className="border-b-[1.5px] border-ink text-sm">
                      <td />
                      <th scope="col" className="whitespace-nowrap py-3 pl-3 text-right font-semibold">{e.labels.full}</th>
                      <th scope="col" className="whitespace-nowrap py-3 pl-3 text-right font-semibold">{e.labels.pass}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.label} className="border-b border-line last:border-b-0">
                        <th scope="row" className={`py-4 pr-3 font-normal ${r.strong ? "font-semibold text-ink" : "text-muted"}`}>
                          {r.label}
                        </th>
                        <td className={`whitespace-nowrap py-4 pl-3 text-right tabular-nums ${r.strong ? "text-xl font-semibold tracking-[-0.02em] md:text-2xl" : ""}`}>{r.full}</td>
                        <td className={`whitespace-nowrap py-4 pl-3 text-right tabular-nums ${r.strong ? "text-xl font-semibold tracking-[-0.02em] md:text-2xl" : ""}`}>{r.pass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted">
                Two mains at {money(e.mainPrice)}, a shared starter and dessert at {money(e.otherFood)}, drinks at{" "}
                {money(e.drinks)}. The free main costs you about {money(e.mainPrice * e.foodCostRate)} in ingredients.
              </p>
              <figcaption className="mt-2 text-sm text-muted">{e.note}</figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="redeem-title" className="bg-mist py-16 md:py-24">
          <div className="wrap">
            <h2 id="redeem-title" className={h2}>{c.redeem.title}</h2>
            <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3">
              {c.redeem.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[48px_1fr] gap-x-3 md:flex md:flex-col"
                >
                  <span aria-hidden="true" className="row-span-2 grid size-9 place-items-center rounded-full bg-accent text-[15px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-1 font-serif text-[24px] leading-snug md:mt-4">{s.title}</h3>
                  <p className="mt-1.5 max-w-[30ch] text-muted md:mb-7">{s.text}</p>
                  <Phone src={s.screen.src} alt={s.screen.alt} sizes="(min-width: 768px) 260px, 220px" className="col-start-2 mt-6 max-w-[220px] md:mt-auto md:max-w-[260px]" />
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-muted">{c.redeem.label}</p>
            <p className="mt-6">
              <Link href="/partners-demo" className="font-semibold text-ink underline decoration-copper decoration-2 underline-offset-4 hover:decoration-ink">
                {c.redeem.link}
              </Link>
            </p>
          </div>
        </section>

        <section aria-labelledby="founding-title" className="py-16 md:py-24">
          <div className="wrap grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-0">
            <div>
              <h2 id="founding-title" className={h2}>{c.founding.title}</h2>
              <p className="mt-6 max-w-[44ch] text-lg text-muted">{c.founding.text}</p>
            </div>
            <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:pt-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-copper">{c.next.title}</h2>
              <ol className="mt-5 overflow-hidden rounded-[20px] bg-white px-5 shadow-card md:px-7">
                {c.next.steps.map((st, i) => (
                  <li key={st.title} className="grid grid-cols-[40px_1fr] gap-x-3 border-b border-line py-6 last:border-b-0">
                    <span aria-hidden="true" className="row-span-2 font-serif text-[32px] italic leading-none text-copper">{i + 1}</span>
                    <h3 className="font-serif text-[22px] leading-snug">{st.title}</h3>
                    <p className="mt-1 text-muted">{st.text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-t border-line pt-10 md:mt-16 md:self-start md:pt-12">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{c.downloads.title}</h3>
              <ul className="mt-3 max-w-[560px] overflow-hidden rounded-[20px] bg-white px-5 shadow-card md:px-6">
                {c.downloads.items.map((d) => (
                  <li key={d.file} className="border-b border-line last:border-b-0">
                    <a href={d.file} className="flex min-h-[56px] items-center justify-between gap-4 py-3 font-semibold hover:text-copper">
                      {d.label}
                      <span className="text-sm font-normal text-muted">{d.note}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section id="apply" aria-labelledby="apply-title" className="scroll-mt-24 pb-16 md:pb-24">
          <div className="wrap">
            <div className="grid gap-10 rounded-[28px] bg-[linear-gradient(120deg,#f8e1cf_0%,#f6d2b7_60%,#f3c9a6_100%)] p-6 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:p-12">
              <div>
                <p className={eyebrow}>{c.apply.eyebrow}</p>
                <h2 id="apply-title" className={`${h2} mt-3`}>{c.apply.title}</h2>
                <p className="mt-5 max-w-[36ch] text-[17px] text-ink/80">
                  {c.apply.text}{" "}
                  <a href={`mailto:${site.email}`} className="font-semibold underline decoration-copper decoration-2 underline-offset-4">{site.email}</a>.
                </p>
              </div>
              <div className="rounded-[24px] bg-paper p-5 shadow-card md:p-8">
                <ApplyForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
