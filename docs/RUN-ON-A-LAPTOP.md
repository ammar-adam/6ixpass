# Run the demo on a laptop (Windows or Mac)

This opens The 6 Pass demo on your own laptop: a phone on the screen, with the member app and the owner view inside it. You don't need to know how to use a terminal. It takes about 10 minutes the first time and a few seconds after that.

## The first time

**1. Install Node.js (once)**
1. Go to https://nodejs.org
2. Click the big button that says **LTS** (the version marked "Recommended For Most Users").
3. Open the downloaded file (`.msi` on Windows, `.pkg` on Mac) and click **Next** or **Continue** on every screen, then **Install**. Keep all the settings as they are.

**2. Download the demo**
1. Go to https://github.com/ammar-adam/6ixpass/tree/redesign/native (sign in to GitHub if it asks).
2. Click the green **Code** button, then **Download ZIP**.
3. Unzip it:
   - **Windows:** open **Downloads**, right-click the ZIP file, choose **Extract All...**, then **Extract**.
   - **Mac:** open **Downloads** and double-click the ZIP file.

**3. Start it**

*Windows*
1. Open the extracted folder (something like `6ixpass-redesign-native`).
2. Double-click **`run-app.bat`**.
3. If Windows shows a blue box saying "Windows protected your PC", click **More info**, then **Run anyway**. (The file only starts the demo; you can open it in Notepad to read it.)
4. A black window opens. The first time it installs what the demo needs, which takes a few minutes. Then your browser opens at **http://localhost:3000/partners-demo** by itself.

*Mac*
1. Open **Terminal** (press **Cmd + Space**, type `Terminal`, press **Return**).
2. Type `cd ` (with a space after it), drag the unzipped folder from Finder into the Terminal window, and press **Return**.
3. Type `npm install` and press **Return**. Wait until it finishes (a few minutes, the first time only).
4. Type `npm run app` and press **Return**.
5. When it says **The 6 Pass demo is running**, open Safari or Chrome and go to **http://localhost:3000/partners-demo**.

Keep the black window (Windows) or Terminal (Mac) open while you use the demo. Closing it stops the demo.

## Every time after that

- **Windows:** double-click **`run-app.bat`**.
- **Mac:** open Terminal, `cd` into the folder as above, type `npm run app`, then open http://localhost:3000/partners-demo.

## Make it feel like an app (optional)

With the demo open in the browser:
- **Chrome:** click the install icon at the right end of the address bar (a small screen with a down arrow), or open the **⋮** menu and choose **Cast, save and share**, then **Install page as app...**. Click **Install**.
- **Edge:** open the **...** menu, choose **Apps**, then **Install this site as an app**, then **Install**.
- **Safari (Mac):** **File**, then **Add to Dock**.

It then opens in its own window with no address bar. The black window or Terminal still needs to be running for it to load.

## Using it

The start screen is for you, not the owner.
1. Tap the **gear** and fill in the owner's place (name, kind, neighbourhood, offer, days). Tap **Save**.
2. Tap **Start demo**. The member app opens with their place at the top, marked **New · Founding Partner**.
3. Tap their place, then **Redeem**. The code slides up on a pass, with **For staff** and **Confirm** under it.
4. Tap **Confirm**, then **See the owner view**. The visit is at the top of **Recent visits**, marked **Just now**.
5. Under **You control the offer**, tap **Offer**, **Days**, **Uses per member** or **Blackout dates** to change them, or flip **Pause the offer**. Tap **See what members see** to show it changed.
6. **Next step** has the email and a QR code for the terms. **New meeting** clears everything for the next restaurant.

Everything is saved in this browser only. The demo always pretends today is Tuesday. The other places are made up.

## If something goes wrong

- **"npm is not recognized" or "command not found: npm":** install Node.js (step 1), then restart the laptop and try again.
- **The browser didn't open:** open it yourself and go to http://localhost:3000/partners-demo.
- **"Port 3000 is in use":** the demo is probably already running in another window. Use that one, or close it and start again. The window shows the address it's actually using.
- **A blank or old-looking page:** reload with **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac).
