"use client";

/*
 * Accounts kept on this device. What the app runs on until real accounts are
 * switched on (NEXT_PUBLIC_AUTH_MODE=supabase), and what Nida's meeting demo
 * always runs on.
 *
 * Honest about being a demo: no email is ever sent (sign-in codes show on
 * screen), passwords are hashed but live in this browser's storage, and the
 * seeded accounts are labelled "Demo account" in the app. Two windows of the
 * app stay in step through the storage event, so a member window and a staff
 * window on one laptop behave like two phones.
 */
import { PLACES } from "@/demo/places-active";
import { OWNER_ID } from "@/mock/owner";
import { askMemberPhone } from "@/mock/relay";
import { getState, isLive, mock, place, usesLeft } from "@/mock/store";
import { getAuthState, setAuthState } from "./state";
import {
  fail,
  isEmail,
  MIN_PASSWORD,
  normEmail,
  ok,
  type AuthBackend,
  type AuthState,
  type BusinessAccess,
  type ConfirmOutcome,
  type PartnerSession,
  type ProfilePatch,
  type Role,
  type StaffEntry,
} from "./types";

const DB_KEY = "t6p_accounts_v1";
const SESSION_KEY = "t6p_sessions_v1";

/** Demo accounts. The password for each is the same, and shown on the sign-in screens. */
export const DEMO_PASSWORD = "demo1234";
export const DEMO_MEMBER = "alex@example.com";
export const DEMO_OWNER = "owner@partner.example";
export const DEMO_STAFF = "staff@partner.example";
export const MEETING_USER = "u-meeting";
export const ALEX_ID = "u-alex";

type LocalUser = {
  id: string;
  email: string;
  /** "plain:..." only for the seeded demo accounts; real sign-ups store "sha256:<salt>:<hash>". */
  pw: string;
  firstName: string;
  homeHood: string;
  workHood: string;
  notify: boolean | null;
  onboarded: boolean;
  memberNo: string;
  since: string;
  renews: string;
  seed?: boolean;
  createdAt: number;
};
type LocalRole = { userId: string; businessId: string; role: Role };
type LocalInvite = { id: string; email: string; businessId: string; role: Role; at: number; by: string };
type LocalBusiness = { id: string; name: string; placeIds: string[] };
type LocalCode = { email: string; code: string; exp: number };
type Db = { v: 1; users: LocalUser[]; businesses: LocalBusiness[]; roles: LocalRole[]; invites: LocalInvite[]; codes: LocalCode[]; nextNo: number };
type Sessions = { member?: { userId: string; demo?: boolean }; partner?: { userId: string; placeId: string | null; demo?: boolean } };

const SINCE = "March 2027";
const RENEWS = "March 2028";

function seed(): Db {
  const groupPlaces = PLACES.slice(0, 2).map((p) => p.id);
  const user = (id: string, email: string, firstName: string, memberNo: string, extra: Partial<LocalUser> = {}): LocalUser => ({
    id,
    email,
    pw: `plain:${DEMO_PASSWORD}`,
    firstName,
    homeHood: "",
    workHood: "",
    notify: null,
    onboarded: true,
    memberNo,
    since: SINCE,
    renews: RENEWS,
    seed: true,
    createdAt: 0,
    ...extra,
  });
  return {
    v: 1,
    users: [
      user(ALEX_ID, DEMO_MEMBER, "Alex", "0412", { homeHood: "King West", workHood: "Financial District", notify: true }),
      user("u-owner", DEMO_OWNER, "Sam", "0413"),
      user("u-staff", DEMO_STAFF, "Jo", "0414"),
      // Nida's meeting demo signs in as this owner. It has no password, so nobody can sign in as it.
      { ...user(MEETING_USER, "meeting@the6pass.example", "Owner", "0000"), pw: "" },
    ],
    businesses: [
      { id: "b-demo-group", name: "Demo Partner Group", placeIds: groupPlaces },
      { id: "b-meeting", name: "Your place", placeIds: [OWNER_ID] },
    ],
    roles: [
      { userId: "u-owner", businessId: "b-demo-group", role: "owner" },
      { userId: "u-staff", businessId: "b-demo-group", role: "staff" },
      { userId: MEETING_USER, businessId: "b-meeting", role: "owner" },
    ],
    invites: [],
    codes: [],
    nextNo: 415,
  };
}

/* ---------- Storage ---------- */

