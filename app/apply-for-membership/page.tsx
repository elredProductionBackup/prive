import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import Footer from "@/components/site/Footer"
import { APPLY, MEMBERSHIP_PATH } from "@/content/membership"
import ApplyForm from "./ApplyForm"
import s from "./apply.module.css"

export const metadata: Metadata = pageMetadata({
    title: "Apply for Membership | Privé Network",
    description: "Apply for Privé membership. Tell us about yourself and your enterprise, and the Privé team will be in touch to take the conversation forward.",
    path: MEMBERSHIP_PATH,
})

export default function ApplyPage() {
    const [line1, line2] = APPLY.titleLines
    return (
        <>
            <main className={s.main}>
                <div className={s.wrap}>
                    <section className={s.info} aria-labelledby="apply-title">
                        <h1 id="apply-title" className={s.title}>
                            <span>{line1}</span> <em>{line2}</em>
                        </h1>
                        <p className={s.intro}>{APPLY.intro}</p>
                        <ol className={s.steps}>
                            {APPLY.steps.map((step, i) => (
                                <li key={step.title} className={s.step}>
                                    <span className={s.stepNum} aria-hidden>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h2 className={s.stepTitle}>{step.title}</h2>
                                        <p className={s.stepText}>{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <ApplyForm />
                </div>
            </main>
            <Footer />
        </>
    )
}
