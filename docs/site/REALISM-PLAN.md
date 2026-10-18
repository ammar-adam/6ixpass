# Making the6pass.ca feel real: diagnosis and build plan

Written Oct 18, 2026 for the agent who builds it. Ammar's brief: "I'm not in love with the way the app is shown on the website. I also don't think the content on the website makes you think this is real."

Binding rules still apply (see `CLAUDE.md`): no invented stats, member counts, testimonials, reviews, press logos or real business names; no alcohol; no member prices; no cost or terms for owners; no em dashes; plain, warm, short sentences; none of the removed slogans ("Fewer places. Better ones.", "Even on a Tuesday." and the rest of the Oct 4 list); Nida's home copy stays unless Ammar says otherwise. CI fails on `App Store` and `Google Play`, so nothing below uses store badges or those words, not even in alt text.

Items marked **[Ask Ammar]** change section order, add a section he cut before, or state something about the founders. Build them on the branch, but get his yes before merging.

Screenshots this plan is based on (live site, Oct 18, 1440 and 390 wide, full page): `the6pass.ca/`, `/owners`, `/about`, plus `/app` and `/app/place/lantern-house` at 393 wide.

---

## 1. What makes the site feel unreal today

In order of damage.

### 1.1 The owner screenshots break the "no cost or terms" rule, on the live site
- Home, "For owners" (right column): the phone is `public/preview/owner.webp`. It shows a **"YOU PAY $0, no fees, no commission"** tile, and under it **"How a month could look: 38 tables from members, 27 first-time visitors, 11 came back again"**. The "Sample month, illustrative numbers" label is about 7px tall on the page. A reader sees made-up numbers on a product that has not launched.
- `/owners`, "You set every part of it" (left column): `public/preview/offer.webp` is a tall crop that ends in a **"WHAT IT COSTS: Free for founding partners for the first 12 months. No commission. No setup. Leave any time with 30 days' notice."** card. All of these lines were withdrawn on Oct 18.
- The current app no longer has the cost card (checked `src/mock/screens/owner/Dashboard.tsx`), but it still has "How a month could look". The images are simply old.
- **Fix first, even before the rest of this plan:** stop using `owner.webp` and `offer.webp` (section 4 says what goes there instead).

### 1.2 The app is shown as old, cropped, frameless screenshots
- Home, "What it looks like in the app." (ink band): three phones in a heavy black ring with no status bar, so each screen starts mid-header. The place screen is cut off at "Tue to Thu ... 2 of 2 left this year". The third phone ("Show this to your server") is half empty below "Waiting for staff to confirm." The screens read as web pages cropped to a phone shape, not as an app.
- They come from an older build. The member tab bar still shows an "Owner" tab. The code screen is a 6-digit number only. The current app has a landing screen ("The best deals in Toronto."), accounts, a pass with a **QR code and barcode**, and a **staff scanner** that turns green with "Confirmed". The most convincing parts of the product are not on the site at all.
- Images are 600x1298 (2x for a 300px phone). At 1440 on a retina laptop they are visibly soft, and small text inside them smears.
- `/owners`, "How a visit works.": three more old screens. Step 3 shows the member's "Redeemed. Enjoy your meal." screen under the heading "You confirm it". The staff side, the bit an owner cares about, is not shown.

### 1.3 The hero card is a drawing of the app, with a button that does nothing
- The "Lantern House" PassCard (hero, right) imitates the app's place card, including a black **Redeem** button that is not a link. On a phone it sits under the countdown and takes a full screen of scrolling. A drawn imitation next to "join the waitlist" reads as a template, and a dead button reads as broken.

### 1.4 One stock photo does every job
- The same salmon plate is the hero card photo, the first offer row photo, the share image, the app landing screen, the Lantern House place page and the "Redeemed" screen. Seeing one photo five times on one scroll is the clearest sign of a mock-up.

