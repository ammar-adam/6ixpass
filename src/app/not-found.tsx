import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="font-sans">
      <SiteHeader home={false} />
      <main id="main" className="wrap pb-24 pt-14">
        <h1 className="font-serif text-[clamp(44px,6vw,80px)] leading-none tracking-tight">Wrong turn.</h1>
        <p className="mt-6 text-lg text-muted">That page doesn&apos;t exist.</p>
        <Link href="/" className="mt-8 inline-block rounded-xl bg-ink px-6 py-3.5 font-semibold text-white">
          Back to The 6 Pass
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
