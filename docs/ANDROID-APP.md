# The Android app: from GitHub to your phone

The demo is also an Android app (`android/`, Capacitor), the same way it is an iPhone app (docs/IOS-APP.md). GitHub builds it on its own computers and can send it to **Google Play internal testing**, which installs it on your phones from the Play Store. No Android Studio and no Netlify needed. Builds are free (the repo is public).

What the app is: the same demo as the iPhone app, with every page inside the app, so it opens instantly and works with no signal. It opens on the member app (Explore). Holding the logo for a second opens Nida's start screen. It is a demo: the places in it are made-up examples. It runs on Android 8.0 and newer (the code scanner needs 8.0).

## Try it today, with no accounts at all

Every build makes a test version you can install straight from GitHub.

1. GitHub → **Actions** → **Android app** → **Run workflow** → **Run workflow**. It takes about 10 minutes.
2. Open the finished run. Under **Artifacts**, download `the6pass-debug-apk-...` (a zip). Unzip it to get `app-debug.apk`.
3. Send `app-debug.apk` to the Android phone (email it to yourself, or Google Drive) and tap it. Android asks to allow installs from that app (Chrome, Gmail or Files): tap **Settings**, turn on **Allow from this source**, go back, tap **Install**.

This test version is for us only. It is not signed for Google Play and it does not update by itself.

## Once: the Google Play side (about 45 minutes, plus Google's checks)

**1. Google Play Console account (one-time US$25).**
Go to https://play.google.com/console/signup with the Google account for hello@the6pass.ca (or Ammar's). Choose **Yourself** (a personal account) for now: an organisation account needs a D-U-N-S number, and the company doesn't exist yet. Pay the US$25 and verify your identity. Google can take a few days to check the ID.

Note: new personal accounts must run a **closed test with at least 12 testers for 14 days** before Google lets the app go public. Internal testing (below) has no such rule, so you can use the app on your own phones right away.

**2. Create the app.**
Play Console → **All apps** → **Create app**.
- App name: The 6 Pass
- Default language: English (Canada)
- App or game: App
- Free or paid: Free
- Tick the two declarations → **Create app**

The package name is set by the first upload, and it is `ca.the6pass.demo` (it is in the app already). It can never be changed afterwards.

**3. Make the upload key (once, on a computer with Java).**
Google Play only accepts apps signed with your key. You make it once and keep it forever. If you lose it, Google can reset it, but it takes days.

Open a terminal (Windows: **Command Prompt**; Mac: **Terminal**). If `keytool` is not found, install Java first from https://adoptium.net (Temurin 21, the default download). Then run:

