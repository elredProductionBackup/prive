import * as React from "react"

// "**bold**" → <strong>, "\n" → line break
export function rich(text = "") {
    return text.split("\n").map((line, li) => (
        <React.Fragment key={li}>
            {li > 0 && <br />}
            {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
        </React.Fragment>
    ))
}

