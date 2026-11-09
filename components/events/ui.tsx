"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import type { Module, Point, PracticeEvent } from "@/content/events"
import { useScrollLock } from "@/lib/site"

/* ───────────── Tokens ───────────── */

export const C = {
    accent: "#BA8A3E",
    brown: "#7B5E3B",
    maroon: "#6B2B2B",
    text: "#1C1917",
    muted: "#77716C",
    media: "#EAE5E1",
    line: "#E9E2D6",
    divider: "#C9A46A",
    label: "#775E36",
    loading: "#FDFAF6",
    breakBg: "#F7F0E4",
}
export const F = { serif: "var(--serif)", sans: "var(--sans)", head: "var(--head)" }

/* ───────────── Helpers ───────────── */

const CLD_IMG = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!(?:[a-z]{1,3}_[^/]*,?)+\/)(.*)$/i

// Cloudinary image → auto format/quality, sized for its slot
export function cldImage(url = "", width = 1000) {
    const m = String(url).match(CLD_IMG)
    return m ? `${m[1]}f_auto,q_auto,c_limit,w_${width}/${m[2]}` : url
}
// Cloudinary .mov → .mp4 so Chrome/Android can play it
export const cldVideo = (url = "") =>
    /res\.cloudinary\.com\/[^/]+\/video\/upload\//i.test(url) ? url.replace(/\.(mov|m4v|avi|mkv)(\?.*)?$/i, ".mp4$2") : url

export const toUrl = (u = "") => (!u ? "" : /^(https?:|mailto:|tel:|\/|#)/i.test(u) ? u : "https://" + u)

// "27th November" → "27 Nov"
export function shortDate(s = "") {
    const m = s.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3})/)
    return m ? `${m[1]} ${m[2]}` : s
}

export const isImageKind = (ev: PracticeEvent) => ev.kind === "image"

// One "Register" button for the event, or one per dated form
export function registerTargets(ev: PracticeEvent) {
    if (ev.register) return [{ url: toUrl(ev.register), date: "" }]
    const seen = new Set<string>()
    return (ev.sessions || [])
        .filter((s) => s.register && !seen.has(s.register) && seen.add(s.register))
        .map((s) => ({ url: toUrl(s.register), date: s.date }))
}

export const ALL = "all"
export const normKey = (s = "") => s.toLowerCase().replace(/\bteams?\b/g, "").replace(/[^a-z0-9]+/g, "")
export function matchesTeam(ev: PracticeEvent, team: string) {
    if (team === ALL || ev.teams === "all") return true
    return ev.teams.some((t) => normKey(t) === team)
}

export function popupDateText(ev: PracticeEvent) {
    if (ev.popupDate) return ev.popupDate
    const d = (ev.sessions || []).map((s) => s.date).filter(Boolean)
    return d.length <= 1 ? d[0] || "" : d.length === 2 ? `${d[0]} & ${d[1]}` : d.join(", ")
}

export const posterList = (ev: PracticeEvent) => (ev.posters || []).map((u) => cldImage(u, 1400))

export function canOpen(ev: PracticeEvent) {
    if (isImageKind(ev)) return posterList(ev).length > 0 || registerTargets(ev).length > 0
    return true
}

// Short line under the name on the month calendar
export function calRoleOf(ev: PracticeEvent) {
    if (isImageKind(ev) || ev.calTitle) return ""
    const r = ev.speaker?.calRole || ev.speaker?.role || ""
    return r.replace(/\*+$/, "").split("|").map((s) => s.trim()).filter(Boolean).join(" · ")
}

export async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}

// Shareable link: ?<param>=<id>. Native share sheet on phones, copy elsewhere.
export async function shareEvent(param: string, ev: PracticeEvent): Promise<"shared" | "copied" | "failed" | "cancelled"> {
    const url = new URL(window.location.href)
    url.searchParams.set(param, ev.id)
    url.hash = ""
    const href = url.toString()
    if (window.matchMedia?.("(pointer: coarse)").matches && navigator.share) {
        try {
            await navigator.share({ title: ev.popupTitle || ev.title, text: ev.speaker ? `${ev.title} with ${ev.speaker.name}` : ev.title, url: href })
            return "shared"
        } catch (e: any) {
            if (e?.name === "AbortError") return "cancelled"
        }
    }
    return (await copyText(href)) ? "copied" : "failed"
}

// Keeps ?<param>=<id> in the address bar in sync with the open popup, and opens a shared link
export function useShareParam(param: string, open: string | null, onLink: (id: string) => void) {
    const checked = useRef(false)
    const owned = useRef(false)
    useEffect(() => {
        if (checked.current) return
        checked.current = true
        const id = new URLSearchParams(window.location.search).get(param)
        if (id) onLink(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (!checked.current) return
        const url = new URL(window.location.href)
        if (open) {
            url.searchParams.set(param, open)
            owned.current = true
        } else if (owned.current) {
            url.searchParams.delete(param)
            owned.current = false
        } else return
        if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url.href)
    }, [open, param])
}

