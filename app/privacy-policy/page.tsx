import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Footer from "@/components/site/Footer"
import { PRIVACY, PRIVACY_META, type PrivacyBlock, type PrivacyItem } from "@/content/privacy"
// Same look as the Governing Charter
import s from "../governing-charter/charter.module.css"

export const metadata: Metadata = pageMetadata({
    title: "Privacy Policy | Privé Network",
    description: "How The Privé Network collects, uses and protects personal information when you visit theprive.network, request an invitation or take part in the Network.",
    path: "/privacy-policy",
})

const num = (i: number) => String(i + 1).padStart(2, "0")

// Turns the contact email into a link wherever it appears
function withEmail(text: string) {
    const parts = text.split(PRIVACY_META.email)
    return parts.flatMap((p, i) =>
        i === 0
            ? [p]
            : [
                  <a key={i} href={`mailto:${PRIVACY_META.email}`} style={{ color: "#c49c2c", textUnderlineOffset: 2 }}>
                      {PRIVACY_META.email}
                  </a>,
                  p,
              ]
    )
}

function Item({ it }: { it: PrivacyItem }) {
    return (
        <li>
            <span className={s.marker} aria-hidden>
                •
            </span>
            <p className={s.p}>
                {typeof it !== "string" && <span className={s.lead}>{it.lead} </span>}
                {withEmail(typeof it === "string" ? it : it.text)}
            </p>
        </li>
    )
}

function Block({ b }: { b: PrivacyBlock }) {
    if (typeof b === "string") return <p className={s.p}>{withEmail(b)}</p>
    return (
        <ul className={s.list}>
            {b.list.map((it, i) => (
                <Item key={i} it={it} />
            ))}
        </ul>
    )
}

export default function PrivacyPolicyPage() {
    const m = PRIVACY_META
    return (
        <>
            <header className={s.band}>
                <div className={s.bandInner}>
                    <h1 className={s.title}>{m.title}</h1>
                    <p className={s.meta} style={{ color: "#c8c8cd", maxWidth: 640, lineHeight: 1.5 }}>
                        {m.summary}
                    </p>
                    <p className={s.meta} style={{ marginTop: 14 }}>
                        <span>{m.lastUpdated}</span>
                        <span className={s.sep} aria-hidden>|</span>
                        <span>{m.jurisdiction}</span>
                    </p>
                </div>
            </header>

            <nav className={s.index} aria-labelledby="contents">
                <h2 id="contents" className={s.indexLabel}>On this page</h2>
                <ul>
                    {PRIVACY.map((sec, i) => (
                        <li key={sec.id}>
                            <a className={s.tocItem} href={`#${sec.id}`}>
                                <span className={s.tocNum}>{num(i)}</span>
                                <span className={s.tocTitle}>{sec.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className={s.content}>
                {PRIVACY.map((sec, i) => (
                    <section key={sec.id} id={sec.id} className={s.section} aria-labelledby={`${sec.id}-title`}>
                        <div className={s.secHead}>
                            <span className={s.secNum}>{num(i)}</span>
                            <h2 id={`${sec.id}-title`} className={s.secTitle}>{sec.title}</h2>
                        </div>
                        <div className={s.subBody} style={{ marginTop: 20 }}>
                            {sec.blocks.map((b, j) => (
                                <Block key={j} b={b} />
                            ))}
                        </div>
                    </section>
                ))}

                <div className={s.footnote}>
                    <p>
                        See also our <a href="/governing-charter">Governing Charter</a>, which sets out how Member information is kept confidential within the Network.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}
