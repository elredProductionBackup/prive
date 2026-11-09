import type { Metadata, Viewport } from "next"
import "@fontsource-variable/inter"
import "lenis/dist/lenis.css"
import "./globals.css"
import { mencken, menckenHead } from "./fonts"
import { DEFAULT_DESCRIPTION, HOME_TITLE, ORG_LD, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo"
import Header from "@/components/site/Header"
import HomeButton from "@/components/site/HomeButton"
import Modals from "@/components/site/Modals"
import SmoothScroll from "@/components/site/SmoothScroll"
import Reveal from "@/components/site/Reveal"

export const metadata: Metadata = {
    ...pageMetadata({ title: HOME_TITLE, description: DEFAULT_DESCRIPTION, path: "/" }),
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    applicationName: SITE_NAME,
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#1a1814",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${mencken.variable} ${menckenHead.variable}`} suppressHydrationWarning>
            <head>
                {/* Hide reveal elements only when JavaScript runs, so content is never lost without it */}
                <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('reveal-ready')" }} />
                {/* Tells Google who Privé is (organisation, address, profiles), so it isn't mixed up with other "Privé" brands */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="preconnect" href="https://framerusercontent.com" />
            </head>
            <body>
                <SmoothScroll />
                <Header />
                {children}
                <HomeButton />
                <Reveal />
                <Modals />
            </body>
        </html>
    )
}
