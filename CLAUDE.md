# The 6 Pass: website project notes

Engineer: Ammar. Business owner: Nida (Ammar's mom, not technical). This repo is the site (Next.js static export on Netlify). All copy lives in `src/content/site.ts`.

- Ammar's name never appears on the public site, the app or anything members or owners see (Oct 24). Nida is the only named founder. CI fails on 'Ammar' in the build.

## Product
Premium Toronto membership. One yearly pass: two-for-one, or a free upgrade, at hand-picked restaurants, spas, yoga/pilates studios, hotel restaurants and spas, experiences. Modeled on The Entertainer, but curated.
- Positioning (Oct 24, "middle ground"): lead with two-for-one savings across Toronto and the GTA, for everyday people who like going out. Keep the look and "hand-picked". Never Groupon: no coupons, no expiring vouchers, no fine print.
- No hard partner count anywhere (no "fifty"/"50"). Goal is 100+ places before launch. First partners are "Founding Partners" (badge, featured at launch).
- Core idea: bring someone, and come back. A reason to go out on a Tuesday.
- Hotels: offers on their restaurants and spas, never free room nights. Spas: free upgrade/add-on on a bigger treatment, not a full second treatment.
- Audience: 20s/30s downtown professionals (Bay Street: finance, law, consulting, Big 4). Also students and newcomers.
- Future (tone only): employer perk (Big 4, law firms, banks; LSA-paid), later a bank card. Must look credible to an HR lead. Competitor: Perkopolis (big discount catalogue); we're the opposite. NO corporate section yet; at most a quiet "For teams: hello@the6pass.ca".
- First neighbourhoods: Financial District, King West, Queen West, Ossington, Yorkville, Leslieville.

## Decisions (NOT public)
- Private decisions (membership tiers and prices, beta and founding pricing, launch targets), the business model, the partner pipeline, strategy, research, the merchant deck, email templates and meeting guides live in Google Drive ("The 6 Pass HQ"), NOT in this repository. Never commit them here again.
- **Never show prices until Ammar says so. Use [PRICE].**
- Offer rules: food, services, non-alcoholic only (AGCO). In person only. Merchant sets uses/member/year (default 2, max 12), at least 3 days/week, own days + blackouts. Pause with 7 days' notice.
- Owner cost (Oct 24): agents and outreach emails may say only: "It's free for partners while we launch. No commission, no fees. Anything after that we agree in writing, together, well before it applies." Never add a duration, number or date. The website, app and deck stay silent on owner cost until Ammar says otherwise.
- The business is run by agents (Claude scheduled tasks). Their instructions live in the Drive doc "13 Agent handbook (runs the business)"; shared memory is the Drive sheet "Operations log". Nida only goes to meetings (records them in Granola) and does walk-ins; never give her technical tasks. Agents escalate to hello@the6pass.ca with cc aa.ammaradam@gmail.com.
- Launch Tue Mar 16, 2027 (countdown to 9:00 Toronto time).

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
- Owners: "We're choosing 50 Founding Partners. You set the offer, the days and the limits." hello@the6pass.ca

## Stack
Next.js (App Router, TS), Tailwind, static-first. New Netlify site. Footer: The 6 Pass, Toronto, ON, hello@the6pass.ca, privacy, terms, @the6pass.

## Design (direction C, "Tuesday", chosen by Ammar)
- Palette: mist #E3ECEB (page), mist-2 #D3E0DF, ink #0F2E33 (text, dark sections), muted #3D585C, pale #C9D8D7 (text on ink), peach #F4B393 (fills, and text only on ink), peach-soft #F9D6C3 (positioning section). Tokens in `src/app/globals.css`.
- Type: Newsreader 400/500 + italic (headlines), Schibsted Grotesk (body/UI), via next/font. Static weights on purpose: the variable opsz font cost ~30 Lighthouse points.
- Signature: the pass card with the Mon to Sun strip of the partner's chosen days. The "Lantern House" example is fictional.

## SEO and GEO (search engines and AI assistants)
- `/about` ("What is The 6 Pass?") is the facts page. Its copy lives in `src/content/about.ts`. Only things that are true today.
- Structured data is in `src/lib/structuredData.ts` and is built from the content files (Organization, WebSite, FAQPage from the visible FAQ, AboutPage). Never hand-write JSON-LD in a page, and never add Offer, Product, price, rating, review, `sameAs` or partner names until they are real.
- `public/llms.txt` repeats the `/about` facts for AI crawlers. Update it whenever `/about` or the launch date changes.
- `src/app/robots.ts` allows every crawler and names the main AI ones. `/about` is in the sitemap.
- CI fails if the built site contains `$199`, `230+`, ` Inc.`, `the6ixpass`, `App Store`, `Google Play`, `service_role` or `sb_secret_`.
- Steps for Ammar after the domain is live: `docs/SEO.md`.

## Owners page and demo
- `/owners` is the page Nida sends after a conversation. Copy and the worked example numbers live in `src/content/owners.ts`; the table is calculated from those numbers. No cost or terms for owners anywhere on the page (see Decisions). If asked: "Happy to walk you through it on a call."
- `/demo` is a clickable phone demo for owner conversations (member view, redeem with a code, partner view, "your offer" settings). It is one client component, `src/demo/Demo.tsx`, with made-up places in `src/demo/data.ts`. Nothing is saved and nothing talks to a server. It is `noindex` and disallowed in robots.txt.
- Every place in the demo is fictional. Before adding a name, search that it is not a real Toronto business. Real partners come from the database once the app exists.
- The demo has its own palette, `.app-theme` in `globals.css`: white and near-black, one brass accent, green only for "runs today". Ammar rejected the site's mist and peach palette for the app as not professional. Do not bring pastels or drawn illustrations back into the app.
- The demo always pretends today is Tuesday (`TODAY` in `data.ts`) so the walkthrough is the same every time.

## Status
- Step 1 done (mockups in the old repo, `the6pass/design/`).
- Step 2 built. Lighthouse mobile (local, gzip): perf 94 to 98, a11y/bp/seo 100.
- Oct 4, 2026: real Supabase insert verified (201, then 409 on repeat; no-consent insert refused 42501; public SELECT returns nothing). Test row `launch-check-2026-10-04@the6pass.ca`, source `claude-launch-check`. Netlify preview still not created (no Netlify access from here).
- Oct 4: home page got offer photos (`offers.items[].image`), an app preview (`appPreview`, screens in `public/preview/*.webp` captured from /app), a phone Join bar (`MobileJoinBar`, copy `mobileBar`), `site.mailingAddress` (empty until real), and Netlify 301s for old /explore, /for-business, /contact. Readiness list: top of `docs/LAUNCH.md`.

@AGENTS.md

## Redesign (docs/REDESIGN.md), status Oct 3, 2026
- Step 1 done: `docs/design-notes.md`. Step 2 done: three directions as working components at `/demo/directions/<a|b|c>/<browse|place|redeem>` (`src/demo/directions/`), comparison image `docs/redesign/three-directions.png`. Ammar said "you choose": direction B (Concierge) was picked.
- Photos: `public/demo/<place>-<640|1200>.webp`, credits in `docs/IMAGE-CREDITS.md` (Openverse, CC0 plus one CC BY that needs a visible credit in the demo). Unsplash/Pexels block automated access from this environment.
- Places have an `image` field in `src/demo/data.ts`. Icons: lucide-react and @phosphor-icons/react.
- Chromium here needs the proxy CA in `~/.pki/nssdb` (certutil) to load external sites.
- Step 3 done: `/demo` (`src/demo/Demo.tsx`) is reskinned in direction B: navy #0A1424, panel #122038, ice #A9D1FF, text #F3F6FB, muted #A9B5C9, ok #7CE2A4; DM Serif Display + Figtree; Phosphor icons. Walkthrough screenshots in `docs/redesign/walkthrough/`, sheet `docs/redesign/walkthrough-b.png`.
- Site pages live in the `src/app/(site)/` route group, whose layout loads Newsreader + Schibsted (`src/app/fonts.ts`), so `/demo` only downloads its own fonts. Font tokens are `@theme inline` in globals.css for that reason.
- Redemptions store the offer text at the time of redeeming (history doesn't change when the offer is edited).
- Step 4 waiting on Ammar: B clashes with the site's mist/peach palette, so a shared palette was proposed (`docs/redesign/palette/proposal.html`, screenshots alongside): navy #0A1424, panel #122038, ice #A9D1FF, paper #F5F7FA, harbour #1E4E8C, slate #4B5A73; DM Serif Display + Figtree for both. Do not change the site until he says yes.

## App mock at /app (docs/APP-MOCK.md), Oct 4, 2026
- Code: `src/mock/` (store, ui, AppShell, screens), routes in `src/app/app/`. Direction B. Data from `src/demo/data.ts`; today pinned to Tuesday, demo date 2027-03-23 (for blackout dates).
- State in localStorage key `t6p_app_mock_v1` (try/catch); two windows stay in sync via the storage event. Reset in My pass.
- URLs: /app, /app/place/<slug>, /app/redeem/<slug>, /app/pass, /app/partner, /app/partner/offer. `/demo` redirects to /app (netlify.toml 301 + client redirect). `/app` and `/demo` are noindex and disallowed in robots, not in the sitemap.
- Installable: `/app/manifest.webmanifest`, icons at /app/icon-*.png, network-first service worker `public/app-sw.js` (scope /app).
- Run on Windows: `run-app.bat` (installs once, then `npm run app` with OPEN_BROWSER=1). `npm run app` = `scripts/run-app.mjs` (next dev on 3000, prints the /partners-demo link). Guide: `docs/RUN-ON-A-LAPTOP.md`.
- Click-through: 68 checks at 1280 and 390 wide, against the static export and `npm run app`; results `docs/app-mock/RESULTS.md`, screenshots `docs/app-mock/`.
- The old `src/demo/Demo.tsx` is gone; `/demo/directions/*` comparison pages remain.

## Site palette (Oct 4, 2026, Ammar: "I like the white, the green bg is eh")
- White page, near-black ink #15191c, light grey #f4f5f5 for the odd section and the footer, peach #f4b393 only as a small highlight. Dark bands only for the app preview and the countdown panel (home), the redeem steps (owners) and the about CTA.
- Tokens live in `src/app/globals.css` (`@theme`); the old mist green and teal ink are gone. Hero card uses a real photo (`hero.card.image`).


## Copy tone (Oct 4, 2026, Ammar: "get rid of even on a tuesday and cringe words")
- Plain and factual. No slogans or clever second lines: removed "Even on a Tuesday.", the "Bring someone. Come back." heading, "Fewer places. Better ones.", "Fifty great spots beat two hundred average ones.", "Tap, show, enjoy.", "Get in early.", "Welcome in.", "Fill the quiet nights. Keep the busy ones.", "it takes ten seconds", and the neighbourhood taglines. Don't add them back.
- `*Italic` title fields are optional now: leave them "" and nothing extra renders.

## Logo (SETTLED, Ammar Oct 4, 2026)
- The logo is settled: `src/components/Wordmark.tsx` (site) and the `Wordmark` in `src/mock/ui.tsx` (app). Cormorant Garamond bold, "the 6 pass" with the 6 in red italic. **Don't redesign or replace it.**
- Font: `cormorant` in `src/app/fonts.ts` (`--font-logo`), also loaded by the /app layout. Red #E0382A on the site, #FF5A4A in the navy app.
- Not yet matched: the share image (`src/app/_og/card.tsx`) and the app screenshots in `public/preview/` still show the old ringed-6 mark.
- Not part of the logo and unchanged: the small ringed-6 favicon (`src/app/icon.svg`) and app icon (`src/mock/appIcon.tsx`).

## Home page copy follows Nida's original page (Oct 4, 2026)
- The home page copy follows Nida's original coming-soon page: headline (with "two" in italic), join form, countdown, three example offers, owners. **Don't rewrite or expand it without asking Ammar first.** Her wording is in `src/content/site.ts` (`hero`, `offers`, `owners`, `countdown.label`, `waitlist.popup*`, `waitlist.success`).
- Section order on `/`: hero with countdown, example offers, owners, how it works, app preview, questions, footer. Nav (`nav` in site.ts) follows the same order.
- Cut from home: "Why the list is short", the neighbourhoods section, the hotel and experiences offer rows, the owners bullet list and "Your offer" panel (both live on `/owners`). The neighbourhood dropdown in the form stays.
- The consent checkbox label is legal (CASL) wording: never change it.

## Owner side of the demo (merchant demo), Oct 4, 2026
- Brief: `docs/MERCHANT-MOCK.md`; reference: Nida's `docs/reference/nida-merchant-demo.html` (she loves it: keep her wording). Ammar's prompt overrides the brief: navy direction B, owner side inside `/app`.
- Routes: `/partners-demo` (start: Start demo, Set up a place, gear quick setup, New meeting), `/app/owner/setup` (onboarding, one question per screen), `/app/owner` (dashboard, replaces the old Partner tab; `/app/partner*` redirect there), `/app/owner/next` (next step, QR to /owners, mailto). All noindex, disallowed in robots, not in the sitemap. The only public link is "Demo for owners" on `/owners`.
- Code: `src/mock/owner.ts` (categories, offer wording, colours, photo resize), `src/mock/screens/owner/*`, store additions in `src/mock/store.ts` (`owner`, `draft`, `paused`, `saveOwner`, `updateOwnerOffer`). The owner's place id is `your-place`.
- Fixed wording: staff line "Check the code matches, then tap Confirm. No scanner, no app, no login at the host stand."; "Sample month · illustrative numbers" (never present those numbers as real); "Paused by the venue". No cost or terms for owners anywhere in the app (see Decisions); the old "Free for founding partners..." and "You pay $0" lines are withdrawn and must come out of the demo.
- Offline: service worker generated by `src/app/app-sw.js/route.ts` (scope `/`, only demo paths). Bump `CACHE` there if the caching logic changes.
- Decisions: `docs/merchant-mock/DECISIONS.md`. Click-through results and screenshots: `docs/merchant-mock/`. Nida's how-to: `docs/MEETING-GUIDE.md`.


## App look: C2 light (branch `redesign/native`, Ammar picked Oct 13, 2026)
- Spec: `docs/redesign/proto/c2.html` (light). Applied to the real demo (`src/mock/**`) on branch `redesign/native` only; `cowork/seo-geo` keeps the old navy demo until Ammar says merge.
- Tokens in `src/mock/app.css` (CSS variables on `.app-mock`) and `C` in `src/mock/ui.tsx`: bg #FAF8F5, card #FFF, ink #16140F, secondary #6E685E, hairline rgba(22,20,15,.12), copper accent #9A5A32 (small labels only), ok #2E7D57, pass #1B1A17. System font (SF on Apple; Inter only as the stand-in elsewhere, `--f-ui`), Cormorant 600 (`--f-display`) only for place names. 8pt grid, 20px margins, 12px cards, grouped lists with hairlines, translucent bars, bottom sheets (`Sheet` in ui.tsx), iOS switch/segmented/stepper in `screens/owner/controls.tsx`.
- Flow: `/partners-demo` (Nida's screen, never shown to owners) → Start demo → `/app` Explore with the owner's place as the hero → place → Redeem opens the code as a sheet on a Wallet-style pass → Confirm → Redeemed → owner view. Dashboard offer rows open edit sheets.
- Laptop: the app sits in a drawn iPhone on a warm grey desk (md and up). `npm run app` opens /partners-demo. Guide: `docs/RUN-ON-A-LAPTOP.md` (Windows and Mac).
- Checks: `scripts/merchant-walk.mjs` (112) and `scripts/member-walk.mjs` (550, every place) at 390 and 1280; `scripts/places-check.mjs` (data rules, runs in CI), `scripts/two-phone-walk.mjs` (35, two browsers over live Supabase Realtime, camera scan). Two phones: `src/mock/live.ts`, Supabase Realtime broadcast on `t6p-room-XXXX`, public key only, no tables, nothing stored. Demo places, menus and hours live in `src/demo/places.ts`; all fictional. Service worker cache `t6p-demo-v5` also saves the page-data `.txt` files so tapping around works offline.
- Waiting on Ammar: his own c2.html tweaks (he'll describe them), then restyle the website to match.
- Oct 13: website restyled to match (branch `redesign/native` only): tokens in `src/app/globals.css` (paper #FAF8F5, mist #F1EDE7, ink #16140F, muted #6E685E, copper #9A5A32, `shadow-card`), Cormorant 500/600 for headlines (`--font-display`), each device's system font for body (no Inter on the site, for speed). Sticky translucent header, pill buttons, white rounded cards with hairlines (offers, steps, FAQ, owners lists), PassCard drawn like the app's place card, new app screenshots in `public/preview/`. Nida's home copy unchanged; one owner-view phone shot added beside "For owners" on the home page. Lighthouse home (mobile): perf 88/90/92, a11y 100.
- Partner deck (Slides artifact): https://claude.ai/artifact/K3PLmZNhjK2rKKr3axuXLV, 9 slides in one layout (text left, picture right, same footer), dark first and last slide.

## App accounts and scanning (branch `claude/app-accounts`, Oct 18, 2026)
- Accounts: `src/lib/auth/` (interface `types.ts`; `local.ts` demo accounts on the device, used today; `supabase.ts` real accounts, on only with `NEXT_PUBLIC_AUTH_MODE=supabase`). Separate member and business sessions. Guards in `src/mock/Guard.tsx`. Copy in `src/content/app.ts`.
- Demo logins (device only, labelled Demo): alex@example.com, owner@partner.example (owner of Lantern House and Fennel & Ash), staff@partner.example; password demo1234. Nida's meeting demo signs itself in (`useMeetingDemo`) and keeps the Confirm-on-the-member's-phone flow.
- Routes: /app (landing when signed out), /app/account/{sign-in,sign-up,forgot,reset,setup}, /app/account, /app/business (partner login), /app/business/{places,scan,today,team,join}. Owner dashboard /app/owner is owners only.
- Real accounts need Ammar's approval and clicks: `docs/app/SUPABASE-ACCOUNTS.sql` (not run on the real project; tested on a local Postgres stub, all checks pass) and `docs/app/ACCOUNTS.md`.
- No costs or terms anywhere in the app (founder, Oct 18): no "$0", fees, commission, 12 months or notice lines on the owner side or in Nida's demo. Next step talks about Founding Partners and a letter of intent.
- Scanner: `src/mock/scanner.tsx` (native `@capacitor/barcode-scanner` in the iPhone app, BarcodeDetector or jsQR on the web). Member code as QR plus Code 128 (`src/mock/codes.tsx`). Netlify Permissions-Policy is `camera=(self)`.
- Checks: `scripts/accounts-walk.mjs` (89), `scripts/supabase-mode-check.mjs` (17, Supabase faked, needs a build with the flag), member-walk 552 (550 on `scripts/ios-router-sim.mjs` with NO_SW=1), merchant-walk 114, two-phone-walk 35, cross-phone-walk 14 (two separate phones on demo accounts: business sign-up, code relay). Service worker cache is `t6p-demo-v7`.
- Demo accounts on two phones: `src/mock/relay.ts` lets a staff phone ask the member's phone about a code over Supabase Realtime broadcast (channel `t6p-codes`, nothing stored). New businesses can sign up on demo accounts (`/app/business/new`, own one place); with real accounts that screen is hidden and businesses are set up by us.
- Sign-up emails: `docs/app/SIGNUP-ALERTS.md` (Supabase triggers on waitlist and auth.users call a Google Apps Script in hello@). Real accounts switch: branch `claude/app-real-accounts`, merge only after Ammar runs the SQL. Screens: `docs/app/screens/`.

## Site realism pass (branch `claude/site-real`, Oct 18, 2026)
- Plan: `docs/site/REALISM-PLAN.md`. Founder's calls: new section order yes; "Where we open first" framed as Toronto and the GTA, one neighbourhood at a time, no dates per area; "Toronto first" is gone everywhere; founders note is plain facts only (a Toronto family business run by Nida and Ammar, we'll share the places before we open); FAQ says the member must be there in person.
- Home order: hero (app landing screen in a drawn phone, after the countdown on phones), How a visit works (`appStrip`, five screens), Offers (with example details), Where (`launchAreas`), For owners, Who's behind it (`founders`), FAQ (11), closing join form (`closing`, `WaitlistForm placement="footer"`), footer with two link columns.
- App screens: `scripts/site-shots.mjs` (393x852 at 3x, status bar 9:41, demo text and counts hidden, fails if any demo or cost text is visible) → `public/preview/v2/<name>-{600,900,1179}.webp`, masters in `docs/site/screens/app/`. Frame: `src/components/Phone.tsx` (CSS only). `PhoneShot` and `PassCard` are gone.
- Checks: `scripts/site-walk.mjs` (70, waitlist and popup with Supabase faked), `scripts/site-page-shots.mjs` (full-page shots into `docs/site/screens/`). CI now also forbids `12 months`, `No commission`, `You pay`, `30 days' notice` and `Toronto first` in the build, and em dashes in `src/content` and `llms.txt`.

