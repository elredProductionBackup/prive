import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/site/Footer"

export const metadata: Metadata = {
    title: "Page not found",
    description: "This page doesn’t exist. Head back to the Privé homepage.",
    robots: { index: false, follow: true },
    alternates: { canonical: null },
}

export default function NotFound() {
    return (
        <>
            <main className="nf">
                <div className="hero-overlay" aria-hidden />
                <div className="nf-inner">
                    <p className="nf-code" aria-hidden>404</p>
                    <h1 className="nf-title">This page doesn’t exist</h1>
                    <p className="nf-text">The link may be old, or the page may have moved. Everything Privé is on the homepage.</p>
                    <Link href="/" className="nf-btn">Back to home</Link>
                </div>
            </main>
            <Footer />
        </>
    )
}
