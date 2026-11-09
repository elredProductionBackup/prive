"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EVENTS, TEAMS, type PracticeEvent } from "@/content/events"
import {
    ALL, ArrowButton, Avatar, C, EventModal, F, PosterModal, TeamDropdown, calRoleOf, canOpen, clamp, cldImage,
    isImageKind, matchesTeam, normKey, oneLine, resetButton, shareEvent, useContainerWidth, useShareParam, type TeamOption,
} from "./ui"

const PARAM = "session"
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const WEEK_START = 1 // Monday
const PAST_OPACITY = 0.5

const pad2 = (n: number) => String(n).padStart(2, "0")
const dayKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const keyToDate = (k: string) => {
    const [y, m, d] = k.split("-").map(Number)
    return new Date(y, m - 1, d || 1)
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const monthTitle = (mk: string) => `${MONTHS[+mk.slice(5, 7) - 1]} ${mk.slice(0, 4)}`

type Item = { ev: PracticeEvent; days: string[]; daySet: Set<string>; first: string; last: string; month: string }

// The month a session "belongs" to = the one holding most of its days
function homeMonth(days: string[]) {
    const count: Record<string, number> = {}
    days.forEach((d) => (count[d.slice(0, 7)] = (count[d.slice(0, 7)] || 0) + 1))
    return Object.keys(count).sort().reduce((best, m) => (count[m] > count[best] ? m : best), days[0].slice(0, 7))
}

function monthGrid(mk: string) {
    const first = keyToDate(mk + "-01")
    const offset = (first.getDay() - WEEK_START + 7) % 7
    const start = addDays(first, -offset)
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
    return Array.from({ length: Math.ceil((offset + daysInMonth) / 7) }, (_, w) => Array.from({ length: 7 }, (_, i) => dayKey(addDays(start, w * 7 + i))))
}

// Back-to-back days in a week merge into one block; clashing sessions get their own lane
function layoutWeek(week: string[], items: Item[]) {
    const runs: { it: Item; start: number; end: number }[] = []
    items.forEach((it) => {
        let s = -1
        for (let i = 0; i <= 7; i++) {
            const on = i < 7 && it.daySet.has(week[i])
            if (on && s < 0) s = i
            if (!on && s >= 0) {
                runs.push({ it, start: s, end: i - 1 })
                s = -1
            }
        }
    })
    runs.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start))
    const laneEnds: number[] = []
    const placed = runs.map((r) => {
        let lane = laneEnds.findIndex((e) => e < r.start)
        if (lane < 0) {
            lane = laneEnds.length
            laneEnds.push(r.end)
        } else laneEnds[lane] = r.end
        return { ...r, lane }
    })
    const busy = new Set<number>()
    placed.forEach((r) => {
        for (let i = r.start; i <= r.end; i++) busy.add(i)
    })
    return { placed, lanes: Math.max(1, laneEnds.length), busy }
}

