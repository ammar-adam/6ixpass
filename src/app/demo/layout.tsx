import type { Metadata, Viewport } from "next";
import { DemoShell } from "@/demo/ui/DemoShell";

export const metadata: Metadata = {
  title: { default: "Demo", template: "%s · The 6 Pass demo" },
  description: "A clickable demo of The 6 Pass app. Places shown are examples.",
  robots: { index: false, follow: false },
  manifest: "/demo/manifest.webmanifest",
  appleWebApp: { capable: true, title: "6 Pass demo", statusBarStyle: "default" },
  alternates: { canonical: null },
};

export const viewport: Viewport = {
  themeColor: "#0f2e33",
  viewportFit: "cover",
};

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return <DemoShell>{children}</DemoShell>;
}
