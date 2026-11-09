import localFont from "next/font/local"

// Mencken Std (regular + bold) for serif text; Mencken Std Head ships only in italic,
// so it's used where the design is italic (topic word art, principle headings, taglines).
export const mencken = localFont({
    src: [
        { path: "./fonts/MenckenStd-Regular.woff2", weight: "400", style: "normal" },
        { path: "./fonts/MenckenStd-Bold.woff2", weight: "700", style: "normal" },
    ],
    variable: "--font-mencken",
    display: "swap",
    fallback: ["Georgia", "Times New Roman", "serif"],
})

export const menckenHead = localFont({
    src: [{ path: "./fonts/MenckenStdHead-Italic.woff2", weight: "400", style: "italic" }],
    variable: "--font-mencken-head",
    display: "swap",
    fallback: ["Georgia", "serif"],
})
