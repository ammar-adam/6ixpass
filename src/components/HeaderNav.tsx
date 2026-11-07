"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";

// The main links. A click on a label goes to that section; hovering or the
// arrow opens a small menu. The current section is underlined.
export function HeaderNav() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <nav ref={ref} aria-label="Main" className="hidden items-center gap-1 text-[15px] font-medium lg:flex">
      {nav.map((n) => {
        const base = n.href.split("#")[0];
        const on = base !== "/" && n.items.some((i) => {
          const b = i.href.split("#")[0];
          return b !== "/" && (path === b || path.startsWith(b + "/"));
        });
        const isOpen = open === n.label;
        return (
          <div key={n.label} className="relative" onMouseEnter={() => setOpen(n.label)} onMouseLeave={() => setOpen(null)}>
            <div className={`flex items-center rounded-full hover:bg-white/70 ${on ? "text-ink" : "text-ink-2"}`}>
              {/* The label goes straight to the section; the arrow opens the menu. */}
              <Link
                href={n.href}
                onClick={() => setOpen(null)}
                className={`flex min-h-[44px] items-center pl-3.5 pr-1 ${on ? "underline decoration-accent decoration-2 underline-offset-[6px]" : ""}`}
              >
                {n.label}
              </Link>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={`More in ${n.label}`}
                onClick={() => setOpen(isOpen ? null : n.label)}
                className="grid min-h-[44px] place-items-center pl-1 pr-3"
              >
                <svg aria-hidden="true" viewBox="0 0 12 12" className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4.5L6 7.5L9 4.5" />
                </svg>
              </button>
            </div>
            {/* pt-2 keeps the hover alive across the gap. */}
            <div className={`absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2 ${isOpen ? "block" : "hidden"}`}>
              <ul className="w-[300px] rounded-[20px] border border-line bg-paper p-2 shadow-[0_2px_4px_rgb(42_31_25/0.06),0_24px_48px_-20px_rgb(42_31_25/0.35)]">
                {n.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} onClick={() => setOpen(null)} className="block rounded-xl px-4 py-3 hover:bg-mist">
                      <span className="block font-semibold text-ink">{i.label}</span>
                      <span className="mt-0.5 block text-[13px] font-normal text-muted">{i.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
