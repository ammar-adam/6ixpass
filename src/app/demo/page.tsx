import type { Metadata, Viewport } from "next";
import { Demo } from "@/demo/Demo";

export const metadata: Metadata = {
  title: "Demo",
  description: "A clickable demo of The 6 Pass. The places shown are examples.",
  alternates: { canonical: "/demo" },
  // The demo shows made-up places, so keep it out of search results.
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "The 6 Pass", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function DemoPage() {
  return (
    <main id="main" className="min-h-dvh bg-mist-2 sm:grid sm:place-items-center">
      <Demo />
    </main>
  );
}
