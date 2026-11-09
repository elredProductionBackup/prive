"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import { getLenis, setLenis } from "@/lib/lenis"

// Lenis smooth scrolling for the whole site. Turned off for people who prefer reduced motion.
// Popups, the menu and dropdowns use data-lenis-prevent so they scroll on their own.
export default function SmoothScroll() {
    const pathname = usePathname()
    const first = useRef(true)

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: 0 } })
        setLenis(lenis)
        let raf = requestAnimationFrame(function loop(t) {
            lenis.raf(t)
            raf = requestAnimationFrame(loop)
        })
        return () => {
            cancelAnimationFrame(raf)
            lenis.destroy()
            setLenis(null)
        }
    }, [])

    // New page starts at the top (a #hash link like /#calendar scrolls to its section instead)
    useEffect(() => {
        if (first.current) {
            first.current = false
            return
        }
        const hash = window.location.hash
        const target = hash && document.querySelector(hash)
        if (target) getLenis()?.scrollTo(target as HTMLElement, { immediate: true })
        else getLenis()?.scrollTo(0, { immediate: true })
    }, [pathname])

    return null
}
