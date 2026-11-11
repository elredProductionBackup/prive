import type { Metadata } from "next"

// Must match the final URL the site lands on (theprive.network redirects to www),
// otherwise og:url / canonical point at a redirect and WhatsApp drops the preview.
// If you set NEXT_PUBLIC_SITE_URL in production, it must also be https://www.theprive.network
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.theprive.network"
export const SITE_NAME = "Privé"
export const DEFAULT_DESCRIPTION = "A network designed to elevate good teams into great ones, with a single focus: to bring measurable change to your business."

// Served as JPG at exactly 1200x630 via Cloudinary (no transparency, small file, works on WhatsApp)
export const DEFAULT_OG = "https://res.cloudinary.com/dtrv7p3gg/image/upload/f_jpg,q_80,w_1200,h_630,c_fill/v1794399734/OG-Prive_zivi7s.png"

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
            images: [{ url: image, width: 1200, height: 630, alt: fullTitle, type: "image/jpeg" }],
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