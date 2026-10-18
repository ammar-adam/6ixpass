import type { Metadata } from "next";
import { RequirePartner } from "@/mock/Guard";
import { Team } from "@/mock/screens/business/Team";

export const metadata: Metadata = { title: "Team" };

export default function Page() {
  return (
    <RequirePartner role="owner">
      <Team />
    </RequirePartner>
  );
}
