"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";

// The main links, with the current section underlined.
export function HeaderNav() {
  const path = usePathname().replace(/\/$/, "") || "/";
  return (
    <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
      {nav.map((n) => {
        const base = n.href.split("#")[0];
        const on = base !== "/" && (path === base || path.startsWith(base + "/"));
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={on ? "page" : undefined}
            className={`underline-offset-[6px] hover:underline ${on ? "text-ink underline decoration-accent decoration-2" : "text-ink-2"}`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
