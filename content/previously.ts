// "Previously at Privé" carousel.
// type "image" opens a photo gallery (gallery[]); type "video" opens a player (video).
// The card face is `cover`, else the first gallery photo, else a frame from the Cloudinary video.

const CLD = "https://res.cloudinary.com/dtrv7p3gg"

export type Slide = {
    type: "image" | "video"
    title: string
    subtitle: string
    gallery?: string[]
    video?: string
    cover?: string
    duration?: string
}

export const SLIDES: Slide[] = [
    {
        type: "image",
        title: "Leadership Intelligence in an AI Era",
        subtitle: "ODED NETZER SESSION",
        gallery: [
            `${CLD}/image/upload/v1790063127/IMG_8624_gpodbc.jpg`,
            `${CLD}/image/upload/v1790063179/cx7nrz2sdteojh3oaeai_tfdu6y.webp`,
            `${CLD}/image/upload/v1790063185/koff7qlpasmdkjmxweof_yd7coc.webp`,
            `${CLD}/image/upload/v1786339153/ekz2vxs1fbo69ksaoshr_lijkz9.webp`,
            `${CLD}/image/upload/v1786339167/fluu438xcx5okotpglj2_kgcvlh.webp`,
            `${CLD}/image/upload/v1786339169/ktdgfso58h3g77ppbjbn_v9rlik.webp`,
        ],
    },
    {
        type: "image",
        title: "Negotiations, Influence, and Decision-making",
        subtitle: "NIRO SIVANATHAN SESSION",
        gallery: [`${CLD}/image/upload/v1790278531/IMG_0859_nythlx.jpg`],
    },
    {
        type: "image",
        title: "On-site Learnings at Zen Technologies",
        subtitle: "HYDERABAD 2026",
        gallery: [
            `${CLD}/image/upload/v1790246204/5cfeb8279256c280a42620b960177ff2ef6d2ce0_gbqv5m.png`,
            `${CLD}/image/upload/v1790246201/b0bd724b6b05d144d7ce0787439888a41210f0ca_yan4q7.png`,
            `${CLD}/image/upload/v1790246196/cc36dd1d18cb2f17d65700bae8ebc7cd85a440a6_b4nmrt.png`,
            `${CLD}/image/upload/v1790246195/94b515bc3a61e73124aa3a2218a3dd4ea98a112f_nqhahx.png`,
        ],
    },
    {
        type: "image",
        title: "On-site Learnings at Skyroot",
        subtitle: "HYDERABAD 2026",
        gallery: [
            `${CLD}/image/upload/v1790062639/skyroot-3_xnqn66.jpg`,
            `${CLD}/image/upload/v1790246344/523d9f76d0bf1103064ab3708ca9e659e5ee3891_fesbhv.png`,
            `${CLD}/image/upload/v1790062639/skyroot-4_g6wyqa.jpg`,
        ],
    },
    {
        type: "image",
        title: "Alpha Room with Juniper",
        subtitle: "ON-SITE VISIT",
        gallery: [`${CLD}/image/upload/v1790063006/Juniper_hiaw6b.jpg`],
    },
]
