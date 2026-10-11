# Case Studies & Capstone: Assess a Zero Trust Maturity

This closing lesson does two things: walks through real-world Zero Trust implementations so the theory from the rest of this path has concrete grounding, then hands you a capstone exercise — assessing a fictional organization's maturity and proposing next steps, using everything this path has covered.

:::tip
Case studies are worth studying closely for one reason above all others: every one of them started from a real, painful trigger, not from "Zero Trust sounded like a good idea." Understanding the trigger tells you a lot about how to sell this internally at a real organization.
:::

## Case study 1: Google BeyondCorp

Google's BeyondCorp is the most-cited real-world Zero Trust implementation, and for good reason — it predates the term "Zero Trust" being popularized, and it was born from a real incident: **Operation Aurora**, a 2009 attack against Google and other major companies, where attackers who got a foothold moved laterally through internal networks that trusted internal traffic too broadly.

Google's response, built out over the following years, matches this path's structure almost exactly:

- Every access request, internal or external, goes through the same policy enforcement — there is no privileged "inside the corporate network" path
- Access is granted per-application based on device state (a device inventory service tracks posture) and user identity, not network location
- Employees can work productively from any network — a coffee shop and the corporate office are treated identically by policy, because neither is inherently trusted

BeyondCorp is essentially a live, at-scale demonstration of the ZTNA and continuous-verification lessons from earlier in this path, running in production for over a decade.

## Case study 2: financial services and micro-segmentation

Financial institutions are frequently early, aggressive adopters of micro-segmentation specifically — partly regulatory pressure, partly because the "assume breach, limit lateral movement" principle maps directly onto protecting payment systems, where a single compromised workstation reaching a core transaction system is a worst-case scenario with direct financial and regulatory consequences. A common pattern: payment processing environments get segmented so aggressively that even other internal systems within the same company can't reach them without going through narrowly scoped, heavily monitored, explicitly-approved paths — the three-tier segmentation example from earlier in this path, taken to its logical extreme because the stakes justify it.

## Case study 3: a mid-size company's realistic, imperfect journey

Not every real implementation is a polished Google-scale success story, and that's worth naming honestly. A more typical mid-size company's path often looks like:

- Year 1: MFA rollout (mostly push-based, not yet phishing-resistant — a real, common compromise given budget and user-friction constraints)
- Year 2: basic conditional access rules, device posture visibility for company-owned laptops only (BYOD remains largely unaddressed)
- Year 3: ZTNA pilot for one or two applications with the worst VPN pain points, while most internal traffic remains on a still-mostly-flat network

This is genuinely normal progress, not a failure — it matches the "Initial" to early "Advanced" maturity stages from the previous lesson, and it's a dramatically stronger security posture than where the company started, even though it's nowhere near Google's BeyondCorp-level maturity. Most real organizations live somewhere on this spectrum, indefinitely — "Optimal" maturity is rare and often not even the right target for every organization's risk profile and resources.

## What the case studies have in common

- **A real trigger**, not an abstract goal — an incident, a regulatory requirement, or a genuine operational pain point (VPN performance, remote-work friction)
- **Identity first**, every time — none of these stories start with network segmentation
- **Years, not months** — even Google's BeyondCorp rollout took years, and it started from a stronger baseline (in-house engineering capacity) than most organizations have
- **Imperfect, ongoing** — none of these are "finished." Zero Trust maturity is maintained and extended continuously, not completed and closed out

## 🧪 Capstone lab — assess and recommend

**Scenario**: You've been asked to assess "Northgate Logistics," a 300-person logistics company. Current state:

- Employees use a traditional VPN for all remote access, no ZTNA
- MFA is enabled for email only, using SMS codes — not extended to internal applications
- No formal device management; a mix of company laptops and BYOD phones access company data with no posture checks
- The internal network is flat — engineering, finance, and operations can all reach each other's servers with minimal restriction
- No conditional access or continuous verification of any kind
- A recent phishing incident resulted in one compromised laptop; the investigation found the attacker could have reached far more of the internal network than anyone expected, though no major breach ultimately occurred

Using everything from this path, produce:

1. **A maturity assessment**: using the four-stage model from the previous lesson, where does Northgate sit today, and why specifically (cite which pillars are weakest)?
2. **A prioritized first-90-days plan**: which 2–3 concrete actions come first, and why — justify the order using what you've learned about dependency between pillars.
3. **One metric** you'd report to leadership after those 90 days, following the "better metric, not vanity metric" guidance from the implementation lesson.
4. **A one-paragraph pitch** connecting the recent phishing incident to the recommended plan — this is the "real trigger" every case study above had, and using it well is how real Zero Trust budgets actually get approved.

:::challenge Test yourself
1. What specific incident triggered Google's BeyondCorp initiative, and which Zero Trust principle does it most directly illustrate?
2. Why is a mid-size company still using SMS-based MFA and a flat internal network after "starting" Zero Trust not a failure, if it's genuinely further along than where it started?
3. In the Northgate scenario, which single weakness would you flag as most urgent, and how does it connect to the recent phishing incident?
:::

## Key terms

- **BeyondCorp** — Google's pioneering, production-scale Zero Trust implementation, built in response to Operation Aurora
- **Operation Aurora** — a 2009 attack against Google and other companies that exposed the dangers of broadly trusted internal networks
- **Maturity assessment** — evaluating an organization's current Zero Trust posture against a staged framework to inform prioritized next steps

## Recap

Real Zero Trust implementations are messier, slower, and more incremental than the clean conceptual model earlier lessons described — but every real success story shares the same shape: a genuine trigger, identity-first sequencing, patient multi-year investment, and continuous, never-quite-finished maturity growth. That's the honest picture to carry out of this path: not "have we achieved Zero Trust," but "are we meaningfully more resilient than we were last year, and do we know exactly what comes next."

???refs
- [Google BeyondCorp research papers](https://cloud.google.com/beyondcorp) — the original case study referenced throughout this lesson
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) — the assessment framework used in the capstone exercise
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — the foundational reference for this entire path
???
