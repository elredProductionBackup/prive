// Privacy Policy (/privacy-policy). Edit the text here; the page lays it out.
// A block is a paragraph (string) or a list ({ list: [...] }). A list item can start
// with a bold lead, e.g. { lead: "Contact details:", text: "…" }.
// The email address is turned into a link wherever it appears.

export type PrivacyItem = string | { lead: string; text: string }
export type PrivacyBlock = string | { list: PrivacyItem[] }
export type PrivacySection = { id: string; title: string; blocks: PrivacyBlock[] }

export const PRIVACY_META = {
    title: "Privacy Policy",
    summary: "What we collect when you visit our website, register for a programme or take part in the Privé Network, why, and the choices you have.",
    lastUpdated: "Last updated 17 November 2026",
    jurisdiction: "Governed by the laws of India",
    email: "info@theprive.network",
}

export const PRIVACY: PrivacySection[] = [
    {
        id: "introduction",
        title: "Introduction",
        blocks: [
            `This Privacy Policy explains how Privé (The Privé Network, "Privé", "we" or "us") collects, uses and protects personal information when you visit theprive.network, enquire about or register for a Privé programme, or take part in the Privé Network as a Member or attendee.`,
            `Privé is a network built on trust, and confidentiality is one of its foundations. This policy should be read together with our Governing Charter, which sets out the confidentiality standards that apply to Member information within the Network.`,
        ],
    },
    {
        id: "what-we-collect",
        title: "Information we collect",
        blocks: [
            {
                list: [
                    { lead: "Contact details:", text: "name, email address and phone number." },
                    { lead: "Professional details:", text: "company name, role or function, and anything you choose to tell us in the notes of an enquiry, a registration or a membership application." },
                    { lead: "Registration and event records:", text: "the programme and session you asked about or registered for, your registration and attendance, and any fees paid. Card and bank details are handled by our bank or payment provider, not by us." },
                    { lead: "Membership information:", text: "details shared in the course of membership, including information about your enterprise and the colleagues or family members you nominate to attend, as allowed under our Governing Charter." },
                    { lead: "Technical and campaign data:", text: "IP address, device and browser type, pages viewed, and how you reached our website, such as the ad or campaign link you clicked, collected through cookies and similar technologies." },
                    { lead: "Communications:", text: "messages you send us, including by email and WhatsApp, and our replies." },
                ],
            },
        ],
    },
    {
        id: "how-we-use",
        title: "How we use it",
        blocks: [
            {
                list: [
                    "To respond to your enquiries, and to manage registrations and attendance.",
                    "To administer membership in line with our Governing Charter.",
                    "To send you programme details, confirmations and updates about the sessions you have asked about.",
                    "To tell you about upcoming practices and speakers, where you have not opted out.",
                    "To understand how our website is used and which of our advertising brings people to it, and to improve both.",
                    "To prevent fraud and misuse, and to meet our legal, tax and accounting obligations.",
                ],
            },
        ],
    },
    {
        id: "cookies",
        title: "Cookies and analytics",
        blocks: [
            "We use cookies and similar technologies to run the website, remember preferences, and measure how it is used. These are managed through Google Tag Manager and include the Meta Pixel, which helps us understand visits and the performance of our advertising on Meta platforms such as Facebook and Instagram. They may also include other analytics tools, such as Google Analytics.",
            "When you submit an enquiry or registration form, these tools are told that a form was submitted, so we can see which campaigns lead to enquiries and registrations.",
            "You can block or delete cookies in your browser settings. Some parts of the website may not work as expected without them. You can also manage how Meta uses information for ads in your Facebook or Instagram ad settings.",
        ],
    },
    {
        id: "sharing",
        title: "Who we share it with",
        blocks: [
            "We don't sell your personal information. In keeping with our Governing Charter, Member contact details and personal information are treated as confidential and are not shared with non-members. We share information only as needed with:",
            {
                list: [
                    "Service providers who help us run Privé, such as website hosting, email, forms and spreadsheets, payment providers, event venues, and analytics and advertising providers, under appropriate confidentiality obligations.",
                    "Speakers and programme partners, limited to what they need to deliver a session, such as attendee names and companies.",
                    "Your organisation, where it nominated you or paid for your place, limited to your registration and attendance.",
                    "Authorities, where required by law or to protect our rights and the safety of others.",
                ],
            },
        ],
    },
    {
        id: "retention",
        title: "How long we keep it",
        blocks: [
            "We keep personal information only as long as needed for the purposes above, including to meet legal, tax and accounting requirements. Fee and invoice records are kept for the period required by Indian law.",
        ],
    },
    {
        id: "security",
        title: "Security",
        blocks: [
            "We use reasonable technical and organisational measures to protect your information. No method of transmission or storage is completely secure, so we can't guarantee absolute security.",
        ],
    },
    {
        id: "your-rights",
        title: "Your choices and rights",
        blocks: [
            "Subject to applicable law, including the Digital Personal Data Protection Act, 2023, you may ask to access, correct or delete your personal information, withdraw consent, or opt out of marketing messages at any time. Write to us using the details below and we'll respond within a reasonable time.",
        ],
    },
    {
        id: "changes",
        title: "Changes to this policy",
        blocks: [`We may update this policy from time to time. The latest version will always be on this page with its "last updated" date.`],
    },
    {
        id: "contact",
        title: "Contact and grievances",
        blocks: [
            "This policy is issued by Privé (The Privé Network), a network trademarked and operated by Rextone Digital Pvt. Ltd., 16, Yashodham Center, Film City Road, Goregaon (E), Mumbai 400063, Maharashtra, India.",
            "Questions, requests or grievances? Write to info@theprive.network.",
        ],
    },
]