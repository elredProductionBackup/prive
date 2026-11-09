"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { PHILOSOPHY, QUALIFICATION, type Block } from "@/content/site"
import Principles from "./Principles"
import FaqList from "./FaqList"
import { MODAL_EVENT, type ModalName, useScrollLock } from "@/lib/site"
import { rich } from "@/lib/rich"

function Blocks({ blocks }: { blocks: Block[] }) {
    return (
        <>
            {blocks.map((b, i) =>
                b.q ? (
                    <h3 key={i} className="pop-q">
                        {b.q}
                    </h3>
                ) : b.list ? (
                    <ul key={i} className="pop-list">
                        {b.list.map((li, j) => (
                            <li key={j}>{rich(li)}</li>
                        ))}
                    </ul>
                ) : (
                    <p key={i}>{rich(b.p)}</p>
                )
            )}
        </>
    )
}

export default function Modals() {
    const [name, setName] = useState<ModalName | null>(null)
    const closeRef = useRef<HTMLButtonElement>(null)
    const returnFocus = useRef<HTMLElement | null>(null)

    useScrollLock(!!name)

    useEffect(() => {
        const onOpen = (e: Event) => {
            returnFocus.current = document.activeElement as HTMLElement
            setName((e as CustomEvent).detail)
        }
        window.addEventListener(MODAL_EVENT, onOpen)
        // Old Framer links like /#qualification still open the popup
        if (window.location.hash === "#qualification") setName("qualification")
        return () => window.removeEventListener(MODAL_EVENT, onOpen)
    }, [])

    useEffect(() => {
        if (!name) {
            returnFocus.current?.focus?.()
            return
        }
        closeRef.current?.focus({ preventScroll: true })
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setName(null)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [name])

    const close = () => setName(null)

    return (
        <AnimatePresence>
            {name && (
                <motion.div
                    key="pop"
                    className="pop-overlay"
                    onClick={close}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={name === "faq" ? "Frequently asked questions" : name === "philosophy" ? "Operating Philosophy" : "Qualification"}
                        className={`pop-panel pop-${name}`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 24, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.985 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <button ref={closeRef} type="button" className="pop-close" aria-label="Close" onClick={close}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                                <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                        </button>
                        <div className="pop-scroll" data-lenis-prevent="">
                            {name === "faq" ? (
                                <FaqList />
                            ) : name === "philosophy" ? (
                                <>
                                    <h2 className="pop-title">{PHILOSOPHY.title}</h2>
                                    <Principles sections={PHILOSOPHY.sections} />
                                </>
                            ) : (
                                <>
                                    <Blocks blocks={QUALIFICATION.blocks} />
                                    <p className="pop-footnote">{QUALIFICATION.footnote}</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
