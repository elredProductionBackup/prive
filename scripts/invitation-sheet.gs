/**
 * Privé — "Request an invitation" → Google Sheet + email to info@theprive.network
 *
 * Setup (5 minutes, free, no extra accounts):
 *  1. Create a Google Sheet (e.g. "Privé invitation requests").
 *  2. Extensions → Apps Script. Replace everything with this file. Save.
 *  3. Set SECRET below to a long random string (the same value goes in INVITATION_WEBHOOK_SECRET).
 *  4. Deploy → New deployment → type "Web app".
 *       Execute as: Me      Who has access: Anyone
 *     Authorise when asked, then copy the Web app URL.
 *  5. In the website's hosting settings set:
 *       INVITATION_WEBHOOK_URL    = <the Web app URL>
 *       INVITATION_WEBHOOK_SECRET = <the SECRET below>
 *     and redeploy the site.
 *
 * After editing this script later: Deploy → Manage deployments → edit → Version: New version.
 */

const SECRET = "change-me-to-a-long-random-string"
const NOTIFY = "info@theprive.network" // comma-separate for several; "" for no email

const COLUMNS = [
  "submittedAt", "event", "dates", "name", "email", "phone", "company", "notes",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid",
  "landing_page", "referrer", "page", "eventId",
]

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    if (data.secret !== SECRET) return reply({ ok: false, error: "unauthorised" })

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS)
    // Leading "'" stops Sheets treating "+91…" as a formula
    sheet.appendRow(COLUMNS.map((c) => (data[c] == null ? "" : "'" + String(data[c]))))

    if (NOTIFY) {
      const lines = ["event", "dates", "name", "email", "phone", "company", "notes", "utm_source", "utm_campaign", "page"]
        .filter((k) => data[k])
        .map((k) => k + ": " + data[k])
      MailApp.sendEmail({
        to: NOTIFY,
        replyTo: data.email,
        subject: "Invitation request: " + data.name + " — " + data.event,
        body: lines.join("\n"),
      })
    }
    return reply({ ok: true })
  } catch (err) {
    return reply({ ok: false, error: String(err) })
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
