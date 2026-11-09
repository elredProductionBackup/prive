"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EVENTS, TEAMS, type PracticeEvent } from "@/content/events"
import {
    ALL, ArrowButton, Avatar, C, EventModal, F, FadeImg, LinkedInIcon, PinIcon, RoleLine, TeamDropdown,
    cldImage, cldVideo, clamp, inline, linkProps, matchesTeam, normKey, registerTargets, resetButton,
    shareEvent, shortDate, useContainerWidth, useShareParam, type TeamOption,
} from "./ui"

const PARAM = "event"
const TAGLINE = "One direction. Forward."

/* ───────────── Media (image or click-to-play video) ───────────── */

function Media({ ev, isMobile }: { ev: PracticeEvent; isMobile: boolean }) {
    const [playing, setPlaying] = useState(false)
    const [useOriginal, setUseOriginal] = useState(false)
    const m = ev.media
    const box: React.CSSProperties = { position: "relative", width: "100%", aspectRatio: isMobile ? "1.6 / 1" : "1.54 / 1", borderRadius: isMobile ? 10 : 12, overflow: "hidden", background: C.loading }
    const cover: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }
    if (!m) return <div style={box} />
    if (m.type === "image") return <div style={box}><FadeImg src={cldImage(m.src, 1000)} alt={ev.speaker?.name} style={cover} /></div>

    const src = useOriginal ? m.src : cldVideo(m.src)
    const poster = cldImage(m.poster || "", 1000)
    if (playing)
        return (
            <div style={{ ...box, background: "#000" }}>
                <video src={src} controls autoPlay playsInline onError={() => !useOriginal && setUseOriginal(true)} style={{ ...cover, objectFit: "contain" }} />
            </div>
        )
    return (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${ev.speaker?.name || ev.title}`} style={{ ...resetButton, ...box, display: "block" }}>
            {poster ? <FadeImg src={poster} alt={`${ev.speaker?.name || ev.title}, video introduction`} style={cover} /> : <video src={`${src}#t=0.1`} muted playsInline preload="metadata" style={cover} />}
            <motion.span
                whileHover={{ scale: 1.08 }}
                style={{ position: "absolute", left: "50%", top: "50%", x: "-50%", y: "-50%", width: isMobile ? 42 : 52, height: isMobile ? 42 : 52, borderRadius: "50%", background: C.accent, opacity: 0.92, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                    <path d="M5 3.2v11.6c0 .6.7 1 1.2.6l8.4-5.8c.4-.3.4-.9 0-1.2L6.2 2.6C5.7 2.2 5 2.6 5 3.2Z" fill="#fff" />
                </svg>
            </motion.span>
        </button>
    )
}

/* ───────────── Speaker panel ───────────── */

function SpeakerPanel({ ev, isMobile }: { ev: PracticeEvent; isMobile: boolean }) {
    const ref = useRef<HTMLDivElement>(null)
    const pw = useContainerWidth(ref, 440)
    const sp = ev.speaker
    // The name row scales with the panel so it keeps its shape at any size
    const lim = (min: number, v: number, max: number) => Math.round(Math.max(min, Math.min(max, v)) * 10) / 10
    const avatar = lim(36, pw * 0.135, 60)
    const icon = lim(20, pw * 0.064, 28)
    const longest = (sp?.name || "").split(/\s+/).reduce((m, w) => Math.max(m, w.length), 1)
    const nameSize = lim(14, Math.min(pw * 0.063, (pw - avatar - icon - (isMobile ? 46 : 54)) / (longest * 0.6)), 28)

    return (
        <div ref={ref} style={{ background: C.media, borderRadius: isMobile ? 16 : 20, padding: isMobile ? 8 : 10 }}>
            <Media ev={ev} isMobile={isMobile} />
            {sp && (
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 12, padding: isMobile ? "10px 4px 4px" : "12px 6px 6px" }}>
                    <Avatar src={sp.photo} name={sp.name} size={avatar} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <span style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: nameSize, letterSpacing: "-0.03em", lineHeight: 1.15, overflowWrap: "anywhere" }}>{sp.name}</span>
                            {sp.linkedin && (
                                <motion.a
                                    href={sp.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${sp.name} on LinkedIn (opens in a new tab)`}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.94 }}
                                    style={{ display: "flex", flexShrink: 0, borderRadius: 5, marginTop: Math.max(0, (nameSize * 1.15 - icon) / 2) }}
                                >
                                    <LinkedInIcon size={icon} />
                                </motion.a>
                            )}
                        </div>
                        <RoleLine text={sp.role} sepColor={C.maroon} style={{ fontSize: lim(12, pw * 0.036, 16), marginTop: isMobile ? 4 : 6, lineHeight: 1.35, ...clamp(3) }} />
                    </div>
                </div>
            )}
        </div>
    )
}

/* ───────────── Date strip ───────────── */

function SessionStrip({ ev, isMobile }: { ev: PracticeEvent; isMobile: boolean }) {
    const sessions = ev.sessions || []
    if (!sessions.length) return null
    const multi = sessions.length > 1
    const longLabel = sessions.some((s) => (s.label || "").length > 18)
    const cols = isMobile ? (longLabel ? 1 : Math.min(2, sessions.length)) : sessions.length
    const stacked = multi && cols === 1

    const cell = (s: (typeof sessions)[number], i: number) => (
        <div
            key={i}
            style={{
                textAlign: "center",
                padding: stacked ? (i > 0 ? "16px 8px 0" : "0 8px") : multi ? (isMobile ? "2px 8px" : "2px 16px") : 0,
                borderLeft: multi && !stacked && i % cols !== 0 ? `1.5px solid ${C.divider}` : "none",
                borderTop: stacked && i > 0 ? `1px solid ${C.divider}` : "none",
                minWidth: 0,
                overflowWrap: "break-word",
            }}
        >
            <div style={{ fontSize: isMobile ? 14.5 : 18, fontWeight: 500 }}>{s.date}</div>
            {s.label && <RoleLine text={s.label} sepColor={C.maroon} style={{ fontFamily: F.serif, fontWeight: 700, fontSize: isMobile ? 16 : 21, color: C.label, marginTop: isMobile ? 4 : 6, lineHeight: 1.4 }} />}
            {s.text && <p style={{ margin: "6px auto 0", maxWidth: 500, fontSize: isMobile ? 11.5 : 12.5, fontWeight: 600, lineHeight: 1.5 }}>{s.text}</p>}
        </div>
    )

    if (!multi) return <div style={{ marginTop: isMobile ? 18 : 26, padding: isMobile ? "0 8px" : 0 }}>{cell(sessions[0], 0)}</div>
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                rowGap: stacked ? 16 : 18,
                maxWidth: stacked ? 320 : sessions.length === 2 ? 780 : 860,
                margin: `${isMobile ? 18 : 30}px auto 0`,
            }}
        >
            {sessions.map(cell)}
        </div>
    )
}

/* ───────────── Card ───────────── */

function RegisterRow({ ev, isMobile, sticker }: { ev: PracticeEvent; isMobile: boolean; sticker?: PracticeEvent["sticker"] }) {
    const targets = registerTargets(ev)
    if (!targets.length && !sticker) return null
    const multi = targets.length > 1
    return (
        <div style={{ position: "relative", marginTop: isMobile ? 18 : 22, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, minHeight: sticker ? 44 : undefined }}>
            {targets.map((t) => (
                <motion.a
                    key={t.url}
                    {...linkProps(t.url)}
                    whileHover={{ backgroundColor: C.brown, color: "#FFFFFF" }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: "inline-flex", alignItems: "center", padding: isMobile ? "7px 22px" : "8px 30px", borderRadius: 999, border: `1.5px solid ${C.brown}`, color: C.text, fontSize: isMobile ? 16 : 17, lineHeight: 1.25, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                    {multi && t.date ? `Register for ${shortDate(t.date)}` : "Register"}
                </motion.a>
            ))}
            {sticker && (
                <img src={cldImage(sticker.src, 600)} alt={sticker.alt} draggable={false} style={{ position: "absolute", right: 0, top: "50%", width: 132, transform: "translateY(-50%)", pointerEvents: "none", zIndex: 3 }} />
            )}
        </div>
    )
}

function EventCard({ ev, isMobile, isTablet, onOpen }: { ev: PracticeEvent; isMobile: boolean; isTablet: boolean; onOpen: () => void }) {
    const text = (
        <div style={{ flex: isMobile ? "none" : 1, minWidth: 0, padding: isMobile ? "0 8px" : 0 }}>
            <h3 style={{ margin: 0, fontFamily: F.serif, fontWeight: 400, fontSize: isMobile ? 21 : 27, lineHeight: 1.45, ...clamp(ev.titleLines || 2) }}>{ev.title}</h3>
            {!!ev.highlights?.length && (
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10, marginTop: 10 }}>
                    {ev.highlights.map((h, i) => (
                        <p key={i} style={{ margin: 0, fontSize: isMobile ? 15 : 17, lineHeight: 1.5 }}>{inline(h, { fontWeight: 600 })}</p>
                    ))}
                </div>
            )}
            {ev.description && (
                <p style={{ margin: isMobile ? "10px 0 0" : "12px 0 0", fontSize: isMobile ? 15 : 17, lineHeight: 1.5, whiteSpace: "pre-line", ...clamp(ev.descLines || 5) }}>
                    {ev.description.replace(/\*\*([^*]+?)\*\*/g, "$1")}
                </p>
            )}
            {!ev.hideViewDetails && (
                <button type="button" onClick={onOpen} style={{ ...resetButton, marginTop: isMobile ? 12 : 16, fontSize: isMobile ? 15 : 14, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    View Details
                </button>
            )}
            {ev.location && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: isMobile ? 16 : 22, fontSize: isMobile ? 14.5 : 16, lineHeight: 1.45 }}>
                    <span style={{ marginTop: 2 }}>
                        <PinIcon color={C.maroon} size={isMobile ? 17 : 18} />
                    </span>
                    <span>{ev.location}</span>
                </div>
            )}
            <RegisterRow ev={ev} isMobile={isMobile} sticker={isMobile ? ev.sticker : undefined} />
        </div>
    )

    return (
        <div
            style={{
                position: "relative",
                background: "#FAF9F8",
                borderRadius: isMobile ? 20 : 28,
                border: "1px solid rgba(28,25,23,0.07)",
                padding: isMobile ? "10px 10px 22px" : isTablet ? "36px 32px 32px" : "40px 48px 34px",
            }}
        >
            {isMobile ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <SpeakerPanel ev={ev} isMobile />
                    {text}
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: isTablet ? 32 : 56 }}>
                    <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>{text}</div>
                    <div style={{ width: isTablet ? "46%" : 440, flexShrink: 0 }}>
                        <SpeakerPanel ev={ev} isMobile={false} />
                    </div>
                </div>
            )}

            <div style={{ height: 1, background: "rgba(28,25,23,0.22)", margin: isMobile ? "22px 8px 0" : "28px 52px 0" }} />
            <SessionStrip ev={ev} isMobile={isMobile} />

            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14, marginTop: isMobile ? 18 : 30, padding: isMobile ? "0 8px" : "0 52px" }}>
                <div style={{ flex: 1, height: 1, background: C.maroon, opacity: 0.45 }} />
                <span style={{ fontFamily: F.head, fontWeight: 700, fontStyle: "italic", fontSize: isMobile ? 16 : 22, whiteSpace: "nowrap" }}>{TAGLINE}</span>
                <div style={{ flex: 1, height: 1, background: C.maroon, opacity: 0.45 }} />
            </div>

            {!isMobile && ev.sticker && (
                <img
                    src={cldImage(ev.sticker.src, 900)}
                    alt={ev.sticker.alt}
                    draggable={false}
                    style={{ position: "absolute", right: 24, bottom: 18, width: isTablet ? 255 : 300, pointerEvents: "none", zIndex: 3 }}
                />
            )}
        </div>
    )
}

function Dots({ count, active, onSelect }: { count: number; active: number; onSelect: (i: number) => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {Array.from({ length: count }).map((_, i) => (
                <motion.button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                    onClick={() => onSelect(i)}
                    animate={{ width: i === active ? 30 : 12, backgroundColor: i === active ? C.brown : "#D8D3CF" }}
                    transition={{ duration: 0.3 }}
                    style={{ ...resetButton, height: 12, borderRadius: 999 }}
                />
            ))}
        </div>
    )
}

/* ───────────── Main ───────────── */

const dayNum = (iso: string) => new Date(iso + "T00:00:00").getTime()

export default function WhenCarousel() {
    const rootRef = useRef<HTMLDivElement>(null)
    const width = useContainerWidth(rootRef)
    const isMobile = width < 768
    const isTablet = width < 1100

    // Upcoming first (soonest → latest), finished sessions moved to the end
    const [today, setToday] = useState<number | null>(null)
    useEffect(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        setToday(d.getTime())
    }, [])
    const sorted = useMemo(() => {
        const list = EVENTS.filter((e) => e.carousel)
        const first = (e: PracticeEvent) => dayNum(e.days[0])
        const last = (e: PracticeEvent) => dayNum(e.days[e.days.length - 1])
        const up = list.filter((e) => today === null || last(e) >= today).sort((a, b) => first(a) - first(b))
        const past = today === null ? [] : list.filter((e) => last(e) < today).sort((a, b) => first(b) - first(a))
        return [...up, ...past]
    }, [today])

    const teamOptions: TeamOption[] = useMemo(() => [{ value: ALL, label: "All", icon: "grid" }, ...TEAMS.map((t) => ({ value: normKey(t.label), label: t.label, icon: t.icon }))], [])
    const counts = useMemo(() => Object.fromEntries(teamOptions.map((o) => [o.value, sorted.filter((e) => matchesTeam(e, o.value)).length])), [teamOptions, sorted])
    const [team, setTeam] = useState(ALL)
    const list = useMemo(() => sorted.filter((e) => matchesTeam(e, team)), [sorted, team])
    const count = list.length

    const [[page, dir], setPage] = useState<[number, number]>([0, 0])
    const [open, setOpen] = useState<string | null>(null)
    const index = count ? ((page % count) + count) % count : 0
    const ev = list[index]
    const openEv = open ? EVENTS.find((e) => e.id === open) : null

    const paginate = useCallback((d: number) => setPage(([p]) => [p + d, d]), [])
    const close = useCallback(() => setOpen(null), [])

    // ?event=<id> opens that card's popup
    useShareParam(PARAM, open, (id) => {
        const i = sorted.findIndex((e) => e.id === id)
        if (i < 0 || sorted[i].hideViewDetails) return
        setTeam(ALL)
        setPage([i, 0])
        rootRef.current?.scrollIntoView({ block: "start" })
        setTimeout(() => setOpen(id), 150)
    })

    const gutter = isMobile ? 0 : 42 + (isTablet ? 14 : 22)
    const single = count < 2

    return (
        <div ref={rootRef} style={{ width: "100%", background: "#F4F1EE", padding: isMobile ? "32px 14px" : "64px 24px", fontFamily: F.sans, color: C.text, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: 1100 + gutter * 2, padding: `0 ${gutter}px`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: isMobile ? 22 : 30 }}>
                <div style={{ paddingLeft: isMobile ? 4 : 12 }}>
                    <h2 style={{ margin: 0, fontFamily: F.serif, fontWeight: 400, fontSize: isMobile ? 32 : 40, lineHeight: 1.2 }}>What’s next</h2>
                    <div style={{ width: isMobile ? 52 : 60, height: 3, background: C.accent, marginTop: 8, borderRadius: 2 }} />
                </div>
                <TeamDropdown
                    options={teamOptions}
                    value={team}
                    counts={counts}
                    isMobile={isMobile}
                    onChange={(v) => {
                        setTeam(v)
                        setPage([0, 0])
                    }}
                />
            </div>

            {count === 0 ? (
                <div style={{ width: "100%", maxWidth: 1100, padding: 40, borderRadius: 24, border: `1.5px dashed ${C.line}`, textAlign: "center", color: C.muted }}>
                    Nothing scheduled for {teamOptions.find((o) => o.value === team)?.label} yet. Choose another team or All.
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isTablet ? 14 : 22, width: "100%" }}>
                    {!isMobile && <ArrowButton dir="left" label="Previous session" disabled={single} onClick={() => paginate(-1)} />}
                    <div style={{ flex: 1, maxWidth: 1100, minWidth: 0 }}>
                        <AnimatePresence mode="wait" custom={dir} initial={false}>
                            <motion.div
                                key={`${team}-${ev.id}`}
                                custom={dir}
                                variants={{
                                    enter: (d: number) => ({ x: d >= 0 ? 48 : -48, opacity: 0 }),
                                    center: { x: 0, opacity: 1 },
                                    exit: (d: number) => ({ x: d >= 0 ? -48 : 48, opacity: 0 }),
                                }}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                drag={isMobile && !single ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.18}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -60) paginate(1)
                                    else if (info.offset.x > 60) paginate(-1)
                                }}
                                style={{ touchAction: "pan-y" }}
                            >
                                <EventCard ev={ev} isMobile={isMobile} isTablet={isTablet} onOpen={() => setOpen(ev.id)} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    {!isMobile && <ArrowButton dir="right" label="Next session" disabled={single} onClick={() => paginate(1)} />}
                </div>
            )}

            {count > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "space-between" : "center", gap: 16, width: "100%", maxWidth: isMobile ? 1100 : undefined, marginTop: isMobile ? 20 : 40, padding: isMobile ? "0 4px" : 0 }}>
                    {isMobile && <ArrowButton dir="left" label="Previous session" size={38} disabled={single} onClick={() => paginate(-1)} />}
                    <Dots count={count} active={index} onSelect={(i) => setPage([i, i >= index ? 1 : -1])} />
                    {isMobile && <ArrowButton dir="right" label="Next session" size={38} disabled={single} onClick={() => paginate(1)} />}
                </div>
            )}

            <AnimatePresence>
                {openEv && <EventModal key="when-modal" ev={openEv} onClose={close} onShare={() => shareEvent(PARAM, openEv)} />}
            </AnimatePresence>
        </div>
    )
}
