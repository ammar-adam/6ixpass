# Accounts in the app: what they do and how to turn on real logins

Written for Ammar. Nothing here has been run against the real Supabase project. The app works today on **demo accounts kept on the phone**. Real logins switch on when you run one SQL script and flip one setting.

## What a person sees

**Members**
- Opening the app signed out shows a landing screen: a photo, one line, **Create account**, **Sign in**, and a quiet **I'm a business** link. **Look around first** lets people browse places without an account. Holding the logo still opens Nida's tools.
- **Create account**: email and password (at least 8 characters, show/hide, autofill). With real logins, Supabase emails a link and a 6-digit code to confirm.
- **Sign in**: email and password, or **Email me a sign-in code** (6 digits, works in the iPhone app with no links to tap). **Forgot password?** sends a reset link.
- Then three short steps: first name, home and work area (the six launch neighbourhoods and the rest of the GTA), and a one-line ask for notifications.
- **My pass** shows their name and number, a code on screen if they have one, visit history, saved places, and **Account** (edit name and areas, sign out, delete account).
- **Redeem** shows the code on a pass: a big QR, a Code 128 barcode, the six digits and a 10-minute timer. It flips to **Redeemed** by itself when staff confirm.

**Businesses** ("The 6 Pass for Business", a separate login)
- **I'm a business** opens the partner login. Owners land on the dashboard; staff land straight on **Scan**. Someone with more than one place picks one first.
- **New business? Create an account** (on the partner login): business name, email, password, neighbourhood and type of place. With real logins this makes a **new place** that only their team can see, and opens its dashboard with "Your place shows in the app once The 6 Pass approves it." They can set the offer and invite staff straight away; members see the place once you publish it (step 6). At most 3 businesses per person. With "Confirm email" on, they confirm their email first, then tap **Create account** again.
- **Owner**: Dashboard (offer, days, uses per member, blackout dates, pause, visits), Scan, Today, Team (invite by email as Owner or Staff, remove people; a business always keeps one owner).
- **Staff**: Scan and Today only. Opening the dashboard says "Only owners can change the offer".
- **Scan** opens the camera straight away (the iPhone's own scanner in the app, the camera in the page on the web), with a light button when the phone has one and a box to type the six digits. Results: **Confirmed** (offer, member's first name, uses left), **Already used**, **Code expired**, **Not a valid code**, **Not for this place**, **No uses left**, **Offer paused**, **Too many tries**. Silent, with a haptic on the iPhone.

**Nida's meeting demo** (`/partners-demo`, Two phones, Set up a place, holding the logo) needs no login. It signs itself in with demo accounts and works exactly as before, including "No scanner, no app, no login at the host stand" and the Confirm button on the member's phone.

## Two ways the app can run

| | Demo accounts (today) | Real accounts (after you switch on) |
|---|---|---|
| Setting | `NEXT_PUBLIC_AUTH_MODE` unset | `NEXT_PUBLIC_AUTH_MODE=supabase` |
| Where accounts live | This phone's storage | Supabase Auth (Canada Central) |
| Emails | None. Codes show on screen, marked Demo | Confirm, sign-in code, reset password, staff invite |
| Codes and visits | This phone (two windows on one laptop stay in step) | The database. Confirmed by a database function, once |
| Demo logins | alex@example.com, owner@partner.example, staff@partner.example, password `demo1234` | None. The meeting demo still uses the phone's demo accounts |

The code for both is in `src/lib/auth/`: `types.ts` (the interface), `local.ts` (demo), `supabase.ts` (real), `index.ts` (picks one). Screens never know which is on.

## Security model, in plain words

- **The app only has the public key.** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is meant to be public. No service role or secret key is used anywhere, so every rule has to live in the database, and it does.
- **Row Level Security is on for every new table.** Nothing is readable unless a policy says so:
  - Anyone can read **published places and their offers** (the app needs them before sign-in). Nothing else is public.
  - A member reads **only their own** profile, pass, saved places and visits. They can't read the code hash or who confirmed.
  - People on a business's team see **only that business**. Owners can change **only the offer columns** of their own places (offer, days, uses, blackouts, pause), enforced by column grants as well as policies.
  - Staff can't change anything. They can only call `confirm_code` for **their own place**, and see **today's** visits.
