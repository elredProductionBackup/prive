"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { scrollToTop } from "@/lib/site"

// Round "HOME" button, bottom right on every page. It always leads to the homepage hero:
// on the homepage it scrolls up, on other pages it goes to "/".
export default function HomeButton() {
    const pathname = usePathname()
    const router = useRouter()
    const isHome = pathname === "/"
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.4)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [pathname])

    const show = !isHome || scrolled

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    type="button"
                    className="home-btn"
                    aria-label="Go to the homepage"
                    onClick={() => (isHome ? scrollToTop() : router.push("/"))}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                >
                    HOME
                </motion.button>
            )}
        </AnimatePresence>
    )
}
