"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Compass, Storefront, Wallet } from "@phosphor-icons/react";
import { copy } from "@/demo/data";
import { C } from "./ui";

const TABS = [
  { href: "/app", label: "Explore", Icon: Compass, match: (p: string) => p === "/app" },
  { href: "/app/pass", label: "My pass", Icon: Wallet, match: (p: string) => p.startsWith("/app/pass") },
  { href: "/app/partner", label: "Partner", Icon: Storefront, match: (p: string) => p.startsWith("/app/partner") },
];

/** A fake phone status bar, only drawn inside the desktop frame. */
function StatusBar() {
  return (
    <div aria-hidden="true" className="hidden h-11 shrink-0 items-center justify-between px-7 pt-1 text-[15px] font-semibold md:flex" style={{ color: C.text }}>
      <span className="tabular">9:41</span>
      <span className="absolute left-1/2 top-2.5 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 4.2a10 10 0 0 1 14 0M3.6 6.9a6.3 6.3 0 0 1 8.8 0M6.2 9.5a2.6 2.6 0 0 1 3.6 0" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity=".5" /><rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill="currentColor" /><rect x="24" y="4" width="1.5" height="4" rx=".75" fill="currentColor" opacity=".5" /></svg>
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = (usePathname() || "/app").replace(/\/$/, "") || "/app";
  const showTabs = TABS.some((t) => t.match(path));

  // Each screen starts at the top, like a real app.
  useEffect(() => {
    document.getElementById("app-scroll")?.scrollTo(0, 0);
  }, [path]);

  // Register the service worker that makes "Install app" work in Chrome and Edge.
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/app-sw.js", { scope: "/app" }).catch(() => {});
  }, []);

  return (
    <div className="app-mock min-h-dvh md:grid md:place-items-center md:py-8" style={{ background: "#05090f" }}>
      <div
        className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden md:h-[844px] md:w-[390px] md:rounded-[52px] md:shadow-[0_0_0_10px_#1b2333,0_0_0_12px_#2b3548,0_50px_100px_-30px_rgba(0,0,0,0.9)]"
        style={{ background: C.bg, color: C.text, fontFamily: "var(--f-figtree)" }}
      >
        <StatusBar />
        <p className="shrink-0 border-b px-5 py-1.5 text-center text-[12px] font-medium" style={{ borderColor: C.line, color: C.muted }}>
          {copy.banner}
        </p>

        <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col outline-none">
          <div id="app-scroll" className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </main>

        {showTabs && (
          <nav aria-label="App" className="absolute inset-x-4 bottom-[max(env(safe-area-inset-bottom),14px)] z-20 rounded-[26px] border px-2 py-1.5 backdrop-blur-xl md:bottom-6" style={{ background: "rgba(18,32,56,0.9)", borderColor: C.line }}>
            <ul className="grid grid-cols-3">
              {TABS.map(({ href, label, Icon, match }) => {
                const on = match(path);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={on ? "page" : undefined}
                      className="flex min-h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-semibold"
                      style={on ? { background: "rgba(169,209,255,0.14)", color: C.ice } : { color: C.muted }}
                    >
                      <Icon size={24} weight={on ? "fill" : "regular"} aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Home indicator, desktop frame only. */}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-1/2 hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/70 md:block" />
      </div>
    </div>
  );
}
