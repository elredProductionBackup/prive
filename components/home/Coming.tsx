import Image from "next/image"
import { COMING, HUDDLE } from "@/content/site"
import { cld } from "@/lib/cld"
import { rich } from "@/lib/rich"
import s from "./Coming.module.css"

// "Coming in 2027" (Privé Insights + Privé Papers) and the Privé Huddle box
export default function Coming() {
    return (
        <div className={s.root}>
            <section className={s.card} aria-labelledby="coming-title" style={{ "--bg": `url("${cld(COMING.image, 1400)}")` } as React.CSSProperties}>
                <img src={cld(COMING.image, 1800)} alt="" aria-hidden loading="lazy" decoding="async" className={s.bg} />
                <h2 id="coming-title" className={s.title}>
                    <span className={s.rule} aria-hidden />
                    {COMING.title}
                    <span className={s.rule} aria-hidden />
                </h2>
                <div className={s.grid}>
                    <div className={s.strip} aria-hidden />
                    {COMING.items.map((it, i) => (
                        <div key={it.title} className={`${s.item} ${i ? s.second : ""}`} style={{ "--i": i } as React.CSSProperties}>
                            <h3 className={s.itemTitle}>{it.title}</h3>
                            <p className={s.kicker}>{rich(it.kicker)}</p>
                            <p className={s.text}>{it.text}</p>
                        </div>
                    ))}
                    {COMING.items.map((it, i) => (
                        <p key={it.tagline} className={`${s.tagline} ${i ? s.secondTag : s.firstTag}`}>{rich(it.tagline)}</p>
                    ))}
                </div>
            </section>

            <section className={s.huddle} aria-labelledby="huddle-title">
                <Image src={HUDDLE.icon} alt="" width={72} height={60} unoptimized className={s.icon} />
                <div>
                    <div className={s.huddleHead}>
                        <h3 id="huddle-title" className={s.itemTitle}>{HUDDLE.title}</h3>
                        <p className={s.huddleKicker}>{HUDDLE.kicker}</p>
                    </div>
                    <p className={s.huddleText}>{HUDDLE.text}</p>
                </div>
            </section>
        </div>
    )
}
