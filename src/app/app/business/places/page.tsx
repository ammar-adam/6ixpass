import type { Metadata } from "next";
import { RequirePartner } from "@/mock/Guard";
import { Places } from "@/mock/screens/business/Places";

export const metadata: Metadata = { title: "Choose a place" };

export default function Page() {
  return (
    <RequirePartner needPlace={false}>
      <Places />
    </RequirePartner>
  );
}
