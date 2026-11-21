// Remembers which ad or campaign brought the visitor in (first landing in this tab),
// so every form submission (I am Interested, Apply for Membership) can be traced back to its ad.

const ATTRIBUTION_KEY = "prive:attribution"
const ATTRIBUTION_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"]

export function captureAttribution() {
    try {
        if (sessionStorage.getItem(ATTRIBUTION_KEY)) return
        const q = new URLSearchParams(window.location.search)
        const found: Record<string, string> = {}
        for (const k of ATTRIBUTION_PARAMS) {
            const v = q.get(k)
            if (v) found[k] = v.slice(0, 300)
        }
        found.landing_page = window.location.pathname + window.location.search
        if (document.referrer && !document.referrer.startsWith(window.location.origin)) found.referrer = document.referrer.slice(0, 300)
        sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found))
    } catch {}
}

export function readAttribution(): Record<string, string> {
    try {
        return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}")
    } catch {
        return {}
    }
}
