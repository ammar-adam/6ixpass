import type { Metadata } from "next";
import { Dashboard } from "@/mock/screens/owner/Dashboard";

export const metadata: Metadata = { title: "Owner view" };

export default function Page() {
  return <Dashboard />;
}
