"use client";

import { Capacitor } from "@capacitor/core";
import { LiveLink } from "./LiveLink";
import { useLiveSettings } from "./live";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthBoot, useAuth } from "@/lib/auth";
import { usePartnerRole } from "./Guard";
import { useBrowsing } from "./screens/Home";
import { IExplore, IHome, IList, IPass, IScan, IStore, ITeam } from "./icons";

type Tab = { href: string; label: string; Icon: typeof IExplore; match: (p: string) => boolean };

const MEMBER_TABS: Tab[] = [
  { href: "/app", label: "Explore", Icon: IExplore, match: (p: string) => p === "/app" },
  { href: "/app/pass", label: "My pass", Icon: IPass, match: (p: string) => p.startsWith("/app/pass") },
];
// The meeting demo's owner view. Onboarding (/app/owner/setup) is full screen, so it has no tab bar.
const MEETING_OWNER: Tab = { href: "/app/owner", label: "Owner", Icon: IStore, match: (p: string) => p === "/app/owner" || p.startsWith("/app/owner/next") };

// The business side, signed in for real: owners get the dashboard and the team, staff get Scan and Today.
const SCAN: Tab = { href: "/app/business/scan", label: "Scan", Icon: IScan, match: (p) => p === "/app/business/scan" || p === "/app/staff" };
const TODAY: Tab = { href: "/app/business/today", label: "Today", Icon: IList, match: (p) => p === "/app/business/today" };
const OWNER_TABS: Tab[] = [{ href: "/app/owner", label: "Dashboard", Icon: IHome, match: (p) => p === "/app/owner" }, SCAN, TODAY, { href: "/app/business/team", label: "Team", Icon: ITeam, match: (p) => p === "/app/business/team" }];
const STAFF_TABS: Tab[] = [SCAN, TODAY];

const BUSINESS_AREA = /^\/app\/(owner$|business\/(scan|today|team)$|staff$)/;

/** The phone's status bar, only drawn inside the laptop frame. White over a photo. */
function StatusBar({ light }: { light: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-50 hidden h-[54px] items-center justify-between pl-[42px] pr-[34px] pt-[6px] text-[16px] font-semibold md:flex" style={{ color: light ? "#fff" : "#16140F", letterSpacing: "-0.01em" }}>
      <span className="tnum">9:41</span>
      <span className="absolute left-1/2 top-[11px] h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 4.2a10 10 0 0 1 14 0M3.6 6.9a6.3 6.3 0 0 1 8.8 0" /><circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4" /><rect x="2.5" y="2.5" width="19" height="8" rx="2" fill="currentColor" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45" /></svg>
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = (usePathname() || "/app").replace(/\/$/, "") || "/app";
  // Two phones: the member's phone is only the member app; the owner view lives on the staff phone.
  const memberPhone = useLiveSettings()?.role === "member";
  const a = useAuth();
  const browsing = useBrowsing();
  const role = usePartnerRole();
  let tabs: Tab[];
  if (a.partner && !a.partner.demo && BUSINESS_AREA.test(path)) tabs = role === "owner" ? OWNER_TABS : STAFF_TABS;
  else if (a.member || browsing) tabs = a.partner?.demo && !memberPhone ? [...MEMBER_TABS, MEETING_OWNER] : MEMBER_TABS;
  else tabs = path === "/app/owner" && a.partner?.demo ? [...MEMBER_TABS, MEETING_OWNER] : [];
  const showTabs = a.ready && tabs.some((t) => t.match(path));
  // These screens start with a full-bleed photo, so the status bar goes white.
  const overPhoto = /^\/app\/(place|redeem)\//.test(path);

  // Each screen starts at the top, like a real app.
  useEffect(() => {
    document.getElementById("app-scroll")?.scrollTo(0, 0);
  }, [path]);

  // The service worker makes "Add to Home Screen" open like an app, and keeps
  // the demo working with no signal. It only looks after /app, /partners-demo
  // and their files (see src/app/app-sw.js/route.ts).
  useEffect(() => {
    // The iPhone app ships every file inside it, so it doesn't need (or support) the offline worker.
    if ("serviceWorker" in navigator && !Capacitor.isNativePlatform()) navigator.serviceWorker.register("/app-sw.js", { scope: "/" }).catch(() => {});
  }, []);

  return (
    <div
      className="app-mock min-h-dvh md:grid md:place-items-center md:py-6"
      style={{ background: "radial-gradient(1200px 700px at 50% 30%, #F3F1ED 0%, #E6E2DC 60%, #DCD7D0 100%)" }}
    >
      <div
        id="app-frame"
        className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden md:h-[min(844px,calc(100dvh-48px))] md:w-[390px] md:rounded-[56px]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.5), 0 0 0 11px #121212, 0 0 0 12.5px #4a4845, 0 0 0 14px #2a2927, 0 40px 80px -30px rgba(40,32,20,0.55), 0 80px 120px -60px rgba(40,32,20,0.35)",
        }}
      >
        <AuthBoot />
        <LiveLink />
        <StatusBar light={overPhoto} />

        <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col outline-none">
          <div id="app-scroll" className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </main>

        {showTabs && (
          <nav aria-label="App" className="tabbar blur-bar">
            <ul className={`grid px-2 ${["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"][tabs.length]}`}>
              {tabs.map(({ href, label, Icon, match }) => {
                const on = match(path);
                return (
                  <li key={href}>
                    <Link href={href} aria-current={on ? "page" : undefined} className="tab">
                      <Icon strokeWidth={on ? 2 : 1.6} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Home indicator, laptop frame only. */}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-[8px] left-1/2 z-50 hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full md:block" style={{ background: overPhoto ? "rgba(22,20,15,0.85)" : "#16140F" }} />
      </div>

      <p className="pointer-events-none fixed bottom-5 left-6 hidden max-w-[220px] text-[12px] leading-snug lg:block" style={{ color: "#6E685E" }}>
        The 6 Pass · Demo. Places shown are examples.
      </p>
    </div>
  );
}
