"use client";

/*
 * Real accounts: Supabase Auth plus the tables and functions in
 * docs/app/SUPABASE-ACCOUNTS.sql. Off until Ammar runs that SQL and sets
 * NEXT_PUBLIC_AUTH_MODE=supabase (docs/app/ACCOUNTS.md).
 *
 * - Only the public publishable key (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
 *   Every rule that matters is enforced in the database (RLS and
 *   SECURITY DEFINER functions), not here.
 * - Two clients with separate storage, so the member login and the business
 *   login are separate sessions, like two apps.
 * - Codes are issued and confirmed only by database functions
 *   (issue_code, confirm_code). The server keeps a hash; the plain code
 *   exists only on the member's phone while it's on screen.
 * - This file is loaded only in that mode (a dynamic import), so the demo
 *   build never downloads supabase-js.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getState, mock, type OfferSettings, type Redemption } from "@/mock/store";
import { CODE_LIFE_MS } from "@/mock/store";
import { getAuthState, setAuthState } from "./state";
import {
  fail,
  isEmail,
  MIN_PASSWORD,
  normEmail,
  ok,
  type AuthBackend,
  type AuthErrorCode,
  type BusinessAccess,
  type ConfirmOutcome,
  type MemberSession,
  type PartnerSession,
  type Result,
  type StaffEntry,
} from "./types";

type Side = "member" | "partner";
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://the6pass.ca").replace(/\/$/, "");
const PLACE_KEY = "t6p_partner_place";

let clients: Record<Side, SupabaseClient> | null = null;
function sb(side: Side): SupabaseClient {
  if (!clients) {
    // A reset or confirm link says which side it's for (?side=partner), so only that client reads the tokens in the URL.
    const linkSide = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("side") === "partner" ? "partner" : "member";
    const make = (s: Side) =>
      createClient(URL_, KEY, {
        auth: { storageKey: `t6p-${s}`, persistSession: true, autoRefreshToken: true, detectSessionInUrl: s === linkSide, flowType: "implicit" },
      });
    clients = { member: make("member"), partner: make("partner") };
  }
  return clients[side];
}

/* ---------- Errors ---------- */

/** Short codes the database functions raise (docs/app/SUPABASE-ACCOUNTS.sql), in plain words. */
const DB_MESSAGES: Record<string, string> = {
  no_pass: "Your pass isn't active yet. We'll email you when it is.",
  not_found: "This place isn't taking codes in the app yet.",
  paused: "Paused by the venue.",
  not_today: "Not running today.",
  blackout: "Not running today. It's a blackout date.",
  used_up: "You've used this one for the year.",
  rate_limited: "Too many codes in a short time. Try again in a while.",
  already_on_team: "They're already on your team.",
  busy: "That didn't go through. Try again.",
};

function mapError(e: unknown): Result<never> {
  const err = e as { code?: string; status?: number; message?: string; name?: string } | null;
  const code = err?.code ?? "";
  const msg = (err?.message ?? "").toLowerCase();
  const dbKey = Object.keys(DB_MESSAGES).find((k) => msg === k);
  if (dbKey) return fail(dbKey === "rate_limited" ? "rate-limited" : "unknown", DB_MESSAGES[dbKey]);
  let c: AuthErrorCode = "unknown";
  if (err?.name === "AuthRetryableFetchError" || err?.name === "TypeError" || /fetch|network/.test(msg)) c = "network";
  else if (code === "invalid_credentials" || /invalid login/.test(msg)) c = "wrong-password";
  else if (code === "user_already_exists" || code === "email_exists" || /already registered/.test(msg)) c = "email-taken";
  else if (code === "weak_password" || /password should/.test(msg)) c = "weak-password";
  else if (code === "otp_expired" || /token has expired|invalid token|otp/.test(msg)) c = "bad-code";
  else if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || err?.status === 429) c = "rate-limited";
  else if (code === "email_address_invalid" || /invalid email|email address/.test(msg)) c = "invalid-email";
  else if (code === "otp_disabled" || code === "signup_disabled") c = "no-account";
  else if (/not_owner/.test(msg)) c = "not-owner";
  else if (/last_owner/.test(msg)) c = "last-owner";
  else if (/not_invited/.test(msg)) c = "not-invited";
  return fail(c);
}

