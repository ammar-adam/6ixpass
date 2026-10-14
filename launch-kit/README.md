# The 6 Pass: launch kit

Everything for the partner launch, in one folder. Last checked Tuesday, October 13, 2026.

## What's live
| | Where | Checked |
|---|---|---|
| Website | https://the6pass.ca | Every page loads; no errors on phone or laptop. A real signup saved to the waitlist and a repeat was refused. Lighthouse (mobile): accessibility 100, performance 88 to 92. |
| Demo | https://the6pass.ca/partners-demo | 110 of 110 scripted checks passed on the live site, on a phone-size screen, including with the network off. |
| Owners page (the QR code opens it) | https://the6pass.ca/owners | Loads; terms, costs and the worked example are there. |
| Email | hello@the6pass.ca | Receives and sends. Two anti-spam records still to add (see below). |

## Files in this folder
| File | What it is | Use it for |
|---|---|---|
| `deck.pdf` | The partner deck, 9 slides | Present from a laptop, or send after a meeting |
| `deck-speaker-notes.md` | What to say on each slide | Practice |
| `one-pager.pdf` | The leave-behind, letter size | Print 20 |
| `letter-of-intent.pdf` | The non-binding letter owners sign | Print 10. One lawyer read before the first signature |
| `pipeline.xlsx` | The partner tracker: dropdowns, overdue dates in red, weekly counts | Open in Excel, or upload to Google Sheets and share |
| `demo-flow.jpg` | Every demo screen on one page | Show Nida the whole flow in one look |
| `meeting-guide.md` | How to run the demo on a phone, step by step | Before the first meeting |

## The demo, in order (about ten minutes)
1. **A place joins.** Before the meeting, Nida taps the gear on her start screen and fills in the place: name, offer, days, a photo from their website or Instagram. Or the owner does it at the table, one question per screen.
2. **What members see.** Tap **Start demo** and hand the phone over. Their place is first in the app, marked New · Founding Partner. They open it and tap **Redeem**. The code appears on a pass. Say: "No scanner, no app, no login at the host stand. Your staff check the code matches and tap Confirm." They tap **Confirm**, then **See the owner view**.
3. **What the owner sees.** Their visit is at the top, marked **Just now**. Tonight: 1 member visit. You pay $0. Under **You control the offer** they change the days or flip **Pause**, then **See what members see**. Then **Next step**: the QR code for the terms, and the email.
4. **Ask.** "Would you like to be one of our fifty Founding Partners? It's a one-page letter of intent. It isn't a contract and it costs nothing."

**Tap hints** on the start screen turns on a small "tap here next" line on every screen. On for practice, off for real meetings. **New meeting** clears everything for the next place.

## The next four days (Ossington first)
Owners are easiest to catch between lunch and dinner, about 2:30 to 4:30.

**Wednesday, October 14: get ready**
- [ ] Demo on both phones: Safari, the6pass.ca/partners-demo, Share, Add to Home Screen. Open it once on Wi-Fi.
- [ ] Practise the demo twice with Tap hints on. Then switch hints off.
- [ ] 30 places in Ossington into `pipeline.xlsx`: name, owner or manager, phone, best time.
- [ ] Letter of intent to a lawyer for one read.
- [ ] Print 20 one-pagers and 10 letters of intent.
- [ ] Ammar: DKIM and DMARC records in Wix (steps below). Point the `www` record at the new Netlify site.
- [ ] Claim @the6pass on Instagram.

**Thursday, October 15: first contact**
- [ ] Walk Ossington, 2:30 to 4:30. Ask for the owner or manager. Thirty seconds, leave a one-pager. "Can I show you on the phone? It takes ten minutes."
- [ ] Email the places you couldn't visit, from hello@the6pass.ca, with the owners page link.
- [ ] Log every contact in the pipeline.
- [ ] Set up tomorrow's places in the demo (gear, name, offer, a photo from their Instagram).

**Friday, October 16: meetings**
- [ ] Run the demo on their own place.
- [ ] Ask for the letter of intent. Two copies, leave one.
- [ ] New meeting between places.
- [ ] Thank-you email the same day. Write down which nights are slow for them.

