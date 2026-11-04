import type { Metadata } from "next";
import Link from "next/link";
import { ownersPage as c } from "@/content/owners";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone } from "@/components/Phone";
import { ApplyForm } from "@/components/ApplyForm";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { OwnersNav } from "@/components/OwnersNav";

export const metadata: Metadata = {
  title: c.pages.earnings.title,
  description: c.pages.earnings.description,
  alternates: { canonical: "/owners/earnings" },
  openGraph: { type: "website", title: c.pages.earnings.title, description: c.pages.earnings.description, url: "/owners/earnings" },
};

const h2 = "font-serif text-[clamp(36px,4.2vw,58px)] font-normal leading-[1.02] tracking-[-0.015em] text-balance";
const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.16em] text-copper";
const pill = "inline-flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-semibold";
const money = (n: number) => `$${Math.round(n)}`;

export default function OwnersEarnings() {
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
          <div className="wrap pb-10 pt-8 md:pb-14 md:pt-12">
            <OwnersNav />
            <p className={`${eyebrow} mt-10`}>{c.pages.earnings.eyebrow}</p>
            <h1 className="mt-3 max-w-[20ch] font-serif text-[clamp(44px,5.6vw,76px)] font-normal leading-[1] tracking-[-0.02em] text-balance">{c.pages.earnings.h1}</h1>
            <p className="mt-5 max-w-[50ch] text-[18px] leading-relaxed text-ink/75">{c.pages.earnings.intro}</p>
          </div>
        </header>

        <section id="earnings" aria-labelledby="earnings-title" className="scroll-mt-24 pb-16 pt-2 md:pb-20">
          <div className="wrap">
            <h2 id="earnings-title" className="sr-only">{c.calculator.title}</h2>
            <div className="mt-2 rounded-[28px] border border-line bg-[#fffaf4] p-5 shadow-card md:p-10">
              <EarningsCalculator />
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
      </main>
      <SiteFooter />
    </>
  );
}
