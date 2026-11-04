/*
 * Calls the database functions in docs/app/SUPABASE-GROWTH.sql with the
 * public key, without loading supabase-js. Every rule is enforced in the
 * database; this only sends the arguments.
 */
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const REF_KEY = "t6p_ref";

export async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<{ data: T | null; error: string | null }> {
  if (!URL_ || !KEY) return { data: null, error: "not_configured" };
  try {
    const res = await fetch(`${URL_}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : null;
    if (!res.ok) return { data: null, error: (body && (body.message as string)) || String(res.status) };
    return { data: body as T, error: null };
  } catch {
    return { data: null, error: "network" };
  }
}

/** Remembers ?ref=CODE from the first page someone lands on, for the tab. */
export function rememberRef() {
  try {
    const ref = new URLSearchParams(window.location.search).get("ref")?.trim().toLowerCase();
    if (ref && /^[a-z0-9]{8}$/.test(ref)) window.sessionStorage.setItem(REF_KEY, ref);
  } catch {
    /* ignore */
  }
}

export function savedRef(): string | null {
  try {
    return window.sessionStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

export const inviteLink = (code: string) => `https://the6pass.ca/?ref=${code}`;