### 1.5 The content is about the idea, never about the specifics
- Nothing says **who** is behind it. The footer is "The 6 Pass, Toronto, ON" and an email. No names, no note, no mailing address (`site.mailingAddress` is empty).
- Nothing on the home page says **where**. The six launch neighbourhoods only appear inside the form's dropdown, and the eyebrow just says "Toronto first". Meanwhile the app landing says "across the city and the GTA" and the `/owners` SEO description says "across Toronto and the GTA", which contradicts "Toronto first".
- Nothing says **what stage we're at**. A real pre-launch page says "we're choosing partners now, names before launch". Ours shows places like "Lantern House" with a Founding Partner badge and only a small caption saying they are examples.
- **How it works** is three abstract cards ("Get your pass. One pass, good for a year."). The app section repeats the same three steps with pictures. Two sections say one thing, and neither shows the staff side.
- **FAQ** is six one-line answers. It skips the questions a careful 28-year-old on Bay Street actually has: who runs this, is it a subscription, which places, can I bring anyone, what happens to my email, what does "founding member pricing" mean.

### 1.6 Thin pages and loose ends
- `/owners`: "Why only 50." and "Tell us about your place." each fill the left half of a 1440 screen and leave the right half empty, so the page looks unfinished. The header has only "Back to home", so the page feels like a separate microsite.
- `/about`: the closing ink band's **"Join the waitlist" button has no visible fill** (white text floating on ink, see `about-1440`). It looks like a broken link.
- A **"Powered by Netlify"** pill floats bottom-right on every page, including over the app. It is not in our code, so it is injected by Netlify. Real consumer brands never show their host.
- The favicon is the old ringed 6 (white 6 on near-black with a red dot), not the settled wordmark.
- The demo screens include demo text that must never reach the site: "Demo: in another window, tap I'm a business...", `staff@partner.example`, "Demo Partner Group".
- "21 nearby" on the Explore screen is a count. It's harmless in the demo, but on the marketing site it reads as a stat.

### What the reference brands do that we don't (research, Oct 18)
Pages fetched: theentertainerme.com, bilt.com, beliapp.com, dojo.app, ritual.co, uber.com/ca/en/u/uber-one, feverup.com/en/toronto. ClassPass, Resy and Too Good To Go blocked automated fetching (403/429), so they are left out rather than described from memory.

- **The ENTERTAINER** (the model): the hero is three *specific* offer cards (an activity, a dining slot, "60-minute massage"), each with a category. Then "How does it work?" in three numbered steps, a "For businesses" link in the header, a "Questions, answered" FAQ, and a footer with Company, Corporate, Help and Legal columns and three ways to reach a human, each with its hours. Its logo wall and savings stats are what we **cannot** copy (rule), but the shape of specific offer, step, business link, FAQ and full footer is what we can copy.
- **Bilt**: the strongest trick is a *worked example*. A specific building, a specific rent, and the points it earns, drawn as a card. Specific beats general. Our version is one visit, start to finish, with one example place on screens that match each other.
- **Beli**: every feature (Track, Share, Discover) gets one real app screenshot and one short label. It has a "Meet the Team" page, jobs, contact, app privacy and terms in the footer. Very little copy, all of it real.
- **Dojo**: "I'm a business" sits in the header, and the footer names the legal operator. **Ritual** puts "For Restaurants" first in its nav and has a separate "value to companies" block (our quiet "For teams" line is the right size for now).
- **Fever Toronto**: every card names a venue or neighbourhood (Kensington Market, 55 Mill St) and a date. Place names and dates are what make a city product feel local.
- **Uber One**: benefits are concrete one-liners, each with an icon, and the conditions are linked plainly at the bottom. Nothing is hidden behind clever copy.
- **Waitlist guides** (getlaunchlist.com, moosend.com): one action above the fold; social proof only if it's real ("don't invent numbers"); product visuals act as *proof the thing is being built*; a large phone frame showing the real app is the standard pre-launch pattern.
- **What made big brands look fake in the same pass**: Bilt repeats one testimonial word for word and its "Airline transfer partners (17)" list has 12 items. The ENTERTAINER repeats testimonials too. Repeated content, counts that don't add up and stale details are what people notice. Our versions of that are the repeated salmon photo, old screens and withdrawn lines.

---

## 2. How the app should be shown: one approach

**Approach: an App Store-style row of five tall, crisp screenshots that tells one visit from start to finish, plus the app's own landing screen in the hero.** (The approach borrows the look of an app listing, but the words "App Store" must not appear anywhere: CI fails on them.) There are no tilted phones, no hands, no fake photo composites and no auto-cycling. The screens carry the realism, so they have to be exact.

Why this one: it's the format people already trust for "this app exists". It works with reduced motion and at phone width (a swipe row). It lets the staff scanner be part of the story, and it replaces both "How it works" and "What it looks like in the app" with one section that proves the steps.

