"use client";

/*
 * Two phones, live. One phone is the member, the other is the place's staff.
 * They meet in a "room" (4 letters, shown on the staff phone) on Supabase
 * Realtime, using the public key and broadcast messages only: nothing is
 * stored in the database, and the waitlist is never touched.
 *
 * Messages (all small JSON):
 *   hello  {role}           a phone joined; the other replies
 *   ping   {role}           every few seconds, so each side knows the other is there
 *   place  {draft, photo}   staff -> member: the place, so the member's app shows it
 *   code   {code, issuedAt} member -> staff: a code is on screen (resent until confirmed)
 *   confirmed {code}        staff -> member: staff confirmed it
 */
import { useSyncExternalStore } from "react";
import { getState, mock } from "./store";
import { OWNER_ID, type OwnerDraft } from "./owner";
import { haptic } from "./ui";

export type LiveRole = "member" | "staff";
export type LiveSettings = { role: LiveRole; room: string };
export type LiveStatus = "off" | "connecting" | "live" | "offline";

const KEY = "t6p_live";
const CODE_LIFE_MS = 10 * 60 * 1000;
const PEER_MS = 12_000;
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/* ---------- Settings (which role, which room), kept on this phone ---------- */

let settingsCache: LiveSettings | null | undefined;
const settingsListeners = new Set<() => void>();

export function readLive(): LiveSettings | null {
  if (settingsCache !== undefined) return settingsCache;
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
    settingsCache = v && (v.role === "member" || v.role === "staff") && /^[A-Z2-9]{4}$/.test(v.room) ? v : null;
  } catch {
    settingsCache = null;
  }
  return settingsCache ?? null;
}

export function setLive(next: LiveSettings | null) {
  settingsCache = next;
  try {
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* blocked storage: works until the app closes */
  }
  settingsListeners.forEach((l) => l());
}

export function useLiveSettings() {
  return useSyncExternalStore(
    (l) => {
      settingsListeners.add(l);
      return () => settingsListeners.delete(l);
    },
    readLive,
    () => null,
  );
}

export const newRoom = () => Array.from({ length: 4 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join("");
/** Room codes skip letters that look alike (no I, O, 0 or 1). */
export const cleanRoom = (s: string) => s.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, "").slice(0, 4);

/* ---------- Live state everyone can watch ---------- */

export type LiveView = {
  status: LiveStatus;
  /** The other phone was heard from in the last few seconds. */
  peer: boolean;
  /** Staff: codes members have on screen right now (only how many, never the digits). */
  waiting: number;
  /** Member: the place the staff phone shared. */
  placeName: string | null;
};
let view: LiveView = { status: "off", peer: false, waiting: 0, placeName: null };
const viewListeners = new Set<() => void>();
function setView(patch: Partial<LiveView>) {
  const next = { ...view, ...patch };
  if (Object.keys(next).every((k) => next[k as keyof LiveView] === view[k as keyof LiveView])) return;
  view = next;
  viewListeners.forEach((l) => l());
}
const OFF_VIEW = view;
export function useLiveView() {
  return useSyncExternalStore(
    (l) => {
      viewListeners.add(l);
      return () => viewListeners.delete(l);
    },
    () => view,
    () => OFF_VIEW,
  );
}

/* ---------- The connection: Phoenix protocol over a WebSocket ---------- */

type Handler = (event: string, payload: Record<string, unknown>) => void;

class Channel {
  private ws: WebSocket | null = null;
  private ref = 0;
  private joinRef = "";
  private joined = false;
  private closed = false;
  private retry = 0;
  private beat: number | null = null;
  private timer: number | null = null;
  private readonly topic: string;
  constructor(
    room: string,
    private readonly url: string,
    private readonly onEvent: Handler,
    private readonly onJoin: () => void,
  ) {
    this.topic = `realtime:t6p-room-${room}`;
  }
  connect() {
    if (this.closed || (this.ws && this.ws.readyState <= 1)) return;
    setView({ status: this.retry ? "offline" : "connecting" });
    let ws: WebSocket;
    try {
      ws = new WebSocket(this.url);
    } catch {
      return this.again();
    }
    this.ws = ws;
    ws.onopen = () => {
      this.joinRef = String(++this.ref);
      ws.send(JSON.stringify({ topic: this.topic, event: "phx_join", payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" }, private: false } }, ref: this.joinRef }));
    };
    ws.onmessage = (m) => {
      let d: { event?: string; ref?: string; payload?: { status?: string; event?: string; payload?: Record<string, unknown> } };
      try {
        d = JSON.parse(String(m.data));
      } catch {
        return;
      }
      if (d.event === "phx_reply" && d.ref === this.joinRef) {
        if (d.payload?.status === "ok") {
          this.joined = true;
          this.retry = 0;
          setView({ status: "live" });
          this.onJoin();
        }
      } else if (d.event === "broadcast" && d.payload?.event) {
        this.onEvent(d.payload.event, d.payload.payload ?? {});
      }
    };
    ws.onclose = () => {
      this.joined = false;
      if (!this.closed) this.again();
    };
    ws.onerror = () => ws.close();
    if (this.beat) window.clearInterval(this.beat);
    this.beat = window.setInterval(() => {
      if (this.ws?.readyState === 1) this.ws.send(JSON.stringify({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++this.ref) }));
    }, 25_000);
  }
  private again() {
    setView({ status: "offline", peer: false });
    if (this.timer || this.closed) return;
    const wait = Math.min(10_000, 800 * 2 ** this.retry++);
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.connect();
    }, wait);
  }
  /** Try again now (the app came back to the front). */
  wake() {
    if (this.closed) return;
    if (!this.ws || this.ws.readyState > 1) {
      if (this.timer) window.clearTimeout(this.timer);
      this.timer = null;
      this.connect();
    }
  }
  send(event: string, payload: Record<string, unknown>) {
    if (!this.joined || this.ws?.readyState !== 1) return false;
    this.ws.send(JSON.stringify({ topic: this.topic, event: "broadcast", payload: { type: "broadcast", event, payload }, ref: String(++this.ref) }));
    return true;
  }
  close() {
    this.closed = true;
    if (this.beat) window.clearInterval(this.beat);
    if (this.timer) window.clearTimeout(this.timer);
    this.ws?.close();
  }
}

function socketUrl() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return null;
  return `${base.replace(/^http/, "ws")}/realtime/v1/websocket?apikey=${encodeURIComponent(key)}&vsn=1.0.0`;
}
export const liveAvailable = () => !!socketUrl();

