// Builds the partner deck (12 slides, 1920x1080) into all.html, one <section> per slide.
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("/home/user/6ixpass/package.json");
const QR = require("qrcode");

const D = "/tmp/claude-0/-home-user-cs135finalthrival/69d4b118-660b-5b16-b693-3c9fc98f6020/scratchpad/deck2";
const img = (n) => `file://${D}/img/${n}.jpg`;
const shot = (n) => `file://${D}/shots/${n}.jpg`;
const qr = await QR.toString("https://the6pass.ca/owners", { type: "svg", margin: 0, color: { dark: "#16140F", light: "#FFFFFF" } });

const INK = "#16140F", SUB = "#5E584F", MUTE = "#6E685E", COPPER = "#9A5A32", PAPER = "#FAF8F5", DARK = "#1B1A17", OK = "#2E7D57", LINE = "#E6E1D9";

const logo = (dark) => `<span class="logo" style="color:${dark ? "#F4F1EC" : INK}">the <i style="color:${dark ? "#FF6B5A" : "#E0382A"}">6</i> pass</span>`;
const foot = (n, dark) => `<footer>${logo(dark)}<span style="color:${dark ? "#B9B1A6" : MUTE}">${String(n).padStart(2, "0")}</span></footer>`;
const eyebrow = (t, dark) => `<p class="eyebrow" style="color:${dark ? "#D49A6A" : COPPER}">${t}</p>`;
const phone = (n, w, alt) => `<div class="phone" style="width:${w}px"><img src="${shot(n)}" alt="${alt}"></div>`;

const slides = [];
const add = (id, html, note) => slides.push({ id, html, note });

// 1 Cover
add("cover", `<section class="dark" style="padding:0">
  <img src="${img("juniper-table")}" alt="" style="position:absolute;right:0;top:0;width:1150px;height:1080px;object-fit:cover">
  <div style="position:absolute;right:0;top:0;width:1150px;height:1080px;background:linear-gradient(90deg,${DARK} 0%,rgba(27,26,23,.55) 30%,rgba(27,26,23,0) 60%)"></div>
  <div style="position:absolute;left:128px;top:0;bottom:0;width:860px;display:flex;flex-direction:column;justify-content:center;gap:44px">
    ${eyebrow("Founding Partners · Toronto · 2027", true)}
    <h1 style="font-size:200px;line-height:.9;letter-spacing:-5px">${logo(true)}</h1>
    <p class="lede" style="color:#D9D3C9;width:700px">A yearly membership for people who love going out in Toronto. Two-for-one at fifty hand-picked places.</p>
  </div>
  <p style="position:absolute;left:128px;bottom:72px;font-size:24px;color:#B9B1A6">Nida, Founder · hello@the6pass.ca</p>
</section>`, "Thanks for the time. Ten minutes on the screen, then I'll show you on the phone with your own place in it.");

