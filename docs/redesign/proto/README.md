# Comparison apps

## Round 2: C refined (`c2.html`)
Ammar liked C but wanted more polish. `c2.html` is C with a polish pass, in two modes:
- Light: open `c2.html?theme=light` (or just `c2.html`).
- Dark: open `c2.html?theme=dark`.

The code now slides up as a sheet over the place, on a Wallet-style pass. System font throughout, the serif only for place names, hairline lists, translucent bars, a seven-day strip and uses as dots. Both side by side: `c2-light-vs-dark.png`.

To open with `?theme=dark` from Finder: double-click `c2.html`, then add `?theme=dark` to the end of the address in the browser and press Enter.

## Round 1

Clickable prototypes of the same flow in three looks. Each one starts on the member app with the owner's place at the top (here, the made-up "Lantern House"), then: the place, Redeem, the code with Nida's "For staff" line, Confirm, Redeemed, and the owner view with the visit "Just now", the illustrative sample month, and Pause.

- **A. Bold and minimal** (`a.html`), like Uber: white, black, big type, one obvious button.
- **B. Offer-first** (`b.html`), like Beli and The Entertainer: deep teal, the "Buy 1 Get 1 Free" tab is the hero, used/left counters.
- **C. Premium editorial** (`c.html`), like Marriott Bonvoy: big photos, serif headlines in the logo's typeface, black buttons, one warm accent.

All three side by side: `three-apps.png`.

## Open them on a laptop
1. `git fetch && git checkout redesign/native` (or download the branch as a ZIP from GitHub and unzip it).
2. In Finder (or File Explorer), open `docs/redesign/proto/` and double-click `a.html`, `b.html` or `c.html`. They open in the browser inside a phone outline. Click through.

On a Mac or iPhone they use Apple's own San Francisco font; the screenshots here were made on Linux with a stand-in.

These are throwaway prototypes for choosing a look. The real app and website (`src/`) are unchanged until one is picked.
