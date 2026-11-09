"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FAQ } from "@/content/site"
import { rich } from "@/lib/rich"

// Accordion: the two-line icon closes into a single line while a question is open
export default function FaqList() {
    const [open, setOpen] = useState<number | null>(null)
    const uid = useId()
    return (
        <div className="faq">
            <h2 className="faq-title">{FAQ.title}</h2>
            <ul className="faq-list">
                {FAQ.items.map((item, i) => {
                    const isOpen = open === i
                    const panelId = `${uid}-a${i}`
                    return (
                        <li key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                            <h3 className="faq-q">
                                <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : i)}>
                                    <span>{item.q}</span>
                                    <span className="faq-icon" aria-hidden>
                                        <i />
                                        <i />
                                    </span>
                                </button>
                            </h3>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        id={panelId}
                                        className="faq-a"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className="faq-a-inner">
                                            {item.a.map((p, j) => <p key={j}>{rich(p)}</p>)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    )
                })}
            </ul>
            <div className="faq-foot">
                <p className="faq-prompt">{FAQ.footerPrompt}</p>
                <span className="faq-vr" aria-hidden />
                <a href={FAQ.footerLink.href} className="faq-link">{FAQ.footerLink.label}</a>
            </div>
        </div>
    )
}
