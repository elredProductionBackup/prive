"use client"

import * as React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { APPLY, EXPERIENCE_OPTIONS } from "@/content/membership"
import { readAttribution } from "@/lib/attribution"
import s from "./apply.module.css"

// Sends to /api/membership, which saves it to the "Apply for Membership" tab of the Google Sheet.
// On success it pushes `membership_application_submitted` to the GTM dataLayer (for Tag Manager / Meta).

type Fields = {
    name: string
    email: string
    phone: string
    city: string
    company: string
    designation: string
    experience: string
    linkedin: string
    companyWebsite: string
    website: string // spam trap, stays empty for people
}
type Key = keyof Fields | "background"
type Errors = Partial<Record<Key, string>>

const EMPTY: Fields = { name: "", email: "", phone: "", city: "", company: "", designation: "", experience: "", linkedin: "", companyWebsite: "", website: "" }

// LinkedIn link, written any way people usually do: linkedin.com/in/name, www.linkedin.com/…,
// in.linkedin.com/…, https://…, or a lnkd.in short link. No https or exact format needed.
const isLinkedIn = (v: string) => /linkedin\.com|lnkd\.in/i.test(v)

// Order matters: the first field with an error gets focus
function validate(f: Fields): Errors {
    const e: Errors = {}
    if (f.name.trim().length < 2) e.name = "Enter your full name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address."
    const digits = f.phone.replace(/\D/g, "")
    if (!/^[+\d()\-.\s]+$/.test(f.phone.trim()) || digits.length < 8 || digits.length > 15) e.phone = "Enter a valid number, with country code if outside India."
    if (f.city.trim().length < 2) e.city = "Enter your city."
    if (f.company.trim().length < 2) e.company = "Enter your company name."
    if (f.designation.trim().length < 2) e.designation = "Enter your designation."
    if (!f.experience) e.experience = "Choose your years of experience."
    if (f.linkedin.trim() && !isLinkedIn(f.linkedin)) e.linkedin = "Enter a LinkedIn link, like linkedin.com/in/yourname."
    else if (!f.linkedin.trim() && !f.companyWebsite.trim()) e.background = "Add your LinkedIn profile or your company website."
    return e
}

