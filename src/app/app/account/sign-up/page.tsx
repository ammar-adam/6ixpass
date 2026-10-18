import type { Metadata } from "next";
import { SignUp } from "@/mock/screens/account/SignUp";

export const metadata: Metadata = { title: "Create account" };

export default function Page() {
  return <SignUp />;
}
