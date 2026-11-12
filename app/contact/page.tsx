import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Footer from "@/components/site/Footer"
import { CONTACT } from "@/content/contact"
import { FOOTER } from "@/content/site"
import s from "./contact.module.css"

export const metadata: Metadata = pageMetadata({
    title: "Contact Privé | WhatsApp, Email & Social",
    description: "Reach The Privé Network on WhatsApp at +91 91524 40065, email info@theprive.network, or follow us on LinkedIn, YouTube, Instagram and Facebook.",
    path: "/contact",
})

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties

// External social channels from the footer (Email has its own card above)
const SOCIAL = FOOTER.social.filter((i) => i.href?.startsWith("http"))

function Arrow() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function WhatsAppIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm.01 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
        </svg>
    )
}

function MailIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function SocialIcon({ name }: { name: string }) {
    const n = name.toLowerCase()
    if (n.includes("linkedin"))
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
            </svg>
        )
    if (n.includes("youtube"))
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
            </svg>
        )
    if (n.includes("instagram"))
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
            </svg>
        )
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.87.24-1.46 1.49-1.46h1.6V4.36a21 21 0 0 0-2.33-.12c-2.3 0-3.88 1.4-3.88 3.98v2.2H7.77v3h2.61V21h3.12Z" />
        </svg>
    )
}

export default function ContactPage() {
    const c = CONTACT
    return (
        <>
            <main className={s.main}>
                <div className={s.glow} aria-hidden />
                <div className={s.wrap}>
                    <section className={s.info} aria-labelledby="page-title">
                        <p data-reveal className={s.eyebrow}>{c.eyebrow}</p>
                        <h1 id="page-title" data-reveal className={s.title}>
                            {c.title.map((line) => (
                                <span key={line}>{line}</span>
                            ))}
                        </h1>
                        <p data-reveal className={s.intro}>{c.intro}</p>
                        <div data-reveal className={s.office}>
                            <p className={s.label}>{c.officeLabel}</p>
                            <address>{FOOTER.office}</address>
                        </div>
                    </section>

                    <div className={s.channels}>
                        {/* WhatsApp: the main way in */}
                        <a data-reveal href={c.whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${s.card} ${s.wa}`}>
                            <span className={`${s.icon} ${s.waIcon}`}>
                                <WhatsAppIcon />
                            </span>
                            <span className={s.cardBody}>
                                <span className={s.label}>{c.whatsapp.label}</span>
                                <span className={s.value}>{c.whatsapp.number}</span>
                                <span className={s.text}>{c.whatsapp.text}</span>
                            </span>
                            <span className={s.cta}>
                                {c.whatsapp.cta}
                                <Arrow />
                            </span>
                        </a>

                        <a data-reveal style={delay(80)} href={c.email.href} className={s.card}>
                            <span className={s.icon}>
                                <MailIcon />
                            </span>
                            <span className={s.cardBody}>
                                <span className={s.label}>{c.email.label}</span>
                                <span className={s.value}>{c.email.address}</span>
                                <span className={s.text}>{c.email.text}</span>
                            </span>
                            <span className={s.cta}>
                                {c.email.cta}
                                <Arrow />
                            </span>
                        </a>

                        <div data-reveal style={delay(160)} className={s.follow}>
                            <p className={s.label}>{c.followLabel}</p>
                            <ul className={s.social}>
                                {SOCIAL.map((i) => (
                                    <li key={i.label}>
                                        <a href={i.href} target="_blank" rel="noopener noreferrer">
                                            <SocialIcon name={i.label} />
                                            <span>{i.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
