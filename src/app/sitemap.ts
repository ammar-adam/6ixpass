import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-static";

const base = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/owners`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/places`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/owners/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/owners/earnings`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
