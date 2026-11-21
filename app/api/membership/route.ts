import { NextResponse } from "next/server"
import { EXPERIENCE_OPTIONS } from "@/content/membership"

// Receives "Apply for Membership" applications from app/apply-for-membership/ApplyForm.tsx and
// saves each one to the "Apply for Membership" tab of the same Google Sheet as the invitation
// requests (scripts/invitation-sheet.gs). Uses the same two environment variables:
//
//   INVITATION_WEBHOOK_URL     → the Apps Script Web app URL (ends in /exec)
//   INVITATION_WEBHOOK_SECRET  → the same value as SECRET in the script
//
// `form: "membership"` tells the script to use the membership tab and its own columns,
// so the event tabs and "All requests" are never touched by these.

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX = { name: 120, email: 200, phone: 25, city: 80, company: 160, designation: 120, link: 300, page: 500 }

// Light per-instance limit so one visitor can't flood the sheet
const hits = new Map<string, number[]>()
function limited(ip: string) {
    const now = Date.now()
    const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
    recent.push(now)
    hits.set(ip, recent)
    if (hits.size > 5000) hits.clear()
    return recent.length > 6
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")

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
    if (limited(ip)) return fail("Too many attempts. Wait a few minutes and try again.", 429)

    const name = str(body.name, MAX.name)
    const email = str(body.email, MAX.email)
    const phone = str(body.phone, MAX.phone)
    const city = str(body.city, MAX.city)
    const company = str(body.company, MAX.company)
    const designation = str(body.designation, MAX.designation)
    const experience = str(body.experience, 60)
    const linkedin = str(body.linkedin, MAX.link)
    const companyWebsite = str(body.companyWebsite, MAX.link)
    const page = str(body.page, MAX.page)

    const digits = phone.replace(/\D/g, "")
    if (name.length < 2) return fail("Enter your full name.", 400)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("Enter a valid email address.", 400)
    if (!/^[+\d()\-.\s]+$/.test(phone) || digits.length < 8 || digits.length > 15) return fail("Enter a valid contact number.", 400)
    if (city.length < 2) return fail("Enter your city.", 400)
    if (company.length < 2) return fail("Enter your company name.", 400)
    if (designation.length < 2) return fail("Enter your designation.", 400)
    if (!EXPERIENCE_OPTIONS.includes(experience)) return fail("Choose your years of experience.", 400)
    if (linkedin && !/linkedin\.com|lnkd\.in/i.test(linkedin)) return fail("Enter a LinkedIn link, like linkedin.com/in/yourname.", 400)
    if (!linkedin && !companyWebsite) return fail("Add your LinkedIn profile or your company website.", 400)

    const attribution: Record<string, string> = {}
    if (body.attribution && typeof body.attribution === "object") {
        for (const [k, v] of Object.entries(body.attribution as Record<string, unknown>).slice(0, 12)) {
            if (/^[a-z_]{2,20}$/.test(k)) attribution[k] = str(v, 300)
        }
    }

    const submission = {
        form: "membership",
        submittedAt: new Date().toISOString(),
        name,
        email,
        phone,
        city,
        company,
        designation,
        experience,
        linkedin,
        companyWebsite,
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

    const webhook = process.env.INVITATION_WEBHOOK_URL?.trim()
    if (!webhook) {
        if (process.env.NODE_ENV !== "production") {
            console.info("[membership] INVITATION_WEBHOOK_URL not set. Application:", submission)
            return NextResponse.json({ ok: true })
        }
        console.error("[membership] INVITATION_WEBHOOK_URL not set; application not saved:", submission)
        return fail("Your application couldn’t be sent just now. Email info@theprive.network and we’ll take it from there.", 503)
    }

    try {
        const r = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...submission, secret: (process.env.INVITATION_WEBHOOK_SECRET || "").trim() }),
            signal: AbortSignal.timeout(25_000), // Apps Script can be slow to wake up
        })
        const text = await r.text().catch(() => "")
        // The updated script answers {"ok":true,"form":"membership"}. An older script without the
        // membership tab answers {"ok":true} only, so that is treated as a failure rather than lost data.
        if (!r.ok || !/"form"\s*:\s*"membership"/.test(text)) throw new Error(`sheet ${r.status}: ${text.slice(0, 200)}`)
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error("[membership] saving to Google Sheet failed:", err)
        return fail("Your application couldn’t be sent just now. Try again, or email info@theprive.network.", 502)
    }
}
