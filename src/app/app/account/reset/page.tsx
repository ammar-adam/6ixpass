import type { Metadata } from "next";
import { Reset } from "@/mock/screens/account/Reset";

export const metadata: Metadata = { title: "Set a new password" };

export default function Page() {
  return <Reset />;
}
