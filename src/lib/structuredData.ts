import { faq, site } from "@/content/site";

/*
 * Structured data (JSON-LD) for search engines and AI assistants.
 *
 * Rule: everything here is built from the content files, so it can never
 * say something the page doesn't. Do not add prices, ratings, reviews,
 * partner names or social links that don't exist yet.
 */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://the6pass.ca").replace(/\/$/, "");

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: site.name,
  url: `${siteUrl}/`,
  email: site.email,
  description: site.seo.description,
  areaServed: { "@type": "City", name: "Toronto" },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: site.name,
  url: `${siteUrl}/`,
  inLanguage: "en-CA",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function aboutLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: `What is ${site.name}?`,
    description,
    inLanguage: "en-CA",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
  };
}
