# Cybersecurity laws & ethics, beyond the golden rule

The golden rule lesson gave you the one-sentence version: never touch a system without permission. This lesson goes one level deeper — the actual legal landscape behind that rule, and the ethical reasoning that separates a security professional from a criminal using the exact same technical skills.

:::danger
This lesson is educational context, not legal advice. Laws vary significantly by country and even by state/region — when in doubt about a specific situation, the safe default is always explicit written permission before you touch anything.
:::

## The law that matters most in the US: the CFAA

The **Computer Fraud and Abuse Act (CFAA)**, passed in 1986, is the primary US federal law governing unauthorized computer access — and it's broader than most beginners expect. "Unauthorized access," under this law, can include accessing a system you technically could reach but weren't given permission to, not just breaking through a technical barrier like a password.

Other countries have their own equivalent legislation — the UK's **Computer Misuse Act**, for instance — and the specific legal thresholds differ, but the underlying principle (unauthorized access is illegal, regardless of your intent) is broadly consistent across most jurisdictions covered by this course's global audience.

## Why "I was just testing their security" is not a legal defense

A common misconception among beginners: finding and reporting a real vulnerability somehow protects you legally, even without permission, because you were "helping." In most jurisdictions, this is false — good intent doesn't retroactively authorize access that wasn't authorized in the first place. This is precisely why responsible disclosure programs and bug bounty programs (covered in depth in Path 15) exist: they provide the explicit permission that turns the exact same technical activity from a crime into legitimate, often well-paid work.

## The three-color hat framework, formalized

The types-of-hackers lesson introduced white/grey/black hats informally. Here's the formal distinction that actually matters legally:

- **White hat** — operates with explicit authorization (a signed contract, a bug bounty program's published scope) — legally protected specifically because permission exists
- **Black hat** — operates with no authorization and malicious intent — squarely illegal
- **Grey hat** — operates with no authorization but claims benign intent (finding a flaw and reporting it, uninvited) — legally risky regardless of intent, precisely because authorization, not intent, is what the law actually turns on

## A practical ethical framework beyond "is it legal"

Legal and ethical aren't always identical questions. A useful additional lens, beyond strict legality:

- **Scope discipline** — even *with* authorization, staying strictly within the agreed boundaries (the specific systems, the specific techniques) rather than treating permission for one thing as permission for everything
- **Minimizing harm** — choosing techniques and timing that avoid unnecessary damage or disruption, even when a more aggressive approach is technically within scope
- **Honest disclosure** — reporting what you actually found, accurately, rather than either exaggerating for effect or downplaying to avoid confrontation

:::challenge Evaluate a real scenario
A researcher finds a serious vulnerability in a company's public website by accident, while browsing normally — no scanning tools, no deliberate testing, they simply noticed something odd in a URL and it revealed private data. They report it immediately and don't access anything further.

<details><summary>Hint</summary>Does accidental discovery change the legal analysis around "authorization," even though the intent here was clearly good?</details>
<details><summary>Show answer</summary>This is a genuinely gray area, and it's exactly why "grey hat" earned its name — good intent and accidental discovery don't automatically grant legal safety, since many laws (including the CFAA) focus on whether access was authorized, not on how it was discovered or why. In practice, many companies respond well to this kind of good-faith report, especially when the researcher stopped immediately and reported responsibly rather than exploring further — but the legally safest path, if this happens to you, is to report it through the company's official channel (a security.txt file, a bug bounty program) immediately, document exactly what you did and didn't do, and stop all further interaction with the system the moment you realize something's off, rather than continuing to "confirm" the finding.</details>
:::

## 🧪 Hands-on lab — find a real authorization boundary

Find a real company's bug bounty program (HackerOne and Bugcrowd, both covered in depth in Path 15, list many publicly) and read its scope section. Identify exactly what's in scope, what's explicitly out of scope, and one specific technique the program explicitly prohibits even for in-scope targets.

:::challenge Test yourself
1. Why doesn't good intent alone provide legal protection under laws like the CFAA?
2. What's the practical difference, legally, between a white hat and a grey hat performing the exact same technical action?
3. Name one ethical principle beyond strict legality that a responsible security professional follows even when technically authorized.
:::

## Key terms

- **CFAA (Computer Fraud and Abuse Act)** — the primary US federal law governing unauthorized computer access.
- **Scope** — the explicitly agreed boundaries of what a security engagement authorizes.
- **Responsible disclosure** — reporting a discovered vulnerability to the affected organization through an official channel, rather than exploiting or publicizing it.

## Recap

- Authorization, not intent, is what most computer-access laws actually turn on — "I meant well" is not a reliable legal defense.
- The CFAA (and international equivalents like the UK's Computer Misuse Act) broadly criminalize unauthorized access regardless of motive.
- White hat status comes specifically from explicit authorization, which is exactly what bug bounty and responsible disclosure programs provide.
- Ethical practice goes beyond strict legality: scope discipline, minimizing harm, and honest disclosure all matter even when an action is technically authorized.

**Next up →** [Security frameworks: a beginner's map](#/lesson/01-introduction/security-frameworks-intro)
