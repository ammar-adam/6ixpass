import type { CapacitorConfig } from "@capacitor/cli";

/*
 * The iPhone app: the static export (out/) wrapped in a native shell.
 * Everything ships inside the app, so it works offline from the first launch.
 * It opens on the owner demo start screen. See docs/IOS-APP.md.
 */
const config: CapacitorConfig = {
  appId: "ca.the6pass.demo",
  appName: "The 6 Pass",
  webDir: "out",
  backgroundColor: "#FAF8F5",
  server: {
    // The first screen. Native code (ios/App/App/StaticExportRouter.swift) maps
    // each page path to its .html file, the way Netlify does.
    appStartPath: "partners-demo",
  },
  ios: {
    // Pages fill the screen edge to edge; the app pads for the notch itself.
    contentInset: "never",
    scheme: "The 6 Pass",
  },
};

export default config;
