import type { Metadata } from "next";
import Link from "next/link";
import { faq, site } from "@/content/site";
import { ownersPage } from "@/content/owners";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: faq.seo.title,
  description: faq.seo.description,
  alternates: { canonical: "/faq" },
  openGraph: { type: "website", title: faq.seo.title, description: faq.seo.description, url: "/faq" },
};

type QA = { q: string; a: string };

// One compact list: a question per row, the answer opens underneath.
function List({ items }: { items: readonly QA[] }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group border-b border-line last:border-b-0">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-[16px] font-semibold leading-snug hover:bg-mist/60 [&::-webkit-details-marker]:hidden">
            {f.q}
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3.5 6l4.5 4.5L12.5 6" />
            </svg>
          </summary>
          <p className="max-w-[62ch] px-5 pb-4 text-[15px] leading-relaxed text-ink/75">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <SiteHeader home={false} />
      <main id="main" className="wrap max-w-[860px]! pb-16 pt-8 md:pb-24 md:pt-14">
        <h1 className="font-serif text-[clamp(40px,5vw,64px)] font-normal leading-none tracking-[-0.02em]">{faq.title}</h1>
        <p className="mt-4 text-[16px] text-muted">
          {faq.more}{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-ink underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>

        <section aria-labelledby="faq-members" className="mt-10">
          <h2 id="faq-members" className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted">{faq.membersTitle}</h2>
          <List items={faq.items} />
          <OpenWaitlistButton className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-accent px-6 font-semibold text-white hover:bg-accent-2">
            Join the waitlist
          </OpenWaitlistButton>
        </section>

        <section aria-labelledby="faq-business" className="mt-12">
          <h2 id="faq-business" className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted">{faq.businessTitle}</h2>
          <List items={ownersPage.faq.items} />
          <Link href="/owners" className="mt-5 inline-flex min-h-[48px] items-center rounded-full border border-line bg-white px-6 font-semibold hover:border-ink/30">
            {faq.businessMore}
          </Link>
        </section>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
