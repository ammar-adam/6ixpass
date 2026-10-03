import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms for using The 6 Pass website and waitlist before launch.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

export default function Terms() {
  return <LegalPage doc={terms} />;
}
