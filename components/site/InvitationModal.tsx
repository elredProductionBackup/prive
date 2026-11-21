"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { C, CloseIcon, F, Overlay, panelMotion, resetButton, roundBtn, useViewportWidth } from "@/components/events/ui"
import { INVITATION_EVENT, type InvitationRequest, useScrollLock } from "@/lib/site"
import { captureAttribution, readAttribution } from "@/lib/attribution"

// "Request an invitation" form. Opened by every Register / I am Interested button
// (requestInvitation() in components/events/ui). Submissions go to /api/invitation.
// On success it pushes `invitation_request_submitted` to the GTM dataLayer, which is
// how Tag Manager / Meta count each request.

type Fields = { name: string; email: string; phone: string; company: string; notes: string; website: string }
type Errors = Partial<Record<keyof Fields, string>>
const EMPTY: Fields = { name: "", email: "", phone: "", company: "", notes: "", website: "" }

function validate(f: Fields): Errors {
    const e: Errors = {}
    if (f.name.trim().length < 2) e.name = "Please enter your full name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please enter a valid email address."
    const digits = f.phone.replace(/\D/g, "")
    if (!/^[+\d()\-.\s]+$/.test(f.phone.trim()) || digits.length < 8 || digits.length > 15) e.phone = "Please enter a valid phone number, with country code if outside India."
    // Any text is accepted (a link, a company name, anything): it only can't be left empty
    if (!f.company.trim()) e.company = "Please enter your company website or LinkedIn link."
    return e
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 14.5, fontWeight: 600, color: C.text, marginBottom: 7 }
const optional: React.CSSProperties = { fontWeight: 400, color: C.muted, marginLeft: 6 }
const errorStyle: React.CSSProperties = { color: "#A23B2A", fontSize: 13.5, marginTop: 6, lineHeight: 1.4 }

function Field({ id, label, error, opt, children }: { id: string; label: string; error?: string; opt?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={id} style={labelStyle}>
                {label}
                {opt && <span style={optional}>(optional)</span>}
            </label>
            {children}
            {error && (
                <div id={`${id}-error`} style={errorStyle}>
                    {error}
                </div>
            )}
        </div>
    )
}

const FORM_CSS = `
.inv-input{display:block;width:100%;box-sizing:border-box;height:50px;padding:0 14px;border:1px solid ${C.line};border-radius:10px;background:#fff;color:${C.text};font:inherit;font-size:16px;transition:border-color .15s,box-shadow .15s;appearance:none;-webkit-appearance:none}
textarea.inv-input{height:auto;min-height:104px;padding:12px 14px;line-height:1.45;resize:vertical}
.inv-input::placeholder{color:#A8A29C}
.inv-input:focus{outline:none;border-color:${C.accent};box-shadow:0 0 0 3px rgba(186,138,62,.18)}
.inv-input[aria-invalid="true"]{border-color:#C0563F}
.inv-scroll{scrollbar-width:none}.inv-scroll::-webkit-scrollbar{display:none}
@keyframes inv-spin{to{transform:rotate(360deg)}}.inv-spin{animation:inv-spin .9s linear infinite}
`

