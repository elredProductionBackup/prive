"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { cld } from "@/lib/cld"
import s from "./about.module.css"

// Contact background: starts zoomed in (1.4) and settles to normal size (1) as the section slides into view
export default function ZoomInImage({ src }: { src: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] })
    const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.4, 1])
    return (
        <motion.div ref={ref} className={s.contactMedia} style={{ scale }} aria-hidden>
            <img src={cld(src, 2000)} alt="" loading="lazy" decoding="async" className={s.contactImg} />
        </motion.div>
    )
}
