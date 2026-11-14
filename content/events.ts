// Every session in one list. The "When" carousel and the month calendar both read from here.
//
// Quick guide
//   days         → ISO dates shown on the month calendar. Use range() for runs of days.
//   carousel     → true = also shown as a card in the "When" carousel
//   sessions     → the date strip on the card (and popup). A `register` link on a session
//                  gives that date its own button ("Register for 27 Nov").
//   audience     → one "who it's for" line under the date strip on the carousel card
//   register     → one form for the whole event (one "Register" button)
//   teams        → dropdown items this shows under, or "all"
//   kind "image" → shows a logo/name on the calendar and opens a poster-only popup
//   **bold** and *italic* work in all text.

export type Point = string | { letter?: string; label: string; text: string }
export type ModulePart = { title?: string; text?: string[]; points?: Point[] }
export type Module =
    | { break: string; time?: string }
    | ({ title: string; time?: string; icon?: "chart" | "search" | "target"; plain?: boolean; outcome?: string; parts?: ModulePart[] } & ModulePart)

export type Session = { date: string; label?: string; text?: string; register?: string }

export type PracticeEvent = {
    id: string
    kind?: "speaker" | "image"
    title: string
    teams: string[] | "all"
    days: string[]
    carousel?: boolean

    // Card in the "When" carousel
    description?: string
    highlights?: string[]
    titleLines?: number
    descLines?: number
    sessions?: Session[]
    audience?: string
    location?: string
    register?: string
    sticker?: { src: string; alt: string }
    media?: { type: "image" | "video"; src: string; poster?: string }
    hideViewDetails?: boolean

    speaker?: { name: string; photo?: string; role?: string; roleFull?: string; calRole?: string; linkedin?: string; tagline?: string }

    // Month calendar box (instead of photo + name)
    calTitle?: string
    calSubtitle?: string
    logo?: string

    // Popup
    popupTitle?: string
    popupDescription?: string
    showDescInPopup?: boolean
    popupDate?: string
    time?: string
    takeawaysTitle?: string
    takeaways?: string[]
    modulesTitle?: string
    moduleLabel?: string
    outcomeLabel?: string
    modules?: Module[]
    closingNote?: string
    posters?: string[]
    posterAlt?: string
}

export const TEAMS = [
    { label: "Leadership & Founders", icon: "briefcase" },
    { label: "Sales Team", icon: "people" },
    { label: "Marketing Team", icon: "megaphone" },
    { label: "Operations & Supply Chain", icon: "gear" },
    { label: "HR Team", icon: "heart" },
    { label: "Innovation", icon: "star" },
] as const

