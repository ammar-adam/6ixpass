import type { Metadata } from "next";
import { RequirePartner } from "@/mock/Guard";
import { Dashboard } from "@/mock/screens/owner/Dashboard";

export const metadata: Metadata = { title: "Owner view" };

export default function Page() {
  return (
    <RequirePartner role="owner">
      <Dashboard />
    </RequirePartner>
  );
}
