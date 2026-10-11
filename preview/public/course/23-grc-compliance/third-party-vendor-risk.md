# Third-Party & Vendor Risk

Some of the most damaging breaches in history didn't start inside the victim company at all — they started with a vendor. Target (2013), SolarWinds (2020), and countless smaller incidents all trace back to third-party risk.

:::tip
Vendor risk isn't just about vendors who touch your data directly. A vendor whose *software* you install (like SolarWinds' Orion) can compromise you even with zero data access, just by shipping malicious updates.
:::

## Why vendors are the weak link

Your organisation might have a mature security program — but if you give a vendor access to your data, your network, or your customers' data, your security posture is now only as strong as *theirs*. Attackers know this and specifically target smaller, less-secured vendors as a way into larger, better-defended targets.

### The Target breach, briefly

The 2013 Target breach — 40 million card numbers stolen — didn't start with a vulnerability in Target's own systems. It started with stolen credentials from an HVAC vendor that had network access for billing purposes. Attackers pivoted from that vendor's limited network access all the way to Target's point-of-sale systems. The lesson that shaped an entire generation of vendor risk practice: the size and sensitivity of *your* company doesn't matter if a small, poorly-secured vendor has a path into your network.

## The vendor risk lifecycle

1. **Pre-engagement due diligence** — before signing a contract, assess the vendor's security posture (security questionnaire, request their SOC 2/ISO 27001 report, review their breach history).
2. **Contractual controls** — data processing agreements, breach notification clauses, right-to-audit clauses, liability terms.
3. **Onboarding** — provision the minimum access actually needed (least privilege applies to vendors too).
4. **Ongoing monitoring** — periodic reassessment; don't just check once and forget. Security ratings services (BitSight, SecurityScorecard) give an outside-in continuous view.
5. **Offboarding** — revoke access promptly when the relationship ends. Forgotten vendor access is a classic audit finding.

:::warn
Stage 4 (ongoing monitoring) is the one organisations skip most often, because it's the least urgent-feeling step. A vendor assessed as low-risk at onboarding two years ago may have since suffered a breach, changed ownership, or quietly outsourced their infrastructure to a provider you've never vetted. "We checked them once" is not the same as "we know their current risk."
:::

## Tiering vendors by risk

Not every vendor deserves the same scrutiny — the office snack delivery service doesn't need the same review as your cloud hosting provider. A simple tiering model:

- **Tier 1 (Critical)** — has access to sensitive data or core infrastructure. Full assessment, annual review, SOC 2/ISO evidence required.
- **Tier 2 (Moderate)** — limited data access or operational dependency. Lighter questionnaire, less frequent review.
- **Tier 3 (Low)** — no data access, minimal business impact if compromised. Basic due diligence only.

| Tier | Example vendor | Review frequency | Evidence required |
|---|---|---|---|
| 1 — Critical | Cloud hosting provider, payment processor | Annual, plus continuous rating monitoring | SOC 2 Type II or ISO 27001, security questionnaire, right-to-audit clause |
| 2 — Moderate | Analytics tool with limited PII access | Every 1-2 years | Security questionnaire, self-attestation |
| 3 — Low | Office supply vendor, snack delivery | At onboarding only | Basic contract review |

## What a vendor security questionnaire actually asks

- Do you encrypt data at rest and in transit?
- Do you have a documented incident response plan, and will you notify us within a specific window if breached?
- Do you perform background checks on employees with data access?
- Can you provide a current SOC 2 Type II report or ISO 27001 certificate?
- Do you use subprocessors (other vendors), and are they disclosed?

## The fourth-party problem

Your vendor's own vendors ("fourth parties") are risk you inherit indirectly and often can't see directly. This is why contracts increasingly require vendors to disclose their subprocessors — you can't assess a risk you don't know exists.

### A worked example: tracing the chain

A company uses a customer-support chat vendor (Tier 1, since it handles customer PII in chat transcripts). During due diligence, the support vendor discloses it uses a third-party AI service to generate suggested chat replies, and that AI service's subprocessor list includes a cloud storage provider for model training logs. That's three hops removed from the original company — and if any link in that chain mishandles data, the original company may still bear regulatory and reputational consequences, even though it never had a direct relationship with the AI service or the storage provider. This is exactly why subprocessor disclosure clauses exist: without them, this entire chain would be invisible.

## Where this connects back to the technical paths

A lot of vendor risk assessment is really "asking the same questions this course teaches you to answer technically" — encryption, access control, incident response — just from the outside, based on documentation and attestation rather than hands-on testing. That overlap is exactly why technical security knowledge makes you a much stronger GRC analyst.

## 🧪 Hands-on lab — tier and assess a vendor

1. Pick three real or hypothetical vendors a mid-size company might use: one clearly Tier 1 (e.g. a payments processor), one Tier 2, one Tier 3.
2. For the Tier 1 vendor, draft five questions you'd put on a security questionnaire, going beyond the generic list above — tailor them to what that specific vendor actually does.
3. Research (or imagine) what subprocessors that Tier 1 vendor might realistically use, and note the fourth-party risk this introduces.
4. Write a one-paragraph justification for why the Tier 3 vendor gets minimal review — what makes it genuinely low risk, not just "seems fine"?

:::challenge Test yourself
1. In the Target breach, why did an HVAC vendor's limited network access matter at all to a retailer's point-of-sale security?
2. Why is "ongoing monitoring" the vendor risk lifecycle stage organisations skip most often, and what's the practical cost of skipping it?
3. Explain the fourth-party problem in your own words, using an example different from the one in this lesson.
:::

## Key terms

- **Vendor tiering** — categorising vendors by risk level to apply proportionate scrutiny
- **Subprocessor** — a third party a vendor itself relies on, sometimes called a "fourth party" from the original company's perspective
- **Right-to-audit clause** — a contract term allowing the customer to audit a vendor's security practices
- **Security rating service** — a tool (BitSight, SecurityScorecard) providing continuous outside-in risk scoring of vendors

## Recap

Vendor risk is inherited risk — your security posture is only as strong as the weakest link in your vendor chain, and that chain often extends further than the vendors you directly contract with. A tiered, lifecycle-based approach (assess before signing, monitor continuously, offboard promptly) keeps this manageable without treating every vendor with the same heavyweight scrutiny.

???refs
- [NIST SP 800-161 — Supply Chain Risk Management](https://csrc.nist.gov/pubs/sp/800/161/r1/final) — the federal standard for this exact topic
- [Target breach retrospective (Krebs on Security)](https://krebsonsecurity.com/2014/02/target-hackers-broke-in-via-hvac-company/) — the original reporting on the HVAC vendor path
???
