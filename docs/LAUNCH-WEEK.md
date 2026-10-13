# Launch week: what's left (Oct 13, 2026)

This week's launch is **partnerships**: owner meetings and letters of intent. Members don't get a pass until March 2027. So the job is a public site with a working waitlist, a demo on your phones, an email address that works, and the meeting kit.

Checked from outside today:
- the6pass.ca is connected to Netlify, HTTPS works, and `www` and `http` both redirect to https://the6pass.ca. Good.
- **Every page answers "401": the site is still behind the Netlify login.** Nobody can see it yet.
- **the6pass.ca has no email records (MX).** Mail sent to hello@the6pass.ca bounces. That address is on every page, the owners page, the demo's Next step and the letter of intent.
- The `www` record in Wix still points at the old site (`the6pass-toronto.netlify.app`). It works for now, but breaks if that old site is ever deleted.

## 1. Today (blocks everything else)

**1a. Open the site to the public (2 minutes)**
1. https://app.netlify.com → click the site that has the6pass.ca (probably **the6pass-new**).
2. **Site configuration** → **Access & security** → **Visitor access**.
3. Under **Password protection** or **Team login protection**, click **Configure**, choose **Not protected**, then **Save**.
4. Open https://the6pass.ca in a private window. You should see the home page, not a login.

**1b. Rebuild once on the new address (2 minutes)**
Share images, the sitemap and the QR code in the demo take the site's address when the site is built. Build once now that the6pass.ca is the main address.
1. Same site → **Deploys** → **Trigger deploy** → **Clear cache and deploy site**.
2. Wait for the green **Published**.
3. Check: https://the6pass.ca/sitemap.xml lists `https://the6pass.ca/...` addresses (not `.netlify.app`).

**1c. Make hello@the6pass.ca work (30 minutes, about $10 a month)**
Recommended: Google Workspace, so you and Nida send from hello@the6pass.ca (looks right to restaurant owners and, later, to HR people at firms).
1. Go to https://workspace.google.com → **Get started**. Business name The 6 Pass, 1 user to start (Nida or you), say you already have a domain: `the6pass.ca`. Create the user `hello@the6pass.ca`.
2. Google asks you to prove you own the domain with a **TXT** record. In another tab: Wix → **Domains** → `the6pass.ca` → **⋮** → **Manage DNS records** → **TXT** → **Add record**. Host name: leave blank (`@`). Value: paste Google's `google-site-verification=...` text. **Save**. Back in Google, click **Verify** (can take up to an hour).
3. Google then asks for the mail record. In Wix **Manage DNS records** → **MX** → **Edit MX records** → choose **Other** / **Custom** and add: Host `@`, Points to `smtp.google.com`, Priority `1`. Remove any other MX lines. **Save**. Click **Activate Gmail** in Google.
4. Still in Wix, add two more **TXT** records so your emails don't land in spam:
   - Host `@`, Value `v=spf1 include:_spf.google.com ~all`
   - Host `_dmarc`, Value `v=DMARC1; p=none; rua=mailto:hello@the6pass.ca`
5. In Google Admin (https://admin.google.com) → **Apps** → **Google Workspace** → **Gmail** → **Authenticate email** → **Generate new record**. Add the TXT record it shows to Wix (Host `google._domainkey`), then click **Start authentication**.
6. Test: from your personal Gmail, email hello@the6pass.ca. Reply from it. Both should arrive.

(Free alternative if you only want to receive for now: ImprovMX forwards hello@ to a Gmail. You can't send *as* hello@ easily, so owners would see replies from a personal address.)

**1d. Point `www` at the new site (2 minutes)**
Wix → **Manage DNS records** → **CNAME** → edit `www` → change `the6pass-toronto.netlify.app` to the new site's address (shown in Netlify under **Site configuration** → **Site details**, e.g. `the6pass-new.netlify.app`) → **Save**. Then in Netlify → **Domain management** → **HTTPS**, check the certificate covers both `the6pass.ca` and `www.the6pass.ca`.

**1e. One real signup (3 minutes)**
1. On your phone, open https://the6pass.ca/?utm_source=launchtest and join the waitlist with a test address.
2. Supabase → **Table Editor** → `waitlist`: the row is there with `consent` true and source `launchtest`.
3. Same email again: "You're already on the list."
4. Delete your test rows (and the old `launch-check-2026-10-04@the6pass.ca` row) when done.

## 2. This week (the partnership launch)

- **Put the new demo live.** The new look lives on the `redesign/native` branch. the6pass.ca/partners-demo still shows the old navy one until that branch is merged into the branch Netlify builds (`cowork/seo-geo`). It only changes the demo, not the website. Say the word and Claude merges it.
- **Demo on both phones.** After 1a: open https://the6pass.ca/partners-demo in Safari → Share → **Add to Home Screen** (steps in `docs/MEETING-GUIDE.md`). Open it once on Wi-Fi so it works with no signal in a restaurant. Do one full practice run each.
- **Mailing address for CASL.** Put a real mailing address in `src/content/site.ts` (`mailingAddress`) before any email to the waitlist. A UPS Store box is fine if you'd rather not use home.
- **Meeting kit** (drafts in `docs/partners/`):
  - Deck: content is in `DECK.md`. Claude can turn it into slides.
  - One-pager to leave behind: `ONE-PAGER.md`, print 20 copies.
  - Letter of intent: `LOI.md`. Have a lawyer read it once before the first signature. It's non-binding, but the wording matters.
  - Pipeline: `pipeline.csv`. Put 30 real targets in it, all in one neighbourhood (Ossington is the demo's default).
- **Company name in order.** Before anyone signs anything with the company's name on it: NUANS search and incorporate (`docs/business/INCORPORATION.md`), or sign LOIs as "Nida [surname], on behalf of The 6 Pass (in formation)" until it exists.
- **Instagram @the6pass.** The footer links to it. Claim the handle (and TikTok) today even if you post nothing yet. Owners will look.
- **Google Search Console.** https://search.google.com/search-console → **Add property** → **Domain** → `the6pass.ca` → copy the TXT record → add it in Wix → **Verify**. Then **Sitemaps** → `sitemap.xml` → **Submit**. Same idea at https://www.bing.com/webmasters (it can import from Google).
- **Leave the old sites alone.** Don't delete `the6pass-toronto` or `verdant-dasik-7a1dc1` yet. Once everything above has worked for a week, they can be removed.

## 3. Before members can buy (by March 2027, not this week)

- Prices and HST (accountant), then payments (Stripe) and receipts.
- Lawyer: privacy policy, terms, partner agreement (turns LOIs into signed partners).
- Business bank account, general liability insurance, trademark search for "The 6 Pass".
- The real member app (needs a Mac and an Apple Developer account) and the TestFlight build of the demo.
- A tool to email the waitlist with an unsubscribe link (Mailchimp, Buttondown or similar), using the CASL mailing address.
- Restyle the website in the app's new look.
