import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Serif_Display, Figtree, Instrument_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "@/demo/directions/motion.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-dmserif" });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--f-jakarta" });

export const metadata: Metadata = {
  title: "Demo design directions",
  robots: { index: false, follow: false },
};

export default function DirectionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${instrument.variable} ${dmSerif.variable} ${figtree.variable} ${jakarta.variable} min-h-dvh bg-[#d9dbdd] sm:grid sm:place-items-center sm:py-8`}>
      {children}
    </div>
  );
}
