import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-static";

const base = SITE_URL;

/*
 * Everyone is welcome to read the site, including AI assistants.
 * The named list makes that explicit for the crawlers that look for
 * their own name before falling back to "*".
 */
const NAMED_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "DuckAssistBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/demo", "/app", "/partners-demo"] },
      { userAgent: NAMED_CRAWLERS, allow: "/", disallow: ["/demo", "/app", "/partners-demo"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
