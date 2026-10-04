import { ownersPage as c } from "@/content/owners";
import { ogCard, ogSize } from "../../_og/card";

export const dynamic = "force-static";
export const alt = "The 6 Pass for owners. Fill the quiet nights.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    headline: c.title,
    headlineItalic: c.titleItalic,
    pill: "For owners",
    note: "Free for your first 12 months. You set the offer.",
    fontSize: 100,
  });
}
