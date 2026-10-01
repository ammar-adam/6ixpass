/*
 * Analytics hook. Disabled until NEXT_PUBLIC_ANALYTICS_ENABLED is "true".
 * When we pick a provider (Plausible, Fathom, GA4...), load its script in
 * layout.tsx and forward events from `track` below. Nothing is sent today.
 */
type Props = Record<string, string | number | boolean | undefined>;

export const analyticsEnabled =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

export function track(event: string, props: Props = {}) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  // Provider call goes here, for example: window.plausible?.(event, { props })
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
