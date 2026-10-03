# The 6 Pass: website project notes

Engineer: Ammar. Business owner: Nida (Ammar's mom, not technical). This repo is the site (Next.js static export on Netlify). All copy lives in `src/content/site.ts`.

## Product
Premium Toronto membership. One yearly pass: two-for-one, or a free upgrade, at hand-picked restaurants, spas, yoga/pilates studios, hotel restaurants and spas, experiences. Modeled on The Entertainer, but curated.
- Premium, never Groupon. No coupons, no expiring vouchers, no fine print. "Fewer places. Better ones." "Fifty great spots beat two hundred average ones."
- 50 hand-picked Founding Partners at launch, one neighbourhood at a time.
- Core idea: bring someone, and come back. A reason to go out on a Tuesday.
- Hotels: offers on their restaurants and spas, never free room nights. Spas: free upgrade/add-on on a bigger treatment, not a full second treatment.
- Audience: 20s/30s downtown professionals (Bay Street: finance, law, consulting, Big 4). Also students and newcomers.
- Future (tone only): employer perk (Big 4, law firms, banks; LSA-paid), later a bank card. Must look credible to an HR lead. Competitor: Perkopolis (big discount catalogue); we're the opposite. NO corporate section yet; at most a quiet "For teams: hello@the6pass.ca".
- First neighbourhoods: Financial District, King West, Queen West, Ossington, Yorkville, Leslieville.

## Decisions (NOT public)
- Tiers: 6 Pass $49 (restaurants, cafés), 6 Pass Plus $79 (+ spas, yoga, gyms, studios), 6 Pass Black $149 (+ hotel restaurants/spas, experiences, first access).
- Beta Jan to Feb 2027, ~200 from waitlist, $29. Founding price 20% off ($39/$63/$119), Mar 15 to 18, 2027 only. Waitlist promise = "founding member pricing".
- **Never show prices until Ammar says so. Use [PRICE].** HST treatment unsettled.
- Offer rules: food, services, non-alcoholic only (AGCO). In person only. Merchant sets uses/member/year (default 2, max 12), at least 3 days/week, own days + blackouts. Pause with 7 days' notice.
- Merchant terms (agreed for the site Oct 3, 2026; see Process): free 12 months from go-live, no commission, no per-visit fee, no setup. First 50 = Founding Partner badge, featured at launch. Never quote a year-2 price. 30 days' notice either side.
- Launch Tue Mar 16, 2027 (countdown to 9:00 Toronto time). 50 merchants by Mar 7. Waitlist target 3,000 by Mar 14.

## Hard rules
- Do NOT touch the existing Netlify site `verdant-dasik-7a1dc1`, its domains, or any DNS. New site = NEW Netlify site. Ammar swaps the domain.
- Supabase: connect, never change. Never delete/alter/migrate `public.waitlist` or its policies. Schema change ideas: write SQL, ask first. Never use or commit a service role/secret key.
- No alcohol anywhere (offers, images, copy).
- No invented stats, member counts, testimonials, reviews, press logos, or real business names/logos. Fictional names only.
- Copy: plain, warm, short sentences. No em dashes. No hype words ("revolutionary", "unlock", "elevate").
- Accessible: real labels, visible focus, 4.5:1 contrast, reduced motion. Lighthouse 90+ mobile.
- Copy that changes (FAQ, offers, owners, launch date) lives in ONE content file. Explain Netlify/GitHub steps as exact clicks.
- Avoid stock AI looks: dark bg + one red/acid accent, cream + terracotta + serif, purple gradients, Inter/Space Grotesk, emoji, everything centered, identical rounded cards with accent bars.
- Commit as you go.

## Supabase
- URL https://nefnflqknwubmurjzqll.supabase.co, region Canada (Central).
- Publishable key (public): `sb_publishable_xTQU4mZ_6iQU1VTo_3-Y2A_Kxg_k-z8`. Put in `.env.local` + Netlify env vars, not hardcoded.
- `public.waitlist`: id bigint identity, email text not null (unique on lower(email)), first_name, neighbourhood, consent bool, consent_text, source, campaign, created_at default now().
- RLS: anon INSERT only when consent = true and email length 5..254. No public SELECT.
- Insert: `POST /rest/v1/waitlist`, headers `apikey`, `Content-Type: application/json`, `Prefer: return=minimal`. No `Authorization: Bearer` with sb_publishable keys. 409 = duplicate: show "You're already on the list."

## Waitlist spec
- Inline form + popup (after ~5s or 45% scroll; snooze 3 days on close; never after joining; Esc, close button, focus trap, phone-friendly).
- Fields: email (required), first name, neighbourhood (optional). UNTICKED consent checkbox required, exact label (CASL): "Yes, email me about The 6 Pass launch and founding member pricing. I can unsubscribe any time." Save as consent_text verbatim.
- source = utm_source, else referrer host, else "direct". campaign = utm_campaign.
- States: inline errors, loading, success, already-on-list.

## Existing copy to keep/improve
- "Toronto, two for one." / "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across the city. Bring someone, and come back."
- Offers: Restaurants "Second main, on us." Spas "A free upgrade on your treatment." Yoga and studios "Bring a friend to class, free." Caption "Example offers. Each partner sets its own."
- How it works: 1 Get your pass. 2 Pick a spot (offer, days, how many uses). 3 Show your code (tap Redeem, staff confirm, second one is on the house).
- Owners: "We're choosing 50 Founding Partners. Free for your first 12 months, and you set the offer, the days and the limits." hello@the6pass.ca

## Stack
Next.js (App Router, TS), Tailwind, static-first. New Netlify site. Footer: The 6 Pass, Toronto, ON, hello@the6pass.ca, privacy, terms, @the6pass.

## Design (direction C, "Tuesday", chosen by Ammar)
- Palette: mist #E3ECEB (page), mist-2 #D3E0DF, ink #0F2E33 (text, dark sections), muted #3D585C, pale #C9D8D7 (text on ink), peach #F4B393 (fills, and text only on ink), peach-soft #F9D6C3 (positioning section). Tokens in `src/app/globals.css`.
- Type: Newsreader 400/500 + italic (headlines), Schibsted Grotesk (body/UI), via next/font. Static weights on purpose: the variable opsz font cost ~30 Lighthouse points.
- Signature: the pass card with the Mon to Sun strip of the partner's chosen days. The "Lantern House" example is fictional.

## Status
- Step 1 done (mockups in the old repo, `the6pass/design/`).
- Step 2 built. Lighthouse mobile (local, gzip): perf 94 to 98, a11y/bp/seo 100.
- Not yet verified: a real insert into Supabase (the build sandbox can't reach supabase.co), Netlify preview. Ammar hasn't created the new Netlify site yet as of Oct 3.

@AGENTS.md

## Rules added Oct 3, 2026 (next-build brief)
- Deploying to a Netlify PREVIEW is allowed. Production domain swap is Ammar's call only. Never touch a domain.
- the6pass.ca currently shows an unrelated old April site from another Netlify site. Nothing from it is reused.
- Supabase: new tables only through migrations in `supabase/migrations/` (timestamped). Ammar reviews and runs them. Never run SQL against a live project. `public.waitlist` and its policy are never touched.
- App development uses a separate Supabase project `the6pass-dev`, via env vars. Production gets migrations only when a phase is approved.
- Every table gets RLS in the same migration that creates it. No anon access unless a policy says exactly what and why (commented).
- Service role / secret keys only in server-side code via env vars. Never `NEXT_PUBLIC_`, never in the repo or client bundles. The content check fails the build if `service_role` or `sb_secret_` appears in `out` or `.next/static`.
- One phase at a time; stop after each with: what changed, how it was verified, what wasn't, what Ammar must click.
- Plan: Part 1 preview live + real waitlist insert verified. Part 3 Phase A `/demo` (before Oct 12). Then Part 2 site upgrade (photos, app screens, `/owners` page + `merchant_leads` migration, sticky phone bar, 404). Then Phase B data model/auth, C admin then partner portal then member app, D Stripe (not before HST/pricing final).
- Areas: member app `/app` (PWA), partner portal `/partner`, admin `/admin`. Move off `output: "export"` to Netlify's Next.js runtime only when the first server route is needed.

## Demo (`/demo`, Phase A)
- Client-only, no auth, no database. Seed data in `src/demo/data.ts` (12 fictional places), state in `src/demo/store.ts` (localStorage, "Reset demo").
- Screens: Explore (category + neighbourhood filters), place page (offer, day strip, uses left, rules, Redeem with 6-digit code and 10-minute timer, confirmed state with estimated saving), My pass, staff Redemptions (confirm, example week), Your offer (kind, text, days min 3, uses 1 to 12, blackouts, pause, live preview, alcohol words rejected).
- "Today" is computed only in the browser (`useToday`) so static HTML never bakes in the build day.
- Nida's guide: `docs/DEMO.md`. Images are `PlaceArt` placeholders until photos can be downloaded (this environment's network blocks Unsplash/Pexels).

## Process (from the Oct 3, 2026 audit)
- Work in a branch. Netlify preview first. Production only when Ammar says so.
- `npm run build` runs `scripts/check-content.mjs`, which fails on "Inc.", prices, invented counts, "6ix", app-store claims and real business names. Keep it passing; add names there, never remove rules.
- Merchant terms now agreed for the site: free 12 months from go-live, no commission, no setup cost, Founding Partner status for the first 50, 30 days' notice either side. Never promise year 2.
- No native app. Say "web app" if anything.
