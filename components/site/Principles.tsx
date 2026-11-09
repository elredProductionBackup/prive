import { rich } from "@/lib/rich"
import type { PrincipleSection } from "@/content/site"

// Heading on the left, italic paragraphs on the right, a hairline between sections.
// Used by the Operating Philosophy popup and the Governing Charter page.
export default function Principles({ sections }: { sections: PrincipleSection[] }) {
    return (
        <div className="principles">
            {sections.map((s) => (
                <section key={s.heading} className="principle">
                    <h3 className="principle-heading">{s.heading}</h3>
                    <div className="principle-body">
                        {s.paragraphs.map((p, i) => <p key={i}>{rich(p)}</p>)}
                    </div>
                </section>
            ))}
        </div>
    )
}