### 2.1 One story, one place, consistent across all screens
Member **Alex** (first name only, a demo account) visits **Fennel & Ash** (fictional, Ossington, "Second pasta, on us.") on a Tuesday. Fennel & Ash is used, not Lantern House, because the hero landing screen already shows the salmon photo, and `staff@partner.example` is staff at Fennel & Ash, so the scanner shot shows the same place and offer as the pass. Every screen in the row must name the same place, the same offer and the same code.

### 2.2 The six screens

| # | Where | Screen | Route and state | Caption (bold) | Sub-caption |
|---|---|---|---|---|---|
| Hero | Hero, right | Landing, "The best deals in Toronto." | `/app` signed out | none | none (see 3.1) |
| 1 | Row | Explore | `/app` signed in as alex@example.com, Explore tab, scrolled to top | See what runs today. | Places near you with an offer on today. |
| 2 | Row | Place page | `/app/place/fennel-ash` (check slug in `src/demo/places.ts`), top of page, offer card and day strip fully in view | Check the offer and the days. | Each place picks its own days and how often you can use it. |
| 3 | Row | Pass with QR | `/app/redeem/fennel-ash`, sheet open, QR, barcode and 6-digit code visible, timer near 9:5x | Show your pass at the host stand. | A new code for each visit. It lasts 10 minutes. |
| 4 | Row | Staff scanner, Confirmed | `/app/business/scan` signed in as staff@partner.example, place Fennel & Ash, after scanning or typing Alex's code: green "Confirmed" card, "Today: 1 visit, Alex" | Staff scan it. | Or type the six digits. No extra device at the host stand. |
| 5 | Row | Member Redeemed | Member window after confirm: "Confirmed by staff. Redeemed. Enjoy your meal." | The second one is on the house. | The app shows how many uses you have left this year. |

Notes:
- "No extra device at the host stand" is true: staff use the 6 Pass app on a phone they already have, or type the code. If Ammar prefers, use the app's own fixed line: "Check the code matches, then tap Confirm."
- The numbers 1 to 5 sit beside each caption in Cormorant italic, copper (same style as the current step numbers).
- Above the row: eyebrow "The app", title **"How a visit works."**, intro **"Get your pass once. Then every visit goes like this."**
- Under the row, small, pale: **"Screens from the app as it is today. The places are examples, not partners yet."** and the existing link "Try it in your browser" (to `/app`).

Alt text, in order:
1. "The app's Explore screen for Tuesday, listing places in Toronto with an offer on today."
2. "Fennel & Ash in the app: second pasta on us, runs Tuesday to Thursday, 2 uses left this year, and a Redeem button."
3. "A member pass for Fennel & Ash with a QR code, a barcode and a six-digit code valid for 10 minutes."
4. "The staff scanner at Fennel & Ash showing a green Confirmed card for Alex: second pasta, on us."
5. "The member's screen after staff confirm: Redeemed, enjoy your meal, 1 of 2 uses left this year."
Hero: "The 6 Pass app's opening screen: The best deals in Toronto. Create account, Sign in, Look around first."

### 2.3 Re-shoot all six fresh, at 3x
Do not reuse anything in `public/preview/` or `docs/app/screens/` (those are 2x, 390 wide, and some are older than the current copy: `01-landing.png` still says "Two-for-one at hand-picked places across Toronto and the GTA.").

New script `scripts/site-shots.mjs` (based on the flows in `scripts/accounts-walk.mjs`):
- Capture from a **local** build (`npm run build`, serve `out/`), never from the live site, so the Netlify pill can't get in.
- Viewport **393x852**, `deviceScaleFactor: 3`, `hasTouch`, `isMobile`. Output 1179x2556 PNG masters in `docs/site/screens/`.
- Emulate the iPhone safe area: inject `.app-mock{--top:54px}` (the app already pads with `--top: env(safe-area-inset-top)` in `src/mock/app.css`).
- Inject a status bar overlay before each shot: 54px tall, "9:41" at left in the system font (17px, semibold), and signal, wifi and full battery as inline SVG at right. Use white over a photo top (landing, place, redeemed) and ink `#16140F` over paper (Explore, pass sheet, scanner). The Dynamic Island is drawn by the site's frame, not baked in.
- Before shooting, hide demo-only text with injected CSS or a `?shots=1` flag: any "Demo:" line, demo account notes, the staff account card (`staff@partner.example`, "Demo Partner Group", Switch place, Sign out), and the "N nearby" count on Explore.
- Pin the clock so the pass timer reads 9:5x and "Today" reads Tuesday (the app already pins Tuesday).
- For screen 4, use the two-context flow from `accounts-walk.mjs`: member context makes the code, staff context types it. Then shoot screen 5 from the member context.
- Export with `sharp` (or `cwebp`) to `public/preview/v2/<name>-{600,900,1179}.webp`, quality 82, and use `srcset`/`sizes`. Names: `landing`, `explore`, `place`, `pass`, `scan-confirmed`, `redeemed`, plus `owner-offer` (section 4).
- Look at every PNG before committing: no "Demo", no example.com emails, no cost lines, no counts, no cut-off text.

