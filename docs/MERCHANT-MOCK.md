# The 6 Pass: merchant demo (for Claude Code)

Read `CLAUDE.md` first. Every rule in it still holds.

## Why

Nida made a small phone demo for owner conversations and she likes it a lot. It is saved at `docs/reference/nida-merchant-demo.html`. Open it in a browser and click through it before you write anything. It is the reference for tone, flow and look.

What makes hers work, and what the current `/app` mock lacks:
- **It becomes the owner's own restaurant.** A "Set up for a restaurant" sheet takes their name, neighbourhood, offer, days, uses per member, a photo from the phone and a brand colour. Every screen then shows their place, not a made-up one.
- **Member view and Owner view, one switch at the top.** The owner sees what a guest sees, then what they would see.
- **An owner dashboard** with four plain numbers (tables from members, first-time visitors, came back a second time, $0 fees or commission), labelled "Sample month · illustrative numbers", the offer controls, and a Pause switch.
- Staff confirm line: "Check the code matches, then tap Confirm. No scanner, no app, no login at the host stand."
- Her look: near-black #0B0B0D, panels #131316 / #1A1A1E, cream text #F2EFEA, gold #E6A92E, jade #2FBF85, Cormorant Garamond + Outfit, the "the 6 pass" logo with the red italic 6.

## Build this: a separate merchant demo at `/partners-demo`

Separate from the marketing site and separate from `/app`. Its own route, its own layout, its own fonts. `noindex`, disallowed in robots.txt, not in the sitemap. Do not change `/app` or the home page.

Use Nida's look (palette, type, logo above), not direction B and not the site palette. Phone frame on desktop, full screen on a phone, same as `/app`.

### 1. Onboarding (new, this is the main thing to add)

A short guided flow an owner can do in about a minute, one question per screen, with Back and a progress line:
1. Your place: name, category (restaurant, café, spa, studio, hotel restaurant or spa, experience), neighbourhood.
2. Your offer: two-for-one or a free upgrade or add-on, with a plain text field prefilled by category (for example "Second main, on us").
3. Your days: tap Mon to Sun. At least three must be picked, and say so plainly if fewer are.
4. Your limits: uses per member per year (stepper, default 2, max 12) and optional blackout dates.
5. Your look: photo from the device (resize in the browser like hers does, keep it local) and one of five colours.
6. Review: a preview of exactly how members will see the place, then "Looks right".
7. Done: "You're set up as a Founding Partner (demo)." Two buttons: "See what members see" and "See your dashboard".

Keep her quick "Set up for a restaurant" sheet too (the gear button), for Nida to prefill before a meeting.

### 2. Member view (keep hers)
Home with the owner's place featured as a Founding Partner, place page with the offer and rules, redeem with a code and the "For staff" confirm panel, then the "Redeemed" screen with "See the owner view".

### 3. Owner dashboard (keep hers, add a little)
- Her four numbers and the "Sample month · illustrative numbers" label. Never present these as real results.
- A redemption done in the member view shows up at the top of a "Recent visits" list straight away, marked "Just now".
- "You control the offer": offer, days, uses, blackout dates, each editable in place, and the Pause switch. When paused, the member view shows "Paused by the venue" and Redeem is disabled.
- A "What it costs" line: "Free for founding partners for the first 12 months. No commission. No setup." Nothing about year 2.
- A last screen, "Next step": "Email hello@the6pass.ca to become a Founding Partner", as a mailto link. No form, no database.

### Rules
- Everything stays in the browser (`localStorage`, try/catch). No Supabase, no server. A "Reset demo" control.
- The owner types their own business name, so do not ship any real business names as defaults. Default is "[Restaurant name]" like hers.
- No pass prices. No alcohol: keep "Food and non-alcoholic" in the rules.
- No em dashes. Plain, warm, short sentences. Use her wording where it exists.
- Accessible: real labels, visible focus, 44px targets, reduced motion.

### Done means
- Build and CI pass, and it works in the static export on Netlify.
- You clicked the whole thing at 1280 and 390 wide: onboarding start to finish, redeem, the visit appearing on the dashboard, pause, edit the offer, refresh in the middle, reset. Screenshots in `docs/merchant-mock/`.
- Add a short section to `CLAUDE.md`, and a "Demo for owners" link to `/partners-demo` on the `/owners` page only.
- Tell Ammar in three lines: the link, what you could not verify, and anything you decided on your own.

## It has to work in a restaurant, on Nida's phone

This is the thing Nida opens across the table from an owner. Treat that as the test.

- **Phone first.** Design for a phone held in one hand and passed to the owner. Big targets, nothing that needs a keyboard except the place name and offer.
- **Add to Home Screen** on iPhone and Android: manifest, icons, standalone display, so it opens like an app with no browser bar.
- **Works with bad or no signal.** After the first visit it must load and run fully offline (service worker caches the page, fonts and scripts). Restaurants have poor reception.
- **Meeting mode.** Nida prefills a place before she walks in (gear sheet), and "Start demo" opens straight on the member view of that place. "New meeting" clears it for the next restaurant, with a confirm step so it can't be hit by accident.
- **Two-minute path.** From opening it to the owner seeing a visit land on their dashboard must take under two minutes without Nida explaining the screen. Put one short line of guidance at the top of each screen ("Now tap Redeem, as your guest would").
- **Hand-off.** On the last screen, a QR code and short link to `/owners` so the owner can read the terms later on their own phone, plus the mailto.
- **Nothing embarrassing.** No placeholder text left visible once a place is set up, no lorem, no "[their photo]" if no photo was chosen (use the colour and initial instead), no made-up numbers presented as real.
- Write `docs/MEETING-GUIDE.md` for Nida: exact taps to add it to her home screen, set up a place, run the demo, and reset. One page, no jargon.
