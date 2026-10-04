import type { Metadata } from "next";
import { Onboarding } from "@/mock/screens/owner/Onboarding";

export const metadata: Metadata = { title: "Set up your place" };

export default function Page() {
  return <Onboarding />;
}
