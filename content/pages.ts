// Copy and images for the inner pages. **bold** works in headings and text.
// Image fields left as "" show a neutral block until you paste a link.

/* ───────────── About ───────────── */

const CLD = "https://res.cloudinary.com/dtrv7p3gg/image/upload"

export const ABOUT = {
    hero: {
        title: "About us",
        subtitle: "Building ambitious, forward looking, relentless ecosystems",
        image: `${CLD}/v1793436419/about_nudf2j.webp`,
    },
    setOut: {
        title: "What we are set out for",
        note: "What we lack is urgency; the world notices only what we build, not what we intend.",
        lead: "Global relevance is not built through isolated successes. It is earned by building complete ecosystems: research, manufacturing, and resilient supply chains. Presence alone is not enough. Without sustained execution at scale, relevance remains peripheral.",
        columns: [
            "Global relevance demands ambition, restlessness, and forward thinking. The future is being shaped where scale signals seriousness, long-term intent, and the capacity to compete, invest, and lead on a global stage, with conviction and staying power.",
            "We question why we remain peripheral to the defining narratives of the future. Are we investing enough in research, R&D, and scientific breakthroughs? Progress needs leaders who think long-term, take risks, fail, learn, and build again.",
        ],
    },
    vision: {
        paragraphs: [
            "Our vision is to elevate good teams into great ones, building stronger enterprises where owners, leaders and teams learn, solve and grow together.",
            "We bring exceptional academic and business minds into this journey, helping teams turn learning into better decisions and ideas into action.",
        ],
        signature: "Saurabh Goswamy",
        name: "Saurabh Goswamy",
        role: "Founder",
    },
    join: {
        eyebrow: "Join us if you are looking to build, grow, and take your ideas further",
        lead: "We are building a team that redefines how networks engage, learn, collaborate and grow using clarity, technology, and intent to deliver outcomes.",
        image: `${CLD}/v1793436421/about_user_mciyt1.jpg`,
        ringText: "collaborate · engage · learn · ",
        points: [
            { title: "Engage", text: "Who you spend time with matters" },
            { title: "Learn", text: "Curated learning programs, content, and real industry access" },
            { title: "Collaborate", text: "By design – not by chance" },
        ],
    },
    tribe: {
        title: "The Tribe",
        kicker: "We hate company politics",
        intro: "At The Tribe, we are committed to creating thoughtfully curated learning experiences that are relevant, immersive, and future-focused. We value every member deeply, taking the time to understand individual journeys and aspirations.",
        members: [
            { name: "Saurabh Goswamy", role: "Founder", image: `${CLD}/v1793436236/SG_sbb8jx.jpg` },
            { name: "Anushka", role: "Member Experience Lead", image: `${CLD}/v1793436218/anushka_jg4ccb.jpg` },
            { name: "Nandini", role: "Member Relations Lead", image: `${CLD}/v1793437897/nandini_iyguj1.avif` },
            { name: "Malaika", role: "Product Manager", image: `${CLD}/v1793436207/malaika_gd3kf5.jpg` },
            { name: "Uttam", role: "Lead Design", image: `${CLD}/v1793436215/uttam_n8gdhk.png` },
            { name: "Ritika", role: "Lead, Native Applications", image: `${CLD}/v1793436261/ritika_ofchwj.png` },
            { name: "Vignesh", role: "Lead AWS/API", image: `${CLD}/v1793436254/vignesh_h2eg5w.png` },
            { name: "Tashaf", role: "Lead Web Applications", image: `${CLD}/v1793436265/tashaf_blg3v8.png` },
            { name: "Ananya", role: "Admin", image: `${CLD}/v1793436224/ananya_rptt2l.png` },
        ],
        joinTitle: "Join the Team",
        careersHref: "mailto:info@theprive.network?subject=Careers%20at%20Priv%C3%A9",
        contactHref: "mailto:info@theprive.network",
    },
    values: {
        title: "What makes us, us",
        cards: [
            { title: "Authenticity", image: `${CLD}/v1793436202/authenticity_doj3ug.jpg` },
            { title: "Innovative", image: `${CLD}/v1793436204/innovative_gaed7v.png` },
            { title: "Hard Work", image: `${CLD}/v1793436204/hard-work_w23fcm.jpg` },
        ],
        points: [
            "We take pride in every tribe member showing up as their most authentic self. Individuality isn’t just welcomed here - it’s essential.",
            "We value members who question, suggest, and bring forward fresh ideas. Innovation thrives when curiosity and initiative are encouraged.",
            "Hard work is irreplaceable. Ideas matter, but consistent effort, ownership, and follow through are what truly move us forward.",
        ],
        statement: "We are a collective of like minded independents; diverse in perspective, united in intent.",
        statementText: "We believe in independent thinkers who come together to execute a shared vision. Autonomy fuels creativity; alignment drives impact.",
    },
    // "Privé" banner: stays put and the wordmark grows while the contact section slides over it
    banner: {
        title: "Privé",
        image: `${CLD}/v1793436429/heroImg_pu4lwm.png`,
    },
    contact: {
        title: ["Let’s create", "something", "remarkable"],
        text: "If you’re interested in any form of collaboration, please send us an email and we’ll get back shortly.",
        linkLabel: "Contact us",
        href: "mailto:info@theprive.network?subject=Collaboration%20with%20Priv%C3%A9",
        image: `${CLD}/v1793436947/ballbg_htdevg.webp`,
    },
}