/* ---------- The link itself: started by <LiveLink /> in the app shell ---------- */

let channel: Channel | null = null;
let lastPlace = "";
let peerAt = 0;
/** Staff: codes members have on screen, and codes already confirmed. */
const pending = new Map<string, number>();
const done = new Set<string>();

function placePayload(): Record<string, unknown> | null {
  const s = getState();
  const o = s.owner;
  const st = s.offers[OWNER_ID];
  if (!o || !st) return null;
  const draft: OwnerDraft = { ...o, photo: "", kind: st.kind, offer: st.offer, days: st.days, usesPerYear: st.usesPerYear, blackoutDates: st.blackoutDates };
  return { role: "staff", draft, photo: smallPhoto ?? "", paused: !!st.paused };
}

/** The place photo, shrunk so it travels quickly. Made once per photo. */
let smallPhoto: string | null = null;
let smallFor = "";
function shrinkPhoto(src: string) {
  if (!src || src === smallFor) return;
  smallFor = src;
  smallPhoto = null;
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, 520 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * k);
    c.height = Math.round(img.height * k);
    c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    smallPhoto = c.toDataURL("image/jpeg", 0.72);
    channel?.send("place", placePayload() ?? {});
  };
  img.src = src;
}

function liveCodes() {
  const now = Date.now();
  return getState().redemptions.filter((r) => r.partnerId === OWNER_ID && r.status === "issued" && now - r.issuedAt < CODE_LIFE_MS);
}

