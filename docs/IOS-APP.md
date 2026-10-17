# The iPhone app: from GitHub to your phone

The demo is also a real iPhone app (`ios/`, Capacitor). GitHub builds it on its own Macs and sends it to **TestFlight**, Apple's app for installing test builds. No Mac and no Netlify needed. Builds are free (the repo is public).

What the app is: the same demo as the6pass.ca/partners-demo, with every page inside the app, so it opens instantly and works with no signal. It opens on the member app (Explore), like a real app. Holding the logo for a second opens Nida's start screen (set up a place, New meeting, Tap hints).

## Once: the Apple side (about 30 minutes, plus Apple's approval)

**1. Apple Developer account (US$99 a year).**
Go to https://developer.apple.com/programs/enroll and enrol as an **Individual** with your Apple ID (Ammar or Nida). Individual is fine for now: the company doesn't exist yet, and enrolling as an organisation needs a D-U-N-S number. Apple usually approves within a day or two.

**2. Create the app in App Store Connect.**
https://appstoreconnect.apple.com → **Apps** → **+** → **New App**.
- Platform: iOS
- Name: The 6 Pass (if it's taken, use "The 6 Pass Demo")
- Primary language: English (Canada)
- Bundle ID: choose **ca.the6pass.demo**. If it isn't in the list: https://developer.apple.com/account/resources/identifiers → **+** → App IDs → App → Bundle ID **Explicit** `ca.the6pass.demo` → **Register**, then come back.
- SKU: `the6pass-demo`
- User access: Full access → **Create**

**3. An API key, so GitHub can sign and upload.**
App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API** → **Team Keys** → **+**.
- Name: `GitHub`
- Access: **Admin** (needed so Apple's cloud signing can make the certificate)
- **Generate**. Then note the **Issuer ID** (top of the page) and the **Key ID**, and **Download** the `.p8` file. It downloads once only.

**4. Your Team ID.**
https://developer.apple.com/account → **Membership details** → **Team ID** (10 characters).

**5. Four secrets in GitHub.**
https://github.com/ammar-adam/6ixpass/settings/secrets/actions → **New repository secret**, four times:

| Name | Value |
|---|---|
| `APPLE_TEAM_ID` | the Team ID from step 4 |
| `APP_STORE_CONNECT_KEY_ID` | the Key ID from step 3 |
| `APP_STORE_CONNECT_ISSUER_ID` | the Issuer ID from step 3 |
| `APP_STORE_CONNECT_KEY` | open the `.p8` file in a text editor and paste all of it, including the BEGIN and END lines |

## Every time: build and install

1. GitHub → **Actions** → **iPhone app** → **Run workflow** → leave "Upload to TestFlight" ticked → **Run workflow**. It takes about 15 minutes.
   - **Places:** `real` (the default) builds the private version with 50 real Toronto places from our research, for Ammar and Nida only. `made-up` builds the fictional places. Before showing the app to a merchant, run it with `made-up` (or with signed partners once they're in). Never add an external tester or a public TestFlight link to a `real` build.
2. A few minutes after it turns green, App Store Connect → the app → **TestFlight** shows the build. The first time, answer the export compliance question if asked (the app uses no encryption beyond Apple's own; it's already declared in the app).
3. **Add yourselves as testers (first time only):** TestFlight → **Internal Testing** → **+** → name the group `Us` → add Ammar and Nida (they must be users in App Store Connect: **Users and Access** → **+**). Tick the build.
4. On each phone: install **TestFlight** from the App Store, open the email invite (or the TestFlight app), tap **Install**. The 6 Pass appears on the home screen.

New version later: just run the workflow again. TestFlight updates the app on both phones.

## How it works (for whoever maintains it)
- `.github/workflows/ios.yml`, run by hand only. Steps: newest Xcode on a `macos-26` runner, `npm ci`, `npm run build` (the static export in `out/`), `npx cap sync ios`, then `xcodebuild archive` with Apple's cloud signing (`-allowProvisioningUpdates` with the API key) and `xcodebuild -exportArchive` with `destination: upload` straight to App Store Connect. The build number is the workflow run number.
- Without the four secrets, or with upload unticked, it only checks that the app builds for the simulator. Use that to test a change for free.
- `ios/App/App/AppDelegate.swift` holds `StaticExportRouter`: `/app/owner` loads `app/owner.html`, the way Netlify serves the site. `SceneDelegate.swift` must start `ViewController()` (which installs the router), not the plain `CAPBridgeViewController()`.
- App icon: `ios/App/App/Assets.xcassets/AppIcon.appiconset` (1024×1024, no transparency; same as `/app/icon-1024.png`). Launch screen: `Splash.imageset`, the logo on warm white.
- Netlify skips its build when a push only changes the app, docs or workflows (the `ignore` line in `netlify.toml`), so app work never uses Netlify build minutes.

## If the build fails
- **"No signing certificate" or "No profiles"**: the API key needs **Admin** access (step 3), and `APPLE_TEAM_ID` must be the Team ID, not the Issuer ID.
- **"No suitable application records were found"**: create the app in App Store Connect first (step 2), with bundle ID `ca.the6pass.demo`.
- **"The bundle version must be higher"**: run the workflow again; each run gets a new build number.
- Anything else: open the failed run, click the red step, and paste the last 40 lines to Claude.
