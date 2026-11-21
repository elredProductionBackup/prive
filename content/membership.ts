// "Apply for Membership" page (/apply-for-membership). All copy lives here.

export const MEMBERSHIP_PATH = "/apply-for-membership"

export const APPLY = {
    titleLines: ["Apply for", "Membership"], // second line is set in italic
    intro: "Privé is a curated enterprise network. Tell us a little about yourself and your enterprise, and we will be in touch to take the conversation forward.",
    steps: [
        { title: "Submit your application", text: "Share a few details about yourself and your enterprise. It takes about three minutes." },
        { title: "A conversation with us", text: "We will connect to understand your enterprise's priorities and explore how Privé can help your teams grow." },
        { title: "Welcome to Privé", text: "Once your membership is confirmed, nominate your representatives and join the next Practice." },
    ],
    formTitle: "About you",
    backgroundLabel: "Help us understand your professional background (share at least one)",
    submit: "Submit Application",
    sending: "Submitting…",
    doneText: "We’ve received your application. The Privé team will be in touch with you shortly to take the conversation forward.",
}

// "Years of Professional Experience" dropdown. Change the wording here; the sheet stores the text as chosen.
export const EXPERIENCE_OPTIONS = ["Less than 5 years", "5 to 10 years", "10 to 15 years", "15 to 20 years", "20 to 25 years", "More than 25 years"]

// Floating button shown on every other page
export const APPLY_CTA = "Apply for Membership"
