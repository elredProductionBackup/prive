import { COPY, FUNCTIONS, LEADERS, SPEAKERS, TIERS, type Person } from "@/content/practices"
import { rich } from "@/lib/rich"
import s from "./MainContent.module.css"

// Server component: sizes respond to the box width with CSS container queries,
// so there is no layout jump on first load.

// Several months ("APR · AUG · NOV 2027") print as two lines: the months, then the year
function Stamp({ text, upcoming }: { text: string; upcoming: boolean }) {
    const multi = text.includes("·")
    const [months, year] = multi ? [text.replace(/\s*\d{4}$/, ""), text.match(/\d{4}$/)?.[0]] : [text, ""]
    const longest = Math.max(months.length, 14)
    return (
        <div className={`${s.stamp} ${upcoming ? s.up : s.past}`} style={{ "--stamp-scale": 14 / longest } as React.CSSProperties}>
            {months}
            {year && (
                <>
                    <br />
                    {year}
                </>
            )}
        </div>
    )
}

function Card({ p }: { p: Person }) {
    return (
        <div className={s.card}>
            <div className={s.cardInner}>
                {p.kind === "logo" ? (
                    <div className={s.logoCard}>
                        <img className={s.logoImg} src={p.image} alt={`${p.subtitle} logo`} loading="lazy" decoding="async" />
                        <div className={s.logoName}>{p.name}</div>
                    </div>
                ) : (
                    <div className={s.photo}>
                        <img className={s.photoImg} src={p.image} alt={`${p.name}, ${p.subtitle}`} loading="lazy" decoding="async" />
                        <div className={s.shade} />
                        {p.sessions && p.sessions > 1 && <span className={s.badge}>{p.sessions} sessions</span>}
                        {/* Two-line stamps are taller, so the name sits a little higher */}
                        <div className={s.caption} style={p.month.includes("·") ? { bottom: "19cqw" } : undefined}>
                            <div className={s.name}>{p.name}</div>
                            <div className={s.sub}>{p.subtitle}</div>
                        </div>
                    </div>
                )}
                <div className={s.stampWrap}>
                    <Stamp text={p.month} upcoming={p.upcoming} />
                </div>
            </div>
        </div>
    )
}

export default function MainContent() {
    return (
        <div className={s.root}>
            {COPY.why.map((t, i) => (
                <p key={i} className={s.p}>{rich(t)}</p>
            ))}

            <h2 id="what" className={`section-title ruled ${s.what}`}>What</h2>
            {COPY.what.map((t, i) => (
                <p key={i} className={s.p}>{rich(t)}</p>
            ))}

            <div className={s.block}>
                <p className={`${s.p} ${s.bold}`}>{COPY.signatureTitle}</p>
                <p className={`${s.p} ${s.body}`}>{rich(COPY.signatureText)}</p>
            </div>

            <div className={`${s.cards} ${s.speakers}`}>
                {SPEAKERS.map((p) => <Card key={p.name + p.month} p={p} />)}
            </div>

            <div className={s.beyond}>
                <p className={`${s.p} ${s.bold}`}>{COPY.beyondTitle}</p>
                <p className={`${s.p} ${s.body}`}>{rich(COPY.beyondText)}</p>
            </div>

            <div className={s.functions}>
                {FUNCTIONS.map((f, i) => (
                    <div key={f.title} className={`${s.fn} ${i % 2 ? s.fnAlt : ""}`}>
                        <div className={s.fnIcon}>
                            <img src={f.icon} alt="" />
                        </div>
                        <h3 className={s.fnTitle}>{f.title}</h3>
                        <ul className={s.fnList}>
                            {f.items.map((it) => <li key={it}>{it}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={`${s.cards} ${s.leaders}`}>
                {LEADERS.map((p) => <Card key={p.name} p={p} />)}
            </div>

            <p className={s.days}>{COPY.daysLine}</p>

            <div className={s.tiers}>
                {TIERS.map((t, i) => (
                    <div key={t.label} className={s.tierWrap}>
                        {i > 0 && <span className={`${s.divider} ${i % 2 === 0 ? s.dividerSkipMobile : ""}`} aria-hidden />}
                        <div className={s.tier}>
                            <img className={s.tierIcon} src={t.icon} alt="" />
                            <div className={s.tierLabel}>{t.label}</div>
                            <div className={s.goldBar} />
                            <div className={s.price}>
                                <span className={s.rupee}>₹</span>
                                {t.amount}
                            </div>
                            <p className={s.tierDesc}>{t.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