### 2.4 Device frame (replace `PhoneShot`)
New `src/components/Phone.tsx`, CSS only, no images:
- Screen aspect 393:852, screen corner radius **14% of width** (about 55px at 393).
- Bezel: 3.2% of width (about 10px at 300), colour `#1d1c19`, with a 1px outer ring `#6b665e` (titanium edge) and a 1px inner ring `rgba(255,255,255,.06)`. On the ink band the outer ring keeps the edge visible.
- Dynamic Island: a black pill, 32% of screen width by 9.4% of width tall, 11px from the top, centred.
- Shadow on paper: `0 30px 60px -28px rgba(22,20,15,.45)`. On ink: none, just the ring.
- No side buttons, no reflections, no tilt.
- Props: `src`, `alt`, `priority` (hero only: `loading="eager"`, `fetchpriority="high"`; all others lazy).

### 2.5 Sizes and layout
- **Hero phone**: 300px wide at md and up, 260px on phones. On phones it moves to after the countdown, centred, so the form stays above the fold. The PassCard is removed from the home page (the component can stay for other uses).
- **Row, 1200px and wider**: 5 equal columns in a container that breaks out of `wrap` to `max-width: 1360px`, gap 28px. At 1440 each phone is about 245px. Caption block above each phone: number, bold caption (17px, `text-mist`), sub-caption (15px, `text-pale`, max 26ch).
- **Row, below 1200px**: horizontal swipe row with scroll-snap. Phones are 72% of the viewport on phones (max 300px) so the next one peeks. Captions stay above the phones. No arrows, no auto-scroll, `overscroll-behavior-x: contain`. Add `aria-label="How a visit works, five screens"` to the list.
- Background: the existing ink band. Captions go **above** the phones, like an app listing, so a phone user reads the step before they see the screen.

---

## 3. Home page, section by section (exact copy)

Same palette and type as now (paper, ink, copper, Cormorant headings, system body), and the same blocks as the Oct 16 structure. Two blocks merge (How it works and the app preview), the app moves up because it's the strongest proof, and two small honest sections are added. **[Ask Ammar]** for the new order and the two new sections (4 and 6). The neighbourhoods section was cut on Oct 4, so the version below is deliberately small: no photos, no taglines.

New content keys in `src/content/site.ts` (single content file): `appStrip`, `launchAreas`, `founders`, `closing`, the expanded `faq`, and `hero.areasLine`. Remove `howItWorks` and `appPreview` once nothing uses them (keep `howItWorks.intro` text if reused).

