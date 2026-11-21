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
    { kind: "photo", name: "Oded Netzer", subtitle: "Columbia Business School", month: "JULY 2026", upcoming: false, image: `https://assets-pretest.elred.io/prive/website-images/prive-faculty-oded-netzer-columbia.jpg` },
    { kind: "photo", name: "Niro Sivanathan", subtitle: "London Business School", month: "SEPTEMBER 2026", upcoming: false, image: `https://assets-pretest.elred.io/prive/website-images/prive-faculty-niro-sivanathan-lbs.png` },
    { kind: "photo", name: "Jonathan Levav", subtitle: "Stanford Business School", month: "NOVEMBER 2026", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-faculty-jonathan-levav-stanford.jpg` },
    { kind: "photo", name: "Danny Warshay", subtitle: "Brown University", month: "JANUARY 2027", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-faculty-danny-warshay-brown.jpg` },
    { kind: "logo", name: "Speaker TBA", subtitle: "Georgetown University", month: "MARCH 2027", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-logo-georgetown-university.png` },
    { kind: "logo", name: "Speaker TBA", subtitle: "University of Virginia", month: "APRIL 2027", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-logo-university-of-virginia.png` },
    // Niro returns three times in 2027: one card, all three months on the stamp
    { kind: "photo", name: "Niro Sivanathan", subtitle: "London Business School", month: "APR · AUG · NOV 2027", sessions: 3, upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-faculty-niro-sivanathan-lbs.png` },
    { kind: "photo", name: "Amir Goldberg", subtitle: "Stanford Business School", month: "JULY 2027", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-faculty-amir-goldberg-stanford.png` },
]

export const LEADERS: Person[] = [
    { kind: "photo", name: "Sunder Ramachandran", subtitle: "Author | Executive Educator", month: "NOVEMBER 2026", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-expert-sunder-ramachandran.png` },
    // { kind: "photo", name: "Jitendra Kachhawa", subtitle: "18+ years McKinsey Supply chain expert", month: "NOVEMBER 2026", upcoming: true, image: `${CDN}/v1792401857/7d1485710daa3a1d634c05577c71b776c97e3e49_ueh50q.png` },
    { kind: "photo", name: "Navin Chander", subtitle: "12+ years of experience at Walmart", month: "DECEMBER 2026", upcoming: true, image: `https://assets-pretest.elred.io/prive/website-images/prive-expert-navin-chander.png` },
]

export const FUNCTIONS = [
    { title: "Grow the Business", items: ["Marketing & Brand", "Sales", "Strategy & Growth", "Technology", "Customer service"], icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-grow.png` },
    { title: "Run the Business", items: ["Operations", "Manufacturing", "Supply Chain", "Procurement", "Technology", "Governance", "Risk / Legal / Cybersecurity"], icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-run.png` },
    { title: "Fund the Business", items: ["Finance", "Capital", "M&A", "Working Capital"], icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-fund.png` },
    { title: "Build the Organisation", items: ["People", "HR", "Culture", "Leadership"], icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-build.png` },
]

export const TIERS = [
    { label: "Delegate", amount: "5 lacs", description: "One nominated representative from the company each time", icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-delegate.png` },
    { label: "Small Teams", amount: "10 lacs", description: "Two nominated representatives from the company each time", icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-small-teams.png` },
    { label: "Enterprise", amount: "15 lacs", description: "Up to four nominated representatives from across the enterprise may attend each Practice, allowing for greater flexibility across functions and teams", icon: `https://assets-pretest.elred.io/prive/website-images/prive-icon-enterprise.png` },
]
