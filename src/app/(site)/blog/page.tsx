import type { Metadata } from "next";
import Link from "next/link";
import { blogIndex, posts } from "@/content/blog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistPopup } from "@/components/WaitlistPopup";

export const metadata: Metadata = {
  title: "Blog",
  description: blogIndex.intro,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", title: blogIndex.title, description: blogIndex.intro, url: "/blog", images: ["/opengraph-image"] },
};

export default function Blog() {
  const [first, ...rest] = posts;
  return (
    <>
      <SiteHeader />
      <main id="main" className="hero-glow">
        <div className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Blog</p>
          <h1 className="mt-3 font-serif text-[clamp(44px,6vw,76px)] font-normal leading-[1] tracking-[-0.02em]">{blogIndex.title}</h1>
          <p className="mt-4 max-w-[48ch] text-[18px] text-ink/75">{blogIndex.intro}</p>

          {first && (
            <Link href={`/blog/${first.slug}`} className="group mt-10 grid overflow-hidden rounded-[28px] border border-line bg-[#fffaf4] shadow-card md:grid-cols-[1.1fr_1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
              <img src={`${first.image}-1200.webp`} alt={first.imageAlt} width={1200} height={800} className="aspect-[16/10] w-full object-cover md:h-full" />
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-copper">{first.tag}</p>
                <h2 className="mt-2 font-serif text-[clamp(30px,3vw,42px)] leading-tight group-hover:underline group-hover:underline-offset-4">{first.title}</h2>
                <p className="mt-3 text-[16px] text-ink/75">{first.dek}</p>
                <p className="mt-4 text-[13px] text-muted">{first.readMinutes} min read</p>
              </div>
            </Link>
          )}

          {rest.length > 0 && <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block h-full overflow-hidden rounded-[24px] border border-line bg-[#fffaf4] shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                  <img src={`${p.image}-640.webp`} alt={p.imageAlt} width={640} height={427} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  <div className="p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-copper">{p.tag}</p>
                    <h2 className="mt-1.5 font-serif text-[24px] leading-snug group-hover:underline group-hover:underline-offset-4">{p.title}</h2>
                    <p className="mt-2 text-[15px] text-ink/75">{p.dek}</p>
                    <p className="mt-3 text-[13px] text-muted">{p.readMinutes} min read</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>}
        </div>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
