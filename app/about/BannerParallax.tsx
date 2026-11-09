"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { LOGO } from "@/content/site"
import { cld } from "@/lib/cld"
import s from "./about.module.css"

// Same effect as the homepage hero: the Privé banner stays put while the next
// section (children) slides over it, and the wordmark grows as it's covered.
export default function BannerParallax({ image, title, children }: { image: string; title: string; children: React.ReactNode }) {
    const nextRef = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    // 0 when the next section starts entering, 1 when it fully covers the banner
    const { scrollYProgress } = useScroll({ target: nextRef, offset: ["start end", "start start"] })
    const markScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.2])
    const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.08])

    return (
        <>
            <section className={s.banner} aria-label={title}>
                <motion.div className={s.bannerMedia} style={{ scale: imgScale }}>
                    {image && <img src={cld(image, 2000)} alt="" loading="lazy" decoding="async" className={s.cover} />}
                </motion.div>
                <div className="hero-overlay" aria-hidden />
                <motion.div className={s.bannerMark} style={{ scale: markScale }}>
                    <Image src={LOGO.src} alt={title} width={LOGO.width} height={LOGO.height} unoptimized className={s.whiteLogo} />
                </motion.div>
            </section>
            <div ref={nextRef} className={s.slideOver}>
                {children}
            </div>
        </>
    )
}
