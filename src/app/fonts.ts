import { Cormorant_Garamond, Manrope } from "next/font/google";

// Headlines: Cormorant Garamond, light and large, with italic for the
// accent word. Body and UI: Manrope.
export const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// The logo only: "the 6 pass" with the 6 in red italic.
export const cormorant = Cormorant_Garamond({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

export const siteFonts = `${display.variable} ${body.variable} ${cormorant.variable} font-sans`;
