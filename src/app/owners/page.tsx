import type { Metadata } from "next";
import Link from "next/link";
import { ownersPage as c } from "@/content/owners";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: c.seo.title,
  description: c.seo.description,
  alternates: { canonical: "/owners" },
  openGraph: { type: "website", title: c.seo.title, description: c.seo.description, url: "/owners" },
};

const h2 = "font-serif text-[clamp(34px,4.4vw,60px)] font-normal leading-[1.02] tracking-[-0.02em]";
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
        <header className="wrap pb-14 pt-8 md:pb-20 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{c.eyebrow}</p>
          <h1 className="mt-4 font-serif text-[clamp(46px,7vw,104px)] font-normal leading-[0.98] tracking-[-0.025em]">
            {c.title} <em className="italic">{c.titleItalic}</em>
          </h1>
          <p className="mt-6 max-w-[44ch] text-xl md:text-2xl">{c.intro}</p>
          <p className="mt-8">
            <a
              href={`mailto:${site.email}`}
              className="inline-block rounded-xl bg-ink px-6 py-3.5 font-semibold text-white hover:bg-ink-2"
            >
              {site.email}
            </a>
          </p>
        </header>

        <section aria-labelledby="control-title" className="bg-white py-16 md:py-24">
          <div className="wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 id="control-title" className={h2}>{c.control.title}</h2>
            <ul className="border-t-[1.5px] border-ink">
              {c.control.items.map((i) => (
                <li key={i.title} className="grid gap-1 border-b border-ink/15 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <h3 className="text-lg font-semibold">{i.title}</h3>
                  <p className="text-muted">{i.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="example-title" className="bg-peach-soft py-16 md:py-24">
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
            <figure className="self-start rounded-[28px] bg-white p-6 md:p-8">
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
                      <tr key={r.label} className="border-b border-ink/15">
                        <th scope="row" className={`py-4 pr-3 font-normal ${r.strong ? "font-semibold text-ink" : "text-muted"}`}>
                          {r.label}
                        </th>
                        <td className={`whitespace-nowrap py-4 pl-3 text-right tabular-nums ${r.strong ? "font-serif text-xl md:text-2xl" : ""}`}>{r.full}</td>
                        <td className={`whitespace-nowrap py-4 pl-3 text-right tabular-nums ${r.strong ? "font-serif text-xl md:text-2xl" : ""}`}>{r.pass}</td>
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

        <section aria-labelledby="redeem-title" className="on-dark bg-ink py-16 text-mist md:py-24">
          <div className="wrap">
            <h2 id="redeem-title" className={h2}>{c.redeem.title}</h2>
            <ol className="mt-10 grid border-t border-mist/30 md:mt-14 md:grid-cols-3">
              {c.redeem.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[56px_1fr] gap-x-3 border-b border-mist/30 py-6 md:block md:border-b-0 md:py-7 md:pr-7 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-7"
                >
                  <span aria-hidden="true" className="row-span-2 font-serif text-[44px] italic leading-none text-peach md:text-[54px]">
                    {i + 1}
                  </span>
                  <h3 className="mt-1 text-[21px] font-semibold md:mt-4">{s.title}</h3>
                  <p className="mt-1.5 max-w-[30ch] text-pale">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10">
              <Link href="/demo" className="font-semibold text-peach underline underline-offset-4 hover:text-peach-soft">
                Try the demo on your phone
              </Link>
            </p>
          </div>
        </section>

        <section aria-labelledby="costs-title" className="py-16 md:py-24">
          <div className="wrap grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 id="costs-title" className={h2}>{c.costs.title}</h2>
              <dl className="mt-8 border-t-[1.5px] border-ink">
                {c.costs.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-4">
                    <dt className="text-muted">{r.label}</dt>
                    <dd className="text-right font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className={h2}>{c.founding.title}</h2>
              <p className="mt-6 max-w-[44ch] text-lg text-muted">{c.founding.text}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-title" className="bg-white py-16 md:py-24">
          <div className="wrap">
            <h2 id="contact-title" className={h2}>{c.contact.title}</h2>
            <p className="mt-5 max-w-[40ch] text-lg text-muted">{c.contact.text}</p>
            <p className="mt-6 font-serif text-[clamp(28px,3.4vw,44px)] italic">
              <a href={`mailto:${site.email}`} className="underline decoration-peach decoration-[3px] underline-offset-[6px] hover:decoration-ink">
                {site.email}
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
