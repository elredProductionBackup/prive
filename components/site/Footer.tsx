import Image from "next/image"
import { FOOTER, LOGO } from "@/content/site"
import { NavLink } from "@/lib/site"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-links">
                    <ul className="footer-col">
                        {FOOTER.colA.map((i) => (
                            <li key={i.label}><NavLink item={i} className="footer-link" /></li>
                        ))}
                    </ul>
                    <ul className="footer-col">
                        {FOOTER.colB.map((i) => (
                            <li key={i.label}><NavLink item={i} className="footer-link" /></li>
                        ))}
                    </ul>
                </div>
                <ul className="footer-social">
                    {FOOTER.social.map((i) => (
                        <li key={i.label}>
                            <NavLink item={i}>
                                <span>{i.label}</span>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                                    <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="footer-bottom">
                <div className="footer-cell">
                    <span className="footer-label">Office</span>
                    <address>{FOOTER.office}</address>
                </div>
                <div className="footer-cell">
                    <p className="footer-network">
                        <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} unoptimized className="footer-logo" />{" "}
                        {FOOTER.network}{" "}
                        <a href={FOOTER.company.href} target="_blank" rel="noopener noreferrer">{FOOTER.company.label}</a> Pvt. Ltd.
                    </p>
                </div>
                <div className="footer-cell footer-copy">
                    <span>{FOOTER.copyright}</span>
                    <strong>{FOOTER.credit}</strong>
                </div>
            </div>
        </footer>
    )
}