**Saturday, October 17: review**
- [ ] Count conversations, demos and letters.
- [ ] Note the questions owners asked. Fix the talk track and the deck.
- [ ] Book next week's meetings.
- [ ] Start the company name search (NUANS), then incorporate.

**Target for the week:** 10 conversations, 5 demos, 2 letters of intent.

## What owners will ask
- **What does it cost?** Free for your first 12 months. No commission, no setup. Leave with 30 days' notice.
- **After 12 months?** "We'll agree that together before then. Nothing changes without 30 days' notice." Never quote a number.
- **How many members?** "Members join at launch on March 16. The waitlist is open now." Never quote a number.
- **Who pays for the free main?** You do, on the days you pick, up to the limit you set. That's why you leave out your busy nights.
- **Drinks?** No alcohol. Food, services and non-alcoholic drinks only.
- **Can I stop?** Pause with 7 days' notice to members. Leave with 30 days' notice.
- **The numbers on the dashboard?** A sample month, marked as illustrative. Not real results.

## Ammar's two remaining settings
**Email anti-spam records (Wix, Manage DNS records).** Without these, mail from hello@ can land in spam at banks and law firms.
1. Google Admin → Apps → Google Workspace → Gmail → **Authenticate email** → **Generate new record**. In Wix add a TXT record, host `google._domainkey`, value as shown. Back in Google, **Start authentication**.
2. In Wix add a TXT record, host `_dmarc`, value `v=DMARC1; p=none; rua=mailto:hello@the6pass.ca`.

**`www` record (Wix).** Edit the `www` CNAME from `the6pass-toronto.netlify.app` to the new site's `.netlify.app` name (Netlify → Site configuration → Site details). Works today; breaks if the old site is ever deleted.

**Publishing.** Netlify builds every push to `main` and publishes it, which uses Netlify build minutes. On October 13 the minutes ran out and publishing stopped for about an hour; Ammar bought credits and it resumed. Keep an eye on the balance: Netlify → Team settings → Billing.

**Safety net: publishing from GitHub (optional, about five minutes).** If Netlify ever stops publishing again, two secrets let GitHub build the site and push it to Netlify itself, using no Netlify build minutes.
1. Netlify → click your avatar (top right) → **User settings** → **Applications** → **Personal access tokens** → **New access token**. Name it `GitHub deploy`, no expiry, **Generate**. Copy it; it shows once.
2. Netlify → the site → **Site configuration** → **Site details** → copy the **Site ID**.
3. GitHub → https://github.com/ammar-adam/6ixpass/settings/secrets/actions → **New repository secret**: name `NETLIFY_AUTH_TOKEN`, paste the token, **Add secret**. Again: name `NETLIFY_SITE_ID`, paste the Site ID.
4. GitHub → **Actions** → **Deploy to Netlify** → **Run workflow**. About two minutes later the6pass.ca has the latest `main`.
5. Then stop Netlify's own builds (Netlify → **Site configuration** → **Build & deploy** → **Build settings** → **Stop builds**), so each push is published once, by GitHub.

If Netlify says **Locked** on the Deploys page, click **Unlock** first; a locked site ignores new deploys from anywhere.

## The iPhone app
GitHub builds it on its own Macs and sends it to TestFlight; no Mac and no Netlify needed. Once: an Apple Developer account (US$99 a year), the app in App Store Connect, an API key, and four secrets in GitHub. Then: GitHub → Actions → **iPhone app** → **Run workflow**, and about 15 minutes later it installs on your phones through the TestFlight app. Every click is in `docs/IOS-APP.md`.

## Before anyone signs
- Company name search (NUANS), then incorporate. Federal about $200, Ontario about $300. Nida as sole owner. Until then, sign as "on behalf of The 6 Pass (in formation)".
- A mailing address. Needed on every email to the waitlist (Canada's anti-spam law). A UPS Store box is fine. Put it in `src/content/site.ts` under `mailingAddress`.
- Lawyer: the letter of intent now; the partner agreement and the terms before March.

## Before members can buy (by March)
- Prices and HST with an accountant. Prices stay off the site until then.
- Card payments and receipts.
- Business bank account and general liability insurance.
- The iPhone app: Apple Developer account (US$99 a year). The demo becomes the real app.
- Trademark search for "The 6 Pass" with the Canadian trademarks office.
