import { waitlist as copy } from "@/content/site";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ATTRIBUTION_KEY = "t6p_attribution";

export type JoinResult = "success" | "already" | "error";

export type JoinInput = {
  email: string;
  firstName?: string;
  neighbourhood?: string;
  consent: boolean;
};

type Attribution = { source: string; campaign: string | null };

/*
 * First-touch attribution, kept for the browser tab so that moving between
 * pages on our own site doesn't turn the source into "the6pass.ca".
 * source = utm_source, else the referring site's host, else "direct".
 */
export function getAttribution(): Attribution {
  try {
    const saved = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    /* ignore */
  }

  const params = new URLSearchParams(window.location.search);
  let source = params.get("utm_source")?.trim() || "";
  if (!source && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) source = host;
    } catch {
      /* ignore */
    }
  }
  const result: Attribution = {
    source: (source || "direct").slice(0, 200),
    campaign: params.get("utm_campaign")?.trim().slice(0, 200) || null,
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(result));
  } catch {
    /* ignore */
  }
  return result;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validEmail(email: string) {
  return email.length >= 5 && email.length <= 254 && EMAIL_PATTERN.test(email);
}

export async function joinWaitlist(input: JoinInput): Promise<JoinResult> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
      "Waitlist is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
    return "error";
  }

  const { source, campaign } = getAttribution();
  const body = {
    email: input.email.trim(),
    first_name: input.firstName?.trim() || null,
    neighbourhood: input.neighbourhood || null,
    consent: input.consent,
    consent_text: copy.consentLabel,
    source,
    campaign,
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    if (res.ok) return "success";
    if (res.status === 409) return "already";
    console.error("Waitlist insert failed", res.status, await res.text());
    return "error";
  } catch (err) {
    console.error("Waitlist insert failed", err);
    return "error";
  }
}
