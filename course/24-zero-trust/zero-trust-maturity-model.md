# Zero Trust Maturity Models

The implementing-Zero-Trust lesson covered sequencing a real rollout. This lesson covers how to actually *measure* progress along that rollout — the difference between "we bought some Zero Trust products" and "we can demonstrate, pillar by pillar, how mature our implementation actually is."

:::tip
A maturity model's real value isn't the score itself — it's that it forces a structured, pillar-by-pillar self-assessment instead of a single vague "are we Zero Trust yet?" question that's nearly impossible to answer honestly without one.
:::

## The CISA Zero Trust Maturity Model's five pillars

CISA's widely-referenced maturity model organizes Zero Trust into five pillars, each assessed independently:

1. **Identity** — how mature is MFA coverage, conditional access, and identity governance (directly building on the identity-as-perimeter and PAM lessons)
2. **Devices** — how mature is device inventory, posture verification, and compliance enforcement (the device-trust-posture lesson)
3. **Networks** — how mature is segmentation, encryption, and the move away from implicit network-based trust (the microsegmentation and ZTNA lessons)
4. **Applications and workloads** — how mature is access control and continuous authorization for individual applications and services (this lesson's companion API-security material)
5. **Data** — how mature is classification, DLP, and rights management (the data-centric Zero Trust lesson)

## The four maturity stages

Within each pillar, organizations are assessed across four stages:

- **Traditional** — static, perimeter-based controls; manual processes; broad, standing access
- **Initial** — early automation and some cross-pillar coordination beginning
- **Advanced** — centralized visibility, automated policy enforcement, and consistent application across most of the pillar
- **Optimal** — fully automated, continuously adaptive controls with real-time risk-based decisions integrated across all five pillars

## Why measuring by pillar matters more than an overall score

A single combined "Zero Trust score" hides exactly the information a real rollout needs: an organization might be Advanced in Identity (strong MFA, conditional access) while still Traditional in Data (no classification, no DLP) — precisely the imbalance the data-centric lesson warned creates a gap even when everything upstream looks strong. A pillar-by-pillar assessment surfaces that gap directly; a single blended score would average it away and hide it.

:::challenge Interpret an assessment
An organization's CISA maturity self-assessment shows: Identity — Advanced, Devices — Advanced, Networks — Initial, Applications — Initial, Data — Traditional.

<details><summary>Hint</summary>Given everything this path has taught about how these pillars interact — recall the API security lesson's point about internal traffic and the data-centric lesson's point about the last line of defense — where's the most urgent gap, and why?</details>
<details><summary>Show answer</summary>Data is the most urgent gap. This organization has strong identity and device verification getting requests *to* their destination, but almost no maturity in what happens once a request (legitimate or otherwise) reaches the data itself — no classification, no DLP, no rights management. Given the data-centric lesson's point that data controls are the last line of defense when everything upstream is satisfied by a legitimate-but-misbehaving session, this is the pillar where a real incident is most likely to turn into an actual large-scale data loss rather than being contained. The Networks and Applications gaps matter too, but Data being stuck at Traditional while Identity and Devices are Advanced is the specific imbalance a pillar-by-pillar model is designed to expose.</details>
:::

## 🧪 Hands-on lab — self-assess a hypothetical organization

For a fictional company of your choosing, assign a maturity stage (Traditional/Initial/Advanced/Optimal) to each of the five pillars based on a few sentences of assumed context you invent. Identify the pillar most in need of investment and justify it using at least one earlier lesson from this path.

:::challenge Test yourself
1. Name the five pillars of the CISA Zero Trust Maturity Model.
2. Why can a single blended maturity score be misleading compared to a pillar-by-pillar assessment?
3. What does "Optimal" maturity require that "Advanced" does not?
:::

## Key terms

- **Maturity pillar** — one of five independently assessed domains (Identity, Devices, Networks, Applications, Data) in the CISA Zero Trust Maturity Model
- **Maturity stage** — one of four levels (Traditional, Initial, Advanced, Optimal) describing how automated and integrated a pillar's controls are

## Recap

A Zero Trust maturity model turns a vague "are we Zero Trust yet?" question into a structured, pillar-by-pillar assessment across identity, devices, networks, applications, and data — each independently scored across four stages from Traditional to Optimal. The real value is in what a pillar-by-pillar view exposes that a single blended score would hide: the specific, often uneven gaps (frequently Data, per the previous lesson) where a rollout that looks mature overall is still dangerously incomplete.

???refs
- [CISA Zero Trust Maturity Model v2.0](https://www.cisa.gov/zero-trust-maturity-model) — the primary public reference this lesson is built on
???
