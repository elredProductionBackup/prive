"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { SLIDES, type Slide } from "@/content/previously"
import { useScrollLock } from "@/lib/site"

const ACTIVE = "#775E36"
const INACTIVE = "#D5CECA"
const ACCENT = "#C7A978"
const RADIUS = 12
const SPEED = 45 // px per second
const RESUME_MS = 2500 // wait after a swipe/tap before auto-scrolling again

const isCldVideo = (u = "") => u.includes("/video/upload/")
const cldMp4 = (u = "") => (isCldVideo(u) ? u.replace(/\.(mov|m4v|webm|ogg|avi)(\?.*)?$/i, ".mp4$2") : u)
const cldPoster = (u = "") => (isCldVideo(u) ? u.replace("/video/upload/", "/video/upload/so_0/").replace(/\.(mov|mp4|m4v|webm|ogg|avi)(\?.*)?$/i, ".jpg$2") : "")
const coverOf = (s: Slide) => s.cover || (s.type === "video" ? cldPoster(s.video) : s.gallery?.[0] || "")
const fmt = (sec: number) => {
    if (!isFinite(sec) || sec < 0) sec = 0
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? "0" : ""}${s}`
}

const PlayGlyph = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M8 5v14l11-7z" />
    </svg>
)
const ImgGlyph = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#fff" stroke="none" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
)
const Arrow = ({ dir, color = "#fff" }: { dir: "left" | "right"; color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default function PreviouslyCarousel() {
    const slides = SLIDES
    const N = slides.length
    const wrapRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const [W, setW] = useState(1200)
    const [active, setActive] = useState(0)
    const [lightbox, setLightbox] = useState<number | null>(null)

    const isMobile = W < 640
    const cardW = isMobile ? Math.round(Math.min(240, W * 0.66)) : 280
    const cardH = Math.round(cardW * 1.55)
    const gap = isMobile ? 16 : 22
    const step = cardW + gap
    const baseWidth = Math.max(1, N * step)
    const unitReps = Math.max(2, Math.ceil(W / baseWidth) + 1)
    const unitWidth = unitReps * baseWidth
    const renderCount = N ? unitReps * 2 * N : 0

    const geom = useRef({ W, cardW, step, N, unitWidth })
    geom.current = { W, cardW, step, N, unitWidth }
    const offset = useRef(0)
    const st = useRef({ mode: "auto" as "auto" | "tween" | "drag", paused: false, locked: false, from: 0, to: 0, elapsed: 0, dur: 500, dragX: 0, dragOffset: 0, dragged: false, resumeAt: 0, last: -1 })

    useEffect(() => {
        const el = wrapRef.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // One animation loop drives scroll position, card scale/opacity and the active dot
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let raf = 0
        let last = performance.now()
        const wrap = (o: number, p: number) => {
            if (p <= 0) return o
            let r = o % p
            if (r > 0) r -= p
            return r
        }
        const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
        const frame = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000)
            last = now
            const g = geom.current
            const s = st.current
            if (s.mode === "tween") {
                s.elapsed += dt * 1000
                const p = Math.min(1, s.elapsed / s.dur)
                offset.current = s.from + (s.to - s.from) * ease(p)
                if (p >= 1) s.mode = "auto"
            } else {
                if (s.mode === "auto" && !reduce && !s.paused && !s.locked && now >= s.resumeAt) offset.current -= SPEED * dt
                offset.current = wrap(offset.current, g.unitWidth)
            }
            if (trackRef.current) trackRef.current.style.transform = `translate3d(${offset.current}px,0,0)`
            const center = g.W / 2
            let best = 0
            let bestDist = Infinity
            cardRefs.current.forEach((el, j) => {
                if (!el) return
                const dpx = offset.current + j * g.step + g.cardW / 2 - center
                const d = Math.abs(dpx) / g.step
                el.style.opacity = String(Math.max(0.55, 1 - Math.max(0, d - 1.6) * 0.28))
                if (Math.abs(dpx) < bestDist) {
                    bestDist = Math.abs(dpx)
                    best = j
                }
            })
            const base = g.N ? best % g.N : 0
            if (base !== s.last) {
                s.last = base
                setActive(base)
            }
            raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)
        return () => cancelAnimationFrame(raf)
    }, [])

    const tweenTo = (to: number, dur = 500) => {
        const s = st.current
        Object.assign(s, { mode: "tween", from: offset.current, to, elapsed: 0, dur, resumeAt: performance.now() + RESUME_MS })
    }
    const goTo = (i: number) => {
        const g = geom.current
        const raw = g.W / 2 - g.cardW / 2 - i * g.step
        const period = g.step * g.N
        tweenTo(raw + Math.round((offset.current - raw) / period) * period, 550)
    }

    const onMove = useCallback((e: PointerEvent) => {
        const s = st.current
        if (s.mode !== "drag") return
        const dx = e.clientX - s.dragX
        if (Math.abs(dx) > 6) s.dragged = true
        offset.current = s.dragOffset + dx
        s.resumeAt = performance.now() + RESUME_MS
    }, [])
    const onUp = useCallback(() => {
        st.current.mode = "auto"
        st.current.resumeAt = performance.now() + RESUME_MS
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
    }, [onMove])
    useEffect(() => () => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
    }, [onMove, onUp])

    const onPointerDown = (e: React.PointerEvent) => {
        Object.assign(st.current, { mode: "drag", dragX: e.clientX, dragOffset: offset.current, dragged: false, resumeAt: performance.now() + RESUME_MS })
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
    }

    const openCard = (i: number) => {
        if (st.current.dragged) return
        st.current.locked = true
        setLightbox(i)
    }
    const close = useCallback(() => {
        st.current.locked = false
        setLightbox(null)
    }, [])

    cardRefs.current.length = renderCount

    return (
        <div ref={wrapRef} style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
            <div
                style={{ position: "relative", width: "100%" }}
                onMouseEnter={() => (st.current.paused = true)}
                onMouseLeave={() => (st.current.paused = false)}
            >
                {!isMobile && (
                    <>
                        <ArrowBtn side="left" onClick={() => tweenTo(offset.current + step)} />
                        <ArrowBtn side="right" onClick={() => tweenTo(offset.current - step)} />
                    </>
                )}
                <div onPointerDown={onPointerDown} style={{ width: "100%", height: cardH + 24, overflow: "hidden", display: "flex", alignItems: "center", touchAction: "pan-y", userSelect: "none", cursor: "grab" }}>
                    <div ref={trackRef} style={{ display: "flex", gap, alignItems: "center", willChange: "transform" }}>
                        {Array.from({ length: renderCount }, (_, j) => {
                            const s = slides[j % N]
                            const cover = coverOf(s)
                            const isVideo = s.type === "video"
                            return (
                                <div
                                    key={j}
                                    ref={(el) => {
                                        cardRefs.current[j] = el
                                    }}
                                    role="button"
                                    tabIndex={j < N ? 0 : -1}
                                    aria-hidden={j >= N}
                                    aria-label={`${s.title}, ${isVideo ? "play video" : "open photos"}`}
                                    onClick={() => openCard(j % N)}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openCard(j % N))}
                                    style={{
                                        position: "relative",
                                        flex: "0 0 auto",
                                        width: cardW,
                                        height: cardH,
                                        borderRadius: RADIUS,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        background: cover ? "#111" : "linear-gradient(150deg,#6d6355,#2e2a24)",
                                        boxShadow: "0 18px 40px -18px rgba(0,0,0,0.45)",
                                    }}
                                >
                                    {cover && <img src={cover} alt={j < N ? `${s.title}, ${s.subtitle.toLowerCase()}` : ""} loading="lazy" decoding="async" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />}
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,.15) 42%,transparent 68%)" }} />
                                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 5, padding: "5px 9px", borderRadius: 6, background: "rgba(0,0,0,.45)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: 0.4, fontFamily: "var(--sans)" }}>
                                        {isVideo ? <><PlayGlyph size={9} />{s.duration || "VIDEO"}</> : <><ImgGlyph />IMAGE</>}
                                    </div>
                                    {isVideo && (
                                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 58, height: 58, borderRadius: 999, background: "rgba(255,255,255,.16)", backdropFilter: "blur(3px)", border: "1.5px solid rgba(255,255,255,.85)", display: "grid", placeItems: "center" }}>
                                            <PlayGlyph size={18} />
                                        </div>
                                    )}
                                    <div style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
                                        <div style={{ width: 28, height: 1.5, background: ACCENT, marginBottom: 10 }} />
                                        <div style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: isMobile ? 17 : 19, lineHeight: 1.18, color: "#fff" }}>{s.title}</div>
                                        <div style={{ marginTop: 7, fontFamily: "var(--sans)", fontSize: 10, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase", color: "rgba(255,255,255,.82)" }}>{s.subtitle}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 26 }}>
                {slides.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                        aria-current={i === active}
                        style={{ border: "none", cursor: "pointer", padding: 0, height: 12, width: i === active ? 30 : 12, borderRadius: 999, background: i === active ? ACTIVE : INACTIVE, transition: "width .3s ease, background .3s ease" }}
                    />
                ))}
            </div>

            {lightbox !== null &&
                createPortal(
                    slides[lightbox].type === "video" ? <VideoLightbox slide={slides[lightbox]} onClose={close} /> : <ImageLightbox slide={slides[lightbox]} onClose={close} />,
                    document.body
                )}
        </div>
    )
}

/* ───────────── Lightboxes ───────────── */

const backdrop = (alpha: number): React.CSSProperties => ({
    position: "fixed",
    inset: 0,
    zIndex: 100000,
    background: `rgba(8,7,6,${alpha})`,
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
})
const circleBtn: React.CSSProperties = { width: 40, height: 40, borderRadius: 999, border: "none", display: "grid", placeItems: "center", cursor: "pointer", padding: 0 }

function useLightbox(onClose: () => void, onKey?: (e: KeyboardEvent) => void) {
    useScrollLock(true)
    useEffect(() => {
        const h = (e: KeyboardEvent) => (e.key === "Escape" ? onClose() : onKey?.(e))
        window.addEventListener("keydown", h)
        return () => window.removeEventListener("keydown", h)
    }, [onClose, onKey])
}

function VideoLightbox({ slide, onClose }: { slide: Slide; onClose: () => void }) {
    useLightbox(onClose)
    const ref = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)
    const [cur, setCur] = useState(0)
    const [dur, setDur] = useState(0)
    const src = cldMp4(slide.video)
    const toggle = () => {
        const v = ref.current
        if (!v) return
        if (v.paused) v.play(), setPlaying(true)
        else v.pause(), setPlaying(false)
    }
    return (
        <div onClick={onClose} style={backdrop(0.92)}>
            <div role="dialog" aria-modal="true" aria-label={slide.title} onClick={(e) => e.stopPropagation()} style={{ position: "relative", height: "min(88vh, 780px)", aspectRatio: "9 / 16", maxWidth: "94vw", borderRadius: 16, overflow: "hidden", background: "#111" }}>
                <video ref={ref} src={src} poster={slide.cover || cldPoster(slide.video)} playsInline preload="metadata" onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} onClick={toggle} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button type="button" aria-label="Close" onClick={onClose} style={{ ...circleBtn, position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,.4)", zIndex: 3 }}>
                    <Arrow dir="left" />
                </button>
                {!playing && (
                    <button type="button" aria-label="Play" onClick={toggle} style={{ ...circleBtn, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 66, height: 66, border: "1.5px solid rgba(255,255,255,.9)", background: "rgba(255,255,255,.16)" }}>
                        <PlayGlyph size={24} />
                    </button>
                )}
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 20px 20px", background: "linear-gradient(to top,rgba(0,0,0,.85),transparent)", color: "#fff" }}>
                    <div style={{ fontSize: 12, marginBottom: 8 }}>{fmt(cur)} / {dur ? fmt(dur) : slide.duration || "0:00"}</div>
                    <div
                        onClick={(e) => {
                            const v = ref.current
                            if (!v || !dur) return
                            const r = e.currentTarget.getBoundingClientRect()
                            v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * dur
                        }}
                        style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,.28)", cursor: "pointer", overflow: "hidden" }}
                    >
                        <div style={{ width: `${dur ? (cur / dur) * 100 : 0}%`, height: "100%", background: ACCENT }} />
                    </div>
                    <div style={{ marginTop: 16, fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.2 }}>{slide.title}</div>
                    <div style={{ marginTop: 6, fontSize: 10.5, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>{slide.subtitle}</div>
                </div>
            </div>
        </div>
    )
}

function ImageLightbox({ slide, onClose }: { slide: Slide; onClose: () => void }) {
    const gallery = (slide.gallery || []).filter(Boolean)
    const total = gallery.length || 1
    const [i, setI] = useState(0)
    const go = useCallback((d: number) => setI((v) => (v + d + total) % total), [total])
    const onKey = useCallback((e: KeyboardEvent) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : undefined), [go])
    useLightbox(onClose, onKey)
    const sx = useRef(0)
    const thumbs = useRef<(HTMLButtonElement | null)[]>([])
    useEffect(() => {
        thumbs.current[i]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })
    }, [i])
    const stop = (e: React.SyntheticEvent) => e.stopPropagation()
    const navBtn = (side: "left" | "right"): React.CSSProperties => ({ ...circleBtn, position: "absolute", top: "50%", [side]: 20, transform: "translateY(-50%)", width: 44, height: 44, background: "rgba(255,255,255,.14)", zIndex: 3 })

    return (
        <div onClick={onClose} style={backdrop(0.94)} role="dialog" aria-modal="true" aria-label={slide.title}>
            <div onClick={stop} style={{ position: "absolute", top: 22, left: 0, right: 0, textAlign: "center", padding: "0 60px", color: "#fff" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 21, lineHeight: 1.2 }}>{slide.title}</div>
                <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>{slide.subtitle}</div>
            </div>
            <button type="button" aria-label="Close" onClick={(e) => (stop(e), onClose())} style={{ ...circleBtn, position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,.14)", zIndex: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
            {total > 1 && (
                <>
                    <button type="button" aria-label="Previous photo" onClick={(e) => (stop(e), go(-1))} style={navBtn("left")}><Arrow dir="left" /></button>
                    <button type="button" aria-label="Next photo" onClick={(e) => (stop(e), go(1))} style={navBtn("right")}><Arrow dir="right" /></button>
                </>
            )}
            <div
                onClick={stop}
                onPointerDown={(e) => (sx.current = e.clientX)}
                onPointerUp={(e) => {
                    const dx = e.clientX - sx.current
                    if (dx > 45) go(-1)
                    else if (dx < -45) go(1)
                }}
                style={{ position: "relative", touchAction: "pan-y" }}
            >
                <img src={gallery[i]} alt={`${slide.title}, photo ${i + 1} of ${total}`} style={{ maxWidth: "92vw", maxHeight: "72vh", objectFit: "contain", borderRadius: 12, display: "block" }} />
                {total > 1 && <div style={{ position: "absolute", left: 12, bottom: 12, padding: "4px 11px", borderRadius: 999, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 12, fontWeight: 600 }}>{i + 1} / {total}</div>}
            </div>
            {total > 1 && (
                <div onClick={stop} style={{ position: "absolute", bottom: 22, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 8px", maxWidth: "96vw", scrollbarWidth: "none" }}>
                        {gallery.map((g, k) => (
                            <button
                                key={k}
                                type="button"
                                aria-label={`Photo ${k + 1}`}
                                ref={(el) => {
                                    thumbs.current[k] = el
                                }}
                                onClick={() => setI(k)}
                                style={{ flex: "0 0 auto", width: 66, height: 46, borderRadius: 6, padding: 0, cursor: "pointer", border: k === i ? `2px solid ${ACCENT}` : "2px solid transparent", opacity: k === i ? 1 : 0.5, background: `#111 url("${g}") center/cover no-repeat`, transition: "opacity .2s ease" }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function ArrowBtn({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
    return (
        <button
            type="button"
            aria-label={side === "left" ? "Previous" : "Next"}
            onClick={onClick}
            style={{ position: "absolute", [side]: 16, top: "50%", transform: "translateY(-50%)", zIndex: 5, width: 44, height: 44, borderRadius: 999, border: "none", background: "rgba(255,255,255,.92)", boxShadow: "0 6px 18px -6px rgba(0,0,0,.4)", display: "grid", placeItems: "center", cursor: "pointer" }}
        >
            <Arrow dir={side} color="#2b2622" />
        </button>
    )
}
