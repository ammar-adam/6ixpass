import type { Metadata } from "next";
import { RequireMember } from "@/mock/Guard";
import { Account } from "@/mock/screens/account/Account";

export const metadata: Metadata = { title: "Account" };

export default function Page() {
  return (
    <RequireMember>
      <Account />
    </RequireMember>
  );
}
