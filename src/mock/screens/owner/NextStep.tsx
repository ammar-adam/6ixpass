"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { useMock } from "../../store";
import { IBack, IMail } from "../../icons";
import { NavBar } from "../../ui";
import { FOUNDING, FOUNDING_NEXT } from "./Dashboard";
import { NewMeeting } from "./NewMeeting";

/** The hand-off: terms to read later (QR and short link to /owners) and the email to say yes. */
export function NextStep({ qrSvg, shortLink, url }: { qrSvg: string; shortLink: string; url: string }) {
  const s = useMock();
  const name = s.owner?.name?.trim();
  const subject = encodeURIComponent(`Founding Partner${name ? `: ${name}` : ""}`);
  return (
    <div className="a-push pb-28">
      <NavBar
        left={
          <Link href="/app/owner" className="navtext -ml-1">
            <IBack size={22} />
            Dashboard
          </Link>
        }
      />
      <header className="m pt-1">
        <h1 className="t-large">Next step</h1>
        <p className="t-sub mt-1.5 text-[17px] leading-[1.4]">Email {site.email} to become a Founding Partner.</p>
      </header>

      <div className="m mt-5">
        <a href={`mailto:${site.email}?subject=${subject}`} className="btn press">
          <IMail />
          Email {site.email}
        </a>
      </div>

      <section className="m mt-8" aria-labelledby="qr-h">
        <div className="group flex items-center gap-5 p-4">
          {/* Drawn at build time from a fixed address, so it works offline. */}
          <div className="size-[120px] shrink-0 overflow-hidden rounded-[10px] bg-white p-1" style={{ boxShadow: "inset 0 0 0 0.5px var(--line)" }} role="img" aria-label={`QR code for ${shortLink}`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div className="min-w-0">
            <h2 id="qr-h" className="eyebrow accent">Read about it later</h2>
            <p className="t-sub mt-1.5">Scan with the phone camera, or type</p>
            <a href={url} className="mt-1 block break-all text-[16px] font-semibold underline underline-offset-4">
              {shortLink}
            </a>
          </div>
        </div>
      </section>

      <section className="m mt-4" aria-labelledby="founding-h">
        <div className="group p-4">
          <h2 id="founding-h" className="eyebrow accent">Becoming a Founding Partner</h2>
          <p className="mt-1.5 text-[16px] leading-[1.4]">{FOUNDING}</p>
          <p className="t-foot mt-1.5">{FOUNDING_NEXT} Reply to the email and we&apos;ll send it over to look at.</p>
        </div>
      </section>

      <div className="section-h">
        <h2 className="t-title">After the meeting</h2>
      </div>
      <div className="m mt-3">
        <NewMeeting />
      </div>
    </div>
  );
}
