"use client";

import { useEffect, useState } from "react";
import { partnerWall as c } from "@/content/site";
import { rpc } from "@/lib/rpc";

export type WallRow = { id: number; name: string; area: string; kind: string; offer: string; photo_url: string | null; link: string | null };

// Real Founding Partners from the database (partner_wall in
// docs/app/SUPABASE-GROWTH.sql). Shows nothing until at least one is published.
export function PartnerWall({ className = "" }: { className?: string }) {
  const [rows, setRows] = useState<WallRow[]>([]);
  useEffect(() => {
    let live = true;
    rpc<WallRow[]>("partner_wall").then(({ data }) => live && data && setRows(data));
    return () => {
      live = false;
    };
  }, []);
  if (!rows.length) return null;

  return (
    <section aria-labelledby="wall-title" className={className}>
      <div className="wrap">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">{c.eyebrow}</p>
        <h2 id="wall-title" className="mt-3 font-serif text-[clamp(38px,4.4vw,60px)] font-normal leading-[1.02] tracking-[-0.015em]">{c.title}</h2>
        <p className="mt-4 max-w-[46ch] text-[17px] text-ink/75">{c.text}</p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <li key={r.id} className="overflow-hidden rounded-[24px] border border-line bg-[#fffaf4] shadow-card">
              {r.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- photos uploaded at /admin
                <img src={r.photo_url} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div aria-hidden="true" className="grid aspect-[4/3] place-items-center bg-[linear-gradient(120deg,#f8e1cf,#f3c9a6)] font-serif text-[34px] text-copper">{r.name}</div>
              )}
              <div className="p-5">
                <p className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                  <span className="rounded-full bg-night px-2.5 py-0.5 text-[12px] font-semibold text-white">{c.eyebrow.replace(/s$/, "")}</span>
                  {r.kind} · {r.area}
                </p>
                <h3 className="mt-2 font-serif text-[26px] leading-tight">{r.name}</h3>
                <p className="mt-1 text-[15px] font-semibold text-copper">{r.offer}</p>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noopener" className="mt-2 inline-block text-[14px] font-semibold underline underline-offset-4">
                    {c.visit} <span className="sr-only">{r.name}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
