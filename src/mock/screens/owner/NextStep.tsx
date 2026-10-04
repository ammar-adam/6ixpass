"use client";

import Link from "next/link";
import { CaretLeft, EnvelopeSimple } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { useMock } from "../../store";
import { C, Guide, label, serif } from "../../ui";
import { COSTS, NOTICE } from "./Dashboard";
import { NewMeeting } from "./NewMeeting";

/** The hand-off: terms to read later (QR and short link to /owners) and the email to say yes. */
export function NextStep({ qrSvg, shortLink, url }: { qrSvg: string; shortLink: string; url: string }) {
  const s = useMock();
  const name = s.owner?.name?.trim();
  const subject = encodeURIComponent(`Founding Partner${name ? `: ${name}` : ""}`);
  return (
    <div className="m-enter pb-32">
      <Guide>Let the owner scan this to read the terms on their own phone.</Guide>
      <div className="px-5 pt-3">
        <Link href="/app/owner" className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-full px-2 text-[15px] font-semibold" style={{ color: C.soft }}>
          <CaretLeft size={18} weight="bold" aria-hidden="true" />
          Dashboard
        </Link>
        <h1 className="mt-3 text-[38px] leading-none" style={serif}>Next step</h1>
        <p className="mt-3 text-[17px]" style={{ color: C.soft }}>Email {site.email} to become a Founding Partner.</p>
        <a href={`mailto:${site.email}?subject=${subject}`} className="m-press mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
          <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
          Email {site.email}
        </a>

        <section className="mt-8 flex items-center gap-5 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }} aria-labelledby="qr-h">
          {/* Drawn at build time from a fixed address, so it works offline. */}
          <div className="size-[128px] shrink-0 overflow-hidden rounded-[14px] bg-white p-1.5" role="img" aria-label={`QR code for ${shortLink}`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div className="min-w-0">
            <h2 id="qr-h" className={label} style={{ color: C.ice }}>Read the terms later</h2>
            <p className="mt-2 text-[15px]" style={{ color: C.soft }}>Scan with the phone camera, or type</p>
            <a href={url} className="mt-1 block break-all text-[17px] font-bold underline underline-offset-4">{shortLink}</a>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] p-5" style={{ background: "rgba(124,226,164,0.1)" }} aria-labelledby="cost-h">
          <h2 id="cost-h" className={label} style={{ color: C.ok }}>What it costs</h2>
          <p className="mt-2 text-[20px] leading-snug" style={serif}>{COSTS}</p>
          <p className="mt-2 text-[14px]" style={{ color: C.soft }}>{NOTICE}</p>
        </section>

        <h2 className={`${label} mt-10`} style={{ color: C.muted }}>After the meeting</h2>
        <div className="mt-3">
          <NewMeeting />
        </div>
      </div>
    </div>
  );
}
