import type { Metadata } from "next";
import Link from "next/link";
import { ownersPage as c } from "@/content/owners";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PhoneShot } from "@/components/PhoneShot";

export const metadata: Metadata = {
  title: c.seo.title,
  description: c.seo.description,
  alternates: { canonical: "/owners" },
  openGraph: { type: "website", title: c.seo.title, description: c.seo.description, url: "/owners" },
};

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
      <SiteHeader home={false} />
      <main id="main">
        <header className="wrap grid overflow-hidden items-center gap-12 pb-12 pt-8 md:grid-cols-[1fr_auto] md:gap-20 md:pb-16 md:pt-16">
          <div className="max-w-[560px]">
            <p className="s-eyebrow text-copper">{c.eyebrow}</p>
            <h1 className="s-hero mt-3">{c.title}</h1>
            <p className="s-lede mt-4">{c.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${site.email}`} className="s-btn">
                {site.email}
              </a>
              <Link href="/partners-demo" className="s-btn s-btn-quiet">
                {c.redeem.link}
              </Link>
            </div>
          </div>
          <figure className="relative mx-auto w-[240px] md:w-[280px]">
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-peach-soft md:size-[440px]" />
            <PhoneShot src={c.hero.src} alt={c.hero.alt} priority className="relative" />
          </figure>
        </header>

        <section aria-labelledby="control-title" className="s-section">
          <div className="wrap grid items-start gap-10 md:grid-cols-[1fr_auto] md:gap-20">
            <div>
              <h2 id="control-title" className="s-title">
                {c.control.title}
              </h2>
              <ul className="s-card mt-6 px-5 md:px-6">
                {c.control.items.map((i) => (
                  <li key={i.title} className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-6">
                    <h3 className="font-semibold">{i.title}</h3>
                    <p className="text-muted">{i.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="mx-auto w-[220px] md:w-[250px]">
              <PhoneShot src={c.control.screen.src} alt={c.control.screen.alt} />
              <figcaption className="mt-4 text-center text-[15px] text-muted">{c.control.screen.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="redeem-title" className="band-deep on-dark s-section">
          <div className="wrap">
            <h2 id="redeem-title" className="s-title">
              {c.redeem.title}
            </h2>
            <ol className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0">
              {c.redeem.steps.map((s, i) => (
                <li key={s.title} className="w-[66%] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none">
                  <PhoneShot src={s.screen.src} alt={s.screen.alt} className="mx-auto max-w-[260px] shadow-[0_0_0_7px_#05191c,0_0_0_8px_#2f5258,0_30px_60px_-20px_rgba(0,0,0,0.55)]" />
                  <div className="mx-auto mt-6 max-w-[260px]">
                    <p aria-hidden="true" className="font-serif text-[44px] font-semibold italic leading-none text-peach">{i + 1}</p>
                    <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.015em]">{s.title}</h3>
                    <p className="mt-1 text-sage">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[15px] text-sage">{c.redeem.label}</p>
          </div>
        </section>

        <section aria-labelledby="example-title" className="s-section">
          <div className="wrap grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 id="example-title" className="s-title">
                {e.title}
              </h2>
              <p className="s-lede mt-3 max-w-[40ch]">{e.intro}</p>
              <ul className="s-card mt-6 px-5 md:px-6">
                {e.takeaways.map((t) => (
                  <li key={t.title} className="border-b border-line py-4 last:border-b-0">
                    <h3 className="font-semibold">{t.title}</h3>
                    <p className="mt-1 text-muted">{t.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="s-card self-start p-5 md:p-7">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px] border-collapse text-left">
                  <caption className="sr-only">Example: one table of two, at full price and with the pass</caption>
                  <thead>
                    <tr className="border-b border-ink/40 text-[15px]">
                      <td />
                      <th scope="col" className="whitespace-nowrap py-3 pl-3 text-right font-semibold">
                        {e.labels.full}
                      </th>
                      <th scope="col" className="whitespace-nowrap py-3 pl-3 text-right font-semibold">
                        {e.labels.pass}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.label} className="border-b border-line last:border-b-0">
                        <th scope="row" className={`py-4 pr-3 text-[15px] font-normal ${r.strong ? "font-semibold text-ink" : "text-muted"}`}>
                          {r.label}
                        </th>
                        <td className={`whitespace-nowrap py-4 pl-3 text-right tabular-nums ${r.strong ? "text-[22px] font-semibold tracking-[-0.02em] text-ok" : ""}`}>{r.full}</td>
                        <td className={`whitespace-nowrap py-4 pl-3 text-right tabular-nums ${r.strong ? "text-[22px] font-semibold tracking-[-0.02em] text-ok" : ""}`}>{r.pass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[14px] text-muted">
                Two mains at {money(e.mainPrice)}, a shared starter and dessert at {money(e.otherFood)}, drinks at {money(e.drinks)}. The free main costs you about {money(e.mainPrice * e.foodCostRate)} in
                ingredients.
              </p>
              <figcaption className="mt-2 text-[14px] text-muted">{e.note}</figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="costs-title" className="s-section">
          <div className="wrap grid gap-5 md:grid-cols-2">
            <div className="s-card p-6 md:p-8">
              <h2 id="costs-title" className="s-title">
                {c.costs.title}
              </h2>
              <dl className="mt-4">
                {c.costs.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-b-0">
                    <dt className="text-muted">{r.label}</dt>
                    <dd className="text-right font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="s-card p-6 md:p-8">
              <h2 className="s-title">{c.founding.title}</h2>
              <p className="mt-4 text-muted">{c.founding.text}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-title" className="s-section bg-peach-soft">
          <div className="wrap">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="contact-title" className="s-title">
                  {c.contact.title}
                </h2>
                <p className="mt-3 max-w-[44ch] text-[19px] text-ink/80">{c.contact.text}</p>
              </div>
              <a href={`mailto:${site.email}`} className="s-btn shrink-0">
                {site.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
