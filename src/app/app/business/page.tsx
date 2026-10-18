import type { Metadata } from "next";
import { BusinessSignIn } from "@/mock/screens/business/BusinessSignIn";

export const metadata: Metadata = { title: "Partner login" };

export default function Page() {
  return <BusinessSignIn />;
}
