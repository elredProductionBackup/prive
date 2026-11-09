"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { NavItem } from "@/content/site"
import { getLenis } from "./lenis"

const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export function scrollToTop() {
    if (getLenis()) getLenis().scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" })
}

export function scrollToId(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    if (getLenis()) getLenis().scrollTo(el, { duration: 1.4 })
    else el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" })
}

// Popups are opened with a window event, so the header, footer and buttons
// don't need to share state with the popup component.
export type ModalName = "qualification" | "faq" | "philosophy"
export const MODAL_EVENT = "prive:modal"

export function openModal(name: ModalName) {
    window.dispatchEvent(new CustomEvent(MODAL_EVENT, { detail: name }))
}

export function NavLink({
    item,
    className,
    onDone,
    children,
}: {
    item: NavItem
    className?: string
    onDone?: () => void
    children?: React.ReactNode
}) {
    const pathname = usePathname()
    const onClick = (e: React.MouseEvent) => {
        onDone?.()
        if (!item.action) return
        if (item.action === "top") {
            // Home: scroll up on the homepage, otherwise let the link go to "/"
            if (pathname === "/") {
                e.preventDefault()
                scrollToTop()
            }
        } else if (item.action.startsWith("modal:")) {
            e.preventDefault()
            openModal(item.action.slice(6) as ModalName)
        }
    }
    const href = item.href || (item.action === "top" ? "/" : "#")
    if (/^(https?:|mailto:)/.test(href))
        return (
            <a href={href} className={className} onClick={onClick} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children ?? item.label}
            </a>
        )
    return (
        <Link href={href} className={className} onClick={onClick} scroll={item.action !== "top"}>
            {children ?? item.label}
        </Link>
    )
}

// Calendar button: scroll if the calendar is on this page, otherwise open it on the homepage
export function useGoToCalendar() {
    const router = useRouter()
    return () => {
        if (document.getElementById("calendar")) scrollToId("calendar")
        else router.push("/#calendar")
    }
}

// Page scroll lock shared by the menu and the popups (counted, so one closing
// never unlocks the page while another is still open)
let locks = 0
export function useScrollLock(active: boolean) {
    React.useEffect(() => {
        if (!active) return
        const html = document.documentElement
        if (locks++ === 0) {
            getLenis()?.stop()
            const bar = window.innerWidth - html.clientWidth
            html.style.overflow = "hidden"
            if (bar > 0) html.style.paddingRight = `${bar}px`
        }
        return () => {
            if (--locks === 0) {
                html.style.overflow = ""
                html.style.paddingRight = ""
                getLenis()?.start()
            }
        }
    }, [active])
}
