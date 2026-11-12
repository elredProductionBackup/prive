// All homepage copy and image links live here, so text changes never touch layout code.

// One image for every screen size (it crops from the centre on phones)
export const HERO = {
    image: "https://res.cloudinary.com/dtrv7p3gg/image/upload/v1794213629/43168dd339358ec0fdb57435a65d36e45ff00e49_1_fil5hr.png",
    alt: "Four climbers roped together on a snowy ridge at sunrise, high above a sea of clouds",
    title: "No one climbs alone", // Mencken Std, shown in capitals
    sub: "every summit is reached as a team", // Mencken Std Head, italic
}

export const LOGO = { src: "/images/prive-logo.svg", width: 160, height: 55, alt: "Privé" }

// action: "top" scrolls up, "modal:<name>" opens a popup, href navigates
export type NavItem = { label: string; href?: string; action?: string }

export const NAV: NavItem[] = [
    { label: "Home", action: "top" },
    { label: "About", href: "/about" },
    { label: "Qualification & Membership", action: "modal:qualification" },
    { label: "Wider Perspective", href: "/work/wider-perspective" },
    { label: "Operating Philosophy", action: "modal:philosophy" },
    { label: "Huddle", href: "/work/huddle" },
    { label: "FAQ", action: "modal:faq" },
    { label: "Contact", href: "mailto:info@theprive.network" },
]


export const MEMBERSHIP_NOTE =
    "Most events will be held in Mumbai | Membership will be valid for 12 months. For example, if you join in November 2026, your membership will remain valid until the end of October 2027."

// "Coming in 2027" box, shown under the membership note
export const COMING = {
    title: "Coming in 2027",
    image: "https://res.cloudinary.com/dtrv7p3gg/image/upload/v1794215120/a4f2e8c988ce6e537dcb517c6f7dbc998142da0c_1_wjqeas.png",
    items: [
        {
            title: "Privé Insights",
            kicker: "90 Minutes. Exceptional Minds.\nFresh Perspectives.",
            text: "A monthly 90-minute conversation with some of the world's foremost business leaders, thinkers, entrepreneurs and visionaries.",
            tagline: "Learn from the minds shaping\nthe world.",
        },
        {
            title: "Privé Papers",
            kicker: "Global Academic Minds.\nReal Enterprise Challenges.",
            text: "Privé is partnering with leading professors and researchers from some of the world's most respected universities to undertake customised research for our member enterprises.",
            tagline: "Put the world's best minds to work\non your business.",
        },
    ],
}

export const HUDDLE = {
    title: "Privé Huddle",
    kicker: "A curated group of max 15 peers meeting in structured sessions",
    text: "Closed-door thought rooms for serious dialogue among trusted peers, issue led discussions, cross-industry learning.",
    icon: "/images/huddle-icon.svg",
}

export const NOT_LIST = [
    {
        title: "Not another networking organisation",
        text: "This is curated peer learning & collaboration. We are focused on solving problems using the best learnings.",
    },
    {
        title: "Not executive education",
        text: "Anyone can organise executive education, it is the peer group that matters.",
    },
]

export const NOT_NOTE =
    "Most events will be held in Mumbai | Membership will be valid for 12 months. For example, if you join in October 2026, your membership will remain valid until the end of September 2027."

export const AFFILIATION_NOTE =
    "*Institution names indicate the faculty member's affiliation only. This event is independently organized and is not affiliated with, endorsed by, or sponsored by the named institutions."

/* ---------- Popups ----------
   Blocks: { p } paragraph, { list } bullet list, { gap } extra space.
   **bold** works everywhere. */

export type Block = { p?: string; list?: string[]; q?: string }

