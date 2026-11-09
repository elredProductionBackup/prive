import type { TopicPage as TopicPageData, WordPiece } from "@/content/pages"
import { rich } from "@/lib/rich"
import Footer from "@/components/site/Footer"
import SubHero from "./SubHero"

function WordArt({ lines }: { lines: WordPiece[][] }) {
    return (
        <p className="word-art" aria-hidden>
            {lines.map((line, i) => (
                <span key={i} className="word-line">
                    {line.map((p, j) => (
                        <span key={j} className={`word-${p.s}`}>{p.t}</span>
                    ))}
                </span>
            ))}
        </p>
    )
}

// Huddle and Wider Perspective share this layout: hero, then rows that alternate sides
export default function TopicPage({ data, imageLabel }: { data: TopicPageData; imageLabel: string }) {
    return (
        <>
            <SubHero {...data.hero} imageLabel={imageLabel} links={data.rows.map((r) => ({ id: r.id, label: r.link }))} />
            <main className="topic">
                {data.rows.map((r, i) => (
                    <section key={r.id} id={r.id} className={`topic-row ${i % 2 ? "is-flipped" : ""}`} aria-label={r.link}>
                        <div className="topic-word">
                            <WordArt lines={r.word} />
                            <span className="sr-only">{r.link}</span>
                        </div>
                        <div className="topic-copy">
                            <h2 className={`topic-heading ${r.heading.includes("**") ? "is-mixed" : ""}`}>{rich(r.heading)}</h2>
                            {r.text && <p className="topic-text">{r.text}</p>}
                        </div>
                    </section>
                ))}
            </main>
            <Footer />
        </>
    )
}