/* ---------- Sessions into the app ---------- */

const monthYear = (d?: string | null) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString("en-CA", { month: "long", year: "numeric" }) : "");

async function loadMember(): Promise<MemberSession | null> {
  const c = sb("member");
  const { data } = await c.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  const [{ data: prof }, { data: pass }] = await Promise.all([
    c.from("profiles").select("first_name, home_hood, work_hood, notify, onboarded").eq("id", user.id).maybeSingle(),
    c.from("passes").select("number, starts_on, ends_on, status").eq("user_id", user.id).maybeSingle(),
  ]);
  return {
    userId: user.id,
    email: user.email ?? "",
    firstName: prof?.first_name ?? "",
    homeHood: prof?.home_hood ?? "",
    workHood: prof?.work_hood ?? "",
    notify: prof?.notify ?? null,
    onboarded: !!prof?.onboarded,
    pass: {
      number: pass?.number != null ? String(pass.number).padStart(4, "0") : "",
      since: monthYear(pass?.starts_on),
      renews: monthYear(pass?.ends_on),
      status: pass?.status === "active" ? "active" : "pending",
    },
  };
}

async function loadPartner(): Promise<PartnerSession | null> {
  const c = sb("partner");
  const { data } = await c.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  await c.rpc("accept_invites");
  const { data: rows, error } = await c.rpc("my_businesses");
  if (error || !rows?.length) return null;
  const businesses: BusinessAccess[] = (rows as { business_id: string; business_name: string; role: "owner" | "staff"; place_ids: string[] | null }[]).map((r) => ({
    businessId: r.business_id,
    businessName: r.business_name,
    role: r.role,
    placeIds: r.place_ids ?? [],
  }));
  const all = businesses.flatMap((b) => b.placeIds);
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(PLACE_KEY);
  } catch {
    /* ignore */
  }
  const placeId = saved && all.includes(saved) ? saved : all.length === 1 ? all[0] : null;
  return { userId: user.id, email: user.email ?? "", businesses, placeId };
}

async function publish(which: Side | "both" = "both") {
  const cur = getAuthState();
  const member = which === "partner" ? cur.member : await loadMember().catch(() => cur.member);
  const partner = which === "member" ? cur.partner : await loadPartner().catch(() => cur.partner);
  setAuthState({ ready: true, member, partner });
}

/* ---------- Offers and visits into the app's store ---------- */

type PlaceRow = { id: string; offer: string; offer_detail: string | null; offer_kind: "two_for_one" | "upgrade"; days: boolean[]; uses_per_year: number; blackout_dates: string[] | null; paused: boolean; saving: number | null };

async function loadOffers(side: Side) {
  const { data } = await sb(side).from("places").select("id, offer, offer_detail, offer_kind, days, uses_per_year, blackout_dates, paused, saving");
  if (!data) return;
  const patch: Record<string, Partial<OfferSettings>> = {};
  for (const r of data as PlaceRow[])
    patch[r.id] = { offer: r.offer, detail: r.offer_detail ?? "", kind: r.offer_kind, days: r.days, usesPerYear: r.uses_per_year, blackoutDates: r.blackout_dates ?? [], paused: r.paused, saving: r.saving ?? 0 };
  mock.setOffers(patch);
}

type RedemptionRow = { id: string; place_id: string; status: string; issued_at: string; confirmed_at: string | null; offer_text: string; saving: number | null };

function toRedemption(r: RedemptionRow, memberId: string, memberName?: string): Redemption {
  return {
    id: `sb-${r.id}`,
    serverId: r.id,
    partnerId: r.place_id,
    code: "",
    issuedAt: Date.parse(r.issued_at),
    status: r.status === "confirmed" ? "confirmed" : r.status === "issued" ? "issued" : "cancelled",
    confirmedAt: r.confirmed_at ? Date.parse(r.confirmed_at) : undefined,
    saving: r.saving ?? 0,
    offer: r.offer_text,
    memberId,
    memberName,
  };
}