function DayNum({ k, month, today, compact, mini, weight = 400 }: { k: string; month: string; today: string; compact: boolean; mini: boolean; weight?: number }) {
    const n = +k.slice(8)
    const size = mini ? 11.5 : compact ? 14 : 16
    if (k === today) {
        const pill = mini ? size + 8 : size + 12
        return (
            <span aria-label={`${n}, today`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: pill, height: pill, margin: mini ? "-3px 0 -3px -3px" : "-5px 0 -5px -7px", padding: mini ? "0 3px" : "0 4px", borderRadius: 999, background: C.accent, color: "#fff", fontSize: size, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {n}
            </span>
        )
    }
    const inMonth = k.startsWith(month)
    return <span style={{ fontSize: size, fontWeight: weight, lineHeight: 1.2, color: inMonth ? C.text : C.muted, opacity: inMonth ? 1 : 0.75, fontVariantNumeric: "tabular-nums" }}>{n}</span>
}

// What sits inside a block: logo, Cal Title, or photo + name + designation
function BlockContent({ ev, span, compact, mini, tight, cellW }: { ev: PracticeEvent; span: number; compact: boolean; mini: boolean; tight: boolean; cellW: number }) {
    // Phones: photo, then name and designation inside the box (rows grow to fit)
    if (mini) {
        const photo = !isImageKind(ev) ? ev.speaker?.photo : ""
        const name = ev.calTitle || ev.speaker?.name || ev.title
        const sub = ev.calTitle ? ev.calSubtitle : calRoleOf(ev)
        // Long names step down a size; phones hyphenate long words ("Rama-chandran") instead of cutting them
        const longest = name.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 1)
        const nameSize = longest > 11 ? 7.5 : longest > 9 ? 8 : 8.5
        const wrap: React.CSSProperties = { overflowWrap: "anywhere", hyphens: "auto", WebkitHyphens: "auto", minWidth: 0 } as React.CSSProperties
        return (
            <div style={{ marginTop: 4, minWidth: 0 }}>
                {photo && <Avatar src={photo} name={ev.speaker?.name} size={tight ? 16 : 20} />}
                <div style={{ ...wrap, marginTop: photo ? 4 : 0, fontSize: nameSize, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em", color: C.text, ...(tight ? clamp(2) : {}) }}>{name}</div>
                {sub && !tight && <div style={{ ...wrap, marginTop: 3, fontSize: 7.5, fontWeight: 500, lineHeight: 1.2, color: C.brown, ...clamp(3) }}>{sub}</div>}
            </div>
        )
    }
    const role = tight ? "" : calRoleOf(ev)
    const multi = span > 1 || tight

    if (isImageKind(ev)) {
        const logo = cldImage(ev.logo || "", 600)
        return (
            <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: multi || mini ? "flex-start" : "center", paddingTop: mini ? 3 : tight ? 2 : 6 }}>
                {logo ? (
                    <img src={logo} alt={ev.calTitle || ev.title} style={{ display: "block", maxWidth: "100%", maxHeight: mini ? (tight ? 14 : 22) : tight ? 24 : compact ? 34 : 50, objectFit: "contain" }} />
                ) : (
                    <span style={{ fontFamily: F.serif, fontSize: mini ? 10 : tight ? 14 : compact ? 15 : 19, lineHeight: 1.2, textAlign: multi || mini ? "left" : "center", ...(mini && multi ? oneLine : clamp(tight ? 1 : 2)) }}>
                        {ev.calTitle || ev.title}
                    </span>
                )}
            </div>
        )
    }

    if (ev.calTitle)
        return (
            <div style={{ marginTop: mini ? 3 : tight ? 4 : compact ? 8 : 12, minWidth: 0 }}>
                <div style={{ fontSize: mini ? 9 : compact ? 13 : 15, fontWeight: 600, lineHeight: 1.3, ...(mini && multi ? oneLine : clamp(tight ? 1 : 2)) }}>{ev.calTitle}</div>
                {ev.calSubtitle && !tight && (!mini || span > 1) && (
                    <div style={{ fontSize: mini ? 8.5 : compact ? 11 : 12, lineHeight: 1.35, color: C.muted, marginTop: mini ? 1 : 5, ...(mini ? oneLine : clamp(1)) }}>{ev.calSubtitle}</div>
                )}
            </div>
        )

    const name = ev.speaker?.name || ev.title
    const longest = name.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 1)
    const nameSize = mini ? 9 : Math.max(10, Math.min(compact ? 13 : 14, cellW / (longest * 0.7)))
    const roleSize = mini ? 8 : Math.max(10, Math.min(compact ? 11.5 : 12.5, cellW / 9))
    const avatar = <Avatar src={ev.speaker?.photo} name={ev.speaker?.name} size={mini ? (tight ? 14 : 16) : tight ? 18 : compact ? 20 : 24} />
    const nameEl = <div style={{ fontSize: nameSize, fontWeight: 500, lineHeight: 1.25, minWidth: 0, overflowWrap: "anywhere", ...(mini ? oneLine : clamp(tight ? 1 : 2)) }}>{name}</div>
    const roleEl = role ? <div style={{ fontSize: roleSize, fontWeight: 500, lineHeight: 1.3, color: C.brown, marginTop: mini ? 1 : 3, minWidth: 0, overflowWrap: "anywhere", ...clamp(mini ? 2 : 3) }}>{role}</div> : null

    if (multi)
        return (
            <div style={{ display: "flex", alignItems: role && !mini ? "flex-start" : "center", gap: mini ? 4 : 8, marginTop: mini ? 3 : tight ? 4 : compact ? 8 : 12, minWidth: 0, flexWrap: mini ? "wrap" : "nowrap" }}>
                {avatar}
                <div style={{ minWidth: 0, flex: 1 }}>
                    {nameEl}
                    {roleEl}
                </div>
            </div>
        )
    return (
        <div style={{ marginTop: mini ? 3 : compact ? 6 : 8, minWidth: 0 }}>
            {avatar}
            <div style={{ marginTop: mini ? 2 : 6 }}>{nameEl}</div>
            {roleEl}
        </div>
    )
}

