# SOC 2 and Audits

If ISO 27001 is the international standard, **SOC 2** is the one you'll hear about constantly if you work at (or sell software to) a US-based SaaS company.

## What SOC 2 actually is

SOC 2 (System and Organization Controls 2) is an audit report — not a certification — issued under AICPA standards by a licensed CPA firm. It proves an organisation's controls meet the **Trust Services Criteria**:

- **Security** (mandatory — the baseline all SOC 2 reports include)
- **Availability**
- **Processing Integrity**
- **Confidentiality**
- **Privacy**

Most companies only pursue Security, plus maybe Availability and Confidentiality, since the others are less commonly demanded by customers.

:::tip
"We're SOC 2 compliant" is a common phrase, but technically imprecise — you don't "pass" or "fail" SOC 2 the way you certify against ISO 27001. You receive a *report*, and its content (not a pass/fail stamp) is what customers actually read.
:::

## Type I vs Type II

- **Type I** — a point-in-time snapshot: "were these controls designed appropriately as of this date?" Faster and cheaper, but weaker evidence.
- **Type II** — evaluates whether controls **operated effectively over a period** (typically 3–12 months). This is what serious enterprise customers actually want to see, because it proves controls didn't just exist for the auditor's visit.

## What an auditor actually does

For Type II, the auditor picks a sample of evidence across the audit period and checks it's real:

- Pulls a sample of new-hire onboarding tickets → confirms access was provisioned per policy.
- Pulls a sample of terminated employees → confirms access was revoked within the required window.
- Reviews change-management tickets → confirms code changes went through review and approval.
- Reviews vulnerability scan results → confirms findings were tracked and remediated on schedule.

This is why "having a policy" isn't enough — you need the *evidence trail* that the policy was followed, consistently, for the whole audit window.

## Common findings ("exceptions")

- Access reviews that were supposed to happen quarterly, but only happened twice.
- A terminated employee whose access wasn't revoked for 10 days (when policy says 24 hours).
- Missing evidence for a specific control (nobody kept the ticket).

An exception doesn't automatically fail the report — auditors document it, and the company responds with a remediation plan. What kills deals is a *pattern* of exceptions suggesting the control isn't real.

## GRC's day-to-day role around audits

In practice, a GRC analyst spends a lot of time on **evidence collection** — gathering screenshots, exports, and tickets that prove controls operated, often using a compliance automation platform (Vanta, Drata, Secureframe) that continuously pulls evidence from AWS, GitHub, Okta, etc. Knowing these tools exist — and roughly what they automate — is genuinely useful for interviews in this field.
