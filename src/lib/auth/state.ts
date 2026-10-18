"use client";

/*
 * The signed-in member and business sessions, for React. Both backends write
 * here; screens read it with useAuth(). The static HTML renders with
 * ready=false, so guarded screens never flash before the session is known.
 */
import { useSyncExternalStore } from "react";
import type { AuthState } from "./types";

const SERVER: AuthState = { ready: false, member: null, partner: null };
let state: AuthState = SERVER;
const listeners = new Set<() => void>();

export function setAuthState(next: AuthState) {
  if (JSON.stringify(next) === JSON.stringify(state)) return;
  state = next;
  listeners.forEach((l) => l());
}

export const getAuthState = () => state;

export function useAuthState() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => SERVER,
  );
}
