import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Footer from "@/components/site/Footer"
import { ABOUT } from "@/content/pages"
import { cld } from "@/lib/cld"
import BannerParallax from "./BannerParallax"
import ZoomInImage from "./ZoomInImage"
import s from "./about.module.css"

export const metadata: Metadata = pageMetadata({
    title: "About Privé | The Team Behind the Enterprise Network",
    description: "Privé brings exceptional academic and business minds together to elevate good teams into great ones. Meet the founder and the tribe behind the network.",
    path: "/about",
    image: "https://res.cloudinary.com/dtrv7p3gg/image/upload/c_fill,w_1200,h_630/v1793436419/about_nudf2j.webp",
})

const pad = (n: number) => String(n).padStart(2, "0")
const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties

// Image, or a soft placeholder when the link is empty
function Img({ src, alt = "", className = "", width = 1200, eager = false }: { src?: string; alt?: string; className?: string; width?: number; eager?: boolean }) {
    return (
        <div className={`${s.imgBox} ${className}`}>
            {src && <img src={cld(src, width)} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" className={s.cover} />}
        </div>
    )
}

export default function AboutPage() {
    const { hero, setOut, vision, join, tribe, values, banner, contact } = ABOUT

    return (
        <>
            <main className={s.main}>
                {/* 1. Hero: stays put while the page slides over it */}
                <section className={s.hero} aria-labelledby="page-title">
                    <Img src={hero.image} eager width={2000} className={s.fill} />
                    <div className="hero-overlay" aria-hidden />
                    <div className={s.heroCopy}>
                        <h1 id="page-title" className={s.heroTitle}>{hero.title}</h1>
                        <p className={s.heroSub}>{hero.subtitle}</p>
                    </div>
                </section>

                <div className={s.over}>
                    {/* 2. What we are set out for */}
                    <section className={`${s.section} ${s.surface}`}>
                        <div className={`${s.wrap} ${s.split}`}>
                            <div className={s.leftCol}>
                                <h2 data-reveal className={`${s.h1} ${s.narrow}`}>{setOut.title}</h2>
                                <p data-reveal className={`${s.note} ${s.desktopOnly}`}>{setOut.note}</p>
                            </div>
                            <div>
                                <p data-reveal className={s.lead}>{setOut.lead}</p>
                                <div className={s.cols}>
                                    {setOut.columns.map((t, i) => (
                                        <p key={i} data-reveal style={delay(i * 100)}>{t}</p>
                                    ))}
                                </div>
                                <p data-reveal className={`${s.note} ${s.mobileOnly}`}>{setOut.note}</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Vision: pins on larger screens while the next section slides over it */}
                    <section className={s.vision} aria-label="Our vision">
                        <div className={s.wrap}>
                            {vision.paragraphs.map((p, i) => (
                                <p key={i} data-reveal className={`${s.visionText} ${i ? s.visionSecond : ""}`}>{p}</p>
                            ))}
                            <div data-reveal className={s.sign}>
                                <p className={s.signature} aria-hidden>{vision.signature}</p>
                                <p className={s.signName}>
                                    {vision.name}
                                    <span> · {vision.role}</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className={s.over}>
                        {/* 4. Join us */}
                        <section className={`${s.section} ${s.surface}`}>
                            <div className={`${s.wrap} ${s.split} ${s.top}`}>
                                <div>
                                    <h2 data-reveal className={s.h2Muted}>{join.eyebrow}</h2>
                                    <p data-reveal className={`${s.lead} ${s.joinLead}`}>{join.lead}</p>
                                </div>
                                <div>
                                    <div data-reveal className={s.joinMedia}>
                                        <Img src={join.image} alt="Privé members collaborating" className={s.fill} />
                                        {/* Ring of words, slowly turning */}
                                        <div className={s.ring} aria-hidden>
                                            <svg viewBox="0 0 400 400">
                                                <defs>
                                                    <path id="about-ring-path" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
                                                </defs>
                                                {/* Two passes of the words, stretched to exactly the circle's length (2π × 170), so they never overlap or leave a gap */}
                                                <text fill="currentColor" fontSize="24" fontWeight="400" letterSpacing="4">
                                                    <textPath href="#about-ring-path" textLength="1068" lengthAdjust="spacing">{join.ringText.repeat(2).replace(/ /g, "\u00a0")}</textPath>
                                                </text>
                                            </svg>
                                        </div>
                                    </div>
                                    <dl className={s.points}>
                                        {join.points.map((pt, i) => (
                                            <div key={pt.title} data-reveal style={delay(i * 80)}>
                                                <dt>{pt.title}</dt>
                                                <dd>{pt.text}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </section>

                        {/* 5. The Tribe */}
                        <section className={`${s.section} ${s.paper} ${s.bordered}`}>
                            <div className={s.wrap}>
                                <div className={s.tribeGrid}>
                                    <div>
                                        <h2 data-reveal className={`${s.h1} ${s.stickyTitle}`}>{tribe.title}</h2>
                                    </div>
                                    <div>
                                        <div data-reveal>
                                            <p className={s.kicker}>{tribe.kicker}</p>
                                            <p className={s.intro}>{tribe.intro}</p>
                                        </div>
                                        <ul className={s.people}>
                                            {tribe.members.map((m, i) => (
                                                <li key={m.name} data-reveal style={delay((i % 3) * 80)} className={s.person}>
                                                    <Img src={m.image} alt={`${m.name}, ${m.role}`} width={700} className={s.photo} />
                                                    <h3 className={s.personName}>{m.name}</h3>
                                                    <p className={s.personRole}>{m.role}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div data-reveal className={s.joinTeam}>
                                    <h3 className={s.joinTitle}>{tribe.joinTitle}</h3>
                                    <span className={s.vr} aria-hidden />
                                    <div className={s.joinLinks}>
                                        <a href={tribe.careersHref} className={s.link}>Careers</a>
                                        <a href={tribe.contactHref} className={s.link}>Contact</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6. What makes us, us */}
                        <section className={`${s.section} ${s.surface} ${s.bordered}`}>
                            <div className={s.wrap}>
                                <h2 data-reveal className={s.h1}>{values.title}</h2>
                                <ul className={s.valueCards}>
                                    {values.cards.map((v, i) => (
                                        <li key={v.title} data-reveal style={delay(i * 90)} className={s.valueCard}>
                                            <h3>{v.title}</h3>
                                            <div className={s.frameBox}>
                                                <div className={s.frame}>
                                                    <Img src={v.image} alt={v.title} width={800} className={s.fill} />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className={`${s.split} ${s.valuesBottom}`}>
                                    <ol className={s.numbered}>
                                        {values.points.map((t, i) => (
                                            <li key={i} data-reveal>
                                                <span className={s.num} aria-hidden>{pad(i + 1)}/</span>
                                                <p>{t}</p>
                                            </li>
                                        ))}
                                    </ol>
                                    <div data-reveal>
                                        <h3 className={s.statement}>{values.statement}</h3>
                                        <p className={s.statementText}>{values.statementText}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 7. Privé banner (hero-style parallax) → 8. golden contact slides over it */}
                        <BannerParallax image={banner.image} title={banner.title}>
                            <section className={s.contact} aria-labelledby="contact-title">
                                {contact.image && <ZoomInImage src={contact.image} />}
                                <div className={s.contactShade} aria-hidden />
                                <div className={`${s.wrap} ${s.contactInner}`}>
                                    <h2 id="contact-title" data-reveal className={s.contactTitle}>
                                        {contact.title.map((line) => (
                                            <span key={line}>{line}</span>
                                        ))}
                                    </h2>
                                    <p data-reveal className={s.contactText}>— {contact.text}</p>
                                    <a data-reveal href={contact.href} className={`${s.link} ${s.contactLink}`}>
                                        {contact.linkLabel}
                                    </a>
                                </div>
                            </section>
                        </BannerParallax>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
