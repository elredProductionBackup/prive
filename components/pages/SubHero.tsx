import ImageSlot from "./ImageSlot"

// Inner-page hero: image under a black overlay, big title, rule, page name and section links
export default function SubHero({ image, title, eyebrow, links, imageLabel }: { image: string; title: string; eyebrow: string; links: { id: string; label: string }[]; imageLabel: string }) {
    return (
        <section className="sub-hero" aria-labelledby="page-title">
            <ImageSlot src={image} className="sub-hero-img" label={imageLabel} priority />
            <div className="hero-overlay" aria-hidden />
            <div className="sub-hero-inner">
                <h1 id="page-title" className="sub-hero-title">{title}</h1>
                <div className="sub-hero-row">
                    <p className="sub-hero-eyebrow">{eyebrow}</p>
                    <nav aria-label="On this page">
                        <ul className="sub-hero-links">
                            {links.map((l) => (
                                <li key={l.id}><a href={`#${l.id}`}>{l.label}</a></li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
    )
}
