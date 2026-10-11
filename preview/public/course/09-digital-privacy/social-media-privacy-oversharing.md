# Social Media Privacy & Oversharing

The digital-footprint lesson introduced "active footprint" as everything you deliberately share. This lesson zooms in on social media specifically — where an enormous share of that active footprint actually accumulates, and the specific oversharing patterns that create real, concrete risk.

:::tip
Nothing in this lesson asks you to stop using social media. The goal is the same one the digital-footprint lesson set: understanding exactly what you're actually revealing, to whom, so you can make that choice deliberately rather than by default.
:::

## What "oversharing" actually means in security terms

Oversharing isn't a moral judgment about what you post — it's a concrete security concept: **revealing information that, combined with other publicly available details, meaningfully lowers the cost or difficulty of an attack against you.** A single vacation photo is rarely dangerous alone; a real-time vacation photo combined with a public profile revealing your home address (even implicitly, through tagged locations over time) tells a burglar exactly when your house will be empty.

## Common social media exposure patterns worth knowing by name

- **Real-time location sharing** — posting "here now" rather than "was here" removes the natural delay that protects you; the same information posted a week later is far lower risk
- **Metadata-rich photos** — the EXIF metadata concept from Path 19's CTF forensics challenge applies directly here: photos uploaded without stripped metadata can reveal precise GPS coordinates most platforms fortunately strip automatically today, but not every platform or sharing method does
- **Security-question answers hiding in plain sight** — posts about your first pet, your childhood street, or your favorite teacher are exactly the kind of "security question" answers Path 00's passwords lesson warned are often publicly guessable
- **Third-party app permissions** — quiz apps and games that request broad access to your social media account (your friend list, your post history) as a condition of playing, often collecting far more than the quiz itself actually needs
- **Oversharing about others** — posting a friend's or family member's location, routine, or private information without their consent extends your own exposure decisions onto people who never made that choice themselves

## Platform privacy settings actually worth checking

- **Who can see your posts** — public, friends-only, or a custom list; most platforms default to a broader audience than most users realize
- **Tag review** — requiring approval before a photo someone else posts of you appears on your own profile, giving you a checkpoint over content you didn't control the posting of
- **Past post visibility** — some platforms let you retroactively restrict who can see old posts, useful since privacy settings and audiences you had years ago may not reflect your current preferences
- **Location services per-app** — reviewed in more depth in the device-and-location-privacy lesson later in this path, but worth a first check here specifically for social apps

:::challenge Trace a real risk chain
A user's public profile shows: their employer's name, a photo tagged at "Home" from six months ago, and a recent post saying "Leaving for our two-week Europe trip tomorrow!"

<details><summary>Hint</summary>Individually, is any single piece of this information dangerous? What happens when someone combines all three?</details>
<details><summary>Show answer</summary>Individually, each piece is fairly low-risk — plenty of people share their employer, a home-tagged photo from months ago is stale information, and a travel announcement alone is common. Combined, though, an attacker now has: an approximate home location (from the old tagged photo, still useful for general area even if not pinpoint-precise), confirmation the home will be empty for a specific two-week window (from the travel post), and enough employer information to potentially attempt a targeted phishing or social-engineering approach separately. This is exactly the aggregation risk the digital-footprint lesson introduced — no single post crosses an obvious line, but the combination meaningfully lowers the cost of a real-world attack, whether that's burglary or a more sophisticated targeted approach.</details>
:::

## 🧪 Hands-on lab — audit your own social presence

Pick one social media account you actively use. Review its privacy settings against the four categories in this lesson (post visibility, tag review, past post visibility, connected app permissions), and identify at least one setting you're changing after this lesson.

:::challenge Test yourself
1. Why does "real-time" location sharing carry more risk than sharing the same information after the fact?
2. Why can oversharing about someone else be a privacy issue even when you're comfortable sharing your own information that openly?
3. Name one social media privacy setting worth checking beyond basic post visibility.
:::

## Key terms

- **Oversharing (security sense)** — revealing information that, combined with other public details, meaningfully lowers the cost of an attack against you.
- **Tag review** — a platform feature requiring approval before content tagging you becomes visible on your profile.

## Recap

Social media is where an outsized share of your active digital footprint accumulates, and the real risk rarely comes from any single post — it comes from aggregation: real-time location, metadata-rich photos, and casually-revealed security-question answers combining into something genuinely useful to an attacker. Reviewing platform privacy settings deliberately, rather than accepting broad defaults, is the practical response — not abandoning social media, but using it with clear eyes about what's actually being revealed.

???refs
- [EFF — Social Media Privacy Guide](https://www.eff.org/deeplinks) — search EFF's deeplinks for current platform-specific privacy guidance
???

**Next up →** [VPNs Explained](#/lesson/09-digital-privacy/vpns-explained)
