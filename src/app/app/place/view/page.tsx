import type { Metadata } from "next";
import { ViewById } from "@/mock/screens/ViewById";

// Places from the database: /app/place/view?id=<id> (see src/mock/links.ts).
export const metadata: Metadata = { title: "Place" };

export default function Page() {
  return <ViewById screen="place" />;
}
