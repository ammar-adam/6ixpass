"use client";

import { useEffect } from "react";

/*
 * Fades sections up as they scroll into view. Anything marked data-reveal
 * starts hidden only once this has run, so without JavaScript (or with
 * reduced motion) everything is simply there.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-stagger]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px 15% 0px", threshold: 0 },
    );
    // Only hide what is still below the fold, so nothing on screen blinks.
    const fold = window.innerHeight;
    for (const el of els) {
      if (el.getBoundingClientRect().top < fold) continue;
      el.classList.add(el.hasAttribute("data-stagger") ? "stagger" : "reveal");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
