# Design notes: what real apps do that our demo doesn't

Step 1 of `docs/REDESIGN.md`.

**How this was written.** Phone-size (390px) screenshots taken Oct 3, 2026 of: Resy's mobile site (city browse, list rows, a venue page), The Entertainer's site (offer cards), and Apple's Wallet page (the card stack). OpenTable timed out, ClassPass returned a bot check, and the Amex offers page was a 404, so those three come from working knowledge of the apps. Compared against our current `/demo` on this branch at 390x844. The screenshots are other companies' work, so they are kept out of the repo.

What the screenshots confirmed:
- Resy venue page: the photo is full width and about 60% of the first screen, with carousel dots; then a heavy sans title, a metadata line with dot separators (cuisine, price band), a map-pin row for the neighbourhood, and outlined Share and Save buttons with icons.
- Resy list rows: a square photo thumbnail on the left, name, metadata, map pin and neighbourhood, a heart outline on the right.
- Resy keeps a sticky bar at the bottom (party size, date, time) on every screen.
- The Entertainer's offer cards: photo first, a solid pill badge on the photo ("Buy 1 Get 1 Free"), a tiny category label, the offer title, then a "Save about AED 240" pill. That last pill is our "You save about $X" idea, shown up front on the card.
- Apple Wallet: cards stacked with only their top strip showing, each card a saturated colour or image, bold white type, rounded corners.

## Ten things they do that we don't

1. **The photo is the card.** Resy and OpenTable venue cards are mostly photograph (about 4:3 or 16:10), with the name and one line of metadata under it or over a dark gradient at the bottom. Ours spends the top half of every card on a dark diagonal-hatch block with a giant initial, so every place looks the same.

2. **The venue page opens on a full-bleed hero photo** that runs under the status bar, with round translucent back and share buttons floating on it (white icon on a blurred dark circle). The title sits below or overlaps the photo's bottom edge. Ours has a hatched block with a white "← Back" pill and a text arrow.

3. **Metadata is a row of small icon + text pairs**: neighbourhood with a map pin, category, "Open now" or the hours with a clock, sometimes distance ("0.4 km"). Ours puts "Ossington · Dinner" in grey text and a green dot for "Runs today".

4. **A search field and a filter row with a summary.** Resy, OpenTable and ClassPass all start the browse screen with a search field, then horizontally scrolling filter chips with icons ("Dining", a sliders icon for "Filters"), and a count ("12 places"). Ours has two rows of plain text chips and no search.

5. **The primary action is in a sticky bar at the bottom of the venue page**, above the home indicator, with the key condition next to it (OpenTable: party size and time, then "Find a table"; The Entertainer: "Redeem" with uses left). Ours puts Redeem at the end of a scroll.

6. **Redeem is a sheet, not a page change.** The Entertainer and Apple Pay bring up a bottom sheet with a dimmed, still-visible screen behind it, a grabber handle, and one big element (the code, or the card). Dismissing is a swipe down. Ours swaps the content in place.

7. **A confirmation moment.** OpenTable and Resy confirm a booking with a full-screen success state: a large animated check, the venue photo, the details in a receipt-like block, and "Add to calendar". Apple Pay has a check that draws itself and a haptic. Our confirm is a static box.

8. **The pass looks like a physical card.** Apple Wallet passes and the Amex card: a card at credit-card ratio (about 1.586:1), rich background (photo, texture or deep colour with a sheen), the member name in small caps, a member number, rounded corners, a slight shadow, and a barcode or code area on the back or bottom. Ours is a flat dark rectangle.

9. **A real tab bar.** Four or five tabs, each with a 24px line icon and a short label, the active tab filled or tinted, sitting on a translucent blurred bar with a hairline top border, respecting the home indicator safe area. Ours has two text labels with an underline bar.

10. **Offer cards say the deal first and big, then the rules small.** The Entertainer leads with "Buy 1 Get 1 Free" as a badge on the photo, then the venue, then "Valid Tue to Thu" with a calendar icon. ClassPass shows the credit cost as a pill on the photo. Ours puts the offer as body text under the name, and the days only on the place page.

## Smaller things worth copying

- Skeleton shimmer while images load, so the layout doesn't jump.
- Saved or favourite heart on each card (a member wants to keep a short list).
- Section headers on browse: "Runs today", "New this month", "Near the office" (only the ones that are true for the demo data).
- Tap feedback: cards scale to about 98% on press.
- Large titles that shrink into the navigation bar on scroll.
- Numbers in tabular figures (the countdown and code don't jiggle as digits change).

## What not to copy

Their branding, their layouts pixel for pixel, their names, ratings, review counts, prices or "trending" claims. We have no ratings and no reviews, so no stars.