export const linkProps = (href: string) => (/^https?:\/\//i.test(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href })

export const clamp = (n: number): React.CSSProperties => ({
    display: "-webkit-box",
    WebkitLineClamp: n,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
})
export const oneLine: React.CSSProperties = { display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }
export const resetButton: React.CSSProperties = { border: "none", background: "none", padding: 0, margin: 0, cursor: "pointer", font: "inherit", color: "inherit" }

export function useContainerWidth(ref: React.RefObject<HTMLElement | null>, initial = 1200) {
    const [w, setW] = useState(initial)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const update = () => setW(el.offsetWidth || initial)
        update()
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref, initial])
    return w
}

/* ───────────── Rich text ───────────── */

export function inline(text: string, boldStyle?: React.CSSProperties) {
    const out: React.ReactNode[] = []
    const re = /(\*\*[^*]+?\*\*|\*[^*\n]+?\*)/g
    let last = 0
    let m: RegExpExecArray | null
    let k = 0
    while ((m = re.exec(text))) {
        if (m.index > last) out.push(text.slice(last, m.index))
        const t = m[0]
        out.push(
            t.startsWith("**") ? (
                <strong key={k++} style={{ fontWeight: 700, ...boldStyle }}>{t.slice(2, -2)}</strong>
            ) : (
                <em key={k++}>{t.slice(1, -1)}</em>
            )
        )
        last = m.index + t.length
    }
    if (last < text.length) out.push(text.slice(last))
    return out
}

// Blank line = new paragraph, single line break kept
export function RichText({ text, style, gap = 16 }: { text: string; style?: React.CSSProperties; gap?: number }) {
    const blocks = text.trim().split(/\n\s*\n/)
    return (
        <div style={{ display: "flex", flexDirection: "column", gap }}>
            {blocks.map((b, i) => (
                <p key={i} style={{ margin: 0, ...style }}>
                    {b.split("\n").map((l, j) => (
                        <React.Fragment key={j}>
                            {j > 0 && <br />}
                            {inline(l)}
                        </React.Fragment>
                    ))}
                </p>
            ))}
        </div>
    )
}

/* ───────────── Icons ───────────── */

type IconProps = { color?: string; size?: number }
const svgBase = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, style: { flexShrink: 0, display: "block" } as React.CSSProperties })