export const QUALIFICATION: { blocks: Block[]; footnote: string } = {
    blocks: [
        { p: "Privé is designed for **ambitious, restless, forward-looking enterprises** that are still hungry to become significantly better than they are today." },
        { p: "We are interested in companies that can demonstrate what makes them exceptional, distinctive or capable of becoming the best in their field.\nWe look beyond size and revenue. We look for evidence of **trajectory, intent and enterprise-building.**" },
        { p: "We would want to understand:" },
        {
            list: [
                "**Created vs inherited** — what has the current leadership meaningfully built?",
                "**Initiated vs operated** — what has the enterprise started, changed or transformed rather than simply continued?",
                "**Risk taken vs safe execution** — where has the company made bold decisions, entered new markets, invested ahead of certainty or challenged convention?",
            ],
        },
        { p: "Has the enterprise built something unusual?\nWhere does it have an **unfair advantage:** technology, distribution, manufacturing capability, intellectual property, customer access, talent, trust, brand, data or domain expertise?" },
        { p: "We care deeply about **trajectory**. A smaller company growing extraordinarily fast can be far more interesting than a much larger company that has stopped evolving." },
        { p: "How is your enterprise fundamentally different today from what it was three years ago?" },
        { p: "If growth has plateaued, what makes you believe the organisation is ready for its next chapter? What are you prepared to change in order to get there?" },
        { p: "And importantly:\n**How will Privé be different because your enterprise joined?**\nWhat knowledge, capability, access, experience or perspective can your organisation contribute to the wider ecosystem?" },
        { p: "What could another member company learn from you?" },
        { p: "What could another enterprise build with you?" },
        { p: "If we were introducing your company to the Privé community, what would we say beyond simply calling it “successful”?" },
        { p: "We are curating enterprises led by **intellectually curious, clear-thinking teams** that question assumptions, debate ideas openly and are willing to learn from companies very different from their own." },
        { p: "Privé works only when members contribute as much as they consume." },
        { p: "Your leadership and teams should therefore be willing to share experiences openly, respond to fellow members and participate meaningfully when another member reaches out with a genuine opportunity, question or problem." },
        { p: "**Responsiveness matters.** We expect member organisations to respond to fellow members within 48 hours wherever reasonably possible. Repeated non-response or ghosting works against the culture we are trying to build.\nCompany size, industry, age, geography or pedigree will not determine who belongs here." },
        { p: "We are building an ecosystem of exceptional enterprises and the people behind them, and we are hungry to bring together those with the ambition, capability and generosity to make the entire network stronger." },
    ],
    footnote:
        "We would yes seek recommendations, however those from politicians, police would go against your membership. We respect and admire all forms of civic leadership but construe such recommendations as pressure.",
}

// FAQ popup: an accordion. Answers are paragraphs; **bold** works.
export const FAQ = {
    title: "FAQ",
    items: [
        {
            q: "Is Privé membership for individuals or enterprises?",
            a: [
                "Privé membership is designed for the **enterprise**, not for a single individual.",
                "Across **54 Practices**, your enterprise has access to **two seats at each**, creating **108 opportunities to participate** through the year.",
                "For every Practice, you may nominate the two people who are most relevant to the subject, whether founders, owners, senior leadership or members of your wider team.",
                "This allows different people across the organisation to participate where they can learn, contribute and create the greatest value.",
                "**One enterprise membership. The right people, in the right room, for the right conversation.**",
            ],
        },
        {
            q: "Is membership renewed every year?",
            a: [
                "Yes. Privé operates on a **rolling 12-month membership**.",
                "Your membership begins from the date you join and remains valid for 12 months. Renewal becomes due at the end of that period, allowing your enterprise to continue accessing Privé, its Practices and the wider network.",
            ],
        },
    ],
    footerPrompt: "Anything we left out?",
    footerLink: { label: "contact us", href: "mailto:info@theprive.network?subject=A%20question%20about%20Priv%C3%A9" },
}

// Operating Philosophy popup: a heading on the left, short paragraphs on the right
export type PrincipleSection = { heading: string; paragraphs: string[] }

export const PHILOSOPHY: { title: string; sections: PrincipleSection[] } = {
    title: "Operating Philosophy",
    sections: [
        {
            heading: "Ecosystem over individualism",
            paragraphs: [
                "Global relevance is not achieved through isolated brilliance.",
                "It comes from **building interconnected systems**: talent, capital, supply chains, technology, and influence that reinforce each other.",
                "Every member contributes to this architecture. The culture rewards **collaborative scale**, not personal wins.",
            ],
        },
        {
            heading: "Conviction in scale",
            paragraphs: [
                "Scale determines seriousness.",
                "The network operates on the belief that **ambition is only credible when it can compound** across markets, sectors, and borders.",
                "Ideas are interrogated not for novelty but for **capacity to scale, sustain, and dominate.**",
            ],
        },
        {
            heading: "Restless forward motion",
            paragraphs: [
                "A shared temperament: **impatient with stagnation, allergic to incrementalism.**",
                "Conversations are anchored in where the world is going, not where it has been.",
                "Curiosity, speed and execution are cultural currencies.",
            ],
        },
    ],
}

export const FOOTER = {
    colA: [
        { label: "Home", action: "top" },
        { label: "About", href: "/about" },
        { label: "FAQ", action: "modal:faq" },
    ] as NavItem[],
    colB: [{ label: "Governing Charter", href: "/governing-charter" }] as NavItem[],
    social: [
        { label: "Youtube", href: "https://www.youtube.com/channel/UCvyMrdA8sR1RaCo4IodTwtQ" },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/priv%C3%A9-2026/" },
        { label: "Instagram", href: "https://www.instagram.com/theprive.network/" },
        { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61595293018007" },
        { label: "Email", href: "mailto:info@theprive.network?subject=I%20have%20a%20Question" },
    ] as NavItem[],
    office: "16, Yashodham Center, Film City Road, Goregaon (E), Mumbai 400063, Maharashtra, India",
    network: "Network is one amongst many networks trademarked and operated by",
    company: { label: "Rextone Digital", href: "https://www.rextonedigital.com/" },
    copyright: "2026 Rex-Tone Digital Pvt. Ltd.",
    credit: "Designed in-house",
}
