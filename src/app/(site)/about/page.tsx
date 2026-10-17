import type { Metadata } from "next";
import { about } from "@/content/about";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { JsonLd } from "@/components/JsonLd";
import { aboutLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: about.seo.title,
  description: about.seo.description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: about.seo.title,
    description: about.seo.description,
    url: "/about",
  },
};

export default function About() {
  return (
    <>
      <JsonLd data={aboutLd(about.seo.description)} />
      <SiteHeader home={false} />
      <main id="main">
        <article>
          <header className="wrap pb-12 pt-8 md:pb-16 md:pt-14">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{about.eyebrow}</p>
            <h1 className="mt-4 font-serif text-[clamp(44px,6vw,80px)] font-semibold leading-[0.98] tracking-[-0.025em]">
              {about.title}{about.titleItalic && <> <em className="italic">{about.titleItalic}</em></>}
            </h1>
            <p className="mt-6 max-w-[46ch] text-xl md:text-2xl">{about.intro}</p>
          </header>

          <section aria-label="Key facts" className="py-10 md:py-14">
            <div className="wrap">
              <dl className="grid overflow-hidden rounded-[20px] bg-white px-5 shadow-card sm:grid-cols-2 sm:gap-x-10 md:px-6">
                {about.facts.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-6 border-b border-line last:border-b-0 py-4">
                    <dt className="shrink-0 text-sm font-semibold uppercase tracking-[0.1em] text-muted">{f.label}</dt>
                    <dd className="text-right font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <div className="wrap py-12 md:py-20">
            {about.sections.map((s) => (
              <section
                key={s.heading}
                className="grid gap-3 border-t border-ink/20 py-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-10"
              >
                <h2 className="font-serif text-[clamp(26px,2.6vw,32px)] font-semibold leading-tight">{s.heading}</h2>
                <div className="max-w-[60ch]">
                  {s.body.map((p) => (
                    <p key={p} className="mt-3 text-lg leading-relaxed text-ink/85 first:mt-0">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <section aria-labelledby="about-cta" className="on-dark bg-ink py-16 text-mist md:py-20">
          <div className="wrap grid gap-6 md:grid-cols-2 md:items-end">
            <h2 id="about-cta" className="font-serif text-[clamp(34px,3.9vw,52px)] font-semibold leading-[1.02] tracking-[-0.02em]">
              {about.cta.title}
            </h2>
            <div className="md:justify-self-end">
              <p className="max-w-[36ch] text-lg text-pale">{about.cta.text}</p>
              <OpenWaitlistButton className="mt-6 rounded-full bg-ink text-white px-6 py-3.5 font-semibold hover:bg-ink-2">
                {about.cta.button}
              </OpenWaitlistButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
