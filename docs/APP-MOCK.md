# The 6 Pass: phone app mock (for Claude Code)

Read `CLAUDE.md` first. Every rule in it still holds (no prices, no real business names, no alcohol, no em dashes, never touch `public.waitlist`).

## What Ammar wants

A mock of the phone app that he can open and click through **on his Windows laptop**, and that feels like a real app instead of a web page. It does not need to be publishable, and it does not need to work on a real iPhone yet. It is a mock: no accounts, no server, no payments.

Today `/demo` is one page inside the marketing site. Turn it into a proper app shell.

## Build this

1. **A real app route, `/app`.** Move the demo out of the marketing site's shell. Keep `/demo` as a redirect to `/app` so old links work. `noindex`, disallowed in robots.txt, not in the sitemap.
2. **Phone frame on desktop.** On a wide screen, show the app inside a phone-sized frame (about 390 by 844) centred on a plain background, with a status bar and home indicator. On a narrow screen, fill the screen with no frame. Mouse and keyboard must work everywhere: click, scroll wheel, Tab, Enter, Esc.
3. **Real navigation.** Each screen has its own URL (`/app`, `/app/place/<slug>`, `/app/redeem/<slug>`, `/app/pass`, `/app/partner`, `/app/partner/offer`) so browser Back and refresh work. Bottom tab bar: Explore, My pass, Partner.
4. **It remembers.** Save state in `localStorage`, wrapped in try/catch: uses left per place, past redemptions, savings so far, and the partner's offer settings. Add a "Reset demo" control in My pass.
5. **The full loop works.**
   - Explore: filter by category and by the six neighbourhoods, "runs today" first.
   - Place: photo, offer, Mon to Sun strip, uses left, plain rules.
   - Redeem: code with a 10 minute countdown. Blocked with a clear message when the offer does not run today or uses are at zero.
   - Partner view: the same code appears, staff tap Confirm, the member screen flips to "Confirmed" and "You saved about $X". Uses left drops by one. It shows in history.
   - Your offer: changing the offer type, days, uses per year or blackout dates updates the place page straight away.
6. **Installable on Windows.** Add a web app manifest and icons so Chrome and Edge offer "Install app" and it opens in its own window with no address bar. A minimal service worker is fine. Do not add anything that needs a server.
7. **One command to run it.** Add `npm run app`, which starts the dev server and prints `http://localhost:3000/app`. Write `docs/RUN-ON-WINDOWS.md` as exact steps for someone who has never used a terminal: install Node LTS from nodejs.org, download the repo as a ZIP from GitHub, unzip, double-click `run-app.bat`. Add that `run-app.bat` at the repo root (runs `npm install` the first time, then `npm run app`, then opens the browser).

## Design

Use direction B (Concierge), already built: navy #0A1424, panel #122038, ice #A9D1FF, DM Serif Display + Figtree, Phosphor icons, real photos from `public/demo/`. No pastels, no drawn illustrations. Keep "Demo. Places shown are examples." visible, and keep today pinned to Tuesday.

## Do not

- Do not change the marketing site's palette. That decision (step 4 of the redesign) is still waiting on Ammar.
- Do not add auth, a database, or Supabase calls to the app.
- Do not show a price for the pass.

## Done means

- `npm run build` and CI pass, and `/app` works in the static export on Netlify too.
- You have clicked the whole loop in Chromium at desktop width and at 390 px, including refresh in the middle of a redemption, and put screenshots in `docs/app-mock/`.
- Tell Ammar in three lines: the link, the one command, and anything you could not verify.
