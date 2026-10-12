/*
 * Shared engine for the three comparison prototypes (a.html, b.html, c.html).
 * Same flow and data in each: member home -> their place -> Redeem -> code ->
 * staff Confirm -> Redeemed -> owner dashboard with the visit "Just now".
 * Each page supplies its own templates (T) and styles. Static, no server.
 * Places are made up. "Lantern House" stands in for the owner's own place.
 */
const IMG = (id) => `../../../public/demo/${id}-1200.webp`;

const DATA = {
  mine: {
    id: "lantern-house", name: "Lantern House", kind: "Restaurant", hood: "Ossington",
    offer: "Second main, on us", detail: "Order two mains and the second one is on the house.",
    days: [false, true, true, true, false, false, true], uses: 2,
  },
  others: [
    { id: "marigold-room", name: "Marigold Room", kind: "Restaurant", hood: "King West", offer: "Second main, on us", tag: "2 for 1" },
    { id: "quiet-hours", name: "Quiet Hours Spa", kind: "Spa", hood: "Yorkville", offer: "A free upgrade on your treatment", tag: "Free upgrade" },
    { id: "morning-light", name: "Morning Light Yoga", kind: "Studio", hood: "Leslieville", offer: "Bring a friend to class, free", tag: "2 for 1" },
    { id: "half-past-nine", name: "Half Past Nine Café", kind: "Café", hood: "Leslieville", offer: "Second brunch plate, on us", tag: "2 for 1" },
  ],
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysText = (d) => {
  const on = d.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
  const runs = [];
  for (const i of on) { const l = runs[runs.length - 1]; if (l && l[l.length - 1] === i - 1) l.push(i); else runs.push([i]); }
  return runs.map((r) => (r.length >= 3 ? `${DAYS[r[0]]} to ${DAYS[r[r.length - 1]]}` : r.map((i) => DAYS[i]).join(", "))).join(", ");
};

const S = { screen: "home", code: null, issuedAt: 0, visits: [], paused: false, used: 0 };
const newCode = () => String(Math.floor(100000 + Math.random() * 900000));
const split = (c) => `${c.slice(0, 3)} ${c.slice(3)}`;
const timer = () => { const left = Math.max(0, 600 - Math.floor((Date.now() - S.issuedAt) / 1000)); return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; };
const ago = (t) => { const s = Math.floor((Date.now() - t) / 1000); return s < 60 ? "Just now" : `${Math.floor(s / 60)} min ago`; };

const ACT = {
  go: (s) => { S.screen = s; render(true); },
  redeem: () => { if (S.paused) return; if (!S.code) { S.code = newCode(); S.issuedAt = Date.now(); } ACT.go("code"); },
  confirm: () => { S.visits.unshift({ code: S.code, at: Date.now(), offer: DATA.mine.offer }); S.used += 1; S.code = null; ACT.go("done"); },
  pause: () => { S.paused = !S.paused; render(); },
  reset: () => { S.visits = []; S.used = 0; S.paused = false; S.code = null; ACT.go("home"); },
};

let T = null;
function render(scrollTop = false) {
  const root = document.getElementById("app");
  root.innerHTML = T[S.screen]({ S, D: DATA, daysText, split, ago, timer, IMG });
  root.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => ACT.go(el.dataset.go)));
  root.querySelectorAll("[data-act]").forEach((el) => el.addEventListener("click", () => ACT[el.dataset.act]()));
  if (scrollTop) root.querySelector(".scroll")?.scrollTo(0, 0);
}
function startProto(templates) {
  T = templates;
  const s = new URLSearchParams(location.search).get("s");
  // Screenshot helper: ?s=done etc. sets up a believable state.
  if (s === "code") { S.code = "268380"; S.issuedAt = Date.now(); }
  if (s === "done" || s === "owner") { S.visits = [{ code: "268380", at: Date.now(), offer: DATA.mine.offer }]; S.used = 1; }
  if (s) S.screen = s;
  render();
  // Tick only the live bits, so scrolling isn't disturbed.
  setInterval(() => {
    document.querySelectorAll("[data-ago]").forEach((el) => { el.textContent = ago(+el.dataset.ago); });
    document.querySelectorAll("[data-timer]").forEach((el) => {
      const left = Math.max(0, 600 - Math.floor((Date.now() - S.issuedAt) / 1000));
      el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    });
  }, 1000);
}

// Line icons, drawn here so the prototypes need nothing else.
const I = {
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  cal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
  repeat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 014-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 01-4 4H4"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z"/></svg>',
  explore: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" stroke-linejoin="round"/></svg>',
  pass: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/></svg>',
  store: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/></svg>',
};
const STATUS = '<div class="status"><span>9:41</span><span style="display:flex;gap:6px;align-items:center"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" width="3" height="12" rx="1"/></svg><svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/></svg></span></div>';
const TABS = (on) => `<nav class="tabbar">${[["home", "explore", "Explore"], ["pass", "pass", "My pass"], ["owner", "store", "Owner"]].map(([s, i, l]) => `<button class="tab ${s === on ? "on" : ""}" ${s === "pass" ? "" : `data-go="${s}"`} aria-current="${s === on ? "page" : "false"}">${I[i]}${l}</button>`).join("")}</nav><span class="homebar"></span>`;
