"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { HERO } from "@/content/site"
import { cld } from "@/lib/cld"

// The hero is position: sticky, so it stays put while the rest of the page
// (z-index above it) slides over. While that happens the headline grows.
export default function Hero() {
    const vh = useRef(800)
    const reduce = useReducedMotion()
    const { scrollY } = useScroll()

    useEffect(() => {
        const set = () => (vh.current = window.innerHeight)
        set()
        window.addEventListener("resize", set)
        return () => window.removeEventListener("resize", set)
    }, [])

    const p = (v: number) => Math.min(Math.max(v / vh.current, 0), 1)
    // Stays in place and grows gently while the page slides over it
    const textScale = useTransform(scrollY, (v) => (reduce ? 1 : 1 + p(v) * 0.15))
    const imgScale = useTransform(scrollY, (v) => (reduce ? 1 : 1 + p(v) * 0.08))
    // Once fully covered, stop painting it
    const visibility = useTransform(scrollY, (v) => (v > vh.current * 1.1 ? "hidden" : "visible"))

    return (
        <motion.section id="top" className="hero" style={{ visibility }} aria-labelledby="hero-title">
            <motion.div className="hero-media" style={{ scale: imgScale }}>
                <img src={cld(HERO.image, 2400)} alt={HERO.alt} fetchPriority="high" decoding="async" />
            </motion.div>
            <div className="hero-overlay" aria-hidden />
            <motion.div className="hero-copy" style={{ scale: textScale }}>
                <h1 id="hero-title" className="hero-title">{HERO.title}</h1>
                <p className="hero-sub">{HERO.sub}</p>
            </motion.div>
        </motion.section>
    )
}
