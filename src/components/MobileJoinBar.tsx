"use client";

import { useEffect, useState } from "react";
import { mobileBar } from "@/content/site";
import { getItem, JOINED_EVENT, JOINED_KEY, OPEN_WAITLIST_EVENT } from "@/lib/storage";

/*
 * Phones only: a slim "Join the waitlist" bar at the bottom of the screen.
 * It shows once the hero form has scrolled away, hides again while any
 * waitlist form or the footer is on screen, and never shows after joining.
 */
export function MobileJoinBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getItem(JOINED_KEY) === "1") return;
    const hero = document.getElementById("join");
    const watched = [hero, ...Array.from(document.querySelectorAll("footer, [data-waitlist-cta]"))].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    let pastHero = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
        if (e.target === hero && !e.isIntersecting && e.boundingClientRect.top < 0) pastHero = true;
        if (e.target === hero && e.isIntersecting) pastHero = false;
      }
      setShow(pastHero && visible.size === 0);
    });
    watched.forEach((el) => io.observe(el));
    const joined = () => {
      io.disconnect();
      setShow(false);
    };
    window.addEventListener(JOINED_EVENT, joined);
    return () => {
      io.disconnect();
      window.removeEventListener(JOINED_EVENT, joined);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-sm leading-snug text-muted">{mobileBar.text}</p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_WAITLIST_EVENT))}
          className="min-h-[44px] shrink-0 rounded-full bg-ink px-5 text-[15px] font-semibold text-white"
        >
          {mobileBar.button}
        </button>
      </div>
    </div>
  );
}
