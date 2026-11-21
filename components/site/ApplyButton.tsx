"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { APPLY_CTA, MEMBERSHIP_PATH } from "@/content/membership"

// Floating "Apply for Membership" pill, bottom right on every page except the form itself.
// (Replaces the round HOME button: the header is now pinned, so the logo is always there.)
export default function ApplyButton() {
    const pathname = usePathname()
    if (pathname === MEMBERSHIP_PATH) return null
    return (
        <Link href={MEMBERSHIP_PATH} className="apply-fab">
            {APPLY_CTA}
        </Link>
    )
}
