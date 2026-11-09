"use client"

import { openModal } from "@/lib/site"

export default function QualificationButton() {
    return (
        <button type="button" className="qual-btn" onClick={() => openModal("qualification")}>
            Qualification
        </button>
    )
}
