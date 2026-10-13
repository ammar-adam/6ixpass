import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { cormorant } from "../fonts";
import { AppShell } from "@/mock/AppShell";
import "@/mock/app.css";

// Apple devices use San Francisco (the system font). Inter only stands in for
// it on Windows and Android, where San Francisco isn't installed.
const ui = Inter({ subsets: ["latin"], variable: "--f-ui" });
// Place names. The logo keeps its own Cormorant (--font-logo).
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"], style: ["normal", "italic"], variable: "--f-display" });

export const metadata: Metadata = {
  title: { default: "The 6 Pass", template: "%s · The 6 Pass" },
  description: "A clickable mock of The 6 Pass app. Places shown are examples.",
  // A mock with made-up places: keep it out of search.
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  manifest: "/app/manifest.webmanifest",
  icons: { icon: "/app/icon-192.png", apple: "/apple-icon" },
  appleWebApp: { capable: true, title: "The 6 Pass", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  viewportFit: "cover",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${ui.variable} ${display.variable} ${cormorant.variable}`}>
      <AppShell>{children}</AppShell>
    </div>
  );
}