export default function MonthCalendar() {
    const [today, setToday] = useState("")
    useEffect(() => {
        setToday(dayKey(new Date()))
        const t = setInterval(() => setToday(dayKey(new Date())), 60_000)
        return () => clearInterval(t)
    }, [])

    const items: Item[] = useMemo(
        () =>
            EVENTS.filter((ev) => ev.days.length).map((ev) => {
                const days = [...ev.days].sort()
                return { ev, days, daySet: new Set(days), first: days[0], last: days[days.length - 1], month: homeMonth(days) }
            }),
        []
    )
    const isPast = useCallback((it: Item) => !!today && it.last < today, [today])

    // Warm the poster images (Juniper, Zen …) once the page is idle
    useEffect(() => {
        const urls = items.filter((it) => isImageKind(it.ev)).flatMap((it) => (it.ev.posters || []).map((u) => cldImage(u, 1400)))
        const run = () => urls.forEach((u) => (new Image().src = u))
        const w = window as any
        if (w.requestIdleCallback) {
            const id = w.requestIdleCallback(run, { timeout: 4000 })
            return () => w.cancelIdleCallback?.(id)
        }
        const t = setTimeout(run, 2500)
        return () => clearTimeout(t)
    }, [items])

    const teamOptions: TeamOption[] = useMemo(() => [{ value: ALL, label: "All", icon: "grid" }, ...TEAMS.map((t) => ({ value: normKey(t.label), label: t.label, icon: t.icon }))], [])
    const counts = useMemo(() => Object.fromEntries(teamOptions.map((o) => [o.value, items.filter((it) => matchesTeam(it.ev, o.value)).length])), [teamOptions, items])
    const [team, setTeam] = useState(ALL)
    const [manualMonth, setManualMonth] = useState<string | null>(null)
    const [dir, setDir] = useState(0)
    const visible = useMemo(() => items.filter((it) => matchesTeam(it.ev, team)), [items, team])
    const months = useMemo(() => Array.from(new Set(visible.map((it) => it.month))).sort(), [visible])

    // Opens on the month of the next upcoming session
    const autoMonth = useMemo(() => {
        const ref = today || dayKey(new Date())
        const up = visible.filter((it) => it.last >= ref).sort((a, b) => a.first.localeCompare(b.first))
        return up[0]?.month || months[months.length - 1] || ref.slice(0, 7)
    }, [visible, months, today])
    const month = manualMonth || autoMonth
    const prevMonth = [...months].reverse().find((m) => m < month) || null
    const nextMonth = months.find((m) => m > month) || null
    const goMonth = (m: string | null, d: number) => {
        if (!m) return
        setDir(d)
        setManualMonth(m)
    }

    // Sizes: phones use the same grid, just smaller
    const rootRef = useRef<HTMLDivElement>(null)
    const width = useContainerWidth(rootRef)
    const isMobile = width < 600
    const mini = isMobile
    const innerW = Math.max(280, Math.min(width - (isMobile ? 20 : 48), 1240))
    const gap = mini ? 4 : innerW < 900 ? 6 : 8
    const colW = (innerW - gap * 6) / 7
    const compact = colW < 120
    const rowH = mini ? Math.round(Math.max(54, Math.min(66, colW * 1.05))) : Math.round(Math.max(118, Math.min(156, colW * 0.88)))
    const padX = mini ? 3 : compact ? 9 : 12
    const padY = mini ? 4 : compact ? 8 : 10
    const radius = mini ? 8 : 12

    const [open, setOpen] = useState<string | null>(null)
    const openItem = open ? items.find((it) => it.ev.id === open) : null
    const close = useCallback(() => setOpen(null), [])

    // ?session=<id> jumps to that month and opens its popup
    useShareParam(PARAM, open, (id) => {
        const it = items.find((x) => x.ev.id === id)
        if (!it || !canOpen(it.ev)) return
        setTeam(ALL)
        setManualMonth(it.month)
        rootRef.current?.scrollIntoView({ block: "start" })
        setTimeout(() => setOpen(id), 150)
    })

    const weeks = useMemo(() => monthGrid(month), [month])
    const weekdays = Array.from({ length: 7 }, (_, i) => DOW[(i + WEEK_START) % 7])

    const dropdown = (
        <TeamDropdown
            options={teamOptions}
            value={team}
            counts={counts}
            isMobile={isMobile}
            align="left"
            onChange={(v) => {
                setTeam(v)
                setManualMonth(null)
                setDir(0)
            }}
        />
    )

    return (
        <div ref={rootRef} style={{ width: "100%", background: "#fff", padding: isMobile ? "24px 10px" : "48px 24px", fontFamily: F.sans, color: C.text, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: 1240 }}>
                <div style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? 12 : 20, marginBottom: isMobile ? 16 : 26 }}>
                    <h2 aria-live="polite" style={{ margin: 0, fontFamily: F.serif, fontWeight: 400, fontSize: isMobile ? 28 : compact ? 32 : 40, lineHeight: 1.15, whiteSpace: "nowrap" }}>
                        {monthTitle(month)}
                    </h2>
                    {!isMobile && dropdown}
                    <div style={{ flex: 1 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                        <ArrowButton dir="left" label="Previous month" size={isMobile ? 36 : 40} disabled={!prevMonth} onClick={() => goMonth(prevMonth, -1)} />
                        <ArrowButton dir="right" label="Next month" size={isMobile ? 36 : 40} disabled={!nextMonth} onClick={() => goMonth(nextMonth, 1)} />
                    </div>
                    {isMobile && <div style={{ width: "100%" }}>{dropdown}</div>}
                </div>

                {visible.length === 0 ? (
                    <div style={{ padding: 40, borderRadius: 20, border: `1.5px dashed ${C.line}`, textAlign: "center", color: C.muted }}>
                        Nothing scheduled for {teamOptions.find((o) => o.value === team)?.label} yet. Choose another team or All.
                    </div>
                ) : (
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                        <motion.div
                            key={`${team}-${month}`}
                            custom={dir}
                            variants={{
                                enter: (d: number) => ({ x: d * 28, opacity: 0 }),
                                center: { x: 0, opacity: 1 },
                                exit: (d: number) => ({ x: -d * 28, opacity: 0 }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap, marginBottom: gap + (mini ? 2 : 4) }}>
                                {weekdays.map((l) => (
                                    <div key={l} style={{ height: mini ? 26 : compact ? 34 : 42, borderRadius: mini ? 7 : 10, background: "#EAE5E1", color: "#9D8079", display: "flex", alignItems: "center", justifyContent: "center", fontSize: mini ? 9.5 : compact ? 12.5 : 14.5, fontWeight: mini ? 600 : 500, letterSpacing: "0.04em" }}>
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap }}>
                                {weeks.map((week) => {
                                    const lay = layoutWeek(week, visible)
                                    const laneMin = lay.lanes === 1 ? rowH : Math.max(mini ? 30 : 56, Math.round((rowH - gap * (lay.lanes - 1)) / lay.lanes))
                                    return (
                                        <div key={week[0]} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gridTemplateRows: `repeat(${lay.lanes}, minmax(${laneMin}px, auto))`, gap }}>
                                            {week.map((k, i) =>
                                                lay.busy.has(i) ? null : (
                                                    <div key={k} style={{ gridColumn: `${i + 1}`, gridRow: "1 / -1", borderRadius: radius, border: "1px solid #F1DFD9", background: "#fff", padding: `${padY}px ${padX}px`, minWidth: 0 }}>
                                                        <DayNum k={k} month={month} today={today} compact={compact} mini={mini} />
                                                    </div>
                                                )
                                            )}
                                            {lay.placed.map((r) => {
                                                const ev = r.it.ev
                                                const span = r.end - r.start + 1
                                                const days = week.slice(r.start, r.end + 1)
                                                const past = isPast(r.it)
                                                const opens = canOpen(ev)
                                                const tight = lay.lanes > 1
                                                const label = [ev.calTitle || ev.speaker?.name || ev.title, calRoleOf(ev), ev.calTitle ? ev.calSubtitle : ev.title].filter(Boolean).join(", ")
                                                const Tag: any = opens ? motion.button : motion.div
                                                return (
                                                    <Tag
                                                        key={`${ev.id}-${r.start}`}
                                                        type={opens ? "button" : undefined}
                                                        onClick={opens ? () => setOpen(ev.id) : undefined}
                                                        aria-label={opens ? `${label}. Open details` : undefined}
                                                        initial={false}
                                                        animate={{ opacity: past ? PAST_OPACITY : 1, y: 0 }}
                                                        whileHover={opens && !mini ? (past ? { opacity: PAST_OPACITY + 0.3 } : { y: -2 }) : undefined}
                                                        whileTap={opens ? { scale: 0.985 } : undefined}
                                                        transition={{ duration: 0.2 }}
                                                        style={{
                                                            ...resetButton,
                                                            gridColumn: `${r.start + 1} / ${r.end + 2}`,
                                                            gridRow: `${r.lane + 1}`,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "stretch",
                                                            textAlign: "left",
                                                            minWidth: 0,
                                                            minHeight: 0,
                                                            overflow: "hidden",
                                                            borderRadius: radius,
                                                            border: "1px solid #A07272",
                                                            background: "#fff",
                                                            padding: `${padY}px ${padX}px`,
                                                            cursor: opens ? "pointer" : "default",
                                                        }}
                                                    >
                                                        {/* One number per day, lined up with the columns */}
                                                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`, columnGap: gap, margin: `0 -${padX}px` }}>
                                                            {days.map((k) => (
                                                                <div key={k} style={{ paddingLeft: padX, minWidth: 0 }}>
                                                                    <DayNum k={k} month={month} today={today} compact={compact} mini={mini} weight={span > 1 ? 600 : 500} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <BlockContent ev={ev} span={span} compact={compact} mini={mini} tight={tight} cellW={colW - padX * 2} />
                                                    </Tag>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <AnimatePresence>
                {openItem &&
                    (isImageKind(openItem.ev) ? (
                        <PosterModal key="month-poster" ev={openItem.ev} past={isPast(openItem)} onClose={close} onShare={() => shareEvent(PARAM, openItem.ev)} />
                    ) : (
                        <EventModal key="month-modal" ev={openItem.ev} past={isPast(openItem)} onClose={close} onShare={() => shareEvent(PARAM, openItem.ev)} />
                    ))}
            </AnimatePresence>
        </div>
    )
}
