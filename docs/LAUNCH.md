# Launch checklist

Everything here is clicks in Netlify, Supabase and Wix. Nothing needs code.

## Where things stand (Oct 4, 2026)

Done and checked:
- **Waitlist saves for real.** A test signup through the built site saved a row in `public.waitlist` (201), and the same email again showed "You're already on the list." (409). A signup without consent is refused by Supabase, and nobody can read the list with the public key. The test row is `launch-check-2026-10-04@the6pass.ca` (source `claude-launch-check`): delete it in the Table Editor whenever you like.
- **Site:** offer photos, an app preview, a Join bar on phones, redirects for the old site's links. Lighthouse mobile on the home page: median 93 performance, 100 accessibility, best practices and SEO.
- **App mock at /app:** all 68 click-through checks pass. Lighthouse 96.

Still needs a person:
1. Create the Netlify site (section 1). Nothing has been deployed yet.
2. Move the6pass.ca (section 3). It still serves the old April site.
3. A real mailing address in `src/content/site.ts` (`mailingAddress`). CASL needs it in every email you send, so it must be there before the first launch email.
4. Pick the marketing site palette (`docs/redesign/palette/proposal.html`). The current mist and peach colours are fine to launch with.
5. Lawyer and accountant: privacy policy and terms review, and how HST works on the pass.

## 1. Create the new Netlify site (one time, about 5 minutes)

This makes a brand new site. It does not touch the current sites (`the6pass-toronto`, which serves the6pass.ca today, or `verdant-dasik-7a1dc1`).

1. Go to https://app.netlify.com and log in.
2. Click **Add new site** (it may say **Add new project**), then **Import an existing project**.
3. Click **GitHub**. If asked, click **Configure Netlify on GitHub**, choose your account, and give it access to `6ixpass`. Then pick **6ixpass** in the list.
4. Set **Branch to deploy** to `cowork/seo-geo` (or `main` once that branch is merged). Build command `npm run build` and publish directory `out` fill in by themselves. Don't change them.
5. Click **Add environment variables**, then **New variable** four times:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://nefnflqknwubmurjzqll.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_xTQU4mZ_6iQU1VTo_3-Y2A_Kxg_k-z8` |
   | `NEXT_PUBLIC_SITE_URL` | `https://the6pass.ca` |
   | `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` |

6. Click **Deploy**. After a minute or two the site page shows a green **Published** and a link ending in `.netlify.app`. That's the preview.
7. Optional: **Site configuration** → **Change site name** → `the6pass-new` → **Save**.

From now on, every change saved to that branch on GitHub goes live on the preview by itself.

## 2. Test the waitlist on the preview

1. Open the preview link on your phone.
2. Wait 5 seconds: the popup slides up. Close it with the X. Reload: it should not come back (it waits 3 days).
3. In the form near the top, enter a test email (for example `yourname+test1@gmail.com`). Leave the box unticked and press **Join the waitlist**: it should say "Tick the box so we can email you."
4. Tick the box and press **Join the waitlist**: "You're on the list."
5. In Supabase: open the project → **Table Editor** (left sidebar) → schema `public` → table **waitlist**. The newest row has your test email, `consent` = true, the full consent sentence, and `source`.
6. Open the preview in a private window and sign up with the same email: "You're already on the list."
7. You can delete your test rows in the Table Editor if you like (tick the row, then **Delete**).

Tip: add `?utm_source=test&utm_campaign=preview` to the link before signing up, and those show up as `source` and `campaign`.

## 3. Moving the6pass.ca to the new site (only after approval)

The A record `75.2.60.5` in Wix is Netlify's shared address, so it stays the same.

1. **Old site** (`the6pass-toronto`, the one that serves the6pass.ca today): **Domain management** → next to `the6pass.ca` click **Options** → **Remove domain**. Do the same for `www.the6pass.ca` if it's listed.
2. **New site**: **Domain management** → **Add a domain** → type `the6pass.ca` → **Verify** → **Add domain**. Netlify will also offer `www.the6pass.ca`; accept it.
3. **Wix DNS** for the6pass.ca: edit the `www` CNAME from `the6pass-toronto.netlify.app` to the new site's name, for example `the6pass-new.netlify.app`. (The old value would probably still work because Netlify routes by domain name, but it breaks if the old site is ever deleted.)
4. Back in Netlify, **Domain management** → **HTTPS**: wait until the certificate shows as active (usually minutes, up to an hour), then make sure **Force HTTPS** is on.
5. Check https://the6pass.ca and https://www.the6pass.ca both show the new site, and do one test signup.
6. Old links: https://the6pass.ca/explore should land on the offers, and /for-business on the owners page.

The 6pass.ca and the6pass.com forwards point at the6pass.ca, so they follow automatically.

If anything goes wrong, undo by removing the domain from the new site and adding it back to the old one.
