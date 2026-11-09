import { cld } from "@/lib/cld"

// Shows the image, or a quiet placeholder block while the link is still empty
export default function ImageSlot({ src, alt = "", className, label, priority }: { src?: string; alt?: string; className?: string; label?: string; priority?: boolean }) {
    if (src)
        return <img src={cld(src, 2000)} alt={alt} className={className} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
    return (
        <div className={`${className || ""} image-slot`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
            {process.env.NODE_ENV !== "production" && label ? <span>{label}</span> : null}
        </div>
    )
}
