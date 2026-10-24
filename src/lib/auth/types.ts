/*
 * Accounts for The 6 Pass app: one interface, two implementations.
 *
 *   local.ts     accounts and sessions kept on this device. Seeded demo
 *                accounts. What the app uses until real accounts are on.
 *   supabase.ts  Supabase Auth plus the tables in docs/app/SUPABASE-ACCOUNTS.sql.
 *                Switched on with NEXT_PUBLIC_AUTH_MODE=supabase.
 *
 * Members and businesses sign in separately: a member session never opens
 * the business side, and a business session never opens a member's pass.
 */

export type Hood = string;

export type Pass = {
  /** Shown on the card, e.g. "0412". */
  number: string;
  /** "March 2027" */
  since: string;
  /** "March 2028" */
  renews: string;
  status: "active" | "pending";
};

export type MemberSession = {
  userId: string;
  email: string;
  firstName: string;
  homeHood: Hood;
  workHood: Hood;
  /** null = not asked yet. */
  notify: boolean | null;
  /** Finished the short setup after sign-up. */
  onboarded: boolean;
  pass: Pass;
  /** Nida's meeting demo or a seeded demo account: say so where it matters. */
  demo?: boolean;
};

export type Role = "owner" | "staff";

export type BusinessAccess = {
  businessId: string;
  businessName: string;
  role: Role;
  placeIds: string[];
};

export type PartnerSession = {
  userId: string;
  email: string;
  businesses: BusinessAccess[];
  /** The place this phone is working at right now. */
  placeId: string | null;
  demo?: boolean;
};

export type AuthState = {
  /** False until the saved sessions have been read (and, for Supabase, checked). */
  ready: boolean;
  member: MemberSession | null;
  partner: PartnerSession | null;
};

export type AuthErrorCode =
  | "invalid-email"
  | "weak-password"
  | "wrong-password"
  | "no-account"
  | "email-taken"
  | "bad-code"
  | "not-partner"
  | "not-invited"
  | "not-owner"
  | "last-owner"
  | "rate-limited"
  | "network"
  | "unknown";

export type Result<T = void> = { ok: true; value: T } | { ok: false; error: AuthErrorCode; message: string };

export type StaffEntry = {
  /** A user id, or an invite id while the invite is pending. */
  id: string;
  email: string;
  role: Role;
  status: "active" | "invited";
  you?: boolean;
};

/** What staff see after a scan or a typed code. */
export type ConfirmOutcome =
  | { result: "ok"; offer: string; memberName: string; usesLeft: number; usesPerYear: number; code: string }
  | { result: "used" | "expired" | "unknown" | "wrong-place" | "used-up" | "paused" | "rate-limited" | "offline" | "not-allowed"; code: string };

/** What a new business tells us about its place. category is an OwnerCategory id ("restaurant", "cafe"...). */
export type NewBusinessPlace = { id?: string; neighbourhood?: string; category?: string };

export type ProfilePatch = Partial<Pick<MemberSession, "firstName" | "homeHood" | "workHood" | "notify" | "onboarded">>;

export interface AuthBackend {
  readonly mode: "local" | "supabase";
  /** Restore saved sessions. Safe to call more than once. */
  init(): Promise<void>;

  /* ---- Members ---- */
  signUp(email: string, password: string): Promise<Result<{ confirmEmail: boolean }>>;
  signIn(email: string, password: string): Promise<Result>;
  /** Email a 6-digit sign-in code. In the demo, the code comes back so the screen can show it. */
  sendCode(email: string, side: "member" | "partner"): Promise<Result<{ demoCode?: string }>>;
  verifyCode(email: string, code: string, side: "member" | "partner"): Promise<Result>;
  resetPassword(email: string, side: "member" | "partner"): Promise<Result<{ demo: boolean }>>;
  /** After a reset link: set a new password for the signed-in user. */
  setPassword(password: string, side: "member" | "partner"): Promise<Result>;
  updateProfile(patch: ProfilePatch): Promise<Result>;
  deleteAccount(): Promise<Result>;
  signOut(side: "member" | "partner"): Promise<void>;
  /** Saved places for the signed-in member (Supabase keeps them in saved_places). */
  setSaved(placeId: string, on: boolean): Promise<void>;
  loadSaved(): Promise<string[] | null>;

  /* ---- Businesses ---- */
  partnerSignIn(email: string, password: string): Promise<Result>;
  /** Staff accept an invite by creating a password for the invited email. */
  acceptInvite(email: string, password: string): Promise<Result>;
  /**
   * A new business signs itself up as the owner of one place.
   * Demo accounts: runs a place already in the app (place.id).
   * Real accounts: a new place from the name, neighbourhood and category, hidden until The 6 Pass approves it.
   */
  createBusiness(email: string, password: string, businessName: string, place: NewBusinessPlace): Promise<Result>;
  choosePlace(placeId: string): Promise<void>;
  listTeam(businessId: string): Promise<Result<StaffEntry[]>>;
  invite(businessId: string, email: string, role: Role): Promise<Result<{ demo: boolean }>>;
  removeFromTeam(businessId: string, entry: StaffEntry): Promise<Result>;

  /* ---- Codes and visits ---- */
  /** Member: get a code for a place. Returns the redemption id (the code lands in the app's store). */
  issue(placeId: string): Promise<Result<string>>;
  cancel(redemptionId: string): Promise<void>;
  /** Staff: check a code and mark it used, in one step. */
  confirm(placeId: string, code: string): Promise<ConfirmOutcome>;
  /** Pull the latest visits and offers into the app's store (Supabase only; local is already there). */
  refresh(what: "member" | "place"): Promise<void>;
  /** Owner: change the offer, days, uses, blackouts or pause. */
  updateOffer(placeId: string, patch: Record<string, unknown>): Promise<Result>;
}

export const MESSAGES: Record<AuthErrorCode, string> = {
  "invalid-email": "Enter an email like name@example.com.",
  "weak-password": "Use at least 8 characters.",
  "wrong-password": "That email and password don't match.",
  "no-account": "There's no account with that email yet.",
  "email-taken": "There's already an account with that email. Sign in instead.",
  "bad-code": "That code didn't work. Check the six digits, or send a new one.",
  "not-partner": "This email isn't linked to a business yet. Ask the owner to invite you, or email hello@the6pass.ca.",
  "not-invited": "There's no invite for that email. Ask the owner to invite you from Team.",
  "not-owner": "Only an owner can do that.",
  "last-owner": "A business needs at least one owner.",
  "rate-limited": "Too many tries. Wait a minute, then try again.",
  network: "No connection. Check your signal and try again.",
  unknown: "Something went wrong. Try again.",
};

export const fail = (error: AuthErrorCode, message = MESSAGES[error]): Result<never> => ({ ok: false, error, message });
export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()) && s.trim().length <= 254;
export const normEmail = (s: string) => s.trim().toLowerCase();
export const MIN_PASSWORD = 8;
