# The 6 Pass website

The marketing site and waitlist for The 6 Pass. Next.js (App Router, TypeScript) and Tailwind, exported as plain static files and hosted on Netlify. Waitlist signups go to Supabase (`public.waitlist`, Canada Central).

## For Nida: changing the words

Every word on the site lives in one file: **`src/content/site.ts`**. The privacy and terms pages are in `src/content/legal.ts`.

1. On GitHub, open the repo and click `src` → `content` → `site.ts`.
2. Click the pencil icon (top right of the file, "Edit this file").
3. Change only the words inside the quote marks. Keep the quotes, commas and brackets.
4. Click the green **Commit changes...** button, then **Commit changes** again.
5. Netlify rebuilds the site in about a minute. If something is broken, Netlify keeps the last good version live, and Ammar will get an email.

Please don't change `consentLabel`: it's the legal consent wording, and it's saved with every signup.

## For Ammar: running it locally

```bash
cp .env.example .env.local   # publishable key only
npm install
npm run dev                  # http://localhost:3000
npm run lint && npm run build  # static output in ./out
```

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nefnflqknwubmurjzqll.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The `sb_publishable_...` key. Never a secret or service_role key. |
| `NEXT_PUBLIC_SITE_URL` | `https://the6pass.ca`. Used for canonical links, sitemap and the share image. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false`. See `src/lib/analytics.ts`. |

## Where things are

| File | What it does |
|---|---|
| `src/content/site.ts` | All copy, launch date, FAQ, offers, owners section |
| `src/content/legal.ts` | Privacy and terms placeholder text |
| `src/lib/waitlist.ts` | Supabase insert, source and campaign tracking |
| `src/components/WaitlistForm.tsx` | The form, its errors and states |
| `src/components/WaitlistPopup.tsx` | Popup timing (5 s or 45% scroll), 3-day snooze, focus trap |
| `src/lib/analytics.ts` | Analytics hook, off until enabled |
| `netlify.toml` | Build settings and headers |

## Waitlist rules

- Insert: `POST /rest/v1/waitlist` with header `apikey` only (no `Authorization: Bearer`), `Prefer: return=minimal`.
- 409 means the email is already there: the form shows "You're already on the list."
- RLS rejects rows without consent, and the form also blocks them before sending.
- `source` = `utm_source`, else the referring site, else `direct`. `campaign` = `utm_campaign`.
- The popup never shows again once someone joins (`localStorage` key `t6p_joined`), and snoozes for 3 days when closed (`t6p_popup_snooze_until`). To see it again while testing, clear site data in the browser.
