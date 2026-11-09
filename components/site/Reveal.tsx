"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// Fades elements marked data-reveal up into place as they scroll into view.
// Optional stagger: style={{ "--reveal-delay": "120ms" }}. Off for reduced-motion users.
export default function Reveal() {
    const pathname = usePathname()
    useEffect(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"))
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
            els.forEach((el) => el.classList.add("is-in"))
            return
        }
        const io = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (!e.isIntersecting) return
                    e.target.classList.add("is-in")
                    io.unobserve(e.target)
                }),
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [pathname])
    return null
}
