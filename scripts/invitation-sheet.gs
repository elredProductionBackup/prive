/**
 * Privé — "I am Interested" / "Request an invitation" → Google Sheet
 *
 * What it does with every request:
 *   • adds a row to the "All requests" tab
 *   • adds the same row to a tab named after the event they chose (created automatically)
 *   • keeps a "Summary" tab with the number of requests per event
 *
 * Setup (about 5 minutes):
 *  1. Create a new Google Sheet, e.g. "Privé – Interested".
 *  2. Extensions → Apps Script. Delete what's there, paste this whole file, Save.
 *  3. Change SECRET below to a long random string. Save.
 *  4. In the function dropdown at the top pick "setup" → Run. Approve the permissions
 *     (Advanced → Go to project → Allow). This creates the tabs.
 *  5. Deploy → New deployment → gear icon → "Web app".
 *       Execute as: Me        Who has access: Anyone
 *     Deploy, then copy the Web app URL (ends in /exec).
 *  6. In the website's hosting (e.g. Vercel → Settings → Environment Variables) add:
 *       INVITATION_WEBHOOK_URL    = <the Web app URL>
 *       INVITATION_WEBHOOK_SECRET = <the same SECRET as below>
 *     then redeploy the site.
 *
 * Editing this script later: Deploy → Manage deployments → ✏️ → Version: New version → Deploy
 * (the URL stays the same; without a new version the old code keeps running).
 */

const SECRET = "change-me-to-a-long-random-string"
const ALL_TAB = "All requests"
const SUMMARY_TAB = "Summary"

// [key sent by the website, column header in the sheet]
const COLUMNS = [
  ["submittedAt", "Submitted at"],
  ["event", "Event"],
  ["dates", "Event dates"],
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["company", "Company"],
  ["notes", "Notes"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
  ["fbclid", "fbclid"],
  ["gclid", "gclid"],
  ["landing_page", "Landing page"],
  ["referrer", "Referrer"],
  ["page", "Page"],
  ["eventId", "Event ID"],
]
const HEADERS = COLUMNS.map((c) => c[1])

function doPost(e) {
  const lock = LockService.getScriptLock()
  try {
    const data = JSON.parse(e.postData.contents)
    if (String(data.secret || "").trim() !== SECRET.trim()) return reply({ ok: false, error: "unauthorised: INVITATION_WEBHOOK_SECRET does not match SECRET in the script" })

    lock.waitLock(20000) // two people submitting at once never overwrite each other
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const row = COLUMNS.map(([key]) => {
      const v = data[key]
      if (v == null || v === "") return ""
      if (key === "submittedAt") return new Date(v) // real date, shown in the sheet's time zone
      return "'" + String(v) // leading ' stops Sheets treating "+91…" or "=…" as a formula
    })

    tab(ss, ALL_TAB).appendRow(row)
    tab(ss, eventTabName(data)).appendRow(row)
    ensureSummary(ss)
    lock.releaseLock()
    return reply({ ok: true })
  } catch (err) {
    try { lock.releaseLock() } catch (_) {}
    return reply({ ok: false, error: String(err) })
  }
}

// Open the /exec URL in a browser to check the deployment works
function doGet() {
  return reply({ ok: true, message: "Privé sheet is live. The website should POST here." })
}

// Run once from the editor: creates the tabs and asks for permission to edit the sheet
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  tab(ss, ALL_TAB)
  ensureSummary(ss)
  const first = ss.getSheets()[0]
  if (first.getName() !== ALL_TAB && first.getName() !== SUMMARY_TAB && first.getLastRow() === 0) ss.deleteSheet(first)
}

// Optional: run from the editor to add a test row without the website
function testRow() {
  const res = doPost({
    postData: {
      contents: JSON.stringify({
        secret: SECRET, submittedAt: new Date().toISOString(), eventId: "test-event",
        event: "TEST — delete me", dates: "1st January", name: "Test Person",
        email: "test@example.com", phone: "+91 98765 43210", company: "Test Co", notes: "Testing",
      }),
    },
  })
  Logger.log(res.getContent())
}

function tab(ss, name) {
  let sh = ss.getSheetByName(name)
  if (!sh) {
    sh = ss.insertSheet(name)
    sh.appendRow(HEADERS)
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#F3EEE7")
    sh.setFrozenRows(1)
    sh.getRange("A:A").setNumberFormat("dd mmm yyyy, hh:mm")
    sh.setColumnWidths(1, 8, 170)
  }
  return sh
}

function eventTabName(data) {
  // Sheet names can't contain : \ / ? * [ ] and max out at 100 characters
  const name = String(data.event || data.eventId || "Unknown event").replace(/[:\\\/?*\[\]]/g, "-").trim()
  return name.slice(0, 95) || "Unknown event"
}

function ensureSummary(ss) {
  if (ss.getSheetByName(SUMMARY_TAB)) return
  const sh = ss.insertSheet(SUMMARY_TAB, 0)
  sh.getRange("A1").setFormula(
    "=QUERY('" + ALL_TAB + "'!A:B,\"select B, count(A) where A is not null group by B order by count(A) desc label B 'Event', count(A) 'Requests'\",1)"
  )
  sh.getRange("1:1").setFontWeight("bold")
  sh.setColumnWidth(1, 360)
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
