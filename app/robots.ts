import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// /robots.txt: lets search engines crawl everything and points them to the sitemap
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [{ userAgent: "*", allow: "/" }],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
