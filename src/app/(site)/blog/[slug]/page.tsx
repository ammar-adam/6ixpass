import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/content/blog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistPopup, OpenWaitlistButton } from "@/components/WaitlistPopup";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.dek,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.dek, url: `/blog/${p.slug}`, images: [`${p.image}-1200.webp`] },
  };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const owners = p.tag === "Owners";
  return (
    <>
      <SiteHeader />
      <main id="main">
        <article className="wrap max-w-[760px] pb-16 pt-8 md:pb-24 md:pt-12">
          <Link href="/blog" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-ink-2 hover:text-ink">
            <span aria-hidden="true">←</span> All posts
          </Link>
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-copper">{p.tag}</p>
          <h1 className="mt-2 font-serif text-[clamp(40px,5.5vw,64px)] font-normal leading-[1.02] tracking-[-0.015em] text-balance">{p.title}</h1>
          <p className="mt-4 text-[19px] leading-relaxed text-ink/75">{p.dek}</p>
          <p className="mt-4 text-[14px] text-muted">{p.readMinutes} min read</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
          <img src={`${p.image}-1200.webp`} alt={p.imageAlt} width={1200} height={800} className="mt-8 aspect-[16/9] w-full rounded-[24px] object-cover shadow-card" />
          <div className="mt-10 grid gap-8">
            {p.body.map((s, i) => (
              <section key={i}>
                {s.h && <h2 className="font-serif text-[30px] leading-tight">{s.h}</h2>}
                {s.p.map((t, j) => (
                  <p key={j} className={`text-[18px] leading-[1.7] text-ink/90 ${s.h || j ? "mt-4" : ""}`}>
                    {t}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <div className="mt-12 rounded-[24px] bg-[linear-gradient(120deg,#f8e1cf,#f3c9a6)] p-6 md:p-8">
            <p className="font-serif text-[28px] leading-tight">{owners ? "Run a place in the GTA?" : "Be first in the 6."}</p>
            <p className="mt-2 text-[16px] text-ink/80">{owners ? "Join as a Founding Partner. It's free while we launch." : "Join the waitlist for founding member pricing."}</p>
            {owners ? (
              <Link href="/owners#apply" className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-accent px-6 font-semibold text-white hover:bg-accent-2">Join as a partner</Link>
            ) : (
              <OpenWaitlistButton className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-accent px-6 font-semibold text-white hover:bg-accent-2">Join the waitlist</OpenWaitlistButton>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