export function range(from: string, to: string): string[] {
    const out: string[] = []
    const d = new Date(from + "T00:00:00")
    const end = new Date(to + "T00:00:00")
    while (d <= end && out.length < 62) {
        out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`)
        d.setDate(d.getDate() + 1)
    }
    return out
}

const CLD = "https://res.cloudinary.com/dtrv7p3gg"
const LOCATION = "Tata Classroom - Taj Lands End, Mumbai"
const BOARD = "Founders | Promoters | Family board | Senior Leadership"

const SUNDER = `${CLD}/image/upload/v1792401857/463301abf06fbe65eedae48292208ac66fe0c1c5_vpz4n3.png`
const JONATHAN = `${CLD}/image/upload/v1792401855/jonathan_pbrrun.jpg`
const NAVIN = `${CLD}/image/upload/v1792401858/dd3dcedf2628fafad7c69a64cbaabcb6742903ee_joei3r.png`
const DANNY = `${CLD}/image/upload/v1793085102/a05d599a1f99a63b30bc49c51d96f49c1326b83a_2_q8er7g.jpg`

const JONATHAN_INTRO =
    "Innovation is at the core of both the survival and growth of any business. Despite its importance, incumbent firms struggle to innovate for various reasons, including mindset, culture, inadequate processes, limited resources, or lack of tools (or a combination thereof). In this seminar, I will lead a discussion on the need to innovate, where to look for market opportunities, how to set up a well-oiled innovation process in your organization, and how a simple set of tools can turn your organization into an innovation machine (all that remains is execution!)."

export const EVENTS: PracticeEvent[] = [
    /* ───────────── Past ───────────── */
    {
        id: "oded-netzer",
        title: "Leadership Intelligence in an AI Era: Developing Quantitative Intuition",
        teams: ["Leadership & Founders", "Innovation", "Marketing Team"],
        days: range("2026-07-31", "2026-08-02"),
        calTitle: "Columbia Business School",
        calSubtitle: "Prof. Oded Netzer",
        location: LOCATION,
        speaker: {
            name: "Prof. Oded Netzer",
            photo: `${CLD}/image/upload/v1792071101/oded_q1ccci.jpg`,
            tagline: "Leadership Intelligence in an AI Era: Developing Quantitative Intuition",
        },
        popupTitle: "Columbia Business School",
        popupDate: "31st July, 1st & 2nd August",
        takeaways: [
            "Develop competencies to integrate data-driven and AI analysis with managerial judgment to make faster, smarter decisions under uncertainty",
            "Strengthen credibility as a leader who combines analytical rigor with intuitive judgment",
            "Develop methods to prioritize what matters most when data is incomplete or ambiguous",
        ],
        modules: [
            { title: "Developing quantitative intuition", time: "10:30 AM - 12 PM", text: ["This session focuses on the framework and set of practical tools called Quantitative Intuition."] },
            { break: "Coffee Break", time: "12 PM - 12:15 PM" },
            { title: "Framing the problem", time: "12:15 PM - 1:30 PM", text: ["This session focuses on the ability to identify, analyze, and delineate problems."] },
            { break: "Lunch Break", time: "1:30 PM - 2:15 PM" },
            { title: "Becoming a fierce interrogator of data", time: "2:15 PM - 3:15 PM", text: ["This session focuses on the ability to build intuition and honing your business acumen."] },
            { break: "Coffee Break", time: "3:15 PM - 3:30 PM" },
            { title: "Summary", time: "3:30 PM - 4:15 PM", plain: true },
        ],
    },
    {
        id: "juniper",
        kind: "image",
        title: "Juniper",
        teams: "all",
        days: range("2026-08-10", "2026-08-13"),
        calTitle: "Juniper",
        posters: [`${CLD}/image/upload/v1793595175/Juniper_1_mghcv7.png`],
        posterAlt: "Juniper",
    },
    {
        id: "zen-technologies",
        kind: "image",
        title: "On-site learnings on India's defence opportunities",
        teams: ["Leadership & Founders", "Innovation"],
        days: ["2026-08-22"],
        calTitle: "Zen Technologies",
        location: "Hyderabad, India",
        popupDate: "22 August 2026",
        posters: [`${CLD}/image/upload/v1793594605/zen-techno_n7afqu.png`],
        posterAlt: "On-site learnings on India's defence opportunities, 22 August 2026, Hyderabad, India",
    },
    {
        id: "niro-sivanathan",
        title: "Negotiations, Influence, and Decision-making",
        teams: ["Sales Team", "Leadership & Founders"],
        days: ["2026-09-04", "2026-09-05"],
        calTitle: "London Business School",
        calSubtitle: "Prof. Niro Sivanathan",
        location: LOCATION,
        speaker: {
            name: "Niro Sivanathan",
            photo: `${CLD}/image/upload/v1793594605/niro_qyec9q.png`,
            tagline: "Negotiations, Influence, and Decision-making",
        },
        popupTitle: "London Business School*",
        popupDate: "4th & 5th September",
        takeaways: [
            "Master the mind before the table - Influence starts long before the deal is struck. Understanding cognitive biases, framing, and information presentation gives you an invisible edge that shapes decisions before negotiations even begin.",
            "Win at the Table by Doing the Work Before It - Deals are won or lost before anyone sits down at the table. Structured preparation - your aspiration, your leverage, and your alternatives - is the systematic edge that separates those who claim value from those who concede it.",
            "Claim an outlandish share, but leave them hungry for the next deal - The best negotiators don't just win, they make the other side feel like they won too. That's how you build a reputation that continuously opens doors.",
        ],
        modules: [
            { title: "Cognitive Principles of Influence", time: "9:00 AM - 10:30 AM", text: ["This session brings together extant knowledge on decision-making and the psychology of influence to develop a set of tactics and strategies to influence others at the bargaining table and beyond. We will draw on cognitive structures such framing, and presentation of information to influence others. focus and key learning outcomes."] },
            { break: "Coffee Break", time: "10:30 AM - 10:45 AM" },
            { title: "Cognitive Principles of Influence (Continued)", time: "10:45 AM - 12:00 PM", text: ["This session brings together extant knowledge on decision-making and the psychology of influence to develop a set of tactics and strategies to influence others at the bargaining table and beyond. We will draw on cognitive structures such framing, and presentation of information to influence others. focus and key learning outcomes."] },
            { break: "Lunch Break", time: "12:00 PM - 12:45 PM" },
            { title: "The Negotiation Simulation", time: "12:45 PM - 1:45 PM", text: ["Real pressure, real ambiguity, real consequences. A live simulation compresses years of negotiating experience, exposing exactly where your preparation holds-and where it doesn't. The debrief draws on your outcome and experience to internalize the learnings."] },
            { break: "Coffee Break", time: "1:45 PM - 2:00 PM" },
            { title: "Principles of Negotiation", time: "2:00 PM - 3:45 PM", text: ["Every negotiation has a structure, and those who understand it walk away with more. When the pie is fixed, the prepared negotiator, who masters the principles of win-lose negotiation, always gets the bigger slice."] },
        ],
    },
    {
        id: "anil-lamba",
        title: "A One-Day Programme on Finance Management",
        teams: "all",
        days: ["2026-10-01"],
        location: LOCATION,
        speaker: {
            name: "Dr. Anil Lamba",
            photo: `${CLD}/image/upload/v1793594604/anil-lamba_cw24fk.png`,
            role: "Author, Chartered Accountant",
            calRole: "Bestselling Author, Chartered Accountant",
        },
        popupDescription:
            "Bestselling author, financial literacy activist and an international corporate trainer, Dr Anil Lamba is a practicing Chartered Accountant and holds degrees in Commerce, Law and a Doctorate in Taxation.\n\nDr Lamba's training programs are held internationally, with a client list exceeding 3000 large and medium-sized corporations spread across several countries including India, the USA, and in Europe, the Middle-East and the Far-East.\n\nHis books, **'Romancing the Balance Sheet', 'Eye on the Bottom Line', 'Flirting with Stocks', 'Financial Affairs of the Common Man', 'Timeless Wisdom on Finance' & 'Start Early, Finish Rich'** are making waves.",
        popupDate: "1st October",
        modulesTitle: "Session",
        moduleLabel: "Session",
        modules: [
            { title: "Getting the basics right", text: ["**Appreciation of the key financial statements - the Profit and Loss Account, the Balance Sheet and the Cash Flow Statement.**", "In this session the structure and contents of the Profit & Loss A/c and the Balance Sheet and the relevance of different items contained therein are explained"] },
            { title: "Requisites of healthy businesses: Managing Profitability and Effective Cash Flow Management", text: ["**i) Managing Profitability**", "Since the objective of any business enterprise is to generate profits, in this session we will discuss the concept of profit. Generating profit is the collective responsibility of the entire organisation.", "Dr Lamba will also share his three super secrets of increasing profit without even increasing sales."] },
            { title: "Requisites of healthy businesses: Managing Profitability and Effective Cash Flow Management", text: ["**ii) Cash Flow Management**", "It is an established fact that most business failures are caused by financial mismanagement. It is imperative for an organization to survive and prosper that Good Finance Management is practised at all levels across the organization.", "In this session we will discuss the importance of effective cash-flow management for long-term sustainability"] },
            { title: "Financial decision making and evaluation of financial performance", text: ["**Taking financially intelligent decisions with the help of Marginal Costing Principles**", "The session helps participants to work out Break-even Points for their businesses/ projects, set targets for achieving sales, determine pricing policy, take marketing related decisions, understand the impact on profitability of decisions pertaining to credit given to customers, discounts offered etc.", "Dr Lamba will take the participants through an example covering how to working out break-even."] },
        ],
    },
    {
        id: "why-people-buy-module-1",
        title: "Why People Buy: Module 1",
        teams: ["Marketing Team", "Sales Team", "Leadership & Founders"],
        days: ["2026-10-23"],
        location: LOCATION,
        speaker: {
            name: "Ritu David",
            photo: `${CLD}/image/upload/v1792402007/71a9ee45ed849a25b8d3e963cc5f99df39c7de46_1_qqnxcy.png`,
            role: "Founder, The Data Duck",
        },
        popupTitle: "What your dashboards can't tell you about the decision your customer actually made.",
        showDescInPopup: false,
        popupDate: "23rd October",
        modulesTitle: "Session",
        moduleLabel: "Session",
        modules: [
            { title: "The reason beneath the reason", text: ["Separate the answer customers give from the pressure that shaped the choice."] },
            { title: "What dashboards cannot explain", text: ["Find what the buyer was trying to protect beneath the visible metrics."] },
            { title: "The risks inside the decision", text: ["Diagnose outcome risk, blame risk and the effort of changing."] },
            { title: "The Buyer Decision Map", text: ["Turn customer evidence into a sharper Brand Sentence for your business."] },
        ],
    },
    {
        // Completed - stays on the month calendar (greyed out), no longer in "What's next"
        id: "get-unstuck",
        title: "Get Unstuck: Breaking Through the Middle Management Plateau",
        teams: ["Sales Team", "Marketing Team", "Operations & Supply Chain", "HR Team"],
        days: ["2026-11-13"],
        descLines: 6,
        description:
            "Most managers who stall have not stopped performing. They still hit their numbers and their bosses still rely on them. What has changed is what the next level wants from them, and very few people say that out loud. This workshop is built on Sunder’s book Get Unstuck. Participants work on where they are stuck and spend most of the afternoon on live cases. They leave with a 90-day plan they have already tested on peers from other companies.",
        sessions: [
            {
                date: "13th November 2026",
                label: "Teams",
                text: "Useful for middle managers with roughly 8 to 18 years of experience who deliver well but feel their growth has stalled. Open to every function, from sales, operations and manufacturing to finance and HR, and works best with a mix in the room",
            },
        ],
        location: LOCATION,
        register: "https://forms.gle/62eAcSAT5VfYNbCq8",
        media: { type: "video", src: `${CLD}/video/upload/v1793093267/WhatsApp_Video_2026-10-21_at_15.37.37_zwxvgr.mp4`, poster: SUNDER },
        speaker: {
            name: "Sunder Ramachandran",
            photo: SUNDER,
            role: "Chief People & Transformation Officer, Biological E. Ltd",
            roleFull: "Chief People & Transformation Officer, Biological E. Ltd | Author of Get Unstuck (Westland) & HeadStart (Penguin) | Eisenhower Fellow",
            linkedin: "https://www.linkedin.com/in/sundertrg/",
        },
        popupDate: "13th November 2026",
        time: "2:00 PM - 5:30 PM",
        takeaways: [
            "A clear read on which of the six capabilities is holding you back right now.",
            "A way to build visibility with senior leaders that does not feel like self-promotion.",
            "Practical moves for influencing peers and bosses when you have no formal authority.",
            "A simple test for whether your team can run without you, and what to change if it cannot.",
            "A 90-day plan you have already pressure-tested with managers from other companies.",
        ],
        modules: [
            {
                title: "Why good managers stall",
                time: "2:00 PM - 2:45 PM",
                icon: "search",
                text: ["What changes between being a trusted operator and someone who shapes the enterprise, and why the playbook that got you here stops working."],
                outcome: "A read on their own gap, from a quick self-diagnostic",
            },
            {
                title: "The VALUES map - Case in a Box",
                time: "2:45 PM - 3:35 PM",
                icon: "target",
                text: ["A quick self-diagnostic across all six capabilities so each participant knows where their real gap is."],
                points: [
                    { letter: "V", label: "Volatility", text: "Leading when the ground keeps shifting." },
                    { letter: "A", label: "Authenticity", text: "Making principled calls under pressure." },
                    { letter: "L", label: "Leveraging Global-Local", text: "Influencing across functions, head office and the founder’s office without formal authority." },
                    { letter: "U", label: "Unique Reputation", text: "Being known for the right things by the people who decide your next role." },
                    { letter: "E", label: "Exceptional Teams", text: "Building a team that performs without you in every meeting." },
                    { letter: "S", label: "Sustainable Transformation", text: "Driving change that outlasts the launch." },
                ],
                outcome: "A group diagnosis of a stalled executive and a draft 12-month roadmap",
            },
            { break: "Tea Break", time: "3:35 PM - 3:55 PM" },
            {
                title: "Deep dive on Unique Reputation / Recommendations and challenge",
                time: "3:55 PM - 4:50 PM",
                icon: "chart",
                text: ["Why delivery alone does not get you noticed, and how to build visibility without becoming a self-promoter. Case-in-a-Box drawn from the book."],
                outcome: "Competing answers tested in front of the room",
            },
            {
                title: "Deep dive on Leveraging Global-Local - Synthesis",
                time: "4:50 PM - 5:05 PM",
                icon: "search",
                text: ["Getting peers and senior leaders to say yes when you cannot make them. Group case with a cross-functional decision."],
                parts: [{ title: "Deep dive on Exceptional Teams", text: ["Moving from doing the work to building a team that does it. A practical test for whether your team can run without you."] }],
                outcome: "The difference between getting better and being seen as ready",
            },
            {
                title: "Your 90-day unstuck plan",
                time: "5:05 PM - 5:30 PM",
                icon: "chart",
                text: ["Each participant picks the one capability holding them back and commits to two visible moves, then pressure-tests the plan with a peer."],
                outcome: "A personal commitment, tested with a peer from another company",
            },
        ],
    },

    /* ───────────── Upcoming ───────────── */
    {
        id: "jonathan-levav",
        carousel: true,
        title: "Understanding consumer’s judgments and choices by using tools from experimental psychology and behavioural economics.",
        teams: ["Marketing Team", "Sales Team", "Innovation", "Leadership & Founders"],
        days: ["2026-11-27", "2026-11-28"],
        calTitle: "Stanford Business School",
        calSubtitle: "Prof. Jonathan Levav",
        description:
            JONATHAN_INTRO +
            " Next, once you've developed your innovation, we will discuss principles of the psychology of decision making so that you can design decision environments that promote the selection of your innovation.",
        sessions: [
            { date: "27th November", label: "Teams", text: "Sales & Strategy Leaders, Directors & CXOs", register: "https://forms.gle/PJsyxN4m98d4NrtZ8" },
            { date: "28th November", label: BOARD, register: "https://forms.gle/W7T6EZyCJs1rxoPm7" },
        ],
        location: LOCATION,
        media: { type: "video", src: `${CLD}/video/upload/v1793590416/WhatsApp_Video_2026-10-28_at_19.12.05_1_mpdru3.mp4`, poster: JONATHAN },
        speaker: {
            name: "Jonathan Levav",
            photo: JONATHAN,
            role: "Stanford Business School*",
            linkedin: "https://www.linkedin.com/in/jonathan-levav-0333329/",
            tagline: "Understanding consumer’s judgments and choices by using tools from experimental psychology and behavioural economics.",
        },
        popupTitle: "Stanford Business School",
        popupDate: "27th & 28th November",
        time: "9:30 AM - 4:00 PM",
        takeaways: [
            "Where your market opportunities await",
            "Concrete toolkit for creative ideation",
            "The limits and powers of the human mind",
            "Tips on influencing choices",
        ],
        modules: [
            {
                title: "How to Find Market Opportunities and Solve Them Creatively",
                time: "9:30 AM - 10:50 AM",
                icon: "search",
                text: [JONATHAN_INTRO],
            },
            { break: "Coffee Break", time: "10:50 AM - 11:10 AM" },
            {
                title: "How to Find Market Opportunities and Solve Them Creatively (Continued)",
                time: "11:10 AM - 12:30 PM",
                icon: "search",
                text: ["*This is a continuation of the previous module.*"],
            },
            { break: "Lunch Break", time: "12:30 PM - 1:30 PM" },
            {
                title: "Choice Architecture: Become a Decision Designer",
                time: "1:30 PM - 2:50 PM",
                icon: "target",
                text: [
                    "In this pair of sessions I will discuss basic principles of choice architecture. I will share the psychological principles that you can leverage to design decision environments that increase the likelihood that an alternative will be chosen. Instead of investing resources in trying to convince people to choose an option, we will discuss (free!) ways to design the decision situation to achieve the outcome you'd like.",
                ],
            },
            { break: "Coffee Break", time: "2:50 PM - 3:10 PM" },
            {
                title: "Choice Architecture: Become a Decision Designer (Continued)",
                time: "3:10 PM - 4:00 PM",
                icon: "search",
                text: ["*This is a continuation of the previous module.*"],
            },
        ],
    },
    {
        id: "seeing-past-the-order",
        carousel: true,
        title: "Seeing Past the Order: Demand, Distribution and Digital Intelligence",
        teams: ["Operations & Supply Chain"],
        days: range("2026-12-14", "2026-12-17"),
        titleLines: 3,
        highlights: [
            "**Seeing Beyond the Order:** Demand Signals",
            "**Designing the Network:** Allocation and Fulfillment",
            "**Automating the Routine:** Digital Twin and Agentic AI",
        ],
        sessions: [
            { date: "14th December", label: "Bangalore" },
            { date: "15th December", label: "Hyderabad" },
            { date: "16th December", label: "Mumbai" },
            { date: "17th December", label: "Delhi" },
        ],
        audience: "For leaders and managers in supply chain, distribution, procurement, planning and sales operations at consumer product companies.",
        hideViewDetails: true,
        media: { type: "video", src: `${CLD}/video/upload/v1794386172/WhatsApp_Video_2026-11-10_at_17.26.39_nwmrbb.mp4`, poster: NAVIN },
        speaker: {
            name: "Navin Chander",
            photo: NAVIN,
            role: "12+ years of experience at Walmart",
            calRole: "Ex-Walmart, 12+ years",
            linkedin: "https://www.linkedin.com/in/nchander/",
        },
    },
    {
        id: "danny-warshay",
        carousel: true,
        title: "Turn unsolved problems into entrepreneurial successes",
        teams: ["Innovation", "Leadership & Founders"],
        days: ["2027-01-08", "2027-01-09"],
        calTitle: "Brown University",
        calSubtitle: "Prof. Danny Warshay",
        description:
            "See, Solve, Scale\nDanny Warshay is a Professor and Executive Director of the Nelson Center for Entrepreneurship at Brown University. He leads creative and thought-provoking workshops on entrepreneurship around the world.",
        popupDescription:
            "Danny Warshay is a Professor and Executive Director of the Nelson Center for Entrepreneurship at Brown University. He leads creative and thought-provoking workshops on entrepreneurship around the world. He began his entrepreneurial pursuits while an undergraduate at Brown as a member of the startup leadership team of Clearview Software, which was acquired by Apple. Since then, he has co-founded and sold companies in fields ranging from software and advanced materials to consumer products and media. His course at Brown, The Entrepreneurial Process, has been recognized as the highest-rated course on campus.\n\nBased on this course, Danny has written the award-winning book SEE SOLVE SCALE: How Anyone Can Turn an Unsolved Problem into a Breakthrough Success. Danny received an A.B. in History, magna cum laude, from Brown University and an M.B.A. from Harvard Business School, and he is a Fellow of the Royal Society of Arts. In addition to spending time with his wife and three children, Danny loves the mental and physical challenges and rewards of vinyasa yoga. He is also an avid (and tortured) Cleveland sports fan. Learn more about Danny Warshay on his website: DannyWarshay.com.\n\nI invite all of my workshop participants to join the LinkedIn Warshay Innovation Network. The private advising would be on the need, case by case time commitments.",
        sessions: [
            { date: "8th January", label: "Teams" },
            { date: "9th January", label: BOARD },
        ],
        location: LOCATION,
        media: { type: "video", src: `${CLD}/video/upload/v1794488595/danny_india_reel_lppo9j.mp4`, poster: DANNY },
        speaker: {
            name: "Danny Warshay",
            photo: DANNY,
            role: "Brown University*",
            linkedin: "https://www.linkedin.com/in/danny-warshay-870139/",
            tagline: "Turn unsolved problems into entrepreneurial successes",
        },
        popupTitle: "Brown University",
    },
]