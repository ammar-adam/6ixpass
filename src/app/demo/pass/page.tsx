import type { Metadata } from "next";
import { MyPass } from "@/demo/ui/MyPass";

export const metadata: Metadata = { title: "My pass" };

export default function Page() {
  return <MyPass />;
}
