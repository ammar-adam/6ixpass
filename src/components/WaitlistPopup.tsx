"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { waitlist as copy } from "@/content/site";
import { WaitlistForm } from "./WaitlistForm";
import {
  getItem,
  JOINED_EVENT,
  JOINED_KEY,
  OPEN_WAITLIST_EVENT,
} from "@/lib/storage";
import { track } from "@/lib/analytics";

const SEEN_KEY = "t6p_popup_seen";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
 * Opens by itself once per visit (after a few seconds, or a third of the way
 * down the page), never once someone has joined, and from any "Join the
 * waitlist" button. Ammar, Nov 4, 2026: "add a popup each time".
 */
export function WaitlistPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const [formKey, setFormKey] = useState(0);
  const joinedNow = useRef(false);

  const open = useCallback((reason: "auto" | "button") => {
    const d = ref.current;
    if (!d || d.open) return;
    joinedNow.current = false;
    // Once it has been seen this visit, it won't open again by itself.
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    d.showModal();
    // Only jump into the email field when someone asked for the popup.
    // On an automatic open that would throw a phone keyboard at them.
    if (reason === "button") d.querySelector<HTMLElement>("input[type=email]")?.focus();
    // The browser would focus the close button and draw a ring round it. On an
    // automatic open, focus the popup itself instead (still inside it for Tab).
    if (reason === "auto") d.querySelector<HTMLElement>("[data-popup-body]")?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    track("waitlist_popup_open", { reason });
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  // After any close: unlock scroll.
  const onClose = useCallback(() => {
    document.documentElement.style.overflow = "";
    setFormKey((k) => k + 1);
  }, []);

  // Automatic opening, once per visit (this browser tab).
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen || getItem(JOINED_KEY) === "1") return;
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      cleanup();
      // Don't interrupt someone typing in a form on the page, or reopen it.
      if (document.activeElement?.closest("form") || getItem(JOINED_KEY) === "1") return;
      try {
        if (window.sessionStorage.getItem(SEEN_KEY) === "1") return;
      } catch {
        /* ignore */
      }
      open("auto");
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.33) fire();
    };
    const timer = window.setTimeout(fire, 6000);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(JOINED_EVENT, cleanup);
    function cleanup() {
      done = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(JOINED_EVENT, cleanup);
    }
    return cleanup;
  }, [open]);

  // Buttons elsewhere on the page.
  useEffect(() => {
    const onOpen = () => open("button");
    window.addEventListener(OPEN_WAITLIST_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WAITLIST_EVENT, onOpen);
  }, [open]);

  // "/#join" links (footer, invite page, old /places links) open the popup:
  // on arrival with #join in the address, and on a click on any page that has it.
  useEffect(() => {
    if (window.location.hash === "#join") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      open("button");
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hash !== "#join" || a.origin !== window.location.origin) return;
      e.preventDefault();
      e.stopPropagation();
      open("button");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
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
        <div className="grid md:grid-cols-[1fr_1fr]">
          {/* The benefit first: a photo, the promise and what you get. */}
          <div className="on-dark relative isolate flex flex-col justify-end overflow-hidden px-6 pb-6 pt-16 text-white md:min-h-[520px] md:px-8 md:pb-8">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img src={`${copy.popupImage.src}-1200.webp`} alt={copy.popupImage.alt} width={1200} height={800} className="absolute inset-0 -z-10 size-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(30_23_19/0.15)_0%,rgb(30_23_19/0.55)_45%,rgb(30_23_19/0.92)_100%)]" />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink md:left-6 md:top-6">{copy.popupLabel}</span>
            <span aria-hidden="true" className="absolute right-5 top-16 hidden items-center gap-2 rounded-2xl bg-white py-2 pl-2 pr-3.5 text-ink shadow-card md:flex">
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative */}
              <img src={`${copy.popupImage.src}-640.webp`} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
              <span className="leading-tight">
                <span className="block text-[11px] text-muted">{copy.popupChip.place}</span>
                <span className="block text-[13px] font-semibold">{copy.popupChip.offer}</span>
              </span>
            </span>
            <h2 id="waitlist-popup-title" className="font-serif text-[clamp(36px,4.4vw,50px)] font-normal leading-[1] text-balance">
              {copy.popupTitle}
            </h2>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-white/85">{copy.popupText}</p>
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
          <div className="flex flex-col justify-center p-6 md:p-9">
            <p className="font-serif text-[30px] leading-tight">{copy.popupFormTitle}</p>
            <p className="mb-5 mt-1 text-[15px] text-ink/75">{copy.popupFormText}</p>
            {/* Always in the page, so the consent wording ships in the HTML. */}
            <WaitlistForm
              key={formKey}
              placement="popup"
              onDone={() => {
                joinedNow.current = true;
              }}
            />
            <p className="mt-3 text-[13px] text-muted">{copy.popupFormNote}</p>
            <button type="button" onClick={close} className="mt-4 self-start text-[14px] font-medium text-muted underline underline-offset-4 hover:text-ink">
              {copy.popupLater}
            </button>
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
