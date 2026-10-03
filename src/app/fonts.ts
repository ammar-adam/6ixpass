import { Newsreader, Schibsted_Grotesk } from "next/font/google";

// The marketing site's fonts. Loaded by the (site) layout and the 404 page
// only, so the app demo doesn't download them.
export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  // Two static weights keep the download small (better phone speed).
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const siteFonts = `${newsreader.variable} ${schibsted.variable} font-sans`;
