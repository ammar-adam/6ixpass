import type { Metadata } from "next";
import Link from "next/link";
import { ownersPage as c } from "@/content/owners";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone } from "@/components/Phone";
import { ApplyForm } from "@/components/ApplyForm";
import { OwnersNav } from "@/components/OwnersNav";

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
  return (
    <>
      <SiteHeader popup={false} owner />
      <main id="main">
        <header className="hero-glow">
          <div className="wrap pt-6"><OwnersNav /></div>
          <div className="wrap grid items-center gap-12 pb-16 pt-6 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-14">
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
                <Link href={c.secondary.href} className={`${pill} border border-line bg-white hover:border-ink/30`}>
                  {c.secondary.label}
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
            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {c.benefits.items.map((b) => (
                <li key={b.title} className="border-t border-white/15 pt-5">
                  <h3 className="font-serif text-[26px] leading-tight text-white">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-pale">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="owner-faq-title" className="py-16 md:py-24">
          <div className="wrap grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 id="owner-faq-title" className={h2}>{c.faq.title}</h2>
            <div className="border-t border-line">
              {c.faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-6 py-4 font-serif text-[22px] leading-snug [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3.5 6l4.5 4.5L12.5 6" />
                    </svg>
                  </summary>
                  <p className="max-w-[58ch] pb-5 text-[16px] leading-relaxed text-ink/75">{f.a}</p>
                </details>
              ))}
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
