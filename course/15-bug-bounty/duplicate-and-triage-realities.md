# Duplicates & Triage Realities

The bb-career lesson touched on staying emotionally sustainable in this work. This lesson addresses the single most common source of bug bounty frustration head-on — directly connecting to the bb-platforms-deep-dive lesson's triage coverage, now from the researcher's side of that exact process.

## Duplicates are the norm, not the exception

A genuinely important expectation to set early: on any reasonably popular public program, the large majority of submitted reports — including many technically correct, well-written ones — get closed as **duplicate**, meaning someone else found and reported the exact same issue first, sometimes only hours earlier. This isn't a sign of poor work; it's simply the statistical reality of many skilled researchers testing the same popular, well-known target simultaneously.

## Why "N/A" and "Informative" happen even on real findings

Beyond duplicates, reports frequently close as:

- **N/A (Not Applicable)** — the reported behavior, while technically real, doesn't represent a genuine security risk the program considers in-scope for reward (a bug already publicly known and accepted as low-risk, for instance)
- **Informative** — a real, technically accurate finding that falls below the program's minimum severity bar for a bounty payout, still logged and appreciated but not compensated
- **Won't Fix** — the program acknowledges the issue but has made a deliberate business decision not to remediate it, common for low-severity findings against a low-value target within a larger scope

## The dispute process — and when to actually use it

Nearly every platform provides a formal **dispute** or **mediation** process for a researcher who genuinely disagrees with a triage decision — directly connecting to the report-writing lesson's four-part structure: a dispute is far more likely to succeed when it points to something concrete the original report already demonstrated (a specific impact the triager may have missed) rather than simply re-asserting the finding is important. Disputing every closed report on principle, rather than selectively on genuinely strong cases, is a well-known way to damage a researcher's relationship with a program's triage team.

## Building speed without sacrificing quality

Directly connecting to the recon-pipeline and automation-nuclei lessons: the practical answer to the duplicate problem isn't testing more recklessly, it's testing **faster and more systematically** than competing researchers — a well-maintained personal recon pipeline (this path's earlier lessons) that immediately flags new subdomains or new endpoints on a target the moment they appear gives a genuinely real first-mover advantage on newly changed attack surface, where duplicate risk is lowest.

## The emotional dimension, honestly

:::tip Rejection is the statistically normal outcome, not a signal to reassess your skill
A researcher who submits ten reports and has seven closed as duplicate or N/A, with three paid, is having a genuinely normal, successful month by realistic industry standards — not an unusually bad one. Treating each individual closed report as a referendum on personal skill, rather than as the expected statistical outcome of many skilled people testing the same popular targets, is one of the most common reasons promising beginners burn out and quit prematurely, exactly the sustainability concern the previous lesson raised.
:::

:::challenge Test yourself
Why does a well-maintained personal recon pipeline specifically reduce duplicate risk, beyond just general testing efficiency?
<details><summary>Show answer</summary>Duplicate risk is fundamentally about timing relative to other researchers — the first person to discover and report a given vulnerability gets credit and payment, while everyone who finds the identical issue afterward, even minutes later, typically receives a duplicate closure regardless of how independently or skillfully they found it. A personal recon pipeline that automatically and continuously monitors a target for newly appearing subdomains, newly deployed endpoints, or newly changed functionality (exactly the kind of continuous monitoring the automation-nuclei lesson described) means a researcher can be testing genuinely new, unexplored attack surface within hours or even minutes of it appearing — attack surface no other researcher has had a chance to test yet at all — rather than only testing the same long-established, heavily-picked-over parts of an application everyone else has already tested repeatedly. This timing advantage, not raw testing skill alone, is a large part of why experienced hunters with strong automation consistently report lower duplicate rates than beginners manually browsing the same familiar pages.</details>
:::

## Key terms

- **Duplicate closure** — a report closed because another researcher already reported the same issue first.
- **Dispute/mediation process** — a platform's formal mechanism for contesting a triage decision on specific grounds.
- **First-mover advantage** — the reduced duplicate risk from testing genuinely new attack surface before other researchers reach it.

## Recap

- Duplicates, N/A, and Informative closures are the statistically normal outcome on popular programs, not a sign of poor work.
- The dispute process works best when used selectively, on genuinely strong cases backed by concrete evidence already in the original report.
- A well-maintained, continuously-monitoring recon pipeline reduces duplicate risk through genuine first-mover timing advantage, not just general efficiency.
- Treating rejection as statistically expected rather than a personal skill referendum is essential to the sustainability this path's career lesson emphasized.

## 🎉 You've finished Path 15's core lessons

You now have a complete, practical bug bounty methodology — program selection, platform mechanics, legal scope boundaries, automated recon pipelines, manual Burp-based testing, systematic IDOR/XSS/injection hunting, business logic and race condition thinking, Nuclei-based automation, mobile and API scope, and a realistic framework — including its statistical realities — for building this into a sustainable long-term practice. Combined with Paths 11 and 21, you have genuine, employable, and directly monetisable security skills.

**Next up →** [Bug Bounty Hunting Challenges](#/lesson/15-bug-bounty/bounty-hunting-challenges)
