# Run the app mock on a Windows laptop

This opens the clickable mock of The 6 Pass app on your own laptop. You don't need to know how to use a terminal. It takes about 10 minutes the first time and a few seconds after that.

## The first time

**1. Install Node.js (once)**
1. Go to https://nodejs.org
2. Click the big button that says **LTS** (the version marked "Recommended For Most Users").
3. Open the downloaded file (it ends in `.msi`) and click **Next** on every screen, then **Install**, then **Finish**. Keep all the settings as they are.

**2. Download the app**
1. Go to https://github.com/ammar-adam/6ixpass/tree/cowork/seo-geo (sign in to GitHub if it asks).
2. Click the green **Code** button, then **Download ZIP**.
3. Open your **Downloads** folder, right-click the ZIP file and choose **Extract All...**, then **Extract**.

**3. Start it**
1. Open the extracted folder (it's called something like `6ixpass-cowork-seo-geo`).
2. Double-click **`run-app.bat`**.
3. If Windows shows a blue box saying "Windows protected your PC", click **More info**, then **Run anyway**. (The file only starts the app; you can open it in Notepad to read it.)
4. A black window opens. The first time it installs what the app needs, which takes a few minutes. Then your browser opens at **http://localhost:3000/app** by itself.

Keep the black window open while you use the app. Closing it stops the app.

## Every time after that

Double-click **`run-app.bat`**. The browser opens in a few seconds.

## Make it feel like an app (optional)

With the app open in the browser:
- **Chrome:** click the install icon at the right end of the address bar (a small screen with a down arrow), or open the **⋮** menu and choose **Cast, save and share**, then **Install page as app...** (on older Chrome: **Install The 6 Pass...**). Click **Install**.
- **Edge:** open the **...** menu, choose **Apps**, then **Install this site as an app**, then **Install**.

It then opens in its own window with no address bar, and gets a desktop and Start menu icon. The black `run-app.bat` window still needs to be running for it to load.

## Using it

- **Explore:** pick a category or a neighbourhood. Places running today come first.
- Open a place and tap **Redeem** to get a 6-digit code with a 10-minute timer.
- Tap **See what the staff see** (or the **Partner** tab). The same code is waiting. Tap **Confirm**.
- Go back: the member screen now says **Confirmed** and how much you saved. **My pass** shows it in your history.
- **Partner, Your offer:** change the offer, the days, the uses per year or add today as a blackout date, then look at the place again.
- **Tip:** open the app in two windows side by side, one on a place and one on **Partner**. Confirming in one updates the other.
- Everything is saved in this browser. **My pass, Reset demo** starts over.
- The demo always pretends today is Tuesday. The places are made up.

## If something goes wrong

- **"npm is not recognized" or "Node.js is not installed":** install Node.js (step 1), then restart the laptop and try again.
- **The browser didn't open:** open it yourself and go to the address shown in the black window (usually http://localhost:3000/app).
- **"Port 3000 is in use":** the app is probably already running in another black window. Use that one, or close it and start again. The black window shows the address it's actually using.
- **A blank or old-looking page:** press **Ctrl+F5** to reload.
