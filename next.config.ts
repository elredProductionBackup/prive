import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // Old Framer addresses (under /home/ and the like) permanently point to the new ones,
    // so existing links and Google results keep working and pass their ranking on.
    async redirects() {
        return [
            { source: "/home", destination: "/", permanent: true },
            { source: "/home/:path*", destination: "/:path*", permanent: true },
            // Huddle was called Study Groups (and Thought Rooms before that)
            { source: "/work/study-groups", destination: "/work/huddle", permanent: true },
            { source: "/work/thought-rooms", destination: "/work/huddle", permanent: true },
            { source: "/study-groups", destination: "/work/huddle", permanent: true },
            { source: "/thought-rooms", destination: "/work/huddle", permanent: true },
            { source: "/huddle", destination: "/work/huddle", permanent: true },
            { source: "/wider-perspective", destination: "/work/wider-perspective", permanent: true },
        ]
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "framerusercontent.com" },
        ],
    },
}

export default nextConfig
