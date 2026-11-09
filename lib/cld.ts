// Cloudinary image → auto format (WebP/AVIF), auto quality, resized to `width`.
// Other URLs are returned unchanged. Safe to use in server components.
const CLD_IMG = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!(?:[a-z]{1,3}_[^/]*,?)+\/)(.*)$/i

export function cld(url = "", width = 1200) {
    const m = url.match(CLD_IMG)
    return m ? `${m[1]}f_auto,q_auto,c_limit,w_${width}/${m[2]}` : url
}
