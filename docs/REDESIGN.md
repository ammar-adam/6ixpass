# Redesign the app demo (and carry the result to the site)

For Claude Code. Branch: `cowork/seo-geo` (pull request #1). Read `CLAUDE.md` first.

## The problem

Ammar has rejected the look of `/demo` twice:
1. **Mist green and peach with drawn illustrations.** His words: not professional at all.
2. **White and near-black with a brass accent and monogram tiles.** His words: still sucks.

Both were built without a single photograph and without looking at a real app. They read as a wireframe with a colour scheme. Do not try a third palette on the same layout. The layout, the imagery and the level of finish are the problem.

The flow and the logic are fine and tested. Keep them. This is a visual and interaction redesign.

## What to keep

- Everything in `src/demo/data.ts` (places, copy, rules) and the state logic in `src/demo/Demo.tsx`: browse and filter, place page, Redeem with a six-digit code and ten-minute countdown, partner view with Confirm, "Your offer" settings that update the member view, My pass.
- All hard rules in `CLAUDE.md`: made-up places only, no alcohol in any image or copy, no pass prices, no invented stats, no em dashes.
- `/demo` stays `noindex`.

## Step 1: look before you design

Open these in a browser and take screenshots of their mobile apps or mobile sites. Study the browse screen, a venue page, and the redeem or booking confirmation:
- Resy and OpenTable (venue cards, photography, booking confirmation)
- The Entertainer (offer cards, redeem flow)
- ClassPass (studio pages, credits)
- American Express app (the card, offers list)
- Apple Wallet passes (the pass itself)

Write down, in `docs/design-notes.md`, ten specific things they do that our demo does not. Examples of the kind of thing to look for: full-bleed photography with text over a gradient, real icons in the tab bar, a search field, distance and open-now metadata, sticky action bars, sheet-style transitions, a pass that looks like a physical card. Be specific. "More polished" is not an observation.

Copy the level of finish. Do not copy their branding, layouts pixel for pixel, or names.

## Step 2: three directions, then stop

Design three clearly different directions. For each, build the same three screens as real, working components (not drawings): **browse**, **place page**, **redeem code**. Each direction needs:
- a name and one sentence on who it is for
- palette, type pairing and icon set
- real photographs

Then take phone-size screenshots of all nine screens, put them side by side in one image, and **stop and show Ammar**. Do not build the rest until he picks one. If he rejects all three, ask him for two apps he likes the look of and start Step 2 again from those.

Requirements for every direction:
- **Photography.** Download real photos (Unsplash or Pexels, licences allow commercial use), self-host them in `public/demo/`, compress to WebP or AVIF, and credit each in `docs/IMAGE-CREDITS.md`. Food, interiors, spa rooms, studios, a pottery wheel. No alcohol in frame, no identifiable people, no recognisable real business or signage. One photo per place, twelve places.
- **Icons.** A proper icon set (Lucide or Phosphor), used consistently. No emoji, no text arrows.
- **A real tab bar** with icons and labels.
- **Motion.** Screen transitions and a satisfying confirm moment on redeem. Respect reduced motion.
- **The pass** should look like something you would want in your wallet.
- **Contrast** 4.5:1 for text, visible focus, 44px touch targets.
- Avoid the looks listed in `CLAUDE.md` under "Avoid stock AI looks". Also off the table now: mist and peach pastels, flat black and white with a gold accent, monogram tiles.

## Step 3: build the chosen direction

- Reskin every screen in `/demo`, including the partner view and "Your offer".
- Keep `src/demo/data.ts` as the single source for places and copy. Add an `image` field per place.
- Run the walkthrough in a headless browser at 390x844 and confirm it still works end to end: open a place, redeem, see the same code in the partner view, confirm, change the offer and the days, return to the member view, check savings and uses left, open a place that does not run on Tuesday.
- Screenshot every screen and show Ammar.
- `npm run lint` and `npm run build` pass. Lighthouse mobile performance stays at 90 or above with the photos in.

## Step 4: bring the marketing site in line

The home page has the same weaknesses: no photographs and nothing that shows the product. Once the app direction is chosen:
- Use the same photography on the home page (hero, offers, neighbourhoods).
- Add a section showing three real screens from the demo in a phone frame, labelled "Preview. The app opens to members in 2027."
- If the chosen app direction clashes with the site's current palette, propose one palette for both and show Ammar before changing the site.

## Rules for working

- Show screenshots at every stop. Ammar judges by looking, not by reading.
- No questions about things you can decide. The only stops are the two in Step 2 and Step 4.
- Commit as you go, on this branch. Do not merge and do not deploy to the production domain.
