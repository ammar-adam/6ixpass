"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ownersPage } from "@/content/owners";

// The sub-menu across the owner pages.
export function OwnersNav() {
  const path = usePathname().replace(/\/$/, "") || "/";
  return (
    <nav aria-label="For business owners" className="no-scrollbar -mx-4 overflow-x-auto px-4 [mask-image:linear-gradient(90deg,#000_85%,transparent)] sm:[mask-image:none]">
      <ul className="flex w-max gap-2 rounded-full border border-line bg-white/70 p-1.5 text-[14px] font-semibold shadow-card">
        {ownersPage.nav.map((n) => {
          const on = !n.href.includes("#") && path === n.href;
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`inline-flex min-h-[40px] items-center rounded-full px-4 ${on ? "bg-night text-white" : n.href.includes("#") ? "bg-accent text-white hover:bg-accent-2" : "hover:bg-mist"}`}
              >
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
