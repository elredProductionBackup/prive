"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LOGO, NAV, PHILOSOPHY } from "@/content/site"
import { NavLink, scrollToTop, useGoToCalendar, useScrollLock } from "@/lib/site"

// Popups without content yet are left out of the menu
const MENU = NAV.filter((i) => i.action !== "modal:philosophy" || PHILOSOPHY.sections.length > 0)

const EASE = [0.76, 0, 0.24, 1] as const

// Like the Framer site, the header sits at the top and scrolls away with the page;
// the round HOME button brings people back. Set to true to keep it pinned instead.
const STICKY_HEADER = false

function CalendarIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    )
}

export default function Header() {
    const [open, setOpen] = useState(false)

    useScrollLock(open)

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open])

    const pathname = usePathname()
    const toCalendar = useGoToCalendar()
    const goCalendar = () => {
        setOpen(false)
        toCalendar()
    }

    // Close the menu after navigating to another page
    useEffect(() => setOpen(false), [pathname])

    // The Calendar button (and its dark strip on phones) only appears on the homepage
    const showCalendar = pathname === "/"
    const cls = ["site-header", STICKY_HEADER && "is-sticky", open && "is-open", !showCalendar && "no-cal"].filter(Boolean).join(" ")

    return (
        <>
            <header className={cls}>
                {showCalendar && (
                    <div className="cal-strip">
                        <button type="button" className="cal-pill" onClick={goCalendar}>
                            <CalendarIcon />
                            Calendar
                        </button>
                    </div>
                )}
                <Link
                    href="/"
                    className="logo"
                    aria-label="Privé home"
                    scroll={false}
                    onClick={(e) => {
                        setOpen(false)
                        if (pathname === "/") {
                            e.preventDefault()
                            scrollToTop()
                        }
                    }}
                >
                    <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} unoptimized priority />
                </Link>
                <button
                    type="button"
                    className="burger"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="site-menu"
                    onClick={() => setOpen((o) => !o)}
                >
                    <span />
                    <span />
                </button>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="menu"
                        className="menu-root"
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        {/* 60% black curtain drops from the top */}
                        <motion.div
                            className="menu-curtain"
                            onClick={() => setOpen(false)}
                            variants={{
                                closed: {
                                    clipPath: "inset(0% 0% 100% 0%)",
                                    transition: { duration: 0.55, ease: EASE, delay: 0.2 },
                                },
                                open: {
                                    clipPath: "inset(0% 0% 0% 0%)",
                                    transition: { duration: 0.6, ease: EASE },
                                },
                            }}
                        />
                        {/* White panel and its links fade in (opacity 0 → 1) */}
                        <motion.nav
                            id="site-menu"
                            data-lenis-prevent=""
                            aria-label="Main"
                            className="menu-panel"
                            variants={{
                                closed: { opacity: 0, transition: { duration: 0.3, ease: "easeOut" } },
                                open: {
                                    opacity: 1,
                                    transition: { duration: 0.45, ease: "easeOut", delay: 0.25, delayChildren: 0.4, staggerChildren: 0.05 },
                                },
                            }}
                        >
                            <ul>
                                {MENU.map((item) => (
                                    <motion.li
                                        key={item.label}
                                        variants={{
                                            closed: { opacity: 0 },
                                            open: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
                                        }}
                                    >
                                        <NavLink item={item} className="menu-link" onDone={() => setOpen(false)} />
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
