import type { Metadata } from "next";
import { Join } from "@/mock/screens/business/Join";

export const metadata: Metadata = { title: "Set up your login" };

export default function Page() {
  return <Join />;
}
