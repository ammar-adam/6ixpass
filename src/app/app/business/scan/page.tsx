import type { Metadata } from "next";
import { RequirePartner } from "@/mock/Guard";
import { ScanScreen } from "@/mock/screens/business/Scan";

export const metadata: Metadata = { title: "Scan" };

export default function Page() {
  return (
    <RequirePartner>
      <ScanScreen />
    </RequirePartner>
  );
}
