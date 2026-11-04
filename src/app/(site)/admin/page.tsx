import type { Metadata } from "next";
import { Admin } from "@/components/Admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

// Private: only accounts listed in t6p_private.admins can load anything here
// (docs/app/SUPABASE-GROWTH.sql). The page itself holds no data.
export default function AdminPage() {
  return <Admin />;
}
