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
  title: c.pages.how.title,
  description: c.pages.how.description,
  alternates: { canonical: "/owners/how-it-works" },
  openGraph: { type: "website", title: c.pages.how.title, description: c.pages.how.description, url: "/owners/how-it-works" },
};

const h2 = "font-serif text-[clamp(36px,4.2vw,58px)] font-normal leading-[1.02] tracking-[-0.015em] text-balance";
const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.16em] text-copper";
const pill = "inline-flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-semibold";
const money = (n: number) => `$${Math.round(n)}`;

export default function OwnersHow() {
  return (
    <>
      <SiteHeader popup={false} />
      <main id="main">
        <header className="hero-glow">
          <div className="wrap pb-10 pt-8 md:pb-14 md:pt-12">
            <OwnersNav />
            <p className={`${eyebrow} mt-10`}>{c.pages.how.eyebrow}</p>
            <h1 className="mt-3 max-w-[20ch] font-serif text-[clamp(44px,5.6vw,76px)] font-normal leading-[1] tracking-[-0.02em] text-balance">{c.pages.how.h1}</h1>
            <p className="mt-5 max-w-[50ch] text-[18px] leading-relaxed text-ink/75">{c.pages.how.intro}</p>
          </div>
        </header>

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
      </main>
      <SiteFooter />
    </>
  );
}