Header nav (`nav`): **How it works** (#how), **Offers** (#offers), **Where** (#where), **For owners** (#owners), **FAQ** (#faq), then the **Join the waitlist** button. On `/owners` and `/about` show the same nav, with links pointing to `/#how` and so on, instead of only "Back to home".

### 3.1 Hero (unchanged words except one added line)
- Pill: `Mar 16, 2027` | `Toronto first` (keep).
- H1: "Toronto, *two* for one." (keep).
- Lede: "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across the city. Bring someone, and come back." (keep, Nida's).
- Form, consent, "No spam. One email when we open, with founding member pricing." (keep).
- **New line under the form note (`hero.areasLine`):** "Opening first in the Financial District, King West, Queen West, Ossington, Yorkville and Leslieville."
- Link: "See what the app looks like" → `#how` (keep words).
- Right: the hero phone with the landing screen. A small caption under it, muted, 14px: **"The app opens to members on March 16, 2027."**
- Countdown bar: unchanged.

### 3.2 How a visit works (id `how`; replaces "How it works" and "What it looks like in the app")
Ink band. Copy as in section 2.2. Eyebrow "The app". Title "How a visit works." Intro "Get your pass once. Then every visit goes like this." Five captioned phones. Footnote "Screens from the app as it is today. The places are examples, not partners yet." Link "Try it in your browser".

### 3.3 Offers (id `offers`): Nida's words, plus one example detail per row
- Title "What a pass gets you." Intro "Two-for-one, or a free upgrade, at places worth going back to." (keep)
- Rows (category, offer kept; new small muted line under each offer, 15px):
  - Restaurants, "Second main, on us." Detail: **"For example: Tuesday to Thursday and Sunday, 2 visits a year."**
  - Spas, "A free upgrade on your treatment." Detail: **"For example: a 60-minute massage booked as 90 minutes, Monday to Thursday."**
  - Yoga and studios, "Bring a friend to class, free." Detail: **"For example: any class on weekdays, 4 visits a year."**
- Caption "Example offers. Each partner sets its own." (keep)
- Photos: **replace the salmon in row 1** with `/demo/marigold-room` (or another restaurant photo not used in the hero or the row). Spa and studio photos stay. Check `docs/IMAGE-CREDITS.md` for the photo you pick.

### 3.4 Where we open first (id `where`, new, small) **[Ask Ammar]**
Paper background, no photos. Left: title **"Where we open first."** and text **"Six neighbourhoods at launch, with partners chosen one neighbourhood at a time. More follow after March 16."**
Right: the six names as a two-column list (three columns at md), Cormorant 28px, hairlines between rows, from `neighbourhoodOptions.slice(0, 6)`: Financial District, King West, Queen West, Ossington, Yorkville, Leslieville. No per-area status, no counts, no taglines.
Under the list, muted: **"Somewhere else? Join the waitlist and tell us where. It helps us choose what comes next."** ("Join the waitlist" opens the popup.)

### 3.5 For owners (id `owners`): Nida's words kept, phone replaced
- Eyebrow, title, text, four points, button "How it works for owners", "Tell us about your place: hello@the6pass.ca" all stay.
- Phone: replace `owner.webp` with a fresh 3x shot `owner-offer` of the current owner dashboard's offer controls (`/app/owner` signed in as owner@partner.example, place Lantern House, scrolled so the "You control the offer" list with Offer, Days, Uses per member, Blackout dates and the Pause switch fills the screen). "How a month could look" and any numbers must be out of frame. Alt: "The owner view in the app: the offer, the days, uses per member, blackout dates and a Pause switch." Caption under the phone, muted: **"The owner view. Change the offer or pause it any time."**

### 3.6 From the founders (new) **[Ask Ammar]**
Mist band (`bg-mist`), reading width (about 60ch), left-aligned, no photo unless Ammar supplies a real one of the two of them.
- Eyebrow: **"Who's behind it"**
- Title: **"A note from Nida and Ammar."**
- Body:
  > We're Nida and Ammar, a Toronto family business.
  >
  > We started The 6 Pass because the best nights out are the ones you share, and a good offer is a nice reason to try somewhere new and then go back.
  >
  > Right now we're meeting owners and choosing the first places, one neighbourhood at a time. We'll share the names before we open.
  >
  > If you have a question, or a place we should know about, write to us at hello@the6pass.ca. It comes straight to us.
- Sign-off: **"Nida and Ammar"** in Cormorant italic, then "The 6 Pass, Toronto".
- Before merging, confirm with Ammar: "family business" wording, whether to say "mother and son" (it's true but personal), and that "We'll share the names before we open" is a promise they want to make. Add nothing else about them.

### 3.7 Questions (id `faq`): expanded, still short answers
Keep the existing six (with small edits) and add the ones people actually ask. `faqLd` is built from this list automatically.

1. **When does it open?** Tuesday, March 16, 2027, at 9 a.m., in Toronto first.
2. **Where can I use it?** At launch, in six neighbourhoods: the Financial District, King West, Queen West, Ossington, Yorkville and Leslieville. More follow, one at a time.
3. **Which places are on it?** We're choosing the first 50 partners now and will share the names before we open. The places in the app screens on this page are examples.
4. **How do I use it?** Find a place in the app and tap Redeem at the table or front desk. Staff scan your pass or type the code, and the second one is on the house.
5. **Who can I bring?** Anyone you like. You need to be there with your pass. *(Confirm with Ammar that the member must be present. If not settled, drop this one.)*
6. **How often can I use an offer?** Each partner sets how many times a member can use it in a year, and which days it runs. The app shows you both before you go.
7. **What do offers cover?** Food, services and non-alcoholic drinks. Offers are for when you go in person, not takeout or delivery.
8. **How much is a pass?** We'll share pricing before launch. People on the waitlist get founding member pricing.
9. **What does joining the waitlist do?** You get one email when we open, with founding member pricing. Joining is free and you don't pay anything now. You can unsubscribe any time.
10. **Who runs The 6 Pass?** Nida and Ammar, a Toronto family business. You can reach us at hello@the6pass.ca.
11. **I own a restaurant, spa or studio.** We'd like to hear from you. See [how it works for owners](/owners), or email hello@the6pass.ca.

Do not add an answer about renewals, refunds, HST or tiers until Ammar decides them.

### 3.8 Closing join (new, small)
Ink band, the same component as the `/about` CTA (with the button fixed, see 4.2), but with the inline form instead of a button:
- Title: **"Hear first when we open."**
- Text: **"One email on March 16, with founding member pricing."**
- `WaitlistForm placement="footer"` (needs a distinct `source`/placement value, so the form keeps working with the same Supabase insert and the CASL label unchanged).

### 3.9 Footer
- Left: wordmark, "The 6 Pass", the mailing address once it exists (`site.mailingAddress`), "Toronto, ON", hello@the6pass.ca, "For teams: hello@the6pass.ca" (keep, quiet).
- Add one muted line: **"Opening March 16, 2027, in Toronto first."**
- Right, two short columns: **The 6 Pass**: How it works, Where, FAQ, What is The 6 Pass?. **More**: For owners, Instagram @the6pass, Privacy, Terms.
- Bottom: "© 2026 The 6 Pass".

---

## 4. Small changes to /owners and /about

### 4.1 /owners
1. **Now:** replace `offer.webp` ("You set every part of it") with the new `owner-offer` shot. Its caption stays: "Your offer, in the owner view. Change it any time."
2. "How a visit works." (ink band): use the new screens and show the staff side:
   - 1 "The member taps Redeem" → **place** shot (Fennel & Ash).
   - 2 "They show you a code" → **pass with QR** shot. Text: **"A QR code and a six-digit code. It lasts ten minutes."**
   - 3 "You confirm it" → **scanner Confirmed** shot. Text: **"Scan it with the app on any phone, or type the six digits. Take the second one off the bill as you normally would."**
   - Use the same `Phone` frame. Label: "Screens from the app. The place is made up."
3. Fill the empty right half of **"Why only 50."** with a "What happens next" list (copy in `owners.ts`):
   - Title: **"What happens next"**
   - 1 **"You email us."** "Tell us your place and the best time to reach you."
   - 2 **"We come by."** "Fifteen minutes, at a time that suits you. We show you the app on a phone."
   - 3 **"You choose your offer."** "The offer, the days, the limits and any blackout dates. You can change them later."
   - 4 **"You're in the launch."** "Founding Partners get the badge in the app and a place in the launch on Tuesday, March 16, 2027."
   - No cost, fees, terms, notice periods or "free" anywhere. If a question comes up: "Happy to walk you through it on a call."
4. Put "Tell us about your place." beside "Why only 50." on one row at md and up (two columns), not as a second half-empty section.
5. Header: the full nav from 3.0 instead of only "Back to home".
6. SEO description: change "across Toronto and the GTA" to **"across Toronto, starting in six neighbourhoods"** so it matches the home page.

### 4.2 /about
1. **Fix the closing button.** "Join the waitlist" in the ink CTA has no visible fill. Give it `bg-mist text-ink` (or the paper pill), and check 4.5:1 contrast and the focus ring on ink.
2. Add one fact row: **"Who runs it": "Nida and Ammar, a Toronto family business"** **[Ask Ammar]**, and mirror it in `public/llms.txt`.
3. Add one sentence to "How it works": **"Staff scan the code in your pass, or type the six digits, and confirm."** so it matches the new screens.
4. Add a section **"When we'll name the partners": "We're choosing the first 50 partners now. We'll share the names before we open on Tuesday, March 16, 2027."** (only if Ammar agrees to the promise in 3.6).
5. Header nav as on the home page.
6. Update `public/llms.txt` with any wording that changes here (CLAUDE.md rule).

### 4.3 The app landing line
The app landing says "Two-for-one at restaurants, spas and studios across the city and the GTA." The site says Toronto first. Not a site change, but flag it to Ammar: either the app says "across Toronto" until the GTA is real, or the site explains the GTA plan. The hero phone shows this line, so the two must agree before launch.

---

## 5. Polish checklist

Content and rules
- [ ] `owner.webp` and `offer.webp` no longer used anywhere (grep `preview/owner`, `preview/offer`). Delete them so they can't come back.
- [ ] Add `12 months`, `No commission`, `You pay` and `30 days' notice` to the CI forbidden list for the built site (text only, not images, so also check every new screenshot by eye).
- [ ] No screenshot contains "Demo", `example.com`, `partner.example`, "Demo Partner Group", "nearby" counts, "How a month could look", or any $ figure other than menu prices inside a place page.
- [ ] The salmon photo appears at most twice on the home page (hero phone and the Explore card inside screenshot 1).
- [ ] Every example place shown is from `src/demo/places.ts` (fictional, already checked).
- [ ] No "App Store" or "Google Play" text, badges or alt text (CI).
- [ ] No em dashes in new copy; none of the removed slogans.

Visual
- [ ] All app screens re-shot at 3x through `scripts/site-shots.mjs`, with status bar "9:41" and safe-area padding; `srcset` 600/900/1179.
- [ ] One `Phone` frame component used on home, /owners and anywhere else; `PhoneShot` removed.
- [ ] No half-empty two-column sections at 1440 on /owners or /about.
- [ ] Hero at 390: form and consent above the fold; phone after the countdown.
- [ ] Swipe row: next phone peeks at 390; no horizontal page scroll (check `document.documentElement.scrollWidth === 390`).

Trust and polish
- [ ] Turn off the "Powered by Netlify" pill. It is not in the repo. In Netlify: Site configuration, then look for the badge or "Netlify Drawer"/"Deploy previews" toolbar setting, and turn it off for production. If it comes with the plan, tell Ammar what it would take to remove it.
- [ ] Favicon and apple-touch icon: match the settled wordmark's red italic 6 (e.g. "6" in Cormorant italic `#E0382A` on paper `#FAF8F5`), and update `src/app/icon.svg`, `apple-icon.tsx`.
- [ ] Share image: the home one is fine. Add page-specific ones for `/owners` ("More guests on your quiet days.") and `/about` ("What is The 6 Pass?") in the same layout, without the salmon.
- [ ] `site.mailingAddress` filled once there is a real address (CASL needs it on emails).
- [ ] Instagram @the6pass: check it exists, is public and has a few real posts (the neighbourhoods, the app). If not, hide the link until it does; an empty profile hurts more than no link.
- [ ] Send a real test email to hello@the6pass.ca and check it arrives and replies come from that address.
- [ ] `/privacy` and `/terms`: show a "Last updated" date and name the business and email; check they mention the waitlist fields and Supabase in Canada (Central).
- [ ] Custom 404 uses the site header, footer and a join link.
- [ ] Waitlist success state: one line telling people what happens next ("We'll email you once, on March 16, with founding member pricing.") **[Ask Ammar, Nida's success copy]**.
- [ ] Lighthouse mobile 90+ on `/`, `/owners`, `/about` after the new images (hero phone eager, everything else lazy, webp, explicit width/height).
- [ ] Accessibility: every phone has meaningful alt text; swipe row reachable by keyboard (each `li` focusable or the list scrollable with arrows); captions are real text, not in the image; reduced motion means nothing moves.
- [ ] Update `CLAUDE.md` Status and `docs/LAUNCH.md` with what changed.

Sources: [The ENTERTAINER](https://www.theentertainerme.com/), [Bilt](https://www.bilt.com/), [Beli](https://beliapp.com/), [Dojo](https://dojo.app/), [Ritual](https://ritual.co/), [Uber One](https://www.uber.com/ca/en/u/uber-one/), [Fever Toronto](https://feverup.com/en/toronto), [LaunchList: waitlist page examples](https://getlaunchlist.com/blog/waitlist-landing-page-examples-that-convert), [Moosend: waitlist landing pages](https://moosend.com/?p=67875), [App screenshot sizes 2026](https://screenhance.com/blog/app-store-screenshot-dimensions-2026).
