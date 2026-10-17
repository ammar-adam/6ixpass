import type { Metadata } from "next";
import { StaffScreen } from "@/mock/screens/StaffScreen";

export const metadata: Metadata = { title: "Check a code" };

export default function Page() {
  return <StaffScreen />;
}
