import { NextResponse } from "next/server"
import { EVENTS } from "@/content/events"

// Receives "Request an invitation" submissions from components/site/InvitationModal.tsx
// and passes each one on to wherever Privé wants them. Set one or both in the hosting
// environment (see .env.example and README):
//
//   INVITATION_WEBHOOK_URL  → posts the request as JSON (e.g. a Google Apps Script that adds a
//                             row to a Google Sheet and emails info@theprive.network; see
//                             scripts/invitation-sheet.gs). Also works with Zapier, Make, a CRM.
//   RESEND_API_KEY          → emails each request via Resend (resend.com) to INVITATION_EMAIL_TO.
//
// The request counts as received if at least one of them accepts it.

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX = { name: 120, email: 200, phone: 25, company: 160, notes: 2000, page: 500 }

// Light per-instance limit so one visitor can't flood the inbox
const hits = new Map<string, number[]>()
function limited(ip: string) {
    const now = Date.now()
    const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
    recent.push(now)
    hits.set(ip, recent)
    if (hits.size > 5000) hits.clear()
    return recent.length > 8
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

function fail(error: string, status: number) {
    return NextResponse.json({ ok: false, error }, { status })
}

export async function POST(req: Request) {
    let body: Record<string, unknown>
    try {
        body = await req.json()
    } catch {
        return fail("Something went wrong. Please try again.", 400)
    }

    // Spam trap filled in: pretend it worked, keep nothing
    if (str(body.website, 200)) return NextResponse.json({ ok: true })

    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown"
    if (limited(ip)) return fail("Too many requests. Please wait a few minutes and try again.", 429)

    const name = str(body.name, MAX.name)
    const email = str(body.email, MAX.email)
    const phone = str(body.phone, MAX.phone)
    const company = str(body.company, MAX.company)
    const notes = str(body.notes, MAX.notes)
    const page = str(body.page, MAX.page)
    const eventId = str(body.eventId, 80)

    const digits = phone.replace(/\D/g, "")
    if (name.length < 2) return fail("Please enter your full name.", 400)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("Please enter a valid email address.", 400)
    if (!/^[+\d()\-.\s]+$/.test(phone) || digits.length < 8 || digits.length > 15) return fail("Please enter a valid phone number.", 400)

    const ev = EVENTS.find((e) => e.id === eventId)
    if (!ev) return fail("This event is no longer open for requests. Please refresh the page.", 400)
    const dates = (ev.popupDate || (ev.sessions || []).map((s) => s.date).join(", ")).trim()
    const eventName = [ev.speaker?.name, (ev.popupTitle || ev.title).replace(/\*+$/, "")].filter(Boolean).join(" — ")

    const attribution: Record<string, string> = {}
    if (body.attribution && typeof body.attribution === "object") {
        for (const [k, v] of Object.entries(body.attribution as Record<string, unknown>).slice(0, 12)) {
            if (/^[a-z_]{2,20}$/.test(k)) attribution[k] = str(v, 300)
        }
    }

    const submission = {
        submittedAt: new Date().toISOString(),
        eventId,
        event: eventName,
        dates,
        name,
        email,
        phone,
        company,
        notes,
        page,
        utm_source: attribution.utm_source || "",
        utm_medium: attribution.utm_medium || "",
        utm_campaign: attribution.utm_campaign || "",
        utm_content: attribution.utm_content || "",
        utm_term: attribution.utm_term || "",
        fbclid: attribution.fbclid || "",
        gclid: attribution.gclid || "",
        landing_page: attribution.landing_page || "",
        referrer: attribution.referrer || "",
    }

    const webhook = process.env.INVITATION_WEBHOOK_URL
    const resendKey = process.env.RESEND_API_KEY
    const deliveries: Promise<string>[] = []

    if (webhook) {
        deliveries.push(
            fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...submission, secret: process.env.INVITATION_WEBHOOK_SECRET || "" }),
                signal: AbortSignal.timeout(15_000),
            }).then(async (r) => {
                const text = await r.text().catch(() => "")
                // Google Apps Script answers 200 even on script errors, so it replies {"ok":true} on success
                if (!r.ok || /"ok"\s*:\s*false/.test(text)) throw new Error(`webhook ${r.status}: ${text.slice(0, 200)}`)
                return "webhook"
            })
        )
    }

    if (resendKey) {
        const rows: [string, string][] = [
            ["Event", submission.event],
            ["Dates", dates],
            ["Name", name],
            ["Email", email],
            ["Phone", phone],
            ["Company", company],
            ["Notes", notes],
            ["Source", [submission.utm_source, submission.utm_medium, submission.utm_campaign].filter(Boolean).join(" / ") || (submission.fbclid ? "Meta (fbclid)" : "")],
            ["Page", page],
        ]
        const filled = rows.filter(([, v]) => v)
        deliveries.push(
            fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: process.env.INVITATION_EMAIL_FROM || "Privé Website <invitations@theprive.network>",
                    to: (process.env.INVITATION_EMAIL_TO || "info@theprive.network").split(",").map((s) => s.trim()),
                    reply_to: email,
                    subject: `Invitation request: ${name}, ${ev.speaker?.name || ev.title}`,
                    text: filled.map(([k, v]) => `${k}: ${v}`).join("\n"),
                    html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${filled
                        .map(([k, v]) => `<tr><td style="color:#775E36;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
                        .join("")}</table>`,
                }),
                signal: AbortSignal.timeout(15_000),
            }).then(async (r) => {
                if (!r.ok) throw new Error(`resend ${r.status}: ${(await r.text().catch(() => "")).slice(0, 200)}`)
                return "email"
            })
        )
    }

    if (!deliveries.length) {
        // Nothing configured yet: fine while developing, an error once live (so no request is silently lost)
        if (process.env.NODE_ENV !== "production") {
            console.info("[invitation] No destination configured. Submission:", submission)
            return NextResponse.json({ ok: true })
        }
        console.error("[invitation] INVITATION_WEBHOOK_URL / RESEND_API_KEY not set; request not delivered:", submission)
        return fail("We couldn’t send your request just now. Please email info@theprive.network and we’ll take it from there.", 503)
    }

    const results = await Promise.allSettled(deliveries)
    results.forEach((r) => r.status === "rejected" && console.error("[invitation] delivery failed:", r.reason))
    if (results.some((r) => r.status === "fulfilled")) return NextResponse.json({ ok: true })
    return fail("We couldn’t send your request just now. Please try again, or email info@theprive.network.", 502)
}