/* ───────────── Topic pages (Huddle, Wider Perspective) ───────────── */

// Big word art: each line is a list of pieces; style "big" | "gold" | "caps"
export type WordPiece = { t: string; s: "big" | "gold" | "caps" | "q" }
export type TopicRow = { id: string; link: string; word: WordPiece[][]; heading: string; text?: string }
export type TopicPage = { hero: { image: string; title: string; eyebrow: string }; rows: TopicRow[] }

export const HUDDLE_PAGE: TopicPage = {
    hero: {
        image: "https://res.cloudinary.com/dtrv7p3gg/image/upload/v1794155811/study-groups_1_mcaqst.png",
        title: "Intentionally curated small groups under Chatham House principles",
        eyebrow: "Huddle",
    },
    rows: [
        {
            id: "why",
            link: "Why?",
            word: [[{ t: "Why", s: "big" }, { t: "?", s: "q" }]],
            heading: "Large rooms optimise for reach; small rooms optimise for value.",
            text: "Our capacity for thought defines us. In an age of abundant information, true value is found in quiet, considered exchanges among a few, saloon style, where judgment is refined, perspective deepened, and enduring relationships formed with care.",
        },
        {
            id: "what",
            link: "What?",
            word: [[{ t: "What", s: "big" }, { t: "?", s: "q" }]],
            heading: "A curated group of max 15 peers meeting in structured sessions.",
            text: "Closed-door thought rooms for serious dialogue among trusted peers, issue-led discussions, cross-industry learning, and opportunities for collaboration.",
        },
        {
            id: "how",
            link: "How?",
            word: [[{ t: "How", s: "big" }, { t: "?", s: "q" }]],
            heading: "**In-person sessions hosted** in thoughtfully chosen settings.",
            text: "Settings that encourage focus, discretion, trust, and meaningful dialogue away from daily operational noise. Inviting unhurried conversation, considered reflection, and the exchange of ideas.",
        },
        {
            id: "when",
            link: "When?",
            word: [[{ t: "When", s: "big" }, { t: "?", s: "q" }]],
            heading: "At every event, with a defined cadence to allow depth, continuity, and measurable progress.",
        },
    ],
}

export const WIDER_PERSPECTIVE: TopicPage = {
    hero: {
        image: "https://res.cloudinary.com/dtrv7p3gg/image/upload/v1794155811/wider-perspective_1_t5fjjx.png",
        title: "Unbound by Geography",
        eyebrow: "Wider Perspective",
    },
    rows: [
        {
            id: "members-across-cities",
            link: "Members across cities",
            word: [[{ t: "Members", s: "big" }], [{ t: "Across", s: "gold" }, { t: "Cities", s: "caps" }]],
            heading: "Perspectives beyond a single city or market",
            text: "Bring broader pattern recognition, sharper judgment, and better decisions. By drawing insight from diverse geographies, operating contexts, and cycles, members avoid local bias and act with a clearer view of scale, risk, and opportunity.",
        },
        {
            id: "varied-cultural-approaches",
            link: "Varied cultural approaches",
            word: [[{ t: "Varied", s: "caps" }], [{ t: "Cultural", s: "gold" }], [{ t: "Approaches", s: "big" }]],
            heading: "Cultural lenses shape how people interpret problems",
            text: "It shapes how we respond to uncertainty, and decide what feels workable. Learning from different cultural contexts builds empathy, reduces blind spots, and helps leaders choose solutions that resonate with everyday realities.",
        },
        {
            id: "diverse-decision-styles",
            link: "Diverse decision styles",
            word: [[{ t: "Diverse", s: "caps" }], [{ t: "Decision", s: "gold" }, { t: "Style", s: "big" }]],
            heading: "**Exposure to diverse business environments and decision styles** builds sharper adaptability",
            text: "Leaders learn when to move fast, when to pause, and how context shapes outcomes, helping them make better calls across different teams, markets, and moments of uncertainty.",
        },
        {
            id: "reduce-blind-spots",
            link: "Reduce blind spots",
            word: [[{ t: "Reduce", s: "big" }], [{ t: "Blind", s: "gold" }], [{ t: "Spots", s: "caps" }]],
            heading: "Context sharpens judgment by slowing quick conclusions and revealing what is often missed.",
            text: "When leaders encounter situations beyond their usual frame, blind spots surface, assumptions soften, and decisions become more considered, rooted not just in logic, but in lived understanding of how choices truly unfold.",
        },
    ],
}