async function loadMemberVisits() {
  const me = getAuthState().member;
  if (!me) return;
  const since = new Date(Date.now() - 366 * 864e5).toISOString();
  const { data } = await sb("member").from("redemptions").select("id, place_id, status, issued_at, confirmed_at, offer_text, saving").gte("issued_at", since).order("issued_at");
  if (data) mock.mergeServer((data as RedemptionRow[]).map((r) => toRedemption(r, me.userId, me.firstName)), { memberId: me.userId });
}

async function loadPlaceVisits() {
  const p = getAuthState().partner;
  if (!p?.placeId) return;
  const role = p.businesses.find((b) => b.placeIds.includes(p.placeId!))?.role;
  const { data } = await sb("partner").rpc("place_visits", { p_place: p.placeId, p_days: role === "owner" ? 90 : 1 });
  if (!data) return;
  const rows = data as { id: string; confirmed_at: string; offer_text: string; member_name: string | null; saving: number | null }[];
  mock.mergeServer(
    rows.map((r) => ({ id: `sb-${r.id}`, serverId: r.id, partnerId: p.placeId!, code: "", issuedAt: Date.parse(r.confirmed_at), confirmedAt: Date.parse(r.confirmed_at), status: "confirmed", saving: r.saving ?? 0, offer: r.offer_text, memberName: r.member_name ?? undefined, remote: true })),
    { placeId: p.placeId },
  );
}

/** While a code is on the member's screen, check every few seconds whether staff confirmed it. */
const watching = new Set<string>();
function watch(serverId: string, localId: string) {
  if (watching.has(serverId)) return;
  watching.add(serverId);
  const started = Date.now();
  const tick = async () => {
    const r = getState().redemptions.find((x) => x.id === localId);
    if (!r || r.status !== "issued" || Date.now() - started > CODE_LIFE_MS + 30_000) return watching.delete(serverId);
    const { data } = await sb("member").from("redemptions").select("status, confirmed_at").eq("id", serverId).maybeSingle();
    if (data?.status === "confirmed") {
      mock.setStatus(localId, { status: "confirmed", confirmedAt: data.confirmed_at ? Date.parse(data.confirmed_at) : Date.now() });
      return watching.delete(serverId);
    }
    if (data && data.status !== "issued") {
      mock.setStatus(localId, { status: "cancelled" });
      return watching.delete(serverId);
    }
    window.setTimeout(tick, document.visibilityState === "visible" ? 2500 : 6000);
  };
  window.setTimeout(tick, 2500);
}

/* ---------- The backend ---------- */

let started = false;
const redirect = (path: string, side: Side) => `${SITE}${path}${path.includes("?") ? "&" : "?"}side=${side}`;

