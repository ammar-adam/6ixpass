import type { Metadata } from "next";
import { Forgot } from "@/mock/screens/account/Forgot";

export const metadata: Metadata = { title: "Reset your password" };

export default function Page() {
  return <Forgot />;
}
