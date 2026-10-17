import type { Metadata } from "next";
import { LiveSetup } from "@/mock/screens/LiveSetup";

export const metadata: Metadata = { title: "Two phones" };

export default function Page() {
  return <LiveSetup />;
}
