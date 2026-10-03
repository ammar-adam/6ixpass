import type { Metadata } from "next";
import { Staff } from "@/demo/ui/Staff";

export const metadata: Metadata = { title: "Staff view" };

export default function Page() {
  return <Staff />;
}
