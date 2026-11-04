import localFont from "next/font/local";

// Self-hosted (Latin) so the build never depends on Google Fonts. Both are
// variable fonts: one file covers every weight.
// Headlines: Cormorant Garamond, with italic for the accent word.
export const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "./fonts/cormorant.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-italic.woff2", weight: "300 700", style: "italic" },
  ],
});

// Body and UI: Manrope.
export const body = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "./fonts/manrope.woff2", weight: "200 800", style: "normal" }],
});

// The logo only: "the 6 pass" with the 6 in red italic. Same files, bold.
export const cormorant = localFont({
  variable: "--font-logo",
  display: "swap",
  src: [
    { path: "./fonts/cormorant.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-italic.woff2", weight: "300 700", style: "italic" },
  ],
});

export const siteFonts = `${display.variable} ${body.variable} ${cormorant.variable} font-sans`;
