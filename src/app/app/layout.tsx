import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Figtree } from "next/font/google";
import { cormorant } from "../fonts";
import { AppShell } from "@/mock/AppShell";
import "@/demo/directions/motion.css";
import "@/mock/app.css";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-dmserif", preload: false });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree" });

export const metadata: Metadata = {
  title: { default: "The 6 Pass", template: "%s · The 6 Pass" },
  description: "A clickable mock of The 6 Pass app. Places shown are examples.",
  // A mock with made-up places: keep it out of search.
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  manifest: "/app/manifest.webmanifest",
  icons: { icon: "/app/icon-192.png", apple: "/apple-icon" },
  appleWebApp: { capable: true, title: "The 6 Pass", statusBarStyle: "black" },
};

export const viewport: Viewport = {
  themeColor: "#0a1424",
  viewportFit: "cover",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSerif.variable} ${figtree.variable} ${cormorant.variable}`}>
      <AppShell>{children}</AppShell>
    </div>
  );
}
