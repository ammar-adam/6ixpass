// The 6 Pass sign-up emails. Paste into a Google Apps Script project made in
// the hello@the6pass.ca account (steps: docs/app/SIGNUP-ALERTS.md).
// Supabase calls this when someone joins the waitlist or creates an app
// account. It sends them a branded thank-you (or welcome) from hello@, and
// tells hello@ who signed up.

const HELLO = "hello@the6pass.ca";
const LOGO = "https://the6pass.ca/email/logo.png";
const LAUNCH = "Tuesday, March 16, 2027";

function doPost(e) {
  const key = PropertiesService.getScriptProperties().getProperty("KEY");
  if (!key || !e || !e.parameter || e.parameter.key !== key) return ContentService.createTextOutput("no");
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput("bad");
  }
  const email = clean(d.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return ContentService.createTextOutput("bad");
  if (d.kind === "app") {
    sendWelcome(email);
    alert("New app account: " + email, ["Someone created an account in The 6 Pass app.", "", "Email: " + email, "When: " + when(d.created_at)]);
  } else {
    sendThanks(email, clean(d.first_name));
    alert("New waitlist sign-up: " + email, [
      "Someone joined The 6 Pass waitlist. They were sent the thank-you email.",
      "",
      "Email: " + email,
      "First name: " + (clean(d.first_name) || "not given"),
      "Neighbourhood: " + (clean(d.neighbourhood) || "not given"),
      "Came from: " + (clean(d.source) || "direct") + (d.campaign ? " (" + clean(d.campaign) + ")" : ""),
      "When: " + when(d.created_at),
    ]);
  }
  return ContentService.createTextOutput("ok");
}

/* ---------- The emails people receive ---------- */

function sendThanks(email, firstName) {
  const hi = firstName ? "Hi " + firstName + "," : "Hi there,";
  const paras = [
    "Thank you for joining The 6 Pass. You're on the list.",
    "The 6 Pass is one yearly pass for two-for-one at hand-picked restaurants, spas, studios and more across Toronto and the GTA. Bring someone, and come back.",
    "We open on " + LAUNCH + ". You'll hear from us before then, with founding member pricing.",
    "Know a place we should have? Just reply to this email. It comes straight to me.",
  ];
  send(email, "You're on the list for The 6 Pass", hi, paras, "You're getting this because you joined the waitlist at the6pass.ca. Reply \"unsubscribe\" and we'll take you off the list.");
}

function sendWelcome(email) {
  const paras = [
    "Welcome to The 6 Pass. Your account is ready.",
    "Two-for-one at hand-picked restaurants, spas, studios and more across Toronto and the GTA. Members can start using their pass on " + LAUNCH + ". Until then, have a look around the app.",
    "If you run a place and signed up for the business side, your dashboard is under I'm a business.",
    "Questions? Just reply to this email.",
  ];
  send(email, "Welcome to The 6 Pass", "Hi there,", paras, "You're getting this because an account was created with this email in The 6 Pass app.");
}

function send(to, subject, hi, paras, why) {
  const text = [hi, ""].concat(paras.flatMap((p) => [p, ""])).concat(["Nida", "Founder, The 6 Pass", HELLO, "", "The 6 Pass, Toronto, ON. " + why]).join("\n");
  const p = (t) => '<p style="margin:0 0 16px;font:16px/1.55 Helvetica,Arial,sans-serif;color:#16140F">' + esc(t) + "</p>";
  const html =
    '<div style="background:#FAF8F5;padding:32px 16px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px">' +
    '<tr><td style="padding:32px 32px 8px"><img src="' + LOGO + '" width="148" height="42" alt="The 6 Pass" style="display:block;border:0"></td></tr>' +
    '<tr><td style="padding:16px 32px 8px">' + p(hi) + paras.map(p).join("") +
    '<p style="margin:24px 0 0;font:16px/1.4 Helvetica,Arial,sans-serif;color:#16140F">Nida<br><span style="color:#6E685E">Founder, The 6 Pass</span><br><a href="mailto:' + HELLO + '" style="color:#A8643A">' + HELLO + "</a></p>" +
    "</td></tr>" +
    '<tr><td style="padding:24px 32px 32px"><p style="margin:0;font:12px/1.5 Helvetica,Arial,sans-serif;color:#7A746B">The 6 Pass, Toronto, ON. ' + esc(why) + "</p></td></tr>" +
    "</table></div>";
  MailApp.sendEmail({ to: to, subject: subject, body: text, htmlBody: html, name: "The 6 Pass", replyTo: HELLO });
}

/* ---------- The alert to hello@ ---------- */

function alert(subject, lines) {
  lines.push("", "Sent automatically by Supabase. Everyone is listed in Supabase, Table Editor.");
  MailApp.sendEmail({ to: HELLO, subject: subject, body: lines.join("\n"), name: "The 6 Pass" });
}

/* ---------- Helpers ---------- */

function clean(v) {
  return String(v == null ? "" : v).replace(/[\r\n]+/g, " ").trim().slice(0, 200);
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function when(at) {
  return Utilities.formatDate(at ? new Date(at) : new Date(), "America/Toronto", "EEE MMM d, yyyy 'at' h:mm a");
}

/* ---------- Run these from the editor (function menu, then Run) ---------- */

// Once: makes the secret key. Copy it from the log.
function setupKey() {
  const k = Utilities.getUuid().replace(/-/g, "");
  PropertiesService.getScriptProperties().setProperty("KEY", k);
  Logger.log("Your key: " + k);
}

// Sends the thank-you and the welcome to hello@, so you can see them.
function testEmail() {
  sendThanks(HELLO, "Nida");
  sendWelcome(HELLO);
}

// Sends the thank-you to someone by hand (for example, anyone who joined before these emails existed).
// Change the email and first name below, then Run.
function sendThanksByHand() {
  sendThanks("someone@example.com", "");
}
