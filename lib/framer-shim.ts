// Stand-in for the "framer" package so Framer code components run unchanged in Next.js.
// - addPropertyControls: does nothing (the right-hand panel only exists in Framer)
// - ControlType.Anything: returns the name as a string
// - RenderTarget: always reports "preview", so canvas-only code never runs

export function addPropertyControls(_component: unknown, _controls: unknown) {}

export const ControlType: Record<string, string> = new Proxy(
    {},
    { get: (_t, key) => String(key) }
)

export const RenderTarget = {
    canvas: "CANVAS",
    export: "EXPORT",
    thumbnail: "THUMBNAIL",
    preview: "PREVIEW",
    current: () => "PREVIEW",
    hasRestrictions: () => false,
}