- **Codes.** `issue_code` checks everything (active pass, published, not paused, runs today in Toronto time, not a blackout, uses left this pass year, at most 12 codes an hour) and returns the six digits once. The database keeps only a **peppered SHA-256 hash**; the pepper sits in a private schema the API can't reach. Codes last 10 minutes.
- **Single use.** A unique index means two live codes never share digits. `confirm_code` locks the code's row, checks place, expiry, pause and uses, and marks it confirmed in the **same transaction**. Two staff phones scanning at once: one gets Confirmed, the other gets Already used.
- **Guessing is limited.** Ten wrong codes in 10 minutes from one staff login and `confirm_code` answers Too many tries.
- **Audit.** Every visit keeps `issued_at`, `confirmed_at`, `confirmed_by` (the staff login) and the offer text as it was. Places keep `updated_at` and `updated_by`.
- **Invites can't be claimed by someone else.** An invite turns into a team membership only when the person signs in with that email **confirmed**.
- **Deleting an account** removes the profile, pass, saved places and login. Places keep the visit count, with the name removed. The last owner of a business can't delete their account until they add another owner.
- **New businesses** (`create_my_business`): any signed-in person can make up to 3, each with one place that starts **unpublished**. Only The 6 Pass can publish it: owners can't change `published` (column grants), so a new place can't reach members, issue codes or take visits until you approve it.
- **Functions**: all `SECURITY DEFINER` with `set search_path = public`, all check `auth.uid()`, and execute is taken away from `public` and `anon` and given back only to signed-in users.
- **The waitlist is untouched.** The script never mentions `public.waitlist` or its policies.

## Turning on real logins: exact steps

Allow about 30 minutes. Do them in order.

### 1. Run the SQL (5 minutes)
1. Open https://supabase.com/dashboard and choose the project (nefnflqknwubmurjzqll).
2. Left bar: **SQL Editor** → **New query**.
3. Open `docs/app/SUPABASE-ACCOUNTS.sql` from GitHub, copy **sections 0 to 6** (from the top down to the line `commit;`), paste, and press **Run**. "Success. No rows returned" is right. It's safe to run again later.
4. **New query** again. Copy everything between `/*` and `*/` in **section 8 (Tests)**, paste, **Run**. Scroll the output: it should list `ok: ...` lines and end with **ALL CHECKS PASSED**. It rolls itself back, so nothing stays.

### 2. Email sign-in settings (5 minutes)
Left bar: **Authentication**.
1. **Sign In / Providers** → **Email**: Enable Email provider **on**. **Confirm email on**. **Secure email change on**. Minimum password length **8**. Email OTP length **6**, expiry **600** seconds. **Save**.
2. Same page, **Prevent use of leaked passwords**: turn **on** (needs the Pro plan; skip it on the free plan and note it).
3. Turn **off** every other provider you aren't using (Phone, Apple, Google). Apple and Google sign-in are not built; they'd need their own setup first.
4. **Attack Protection** (or **Bot and abuse protection**): consider turning on CAPTCHA (hCaptcha or Turnstile) before launch. The app would then need a small change to pass the captcha token; ask Claude.

### 3. Where links go (2 minutes)
**Authentication** → **URL Configuration**:
- **Site URL**: `https://the6pass.ca`
- **Redirect URLs** → **Add URL**, one at a time:
  - `https://the6pass.ca/app/**`
  - `https://www.the6pass.ca/app/**`
  - `http://localhost:3000/app/**` (for running it on the laptop)
  - Your Netlify preview, if you use one: `https://*--YOUR-SITE-NAME.netlify.app/app/**`

The iPhone app doesn't need a link of its own: it signs in with the 6-digit code from the email, so nothing has to open the app from a link. Reset-password links open the website, set the new password there, then sign in in the app.

### 4. The emails (10 minutes)
**Authentication** → **Emails** (Templates). Keep them short and plain. Each must include the 6-digit code `{{ .Token }}` so iPhone users can type it.

- **Confirm signup**. Subject: `Confirm your email for The 6 Pass`. Body:
  `<p>Tap to confirm your email: <a href="{{ .ConfirmationURL }}">Confirm</a></p><p>Or type this code in the app: <strong>{{ .Token }}</strong></p><p>If you didn't sign up, ignore this email.</p>`
- **Magic Link** (used for "Email me a sign-in code" and staff invites). Subject: `Your sign-in code for The 6 Pass`. Body:
  `<p>Your code: <strong>{{ .Token }}</strong></p><p>It works for 10 minutes. If you didn't ask for it, ignore this email.</p>`
- **Reset Password**. Subject: `Reset your password for The 6 Pass`. Body:
  `<p><a href="{{ .ConfirmationURL }}">Set a new password</a></p><p>If you didn't ask, ignore this email. Your password stays the same.</p>`
- **Change Email Address**: keep the default, change the subject to `Confirm your new email for The 6 Pass`.

**SMTP**: **Authentication** → **Emails** → **SMTP Settings** → turn on **custom SMTP** and fill in a sending service (Resend, Postmark or Amazon SES; sender `hello@the6pass.ca`, name `The 6 Pass`). Supabase's built-in sender only delivers a handful of emails an hour and only to your own team's addresses, so real members won't get emails without this.

### 5. Rate limits (1 minute)
**Authentication** → **Rate Limits**: emails sent per hour **30** to start (raise for launch day), token verifications **30** per 5 minutes per IP, sign-ups and sign-ins **30** per 5 minutes per IP. **Save**.

