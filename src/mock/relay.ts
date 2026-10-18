"use client";

/*
 * Demo accounts on two phones. With demo accounts, a member's code lives on
 * the member's phone only, so a staff phone scanning it has nothing to look
 * it up in. This relay lets the staff phone ask: it sends the code on a
 * Supabase Realtime channel (public key, broadcast messages only, nothing is
 * stored), and the member's phone that holds the code checks it, marks it
 * Redeemed and answers. Real accounts (Supabase mode) don't need this: the
 * database checks codes.
 *
 * Messages on the channel "t6p-codes":
 *   ask    {nonce, placeId, code, staffId}         staff -> every phone
 *   answer {nonce, outcome}                       the member's phone -> staff
 */
import type { ConfirmOutcome } from "@/lib/auth/types";
import { CODE_LIFE_MS, currentMemberId, getState, isLive, mock, place, subscribeStore, usesLeft } from "./store";
import { haptic } from "./ui";

type Handler = (event: string, payload: Record<string, unknown>) => void;

function socketUrl() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return null;
  return `${base.replace(/^http/, "ws")}/realtime/v1/websocket?apikey=${encodeURIComponent(key)}&vsn=1.0.0`;
}

/** One connection to the "t6p-codes" channel, shared by both sides. */
class Link {
  private ws: WebSocket | null = null;
  private ref = 0;
  private joinRef = "";
  private beat: number | null = null;
  joined = false;
  private waiters: (() => void)[] = [];
  readonly handlers = new Set<Handler>();

  open() {
    const url = socketUrl();
    if (!url || (this.ws && this.ws.readyState <= 1)) return;
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      return;
    }
    this.ws = ws;
    ws.onopen = () => {
      this.joinRef = String(++this.ref);
      ws.send(JSON.stringify({ topic: "realtime:t6p-codes", event: "phx_join", payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" }, private: false } }, ref: this.joinRef }));
    };
    ws.onmessage = (m) => {
      let d: { event?: string; ref?: string; payload?: { status?: string; event?: string; payload?: Record<string, unknown> } };
      try {
        d = JSON.parse(String(m.data));
      } catch {
        return;
      }
      if (d.event === "phx_reply" && d.ref === this.joinRef && d.payload?.status === "ok") {
        this.joined = true;
        this.waiters.splice(0).forEach((w) => w());
      } else if (d.event === "broadcast" && d.payload?.event) {
        const { event, payload } = d.payload;
        this.handlers.forEach((h) => h(event, payload ?? {}));
      }
    };
    ws.onclose = () => {
      this.joined = false;
      this.ws = null;
    };
    ws.onerror = () => ws.close();
    if (this.beat) window.clearInterval(this.beat);
    this.beat = window.setInterval(() => {
      if (this.ws?.readyState === 1) this.ws.send(JSON.stringify({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++this.ref) }));
    }, 25_000);
  }

  /** Open if needed and wait until joined (false after the time limit). */
  ready(ms: number) {
    this.open();
    if (this.joined) return Promise.resolve(true);
    return new Promise<boolean>((res) => {
      const t = window.setTimeout(() => res(false), ms);
      this.waiters.push(() => {
        window.clearTimeout(t);
        res(true);
      });
    });
  }

  send(event: string, payload: Record<string, unknown>) {
    if (!this.joined || this.ws?.readyState !== 1) return false;
    this.ws.send(JSON.stringify({ topic: "realtime:t6p-codes", event: "broadcast", payload: { type: "broadcast", event, payload }, ref: String(++this.ref) }));
    return true;
  }

  close() {
    if (this.beat) window.clearInterval(this.beat);
    this.beat = null;
    this.joined = false;
    this.ws?.close();
    this.ws = null;
  }
}

let link: Link | null = null;
const getLink = () => (link ??= new Link());

/* ---------- Member side: answer for codes on this phone ---------- */

/** This member's codes from the last 10 minutes (live, or just confirmed so a second scan hears "Already used"). */
function myRecentCodes() {
  const me = currentMemberId();
  if (!me) return [];
  const now = Date.now();
  return getState().redemptions.filter((r) => r.memberId === me && !r.remote && r.status !== "cancelled" && now - r.issuedAt < CODE_LIFE_MS);
}

function answer(p: Record<string, unknown>) {
  const nonce = String(p.nonce ?? "");
  const code = String(p.code ?? "");
  const placeId = String(p.placeId ?? "");
  if (!nonce || !/^\d{6}$/.test(code)) return;
  const r = myRecentCodes().find((x) => x.code === code);
  if (!r) return;
  const reply = (outcome: ConfirmOutcome) => link?.send("answer", { nonce, outcome });
  const s = getState();
  if (r.partnerId !== placeId) return reply({ result: "wrong-place", code });
  if (r.status === "confirmed") return reply({ result: "used", code });
  if (!isLive(r, Date.now())) return reply({ result: "expired", code });
  const p0 = place(s, placeId);
  if (!p0) return reply({ result: "unknown", code });
  if (p0.settings.paused) return reply({ result: "paused", code });
  if (usesLeft(s, p0) === 0) return reply({ result: "used-up", code });
  if (!mock.confirm(r.id, String(p.staffId ?? "") || undefined)) return reply({ result: "used", code });
  haptic("success");
  const after = getState();
  reply({ result: "ok", code, offer: r.offer, memberName: r.memberName || "Member", usesLeft: usesLeft(after, p0), usesPerYear: p0.settings.usesPerYear });
}

const onMemberEvent: Handler = (event, p) => {
  if (event === "ask") answer(p);
};

/** Started once by the app shell: stay on the channel while this phone has a recent code. */
export function startCodeRelay() {
  if (!socketUrl()) return () => {};
  const sync = () => {
    const want = myRecentCodes().length > 0;
    const l = getLink();
    if (want) {
      l.handlers.add(onMemberEvent);
      l.open();
    } else {
      l.handlers.delete(onMemberEvent);
      if (!l.handlers.size) l.close();
    }
  };
  sync();
  const stop = subscribeStore(sync);
  const tick = window.setInterval(sync, 15_000);
  const wake = () => {
    if (document.visibilityState === "visible") sync();
  };
  document.addEventListener("visibilitychange", wake);
  return () => {
    stop();
    window.clearInterval(tick);
    document.removeEventListener("visibilitychange", wake);
  };
}

/* ---------- Staff side: ask the member's phone ---------- */

/**
 * Ask whichever phone holds this code. Resolves with that phone's answer,
 * null if no phone answered (no such code), or "offline" if this phone
 * can't reach the channel.
 */
export async function askMemberPhone(placeId: string, code: string, staffId: string): Promise<ConfirmOutcome | null> {
  if (!socketUrl()) return { result: "offline", code };
  const l = getLink();
  if (!(await l.ready(5000))) return { result: "offline", code };
  const nonce = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((res) => {
    let tries = 0;
    let timer = 0;
    const done = (v: ConfirmOutcome | null) => {
      window.clearInterval(timer);
      l.handlers.delete(h);
      res(v);
    };
    const h: Handler = (event, p) => {
      if (event === "answer" && p.nonce === nonce && p.outcome && typeof p.outcome === "object") done(p.outcome as ConfirmOutcome);
    };
    l.handlers.add(h);
    const ask = () => l.send("ask", { nonce, placeId, code, staffId });
    ask();
    // Ask a few times: the member's phone may be joining the channel just now.
    timer = window.setInterval(() => {
      if (++tries >= 6) return done(null);
      ask();
    }, 1000);
  });
}
