"use client";

import { useEffect } from "react";

/*
 * A link to a section on the page you're already on (like "/#how" from the
 * home page) should always scroll there, even when the address already ends
 * in that #. Browsers and Next.js do nothing in that case.
 */
export function HashLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      // "#join" opens the waitlist popup instead (WaitlistPopup).
      if (!a || !a.hash || a.hash === "#join" || a.origin !== location.origin) return;
      const here = location.pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/";
      const there = a.pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/";
      if (here !== there) return;
      const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", a.hash);
    };
    // Capture, so this runs before Next.js's own link handling.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