export const supabaseBackend: AuthBackend = {
  mode: "supabase",
  async init() {
    if (!started) {
      started = true;
      for (const side of ["member", "partner"] as Side[]) sb(side).auth.onAuthStateChange(() => void publish(side));
    }
    await publish();
    await Promise.all([loadOffers("member").catch(() => {}), loadMemberVisits().catch(() => {}), loadPlaceVisits().catch(() => {})]);
  },

  async signUp(email, password) {
    if (!isEmail(email)) return fail("invalid-email");
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    const { data, error } = await sb("member").auth.signUp({ email: normEmail(email), password, options: { emailRedirectTo: redirect("/app/account/setup", "member") } });
    if (error) return mapError(error);
    // With "Confirm email" on (recommended), there's no session until they confirm.
    if (data.user && data.user.identities?.length === 0) return fail("email-taken");
    await publish("member");
    return ok({ confirmEmail: !data.session });
  },

  async signIn(email, password) {
    if (!isEmail(email)) return fail("invalid-email");
    const { error } = await sb("member").auth.signInWithPassword({ email: normEmail(email), password });
    if (error) return mapError(error);
    await publish("member");
    await loadMemberVisits().catch(() => {});
    return ok(undefined);
  },

  async sendCode(email, side) {
    if (!isEmail(email)) return fail("invalid-email");
    const { error } = await sb(side).auth.signInWithOtp({ email: normEmail(email), options: { shouldCreateUser: side === "member", emailRedirectTo: redirect(side === "member" ? "/app" : "/app/business", side) } });
    if (error) return side === "partner" && (error as { code?: string }).code === "otp_disabled" ? fail("not-partner") : mapError(error);
    return ok({});
  },

  async verifyCode(email, code, side) {
    const { error } = await sb(side).auth.verifyOtp({ email: normEmail(email), token: code.replace(/\D/g, ""), type: "email" });
    if (error) return mapError(error);
    await publish(side);
    if (side === "partner" && !getAuthState().partner) {
      await sb("partner").auth.signOut({ scope: "local" });
      return fail("not-partner");
    }
    return ok(undefined);
  },

  async resetPassword(email, side) {
    if (!isEmail(email)) return fail("invalid-email");
    const { error } = await sb(side).auth.resetPasswordForEmail(normEmail(email), { redirectTo: redirect("/app/account/reset", side) });
    if (error) return mapError(error);
    return ok({ demo: false });
  },

  async setPassword(password, side) {
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    const { error } = await sb(side).auth.updateUser({ password });
    return error ? mapError(error) : ok(undefined);
  },

  async updateProfile(patch) {
    const me = getAuthState().member;
    if (!me) return fail("unknown");
    const row: Record<string, unknown> = {};
    if (patch.firstName !== undefined) row.first_name = patch.firstName.trim().slice(0, 40);
    if (patch.homeHood !== undefined) row.home_hood = patch.homeHood;
    if (patch.workHood !== undefined) row.work_hood = patch.workHood;
    if (patch.notify !== undefined) row.notify = patch.notify;
    if (patch.onboarded !== undefined) row.onboarded = patch.onboarded;
    const { error } = await sb("member").from("profiles").update(row).eq("id", me.userId);
    if (error) return mapError(error);
    await publish("member");
    return ok(undefined);
  },

  async deleteAccount() {
    const { error } = await sb("member").rpc("delete_my_account");
    if (error) return mapError(error);
    await sb("member").auth.signOut({ scope: "local" });
    await publish("member");
    return ok(undefined);
  },

  async signOut(side) {
    await sb(side).auth.signOut({ scope: "local" });
    if (side === "partner") {
      try {
        window.localStorage.removeItem(PLACE_KEY);
      } catch {
        /* ignore */
      }
    }
    await publish(side);
  },

  async setSaved(placeId, on) {
    const me = getAuthState().member;
    if (!me) return;
    if (on) await sb("member").from("saved_places").upsert({ user_id: me.userId, place_id: placeId });
    else await sb("member").from("saved_places").delete().eq("user_id", me.userId).eq("place_id", placeId);
  },
  async loadSaved() {
    const { data } = await sb("member").from("saved_places").select("place_id").order("created_at");
    return data ? (data as { place_id: string }[]).map((r) => r.place_id) : null;
  },

  async partnerSignIn(email, password) {
    if (!isEmail(email)) return fail("invalid-email");
    const { error } = await sb("partner").auth.signInWithPassword({ email: normEmail(email), password });
    if (error) return mapError(error);
    await publish("partner");
    if (!getAuthState().partner) {
      await sb("partner").auth.signOut({ scope: "local" });
      return fail("not-partner");
    }
    await loadPlaceVisits().catch(() => {});
    return ok(undefined);
  },

  async acceptInvite(email, password) {
    if (!isEmail(email)) return fail("invalid-email");
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    const { data, error } = await sb("partner").auth.signUp({ email: normEmail(email), password, options: { emailRedirectTo: redirect("/app/business", "partner") } });
    if (error) return mapError(error);
    if (data.user && data.user.identities?.length === 0) return fail("email-taken", "That email already has an account. Sign in with its password, or email yourself a code.");
    if (!data.session) return fail("unknown", "Check your email and tap the link to confirm, then sign in here.");
    await publish("partner");
    if (!getAuthState().partner) return fail("not-invited");
    return ok(undefined);
  },

  async choosePlace(placeId) {
    try {
      window.localStorage.setItem(PLACE_KEY, placeId);
    } catch {
      /* ignore */
    }
    const cur = getAuthState();
    if (cur.partner) setAuthState({ ...cur, partner: { ...cur.partner, placeId } });
    await loadPlaceVisits().catch(() => {});
  },

  async listTeam(businessId) {
    const { data, error } = await sb("partner").rpc("business_team", { p_business: businessId });
    if (error) return mapError(error);
    const me = getAuthState().partner?.userId;
    return ok((data as { id: string; email: string; role: "owner" | "staff"; status: "active" | "invited" }[]).map((r) => ({ ...r, you: r.id === me })) as StaffEntry[]);
  },

  async invite(businessId, email, role) {
    if (!isEmail(email)) return fail("invalid-email");
    const { error } = await sb("partner").rpc("invite_staff", { p_business: businessId, p_email: normEmail(email), p_role: role });
    if (error) return mapError(error);
    // Send them a sign-in code from a throwaway client, so the owner's own session is untouched.
    const tmp = createClient(URL_, KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "t6p-invite" } });
    await tmp.auth.signInWithOtp({ email: normEmail(email), options: { shouldCreateUser: true, emailRedirectTo: redirect("/app/business", "partner") } });
    return ok({ demo: false });
  },

  async removeFromTeam(businessId, entry) {
    const { error } = await sb("partner").rpc("remove_team_member", { p_business: businessId, p_id: entry.id, p_kind: entry.status });
    return error ? mapError(error) : ok(undefined);
  },

  async issue(placeId) {
    const me = getAuthState().member;
    if (!me) return fail("unknown");
    const { data, error } = await sb("member").rpc("issue_code", { p_place: placeId });
    if (error) return mapError(error);
    const row = (Array.isArray(data) ? data[0] : data) as { redemption_id: string; code: string; issued_at: string; offer_text: string; saving: number | null } | null;
    if (!row) return fail("unknown");
    const local: Redemption = { id: `sb-${row.redemption_id}`, serverId: row.redemption_id, partnerId: placeId, code: row.code, issuedAt: Date.parse(row.issued_at), status: "issued", saving: row.saving ?? 0, offer: row.offer_text, memberId: me.userId, memberName: me.firstName };
    mock.add(local);
    watch(row.redemption_id, local.id);
    return ok(local.id);
  },

  async cancel(id) {
    const r = getState().redemptions.find((x) => x.id === id);
    mock.cancel(id);
    if (r?.serverId) await sb("member").rpc("cancel_code", { p_redemption: r.serverId });
  },

  async confirm(placeId, raw): Promise<ConfirmOutcome> {
    const code = raw.replace(/\D/g, "");
    const { data, error } = await sb("partner").rpc("confirm_code", { p_place: placeId, p_code: code });
    if (error) return { result: /fetch|network/i.test(error.message) ? "offline" : "not-allowed", code };
    const r = data as { result: string; offer?: string; member_name?: string; uses_left?: number; uses_per_year?: number };
    if (r.result === "ok") {
      void loadPlaceVisits();
      return { result: "ok", code, offer: r.offer ?? "", memberName: r.member_name || "Member", usesLeft: r.uses_left ?? 0, usesPerYear: r.uses_per_year ?? 0 };
    }
    const known = ["used", "expired", "unknown", "wrong-place", "used-up", "paused", "rate-limited", "not-allowed"] as const;
    const res = (known as readonly string[]).includes(r.result.replace("_", "-")) ? (r.result.replace("_", "-") as (typeof known)[number]) : "unknown";
    return { result: res, code };
  },

  async refresh(what) {
    if (what === "member") await Promise.all([loadMemberVisits(), loadOffers("member")]).catch(() => {});
    else await Promise.all([loadPlaceVisits(), loadOffers("partner")]).catch(() => {});
  },

  async updateOffer(placeId, patch) {
    const cols: Record<string, unknown> = {};
    const map: Record<string, string> = { offer: "offer", detail: "offer_detail", kind: "offer_kind", days: "days", usesPerYear: "uses_per_year", blackoutDates: "blackout_dates", paused: "paused" };
    for (const [k, v] of Object.entries(patch)) if (map[k]) cols[map[k]] = v;
    const { error } = await sb("partner").from("places").update(cols).eq("id", placeId);
    if (error) return mapError(error);
    mock.updateOffer(placeId, patch as Partial<OfferSettings>);
    return ok(undefined);
  },
};
