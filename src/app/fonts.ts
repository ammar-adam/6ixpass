import { Cormorant_Garamond } from "next/font/google";

// The site uses the same type as the app (C2 light): Cormorant for headlines,
// each device's own font for everything else (San Francisco on Apple, Roboto
// on Android, Segoe on Windows). Nothing to download for body text.
export const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

// The logo only: "the 6 pass" with the 6 in red italic.
export const cormorant = Cormorant_Garamond({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

export const siteFonts = `${display.variable} ${cormorant.variable} font-sans`;