export const Chevron = ({ dir, color }: { dir: "left" | "right" | "down"; color: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
            d={dir === "left" ? "M10 3.5 5.5 8l4.5 4.5" : dir === "down" ? "M3.5 6 8 10.5 12.5 6" : "M6 3.5 10.5 8 6 12.5"}
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
export const PinIcon = ({ color = C.text, size = 18 }: IconProps) => (
    <svg {...svgBase(size)}>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.4" stroke={color} strokeWidth="1.6" />
    </svg>
)
export const CalendarIcon = ({ color = C.text, size = 22 }: IconProps) => (
    <svg {...svgBase(size)}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke={color} strokeWidth="1.6" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        {[8, 12, 16].map((x) => <circle key={x} cx={x} cy="13.5" r="0.9" fill={color} />)}
        {[8, 12].map((x) => <circle key={x} cx={x} cy="17" r="0.9" fill={color} />)}
    </svg>
)
export const ClockIcon = ({ color = C.accent, size = 15 }: IconProps) => (
    <svg {...svgBase(size)}>
        <circle cx="12" cy="12" r="8.6" stroke={color} strokeWidth="1.9" />
        <path d="M12 7.5V12l3 2" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const BreakIcon = ({ meal, color }: { meal: boolean; color: string }) => (
    <svg {...svgBase(16)}>
        <path
            d={meal ? "M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M8 3v6M17 21V3c-1.9 1-3 3.2-3 6v4h3" : "M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9ZM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c-.6.8-.6 1.7 0 2.5M12 3.5c-.6.8-.6 1.7 0 2.5M4 21.5h12"}
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="#333" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
)
const ShareIcon = () => (
    <svg {...svgBase(16)}>
        <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" stroke="#2A2725" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12.5V18a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18v-5.5" stroke="#2A2725" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
)
export const LinkedInIcon = ({ size = 28 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>
        <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
        <path fill="#fff" d="M7.2 9.6H4.8V19h2.4V9.6ZM6 5.6a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9ZM19.2 13.7c0-2.6-1.4-4.3-3.6-4.3-1.3 0-2.2.7-2.6 1.4V9.6h-2.3V19h2.4v-5c0-1.3.6-2.2 1.8-2.2 1.1 0 1.6.8 1.6 2.2v5h2.4v-5.3Z" />
    </svg>
)
const ModuleIcon = ({ name = "chart" }: { name?: string }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden style={{ flexShrink: 0 }}>
        <circle cx="16" cy="16" r="15" stroke={C.accent} strokeWidth="1.2" />
        {name === "search" ? (
            <>
                <circle cx="14.6" cy="14.6" r="5.4" stroke={C.accent} strokeWidth="1.4" />
                <path d="M18.6 18.6 22.5 22.5" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" />
            </>
        ) : name === "target" ? (
            <>
                <circle cx="16" cy="16" r="8.5" stroke={C.accent} strokeWidth="1.2" />
                <circle cx="16" cy="16" r="4.8" stroke={C.accent} strokeWidth="1.2" />
                <circle cx="16" cy="16" r="1.7" fill={C.accent} />
            </>
        ) : (
            <>
                <rect x="10" y="15" width="2" height="6" rx="0.6" fill={C.accent} />
                <rect x="13.5" y="11" width="2" height="10" rx="0.6" fill={C.accent} />
                <rect x="17" y="13" width="2" height="8" rx="0.6" fill={C.accent} />
                <rect x="20.5" y="16.5" width="2" height="4.5" rx="0.6" fill={C.accent} />
                <path d="M9 22.2h14.5" stroke={C.accent} strokeWidth="1" strokeLinecap="round" />
            </>
        )}
    </svg>
)

const TEAM_PATHS: Record<string, string[]> = {
    grid: ["M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z", "M12 4v16M4 12h16"],
    gear: ["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z", "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],
    megaphone: ["M11 5 6.5 9H3.5v6h3l4.5 4V5Z", "M15.5 8.6a4.8 4.8 0 0 1 0 6.8"],
    chart: ["M4 20h16", "M7.5 16.5v-4M12 16.5V7.5M16.5 16.5v-6.5"],
    briefcase: ["M5.5 7h13A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-8A2.5 2.5 0 0 1 5.5 7Z", "M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"],
    heart: ["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"],
    star: ["m12 3.5 2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 16.95 6.75 19.7l1-5.85L3.5 9.7l5.9-.9L12 3.5Z"],
    people: ["M12.2 8a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0Z", "M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5", "M15.5 4.9a3.2 3.2 0 0 1 0 6.2M17.5 14.3c2.1.6 3.5 2.6 3.5 5.2"],
}
export function TeamIcon({ name, color, size = 19 }: { name: string; color: string; size?: number }) {
    return (
        <svg {...svgBase(size)}>
            {(TEAM_PATHS[name] || TEAM_PATHS.people).map((d, i) => (
                <path key={i} d={d} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            ))}
        </svg>
    )
}

/* ───────────── Small pieces ───────────── */

export function FadeImg({ src, alt = "", style, lazy }: { src: string; alt?: string; style?: React.CSSProperties; lazy?: boolean }) {
    const ref = useRef<HTMLImageElement>(null)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        setLoaded(!!(ref.current?.complete && ref.current.naturalWidth > 0))
    }, [src])
    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            loading={lazy ? "lazy" : undefined}
            decoding="async"
            draggable={false}
            onLoad={() => setLoaded(true)}
            style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
        />
    )
}

export function Avatar({ src, name, size }: { src?: string; name?: string; size: number }) {
    const url = cldImage(src || "", Math.round(size * 3))
    const initials = (name || "?")
        .replace(/^(prof|dr|mr|mrs|ms)\.?\s+/i, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: url ? C.loading : C.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Math.max(8, size * 0.36),
                fontWeight: 600,
            }}
        >
            {url ? <FadeImg src={url} alt={name} lazy style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : initials}
        </div>
    )
}

// "A | B | C" with coloured separators
export function RoleLine({ text, sepColor, style }: { text?: string; sepColor: string; style?: React.CSSProperties }) {
    const parts = (text || "").split("|").map((s) => s.trim()).filter(Boolean)
    if (!parts.length) return null
    return (
        <div style={style}>
            {parts.map((p, i) => (
                <React.Fragment key={i}>
                    {i > 0 && (
                        <>
                            {" "}
                            <span style={{ color: sepColor, margin: "0 2px" }}>|</span>{" "}
                        </>
                    )}
                    <span>{p}</span>
                </React.Fragment>
            ))}
        </div>
    )
}

export function ArrowButton({ dir, onClick, size = 42, disabled, label }: { dir: "left" | "right"; onClick: () => void; size?: number; disabled?: boolean; label: string }) {
    return (
        <motion.button
            type="button"
            aria-label={label}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            whileHover={disabled ? undefined : { scale: 1.06 }}
            whileTap={disabled ? undefined : { scale: 0.94 }}
            style={{
                ...resetButton,
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1.5px solid ${C.maroon}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: disabled ? 0.3 : 1,
                cursor: disabled ? "default" : "pointer",
            }}
        >
            <Chevron dir={dir} color={C.maroon} />
        </motion.button>
    )
}

/* ───────────── Team dropdown ───────────── */

export type TeamOption = { value: string; label: string; icon: string }

