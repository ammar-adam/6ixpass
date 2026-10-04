import type { Metadata } from "next";
import { Start } from "@/mock/screens/owner/Start";

export const metadata: Metadata = { title: "Demo for owners" };

export default function Page() {
  return <Start />;
}
