# Third-Party & Vendor Risk

Some of the most damaging breaches in history didn't start inside the victim company at all — they started with a vendor. Target (2013), SolarWinds (2020), and countless smaller incidents all trace back to third-party risk.

## Why vendors are the weak link

Your organisation might have a mature security program — but if you give a vendor access to your data, your network, or your customers' data, your security posture is now only as strong as *theirs*. Attackers know this and specifically target smaller, less-secured vendors as a way into larger, better-defended targets.

:::tip
Vendor risk isn't just about vendors who touch your data directly. A vendor whose *software* you install (like SolarWinds' Orion) can compromise you even with zero data access, just by shipping malicious updates.
:::

## The vendor risk lifecycle

1. **Pre-engagement due diligence** — before signing a contract, assess the vendor's security posture (security questionnaire, request their SOC 2/ISO 27001 report, review their breach history).
2. **Contractual controls** — data processing agreements, breach notification clauses, right-to-audit clauses, liability terms.
3. **Onboarding** — provision the minimum access actually needed (least privilege applies to vendors too).
4. **Ongoing monitoring** — periodic reassessment; don't just check once and forget. Security ratings services (BitSight, SecurityScorecard) give an outside-in continuous view.
5. **Offboarding** — revoke access promptly when the relationship ends. Forgotten vendor access is a classic audit finding.

## Tiering vendors by risk

Not every vendor deserves the same scrutiny — the office snack delivery service doesn't need the same review as your cloud hosting provider. A simple tiering model:

- **Tier 1 (Critical)** — has access to sensitive data or core infrastructure. Full assessment, annual review, SOC 2/ISO evidence required.
- **Tier 2 (Moderate)** — limited data access or operational dependency. Lighter questionnaire, less frequent review.
- **Tier 3 (Low)** — no data access, minimal business impact if compromised. Basic due diligence only.

## What a vendor security questionnaire actually asks

- Do you encrypt data at rest and in transit?
- Do you have a documented incident response plan, and will you notify us within a specific window if breached?
- Do you perform background checks on employees with data access?
- Can you provide a current SOC 2 Type II report or ISO 27001 certificate?
- Do you use subprocessors (other vendors), and are they disclosed?

## The fourth-party problem

Your vendor's own vendors ("fourth parties") are risk you inherit indirectly and often can't see directly. This is why contracts increasingly require vendors to disclose their subprocessors — you can't assess a risk you don't know exists.

## Where this connects back to the technical paths

A lot of vendor risk assessment is really "asking the same questions this course teaches you to answer technically" — encryption, access control, incident response — just from the outside, based on documentation and attestation rather than hands-on testing. That overlap is exactly why technical security knowledge makes you a much stronger GRC analyst.
