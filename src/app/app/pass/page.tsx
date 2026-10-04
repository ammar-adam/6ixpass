import type { Metadata } from "next";
import { PassScreen } from "@/mock/screens/PassScreen";

export const metadata: Metadata = { title: "My pass" };

export default function Page() {
  return <PassScreen />;
}
