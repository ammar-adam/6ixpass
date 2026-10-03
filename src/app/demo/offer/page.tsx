import type { Metadata } from "next";
import { YourOffer } from "@/demo/ui/YourOffer";

export const metadata: Metadata = { title: "Your offer" };

export default function Page() {
  return <YourOffer />;
}
