"use client";

/*
 * State for the phone app mock at /app. Kept in this browser's
 * localStorage so refresh, Back and closing the window all keep where
 * you were. Two windows of /app stay in sync (the "storage" event), so
 * the member side and the partner side can sit next to each other.
 * Nothing here talks to a server.
 */
import { useSyncExternalStore } from "react";
import { HOME_PARTNER_ID, OFFER_PRESETS, PARTNERS, TODAY, type Partner } from "@/demo/data";
import type { PlaceDetails } from "@/demo/places";
import { OWNER_CATEGORIES, OWNER_COLOURS, OWNER_ID, categoryLabel, detailFor, type OwnerCategory, type OwnerDraft, type OwnerPlace } from "./owner";
import { getAuthState } from "@/lib/auth/state";

export const CODE_LIFE_MS = 10 * 60 * 1000;
/** The demo always pretends today is Tuesday, March 23, 2027 (a Tuesday after launch). */
export const DEMO_DATE = "2027-03-23";
const KEY = "t6p_app_mock_v1";

export type OfferKind = "two_for_one" | "upgrade";

export type OfferSettings = {
  kind: OfferKind;
  offer: string;
  detail: string;
  saving: number;
  days: boolean[];
  usesPerYear: number;
  blackoutDates: string[];
  /** The venue paused the offer: members see "Paused by the venue" and can't redeem. */
  paused?: boolean;
};

export type Redemption = {
  id: string;
  partnerId: string;
  code: string;
  issuedAt: number;
  status: "issued" | "confirmed" | "cancelled";
  confirmedAt?: number;
  saving: number;
  /** The offer as it was when redeemed, so editing the offer later doesn't rewrite history. */
  offer: string;
  /** The member who asked for the code (their account id). Missing on visits from before accounts. */
  memberId?: string;
  /** First name, for staff ("Confirmed for Alex"). */
  memberName?: string;
  /** Who confirmed it (staff account id), for the owner's records. */
  confirmedBy?: string;
  /** Two phones, staff side: a visit by a member on another phone. Never counts against this phone's member. */
  remote?: boolean;
  /** Supabase: the server's id for this redemption. */
  serverId?: string;
};

/**
 * A place that exists only in the database (real accounts): added by a new
 * business from the app, or by us. Its offer lives in `offers` like any other.
 * Unpublished ones are only ever loaded for their own team.
 */
export type ServerPlace = {
  id: string;
  name: string;
  neighbourhood: string;
  category: OwnerCategory | null;
  published: boolean;
};

export type MockState = {
  v: 1;
  offers: Record<string, OfferSettings>;
  used: Record<string, number>;
  redemptions: Redemption[];
  /** Which place the partner view is showing. */
  partnerId: string;
  /** The owner's own place, set up in the onboarding or Nida's quick setup sheet. */
  owner?: OwnerPlace | null;
  /** The onboarding in progress, so a refresh picks up on the same step. */
  draft?: { step: number; data: OwnerDraft } | null;
  /** Real accounts: places from the database that aren't built into the app. */
  serverPlaces?: ServerPlace[];
  /** When the database's places last arrived (0 or missing: not yet on this device). */
  serverPlacesAt?: number;
};

export type Place = Partner & {
  settings: OfferSettings;
  /** Owner's place only: their photo (data URL) and colour, used instead of `image`. */
  photo?: string;
  colour?: string;
  /** Owner's place only: what they're known for, e.g. a signature dish. */
  dish?: string;
  isOwner?: boolean;
  /** Menu, hours, address and photos. The demo places have them; the owner's place doesn't. */
  details?: PlaceDetails;
  /** From the database, not built into the app. */
  fromServer?: boolean;
  /** False only for a database place that The 6 Pass hasn't approved yet (its team sees it, members don't). */
  published?: boolean;
};

/** Places built into the app (and the meeting demo's own place): their pages are made at build time. */
const BUILT_IN = new Set([OWNER_ID, ...PARTNERS.map((p) => p.id)]);
export const isBuiltInPlace = (id: string) => BUILT_IN.has(id);

const kindOf = (p: Partner): OfferKind => (/upgrade|add-on|longer/i.test(p.offer + p.detail) ? "upgrade" : "two_for_one");

function initial(): MockState {
  return {
    v: 1,
    offers: Object.fromEntries(
      PARTNERS.map((p) => [
        p.id,
        { kind: kindOf(p), offer: p.offer, detail: p.detail, saving: p.saving, days: [...p.days], usesPerYear: p.usesPerYear, blackoutDates: [] },
      ]),
    ),
    used: {},
    redemptions: [],
    partnerId: HOME_PARTNER_ID,
    owner: null,
    draft: null,
  };
}

