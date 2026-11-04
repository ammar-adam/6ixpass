"use client";

import { useEffect, useState } from "react";
import { waitlist as copy } from "@/content/site";
import { inviteLink, rpc, savedRef } from "@/lib/rpc";

type Status = { invites: number; goal: number };

// The personal invite link and how many friends have joined with it.
// Pass `email` right after joining (asks the database for the code), or
// `code` when it's already known (the /invite page).
export function InviteBox({ email, code: known }: { email?: string; code?: string }) {
  const c = copy.invite;
  const [code, setCode] = useState<string | null>(known ?? null);
  const [status, setStatus] = useState<Status | null>(null);
  const [copied, setCopied] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      let k = known ?? null;
      if (!k && email) {
        const { data } = await rpc<string>("waitlist_referral", { p_email: email, p_ref: savedRef() });
        k = data ?? null;
      }
      if (!live) return;
      if (!k) return setMissing(true);
      setCode(k);
      const { data } = await rpc<Status | null>("referral_status", { p_code: k });
      if (!live) return;
      if (data) setStatus(data);
      else if (known) setMissing(true);
    })();
    return () => {
      live = false;
    };
  }, [email, known]);

  if (missing) return <p className="mt-4 text-[15px] text-ink/80">{known ? c.pageMissing : c.already}</p>;
  if (!code) return null;

  const link = inviteLink(code);
  const goal = status?.goal ?? 3;
  const n = status?.invites ?? 0;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }
  async function onShare() {
    try {
      await navigator.share({ title: "The 6 Pass", text: c.shareText, url: link });
    } catch {
      /* cancelled */
    }
  }

  return (
    <div className="mt-5 rounded-[16px] border border-line bg-paper p-4">
      <p className="font-serif text-[22px] leading-tight">{c.title}</p>
      <p className="mt-1 text-[15px] text-ink/80">{c.text}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input readOnly value={link} aria-label="Your invite link" onFocus={(e) => e.currentTarget.select()} className="min-h-[44px] min-w-0 flex-1 rounded-full border border-[#9a8b7e] bg-white px-4 text-[14px]" />
        <div className="flex gap-2">
          <button type="button" onClick={onCopy} className="min-h-[44px] flex-1 rounded-full bg-accent px-5 text-[15px] font-semibold text-white hover:bg-accent-2">
            {copied ? c.copied : c.copy}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button type="button" onClick={onShare} className="min-h-[44px] flex-1 rounded-full border border-line bg-white px-5 text-[15px] font-semibold hover:border-ink/30">
              {c.share}
            </button>
          )}
        </div>
      </div>
      {status && (
        <div className="mt-4" aria-live="polite">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: goal }, (_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${i < n ? "bg-ok" : "bg-mist-2"}`} />
            ))}
          </div>
          <p className="mt-2 text-[14px] font-semibold">{n >= goal ? c.done : c.progress(n, goal)}</p>
        </div>
      )}
    </div>
  );
}
