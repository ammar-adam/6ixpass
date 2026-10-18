# Sign-up emails and real app accounts

Written for Ammar. When this is done:
- Every website waitlist sign-up is saved in Supabase (it already is) **and** emails hello@the6pass.ca.
- Every app account (member or business) is saved in Supabase **and** emails hello@the6pass.ca.

About 25 minutes. Do the parts in order. Parts A to C are clicks only you can do (Claude can't sign in to Google or Supabase). After Part C, tell Claude "done": it checks from outside that the database is ready, then switches the website app and the iPhone build to real accounts.

## Part A. The email sender (Google, 8 minutes)

Sign in to Google as **hello@the6pass.ca** first. The emails come from whichever account runs the script.

1. Open https://script.google.com and click **New project**.
2. Top left, click **Untitled project** and name it `The 6 Pass sign-up alerts`.
3. Delete everything in the editor. Open `docs/app/signup-alerts.gs` on GitHub, copy all of it, paste it in. Press **Ctrl+S** (Cmd+S on a Mac).
4. In the bar above the code, choose **setupKey** in the function menu, then click **Run**. Google asks for permission: **Review permissions**, choose hello@the6pass.ca, **Advanced**, **Go to The 6 Pass sign-up alerts (unsafe)**, **Allow**. (It says "unsafe" only because you wrote the script yourself.)
5. The log at the bottom shows `Your key: ...`. Copy the key (the letters and numbers after the colon).
6. Choose **testEmail** in the function menu, click **Run**. Check hello@the6pass.ca: an email "New waitlist sign-up: test@example.com" arrives.
7. Top right, **Deploy**, **New deployment**. Click the gear next to "Select type", choose **Web app**. Description `alerts`. **Execute as: Me**. **Who has access: Anyone**. Click **Deploy**.
8. Copy the **Web app URL** (it starts with `https://script.google.com/macros/s/` and ends with `/exec`).
9. Put them together in a note: the URL, then `?key=`, then the key. Example shape: `https://script.google.com/macros/s/AKfy.../exec?key=3f9a...`. Keep this private.

## Part B. The database (Supabase, 7 minutes)

1. Open https://supabase.com/dashboard, choose the project (nefnflqknwubmurjzqll).
2. Left bar: **SQL Editor**, **New query**. Open `docs/app/SUPABASE-ACCOUNTS.sql` on GitHub, copy **sections 0 to 6** (from the top down to the first line `commit;`), paste, **Run**. "Success. No rows returned" is right.
3. **New query**. Copy everything between `/*` and `*/` in **section 8 (Tests)** of the same file, paste, **Run**. It should end with **ALL CHECKS PASSED**. It undoes itself.
4. **New query**. Run this so new app accounts get an active pass during the beta: `update t6p_private.settings set open_beta = true;`
5. **New query**. Open `docs/app/SUPABASE-SIGNUP-ALERTS.sql` on GitHub, copy all of it, paste. Find `PASTE_SCRIPT_URL_HERE` and replace it (keep the quotes around it) with your note from Part A step 9. **Run**.
6. Test: open https://the6pass.ca, join the waitlist with your own email (tick the box). Within a minute hello@ gets "New waitlist sign-up".

## Part C. Sign-in settings (Supabase, 8 minutes)

Left bar: **Authentication**.

1. **Sign In / Providers**, **Email**: Enable Email provider **on**. Minimum password length **8**. Email OTP length **6**, expiry **600** seconds.
   - **Confirm email: off for now.** Supabase's own sender only delivers to your team's addresses, so with it on, members can't finish signing up. Turn it **on** the day a sending service is set up (Part D).
   - **Save**.
2. Turn **off** Phone, Apple and Google providers.
3. **URL Configuration**: Site URL `https://the6pass.ca`. Redirect URLs, **Add URL** for each: `https://the6pass.ca/app/**`, `https://www.the6pass.ca/app/**`, `http://localhost:3000/app/**`.
4. **Rate Limits**: sign-ups and sign-ins **30** per 5 minutes per IP. **Save**.

Then tell Claude "done". Claude checks the tables answer from outside (with the public key only) and switches the app to real accounts on the website and in the next iPhone build.

## Part D. Later, before launch: a real sending service

Needed for confirmation emails, sign-in codes and password resets to reach members. Resend is the simplest: sign up at resend.com with hello@, **Domains**, add `the6pass.ca`, add the DNS records it shows in Wix, then in Supabase **Authentication**, **Emails**, **SMTP Settings**: host `smtp.resend.com`, port `465`, user `resend`, password = a Resend API key, sender `hello@the6pass.ca`, name `The 6 Pass`. Then turn **Confirm email** on. The email templates to paste are in `docs/app/ACCOUNTS.md`, step 4.

## Good to know

- An alert can never block a sign-up. If Google is down, the person is still saved; you just don't get that one email.
- To stop the emails: in the SQL Editor run `update t6p_private.signup_alert set url = 'off';`. Run Part B step 5 again to turn them back on.
- To see everyone: **Table Editor**, `waitlist` for the website, `profiles` (and **Authentication**, **Users**) for the app.
- Google lets one account send up to 1,500 of these a day on Workspace.
- The places in the app are still the example places. With real accounts on, members can sign up and look around; a place takes real codes only once it's added to the database (`docs/app/ACCOUNTS.md`, step 6).
