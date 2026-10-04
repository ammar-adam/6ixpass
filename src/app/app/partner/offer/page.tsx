import type { Metadata } from "next";
import { PartnerOffer } from "@/mock/screens/Partner";

export const metadata: Metadata = { title: "Your offer" };

export default function Page() {
  return <PartnerOffer />;
}
