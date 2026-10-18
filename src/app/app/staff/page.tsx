import type { Metadata } from "next";
import { RequirePartner } from "@/mock/Guard";
import { ScanScreen } from "@/mock/screens/business/Scan";

export const metadata: Metadata = { title: "Check a code" };

export default function Page() {
  return (
    <RequirePartner allowLiveStaff>
      <ScanScreen twoPhones />
    </RequirePartner>
  );
}
