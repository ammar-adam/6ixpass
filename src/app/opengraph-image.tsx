import { hero, site } from "@/content/site";
import { ogCard, ogSize } from "./_og/card";

export const dynamic = "force-static";
export const alt = "The 6 Pass. Toronto, two for one.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    headline: hero.headline,
    headlineItalic: hero.headlineItalic,
    pill: site.launchShort,
    note: "Join the waitlist for founding member pricing",
  });
}
