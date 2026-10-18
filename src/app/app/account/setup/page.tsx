import type { Metadata } from "next";
import { RequireMember } from "@/mock/Guard";
import { Setup } from "@/mock/screens/account/Setup";

export const metadata: Metadata = { title: "Welcome" };

export default function Page() {
  return (
    <RequireMember allowSetup>
      <Setup />
    </RequireMember>
  );
}
