# SOC 2 and Audits

If ISO 27001 is the international standard, **SOC 2** is the one you'll hear about constantly if you work at (or sell software to) a US-based SaaS company.

:::tip
"We're SOC 2 compliant" is a common phrase, but technically imprecise — you don't "pass" or "fail" SOC 2 the way you certify against ISO 27001. You receive a *report*, and its content (not a pass/fail stamp) is what customers actually read.
:::

## What SOC 2 actually is

SOC 2 (System and Organization Controls 2) is an audit report — not a certification — issued under AICPA standards by a licensed CPA firm. It proves an organisation's controls meet the **Trust Services Criteria**:

- **Security** (mandatory — the baseline all SOC 2 reports include)
- **Availability**
- **Processing Integrity**
- **Confidentiality**
- **Privacy**

Most companies only pursue Security, plus maybe Availability and Confidentiality, since the others are less commonly demanded by customers.

## Type I vs Type II

- **Type I** — a point-in-time snapshot: "were these controls designed appropriately as of this date?" Faster and cheaper, but weaker evidence.
- **Type II** — evaluates whether controls **operated effectively over a period** (typically 3–12 months). This is what serious enterprise customers actually want to see, because it proves controls didn't just exist for the auditor's visit.

| | Type I | Type II |
|---|---|---|
| Question answered | Were controls designed correctly, right now? | Did controls actually operate correctly, over months? |
| Typical timeline | A few weeks | 3–12 months of evidence, then the audit |
| Evidence needed | A snapshot | Continuous evidence across the whole period |
| Enterprise customer confidence | Lower — "looked right on the day" | Higher — "actually worked all year" |

Many companies do a Type I first (faster to get *something* to show customers), then move to Type II for their next audit cycle once they have a track record to prove.

## What an auditor actually does

For Type II, the auditor picks a sample of evidence across the audit period and checks it's real:

- Pulls a sample of new-hire onboarding tickets → confirms access was provisioned per policy.
- Pulls a sample of terminated employees → confirms access was revoked within the required window.
- Reviews change-management tickets → confirms code changes went through review and approval.
- Reviews vulnerability scan results → confirms findings were tracked and remediated on schedule.

This is why "having a policy" isn't enough — you need the *evidence trail* that the policy was followed, consistently, for the whole audit window.

## A worked example: a Type II sample walkthrough

An auditor reviewing a 6-month Type II audit period pulls 15 of the ~40 employees who left the company during that window. For each, they check: was the offboarding ticket created the same day as the termination date in HR records? Was account access revoked within the policy's stated window (say, 24 hours)? Was the laptop marked as returned or wiped?

If 14 of 15 pass cleanly and one shows access revoked 3 days late due to a manager forgetting to submit the offboarding ticket promptly, that single case becomes a documented **exception** — not an automatic failure, but a finding the report will note, along with the company's explanation and any remediation taken (e.g. "we've since automated offboarding tickets to trigger from the HR system directly, removing the manual step that caused this delay").

## Common findings ("exceptions")

- Access reviews that were supposed to happen quarterly, but only happened twice.
- A terminated employee whose access wasn't revoked for 10 days (when policy says 24 hours).
- Missing evidence for a specific control (nobody kept the ticket).

An exception doesn't automatically fail the report — auditors document it, and the company responds with a remediation plan. What kills deals is a *pattern* of exceptions suggesting the control isn't real.

:::warn
A single exception in a Type II report is normal — audits exist precisely because organisations aren't perfect, and a report with zero exceptions across an entire year sometimes makes sophisticated customers *more* suspicious, not less, because it can suggest a sample too small or too friendly to catch real gaps. What matters is the pattern and the quality of the remediation response, not a fantasy of zero findings.
:::

## GRC's day-to-day role around audits

In practice, a GRC analyst spends a lot of time on **evidence collection** — gathering screenshots, exports, and tickets that prove controls operated, often using a compliance automation platform (Vanta, Drata, Secureframe) that continuously pulls evidence from AWS, GitHub, Okta, etc. Knowing these tools exist — and roughly what they automate — is genuinely useful for interviews in this field.

## 🧪 Hands-on lab — design an evidence collection plan

1. Pick three controls a SaaS company would need for a SOC 2 Security audit (e.g. "MFA enforced on all admin accounts," "quarterly access reviews," "vulnerability scans run monthly").
2. For each control, write down: what specific evidence would prove it operated, not just that it exists as a policy?
3. For each, decide: could this evidence realistically be automated (pulled continuously from a tool like Okta or AWS), or does it require a manual step (someone filling out a form, taking a screenshot)?
4. Sketch a rough calendar for a 6-month Type II audit period: what evidence would need to be collected monthly vs. quarterly vs. just once?

:::challenge Test yourself
1. Why does a Type II report generally carry more weight with enterprise customers than a Type I report?
2. In the offboarding example, why is the auditor's finding recorded as an "exception" rather than an automatic failure of the whole report?
3. Why might a SOC 2 report with zero exceptions across an entire year actually raise suspicion for a sophisticated customer reviewing it?
:::

## Key terms

- **SOC 2** — an AICPA audit report (not a pass/fail certification) proving controls meet the Trust Services Criteria
- **Trust Services Criteria** — the five categories a SOC 2 report can cover: Security, Availability, Processing Integrity, Confidentiality, Privacy
- **Exception** — a documented instance where a control didn't operate as designed, noted in the audit report along with remediation
- **Compliance automation platform** — tools (Vanta, Drata, Secureframe) that continuously pull evidence from cloud/IT systems to reduce manual audit prep

## Recap

SOC 2 is a report, not a certificate, and its real value lies in the evidence trail proving controls operated consistently — especially in a Type II audit spanning months, not a single point in time. A handful of well-explained exceptions is normal and expected; what matters to a customer reading the report is the pattern of findings and the quality of the company's response, not a fantasy of perfection.

???refs
- [AICPA SOC 2 overview](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) — the official source for the Trust Services Criteria
- [Vanta's SOC 2 guide](https://www.vanta.com/resources/soc-2) — a practical, vendor-written but widely referenced explainer
???
