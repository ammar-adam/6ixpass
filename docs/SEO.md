# Getting found: search engines and AI assistants

What the site already does (nothing to click):
- Every page has its own title, description, canonical link and share image.
- `/about` ("What is The 6 Pass?") states the facts in plain sentences.
- Structured data tells Google and Bing what the business is and what the FAQ says.
- `/llms.txt` and `/robots.txt` welcome AI assistants (ChatGPT, Claude, Perplexity, Gemini).
- `/sitemap.xml` lists every page.

Do these once, after the site is live on https://the6pass.ca. About 20 minutes.

## 1. Google Search Console

1. Go to https://search.google.com/search-console and sign in with the Google account for The 6 Pass.
2. Click **Add property**, choose **Domain**, type `the6pass.ca`, click **Continue**.
3. Google shows a line starting with `google-site-verification=`. Click **Copy**.
4. In Wix: profile picture, then **Domains**, then the6pass.ca, then the three dots, then **Manage DNS Records**. Under **TXT (Text)** click **Add Record**. Host: leave blank (or `@`). Value: paste. Save.
5. Back in Search Console click **Verify**. If it fails, wait 15 minutes and click it again.
6. In the left menu click **Sitemaps**, type `sitemap.xml`, click **Submit**.
7. In the search bar at the top paste `https://the6pass.ca/` and press Enter, then click **Request indexing**. Do the same for `https://the6pass.ca/about`.

## 2. Bing Webmaster Tools (ChatGPT search reads Bing's index)

1. Go to https://www.bing.com/webmasters and sign in.
2. Choose **Import from Google Search Console** and follow the prompts. It copies the site and sitemap across.
3. If import isn't offered: **Add a site**, enter `https://the6pass.ca`, verify with the DNS option the same way as step 4 above, then **Sitemaps**, **Submit sitemap**, `https://the6pass.ca/sitemap.xml`.

## 3. Check the structured data

1. Go to https://search.google.com/test/rich-results
2. Paste `https://the6pass.ca/` and click **Test URL**. It should read the page with no errors.
3. Repeat for `https://the6pass.ca/about`.

## 4. Check what AI assistants say (monthly, 5 minutes)

Ask ChatGPT, Claude, Perplexity and Gemini each of these, and note the answer and whether the6pass.ca is cited:
- "What is The 6 Pass in Toronto?"
- "Two for one restaurant membership Toronto"
- "Is there something like The Entertainer app in Toronto?"

Keep the answers in a note with the date. Wrong facts usually mean a page on the site is unclear: fix `/about` first.

## Rules that keep this honest

- Never add prices, ratings, reviews or partner names to structured data until they are real and public.
- When the launch date or the facts change, update `src/content/site.ts`, `src/content/about.ts` and `public/llms.txt` together.