let dbCache: Db | null = null;
function db(): Db {
  if (dbCache) return dbCache;
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    const v = raw ? (JSON.parse(raw) as Db) : null;
    if (v && v.v === 1 && Array.isArray(v.users)) {
      // New seeded places or accounts in a later version still show up.
      const base = seed();
      for (const u of base.users) if (!v.users.some((x) => x.id === u.id)) v.users.push(u);
      for (const b of base.businesses) if (!v.businesses.some((x) => x.id === b.id)) v.businesses.push(b);
      dbCache = v;
      return v;
    }
  } catch {
    /* blocked or corrupt: start from the seed */
  }
  dbCache = seed();
  return dbCache;
}
function saveDb(next: Db) {
  dbCache = next;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(next));
  } catch {
    /* private mode: works until the app closes */
  }
}
let sessionCache: Sessions | null = null;
function sessions(): Sessions {
  if (sessionCache) return sessionCache;
  try {
    sessionCache = JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? "{}") ?? {};
  } catch {
    sessionCache = {};
  }
  return sessionCache!;
}
function saveSessions(next: Sessions) {
  sessionCache = next;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  publish();
}

/* ---------- The sessions the screens see ---------- */

function accessFor(d: Db, userId: string): BusinessAccess[] {
  return d.roles
    .filter((r) => r.userId === userId)
    .map((r) => {
      const b = d.businesses.find((x) => x.id === r.businessId);
      return b ? { businessId: b.id, businessName: b.name, role: r.role, placeIds: b.placeIds } : null;
    })
    .filter((x): x is BusinessAccess => !!x);
}

function compute(): AuthState {
  const d = db();
  const s = sessions();
  const mu = s.member && d.users.find((u) => u.id === s.member!.userId);
  const pu = s.partner && d.users.find((u) => u.id === s.partner!.userId);
  let partner: PartnerSession | null = null;
  if (pu && s.partner) {
    const businesses = accessFor(d, pu.id);
    const all = businesses.flatMap((b) => b.placeIds);
    const placeId = s.partner.placeId && all.includes(s.partner.placeId) ? s.partner.placeId : all.length === 1 ? all[0] : null;
    if (businesses.length) partner = { userId: pu.id, email: pu.email, businesses, placeId, demo: !!s.partner.demo };
  }
  return {
    ready: true,
    member: mu
      ? {
          userId: mu.id,
          email: mu.email,
          firstName: mu.firstName,
          homeHood: mu.homeHood,
          workHood: mu.workHood,
          notify: mu.notify,
          onboarded: mu.onboarded,
          pass: { number: mu.memberNo, since: mu.since, renews: mu.renews, status: "active" },
          demo: !!s.member!.demo,
        }
      : null,
    partner,
  };
}

function publish() {
  setAuthState(compute());
}

/** Nida's meeting demo is running on this device (so local accounts are in charge, whatever the mode). */
export function localDemoActive() {
  try {
    const s = sessions();
    return !!(s.member?.demo || s.partner?.demo);
  } catch {
    return false;
  }
}

/* ---------- Passwords ---------- */