```
keytool -genkeypair -v -keystore the6pass-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

- It asks for a **keystore password**: make up a long one and write it down.
- It asks for your name and organisation: type `The 6 Pass` for name and organisation, `Toronto` for city, `ON` for province, `CA` for country. Then `yes`.
- If it asks for a separate key password, press Enter to use the same one.

You now have a file `the6pass-upload.jks`. Keep it, and the password, in a safe place (a password manager, plus a copy in a private folder in Google Drive). **Never put it in this repository.**

Turn it into text for GitHub:
- Mac: `base64 -i the6pass-upload.jks | pbcopy` (the text is now copied)
- Windows: `certutil -encodehex -f the6pass-upload.jks the6pass-upload.txt 0x40000001`, then open `the6pass-upload.txt` in Notepad and copy all of it. Delete the .txt file afterwards.

**4. Four secrets in GitHub.**
https://github.com/ammar-adam/6ixpass/settings/secrets/actions → **New repository secret**, four times:

| Name | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | the text from step 3 (all of it) |
| `ANDROID_KEYSTORE_PASSWORD` | the keystore password |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | the key password (the same as the keystore password if you pressed Enter) |

From now on each build is the signed release for Google Play, attached to the run as `the6pass-release-aab-...`.

**5. The first upload, by hand (Google requires it once).**
1. GitHub → **Actions** → **Android app** → **Run workflow**. When it is green, download `the6pass-release-aab-...` from the run and unzip it to get `app-release.aab`.
2. Play Console → the app → **Test and release** → **Testing** → **Internal testing** → **Create new release**.
3. If it asks about **Play App Signing**, choose **Use Google-generated key** (Google keeps the final key; ours is only the upload key).
4. Drag in `app-release.aab`. Release name: leave as is. **Next** → **Save and publish** (it may say "Save" and then "Send for review"; internal testing is usually live within minutes).

**6. Add yourselves as testers.**
Internal testing → **Testers** tab → **Create email list** → name it `Us` → add the Gmail addresses Ammar and Nida use on their phones → **Save**. Tick the list. Copy the **Join on the web** link and open it on each phone, tap **Accept**, then **Download it on Google Play**. The 6 Pass appears on the home screen.

**7. Automatic uploads (a service account).**
So GitHub can upload new versions by itself:
1. https://console.cloud.google.com → top bar project picker → **New project** → name `the6pass-play` → **Create**. Make sure it is selected.
2. Search for **Google Play Android Developer API** → **Enable**.
3. **IAM and Admin** → **Service accounts** → **Create service account** → name `github-play` → **Create and continue** → no role → **Done**.
4. Click the new account → **Keys** → **Add key** → **Create new key** → **JSON** → **Create**. A .json file downloads. Keep it private.
5. Play Console (the main page, not the app) → **Users and permissions** → **Invite new users** → paste the service account's email (it ends in `iam.gserviceaccount.com`) → **App permissions** → add **The 6 Pass** → tick **Release apps to testing tracks** (and **View app information**) → **Invite user** → **Send invite**.
6. GitHub secrets (as in step 4) → **New repository secret** → Name `PLAY_SERVICE_ACCOUNT_JSON` → open the .json file in a text editor, copy all of it, paste → **Add secret**.

## Every time: a new version

Push to main (when the app, the site code or `android/` changes), or GitHub → **Actions** → **Android app** → **Run workflow**. About 10 minutes later the new version is in internal testing, and the Play Store updates it on your phones.

- **Places:** `made-up` (the default) builds the fictional places. `real` builds the private version with real Toronto places from our research, for Ammar and Nida only. A `real` build must stay in internal testing: never promote it to closed, open or production testing.
- Untick "Upload to Google Play" to only build (the .aab is attached to the run).

## Before a public listing

Internal testing is enough to use the app ourselves. To put it on the public Play Store, Play Console → the app → **Dashboard** lists everything. The main parts:
- **Privacy policy:** https://the6pass.ca/privacy
- **App access:** sign-in is needed for some screens, so give Google a demo login (for example the test account we use for reviews).
- **Ads:** No ads. **Content rating:** fill in the questionnaire (no violence, no gambling, no alcohol offers; users can't talk to each other).
- **Target audience:** 18 and over.
- **Data safety:** email address and name (accounts), for app functionality; data is encrypted in transit; people can ask us to delete their account at hello@the6pass.ca. Camera is used only to scan codes, nothing is stored.
- **Store listing:** short description, full description, the app icon (512x512, `/app/icon-512.png` on the site), a feature graphic (1024x500), and at least 2 phone screenshots (`public/preview/v2/` has some, 1179 wide).
- Say clearly in the description that this is a demo and the places are examples, until real partners are in.
- New personal accounts: the closed test with 12 testers for 14 days (step 1) comes first.
- Only `made-up` builds may ever go past internal testing.

## How it works (for whoever maintains it)
- `.github/workflows/android.yml`: on pushes to main that touch `src/`, `public/`, `android/`, the package files or the Capacitor config, and by hand. Steps: Node 22 and Java 21, `npm ci`, `npm run build` (the static export in `out/`), `npx cap sync android`, then Gradle. Without the four signing secrets: `assembleDebug`, and the APK is attached to the run. With them: `bundleRelease`, signed with the upload key, attached to the run, and uploaded to internal testing with `r0adkll/upload-google-play` when `PLAY_SERVICE_ACCOUNT_JSON` is set. The version code is the workflow run number.
- `android/app/build.gradle` reads the version code (`VERSION_CODE`) and the key (`ANDROID_KEYSTORE_FILE`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`) from the environment. Nothing secret is in the repo.
- `android/app/src/main/java/ca/the6pass/demo/StaticExportRouter.java` does what `StaticExportRouter` in `ios/App/App/AppDelegate.swift` does: `/app/owner` loads `app/owner.html` (and `/` loads `app.html`), the way Netlify serves the site. Capacitor on its own would load the home page for every such path. `MainActivity.java` installs it.
- Camera permission (for the code scanner, `@capacitor/barcode-scanner`) is in `android/app/src/main/AndroidManifest.xml`. Android asks the first time someone scans.
- Look: warm white `#FAF8F5` behind the pages and on the start screen (`res/values/colors.xml`, `styles.xml`), always the light theme, edge to edge with dark status bar icons (`SystemBars` in `capacitor.config.ts`; the pages pad for the camera cutout with `env(safe-area-inset-*)`).
- App icon: the same icon as `/app/icon-1024.png` and `/app/icon-maskable.png` (the Android adaptive icon uses the maskable one on ink `#16140F`). To change it, replace the PNGs in `android/app/src/main/res/mipmap-*`.
- Build it on a computer with Android Studio: `npm run build`, `npx cap sync android`, then `cd android` and `./gradlew assembleDebug` (the APK lands in `android/app/build/outputs/apk/debug/`).

## If the build fails
- **"The keystore did not open"**: `ANDROID_KEYSTORE_BASE64` must be the whole text from step 3, and the password and alias must match what you typed into keytool.
- **"Package not found: ca.the6pass.demo"**: do the first upload by hand (step 5).
- **"Only releases with status draft may be created on draft app"**: the app setup in Play Console isn't finished. Finish the first internal release by hand (step 5) and the setup tasks on the Dashboard, then run the workflow again.
- **"The caller does not have permission"**: the service account needs the app permission in Play Console (step 7.5). It can take up to a day after the invite to start working.
- **"Version code 12 has already been used"**: run the workflow again; each run gets a new number.
- Anything else: open the failed run, click the red step, and paste the last 40 lines to Claude.