// Underlined input whose label sits inside it like a placeholder and moves up once there's text
function TextField({
    id,
    label,
    value,
    onChange,
    error,
    required,
    ...rest
}: {
    id: keyof Fields
    label: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    error?: string
    required?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange">) {
    const errId = `apply-${id}-error`
    return (
        <div className={s.field}>
            <input
                id={`apply-${id}`}
                className={s.input}
                placeholder=" "
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                aria-required={required || undefined}
                aria-describedby={error ? errId : undefined}
                {...rest}
            />
            <label htmlFor={`apply-${id}`} className={s.label}>
                {label}
                {required && "*"}
            </label>
            {error && (
                <span id={errId} className={s.error}>
                    {error}
                </span>
            )}
        </div>
    )
}

export default function ApplyForm() {
    const [f, setF] = useState<Fields>(EMPTY)
    const [errors, setErrors] = useState<Errors>({})
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const [serverError, setServerError] = useState("")
    const formRef = useRef<HTMLFormElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const v = e.target.value
        setF((p) => ({ ...p, [k]: v }))
        setErrors((p) => {
            const bg = k === "linkedin" || k === "companyWebsite"
            if (!p[k] && !(bg && p.background)) return p
            return { ...p, [k]: undefined, ...(bg ? { background: undefined } : {}) }
        })
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (status === "sending") return
        const errs = validate(f)
        setErrors(errs)
        const first = Object.keys(errs)[0]
        if (first) {
            formRef.current?.querySelector<HTMLElement>(`#apply-${first === "background" ? "linkedin" : first}`)?.focus()
            return
        }
        setStatus("sending")
        setServerError("")
        try {
            const res = await fetch("/api/membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: f.name.trim(),
                    email: f.email.trim(),
                    phone: f.phone.trim(),
                    city: f.city.trim(),
                    company: f.company.trim(),
                    designation: f.designation.trim(),
                    experience: f.experience,
                    linkedin: f.linkedin.trim(),
                    companyWebsite: f.companyWebsite.trim(),
                    website: f.website,
                    page: window.location.pathname + window.location.search,
                    attribution: readAttribution(),
                }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.ok) throw new Error(data.error || "")
            // Counted by Google Tag Manager (and from there, Meta). No personal details in here.
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({ event: "membership_application_submitted" })
            setStatus("done")
            requestAnimationFrame(() => cardRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }))
        } catch (err) {
            setStatus("error")
            setServerError((err as Error).message || "Your application didn’t go through. Check your connection and try again.")
        }
    }

    if (status === "done")
        return (
            <div ref={cardRef} className={`${s.card} ${s.done}`} role="status" aria-live="polite">
                <span className={s.doneIcon} aria-hidden>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <h2 className={s.cardTitle}>Thank you, {f.name.trim().split(/\s+/)[0]}.</h2>
                <p className={s.doneText}>{APPLY.doneText}</p>
                <Link href="/" className={s.submit}>
                    Back to the homepage
                </Link>
            </div>
        )

    const sending = status === "sending"

    return (
        <div ref={cardRef} className={s.card}>
            <h2 className={s.cardTitle}>{APPLY.formTitle}</h2>
            <form ref={formRef} onSubmit={submit} noValidate className={s.form}>
                <div className={s.grid}>
                    <TextField id="name" label="Full Name" required type="text" autoComplete="name" maxLength={120} value={f.name} onChange={set("name")} error={errors.name} />
                    <TextField id="email" label="Email" required type="email" inputMode="email" autoComplete="email" maxLength={200} value={f.email} onChange={set("email")} error={errors.email} />
                    <TextField id="phone" label="Contact Number" required type="tel" inputMode="tel" autoComplete="tel" maxLength={25} value={f.phone} onChange={set("phone")} error={errors.phone} />
                    <TextField id="city" label="City" required type="text" autoComplete="address-level2" maxLength={80} value={f.city} onChange={set("city")} error={errors.city} />
                    <TextField id="company" label="Company Name" required type="text" autoComplete="organization" maxLength={160} value={f.company} onChange={set("company")} error={errors.company} />
                    <TextField id="designation" label="Your Designation" required type="text" autoComplete="organization-title" maxLength={120} value={f.designation} onChange={set("designation")} error={errors.designation} />

                    <div className={`${s.field} ${s.wide}`}>
                        <select
                            id="apply-experience"
                            className={`${s.input} ${s.select}`}
                            data-filled={f.experience ? "" : undefined}
                            value={f.experience}
                            onChange={set("experience")}
                            aria-invalid={!!errors.experience}
                            aria-required
                            aria-describedby={errors.experience ? "apply-experience-error" : undefined}
                        >
                            <option value="" disabled hidden />
                            {EXPERIENCE_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="apply-experience" className={s.label}>
                            Years of Professional Experience*
                        </label>
                        <svg className={s.chevron} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path d="m3 5 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {errors.experience && (
                            <span id="apply-experience-error" className={s.error}>
                                {errors.experience}
                            </span>
                        )}
                    </div>
                </div>

                <fieldset className={s.group} aria-describedby={errors.background ? "apply-background-error" : undefined}>
                    <legend className={s.groupLabel}>{APPLY.backgroundLabel}*</legend>
                    <div className={s.grid}>
                        {/* Plain text on purpose: links are accepted as typed, no format check */}
                        <TextField id="linkedin" label="LinkedIn Profile" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={300} value={f.linkedin} onChange={set("linkedin")} error={errors.linkedin} aria-invalid={!!(errors.linkedin || errors.background)} />
                        <TextField id="companyWebsite" label="Company Website" type="text" inputMode="url" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={300} value={f.companyWebsite} onChange={set("companyWebsite")} aria-invalid={!!errors.background} />
                    </div>
                    {errors.background && (
                        <span id="apply-background-error" className={s.error}>
                            {errors.background}
                        </span>
                    )}
                </fieldset>

                {/* Spam trap: hidden from people, bots fill it in */}
                <div aria-hidden className={s.trap}>
                    <label htmlFor="apply-website">Website</label>
                    <input id="apply-website" type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
                </div>

                {status === "error" && (
                    <div role="alert" className={s.alert}>
                        {serverError}
                    </div>
                )}

                <button type="submit" className={s.submit} disabled={sending} aria-busy={sending || undefined}>
                    {sending && <span aria-hidden className={s.spinner} />}
                    {sending ? APPLY.sending : APPLY.submit}
                </button>
                <p className={s.legal}>
                    By submitting you agree to our{" "}
                    <Link href="/privacy-policy" target="_blank">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form>
        </div>
    )
}
