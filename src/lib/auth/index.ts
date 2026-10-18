"use client";

/*
 * The one door to accounts. Screens call `auth.signIn(...)` and friends and
 * read the sessions with `useAuth()`; they never know which backend is on.
 *
 *   NEXT_PUBLIC_AUTH_MODE unset or "local"  accounts on this device (demo)
 *   NEXT_PUBLIC_AUTH_MODE=supabase          real accounts (docs/app/ACCOUNTS.md)
 *
 * Nida's meeting demo always runs on the device accounts, in either mode.
 */
import { useEffect } from "react";
import { localBackend, localDemoActive, startLocalDemo } from "./local";
import { useAuthState } from "./state";
import type { AuthBackend } from "./types";

export const AUTH_MODE: "local" | "supabase" =
  process.env.NEXT_PUBLIC_AUTH_MODE === "supabase" && !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "supabase" : "local";

let remote: Promise<AuthBackend> | null = null;
async function active(): Promise<AuthBackend> {
  if (AUTH_MODE !== "supabase" || localDemoActive()) return localBackend;
  // Only builds with real accounts on include supabase-js at all (the condition is fixed at build time).
  remote ??= import("@/lib/auth/remote").then((m) => m.supabaseBackend ?? localBackend);
  return remote;
}

type Methods = Omit<AuthBackend, "mode">;
/** Every call goes to whichever backend is in charge right now. */
export const auth: Methods = new Proxy({} as Methods, {
  get:
    (_, key: string) =>
    async (...args: unknown[]) => {
      const b = await active();
      return (b[key as keyof Methods] as (...a: unknown[]) => unknown)(...args);
    },
});

/** True when this device is on demo accounts (local mode, or the meeting demo). */
export const onDemoAccounts = () => AUTH_MODE === "local" || localDemoActive();

export function useAuth() {
  return useAuthState();
}

/** Mounted once in the app shell: reads the saved sessions. */
export function AuthBoot() {
  useEffect(() => {
    void auth.init();
  }, []);
  return null;
}

/** /partners-demo: Nida's meeting runs signed in as the demo member and the place's owner, with no typing. */
export async function startDemo() {
  startLocalDemo();
  await localBackend.init();
}

export * from "./types";
export { DEMO_MEMBER, DEMO_OWNER, DEMO_PASSWORD, DEMO_STAFF } from "./local";

/** Nida's tools (/partners-demo, Two phones, Set up a place) run on the meeting demo's accounts. */
export function useMeetingDemo() {
  useEffect(() => {
    if (!localDemoActive()) void startDemo();
  }, []);
}
