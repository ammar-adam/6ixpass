import type { Metadata } from "next";
import { RequirePartner } from "@/mock/Guard";
import { Today } from "@/mock/screens/business/Today";

export const metadata: Metadata = { title: "Today" };

export default function Page() {
  return (
    <RequirePartner>
      <Today />
    </RequirePartner>
  );
}
