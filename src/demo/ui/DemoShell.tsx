"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { actions, getPlace, useDemo } from "../store";
import { Wordmark } from "@/components/Wordmark";

const memberTabs = [
  { href: "/demo", label: "Explore", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/demo/pass", label: "My pass", icon: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM7 15h4" },
];
const staffTabs = [
  { href: "/demo/staff", label: "Redemptions", icon: "M4 12l5 5L20 6" },
  { href: "/demo/offer", label: "Your offer", icon: "M4 7h10M4 17h6M18 7h2M14 17h6M14 4v6M10 14v6" },
];

export function DemoShell({ children }: { children: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "") || "/demo";
  const staff = path.startsWith("/demo/staff") || path.startsWith("/demo/offer");
  const s = useDemo();
  const tabs = staff ? staffTabs : memberTabs;
  const active = s.active?.status === "issued" ? s.active : null;
  const activePlace = active ? getPlace(s, active.slug) : null;

  return (
    <div className={`mx-auto flex min-h-dvh max-w-[480px] flex-col ${staff ? "bg-white" : "bg-mist"} sm:my-6 sm:min-h-[calc(100dvh-48px)] sm:overflow-hidden sm:rounded-[32px] sm:shadow-[0_30px_80px_-40px_rgba(15,46,51,0.5)]`}>
      <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2 text-[13px] text-mist">
        <p>Demo. Places shown are examples.</p>
        <button type="button" onClick={() => actions.reset()} className="shrink-0 rounded-md px-2 py-1 font-semibold underline underline-offset-2 hover:bg-white/10">
          Reset demo
        </button>
      </div>

      <header className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
        <Link href="/demo" className="rounded-md">
          <Wordmark className="text-[22px]" />
        </Link>
        <Link
          href={staff ? "/demo" : "/demo/staff"}
          className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${staff ? "bg-mist text-ink" : "bg-white text-ink"}`}
        >
          {staff ? "Back to member view" : "See what your staff see"}
        </Link>
      </header>

      {staff && (
        <p className="mx-4 mb-1 rounded-xl bg-peach-soft px-3 py-2 text-[13px] font-medium">
          Staff view. This is what the team at the front desk sees.
        </p>
      )}

      {!staff && active && activePlace && !path.startsWith(`/demo/place/${active.slug}`) && (
        <Link href={`/demo/place/${active.slug}`} className="mx-4 mb-1 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white">
          <span>Code ready at {activePlace.name}</span>
          <span className="font-mono tracking-widest text-peach">{active.code}</span>
        </Link>
      )}

      <main id="main" className="flex-1 px-4 pb-28 pt-2">
        {children}
      </main>

      <nav aria-label="Demo" className="sticky bottom-0 mt-auto border-t border-ink/10 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 backdrop-blur">
        <ul className="grid grid-cols-2 gap-2">
          {tabs.map((t) => {
            const on = path === t.href;
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-semibold ${on ? "bg-mist text-ink" : "text-muted"}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={t.icon} />
                  </svg>
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
