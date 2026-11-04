"use client";

import { useRef } from "react";
import { getApp } from "@/content/site";

// "Get the app": a small dialog with a QR code to the web app. The store
// badges say coming soon, because the apps aren't in the stores yet.
export function GetApp({ qr, className }: { qr: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        {getApp.button}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="get-app-title"
        className="waitlist-dialog max-w-[420px]!"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
      >
        <div className="relative p-6 text-center sm:p-8">
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="absolute right-3 top-3 grid size-11 place-items-center rounded-full hover:bg-mist">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h2 id="get-app-title" className="font-serif text-[30px] leading-tight">{getApp.title}</h2>
          <p className="mx-auto mt-2 max-w-[30ch] text-[15px] text-ink/75">{getApp.text}</p>
          <div className="mx-auto mt-5 w-[200px] rounded-2xl bg-white p-3 shadow-card" role="img" aria-label={`QR code for ${getApp.url}`} dangerouslySetInnerHTML={{ __html: qr }} />
          <a href={getApp.url} className="mt-4 inline-block text-[15px] font-semibold underline underline-offset-4">
            the6pass.ca/app
          </a>
          <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
            <StoreBadge top="Download on the" name="App Store" />
            <StoreBadge top="Get it on" name="Google Play" />
          </div>
          <p className="mt-3 text-[13px] text-muted">{getApp.soon}</p>
        </div>
      </dialog>
    </>
  );
}

// A plain store-style badge, greyed out until the apps are live.
export function StoreBadge({ top, name, dark = true }: { top: string; name: string; dark?: boolean }) {
  return (
    <span className={`relative inline-flex h-11 items-center gap-2 rounded-xl px-3 ${dark ? "bg-night/60 text-white" : "border border-white/25 text-white/60"}`}>
      <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Soon</span>
      {name === "App Store" ? (
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path d="M3.6 2.3l10.6 10.6L3.6 23.5c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" fill="#4ade80" />
          <path d="M17.6 9.5l-3.4 3.4 3.4 3.4 3.8-2.2c.9-.5.9-1.9 0-2.4l-3.8-2.2z" fill="#facc15" />
          <path d="M3.6 2.3c.3-.2.8-.2 1.2 0l12.8 7.2-3.4 3.4L3.6 2.3z" fill="#60a5fa" />
          <path d="M14.2 12.9l3.4 3.4-12.8 7.2c-.4.2-.9.2-1.2 0l10.6-10.6z" fill="#f87171" />
        </svg>
      )}
      <span className="text-left leading-none">
        <span className="block text-[9px]">{top}</span>
        <span className="block text-[14px] font-semibold">{name}</span>
      </span>
    </span>
  );
}
