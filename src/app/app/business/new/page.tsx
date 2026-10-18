import type { Metadata } from "next";
import { NewBusiness } from "@/mock/screens/business/NewBusiness";

export const metadata: Metadata = { title: "Create a business account" };

export default function Page() {
  return <NewBusiness />;
}
