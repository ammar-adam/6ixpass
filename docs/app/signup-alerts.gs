// The 6 Pass sign-up alerts. Paste into a Google Apps Script project made in
// the hello@the6pass.ca account (steps: docs/app/SIGNUP-ALERTS.md).
// Supabase calls this when someone joins the waitlist or creates an app
// account, and it emails hello@the6pass.ca.

const TO = "hello@the6pass.ca";

function doPost(e) {
  const key = PropertiesService.getScriptProperties().getProperty("KEY");
  if (!key || !e || !e.parameter || e.parameter.key !== key) return ContentService.createTextOutput("no");
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput("bad");
  }
  const clean = (v) => String(v == null ? "" : v).replace(/[\r\n]+/g, " ").slice(0, 200);
  const email = clean(d.email);
  const when = Utilities.formatDate(d.created_at ? new Date(d.created_at) : new Date(), "America/Toronto", "EEE MMM d, yyyy 'at' h:mm a");
  let subject;
  let lines;
  if (d.kind === "app") {
    subject = "New app account: " + email;
    lines = ["Someone created an account in The 6 Pass app.", "", "Email: " + email, "When: " + when];
  } else {
    subject = "New waitlist sign-up: " + email;
    lines = [
      "Someone joined The 6 Pass waitlist.",
      "",
      "Email: " + email,
      "First name: " + (clean(d.first_name) || "not given"),
      "Neighbourhood: " + (clean(d.neighbourhood) || "not given"),
      "Came from: " + (clean(d.source) || "direct") + (d.campaign ? " (" + clean(d.campaign) + ")" : ""),
      "When: " + when,
    ];
  }
  lines.push("", "Sent automatically by Supabase. Everyone is listed in Supabase, Table Editor.");
  MailApp.sendEmail({ to: TO, subject: subject, body: lines.join("\n"), name: "The 6 Pass" });
  return ContentService.createTextOutput("ok");
}

// Run once (Run button, choose setupKey). Copy the key from the log.
function setupKey() {
  const k = Utilities.getUuid().replace(/-/g, "");
  PropertiesService.getScriptProperties().setProperty("KEY", k);
  Logger.log("Your key: " + k);
}

// Sends one test email to hello@ (Run button, choose testEmail).
function testEmail() {
  const key = PropertiesService.getScriptProperties().getProperty("KEY");
  doPost({ parameter: { key: key }, postData: { contents: JSON.stringify({ kind: "waitlist", email: "test@example.com", first_name: "Test", source: "direct" }) } });
}
