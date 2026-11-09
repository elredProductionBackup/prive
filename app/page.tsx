import type { Metadata } from "next"
import Hero from "@/components/site/Hero"
import { DEFAULT_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/seo"
import QualificationButton from "@/components/site/QualificationButton"
import Footer from "@/components/site/Footer"
import MainContent from "@/components/practices/MainContent"
import Coming from "@/components/home/Coming"
import WhenCarousel from "@/components/events/WhenCarousel"
import MonthCalendar from "@/components/events/MonthCalendar"
import PreviouslyCarousel from "@/components/events/PreviouslyCarousel"
import { AFFILIATION_NOTE, MEMBERSHIP_NOTE, NOT_LIST, NOT_NOTE } from "@/content/site"

export const metadata: Metadata = pageMetadata({ title: HOME_TITLE, description: DEFAULT_DESCRIPTION, path: "/" })

// 9 Nov
export default function Home() {
    return (
        <>
            <div className="stack">
                <Hero />

                {/* Everything below slides up over the sticky hero */}
                <main className="page">
                    <section className="intro" aria-labelledby="why">
                        <div className="wrap">
                            <h2 id="why" className="section-title ruled">Why</h2>
                            <MainContent />

                            <div className="qual-row">
                                <QualificationButton />
                                <p className="small-note">{MEMBERSHIP_NOTE}</p>
                                <Coming />
                            </div>
                        </div>
                    </section>

                    <section id="calendar" className="calendar" aria-label="Calendar">
                        <WhenCarousel />
                        <MonthCalendar />
                    </section>

                    <section className="previously" aria-labelledby="previously">
                        <h2 id="previously" className="section-title center">Previously at Privé</h2>
                        <PreviouslyCarousel />
                    </section>

                    <section className="not" aria-labelledby="not">
                        <div className="wrap">
                            <h2 id="not" className="section-title center">What we are not</h2>
                            <dl className="not-list">
                                {NOT_LIST.map((n) => (
                                    <div key={n.title} className="not-row">
                                        <dt>{n.title}</dt>
                                        <dd>{n.text}</dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="small-note">{NOT_NOTE}</p>
                            <p className="tiny-note">{AFFILIATION_NOTE}</p>
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </>
    )
}
