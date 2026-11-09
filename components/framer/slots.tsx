"use client"

// Your Framer components, with the values you set in Framer's right-hand panel.
// Change a prop here the same way you would in that panel.
import PriveMainContent from "./PriveMainContent"
import CalendarDetails from "./CalendarDetails"
import CalendarMonth from "./CalendarMonth"
import PriveCarousel from "./PriveCarousel"

export function MainContent() {
    return <PriveMainContent speakersMaxWidth={900} />
}

export function WhenCarousel() {
    return <CalendarDetails />
}

export function MonthCalendar() {
    return <CalendarMonth />
}

export function PreviouslyCarousel() {
    // PriveCarousel has no built-in defaults (Framer supplied them), so they're set here
    return (
        <PriveCarousel
            activeColor="#775E36"
            inactiveColor="#D5CECA"
            accentColor="#C7A978"
            radius={12}
            autoplay
            speed={45}
            pauseOnHover
            resumeDelay={2.5}
            edgeScale={1}
            showArrows
        />
    )
}
