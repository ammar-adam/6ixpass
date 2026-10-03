import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How The 6 Pass handles the details you share when you join the waitlist. Stored in Canada, never sold.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function Privacy() {
  return <LegalPage doc={privacy} />;
}