async function sha256(text: string) {
  const subtle = typeof crypto !== "undefined" ? crypto.subtle : undefined;
  if (subtle) {
    const buf = await subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // No Web Crypto (an http:// address on a home network). Still never store the password as typed.
  let h1 = 0x811c9dc5;
  let h2 = 0x1b873593;
  for (let i = 0; i < text.length; i++) {
    h1 = Math.imul(h1 ^ text.charCodeAt(i), 16777619);
    h2 = Math.imul(h2 ^ text.charCodeAt(i), 2246822507);
  }
  return `fnv${(h1 >>> 0).toString(16)}${(h2 >>> 0).toString(16)}`;
}
const randomId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
async function hashPassword(pw: string) {
  const salt = Math.random().toString(36).slice(2, 12);
  return `sha256:${salt}:${await sha256(`${salt}:${pw}`)}`;
}
async function checkPassword(u: LocalUser, pw: string) {
  if (!u.pw) return false;
  if (u.pw.startsWith("plain:")) return u.pw.slice(6) === pw;
  const [, salt, hash] = u.pw.split(":");
  return (await sha256(`${salt}:${pw}`)) === hash;
}

/* ---------- Limits on guessing ---------- */

const tries = new Map<string, number[]>();
function limited(key: string, max: number, windowMs = 60_000) {
  const now = Date.now();
  const list = (tries.get(key) ?? []).filter((t) => now - t < windowMs);
  tries.set(key, list);
  return list.length >= max;
}
const note = (key: string) => tries.set(key, [...(tries.get(key) ?? []), Date.now()]);

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

/* ---------- The backend ---------- */

const userByEmail = (email: string) => db().users.find((u) => u.email === normEmail(email));

function signInAs(side: "member" | "partner", userId: string) {
  const s = sessions();
  if (side === "member") saveSessions({ ...s, member: { userId } });
  else saveSessions({ ...s, partner: { userId, placeId: null } });
}

function acceptPendingInvites(userId: string, email: string) {
  const d = db();
  const mine = d.invites.filter((i) => i.email === email);
  if (!mine.length) return;
  const roles = [...d.roles];
  for (const i of mine) if (!roles.some((r) => r.userId === userId && r.businessId === i.businessId)) roles.push({ userId, businessId: i.businessId, role: i.role });
  saveDb({ ...d, roles, invites: d.invites.filter((i) => i.email !== email) });
}

function newUser(email: string, pw: string): LocalUser {
  const d = db();
  const no = String(d.nextNo).padStart(4, "0");
  saveDb({ ...d, nextNo: d.nextNo + 1 });
  return { id: randomId("u"), email: normEmail(email), pw, firstName: "", homeHood: "", workHood: "", notify: null, onboarded: false, memberNo: no, since: SINCE, renews: RENEWS, createdAt: Date.now() };
}

function ownerOf(businessId: string) {
  const p = getAuthState().partner;
  return p?.businesses.find((b) => b.businessId === businessId && b.role === "owner");
}

let started = false;

export const localBackend: AuthBackend = {
  mode: "local",
  async init() {
    publish();
    if (started) return;
    started = true;
    window.addEventListener("storage", (e) => {
      if (e.key === DB_KEY || e.key === SESSION_KEY || e.key === null) {
        dbCache = null;
        sessionCache = null;
        publish();
      }
    });
  },

  async signUp(email, password) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    if (userByEmail(email)) return fail("email-taken");
    const u = newUser(email, await hashPassword(password));
    const d = db();
    saveDb({ ...d, users: [...d.users, u] });
    signInAs("member", u.id);
    return ok({ confirmEmail: false });
  },

  async signIn(email, password) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    const key = `in:${normEmail(email)}`;
    if (limited(key, 8)) return fail("rate-limited");
    const u = userByEmail(email);
    if (!u || !(await checkPassword(u, password))) {
      note(key);
      return fail("wrong-password");
    }
    signInAs("member", u.id);
    return ok(undefined);
  },

  async sendCode(email, side) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    const u = userByEmail(email);
    if (side === "partner" && (!u || !accessFor(db(), u.id).length) && !db().invites.some((i) => i.email === normEmail(email))) return fail("not-partner");
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const d = db();
    saveDb({ ...d, codes: [...d.codes.filter((c) => c.email !== normEmail(email)), { email: normEmail(email), code, exp: Date.now() + 10 * 60_000 }] });
    return ok({ demoCode: code });
  },

  async verifyCode(email, code, side) {
    await wait();
    const e = normEmail(email);
    const key = `code:${e}`;
    if (limited(key, 5)) return fail("rate-limited");
    const d = db();
    const c = d.codes.find((x) => x.email === e);
    if (!c || c.code !== code.replace(/\D/g, "") || Date.now() > c.exp) {
      note(key);
      return fail("bad-code");
    }
    let u = userByEmail(e);
    const fresh = db();
    if (!u) {
      // A code signs you up too, like Supabase's email code.
      u = newUser(e, "");
      saveDb({ ...db(), users: [...db().users, u] });
    }
    saveDb({ ...db(), codes: fresh.codes.filter((x) => x.email !== e) });
    if (side === "partner") {
      acceptPendingInvites(u.id, e);
      if (!accessFor(db(), u.id).length) return fail("not-partner");
    }
    signInAs(side, u.id);
    return ok(undefined);
  },

  async resetPassword(email) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    return ok({ demo: true });
  },

  async setPassword(password, side) {
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    const id = side === "member" ? sessions().member?.userId : sessions().partner?.userId;
    if (!id) return fail("unknown");
    const pw = await hashPassword(password);
    const d = db();
    saveDb({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, pw } : u)) });
    return ok(undefined);
  },

  async updateProfile(patch: ProfilePatch) {
    const id = sessions().member?.userId;
    if (!id) return fail("unknown");
    const d = db();
    saveDb({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, ...patch, firstName: (patch.firstName ?? u.firstName).trim().slice(0, 40) } : u)) });
    publish();
    return ok(undefined);
  },

  async deleteAccount() {
    await wait();
    const id = sessions().member?.userId;
    if (!id) return fail("unknown");
    const d = db();
    mock.forgetMember(id);
    // Seeded demo accounts come back after a reset; the account is gone from this device either way.
    saveDb({ ...d, users: d.users.filter((u) => u.id !== id), roles: d.roles.filter((r) => r.userId !== id) });
    const s = sessions();
    saveSessions({ ...s, member: undefined, partner: s.partner?.userId === id ? undefined : s.partner });
    try {
      window.localStorage.removeItem("t6p_saved");
    } catch {
      /* ignore */
    }
    return ok(undefined);
  },

  async signOut(side) {
    const s = sessions();
    // Leaving the meeting demo signs out both sides of it.
    if (s[side]?.demo) return saveSessions({});
    saveSessions({ ...s, [side]: undefined });
  },

  async setSaved() {
    /* saved places live in this device's storage already (ui.tsx) */
  },
  async loadSaved() {
    return null;
  },

  async partnerSignIn(email, password) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    const key = `pin:${normEmail(email)}`;
    if (limited(key, 8)) return fail("rate-limited");
    const u = userByEmail(email);
    if (!u || !(await checkPassword(u, password))) {
      note(key);
      return fail("wrong-password");
    }
    acceptPendingInvites(u.id, u.email);
    if (!accessFor(db(), u.id).length) return fail("not-partner");
    signInAs("partner", u.id);
    return ok(undefined);
  },

  async acceptInvite(email, password) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    const e = normEmail(email);
    if (!db().invites.some((i) => i.email === e)) return fail("not-invited");
    let u = userByEmail(e);
    if (u && !(await checkPassword(u, password)) && u.pw) return fail("email-taken", "That email already has an account. Sign in with its password instead.");
    if (!u) {
      u = { ...newUser(e, await hashPassword(password)), onboarded: true };
      saveDb({ ...db(), users: [...db().users, u] });
    }
    acceptPendingInvites(u.id, e);
    signInAs("partner", u.id);
    return ok(undefined);
  },

  async createBusiness(email, password, businessName, placeId) {
    await wait();
    if (!isEmail(email)) return fail("invalid-email");
    if (password.length < MIN_PASSWORD) return fail("weak-password");
    const name = businessName.trim().slice(0, 80);
    if (!name || !place(getState(), placeId)) return fail("unknown", "Enter your business name and choose your place.");
    const e = normEmail(email);
    let u = userByEmail(e);
    if (u && !(await checkPassword(u, password))) return fail("email-taken", "That email already has an account. Use its password, or sign in instead.");
    if (!u) {
      u = { ...newUser(e, await hashPassword(password)), onboarded: true };
      saveDb({ ...db(), users: [...db().users, u] });
    }
    const b: LocalBusiness = { id: randomId("b"), name, placeIds: [placeId] };
    const d = db();
    saveDb({ ...d, businesses: [...d.businesses, b], roles: [...d.roles, { userId: u.id, businessId: b.id, role: "owner" }] });
    const ss = sessions();
    saveSessions({ ...ss, partner: { userId: u.id, placeId } });
    publish();
    return ok(undefined);
  },

  async choosePlace(placeId) {
    const s = sessions();
    if (s.partner) saveSessions({ ...s, partner: { ...s.partner, placeId } });
  },

  async listTeam(businessId) {
    const d = db();
    const me = getAuthState().partner;
    if (!me?.businesses.some((b) => b.businessId === businessId)) return fail("not-owner");
    const people: StaffEntry[] = d.roles
      .filter((r) => r.businessId === businessId)
      .map((r) => ({ id: r.userId, email: d.users.find((u) => u.id === r.userId)?.email ?? "", role: r.role, status: "active" as const, you: r.userId === me.userId }));
    const invited: StaffEntry[] = d.invites.filter((i) => i.businessId === businessId).map((i) => ({ id: i.id, email: i.email, role: i.role, status: "invited" as const }));
    return ok([...people.sort((a, b) => Number(b.role === "owner") - Number(a.role === "owner")), ...invited]);
  },

  async invite(businessId, email, role) {
    await wait();
    if (!ownerOf(businessId)) return fail("not-owner");
    if (!isEmail(email)) return fail("invalid-email");
    const e = normEmail(email);
    const d = db();
    const u = d.users.find((x) => x.email === e);
    if (u && d.roles.some((r) => r.userId === u.id && r.businessId === businessId)) return fail("email-taken", "They're already on your team.");
    saveDb({ ...d, invites: [...d.invites.filter((i) => !(i.email === e && i.businessId === businessId)), { id: randomId("inv"), email: e, businessId, role, at: Date.now(), by: getAuthState().partner!.userId }] });
    return ok({ demo: true });
  },

  async removeFromTeam(businessId, entry) {
    await wait(150);
    if (!ownerOf(businessId)) return fail("not-owner");
    const d = db();
    if (entry.status === "invited") {
      saveDb({ ...d, invites: d.invites.filter((i) => i.id !== entry.id) });
      return ok(undefined);
    }
    const owners = d.roles.filter((r) => r.businessId === businessId && r.role === "owner");
    if (entry.role === "owner" && owners.length <= 1) return fail("last-owner");
    saveDb({ ...d, roles: d.roles.filter((r) => !(r.businessId === businessId && r.userId === entry.id)) });
    publish();
    return ok(undefined);
  },

  async issue(placeId) {
    if (!getAuthState().member) return fail("unknown");
    const r = mock.issue(placeId);
    return r ? ok(r.id) : fail("unknown");
  },

  async cancel(id) {
    mock.cancel(id);
  },

  async confirm(placeId, raw): Promise<ConfirmOutcome> {
    await wait(250);
    const code = raw.replace(/\D/g, "");
    const me = getAuthState().partner;
    if (!me || !me.businesses.some((b) => b.placeIds.includes(placeId))) return { result: "not-allowed", code };
    const key = `confirm:${me.userId}`;
    if (limited(key, 6)) return { result: "rate-limited", code };
    const s = getState();
    const now = Date.now();
    const r = s.redemptions
      .filter((x) => x.code === code && !x.remote && x.status !== "cancelled")
      .sort((a, b) => b.issuedAt - a.issuedAt)[0];
    if (/^\d{6}$/.test(code) && !r) {
      // Not on this phone: ask the member's phone that holds it (demo accounts on two phones).
      const far = await askMemberPhone(placeId, code, me.userId);
      if (far && far.result === "ok") {
        const p0 = place(getState(), placeId);
        mock.add({ id: `${now}-${code}`, partnerId: placeId, code, issuedAt: now, status: "confirmed", confirmedAt: Date.now(), saving: p0?.settings.saving ?? 0, offer: far.offer, memberName: far.memberName, confirmedBy: me.userId, remote: true });
      }
      if (far) {
        if (far.result === "unknown") note(key);
        return far;
      }
    }
    if (!/^\d{6}$/.test(code) || !r) {
      note(key);
      return { result: "unknown", code };
    }
    if (r.partnerId !== placeId) return { result: "wrong-place", code };
    if (r.status === "confirmed") return { result: "used", code };
    if (!isLive(r, now)) return { result: "expired", code };
    const p = place(s, placeId);
    if (!p) return { result: "unknown", code };
    if (p.settings.paused) return { result: "paused", code };
    if (usesLeft(s, p, r.memberId) === 0) return { result: "used-up", code };
    if (!mock.confirm(r.id, me.userId)) return { result: "used", code };
    const after = getState();
    return { result: "ok", code, offer: r.offer, memberName: r.memberName || "Member", usesLeft: usesLeft(after, p, r.memberId), usesPerYear: p.settings.usesPerYear };
  },

  async refresh() {
    /* everything is already in the store */
  },

  async updateOffer(placeId, patch) {
    const me = getAuthState().partner;
    if (!me?.businesses.some((b) => b.role === "owner" && b.placeIds.includes(placeId))) return fail("not-owner");
    if (placeId === OWNER_ID) mock.updateOwnerOffer(patch);
    else mock.updateOffer(placeId, patch);
    return ok(undefined);
  },
};

/** Nida's meeting demo: sign in as the demo member and as the owner of the meeting's place, no typing. */
export function startLocalDemo() {
  saveSessions({ member: { userId: ALEX_ID, demo: true }, partner: { userId: MEETING_USER, placeId: OWNER_ID, demo: true } });
}

/** For the meeting's "New meeting": the visits go, the demo sessions stay. */
export const localDemoUserIds = { member: ALEX_ID, owner: MEETING_USER };
