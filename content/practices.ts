// "What" section on the homepage. **bold** works in the copy.

const CDN = "https://res.cloudinary.com/dtrv7p3gg/image/upload"

export type Person = {
    kind: "photo" | "logo" // logo = white university card with "Speaker TBA"
    name: string
    subtitle: string
    month: string // the stamp
    upcoming: boolean // maroon stamp when true, grey when past
    image: string
    sessions?: number // more than one visit: shows a "3 sessions" tag on the photo
}

export const COPY = {
    // "Why" section, top of the homepage. A line break inside a paragraph is "\n".
    why: [
        "Great enterprises are not built by exceptional individuals alone, but by teams that continuously learn, challenge themselves and grow together.",
        "The world’s best athletes have coaches. They practise relentlessly, even when they are already among the very best.",
    ],
    // "What" section, straight after Why
    what: [
        "Privé is an enterprise network designed to help **good teams become great ones**, bringing owners, leaders and teams together with the world’s best coaches.",
    ],
    signatureTitle: "12 Signature Practices a Year",
    signatureText: "One every month, led by some of the world’s foremost professors, thinkers, practitioners and operators.",
    beyondTitle: "And beyond the Signature Practices",
    beyondText: "Your enterprise also gets access to 24 additional full-day Core Practices a year—two each month, across four core functions.",
    daysLine: "36 days of transformational learning",
}

export const SPEAKERS: Person[] = [
    { kind: "photo", name: "Oded Netzer", subtitle: "Columbia Business School", month: "JULY 2026", upcoming: false, image: `${CDN}/v1792071101/oded_q1ccci.jpg` },
    { kind: "photo", name: "Niro Sivanathan", subtitle: "London Business School", month: "SEPTEMBER 2026", upcoming: false, image: `${CDN}/v1793594605/niro_qyec9q.png` },
    { kind: "photo", name: "Jonathan Levav", subtitle: "Stanford Business School", month: "NOVEMBER 2026", upcoming: true, image: `${CDN}/v1792401855/jonathan_pbrrun.jpg` },
    { kind: "photo", name: "Danny Warshay", subtitle: "Brown University", month: "JANUARY 2027", upcoming: true, image: `${CDN}/v1793085102/a05d599a1f99a63b30bc49c51d96f49c1326b83a_2_q8er7g.jpg` },
    { kind: "logo", name: "Speaker TBA", subtitle: "Georgetown University", month: "MARCH 2027", upcoming: true, image: `${CDN}/v1793698164/georgetown-uni_g6aeg7.png` },
    { kind: "logo", name: "Speaker TBA", subtitle: "University of Virginia", month: "APRIL 2027", upcoming: true, image: `${CDN}/v1793698163/uni-of-virginia_d170wn.png` },
    // Niro returns three times in 2027: one card, all three months on the stamp
    { kind: "photo", name: "Niro Sivanathan", subtitle: "London Business School", month: "APR · AUG · NOV 2027", sessions: 3, upcoming: true, image: `${CDN}/v1793594605/niro_qyec9q.png` },
    { kind: "photo", name: "Amir Goldberg", subtitle: "Stanford Business School", month: "JULY 2027", upcoming: true, image: `${CDN}/v1793698150/4ccc907216941de689cc532bb85e72c89a0b4a72_1_xgi6fn.png` },
]

export const LEADERS: Person[] = [
    { kind: "photo", name: "Sunder Ramachandran", subtitle: "Author | Executive Educator", month: "NOVEMBER 2026", upcoming: true, image: `${CDN}/v1793352435/463301abf06fbe65eedae48292208ac66fe0c1c5_vpz4n3_zv2xgk.png` },
    { kind: "photo", name: "Jitendra Kachhawa", subtitle: "18+ years McKinsey Supply chain expert", month: "NOVEMBER 2026", upcoming: true, image: `${CDN}/v1792401857/7d1485710daa3a1d634c05577c71b776c97e3e49_ueh50q.png` },
    { kind: "photo", name: "Navin Chander", subtitle: "12+ years of experience at Walmart", month: "DECEMBER 2026", upcoming: true, image: `${CDN}/v1792401858/dd3dcedf2628fafad7c69a64cbaabcb6742903ee_joei3r.png` },
]

export const FUNCTIONS = [
    { title: "Grow the Business", items: ["Marketing & Brand", "Sales", "Strategy & Growth", "Technology", "Customer service"], icon: `${CDN}/v1793616345/streamline_graph-arrow-increase_vk1zsr.png` },
    { title: "Run the Business", items: ["Operations", "Manufacturing", "Supply Chain", "Procurement", "Technology", "Governance", "Risk / Legal / Cybersecurity"], icon: `${CDN}/v1793616345/material-symbols-light_manufacturing_da72wb.png` },
    { title: "Fund the Business", items: ["Finance", "Capital", "M&A", "Working Capital"], icon: `${CDN}/v1793616345/hugeicons_money-bag-01_yv51mb.png` },
    { title: "Build the Organisation", items: ["People", "HR", "Culture", "Leadership"], icon: `${CDN}/v1793616345/fluent_people-audience-20-regular_rwpyrp.png` },
]

export const TIERS = [
    { label: "Delegate", amount: "5 lacs", description: "One nominated representative from the company each time", icon: `${CDN}/v1793616286/charm_person_n7ditp.png` },
    { label: "Small Teams", amount: "10 lacs", description: "Two nominated representatives from the company each time", icon: `${CDN}/v1793616286/charm_person_2_hkhmtl.png` },
    { label: "Enterprise", amount: "15 lacs", description: "Up to four nominated representatives from across the enterprise may attend each Practice, allowing for greater flexibility across functions and teams", icon: `${CDN}/v1793616286/formkit_people_otyikm.png` },
]
