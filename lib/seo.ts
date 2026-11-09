import type { Metadata } from "next"

// Set NEXT_PUBLIC_SITE_URL in production if the domain differs
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://theprive.network"
export const SITE_NAME = "Privé"
export const DEFAULT_DESCRIPTION = "A network designed to elevate good teams into great ones, with a single focus: to bring measurable change to your business."
export const DEFAULT_OG = "https://res.cloudinary.com/dtrv7p3gg/image/upload/v1794216554/Thumbnail_5_1_kugygt.png"

// Descriptive name so the brand isn't confused with the TV channel or luxury labels called Privé
export const HOME_TITLE = "Privé"

// Title, description, canonical URL, Open Graph and Twitter card for one page.
// `title` is the full title shown in Google and browser tabs (written out in full, no template).
export function pageMetadata({ title, description, path, image = DEFAULT_OG }: { title: string; description: string; path: string; image?: string }): Metadata {
    const fullTitle = title
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: "en_IN",
            url: path,
            title: fullTitle,
            description,
            images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
        },
        twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    }
}

export const ORG_LD = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "Privé",
            alternateName: ["The Privé Network", "Privé Network"],
            url: SITE_URL,
            logo: `${SITE_URL}/images/prive-logo.svg`,
            image: DEFAULT_OG,
            description: DEFAULT_DESCRIPTION,
            email: "info@theprive.network",
            address: {
                "@type": "PostalAddress",
                streetAddress: "16, Yashodham Center, Film City Road, Goregaon (E)",
                addressLocality: "Mumbai",
                postalCode: "400063",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
            },
            sameAs: ["https://www.youtube.com/channel/UCvyMrdA8sR1RaCo4IodTwtQ", "https://www.linkedin.com/company/priv%C3%A9-2026/"],
            parentOrganization: { "@type": "Organization", name: "Rextone Digital Pvt. Ltd.", url: "https://www.rextonedigital.com/" },
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Privé",
            publisher: { "@id": `${SITE_URL}/#organization` },
            inLanguage: "en-IN",
        },
    ],
}