// 2 Quiet nights
const week = [["Mon", 34], ["Tue", 26], ["Wed", 40], ["Thu", 62], ["Fri", 96], ["Sat", 100], ["Sun", 58]];
add("quiet", `<section class="split">
  <div class="col">
    ${eyebrow("The quiet nights")}
    <h2>Full on Friday. Quiet on Tuesday.</h2>
    <p class="lede">The kitchen, the staff and the rent cost the same every night. The 6 Pass sends members on the nights you choose.</p>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
    <div class="card" style="padding:56px 56px 40px">
      <div style="display:flex;align-items:flex-end;gap:28px;height:470px;border-bottom:2px solid ${INK}">
        ${week.map(([d, h]) => `<div style="flex:1;height:${h}%;border-radius:12px 12px 0 0;background:${d === "Tue" ? COPPER : d === "Fri" || d === "Sat" ? INK : "#D8D1C6"}"></div>`).join("")}
      </div>
      <div style="display:flex;gap:28px;margin-top:18px">${week.map(([d]) => `<p style="flex:1;text-align:center;font-size:26px;font-weight:${d === "Tue" ? 700 : 500};color:${d === "Tue" ? COPPER : SUB}">${d}</p>`).join("")}</div>
      <p class="small" style="margin-top:28px">How busy a week often looks. A picture of the pattern, not your numbers.</p>
    </div>
  </div>
  ${foot(2)}
</section>`, `Ask: "Which nights are slow for you?" Write it down. It decides their days later.`);

// 3 What it is
const offers = [["lantern-house", "Restaurants", "Second main, on us."], ["quiet-hours", "Spas", "A free upgrade on your treatment."], ["morning-light", "Yoga and studios", "Bring a friend to class, free."]];
add("what", `<section class="stack">
  <div class="head">
    <div>${eyebrow("What The 6 Pass is")}<h2 style="width:1200px">One yearly pass. Two-for-one at hand-picked places.</h2></div>
  </div>
  <div style="display:flex;gap:40px;margin-top:48px">
    ${offers.map(([p, k, o]) => `<div class="card" style="flex:1;overflow:hidden;display:flex;flex-direction:column">
      <img src="${img(p)}" alt="" style="width:100%;height:270px;object-fit:cover">
      <div style="padding:36px 40px;display:flex;flex-direction:column;gap:12px">${eyebrow(k)}<p style="font-size:40px;font-weight:600;line-height:1.2;letter-spacing:-.5px">${o}</p></div>
    </div>`).join("")}
  </div>
  <p class="small" style="margin-top:28px">Example offers. Each partner sets its own. No coupons, no vouchers, no fine print.</p>
  ${foot(3)}
</section>`, `"It's not a coupon site. A short list of places, chosen one by one. Fifty great spots beat two hundred average ones."`);

// 4 Why it works
const why = [
  ["New faces on quiet nights", "Members come on the days you pick. Most will be trying you for the first time."],
  ["Built to bring them back", "Each member gets a few uses a year, set by you. Every visit after that is a regular visit at full price."],
  ["Your name stays premium", "Members only. No public discount, no voucher sites, no race to the bottom. Fifty places, chosen as the best of each neighbourhood."],
];
add("why", `<section class="stack">
  <div class="head">${eyebrow("Why it works for you")}<h2 style="width:1300px">Bring someone, and come back.</h2></div>
  <div style="display:flex;gap:56px;margin-top:80px">
    ${why.map(([t, s], i) => `<div style="flex:1;border-top:2px solid ${INK};padding-top:36px;display:flex;flex-direction:column;gap:20px">
      <p style="font-family:var(--serif);font-size:96px;font-weight:600;line-height:1;color:${COPPER}">${i + 1}</p>
      <p style="font-size:40px;font-weight:600;line-height:1.2;letter-spacing:-.5px">${t}</p>
      <p class="body">${s}</p></div>`).join("")}
  </div>
  ${foot(4)}
</section>`, `The point isn't the free main. It's the second visit, which is full price. That's why the uses are capped.`);

// 5 How a visit works
const steps = [["place", "The member taps Redeem", "At the table, before the bill."], ["code", "They show you a code", "Six digits, valid for ten minutes."], ["done", "Your staff tap Confirm", "No scanner, no app, no login at the host stand."]];
add("visit", `<section class="split">
  <div class="col" style="width:560px">
    ${eyebrow("How a visit works")}
    <h2>Three taps at the table.</h2>
    <p class="lede">Take the second main off the bill the way you normally would. That's it.</p>
  </div>
  <div style="flex:1;display:flex;gap:44px;justify-content:flex-end;align-items:center">
    ${steps.map(([s, t, d], i) => `<div style="width:300px;display:flex;flex-direction:column;gap:22px">
      ${phone(s, 300, t)}
      <div><p style="font-size:26px;font-weight:600"><span style="color:${COPPER}">${i + 1}</span>&nbsp; ${t}</p><p class="small" style="margin-top:6px">${d}</p></div></div>`).join("")}
  </div>
  ${foot(5)}
</section>`, `Then hand them the phone and run the demo on their own place: Start demo, their place, Redeem, Confirm, See the owner view.`);

// 6 Control
const ctl = [["The offer", "Two-for-one, or a free upgrade or add-on. Food, services and non-alcoholic drinks only."], ["The days", "At least three a week. Leave out your busy nights."], ["The limit", "Uses per member each year, from 1 to 12. Most start with two."], ["Blackouts and pause", "Holidays and busy weeks off. Pause any time with 7 days' notice."]];
add("control", `<section class="split">
  <div class="col" style="width:720px">
    ${eyebrow("You control the offer")}
    <h2>Your place, your rules.</h2>
    <div style="display:flex;flex-direction:column;margin-top:8px">
      ${ctl.map(([t, s]) => `<div style="display:flex;gap:28px;padding:22px 0;border-top:1px solid ${LINE}"><p style="width:230px;font-size:28px;font-weight:600">${t}</p><p class="body" style="flex:1;font-size:26px">${s}</p></div>`).join("")}
    </div>
  </div>
  <div style="flex:1;display:flex;gap:40px;justify-content:flex-end;align-items:center">
    ${phone("owner", 350, "The owner view: tonight's member visits and You pay $0")}
    ${phone("owner-controls", 350, "The owner's controls: offer, days, uses, blackouts and Pause")}
  </div>
  ${foot(6)}
</section>`, `Show it live: Owner tab, You control the offer. Change the days or flip Pause, then See what members see. The 38, 27, 11 are a sample month, marked as illustrative.`);

// 7 Worked example
const row = (l, a, b, strong) => `<tr><td>${l}</td><td>${a}</td><td style="${strong ? `color:${OK};font-weight:700` : ""}">${b}</td></tr>`;
add("example", `<section class="split">
  <div class="col" style="width:600px">
    ${eyebrow("What a two-for-one costs you")}
    <h2>One table of two, on a quiet Tuesday.</h2>
    <p class="lede">You lose the price of one main. You keep the rest of the bill.</p>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:28px">
    <div class="card" style="padding:24px 48px 8px">
      <table class="tbl">
        <tr><th></th><th>Full price</th><th>With the pass</th></tr>
        ${row("The bill", "$134", "$102")}
        ${row("Food and drink cost", "$40", "$40")}
        ${row("Left over before wages and rent", "$94", "$62", true)}
      </table>
    </div>
    <div style="display:flex;gap:28px">
      <div class="card" style="flex:1;padding:32px 36px"><p style="font-size:26px;font-weight:600">If the table would have been empty</p><p class="body" style="font-size:24px;margin-top:8px">You're $62 ahead. Two guests came in who weren't coming.</p></div>
      <div class="card" style="flex:1;padding:32px 36px"><p style="font-size:26px;font-weight:600">If they were coming anyway</p><p class="body" style="font-size:24px;margin-top:8px">You gave one main. That's why you pick quiet days and cap the uses.</p></div>
    </div>
    <p class="small">Example numbers: two mains at $32, $30 of starters and dessert, $40 of drinks. Food cost 32%, drinks 25%. Swap in your own.</p>
  </div>
  ${foot(7)}
</section>`, `Let them change the numbers out loud: "What's your average main?" The same example is on the6pass.ca/owners.`);

// 8 Members
add("members", `<section class="split" style="padding-right:0">
  <div class="col" style="width:700px">
    ${eyebrow("Who the members are")}
    <h2>People who want a reason to go out on a Tuesday.</h2>
    <div style="display:flex;flex-direction:column;margin-top:8px">
      ${[["Downtown professionals", "Finance, law and consulting, in their 20s and 30s."], ["Students", "Going out with friends, on a budget that still wants something good."], ["Newcomers to Toronto", "Looking for the places locals actually go."]].map(([t, s]) => `<div style="padding:20px 0;border-top:1px solid ${LINE}"><p style="font-size:28px;font-weight:600">${t}</p><p class="body" style="font-size:25px;margin-top:4px">${s}</p></div>`).join("")}
    </div>
  </div>
  <img src="${img("half-past-nine")}" alt="" style="position:absolute;right:0;top:0;width:900px;height:1080px;object-fit:cover">
  <footer style="right:1028px">${logo()}<span style="color:${MUTE}">08</span></footer>
</section>`, `No member numbers yet; don't quote any. "The waitlist is open on the6pass.ca and members join at launch, on March 16."`);

// 9 Costs
add("costs", `<section class="stack" style="justify-content:center">
  ${eyebrow("What it costs you")}
  <h2 style="font-size:150px;line-height:1;letter-spacing:-3px;margin-top:24px">Free for your<br>first 12 months.</h2>
  <div style="display:flex;gap:40px;margin-top:80px">
    ${[["Commission", "None", "No cut of the bill, no per-visit fee."], ["Setup", "None", "Nothing to install at the host stand."], ["Leaving", "30 days", "Notice, either side. No lock-in."]].map(([k, v, s]) => `<div style="flex:1;border-top:2px solid ${INK};padding-top:28px"><p class="eyebrow" style="color:${MUTE}">${k}</p><p style="font-size:64px;font-weight:700;letter-spacing:-2px;margin-top:10px">${v}</p><p class="body" style="font-size:26px;margin-top:6px">${s}</p></div>`).join("")}
  </div>
  ${foot(9)}
</section>`, `If asked about after 12 months: "We'll agree that together before then. Nothing changes without 30 days' notice." Never quote a number.`);

// 10 Founding Partners
const perks = [["Founding Partner badge", "On your place in the app, so members know you were there from the start."], ["Featured at launch", "Your place in front of every member on launch day, March 16, 2027."], ["Set up with you", "We write your page and choose the photos together. You approve it before anyone sees it."], ["Free for 12 months", "From the day you go live. No commission, no setup."]];
add("founding", `<section class="split">
  <div class="col" style="width:820px">
    ${eyebrow("Fifty Founding Partners")}
    <h2>We're choosing fifty places, one neighbourhood at a time.</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px 48px;margin-top:16px">
      ${perks.map(([t, s]) => `<div style="border-top:1px solid ${LINE};padding-top:20px"><p style="font-size:28px;font-weight:600">${t}</p><p class="body" style="font-size:24px;margin-top:6px">${s}</p></div>`).join("")}
    </div>
  </div>
  <div style="flex:1;display:flex;justify-content:flex-end;align-items:center">
    ${phone("explore", 380, "The member app's home screen with a new Founding Partner at the top")}
  </div>
  ${foot(10)}
</section>`, `Their place shows first, marked New · Founding Partner. Fewer places, better ones.`);

// 11 Timeline
const tl = [["Today", "A one-page letter of intent", "It isn't a contract and it costs nothing. It holds your spot."], ["This winter", "Partner agreement and your page", "We set up your offer, days and photos with you."], ["Before launch", "Two minutes with your staff", "Check the code, tap Confirm. That's the training."], ["March 16, 2027", "Launch day", "Members arrive. You're featured as a Founding Partner."]];
add("timeline", `<section class="stack">
  <div class="head">${eyebrow("What happens next")}<h2>From today to launch day.</h2></div>
  <div style="position:relative;display:flex;gap:40px;margin-top:110px">
    <div style="position:absolute;left:0;right:0;top:15px;height:2px;background:${LINE}"></div>
    ${tl.map(([w, t, s], i) => `<div style="flex:1;position:relative;display:flex;flex-direction:column;gap:14px">
      <div style="width:32px;height:32px;border-radius:50%;background:${i === 0 || i === 3 ? COPPER : PAPER};border:2px solid ${i === 0 || i === 3 ? COPPER : INK}"></div>
      <p class="eyebrow" style="color:${COPPER};margin-top:20px">${w}</p>
      <p style="font-size:36px;font-weight:600;line-height:1.2;letter-spacing:-.5px">${t}</p>
      <p class="body" style="font-size:26px">${s}</p></div>`).join("")}
  </div>
  ${foot(11)}
</section>`, `Nothing is final until the partner agreement. Between now and then, they can ask anything.`);

// 12 Close
add("next", `<section class="dark" style="padding:0">
  <img src="${img("marigold-room")}" alt="" style="position:absolute;right:0;top:0;width:820px;height:1080px;object-fit:cover">
  <div style="position:absolute;left:128px;top:0;bottom:0;width:860px;display:flex;flex-direction:column;justify-content:center;gap:40px">
    ${eyebrow("Next step", true)}
    <h2 style="color:#F4F1EC">Would you like to be one of our fifty Founding Partners?</h2>
    <p class="lede" style="color:#D9D3C9">A one-page letter of intent. It isn't a contract and it costs nothing.</p>
    <div style="display:flex;align-items:center;gap:36px;margin-top:12px">
      <div style="width:184px;height:184px;background:#fff;border-radius:16px;padding:16px">${qr.replace("<svg", '<svg width="152" height="152"')}</div>
      <div><p style="font-size:30px;font-weight:600;color:#F4F1EC">hello@the6pass.ca</p><p style="font-size:24px;color:#B9B1A6;margin-top:8px">Terms and the worked example:<br>the6pass.ca/owners</p></div>
    </div>
  </div>
  <footer style="right:948px">${logo(true)}<span style="color:#B9B1A6">12</span></footer>
</section>`, `Then the letter of intent: two copies, they keep one. Leave the one-pager. Thank-you email the same day.`);

const css = `@page{size:1920px 1080px;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
:root{--serif:'Cormorant Garamond',Georgia,serif}
body{width:1920px;background:#999;font-family:'DM Sans',Arial,sans-serif;color:${INK};-webkit-font-smoothing:antialiased;font-variant-numeric:lining-nums}
section{position:relative;width:1920px;height:1080px;overflow:hidden;background:${PAPER};padding:120px 128px 170px;page-break-after:always;break-after:page}
section.dark{background:${DARK};color:#F4F1EC}
section.split{display:flex;gap:96px}
section.stack{display:flex;flex-direction:column;justify-content:center}
.col{width:640px;display:flex;flex-direction:column;justify-content:center;gap:32px;flex-shrink:0}
.eyebrow{font-size:22px;font-weight:600;letter-spacing:4px;text-transform:uppercase}
h1,h2{font-family:var(--serif);font-weight:600}
h2{font-size:84px;line-height:1.04;letter-spacing:-1.5px}
.head h2{margin-top:24px}
.logo{font-family:var(--serif);font-weight:700;letter-spacing:-.5px;white-space:nowrap}
.logo i{font-style:italic}
.lede{font-size:32px;line-height:1.42;color:${SUB}}
.body{font-size:28px;line-height:1.45;color:${SUB}}
.small{font-size:22px;line-height:1.4;color:${MUTE}}
.card{background:#fff;border-radius:24px;box-shadow:0 1px 0 rgba(22,20,15,.04),0 16px 40px rgba(22,20,15,.07)}
.phone{border-radius:48px;padding:10px;background:#1B1A17;box-shadow:0 24px 60px rgba(22,20,15,.22)}
.phone img{display:block;width:100%;border-radius:38px}
footer{position:absolute;left:128px;right:128px;bottom:64px;display:flex;justify-content:space-between;align-items:baseline;font-size:22px}
footer .logo{font-size:34px}
.tbl{width:100%;border-collapse:collapse;font-size:30px}
.tbl th{font-size:22px;letter-spacing:3px;text-transform:uppercase;color:${MUTE};font-weight:600;text-align:right;padding:18px 0}
.tbl td{padding:26px 0;border-top:1px solid ${LINE};text-align:right;font-weight:600;font-size:40px;letter-spacing:-.5px}
.tbl td:first-child{text-align:left;font-weight:500;font-size:28px;color:${SUB};letter-spacing:0}
.tbl th:first-child{text-align:left}`;

const head = `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><title>The 6 Pass: Founding Partners</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap"><style>${css}</style></head><body>`;
fs.writeFileSync(`${D}/all.html`, head + slides.map((s) => s.html.replace("<section", `<section id="${s.id}"`)).join("\n") + "</body></html>");
fs.writeFileSync(`${D}/notes.json`, JSON.stringify(slides.map(({ id, note }) => ({ id, note })), null, 1));
console.log(slides.length, "slides");
