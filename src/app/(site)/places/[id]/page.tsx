import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { placesPage as c } from "@/content/site";
import { PLACES } from "@/demo/places";
import { DAY_SHORT } from "@/demo/data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OpenWaitlistButton, WaitlistPopup } from "@/components/WaitlistPopup";
import { PlaceCard, offerLine } from "@/components/PlaceCard";

export const dynamicParams = false;
export function generateStaticParams() {
  return PLACES.map((p) => ({ id: p.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = PLACES.find((x) => x.id === id);
  if (!p) return {};
  const title = `${p.name}, ${p.neighbourhood}`;
  const description = `${offerLine(p.offer)}. ${p.blurb} An example place on The 6 Pass.`;
  // Example places stay out of search until they are real partners.
  return { title, description, alternates: { canonical: `/places/${p.id}` }, robots: { index: false, follow: true }, openGraph: { title, description, url: `/places/${p.id}`, images: [`${p.image}-1200.webp`] } };
}

/** "17:00" -> "5 pm", "22:30" -> "10:30 pm". */
function time(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hh = h % 12 || 12;
  return `${hh}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 || h === 24 ? "am" : "pm"}`;
}

export default async function Place({ params }: Props) {
  const { id } = await params;
  const p = PLACES.find((x) => x.id === id);
  if (!p) notFound();
  const d = p.details;
  const more = PLACES.filter((x) => x.id !== p.id && (x.neighbourhood === p.neighbourhood || x.category === p.category)).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main id="main" className="hero-glow">
        <div className="wrap pb-16 pt-6 md:pb-24 md:pt-10">
          <Link href="/places" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-ink-2 hover:text-ink">
            <span aria-hidden="true">←</span> {c.back}
          </Link>
          <div className="mt-4 grid gap-10 md:grid-cols-[1.05fr_1fr] md:gap-12">
            <div>
              <div className="relative overflow-hidden rounded-[28px] shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                <img src={`${p.image}-1200.webp`} srcSet={`${p.image}-640.webp 640w, ${p.image}-1200.webp 1200w`} sizes="(min-width: 768px) 600px, 92vw" alt={`${p.name}, ${p.kind}`} width={1200} height={900} className="aspect-[4/3] w-full object-cover md:aspect-[5/6]" />
                <span className="absolute left-4 top-4 rounded-full bg-night/75 px-3 py-1 text-[13px] font-semibold text-white">{c.exampleNote}</span>
                {p.credit && <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 text-[11px] text-white/90">{p.credit}</span>}
              </div>
              {d.gallery.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-4">
                  {d.gallery.slice(0, 2).map((g) => (
                    <li key={g} className="overflow-hidden rounded-[20px]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                      <img src={`${g}-640.webp`} alt="" width={640} height={427} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="md:pt-2">
              <p className="flex flex-wrap items-center gap-2 text-[15px]">
                <span className="font-semibold">{c.singular[p.category] ?? p.category}</span>
                <span aria-hidden="true" className="text-muted">·</span>
                <span className="text-muted">{p.neighbourhood}</span>
              </p>
              <h1 className="mt-2 font-serif text-[clamp(44px,5.4vw,72px)] font-normal leading-[1] tracking-[-0.02em]">{p.name}</h1>
              <p className="mt-4 max-w-[40ch] text-[18px] leading-relaxed text-ink/75">{p.blurb}</p>

              <section aria-labelledby="offer-title" className="mt-8 rounded-[24px] border border-line bg-[#fffaf4] p-6 shadow-card md:p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">{c.yourOffer}</p>
                <h2 id="offer-title" className="mt-2 font-serif text-[34px] leading-tight">{offerLine(p.offer)}</h2>
                <p className="mt-2 text-[16px] text-ink/75">{p.detail}</p>
                <ul aria-label="Days the offer runs" className="mt-5 flex flex-wrap gap-1.5">
                  {DAY_SHORT.map((day, i) => (
                    <li
                      key={day}
                      className={`rounded-full px-3 py-1 text-[13px] font-semibold ${p.days[i] ? "bg-night text-white" : "bg-mist text-muted line-through"}`}
                    >
                      {day}
                      <span className="sr-only">{p.days[i] ? ", runs" : ", not this day"}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[15px]">{p.usesPerYear} {p.usesPerYear === 1 ? "use" : "uses"} a year</p>
                <OpenWaitlistButton className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-6 text-[16px] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(194_69_45/0.8)] hover:bg-accent-2">
                  {c.redeem}
                </OpenWaitlistButton>
                <p className="mt-3 text-center text-[13px] text-muted">{c.redeemNote}</p>
              </section>

              <dl className="mt-8 grid gap-4 text-[15px]">
                <div>
                  <dt className="font-semibold">Where</dt>
                  <dd className="text-ink/75">
                    {d.address}
                    {d.transit && <span className="block text-muted">{d.transit}</span>}
                  </dd>
                </div>
                {d.hours && (
                  <div>
                    <dt className="font-semibold">Hours</dt>
                    <dd>
                      <ul className="mt-1 grid max-w-[320px] gap-0.5 text-ink/75">
                        {d.hours.map((h, i) => (
                          <li key={DAY_SHORT[i]} className="flex justify-between gap-6">
                            <span>{DAY_SHORT[i]}</span>
                            <span>{h ? `${time(h[0])} to ${time(h[1])}` : "Closed"}</span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>

              {d.menu && (
                <section aria-labelledby="menu-title" className="mt-8 border-t border-line pt-6">
                  <h2 id="menu-title" className="font-serif text-[26px]">{d.menuTitle ?? "What to order"}</h2>
                  <ul className="mt-3 divide-y divide-line">
                    {d.menu.map((m) => (
                      <li key={m.name} className="flex justify-between gap-6 py-3 text-[15px]">
                        <span>{m.name}</span>
                        <span className="tabular-nums text-muted">${m.price}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {more.length > 0 && (
            <section aria-labelledby="more-title" className="mt-20">
              <h2 id="more-title" className="font-serif text-[clamp(32px,3.6vw,46px)] font-normal leading-tight">More like this</h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((x) => (
                  <li key={x.id}>
                    <PlaceCard p={x} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
      <WaitlistPopup />
    </>
  );
}
