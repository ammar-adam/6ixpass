import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo design directions",
  robots: { index: false, follow: false },
};

export default function DirectionsLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[#d9dbdd] sm:grid sm:place-items-center sm:py-8">{children}</div>;
}
