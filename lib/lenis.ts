import type Lenis from "lenis"

// The site's single Lenis instance (null when smooth scrolling is off)
let instance: Lenis | null = null
export const setLenis = (l: Lenis | null) => (instance = l)
export const getLenis = () => instance