function Panel({ req, onClose }: { req: InvitationRequest; onClose: () => void }) {
    const vw = useViewportWidth()
    const mobile = vw < 640
    const pad = mobile ? 20 : 36
    const [f, setF] = useState<Fields>(EMPTY)
    const [errors, setErrors] = useState<Errors>({})
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const [serverError, setServerError] = useState("")
    const firstRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    useScrollLock(true)

    useEffect(() => {
        const t = setTimeout(() => firstRef.current?.focus({ preventScroll: true }), 80)
        // Escape closes only this form, not the event popup underneath it
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return
            e.stopImmediatePropagation()
            onClose()
        }
        window.addEventListener("keydown", onKey, true)
        return () => {
            clearTimeout(t)
            window.removeEventListener("keydown", onKey, true)
        }
    }, [onClose])

    const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const v = e.target.value
        setF((p) => ({ ...p, [k]: v }))
        if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (status === "sending") return
        const errs = validate(f)
        setErrors(errs)
        if (Object.keys(errs).length) {
            const first = Object.keys(errs)[0]
            formRef.current?.querySelector<HTMLElement>(`#inv-${first}`)?.focus()
            return
        }
        setStatus("sending")
        setServerError("")
        try {
            const res = await fetch("/api/invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: req.eventId,
                    name: f.name.trim(),
                    email: f.email.trim(),
                    phone: f.phone.trim(),
                    company: f.company.trim(),
                    notes: f.notes.trim(),
                    website: f.website, // spam trap, left empty by people
                    page: window.location.pathname + window.location.search,
                    attribution: readAttribution(),
                }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.ok) throw new Error(data.error || "")
            // Counted by Google Tag Manager (and from there, Meta). No personal details in here.
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "invitation_request_submitted",
                practice_id: req.eventId,
                practice_name: req.heading,
            })
            setStatus("done")
        } catch (err) {
            setStatus("error")
            setServerError((err as Error).message || "We couldn’t send your request. Please check your connection and try again.")
        }
    }


    return (
        <Overlay onClose={onClose} padding={mobile ? 0 : 40} zIndex={10000}>
            <style>{FORM_CSS}</style>
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="inv-title"
                {...panelMotion}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 560,
                    height: mobile ? "100%" : "auto",
                    maxHeight: "100%",
                    background: "#fff",
                    borderRadius: mobile ? 0 : 28,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                    fontFamily: F.sans,
                    color: C.text,
                }}
            >
                <div className="inv-scroll" data-lenis-prevent="" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", padding: `${mobile ? 22 : 32}px ${pad}px ${mobile ? 28 : 32}px` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: C.accent, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Request an invitation</div>
                            <h2 id="inv-title" style={{ margin: "8px 0 0", fontFamily: F.serif, fontWeight: 600, fontSize: mobile ? 24 : 28, lineHeight: 1.25 }}>
                                {req.heading}
                            </h2>
                            {req.subheading && <div style={{ marginTop: 6, fontSize: mobile ? 15 : 16, lineHeight: 1.45, color: C.text }}>{req.subheading}</div>}
                            {req.details && <div style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.45, color: C.muted }}>{req.details}</div>}
                        </div>
                        <motion.button type="button" aria-label="Close" onClick={onClose} whileTap={{ scale: 0.94 }} style={{ ...roundBtn, padding: 0, flexShrink: 0 }}>
                            <CloseIcon />
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        {status === "done" ? (
                            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" aria-live="polite" style={{ marginTop: 32, textAlign: "center", padding: mobile ? "12px 0 0" : "8px 12px 4px" }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.breakBg, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div style={{ marginTop: 18, fontFamily: F.serif, fontSize: 22, fontWeight: 600 }}>Thank you, {f.name.trim().split(/\s+/)[0]}.</div>
                                <p style={{ margin: "10px auto 0", maxWidth: 380, fontSize: 16, lineHeight: 1.5, color: C.muted }}>
                                    We’ve received your request. The Privé team will be in touch with you shortly.
                                </p>
                                <motion.button type="button" onClick={onClose} whileTap={{ scale: 0.98 }} style={{ ...resetButton, marginTop: 26, height: 50, padding: "0 36px", borderRadius: 999, background: C.accent, color: "#fff", fontSize: 16.5, fontWeight: 500 }}>
                                    Close
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.form key="form" ref={formRef} onSubmit={submit} noValidate initial={false} exit={{ opacity: 0 }} style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18 }}>
                                <Field id="inv-name" label="Full name" error={errors.name}>
                                    <input ref={firstRef} id="inv-name" className="inv-input" type="text" autoComplete="name" maxLength={120} value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "inv-name-error" : undefined} />
                                </Field>
                                <Field id="inv-email" label="Email" error={errors.email}>
                                    <input id="inv-email" className="inv-input" type="email" inputMode="email" autoComplete="email" maxLength={200} value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "inv-email-error" : undefined} />
                                </Field>
                                <Field id="inv-phone" label="Phone number" error={errors.phone}>
                                    <input id="inv-phone" className="inv-input" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} placeholder="+91 98765 43210" value={f.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "inv-phone-error" : undefined} />
                                </Field>
                                {/* Plain text on purpose: any website or LinkedIn link is accepted as typed, no format check.
                                    Still sent as "company" (not "website", which is the spam trap below) so the sheet needs no change. */}
                                <Field id="inv-company" label="Company website or LinkedIn" error={errors.company}>
                                    <input id="inv-company" className="inv-input" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={300} placeholder="yourcompany.com or LinkedIn link" value={f.company} onChange={set("company")} aria-invalid={!!errors.company} aria-describedby={errors.company ? "inv-company-error" : undefined} />
                                </Field>
                                <Field id="inv-notes" label="Notes" opt>
                                    <textarea id="inv-notes" className="inv-input" maxLength={2000} placeholder="Anything else you’d like us to know, such as your role or who else from your team may attend" value={f.notes} onChange={set("notes")} />
                                </Field>

                                {/* Spam trap: hidden from people, bots fill it in */}
                                <div aria-hidden style={{ position: "absolute", left: -10000, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                                    <label htmlFor="inv-website">Website</label>
                                    <input id="inv-website" type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
                                </div>

                                {status === "error" && (
                                    <div role="alert" style={{ ...errorStyle, marginTop: 0, padding: "12px 14px", borderRadius: 10, background: "#FBEFEC", fontSize: 14.5 }}>
                                        {serverError}
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={status === "sending"}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ ...resetButton, height: 54, borderRadius: 999, background: C.accent, color: "#fff", fontSize: 17, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: status === "sending" ? 0.8 : 1, cursor: status === "sending" ? "progress" : "pointer" }}
                                >
                                    {status === "sending" && <span aria-hidden className="inv-spin" style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", display: "block" }} />}
                                    {status === "sending" ? "Sending…" : "Send request"}
                                </motion.button>
                                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: C.muted, textAlign: "center" }}>
                                    By sending this request you agree to our{" "}
                                    <Link href="/privacy-policy" target="_blank" style={{ color: C.label, textUnderlineOffset: 2 }}>
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </Overlay>
    )
}

export default function InvitationModal() {
    const [req, setReq] = useState<InvitationRequest | null>(null)
    const returnFocus = useRef<HTMLElement | null>(null)

    useEffect(() => {
        captureAttribution()
        const onOpen = (e: Event) => {
            returnFocus.current = document.activeElement as HTMLElement
            setReq((e as CustomEvent<InvitationRequest>).detail)
        }
        window.addEventListener(INVITATION_EVENT, onOpen)
        return () => window.removeEventListener(INVITATION_EVENT, onOpen)
    }, [])

    const close = React.useCallback(() => {
        setReq(null)
        setTimeout(() => returnFocus.current?.focus?.({ preventScroll: true }), 0)
    }, [])

    return <AnimatePresence>{req && <Panel key={req.eventId} req={req} onClose={close} />}</AnimatePresence>
}
