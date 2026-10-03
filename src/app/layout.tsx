import type { Metadata, Viewport } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/structuredData";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  // Two static weights keep the download small (better phone speed).
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://the6pass.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.seo.title, template: `%s · ${site.name}` },
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_CA",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#e3eceb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${newsreader.variable} ${schibsted.variable}`}>
      <body className="min-h-screen">
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
