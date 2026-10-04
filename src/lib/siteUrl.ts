/**
 * The site's own address, for share images, canonical links and the sitemap.
 * On Netlify, URL is the site's main address: the .netlify.app one today,
 * the6pass.ca once the domain moves over. Elsewhere, NEXT_PUBLIC_SITE_URL.
 * Build-time only: use it in server code, not in client components.
 */
export const SITE_URL = (process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "https://the6pass.ca").replace(/\/$/, "");
