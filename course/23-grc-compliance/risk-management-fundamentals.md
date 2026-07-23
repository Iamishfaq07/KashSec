# Risk Management Fundamentals

Risk management is the engine room of GRC: deciding what to worry about, how much, and what — if anything — to do about it.

## The core formula

You've likely seen this earlier in the course: **Risk ≈ Likelihood × Impact**. Everything in this lesson is just building real process around that simple idea.

## The risk register

A **risk register** is the master list: every identified risk, with an owner, a likelihood/impact score, and a plan. A simplified row might look like:

| Risk | Likelihood | Impact | Score | Owner | Treatment |
|---|---|---|---|---|---|
| Unpatched internet-facing server | High | High | Critical | IT Ops | Mitigate — patch within 30 days |
| Employee laptop theft | Medium | Low | Low | IT | Accept — disk encryption already mitigates |
| Vendor with weak security posture | Medium | High | High | Procurement | Mitigate — require SOC 2 report |

## The four ways to treat a risk

1. **Accept** — the cost of fixing it exceeds the cost of the risk; document the decision and move on. (This is a legitimate, common choice — not laziness.)
2. **Mitigate** — reduce likelihood or impact (patch the server, add MFA, train staff).
3. **Transfer** — shift the financial impact elsewhere, usually via cyber insurance or a vendor contract with liability clauses.
4. **Avoid** — stop doing the risky thing entirely (e.g. don't collect data you don't need).

:::tip
"Accept" is often the correct answer for low-value risks — a mature risk program *stops* people from gold-plating security on things that don't matter, as much as it pushes fixes where they do.
:::

## Qualitative vs quantitative risk

- **Qualitative** — High/Medium/Low scoring, fast, subjective, good for most day-to-day prioritisation. What most companies actually use.
- **Quantitative** — tries to put a real dollar figure on risk (e.g. FAIR — Factor Analysis of Information Risk). More rigorous, more work, used for big-ticket decisions (cyber insurance sizing, major investment justification).

## Inherent risk vs residual risk

- **Inherent risk** — how bad this would be with *no controls at all*.
- **Residual risk** — how bad it still is *after* your existing controls.

Auditors and risk committees care almost entirely about residual risk — the number after you've already done something about it. This distinction shows up constantly in real risk assessments.

## A worked example

*Risk*: "A developer accidentally commits an AWS secret key to a public GitHub repo."

- **Inherent risk**: High likelihood (developers make mistakes), High impact (full account compromise) → Critical.
- **Existing controls**: pre-commit secret scanning, GitHub secret scanning alerts, IAM keys scoped to least privilege.
- **Residual risk**: Low likelihood (caught before/soon after commit), Medium impact (scoped key limits blast radius) → Medium.
- **Treatment decision**: Mitigate further — rotate to short-lived credentials (OIDC instead of static keys) to push residual risk to Low.

This is the actual shape of a professional risk assessment — not a vibe, a documented chain of reasoning someone else can review and challenge.
