import type { Metadata } from "next";
import { PartnerDoor } from "@/mock/screens/Partner";

export const metadata: Metadata = { title: "Partner" };

export default function Page() {
  return <PartnerDoor />;
}