// The menu is portalled to <body> with position: fixed so nothing can clip it
export function TeamDropdown({
    options,
    value,
    onChange,
    counts,
    isMobile,
    align = "right",
}: {
    options: TeamOption[]
    value: string
    onChange: (v: string) => void
    counts: Record<string, number>
    isMobile: boolean
    align?: "left" | "right"
}) {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState<{ top: number; x: number; up: boolean } | null>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const optRefs = useRef<(HTMLButtonElement | null)[]>([])
    const current = options.find((o) => o.value === value) || options[0]
    const menuW = isMobile ? 264 : 300

    useEffect(() => {
        if (!open) return
        let raf = 0
        const tick = () => {
            const r = btnRef.current?.getBoundingClientRect()
            if (r) {
                const vh = window.innerHeight
                const vw = document.documentElement.clientWidth
                const mh = menuRef.current?.offsetHeight || 0
                const up = mh > 0 && r.bottom + 8 + mh > vh && r.top - 8 - mh > 0
                const top = up ? r.top - 8 - mh : r.bottom + 8
                const x = align === "right" ? Math.max(8, vw - r.right) : Math.max(8, Math.min(r.left, vw - menuW - 8))
                setPos((p) => (p && p.top === top && p.x === x && p.up === up ? p : { top, x, up }))
            }
            raf = requestAnimationFrame(tick)
        }
        tick()
        return () => cancelAnimationFrame(raf)
    }, [open, align, menuW])

    useEffect(() => {
        if (!open) return
        const onDown = (e: Event) => {
            const t = e.target as Node
            if (!btnRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false)
                btnRef.current?.focus()
            }
        }
        document.addEventListener("pointerdown", onDown, true)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("pointerdown", onDown, true)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    const openAndFocus = () => {
        setOpen(true)
        const i = Math.max(0, options.findIndex((o) => o.value === current.value))
        setTimeout(() => optRefs.current[i]?.focus({ preventScroll: true }), 40)
    }

    const onListKey = (e: React.KeyboardEvent) => {
        const els = optRefs.current.filter(Boolean) as HTMLButtonElement[]
        const i = els.indexOf(document.activeElement as HTMLButtonElement)
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault()
            els[(i + (e.key === "ArrowDown" ? 1 : -1) + els.length) % els.length]?.focus()
        } else if (e.key === "Home" || e.key === "End") {
            e.preventDefault()
            els[e.key === "Home" ? 0 : els.length - 1]?.focus()
        } else if (e.key === "Tab") {
            e.preventDefault()
            setOpen(false)
            btnRef.current?.focus()
        }
    }

    const menu = (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={menuRef}
                    role="listbox"
                    aria-label="Teams"
                    data-lenis-prevent=""
                    onKeyDown={onListKey}
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: pos ? 1 : 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: "fixed",
                        top: pos?.top ?? -9999,
                        [align]: pos?.x ?? 0,
                        zIndex: 2147483000,
                        width: menuW,
                        maxWidth: "calc(100vw - 16px)",
                        maxHeight: "calc(100vh - 24px)",
                        overflowY: "auto",
                        padding: 6,
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid rgba(28,25,23,0.08)",
                        boxShadow: "0 14px 40px rgba(28,25,23,0.14)",
                        boxSizing: "border-box",
                        transformOrigin: `${pos?.up ? "bottom" : "top"} ${align}`,
                        fontFamily: F.sans,
                    }}
                >
                    {options.map((o, i) => {
                        const sel = o.value === current.value
                        return (
                            <motion.button
                                key={o.value}
                                ref={(el) => {
                                    optRefs.current[i] = el
                                }}
                                type="button"
                                role="option"
                                aria-selected={sel}
                                onClick={() => {
                                    onChange(o.value)
                                    setOpen(false)
                                }}
                                whileHover={{ backgroundColor: C.media }}
                                style={{
                                    ...resetButton,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    width: "100%",
                                    padding: isMobile ? "10px 12px" : "11px 14px",
                                    borderRadius: 11,
                                    textAlign: "left",
                                    fontSize: isMobile ? 16 : 17,
                                    lineHeight: 1.3,
                                    fontWeight: sel ? 500 : 400,
                                    color: sel ? C.label : C.text,
                                    backgroundColor: sel ? C.media : "rgba(234,229,225,0)",
                                }}
                            >
                                <TeamIcon name={o.icon} color={sel ? C.label : C.brown} />
                                <span style={{ flex: 1, minWidth: 0 }}>{o.label}</span>
                                <span aria-label={`${counts[o.value] ?? 0} sessions`} style={{ fontSize: isMobile ? 13 : 14, color: C.muted, fontVariantNumeric: "tabular-nums" }}>
                                    {counts[o.value] ?? 0}
                                </span>
                            </motion.button>
                        )
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <div style={{ position: "relative", flexShrink: 0 }}>
            <motion.button
                ref={btnRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Show sessions for: ${current.label}`}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || ((e.key === "Enter" || e.key === " ") && !open)) {
                        e.preventDefault()
                        openAndFocus()
                    }
                }}
                whileHover={{ backgroundColor: "rgba(123,94,59,0.07)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                    ...resetButton,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: isMobile ? 8 : 10,
                    height: isMobile ? 40 : 44,
                    padding: isMobile ? "0 12px" : "0 18px",
                    borderRadius: 10,
                    border: `1.5px solid ${C.brown}`,
                    backgroundColor: "rgba(123,94,59,0)",
                    color: C.label,
                    fontSize: isMobile ? 14.5 : 16,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                }}
            >
                <TeamIcon name={current.icon} color={C.brown} size={isMobile ? 17 : 19} />
                <span style={{ maxWidth: isMobile ? 170 : 260, overflow: "hidden", textOverflow: "ellipsis" }}>{current.label}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "flex", marginLeft: 2 }}>
                    <Chevron dir="down" color={C.brown} />
                </motion.span>
            </motion.button>
            {typeof document !== "undefined" ? createPortal(menu, document.body) : null}
        </div>
    )
}

/* ───────────── Popups ───────────── */

const roundBtn: React.CSSProperties = {
    ...resetButton,
    height: 34,
    minWidth: 34,
    borderRadius: 999,
    background: "#E9E7E4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexShrink: 0,
    color: "#2A2725",
    fontSize: 14,
    fontWeight: 500,
}
const glass: React.CSSProperties = {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
}

function useViewportWidth() {
    const [vw, setVw] = useState(1200)
    useEffect(() => {
        const f = () => setVw(window.innerWidth)
        f()
        window.addEventListener("resize", f)
        return () => window.removeEventListener("resize", f)
    }, [])
    return vw
}

// Scroll lock, Escape to close, share toast
function useModal(onClose: () => void, onShare?: () => Promise<string>) {
    const [toast, setToast] = useState("")
    useScrollLock(true)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])
    useEffect(() => {
        if (!toast) return
        const t = setTimeout(() => setToast(""), 2200)
        return () => clearTimeout(t)
    }, [toast])
    const share = async () => {
        const r = await onShare?.()
        if (r === "copied") setToast("Link copied")
        else if (r === "failed") setToast("Couldn’t copy the link")
    }
    return { toast, share }
}

function Overlay({ children, onClose, padding }: { children: React.ReactNode; onClose: () => void; padding: number }) {
    return createPortal(
        <motion.div
            data-lenis-prevent=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(22,20,18,0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding,
                overscrollBehavior: "contain",
            }}
        >
            {children}
        </motion.div>,
        document.body
    )
}

const panelMotion = {
    initial: { opacity: 0, y: 24, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.985 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

function HeaderButtons({ onShare, onClose, mobile, floating }: { onShare?: () => void; onClose: () => void; mobile: boolean; floating?: boolean }) {
    const bg = floating ? glass : {}
    return (
        <div style={{ display: "flex", gap: 8 }}>
            {onShare && (
                <motion.button type="button" aria-label="Share" onClick={onShare} whileTap={{ scale: 0.94 }} style={{ ...roundBtn, ...bg, padding: mobile ? 0 : "0 14px 0 12px" }}>
                    <ShareIcon />
                    {!mobile && <span>Share</span>}
                </motion.button>
            )}
            <motion.button type="button" aria-label="Close" onClick={onClose} whileTap={{ scale: 0.94 }} style={{ ...roundBtn, ...bg, width: 34 }}>
                <CloseIcon />
            </motion.button>
        </div>
    )
}

function Toast({ text, bottom }: { text: string; bottom: number }) {
    return (
        <AnimatePresence>
            {text && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    role="status"
                    style={{
                        position: "absolute",
                        left: "50%",
                        x: "-50%",
                        bottom,
                        zIndex: 5,
                        background: "#1F1C1A",
                        color: "#fff",
                        fontSize: 14,
                        padding: "9px 16px",
                        borderRadius: 999,
                        whiteSpace: "nowrap",
                    }}
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Footer button(s): the register form(s). Past sessions and events without a form get "Close".
function Footer({ ev, past, onClose, pad, mobile }: { ev: PracticeEvent; past: boolean; onClose: () => void; pad: number; mobile: boolean }) {
    const targets = past ? [] : registerTargets(ev)
    const multi = targets.length > 1
    const btn: React.CSSProperties = {
        ...resetButton,
        height: multi ? 50 : 54,
        borderRadius: 999,
        background: C.accent,
        color: "#fff",
        fontSize: multi ? 16 : 17,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        whiteSpace: "nowrap",
    }
    return (
        <div style={{ flexShrink: 0, borderTop: "1px solid #EDEAE6", padding: `16px ${pad}px ${mobile ? 22 : 20}px`, background: "#fff", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {targets.length ? (
                targets.map((t) => (
                    <motion.a key={t.url} {...linkProps(t.url)} whileTap={{ scale: 0.98 }} style={{ ...btn, flex: multi ? "1 1 220px" : "1 1 100%" }}>
                        {multi && t.date ? `I am Interested for ${shortDate(t.date)}` : "I am Interested"}
                    </motion.a>
                ))
            ) : (
                <motion.button type="button" onClick={onClose} whileTap={{ scale: 0.98 }} style={{ ...btn, width: "100%" }}>
                    Close
                </motion.button>
            )}
        </div>
    )
}

function PointItem({ pt }: { pt: Point }) {
    if (typeof pt === "string") return <li style={{ marginTop: 2 }}>{inline(pt)}</li>
    return (
        <li style={{ marginTop: 2 }}>
            {pt.letter && <strong style={{ marginRight: 8 }}>{pt.letter}</strong>}
            <strong>{/[.:!?]$/.test(pt.label) ? pt.label : pt.label + "."} </strong>
            {pt.text}
        </li>
    )
}

function ModuleList({ ev, mobile }: { ev: PracticeEvent; mobile: boolean }) {
    const titleStyle: React.CSSProperties = { fontFamily: F.serif, fontWeight: 700, fontSize: 18, lineHeight: 1.3, marginTop: 8 }
    let n = 0
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(ev.modules as Module[]).map((m, i) => {
                if ("break" in m)
                    return (
                        <div
                            key={i}
                            role="note"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "9px 16px",
                                borderRadius: 999,
                                background: C.breakBg,
                                color: C.accent,
                                fontSize: 13,
                                fontWeight: 600,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                            }}
                        >
                            <BreakIcon meal={/lunch|meal|dinner|breakfast/i.test(m.break)} color={C.accent} />
                            <span>
                                {m.break}
                                {m.time ? ` - ${m.time}` : ""}
                            </span>
                        </div>
                    )
                const label = m.plain ? m.title : `${ev.moduleLabel || "Module"} ${++n}`
                const parts = [{ text: m.text, points: m.points }, ...(m.parts || [])] as { title?: string; text?: string[]; points?: Point[] }[]
                return (
                    <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, display: "flex", gap: 12, alignItems: "flex-start", padding: mobile ? "18px 16px" : 20 }}>
                        <ModuleIcon name={m.icon} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", columnGap: 12 }}>
                                <div style={{ color: C.accent, fontFamily: F.serif, fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>{label}</div>
                                {m.time && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 14.5, fontWeight: 600, lineHeight: 1.6, paddingTop: 2, whiteSpace: "nowrap" }}>
                                        <ClockIcon />
                                        {m.time}
                                    </div>
                                )}
                            </div>
                            {!m.plain && <div style={titleStyle}>{m.title}</div>}
                            {parts.map((p, pi) => (
                                <React.Fragment key={pi}>
                                    {p.title && <div style={{ ...titleStyle, marginTop: 16 }}>{p.title}</div>}
                                    {!!p.text?.length && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                                            {p.text.map((d, j) => (
                                                <p key={j} style={{ margin: 0, fontSize: 16, lineHeight: 1.45 }}>{inline(d)}</p>
                                            ))}
                                        </div>
                                    )}
                                    {!!p.points?.length && (
                                        <ul style={{ margin: "4px 0 0", paddingLeft: 22, fontSize: 16, lineHeight: 1.45 }}>
                                            {p.points.map((pt, j) => <PointItem key={j} pt={pt} />)}
                                        </ul>
                                    )}
                                </React.Fragment>
                            ))}
                            {m.outcome && (
                                <div style={{ marginTop: 14 }}>
                                    <div style={{ color: C.accent, fontSize: 16, fontWeight: 600 }}>{ev.outcomeLabel || "Participants leave with"}</div>
                                    <div style={{ fontSize: 16, lineHeight: 1.45, marginTop: 4 }}>{inline(m.outcome)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const HIDE_SCROLLBAR = `.ev-scroll{scrollbar-width:none}.ev-scroll::-webkit-scrollbar{display:none}@keyframes ev-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes ev-spin{to{transform:rotate(360deg)}}.ev-shimmer{animation:ev-shimmer 1.4s ease-in-out infinite}.ev-spin{animation:ev-spin .9s linear infinite}@media (prefers-reduced-motion:reduce){.ev-shimmer,.ev-spin{animation:none}}`

/* ---- Speaker details popup ---- */

export function EventModal({ ev, past = false, onClose, onShare }: { ev: PracticeEvent; past?: boolean; onClose: () => void; onShare?: () => Promise<string> }) {
    const { toast, share } = useModal(onClose, onShare)
    const vw = useViewportWidth()
    const mobile = vw < 640
    const pad = mobile ? 20 : 40

    const sp = ev.speaker
    const dated = (ev.sessions || []).filter((s) => s.date)
    const multiDates = !ev.popupDate && dated.length > 1
    const description = ev.showDescInPopup === false ? "" : ev.popupDescription || ev.description || (ev.highlights || []).join("\n")
    const dateText = popupDateText(ev)
    const roleText = sp?.roleFull || (sp?.tagline ? "" : sp?.role)
    const showDetails = !!(dateText || ev.time || ev.location)
    const targets = past ? [] : registerTargets(ev)

    const label: React.CSSProperties = { color: C.accent, fontSize: 16, fontWeight: 600, lineHeight: 1.4 }
    const section: React.CSSProperties = { marginTop: 34 }
    const big: React.CSSProperties = { fontSize: mobile ? 18 : 20, fontWeight: 500, lineHeight: 1.35 }

    return (
        <Overlay onClose={onClose} padding={mobile ? 0 : 40}>
            <style>{HIDE_SCROLLBAR}</style>
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={ev.popupTitle || ev.title}
                {...panelMotion}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 750,
                    height: mobile ? "100%" : "auto",
                    maxHeight: "100%",
                    background: "#fff",
                    borderRadius: mobile ? 0 : 28,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                    fontFamily: F.sans,
                    color: C.text,
                }}
            >
                <div className="ev-scroll" data-lenis-prevent="" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", padding: `${mobile ? 22 : 36}px ${pad}px 32px` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: mobile ? 10 : 16 }}>
                        <h2 style={{ margin: 0, flex: 1, fontSize: mobile ? 24 : 31, fontWeight: 600, lineHeight: 1.33, letterSpacing: "-0.01em" }}>{ev.popupTitle || ev.title}</h2>
                        <div style={{ marginTop: 2 }}>
                            <HeaderButtons onShare={onShare ? share : undefined} onClose={onClose} mobile={mobile} />
                        </div>
                    </div>

                    {sp && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: mobile ? 14 : 20, marginTop: mobile ? 24 : 34 }}>
                            <Avatar src={sp.photo} name={sp.name} size={mobile ? 84 : 120} />
                            <div style={{ minWidth: 0, paddingTop: mobile ? 2 : 6 }}>
                                <div style={{ fontFamily: F.serif, fontWeight: 600, fontSize: mobile ? 23 : 30, lineHeight: 1.25 }}>{sp.name}</div>
                                {roleText && <RoleLine text={roleText} sepColor={C.muted} style={{ color: C.muted, fontSize: mobile ? 15 : 18, lineHeight: 1.4, marginTop: 6 }} />}
                                {sp.tagline && <div style={{ fontStyle: "italic", fontSize: mobile ? 15.5 : 19, lineHeight: 1.45, marginTop: 6 }}>{sp.tagline}</div>}
                            </div>
                        </div>
                    )}

                    {description && (
                        <div style={{ marginTop: 26 }}>
                            <RichText text={description} style={{ fontSize: mobile ? 16 : 18, lineHeight: 1.5 }} gap={20} />
                        </div>
                    )}

                    {showDetails && (
                        <div style={section}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <span style={label}>Event Details</span>
                                {past && <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted, background: C.media, borderRadius: 999, padding: "3px 10px" }}>Completed</span>}
                            </div>
                            {multiDates
                                ? dated.map((s, i) => (
                                      <div key={i} style={{ ...big, display: "flex", alignItems: "flex-start", gap: 10, marginTop: i ? 14 : 0 }}>
                                          <span style={{ marginTop: 1 }}>
                                              <CalendarIcon />
                                          </span>
                                          <span>
                                              {s.date}
                                              {i === 0 && ev.time ? `  |  ${ev.time}` : ""}
                                              {s.label && (
                                                  <span style={{ display: "block", fontSize: mobile ? 15 : 16, fontWeight: 400, color: C.muted, marginTop: 2 }}>
                                                      For {s.label.split("|").map((x) => x.trim()).join(", ")}
                                                  </span>
                                              )}
                                          </span>
                                      </div>
                                  ))
                                : (dateText || ev.time) && (
                                      <div style={{ ...big, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                                          <CalendarIcon />
                                          {dateText && <span>{dateText}</span>}
                                          {dateText && ev.time && <span style={{ width: 1.5, height: 24, background: C.text, margin: "0 4px" }} />}
                                          {ev.time && <span>{ev.time}</span>}
                                      </div>
                                  )}
                            {ev.location && (
                                <div style={{ ...big, display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16 }}>
                                    <span style={{ marginTop: 2 }}>
                                        <PinIcon size={22} />
                                    </span>
                                    <span>{ev.location}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {!!ev.takeaways?.length && (
                        <div style={section}>
                            <div style={{ ...label, marginBottom: 16 }}>{ev.takeawaysTitle ?? "Key Takeaways"}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {ev.takeaways.map((t, i) => (
                                    <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 18px" }}>
                                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.accent, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                                        <span style={{ fontSize: 16, lineHeight: 1.45 }}>{inline(t, { fontFamily: F.serif })}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!!ev.modules?.length && (
                        <div style={section}>
                            <div style={{ ...label, marginBottom: 16 }}>{ev.modulesTitle || "Modules"}</div>
                            <ModuleList ev={ev} mobile={mobile} />
                        </div>
                    )}

                    {ev.closingNote && (
                        <div style={{ marginTop: 34, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: mobile ? 20 : 23, lineHeight: 1.35, color: C.accent }}>{ev.closingNote}</div>
                    )}
                </div>
                <Footer ev={ev} past={past} onClose={onClose} pad={pad} mobile={mobile} />
                <Toast text={toast} bottom={targets.length > 1 && mobile ? 150 : 96} />
            </motion.div>
        </Overlay>
    )
}

/* ---- Poster-only popup (Juniper, Zen …) ---- */

function PosterImage({ src, alt, lazy, name, mobile }: { src: string; alt: string; lazy: boolean; name: string; mobile: boolean }) {
    const ref = useRef<HTMLImageElement>(null)
    const [state, setState] = useState<"loading" | "loaded" | "error">("loading")
    const [attempt, setAttempt] = useState(0)
    const url = attempt ? `${src}${src.includes("?") ? "&" : "?"}r=${attempt}` : src
    useEffect(() => {
        setState(ref.current?.complete && ref.current.naturalWidth > 0 ? "loaded" : "loading")
    }, [url])
    const loaded = state === "loaded"
    return (
        <div style={{ position: "relative", background: C.loading, minHeight: loaded ? 0 : mobile ? "min(62vh, 480px)" : "min(68vh, 600px)", overflow: "hidden" }}>
            {!loaded && (
                <div role="status" aria-live="polite" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center", background: C.media, overflow: "hidden" }}>
                    {state === "loading" && <div aria-hidden className="ev-shimmer" style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 80%)" }} />}
                    {name && <div style={{ position: "relative", fontFamily: F.serif, fontSize: mobile ? 22 : 26, lineHeight: 1.25, maxWidth: 360 }}>{name}</div>}
                    {state === "loading" ? (
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 14.5 }}>
                            <span aria-hidden className="ev-spin" style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${C.line}`, borderTopColor: C.accent, display: "block" }} />
                            Loading poster…
                        </div>
                    ) : (
                        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: C.muted, fontSize: 14.5 }}>
                            <span>The poster didn’t load. Check your connection and try again.</span>
                            <button type="button" onClick={() => setAttempt((a) => a + 1)} style={{ ...roundBtn, padding: "0 16px", background: "#fff", border: `1px solid ${C.line}` }}>
                                Try again
                            </button>
                        </div>
                    )}
                </div>
            )}
            <img
                ref={ref}
                key={url}
                src={url}
                alt={alt}
                loading={lazy ? "lazy" : undefined}
                decoding="async"
                draggable={false}
                onLoad={() => setState("loaded")}
                onError={() => setState("error")}
                style={{ display: "block", width: "100%", height: "auto", opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
        </div>
    )
}