function onEvent(role: LiveRole, event: string, p: Record<string, unknown>) {
  if (p.role && p.role !== role) {
    peerAt = Date.now();
    setView({ peer: true });
  }
  if (role === "staff") {
    if (event === "hello") channel?.send("place", placePayload() ?? {});
    if (event === "code" && typeof p.code === "string" && /^\d{6}$/.test(p.code) && !done.has(p.code)) {
      pending.set(p.code, typeof p.issuedAt === "number" ? p.issuedAt : Date.now());
      setView({ waiting: countWaiting() });
    }
    if (event === "cancel" && typeof p.code === "string") {
      pending.delete(p.code);
      setView({ waiting: countWaiting() });
    }
  } else {
    if (event === "hello") sendCodes();
    if (event === "place" && p.draft && typeof p.draft === "object") {
      const d = p.draft as OwnerDraft;
      if (typeof d.name === "string" && d.name.trim()) {
        const photo = typeof p.photo === "string" && p.photo.startsWith("data:image/") ? p.photo : (getState().owner?.photo ?? "");
        // Only save when something changed, so the member's app doesn't redraw every few seconds.
        const sig = JSON.stringify(d) + photo.length;
        if (sig !== lastPlace) {
          lastPlace = sig;
          mock.saveOwner({ ...d, photo });
        }
        mock.updateOwnerOffer({ paused: !!p.paused });
        setView({ placeName: d.name });
      }
    }
    if (event === "confirmed" && typeof p.code === "string") {
      if (mock.confirmByCode(p.code)) haptic("success");
    }
  }
}

function countWaiting() {
  const now = Date.now();
  for (const [c, at] of pending) if (now - at > CODE_LIFE_MS) pending.delete(c);
  return pending.size;
}

function sendCodes() {
  for (const r of liveCodes()) channel?.send("code", { role: "member", code: r.code, issuedAt: r.issuedAt });
}

/** Start or stop the link to match the settings. Returns a stop function. */
export function startLink(settings: LiveSettings | null) {
  channel?.close();
  channel = null;
  pending.clear();
  setView({ status: "off", peer: false, waiting: 0 });
  const url = socketUrl();
  if (!settings || !url) return () => {};
  const { role, room } = settings;
  if (role === "staff") shrinkPhoto(getState().owner?.photo ?? "");
  const ch = new Channel(room, url, (e, p) => onEvent(role, e, p), () => {
    ch.send("hello", { role });
    if (role === "staff") ch.send("place", placePayload() ?? {});
    else sendCodes();
  });
  channel = ch;
  ch.connect();
  // Every few seconds: say we're here, resend codes still waiting, notice a quiet peer.
  const tick = window.setInterval(() => {
    ch.send("ping", { role });
    if (role === "member") sendCodes();
    else setView({ waiting: countWaiting() });
    if (Date.now() - peerAt > PEER_MS) setView({ peer: false });
  }, 3000);
  const wake = () => document.visibilityState === "visible" && ch.wake();
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("online", wake);
  return () => {
    window.clearInterval(tick);
    document.removeEventListener("visibilitychange", wake);
    window.removeEventListener("online", wake);
    ch.close();
    if (channel === ch) channel = null;
  };
}

/** Member: a code just went on screen (or was cancelled). Tell the staff phone now rather than at the next tick. */
export function announceCodes() {
  if (readLive()?.role === "member") sendCodes();
}
export function announceCancel(code: string) {
  if (readLive()?.role === "member") channel?.send("cancel", { role: "member", code });
}

/** Staff: the place changed (set up, edited, paused). Send it to the member phone. */
export function sharePlace() {
  if (readLive()?.role !== "staff") return;
  shrinkPhoto(getState().owner?.photo ?? "");
  channel?.send("place", placePayload() ?? {});
}

export type ConfirmResult = "ok" | "unknown" | "used" | "expired" | "offline";

/** Staff: confirm a member's code, from the camera or typed. */
export function confirmCode(raw: string): ConfirmResult {
  const code = raw.replace(/\D/g, "");
  if (!/^\d{6}$/.test(code)) return "unknown";
  if (done.has(code)) return "used";
  const at = pending.get(code);
  if (at === undefined) return view.status === "live" ? "unknown" : "offline";
  if (Date.now() - at > CODE_LIFE_MS) {
    pending.delete(code);
    return "expired";
  }
  if (!channel?.send("confirmed", { role: "staff", code })) return "offline";
  // Say it twice in case one message is lost; the member side ignores a repeat.
  window.setTimeout(() => channel?.send("confirmed", { role: "staff", code }), 1200);
  pending.delete(code);
  done.add(code);
  mock.recordVisit(code);
  setView({ waiting: countWaiting() });
  return "ok";
}

/** What the member's QR code holds. */
export const qrText = (code: string) => `T6P:${code}`;
export const codeFromQr = (text: string) => /^T6P:(\d{6})$/.exec(text.trim())?.[1] ?? null;
