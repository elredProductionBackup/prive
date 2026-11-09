// Governing Charter (/governing-charter). Edit text here; numbering is shown as written.
// p(text, lead?) = paragraph, list(li(...), …) = lettered list, li(marker, text, lead?) = list item.
// A `lead` is shown in bold before the text, e.g. "Unethical Conduct:".

export type CharterBlock =
    | { type: "p"; text: string; lead?: string }
    | { type: "list"; items: { m: string; text: string; lead?: string }[] }
export type CharterSub = { num: string; head?: string; body: CharterBlock[] }
export type CharterSection = { id: string; num: string; title: string; intro?: string; subs: CharterSub[] }

const p = (text: string, lead?: string): CharterBlock => ({ type: "p", text, lead })
const list = (...items: { m: string; text: string; lead?: string }[]): CharterBlock => ({ type: "list", items })
const li = (m: string, text: string, lead?: string) => ({ m, text, lead })

export const CHARTER_META = {
    title: "Governing Charter",
    effectiveDate: "Effective 1 July 2026",
    jurisdiction: "Governed by the laws of India",
    contactEmail: "info@theprive.network",
}

export const CHARTER: CharterSection[] = [
    {
        id: "preamble",
        num: "01",
        title: "Preamble",
        subs: [
            { num: "1.1", body: [p(`This Governing Charter ("Charter") establishes the foundational principles, governance framework, membership standards, and operational policies of The Privé Network ("Privé" or the "Privé Network"), an invitation-only community of leaders committed to building ecosystems of global relevance through collaborative scale, conviction, and forward motion.`)] },
            { num: "1.2", body: [p(`The Privé Network is established with the vision of bringing top academic and business minds together to solve problems, generate ideas, and collaborate with intent, creating structured frameworks where insights turn into action and collective intelligence drives better decisions.`)] },
        ],
    },
    {
        id: "operating-philosophy",
        num: "02",
        title: "Operating Philosophy",
        subs: [
            { num: "2.1", head: "Ecosystem over Individualism", body: [p(`Global relevance is not achieved through isolated brilliance. It comes from building interconnected systems: talent, capital, supply chains, technology, and influence that reinforce each other. Every Member contributes to this architecture. The culture rewards collaborative scale, not personal wins.`)] },
            { num: "2.2", head: "Conviction in Scale", body: [p(`Scale determines seriousness. The Network operates on the belief that ambition is only credible when it can compound across markets, sectors, and borders. Ideas are interrogated not for novelty but for capacity to scale, sustain, and dominate.`)] },
            { num: "2.3", head: "Restless Forward Motion", body: [p(`A shared temperament: impatient with stagnation, allergic to incrementalism. Conversations are anchored in where the world is going, not where it has been. Curiosity, speed, and execution are cultural currencies.`)] },
        ],
    },
    {
        id: "purpose-identity",
        num: "03",
        title: "Purpose & Identity",
        subs: [
            {
                num: "3.1",
                head: "Purpose",
                body: [
                    p(`The purpose of The Privé Network is to:`),
                    list(
                        li("(a)", `Create a curated peer-learning ecosystem where leaders build, grow, and take their ideas further;`),
                        li("(b)", `Bring together top academic and business minds to solve problems, generate ideas, and collaborate with intent;`),
                        li("(c)", `Create structured frameworks where insights turn into action and collective intelligence drives better decisions;`),
                        li("(d)", `Redefine how networks engage, learn, collaborate, and grow — using clarity, technology, and intent to deliver outcomes.`)
                    ),
                ],
            },
            { num: "3.2", head: "The Ethos of Privé", body: [p(`Curated peer learning and collaboration, focused on solving problems using the best learnings.`)] },
            { num: "3.3", head: "Collaboration Within the Ecosystem", body: [p(`Unlike traditional peer networks that restrict business dealings between members, The Privé Network is intentionally designed as a platform for collaboration, partnership, and co-creation. Members are encouraged to identify synergies, explore joint ventures, co-invest, and build together. The ecosystem exists to compound ambition, not to insulate members from one another. The only requirement is that all engagement be conducted with integrity, transparency, and mutual respect, and in full compliance with applicable local laws and regulations.`)] },
            {
                num: "3.4",
                head: "What Privé Is Not",
                body: [list(li("(a)", `Privé is not just another networking organisation.`), li("(b)", `Privé is not executive education. Anyone can organise executive education; it is the peer group that matters.`))],
            },
        ],
    },
    {
        id: "guiding-principles",
        num: "04",
        title: "Guiding Principles",
        intro: `The following principles anchor how The Privé Network operates and how its members engage with one another:`,
        subs: [
            {
                num: "4.1",
                head: "Legacy and Continuity",
                body: [
                    list(
                        li("(a)", `The Privé Network encourages Members to participate alongside their family boards, successors, and next-generation leaders wherever appropriate.`),
                        li("(b)", `This multi-generational participation is intended to foster continuity of leadership, preserve institutional knowledge, and promote alignment of long-term vision, values, and stewardship across current and future decision-makers.`),
                        li("(c)", `Members acknowledge that sustainable enterprises are strengthened when learning, strategic thinking, and succession planning occur collectively rather than in isolation.`)
                    ),
                ],
            },
            {
                num: "4.2",
                head: "Organisational Transformation",
                body: [
                    list(
                        li("(a)", `The Privé Network is designed to create measurable impact within Member organisations, recognising that lasting change occurs when those responsible for execution participate directly in the learning process.`),
                        li("(b)", `Accordingly, Members may extend participation in designated problem-solving workshops, masterclasses, and educational programmes to members of their leadership teams and other employees, subject to programme eligibility determined by The Privé Network.`),
                        li("(c)", `By enabling founders, executives, and operating teams to learn together, The Privé Network seeks to accelerate organisational capability, improve decision-making, and facilitate the effective implementation of ideas within Member organisations.`)
                    ),
                ],
            },
            {
                num: "4.3",
                head: "Peer-Led Excellence",
                body: [
                    list(
                        li("(a)", `Every Member enters the room as an equal, regardless of scale, sector, or stage, and engages with generosity and goodwill.`),
                        li("(b)", `We lead with intellectual honesty and personal integrity in every interaction.`),
                        li("(c)", `We recognise that each Member brings a complete identity, professional, intellectual, personal, and familial, and we invest in the whole person.`)
                    ),
                ],
            },
            {
                num: "4.4",
                head: "Compounding Insight",
                body: [
                    list(
                        li("(a)", `We pursue relentless growth through first-principles thinking and structured learning.`),
                        li("(b)", `We deliberately seek out contrarian viewpoints and unfamiliar disciplines through a membership that spans industries, geographies, and backgrounds.`),
                        li("(c)", `We measure success by the tangible impact we generate in the ecosystems we build and serve.`)
                    ),
                ],
            },
            {
                num: "4.5",
                head: "Trust and Confidential Engagement",
                body: [
                    list(
                        li("(a)", `Confidentiality is fundamental to participation. Unless expressly agreed otherwise, what is shared within The Privé Network remains confidential.`),
                        li("(b)", `Members engage with authenticity, openness, and respect, creating an environment where ideas, challenges, and experiences may be shared candidly and constructively.`),
                        li("(c)", `Members prioritise substance over status, respect differing viewpoints, and contribute to an environment built on trust, discretion, and meaningful relationships.`)
                    ),
                ],
            },
            {
                num: "4.6",
                head: "We Collaborate and Build Together",
                body: [
                    list(
                        li("(a)", `Unlike traditional peer networks that restrict business dealings between members, The Privé Network is intentionally designed as a platform for collaboration, partnership, and co-creation.`),
                        li("(b)", `Members are encouraged to identify synergies, explore joint ventures, co-invest, and build together. The ecosystem exists to compound ambition, not to insulate members from one another.`),
                        li("(c)", `All engagement must be conducted with integrity, transparency, and mutual respect. We respect when a Member declines an opportunity and do not apply undue pressure.`)
                    ),
                ],
            },
            { num: "4.7", head: "One Unified Network", body: [p(`We will have no chapters or cliques — one unified network and ecosystem, built on shared access and cross-learning.`)] },
        ],
    },
    {
        id: "core-values",
        num: "05",
        title: "Core Values",
        intro: `The following Core Values define the standards of behaviour expected of every Member across all Privé interactions. They are the cultural foundation upon which the ecosystem is built.`,
        subs: [
            {
                num: "5.1",
                head: "Open to Share",
                body: [
                    list(
                        li("(a)", `We approach every Privé interaction with a spirit of contribution, sharing knowledge, experience, and networks without keeping score.`),
                        li("(b)", `The ecosystem rewards those who invest in it. Every Member is expected to contribute actively, whether through ideas, introductions, or time, as part of their commitment to the Privé Network.`),
                        li("(c)", `When the community convenes, collective progress takes precedence over individual agendas.`)
                    ),
                ],
            },
            {
                num: "5.2",
                head: "Respect",
                body: [
                    list(
                        li("(a)", `We act with integrity in our personal and professional life at all times and avoid behaviour that harms the reputation of other Members or of Privé, which includes abiding by applicable laws as a minimum threshold.`),
                        li("(b)", `We treat one another with the highest respect and attention.`),
                        li("(c)", `We hold our ethical standards above those outside our community, valuing relationships over any transaction. We proactively address disagreements in a respectful exchange, including accepting decisions with which we may disagree.`),
                        li("(d)", `We encourage open contact between Members for learning and collaboration, but we do not solicit other Members unless clearly invited to do so. We use extra caution when using a Member's contact and personal information, and always respect when a Member says no.`)
                    ),
                ],
            },
            {
                num: "5.3",
                head: "Inclusivity",
                body: [
                    list(
                        li("(a)", `We interact as equal peers and do not tolerate discrimination in any form.`),
                        li("(b)", `We embrace diversity of thought as a key foundation of Privé and seek a diverse membership base across cultures, industries, backgrounds, and perspectives.`),
                        li("(c)", `We approach controversial topics with equanimity, are open to multiple perspectives, and engage in a positive learning environment, even if those perspectives differ from our own.`),
                        li("(d)", `We respect our differences and do not tolerate harassment in any form. We foster an environment of belonging that is positive, safe, empathetic, and inclusive.`)
                    ),
                ],
            },
            {
                num: "5.4",
                head: "Authenticity",
                body: [
                    list(
                        li("(a)", `We show up as our authentic selves and give others space to be vulnerable and open. Every authentic interaction encourages others to act similarly.`),
                        li("(b)", `We listen humbly and seek to understand the other's experiences and perspectives without judgement.`),
                        li("(c)", `We abide by absolute confidentiality in all closed-door sessions. Member information must be treated as confidential at all times; we do not provide Member contact information or personal information to a non-member for any reason.`),
                        li("(d)", `We disclose known potential conflicts of interest in our interactions and always lean towards more disclosure, not intentionally omitting important facts to deceive others or putting our interests above those of the Privé Network.`)
                    ),
                ],
            },
        ],
    },
    {
        id: "membership",
        num: "06",
        title: "Membership",
        subs: [
            {
                num: "6.1",
                head: "Selection",
                body: [
                    list(
                        li("(a)", `The Privé Network admits a selected number of individuals each year based on signal, trajectory, and contribution to the room.`),
                        li("(b)", `There is no automatic renewal of membership year on year. This ensures only those who participate and contribute are part of the ecosystem.`),
                        li("(c)", `Membership is by invitation or application, subject to review and approval by the Advisory Council.`)
                    ),
                ],
            },
            {
                num: "6.2",
                head: "Eligibility Criteria",
                body: [
                    p(`Membership in The Privé Network is open to individuals who demonstrate:`),
                    list(
                        li("(a)", `Leadership of a business or enterprise of significance;`),
                        li("(b)", `A demonstrable track record of building, scaling, or investing at a meaningful level;`),
                        li("(c)", `Intellectual curiosity, generosity of spirit, and a commitment to first-principles thinking;`),
                        li("(d)", `Alignment with the Operating Philosophy and Core Values of the Privé Network.`)
                    ),
                    p(`It is noted that individuals meeting the aforesaid categories are not guaranteed membership as the selection remains a discretionary practice.`),
                ],
            },
            { num: "6.3", head: "Wider Perspective Members", body: [p(`Beyond its core circle, Privé may include a limited number of individuals of exceptional merit, from science, medicine, sport, and beyond, distinguished by their work, thinking, and lived experience, each carefully selected to bring uncommon depth to the room.`)] },
            {
                num: "6.4",
                head: "Next-Generation Access",
                body: [
                    p(`The Privé Network is intentionally designed to enable Members and their next generation to learn, engage, and build together. Accordingly, a Member's young adult children who are actively involved in the Member's family enterprise or business may participate in Privé Network events, programmes, workshops, and other Member benefits on the same basis.`),
                    p(`While participating in any Privé Network activity, such participants shall enjoy equal access to the applicable programmes and experiences and shall be bound by the same standards of conduct, confidentiality, and community obligations set out in this Charter.`),
                ],
            },
            { num: "6.5", head: "C-Suite & Management Access", body: [p(`Members may extend paid access to their C-Suite and other professionals for designated sessions, subject to the annual cap determined by the Privé Network from time to time. C-Suite attendees shall be bound by the same standards of conduct as Members during their participation.`)] },
            { num: "6.6", head: "Annual Affirmation", body: [p(`Every Member must affirm each year that they understand and commit to this Charter, the Community Standards, and the Core Values of The Privé Network.`)] },
            {
                num: "6.7",
                head: "Membership Fees",
                body: [
                    list(
                        li("(a)", `Members shall pay such annual membership fees as may be determined by the Advisory Council from time to time.`),
                        li("(b)", `Membership fees are exclusive of airfare, local transfers, and hotel accommodation, which shall be borne by the Member.`),
                        li("(c)", `Failure to pay fees by the stipulated date may result in suspension or termination of membership.`)
                    ),
                ],
            },
            {
                num: "6.8",
                head: "Member Obligations",
                body: [
                    p(`Each Member shall:`),
                    list(
                        li("(a)", `Participate actively in the programmes and sessions of the Privé Network;`),
                        li("(b)", `Contribute meaningfully to discussions and peer-learning activities;`),
                        li("(c)", `Uphold the confidentiality, reputation, and standards of the Privé Network;`),
                        li("(d)", `Comply with this Charter and all policies of the Privé Network.`)
                    ),
                ],
            },
        ],
    },
    {
        id: "governance",
        num: "07",
        title: "Governance",
        subs: [
            {
                num: "7.1",
                head: "The Advisory Council",
                body: [
                    list(
                        li("(a)", `Saurabh Goswamy (the "Founder") shall serve as the Founder and Chairman of The Privé Network and shall head the Advisory Council.`),
                        li("(b)", `The Advisory Council shall set the vision, direction, and strategic priorities of the Privé Network.`)
                    ),
                ],
            },
            {
                num: "7.2",
                head: "Composition of the Advisory Council",
                body: [
                    list(
                        li("(a)", `The Advisory Council shall be the primary governing body of the Privé Network, responsible for all strategic, policy, and operational oversight of the organisation. It shall consist of such a number of distinguished individuals, in consultation with existing members of the Advisory Council, deems appropriate.`),
                        li("(b)", `The Advisory Council shall determine matters of membership selection, programme design, partnerships, community standards, and such other matters as fall within the scope of this Charter.`),
                        li("(c)", `All members of the Advisory Council shall participate in deliberations on an equal footing, subject to the Founder's casting vote as provided in Section 7.3(b).`),
                        li("(d)", `The appointment of any new member to the Advisory Council shall require the guidance of existing members of the Advisory Council, in addition to the endorsement of the Founder as head of the Advisory Council.`),
                        li("(e)", `The Advisory Council shall serve as the designated body responsible for the review and adjudication of Member conduct violations reported under Section 8 of this Charter. The Advisory Council may investigate complaints, determine whether a breach has occurred, and impose such sanctions as it considers appropriate in accordance with Section 8.3.`)
                    ),
                ],
            },
            {
                num: "7.3",
                head: "Decision-Making",
                body: [
                    list(
                        li("(a)", `Strategic and policy decisions relating to the Privé Network, including matters of membership, programme direction, partnerships, and community standards, shall be determined by the Advisory Council by simple majority vote of its members present and voting. The Founder shall chair all such deliberations.`),
                        li("(b)", `In the event of a tie vote on any matter before the Advisory Council, the Founder shall hold a casting vote to determine the outcome.`),
                        li("(c)", `Day-to-day operational matters shall be managed by such a management team as the Advisory Council, on the recommendation of the Founder, may appoint.`)
                    ),
                ],
            },
        ],
    },
    {
        id: "code-of-conduct",
        num: "08",
        title: "Code of Conduct & Enforcement",
        subs: [
            { num: "8.1", head: "Application", body: [p(`This Code of Conduct applies to every Member and all those who interact in the Privé community, including C-Suite attendees, young adult children, and guests. Members are responsible for the conduct of their guests.`)] },
            {
                num: "8.2",
                head: "Potential Violations",
                body: [
                    p(`The following conduct is incompatible with membership in The Privé Network. This list is illustrative and not exhaustive; the Privé Network reserves the right to address conduct that undermines its values even where not expressly enumerated below:`),
                    list(
                        li("(a)", `A Member shall be considered to have acted unethically where the Member: (i) faces formal criminal charges for a serious offence in any jurisdiction; (ii) has engaged in fraud, dishonesty, deceit, or conduct involving moral turpitude; (iii) has been involved in public disrepute or scandal that brings the Privé Network or its Members into disrepute; or (iv) has provided materially false or misleading information in connection with their membership.`, "Unethical Conduct:"),
                        li("(b)", `A Member shall be in breach of these standards where the Member excludes, marginalises, or restricts another Member's participation on the basis of race, ethnicity, nationality, religion, culture, gender, sexual orientation, age, disability, political belief, industry, or any other protected characteristic.`, "Discrimination:"),
                        li("(c)", `A Member shall be in breach of these standards where the Member engages in unwelcome, threatening, violent, or degrading behaviour toward any person within the Privé community. This includes, without limitation: unwanted sexual advances or contact; sexually inappropriate remarks or conduct; racial, ethnic, or other discriminatory slurs; intimidation or threats; persistent unwanted communications; and conduct that systematically undermines another Member.`, "Harassment:"),
                        li("(d)", `The Privé Network is designed to foster collaboration, and Members are encouraged to explore mutual opportunities in good faith. However, a Member shall be in breach of these standards where the Member uses another Member's contact details or personal information, without that Member's explicit consent, for any of the following purposes: (i) unsolicited marketing or selling of products or services; (ii) facilitating business introductions that have not been invited or welcomed; (iii) promoting political, charitable, or advocacy causes; (iv) recruiting or soliciting investment or employment opportunities without prior invitation; (v) seeking preferential deals, discounts, or access; or (vi) promoting external events or platforms without Privé Network approval. For the avoidance of doubt, genuine collaborative engagement between Members, such as exploring joint ventures, co-investment, or partnership opportunities, is not a violation of this provision, provided it is conducted with transparency and mutual consent.`, "Improper Solicitation:"),
                        li("(e)", `A Member shall be in breach of these standards where the Member, without express prior authorisation: (i) discloses or references information shared during any closed-door Privé session; (ii) shares, forwards, or otherwise disseminates Member information to persons outside the Privé Network; or (iii) uses another Member's name, likeness, or personal information in any external communication, publicity, or social media without that Member's written consent.`, "Breach of Confidentiality:"),
                        li("(f)", `A Member shall be in breach of these standards where the Member: (i) prioritises personal gain over the interests of the Privé Network in any Privé context; (ii) accepts gifts, hospitality, or remuneration that could reasonably be perceived as influencing their conduct within the community; (iii) promotes or contracts services in which the Member holds a direct or indirect interest without prior transparent disclosure; or (iv) fails to declare competing interests openly and in good faith.`, "Conflict of Interest:"),
                        li("(g)", `A Member shall be in breach of these standards where the Member misrepresents their professional status, qualifications, business performance, or other material facts, whether by affirmative misstatement or by failing to correct a known inaccuracy, thereby undermining the foundation of trust upon which the Privé Network depends.`, "Misrepresentation:")
                    ),
                ],
            },
            {
                num: "8.3",
                head: "Enforcement",
                body: [
                    list(
                        li("(a)", `Enforcement of this Charter is conducted by the Advisory Council, acting as the conduct review body of the Privé Network.`),
                        li("(b)", `The severity of any consequence shall be proportionate to the nature and circumstances of the violation. Sanctions may include formal warning, temporary suspension, or permanent expulsion from the Privé Network. Where a Member has previously been subject to disciplinary action, subsequent violations will be treated with progressively less leniency.`),
                        li("(c)", `The Advisory Council retains broad discretion in conduct matters and is not confined to the categories enumerated in this Charter. Decisions may be made on a case-by-case basis, guided by the overarching interests and reputation of the Privé Network.`)
                    ),
                ],
            },
            {
                num: "8.4",
                head: "Reporting Violations",
                body: [
                    list(
                        li("(a)", `Every Member bears a responsibility to uphold these standards and to raise concerns where they witness conduct that falls short of them.`),
                        li("(b)", `All reports of potential violations shall be treated with strict confidentiality throughout any review process.`),
                        li("(c)", `Violations may be reported to the Founder, as head of the Advisory Council, or to any other member of the Advisory Council via such channels as may be designated from time to time.`)
                    ),
                ],
            },
        ],
    },
    {
        id: "organisational-neutrality",
        num: "09",
        title: "Organisational Neutrality",
        subs: [
            {
                num: "9.1",
                head: "Organisational Neutrality",
                body: [
                    list(
                        li("(a)", `The Privé Network does not issue public statements, endorse candidates, or adopt institutional positions on matters of legislation, government policy, or social, political, or geopolitical affairs.`),
                        li("(b)", `This stance reflects a deliberate design choice: the Network's value lies in convening leaders of sharply different perspectives. Institutional neutrality preserves the intellectual independence of Members and the integrity of the space in which they engage.`)
                    ),
                ],
            },
            {
                num: "9.2",
                head: "Members' Individual Freedom",
                body: [
                    list(
                        li("(a)", `Individual Members retain full freedom to express personal views and to participate in political, charitable, or social action in their own capacities, provided they do not purport to represent the Privé Network or act in contravention of these Community Standards.`),
                        li("(b)", `The line between Privé as a platform for discourse and Privé as an advocate of positions is fundamental to the Network's identity and must be maintained at all times.`)
                    ),
                ],
            },
            {
                num: "9.3",
                head: "Learning Boundaries",
                body: [
                    list(
                        li("(a)", `Privé actively encourages exploration of complex, contested, and forward-looking issues. The critical distinction is between facilitating learning, insight, and legitimate collaboration (which the Privé Network supports) and engaging in advocacy, partisan promotion, or unsolicited commercial solicitation on behalf of a cause or venture (which is not permitted within Privé sessions). Members exploring genuine business collaboration with one another, consistent with Section 3.3 of this Charter, are not in breach of these boundaries.`),
                        li("(b)", `Sessions may feature speakers and discussions on provocative, charged, or divisive topics. The decision to host such content reflects the Network's commitment to intellectual rigour, it does not signify institutional endorsement of any position presented.`)
                    ),
                ],
            },
        ],
    },
    {
        id: "social-media",
        num: "10",
        title: "Social Media Policy",
        subs: [
            { num: "10.1", head: "Scope", body: [p(`This policy applies to content posted on external social media platforms (including LinkedIn, Instagram, X, YouTube, and others) by Members, their guests, and C-Suite attendees, in connection with The Privé Network.`)] },
            {
                num: "10.2",
                head: "Members Are Encouraged To:",
                body: [
                    list(
                        li("(a)", `Identify themselves as Privé Members in professional biographies, social media profiles, and public-facing platforms;`),
                        li("(b)", `Share thoughtful reflections on their Privé experience, provided they observe the confidentiality obligations set out in this Charter;`),
                        li("(c)", `Engage respectfully with Network-related content;`),
                        li("(d)", `Exercise awareness that all online content is attributable, permanent, and may carry consequences beyond the platform on which it appears.`)
                    ),
                ],
            },
            {
                num: "10.3",
                head: "Members Are Discouraged From:",
                body: [
                    list(
                        li("(a)", `Tagging, naming, or otherwise publicly identifying any Member without securing that Member's prior, express consent;`),
                        li("(b)", `Publicly disclosing financial, legal, or operationally sensitive internal Network matters;`),
                        li("(c)", `Leveraging the Privé brand for personal commercial gain, solicitation, or self-promotion;`),
                        li("(d)", `Associating the Privé name with content unrelated to the Network's mission, including partisan political or religious advocacy;`),
                        li("(e)", `Publishing or linking to content that is defamatory, indecent, or otherwise harmful to the Network's reputation.`)
                    ),
                ],
            },
            {
                num: "10.4",
                head: "General Guidelines",
                body: [
                    list(
                        li("(a)", `The confidentiality obligations in this Charter extend fully to online activity. There is no temporal limit on the duty of confidence, it applies indefinitely.`),
                        li("(c)", `Content posted online can have global reach. Members should consider whether material acceptable in one jurisdiction may cause offence or carry legal consequences in another.`),
                        li("(d)", `Do not purport to speak on behalf of The Privé Network unless specifically authorised by the Advisory Council.`)
                    ),
                ],
            },
            { num: "10.5", head: "Enforcement", body: [p(`Breach of this social media policy may trigger a conduct review under Section 8 of this Charter. Depending on the severity and frequency of the violation, consequences may range from a formal caution to suspension or termination of membership.`)] },
        ],
    },
    {
        id: "brand-ip",
        num: "11",
        title: "Brand & Intellectual Property Guidelines",
        subs: [
            { num: "11.1", head: "Protection of the Privé Brand", body: [p(`The Privé Network name, visual identity, and associated trademarks represent the collective reputation of the ecosystem. They embody the standards, selectivity, and ambition that define membership. Accordingly, the brand may only be deployed in furtherance of the Privé Network's mission and in a manner consistent with these guidelines.`)] },
            {
                num: "11.2",
                head: "Permitted Uses",
                body: [
                    list(
                        li("(a)", `Members may identify themselves publicly as Members of The Privé Network in professional contexts.`),
                        li("(b)", `Members may reference the Privé brand in connection with officially sanctioned Network programmes, events, and activities.`)
                    ),
                ],
            },
            {
                num: "11.3",
                head: "Uses Requiring Prior Approval",
                body: [
                    list(
                        li("(a)", `No Member may issue any public statement purporting to represent The Privé Network without the express prior authority of the Advisory Council.`),
                        li("(b)", `Where a group of Members collectively supports or promotes an activity, cause, or event, the Privé name and trademarks must not be used in connection with that activity unless prior written approval has been obtained from the Privé Network.`)
                    ),
                ],
            },
        ],
    },
    {
        id: "competition-antitrust",
        num: "12",
        title: "Competition & Antitrust Compliance",
        subs: [
            { num: "12.1", head: "Commitment", body: [p(`The Privé Network operates with a firm commitment to full compliance with all applicable competition and antitrust legislation in every jurisdiction in which its Members conduct business, recognising that the Privé Network operates, and intends to continue to expand, as a cross-border ecosystem. Nothing in this section constitutes legal advice; Members are encouraged to obtain independent legal counsel where necessary.`)] },
            {
                num: "12.2",
                head: "General Guidance",
                body: [
                    list(
                        li("(a)", `Members must exercise vigilance when discussing business matters with fellow Members, particularly where those Members operate in the same or adjacent industries.`),
                        li("(b)", `Information that is not in the public domain, including but not limited to pricing (past, present, or future), bidding strategies, discount structures, terms of trade, customer or supplier selection, territorial allocation, and production volumes, must not be exchanged between Members.`),
                        li("(c)", `Engagement in bribery of any form is strictly prohibited and is grounds for immediate expulsion.`)
                    ),
                ],
            },
            {
                num: "12.3",
                head: "Members in the Same Industry",
                body: [
                    p(`Members who are actual or potential competitors face heightened regulatory risk when interacting within the Privé Network. The following conduct is strictly prohibited and may constitute a criminal offence in many jurisdictions:`),
                    list(
                        li("(a)", `Using the Privé Network as a forum to signal, coordinate, or influence industry pricing;`),
                        li("(b)", `Entering into formal or informal arrangements to standardise commercial terms, restrict output, or harmonise business practices;`),
                        li("(c)", `Imposing resale price requirements or territorial restrictions on distributors or suppliers;`),
                        li("(d)", `Coordinated refusals to deal i.e. any arrangement between Members to collectively refuse to transact with a particular buyer, seller, or counterparty;`),
                        li("(e)", `Bid rigging, market division, or any allocation of customers, territories, or contracts between competing Members.`)
                    ),
                ],
            },
            {
                num: "12.4",
                head: "Communication Guidelines",
                body: [
                    p(`In all Network interactions, Members must refrain from the following:`),
                    list(
                        li("(a)", `Discussing or exchanging specific cost structures, pricing data, or the timing of price changes with competitors (noting that legitimate collaborative discussions between non-competing Members regarding joint ventures or co-investment opportunities are not prohibited by this provision);`),
                        li("(b)", `Disclosing competitively sensitive intelligence regarding customers, consumer segments, or market positioning that is not publicly available;`),
                        li("(c)", `Revealing non-public information about production capacity, output methods, or distribution arrangements;`),
                        li("(d)", `Coordinating with competitors on price, output, distribution channels, or territorial strategy;`),
                        li("(e)", `Sharing current operating data, forward-looking business plans, or strategic intentions;`),
                        li("(f)", `Discussing individual market shares, geographic coverage, or territorial ambitions with competitors;`),
                        li("(g)", `Revealing details of pending or prospective tenders, bids, or procurement processes;`),
                        li("(h)", `Permitting or ignoring potentially anti-competitive discussion, any Member who witnesses a potential breach must immediately request that the conversation cease and report the matter to the Privé Network.`)
                    ),
                ],
            },
            { num: "12.5", body: [p(`Members should note that anti-competitive arrangements need not be formalised in writing; tacit understandings, informal signals, and circumstantial coordination can each constitute a violation of applicable law. These guidelines govern all interactions occurring in any Privé context.`)] },
        ],
    },
    {
        id: "terms-waivers",
        num: "13",
        title: "Terms, Waivers & Policies",
        subs: [
            {
                num: "13.1",
                head: "Assumption of Risk & Liability Waiver",
                body: [
                    p(`By registering for and attending any programme, gathering, or activity organised by The Privé Network (each an "Event"), each attendee acknowledges and agrees as follows:`),
                    list(
                        li("(a)", `The attendee voluntarily accepts all risks inherent in participation, including those arising from travel, venue conditions, and interaction with other attendees;`),
                        li("(b)", `The attendee releases and holds harmless The Privé Network, its Founder, management team, affiliates, sponsors, and fellow Members from all liability for injury, loss, or damage sustained in connection with the Event, howsoever caused;`),
                        li("(c)", `The attendee agrees to indemnify the Privé Network and its representatives against any claims, demands, or proceedings brought by third parties arising from or connected with the attendee's participation.`)
                    ),
                ],
            },
            {
                num: "13.2",
                head: "Disclaimer",
                body: [
                    list(
                        li("(a)", `Any information, insight, analysis, or opinion presented at an Event by speakers, educators, investors, or other contributors represents the views and responsibility of that individual alone. The Privé Network does not curate, verify, or endorse such content.`),
                        li("(b)", `The Network makes no representation or warranty regarding the accuracy, completeness, or commercial viability of any information, investment opportunity, or business proposition discussed at any Event.`),
                        li("(c)", `Members are expected to exercise their own independent judgement and to seek professional advice before acting on any information or opportunity encountered through the Privé Network.`)
                    ),
                ],
            },
            { num: "13.3", head: "Programme Changes", body: [p(`All elements of any Event, including schedule, activities, venues, and speakers, are subject to modification at the Network's discretion. The Network will use reasonable endeavours to notify attendees of material changes in advance.`)] },
            { num: "13.4", head: "Health & Safety", body: [p(`Attendees are responsible for complying with all applicable health and safety requirements at Event venues. Participation in any Event activity is undertaken at the attendee's own risk.`)] },
            {
                num: "13.5",
                head: "Cancellation Policy",
                body: [
                    list(
                        li("(a)", `In the event that The Privé Network cancels an Event, registration fees shall be refunded in accordance with a refund schedule to be determined and published by the Advisory Council for each Event. The Privé Network does not guarantee a full refund in all circumstances of Network-initiated cancellation.`),
                        li("(b)", `The Network is not responsible for refunding airfare, accommodation, or other incidental expenses in any circumstances. Members are advised to purchase travel/trip cancellation insurance.`),
                        li("(c)", `Cancellation by a Member shall be subject to such cancellation schedules, administrative fees, and refund amounts as may be published by the Privé Network for each Event.`),
                        li("(e)", `Members cannot transfer their registration to another Member in good standing, unless confirmed in writing by the Privé Network management team and any applicable transfer fee.`)
                    ),
                ],
            },
            { num: "13.6", head: "Force Majeure", body: [p(`The Privé Network shall bear no liability for the cancellation, postponement, or curtailment of any Event where such failure is attributable to circumstances beyond the Network's reasonable control, including without limitation: natural disasters, armed conflict, civil unrest, industrial action, government restrictions, pandemics, or public health emergencies.`)] },
            { num: "13.7", head: "Exclusions", body: [p(`Membership fees and event registration fees are exclusive of airfare, local transfers, and hotel accommodation, which shall be borne by the attendee.`)] },
        ],
    },
    {
        id: "confidentiality",
        num: "14",
        title: "Confidentiality",
        subs: [
            {
                num: "14.1",
                head: "Absolute Confidentiality",
                body: [
                    list(
                        li("(a)", `All discussions, information, ideas, and materials shared within any Privé session, including but not limited to workshops, immersive programmes, closed-door discussions, and field visits, are strictly confidential.`),
                        li("(b)", `No information shared in a Privé session may be disclosed outside the session without the express consent of the Member who shared it.`)
                    ),
                ],
            },
            {
                num: "14.2",
                head: "Member Information",
                body: [
                    list(
                        li("(a)", `All Member contact information, personal details, and professional information shared within the Privé Network is confidential and must not be disseminated to non-members.`),
                        li("(b)", `Members must not use another Member's name, image, or information in any publicity release or on social media without prior written consent.`)
                    ),
                ],
            },
            { num: "14.3", head: "Duration", body: [p(`Confidentiality obligations survive the termination or expiry of membership and have no statute of limitations.`)] },
        ],
    },
    {
        id: "amendments",
        num: "15",
        title: "Amendments",
        subs: [
            { num: "15.1", body: [p(`This Charter may be amended, modified, or supplemented at any time by the Advisory Council, on the recommendation of the Founder.`)] },
            { num: "15.2", body: [p(`Amendments shall be communicated to all Members and shall take effect on the date specified in the notice of amendment.`)] },
            { num: "15.3", body: [p(`This Charter shall be reviewed periodically by the Advisory Council to ensure it remains current and fit for purpose.`)] },
        ],
    },
    {
        id: "miscellaneous",
        num: "16",
        title: "Miscellaneous",
        subs: [
            { num: "16.1", head: "Limitation of Liability", body: [p(`To the fullest extent permitted by applicable law, The Privé Network shall not be liable for any indirect, consequential, incidental, or special damages, including but not limited to loss of profits, loss of revenue, or loss of use, arising out of or in connection with membership or participation in any Event, regardless of the cause of action or the theory of liability (whether in contract, tort, statute, equity, or otherwise).`)] },
            { num: "16.2", head: "No Agency", body: [p(`Membership in The Privé Network does not create an agency, partnership, joint venture, or employment relationship between the Member and the Privé Network. No Member is authorised to act as an agent of or bind the Privé Network.`)] },
            { num: "16.3", head: "Governing Law", body: [p(`This Charter shall be governed by and construed in accordance with the laws of India.`)] },
            { num: "16.4", head: "Dispute Resolution", body: [p(`Any dispute arising out of or in connection with this Charter or membership in the Privé Network shall be resolved by arbitration seated in Mumbai, India, in accordance with the Arbitration and Conciliation Act, 1996 (as amended). The arbitral tribunal shall consist of a sole arbitrator appointed by mutual consent of the parties, failing which by the Advisory Council.`)] },
            { num: "16.5", head: "Severability", body: [p(`If any provision of this Charter is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`)] },
            { num: "16.6", head: "Entire Agreement", body: [p(`This Charter, together with any policies and guidelines issued from time to time, constitutes the entire agreement between the Privé Network and its Members regarding the subject matter hereof.`)] },
            { num: "16.7", head: "Effective Date", body: [p(`This Charter shall come into effect on 1 July 2026 and shall remain in force until amended or superseded.`)] },
        ],
    },
]