export function PosterModal({ ev, past = false, onClose, onShare }: { ev: PracticeEvent; past?: boolean; onClose: () => void; onShare?: () => Promise<string> }) {
    const { toast, share } = useModal(onClose, onShare)
    const vw = useViewportWidth()
    const mobile = vw < 640
    const posters = posterList(ev)
    const targets = past ? [] : registerTargets(ev)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [more, setMore] = useState(false)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 12)
        check()
        el.addEventListener("scroll", check, { passive: true })
        const ro = new ResizeObserver(check)
        ro.observe(el)
        if (el.firstElementChild) ro.observe(el.firstElementChild)
        return () => {
            el.removeEventListener("scroll", check)
            ro.disconnect()
        }
    }, [])

    return (
        <Overlay onClose={onClose} padding={mobile ? 14 : 40}>
            <style>{HIDE_SCROLLBAR}</style>
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={ev.popupTitle || ev.title}
                {...panelMotion}
                onClick={(e) => e.stopPropagation()}
                style={{ position: "relative", width: "100%", maxWidth: 560, maxHeight: "100%", background: "#fff", borderRadius: mobile ? 20 : 24, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", fontFamily: F.sans, color: C.text }}
            >
                <div style={{ position: "relative", flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
                    <div ref={scrollRef} className="ev-scroll" data-lenis-prevent="" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
                        <div>
                            {posters.length ? (
                                posters.map((src, i) => <PosterImage key={src + i} src={src} alt={i === 0 ? ev.posterAlt || ev.title : ""} lazy={i > 0} name={i === 0 ? ev.calTitle || ev.title : ""} mobile={mobile} />)
                            ) : (
                                <div style={{ padding: mobile ? "64px 22px 32px" : "72px 40px 40px", textAlign: "center" }}>
                                    <div style={{ fontFamily: F.serif, fontSize: mobile ? 23 : 28, lineHeight: 1.3 }}>{ev.popupTitle || ev.title}</div>
                                    <div style={{ marginTop: 12, color: C.muted, fontSize: 16 }}>{[popupDateText(ev), ev.location].filter(Boolean).join(", ")}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <AnimatePresence>
                        {more && (
                            <motion.button
                                type="button"
                                aria-label="Scroll down"
                                onClick={() => scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight * 0.8, behavior: "smooth" })}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                style={{ ...resetButton, ...glass, position: "absolute", left: "50%", x: "-50%", bottom: 14, zIndex: 3, height: 34, padding: "0 14px 0 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6, color: "#2A2725", fontSize: 13.5, fontWeight: 500 }}
                            >
                                <Chevron dir="down" color="#2A2725" />
                                Scroll
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                <div style={{ position: "absolute", top: mobile ? 12 : 16, right: mobile ? 12 : 16, zIndex: 4 }}>
                    <HeaderButtons onShare={onShare ? share : undefined} onClose={onClose} mobile={mobile} floating />
                </div>
                {targets.length > 0 && <Footer ev={ev} past={past} onClose={onClose} pad={mobile ? 16 : 24} mobile={mobile} />}
                <Toast text={toast} bottom={targets.length ? 96 : 60} />
            </motion.div>
        </Overlay>
    )
}