const SERVER_STATE = initial();
let cache: MockState | null = null;
const listeners = new Set<() => void>();

function read(): MockState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as MockState;
      if (saved && saved.v === 1) {
        const base = initial();
        cache = { ...base, ...saved, offers: { ...base.offers, ...saved.offers } };
        return cache;
      }
    }
  } catch {
    /* storage blocked or corrupt: start fresh */
  }
  cache = initial();
  return cache;
}

function write(next: MockState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode or full: the demo still works for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** The current state, outside React (the two-phone link reads it). */
export const getState = () => read();
/** Watch the store outside React (the demo code relay uses it). */
export const subscribeStore = subscribe;

export function useMock() {
  return useSyncExternalStore(subscribe, read, () => SERVER_STATE);
}

/* ---------- Derived values ---------- */

function ownerPlace(s: MockState): Place | null {
  const o = s.owner;
  const settings = s.offers[OWNER_ID];
  if (!o || !settings) return null;
  const cat = OWNER_CATEGORIES.find((c) => c.id === o.category) ?? OWNER_CATEGORIES[0];
  return {
    id: OWNER_ID,
    name: o.name,
    category: cat.appCategory,
    kind: categoryLabel(o.category),
    neighbourhood: o.neighbourhood,
    blurb: "",
    offer: settings.offer,
    detail: settings.detail,
    days: settings.days,
    usesPerYear: settings.usesPerYear,
    saving: 0,
    founding: true,
    image: "",
    settings,
    photo: o.photo,
    colour: o.colour,
    dish: o.dish?.trim() || undefined,
    isOwner: true,
  };
}

/** A database place, drawn like the owner's place: no photo, a quiet colour tile with its initial. */
function serverPlace(s: MockState, sp: ServerPlace): Place | null {
  const settings = s.offers[sp.id];
  if (!settings) return null;
  const cat = OWNER_CATEGORIES.find((c) => c.id === sp.category);
  let h = 0;
  for (const ch of sp.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return {
    id: sp.id,
    name: sp.name,
    category: cat?.appCategory ?? "Experiences",
    kind: cat ? categoryLabel(cat.id) : "Partner",
    neighbourhood: sp.neighbourhood,
    blurb: "",
    offer: settings.offer,
    detail: settings.detail,
    days: settings.days,
    usesPerYear: settings.usesPerYear,
    saving: settings.saving,
    founding: false,
    image: "",
    settings,
    colour: OWNER_COLOURS[h % OWNER_COLOURS.length].hex,
    fromServer: true,
    published: sp.published,
  };
}

/** Every place, with the owner's own place first when there is one, then the database's own places. */
export function places(s: MockState): Place[] {
  const own = ownerPlace(s);
  const rest = PARTNERS.map((p) => {
    const settings = s.offers[p.id] ?? initial().offers[p.id];
    // Copy the offer fields over the seed, but not `kind`: on a place that's
    // the type of place ("Dinner"), on the settings it's the offer type.
    return { ...p, offer: settings.offer, detail: settings.detail, saving: settings.saving, days: settings.days, usesPerYear: settings.usesPerYear, settings };
  });
  const extra = (s.serverPlaces ?? []).filter((sp) => !BUILT_IN.has(sp.id)).flatMap((sp) => serverPlace(s, sp) ?? []);
  return own ? [own, ...rest, ...extra] : [...rest, ...extra];
}

/** What members can browse: every place except database places still waiting for approval. */
export const listedPlaces = (s: MockState) => places(s).filter((p) => p.published !== false);

export function place(s: MockState, id: string): Place | undefined {
  return places(s).find((p) => p.id === id);
}

/** The member signed in on this device, if any. Codes and uses belong to them. */
export const currentMemberId = () => getAuthState().member?.userId;

/** Visits this member has used at a place (this demo's year). */
export function usedBy(s: MockState, placeId: string, memberId = currentMemberId()) {
  return s.redemptions.filter((r) => r.partnerId === placeId && r.status === "confirmed" && !r.remote && r.memberId === memberId).length;
}

export function usesLeft(s: MockState, p: Place, memberId = currentMemberId()) {
  return Math.max(0, p.settings.usesPerYear - usedBy(s, p.id, memberId));
}

export type Block = { reason: "paused" | "blackout" | "not-today" | "used-up"; message: string } | null;

export function blockFor(s: MockState, p: Place, nextDayName: string): Block {
  if (p.settings.paused) return { reason: "paused", message: "Paused by the venue" };
  if (usesLeft(s, p) === 0) return { reason: "used-up", message: "You've used this one for the year." };
  if (p.settings.blackoutDates.includes(DEMO_DATE)) return { reason: "blackout", message: "Not running today. It's a blackout date." };
  // In a meeting the owner's place always runs "today", whichever days they picked,
  // so the redeem never dead-ends. The other places keep the Tuesday story.
  if (!p.isOwner && !p.settings.days[TODAY]) return { reason: "not-today", message: `Not running today. Next: ${nextDayName}.` };
  return null;
}

/** The redemption a member sees for a place: the latest one that wasn't cancelled. */
export function latestFor(s: MockState, id: string, memberId = currentMemberId()) {
  return [...s.redemptions].reverse().find((r) => r.partnerId === id && r.status !== "cancelled" && !r.remote && r.memberId === memberId);
}

export const isLive = (r: Redemption, now: number) => r.status === "issued" && now - r.issuedAt < CODE_LIFE_MS;

export const offerLabel = (p: Place) =>
  p.settings.kind === "two_for_one" ? "2 for 1" : p.settings.offer === OFFER_PRESETS.find((o) => o.id === "upgrade")?.offer ? "Free add-on" : "Free upgrade";

/* ---------- Actions ---------- */

/** A random 6-digit code that isn't already live on this device. */
function newCode(s: MockState) {
  const now = Date.now();
  for (;;) {
    const c = String(Math.floor(100000 + Math.random() * 900000));
    if (!s.redemptions.some((r) => r.code === c && isLive(r, now))) return c;
  }
}

export const mock = {
  /** Issue a code, or return the one already live for this place. */
  issue(id: string): Redemption | null {
    const s = read();
    const p = place(s, id);
    if (!p) return null;
    const now = Date.now();
    const me = getAuthState().member;
    const existing = s.redemptions.find((r) => r.partnerId === id && isLive(r, now) && !r.remote && r.memberId === me?.userId);
    if (existing) return existing;
    const r: Redemption = { id: `${now}-${Math.floor(Math.random() * 1e6)}`, partnerId: id, code: newCode(s), issuedAt: now, status: "issued", saving: p.settings.saving, offer: p.settings.offer, memberId: me?.userId, memberName: me?.firstName || undefined };
    write({ ...s, redemptions: [...s.redemptions, r] });
    return r;
  },
  confirm(redemptionId: string, confirmedBy?: string) {
    const s = read();
    const r = s.redemptions.find((x) => x.id === redemptionId);
    if (!r || !isLive(r, Date.now())) return false;
    write({
      ...s,
      redemptions: s.redemptions.map((x) => (x.id === redemptionId ? { ...x, status: "confirmed", confirmedAt: Date.now(), confirmedBy } : x)),
      used: { ...s.used, [r.partnerId]: (s.used[r.partnerId] ?? 0) + 1 },
    });
    return true;
  },
  /** Two phones, member side: the staff phone confirmed this code. */
  confirmByCode(code: string) {
    const r = read().redemptions.find((x) => x.code === code && isLive(x, Date.now()));
    return r ? mock.confirm(r.id) : false;
  },
  /** Two phones, staff side: a member's code was confirmed here, so it shows on this phone's dashboard. */
  recordVisit(code: string) {
    const s = read();
    const settings = s.offers[OWNER_ID];
    if (!s.owner || !settings || s.redemptions.some((x) => x.code === code && x.status === "confirmed")) return;
    const now = Date.now();
    const r: Redemption = { id: `${now}-${code}`, partnerId: OWNER_ID, code, issuedAt: now, status: "confirmed", confirmedAt: now, saving: settings.saving, offer: settings.offer, remote: true };
    write({ ...s, redemptions: [...s.redemptions, r], used: { ...s.used, [OWNER_ID]: (s.used[OWNER_ID] ?? 0) + 1 } });
  },
  /** Staff typed a code instead of tapping: find it among live codes at this place. */
  confirmCode(partnerId: string, code: string) {
    const r = read().redemptions.find((x) => x.partnerId === partnerId && x.code === code.replace(/\D/g, "") && isLive(x, Date.now()));
    return r ? mock.confirm(r.id) : false;
  },
  cancel(redemptionId: string) {
    const s = read();
    write({ ...s, redemptions: s.redemptions.map((x) => (x.id === redemptionId && x.status === "issued" ? { ...x, status: "cancelled" } : x)) });
  },
  updateOffer(id: string, patch: Partial<OfferSettings>) {
    const s = read();
    const cur = s.offers[id];
    if (!cur) return;
    write({ ...s, offers: { ...s.offers, [id]: { ...cur, ...patch } } });
  },
  /** Supabase: put the server's redemptions for this member or place into the store (replacing older copies). */
  mergeServer(list: Redemption[], scope: { memberId?: string; placeId?: string }) {
    const s = read();
    const ids = new Set(list.map((r) => r.serverId));
    const keep = s.redemptions.filter((r) => {
      if (!r.serverId) return true;
      if (ids.has(r.serverId)) return false;
      // Drop server copies in the same scope that the server no longer returns.
      if (scope.memberId && r.memberId === scope.memberId) return false;
      if (scope.placeId && r.partnerId === scope.placeId && r.status === "confirmed") return false;
      return true;
    });
    const local = new Map(s.redemptions.filter((r) => r.serverId).map((r) => [r.serverId, r]));
    // Keep the plain code we were given when the code was issued: the server only stores a hash.
    const merged = list.map((r) => ({ ...r, code: r.code || local.get(r.serverId)?.code || "" }));
    write({ ...s, redemptions: [...keep, ...merged] });
  },
  /** Supabase: the offers as the database has them. */
  setOffers(patch: Record<string, Partial<OfferSettings>>) {
    const s = read();
    const offers = { ...s.offers };
    for (const [id, p] of Object.entries(patch)) if (offers[id]) offers[id] = { ...offers[id], ...p };
    write({ ...s, offers });
  },
  /** Supabase: the database's own places (not built into the app) and their offers. Replaces the last list. */
  setServerPlaces(list: (ServerPlace & { settings: OfferSettings })[]) {
    const s = read();
    const offers = { ...s.offers };
    for (const old of s.serverPlaces ?? []) if (!BUILT_IN.has(old.id)) delete offers[old.id];
    const keep = list.filter((p) => !BUILT_IN.has(p.id));
    for (const p of keep) offers[p.id] = p.settings;
    write({ ...s, offers, serverPlaces: keep.map(({ id, name, neighbourhood, category, published }) => ({ id, name, neighbourhood, category, published })), serverPlacesAt: Date.now() });
  },
  /** Add a redemption made somewhere else (Supabase issue). */
  add(r: Redemption) {
    const s = read();
    write({ ...s, redemptions: [...s.redemptions.filter((x) => x.id !== r.id), r] });
  },
  setStatus(id: string, patch: Partial<Redemption>) {
    const s = read();
    write({ ...s, redemptions: s.redemptions.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  },
  /** Forget a member's codes and visits on this device (account deleted). Visits stay on the place's side, without the name. */
  forgetMember(memberId: string) {
    const s = read();
    write({ ...s, redemptions: s.redemptions.map((r) => (r.memberId === memberId ? { ...r, memberId: "deleted", memberName: undefined, status: r.status === "issued" ? "cancelled" : r.status } : r)) });
  },
  setPartner(id: string) {
    write({ ...read(), partnerId: id });
  },
  /** Save the onboarding (or quick setup) as the owner's place: a Founding Partner, shown first. */
  saveOwner(d: OwnerDraft) {
    const s = read();
    const { kind, offer, days, usesPerYear, blackoutDates, ...place } = d;
    const prev = s.offers[OWNER_ID];
    const settings: OfferSettings = { kind, offer: offer.trim(), detail: detailFor(d.category, kind, offer), saving: 0, days, usesPerYear, blackoutDates, paused: prev?.paused ?? false };
    write({ ...s, owner: { ...place, name: place.name.trim() }, offers: { ...s.offers, [OWNER_ID]: settings }, partnerId: OWNER_ID, draft: null });
  },
  /** Change the owner's offer from the dashboard. Keeps the detail line honest. */
  updateOwnerOffer(patch: Partial<OfferSettings>) {
    const s = read();
    const cur = s.offers[OWNER_ID];
    if (!cur || !s.owner) return;
    const next = { ...cur, ...patch };
    if (patch.offer !== undefined || patch.kind !== undefined) next.detail = detailFor(s.owner.category, next.kind, next.offer);
    write({ ...s, offers: { ...s.offers, [OWNER_ID]: next } });
  },
  setDraft(step: number, data: OwnerDraft) {
    write({ ...read(), draft: { step, data } });
  },
  clearDraft() {
    write({ ...read(), draft: null });
  },
  /** "New meeting": wipe the owner's place, visits and history for the next restaurant. */
  reset() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    write(initial());
  },
};
