"use client";

/*
 * /app. Signed in: Explore. Signed out: the landing screen, unless they chose
 * to look around first (then Explore, with Sign in at the top).
 */
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/lib/auth";
import { Explore } from "./Explore";
import { Landing } from "./account/Landing";

const KEY = "t6p_browse";
const EVENT = "t6p-browse";
const read = () => {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const subscribe = (l: () => void) => {
  window.addEventListener(EVENT, l);
  return () => window.removeEventListener(EVENT, l);
};
export function setBrowsing(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(KEY, "1");
    else window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}
export const useBrowsing = () => useSyncExternalStore(subscribe, read, () => false);

export function Home() {
  const a = useAuth();
  const browsing = useBrowsing();
  const router = useRouter();
  const setup = a.ready && a.member && !a.member.onboarded;
  useEffect(() => {
    if (setup) router.replace("/app/account/setup");
  }, [setup, router]);
  if (!a.ready || setup) return <div className="min-h-full" aria-busy="true" />;
  if (a.member) return <Explore />;
  if (browsing) return <Explore guest />;
  return <Landing onBrowse={() => setBrowsing(true)} />;
}
