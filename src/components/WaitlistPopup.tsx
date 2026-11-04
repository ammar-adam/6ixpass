"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { waitlist as copy } from "@/content/site";
import { WaitlistForm } from "./WaitlistForm";
import {
  getItem,
  setItem,
  JOINED_EVENT,
  JOINED_KEY,
  OPEN_WAITLIST_EVENT,
  SNOOZE_KEY,
} from "@/lib/storage";
import { track } from "@/lib/analytics";

const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
 * Opens only when someone presses a "Join the waitlist" button. It used to
 * open by itself; Nida asked for that to stop (Nov 3, 2026).
 */
export function WaitlistPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formKey, setFormKey] = useState(0);
  // Only jump into the email field when someone asked for the popup.
  // On an automatic open that would throw a phone keyboard at them.
  const [byButton, setByButton] = useState(false);
  const joinedNow = useRef(false);

  const open = useCallback((reason: "auto" | "button") => {
    const d = ref.current;
    if (!d || d.open) return;
    joinedNow.current = false;
    setMounted(true);
    setByButton(reason === "button");
    d.showModal();
    // The browser would focus the close button and draw a ring round it. On an
    // automatic open, focus the popup itself instead (still inside it for Tab).
    if (reason === "auto") d.querySelector<HTMLElement>("[data-popup-body]")?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    track("waitlist_popup_open", { reason });
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  // After any close: unlock scroll, and snooze if they didn't join.
  const onClose = useCallback(() => {
    document.documentElement.style.overflow = "";
    if (!joinedNow.current && getItem(JOINED_KEY) !== "1") {
      setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
    }
    setFormKey((k) => k + 1);
  }, []);

  // No automatic opening (Nida, Nov 3): the popup only opens from a "Join the waitlist" button.

  // Buttons elsewhere on the page.
  useEffect(() => {
    const onOpen = () => open("button");
    window.addEventListener(OPEN_WAITLIST_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WAITLIST_EVENT, onOpen);
  }, [open]);

  // Keep Tab inside the popup.
  function onKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab" || !ref.current) return;
    const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      ref={ref}
      className="waitlist-dialog"
      aria-labelledby="waitlist-popup-title"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // A click on the dimmed area outside the box closes it.
        if (e.target === ref.current) close();
      }}
    >
      <div className="relative outline-none" tabIndex={-1} data-popup-body>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-card hover:bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="grid md:grid-cols-[0.95fr_1.05fr]">
          {/* The benefit first: photo, headline and what you get. */}
          <div className="on-dark relative isolate overflow-hidden px-6 pb-6 pt-14 text-white md:px-8 md:pb-8 md:pt-10">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img src={`${copy.popupImage.src}-640.webp`} alt={copy.popupImage.alt} width={640} height={427} className="absolute inset-0 -z-10 size-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(30_23_19/0.55)_0%,rgb(30_23_19/0.88)_70%)]" />
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-peach">{copy.popupLabel}</p>
            <h2 id="waitlist-popup-title" className="mt-2 font-serif text-[clamp(34px,4vw,44px)] font-normal leading-[1.02]">
              {copy.popupTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/85">{copy.popupText}</p>
            <ul className="mt-5 hidden gap-2.5 text-[15px] sm:grid">
              {copy.popupPerks.map((perk) => (
                <li key={perk} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 6.2l2.3 2.3 4.7-5" />
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 md:p-8">
            <p className="mb-4 font-serif text-[26px] leading-tight">{copy.popupFormTitle}</p>
            {mounted && (
              <WaitlistForm
                key={formKey}
                placement="popup"
                autoFocus={byButton}
                onDone={() => {
                  joinedNow.current = true;
                }}
              />
            )}
            <p className="mt-3 text-[13px] text-muted">{copy.popupFormNote}</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function OpenWaitlistButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_WAITLIST_EVENT))}
    >
      {children}
    </button>
  );
}