### 6. Put the places in (10 minutes, then as partners sign)
**Approving a business that signed up in the app.** Their place is hidden until you publish it.
1. **SQL Editor** → **New query**: `select id, name, neighbourhood, category, offer, created_at from public.places where not published order by created_at;` shows who is waiting.
2. To approve one: `update public.places set published = true where id = 'their-place-id';` → **Run**. It shows in the app for everyone straight away (no app update needed). To hide it again, set it back to `false`.

**Places you add yourself:**
The app's place list comes with the app; the **offers, days, uses and pause come from the database** once real logins are on, and a place without a row can't issue codes ("This place isn't taking codes in the app yet").
1. **SQL Editor** → **New query** → copy **section 7** of the SQL, remove the `--` marks, fill in the business name, the place id (the same id the app uses, e.g. `lantern-house`), the offer and days. **Run**.
2. Invite the owner with the `staff_invites` line in section 7. They open the app, tap **I'm a business**, **Email me a sign-in code**, and they're in. They invite their own staff from **Team**.

### 7. Passes
New accounts get a **pending** pass until payments exist. Either:
- Beta: run `update t6p_private.settings set open_beta = true;` and every new sign-up gets an active 12-month pass. Turn it back to `false` when payments start.
- Or activate people one by one with the `update public.passes ...` line in section 7.

### 8. Flip the switch
- **Netlify**: Site configuration → **Environment variables** → **Add a variable** → Key `NEXT_PUBLIC_AUTH_MODE`, Value `supabase` → **Create variable**. Then **Deploys** → **Trigger deploy** → **Deploy site**.
- **iPhone app**: in GitHub, open `.github/workflows/ios.yml`, find the step **Build the web app**, and add the line `NEXT_PUBLIC_AUTH_MODE: supabase` under `env:` next to the other `NEXT_PUBLIC_` lines. Commit, then run the workflow (docs/IOS-APP.md).
- **Laptop**: add `NEXT_PUBLIC_AUTH_MODE=supabase` to `.env.local`.

To turn it off again, delete the variable and redeploy. The demo accounts come back.

## How to check it worked

1. In the app: **Create account** with your own email, confirm with the code, finish the three steps. Then **Sign out** and **Sign in** again.
2. **SQL Editor**, one at a time:
   - `select id, first_name, onboarded from public.profiles order by created_at desc limit 5;` your name is there.
   - `select number, status, starts_on, ends_on from public.passes order by created_at desc limit 5;` active if open_beta is on.
3. On a second phone, sign in as the place's owner (**I'm a business**). On the first phone, open that place and tap **Redeem**. On the second, **Scan** the QR. Both phones change: Confirmed and Redeemed.
4. `select place_id, status, confirmed_at, offer_text from public.redemptions order by issued_at desc limit 5;` one confirmed row. There is no column with the plain code.
5. Scan the same code again: **Already used**. Wait 10 minutes with a fresh code and scan it: **Code expired**.
6. `select policyname from pg_policies where tablename = 'waitlist';` the waitlist's policies are the same as before.

## Checks
- `scripts/accounts-walk.mjs` (89 checks) walks every account screen on the demo accounts, including camera scanning with a fake camera.
- `scripts/supabase-mode-check.mjs` (34 checks) runs a build with `NEXT_PUBLIC_AUTH_MODE=supabase` against a **fake** Supabase in the test browser (nothing reaches the real project): sign in, the pass, offers from the database, `issue_code`, `confirm_code`, the member's phone flipping to Redeemed, Already used, a new business signing up (`create_my_business`) and landing on its dashboard, a database-only place on Explore with its view page and Redeem, an unpublished place kept off Explore, and that no secret key is ever sent.
- The SQL (sections 0 to 6 twice, then section 8) was run on a local Postgres 16 set up like Supabase (roles `anon` and `authenticated`, `auth.users`, `auth.uid()`, pgcrypto in `extensions`, a stand-in waitlist with its policy). Result: ALL CHECKS PASSED, waitlist policy unchanged. Supabase's own `auth` schema has more columns and triggers than the stand-in, so still run section 8 in the real SQL Editor before switching on.
- supabase-js is only in builds with the flag on (`next.config.ts` swaps `src/lib/auth/remote.ts` for a stub otherwise). It contains the text `sb_secret_` (its own check that a secret key isn't used in a browser), so if CI ever builds with the flag on, change the CI check to look for a whole key (`sb_secret_` followed by characters) instead of the prefix.

## What's not built yet (on purpose)
- Payments. Passes are activated by `open_beta` or by hand.
- Push notifications. The app records the member's choice; nothing sends yet.
- Apple and Google sign-in.
- Enforcing "pause with 7 days' notice" in the database: the switch pauses straight away, as in the demo.
- Places that are only in the database (signed up in the app, or added by us) show with a colour tile and their initial, not a photo, and open at `/app/place/view?id=<id>` (the static export can't make a page per database place). Photos, menus and hours for them aren't built yet.
- Approving a new business is a line of SQL (step 6), not a screen.
