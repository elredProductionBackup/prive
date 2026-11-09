import type { Metadata } from "next"

import TopicPage from "@/components/pages/TopicPage"
import { pageMetadata } from "@/lib/seo"
import { HUDDLE_PAGE } from "@/content/pages"

export const metadata: Metadata = pageMetadata({
    title: "Huddle: Curated Peer Groups for Business Leaders | Privé",
    description: "Intentionally curated groups of up to 15 peers meeting under Chatham House principles: closed-door, issue-led dialogue, cross-industry learning and room to collaborate.",
    path: "/work/huddle",
    image: HUDDLE_PAGE.hero.image,
})

export default function HuddlePage() {
    return <TopicPage data={HUDDLE_PAGE} imageLabel="Huddle hero image" />
}
