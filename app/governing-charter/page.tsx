import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Footer from "@/components/site/Footer"
import { CHARTER, CHARTER_META, type CharterBlock } from "@/content/charter"
import s from "./charter.module.css"

export const metadata: Metadata = pageMetadata({
    title: "Governing Charter | Privé Network",
    description: "The foundational principles, governance framework, membership standards and policies of The Privé Network, effective 1 July 2026.",
    path: "/governing-charter",
})

function Body({ items }: { items: CharterBlock[] }) {
    return items.map((it, i) =>
        it.type === "list" ? (
            <ul key={i} className={s.list}>
                {it.items.map((li) => (
                    <li key={li.m}>
                        <span className={s.marker}>{li.m}</span>
                        <p className={s.p}>
                            {li.lead && <span className={s.lead}>{li.lead} </span>}
                            {li.text}
                        </p>
                    </li>
                ))}
            </ul>
        ) : (
            <p key={i} className={s.p}>
                {it.lead && <span className={s.lead}>{it.lead} </span>}
                {it.text}
            </p>
        )
    )
}

export default function GoverningCharterPage() {
    const m = CHARTER_META
    return (
        <>
            <header className={s.band}>
                <div className={s.bandInner}>
                    <h1 className={s.title}>{m.title}</h1>
                    <p className={s.meta}>
                        <span>{m.effectiveDate}</span>
                        <span className={s.sep} aria-hidden>|</span>
                        <span>{m.jurisdiction}</span>
                        <span className={s.sep} aria-hidden>|</span>
                        <span>{CHARTER.length} Sections</span>
                    </p>
                </div>
            </header>

            <nav className={s.index} aria-labelledby="contents">
                <h2 id="contents" className={s.indexLabel}>Contents</h2>
                <ul>
                    {CHARTER.map((sec) => (
                        <li key={sec.id}>
                            <a className={s.tocItem} href={`#${sec.id}`}>
                                <span className={s.tocNum}>{sec.num}</span>
                                <span className={s.tocTitle}>{sec.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className={s.content}>
                {CHARTER.map((sec) => (
                    <section key={sec.id} id={sec.id} className={s.section} aria-labelledby={`${sec.id}-title`}>
                        <div className={s.secHead}>
                            <span className={s.secNum}>{sec.num}</span>
                            <h2 id={`${sec.id}-title`} className={s.secTitle}>{sec.title}</h2>
                        </div>
                        {sec.intro && <p className={s.intro}>{sec.intro}</p>}
                        {sec.subs.map((sub) => (
                            <div key={sub.num} className={s.sub}>
                                <div className={s.subHead}>
                                    <span className={s.subNum}>{sub.num}</span>
                                    {sub.head && <h3 className={s.subTitle}>{sub.head}</h3>}
                                </div>
                                <div className={s.subBody}>
                                    <Body items={sub.body} />
                                </div>
                            </div>
                        ))}
                    </section>
                ))}

                <div className={s.footnote}>
                    <p>
                        This Charter is issued by The Privé Network. For questions relating to this Charter, contact{" "}
                        <a href={`mailto:${m.contactEmail}`}>{m.contactEmail}</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}
