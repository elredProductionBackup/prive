import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// /sitemap.xml: the list of pages for Google to visit
export default function sitemap(): MetadataRoute.Sitemap {
    const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
        { path: "/", priority: 1, changeFrequency: "weekly" }, // sessions change often
        { path: "/about", priority: 0.8, changeFrequency: "monthly" },
        { path: "/work/huddle", priority: 0.7, changeFrequency: "monthly" },
        { path: "/work/wider-perspective", priority: 0.7, changeFrequency: "monthly" },
        { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
        { path: "/governing-charter", priority: 0.5, changeFrequency: "yearly" },
    ]
    const now = new Date()
    return pages.map((p) => ({ url: `${SITE_URL}${p.path === "/" ? "" : p.path}`, lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority }))
}
