import type { Metadata } from "next"

import TopicPage from "@/components/pages/TopicPage"
import { pageMetadata } from "@/lib/seo"
import { WIDER_PERSPECTIVE } from "@/content/pages"

export const metadata: Metadata = pageMetadata({
    title: "Wider Perspective: Peer Learning Across Cities | Privé",
    description: "Unbound by geography: Privé members across cities, cultures and decision styles bring broader pattern recognition, sharper judgment and fewer blind spots.",
    path: "/work/wider-perspective",
    image: WIDER_PERSPECTIVE.hero.image,
})

export default function WiderPerspectivePage() {
    return <TopicPage data={WIDER_PERSPECTIVE} imageLabel="Wider Perspective hero image" />
}
