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
          <header className="wrap max-w-[860px] pb-10 pt-8 md:pb-12 md:pt-16">
            <p className="s-eyebrow">{about.eyebrow}</p>
            <h1 className="s-hero mt-3">
              {about.title}
              {about.titleItalic && (
                <>
                  {" "}
                  <em className="italic">{about.titleItalic}</em>
                </>
              )}
            </h1>
            <p className="s-lede mt-4">{about.intro}</p>
          </header>

          <section aria-label="Key facts" className="wrap max-w-[860px]">
            <dl className="s-card px-5 md:px-6">
              {about.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-b-0">
                  <dt className="shrink-0 text-muted">{f.label}</dt>
                  <dd className="text-right font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="wrap max-w-[860px] py-8 md:py-12">
            {about.sections.map((s) => (
              <section key={s.heading} className="border-t border-line py-7 first:border-t-0">
                <h2 className="font-serif text-[30px] font-semibold leading-tight tracking-[-0.01em]">{s.heading}</h2>
                <div className="mt-2 max-w-[62ch]">
                  {s.body.map((p) => (
                    <p key={p} className="mt-3 text-ink/85 first:mt-0">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <section aria-labelledby="about-cta" className="band-deep on-dark s-section">
          <div className="wrap max-w-[860px]">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="about-cta" className="s-title">
                  {about.cta.title}
                </h2>
                <p className="mt-3 max-w-[40ch] text-[19px] text-sage">{about.cta.text}</p>
              </div>
              <OpenWaitlistButton className="s-btn s-btn-peach shrink-0">{about.cta.button}</OpenWaitlistButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
