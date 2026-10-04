import type { Metadata } from "next";
import { GoToApp } from "./GoToApp";

// The demo moved to /app. Netlify also redirects /demo there (netlify.toml);
// this page covers `npm run app` and any host without that rule, in the browser.
export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false, follow: false },
};

export default function DemoMoved() {
  return <GoToApp />;
}
