import { Bricolage_Grotesque, DM_Serif_Display, Figtree, Instrument_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "@/demo/directions/motion.css";

// Direction B (the chosen one) uses DM Serif Display + Figtree. The other two
// pairs are only for the comparison pages under /demo/directions.
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-dmserif", preload: false });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage", preload: false });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--f-jakarta", preload: false });

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${dmSerif.variable} ${figtree.variable} ${bricolage.variable} ${instrument.variable} ${jakarta.variable}`}>{children}</div>;
}
