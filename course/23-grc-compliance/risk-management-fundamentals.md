# Risk Management Fundamentals

Risk management is the engine room of GRC: deciding what to worry about, how much, and what — if anything — to do about it. Everything else in this path (frameworks, policies, vendor reviews) exists to feed information into, or act on the output of, this one process.

:::tip
The most common mistake newcomers make is treating risk management as "find all the bad things." The actual skill is prioritization under scarcity — every organisation has more identified risks than budget to fix them, and the job is picking correctly, not exhaustively.
:::

## The core formula

You've likely seen this earlier in the course: **Risk ≈ Likelihood × Impact**. Everything in this lesson is just building real process around that simple idea.

## The risk register

A **risk register** is the master list: every identified risk, with an owner, a likelihood/impact score, and a plan. A simplified row might look like:

| Risk | Likelihood | Impact | Score | Owner | Treatment |
|---|---|---|---|---|---|
| Unpatched internet-facing server | High | High | Critical | IT Ops | Mitigate — patch within 30 days |
| Employee laptop theft | Medium | Low | Low | IT | Accept — disk encryption already mitigates |
| Vendor with weak security posture | Medium | High | High | Procurement | Mitigate — require SOC 2 report |

A risk register is a living document, not a one-time exercise. Every entry needs a review date — a risk scored "Low" today because a mitigating control exists needs re-scoring the moment that control changes or lapses.

## The four ways to treat a risk

1. **Accept** — the cost of fixing it exceeds the cost of the risk; document the decision and move on. (This is a legitimate, common choice — not laziness.)
2. **Mitigate** — reduce likelihood or impact (patch the server, add MFA, train staff).
3. **Transfer** — shift the financial impact elsewhere, usually via cyber insurance or a vendor contract with liability clauses.
4. **Avoid** — stop doing the risky thing entirely (e.g. don't collect data you don't need).

:::tip
"Accept" is often the correct answer for low-value risks — a mature risk program *stops* people from gold-plating security on things that don't matter, as much as it pushes fixes where they do.
:::

:::warn
"Accept" without documentation and an owner is not risk acceptance — it's just an unmanaged risk that someone happened to notice once. A real acceptance decision needs a name attached, a date, and (usually) an expiry for re-review. Otherwise "we accepted that risk" becomes an unfalsifiable excuse two years later when it turns into an incident.
:::

## Qualitative vs quantitative risk

- **Qualitative** — High/Medium/Low scoring, fast, subjective, good for most day-to-day prioritisation. What most companies actually use.
- **Quantitative** — tries to put a real dollar figure on risk (e.g. FAIR — Factor Analysis of Information Risk). More rigorous, more work, used for big-ticket decisions (cyber insurance sizing, major investment justification).

| | Qualitative | Quantitative |
|---|---|---|
| Speed | Fast — hours per risk | Slow — days per risk, needs real data |
| Output | "High / Medium / Low" | "$340,000 expected annual loss" |
| Best for | Routine prioritization, most day-to-day decisions | Insurance sizing, board-level investment cases |
| Weakness | Subjective, hard to compare across teams | Requires good historical data, which is often missing |

Most organisations use qualitative scoring for the bulk of their risk register, and reach for quantitative analysis only for the handful of decisions big enough (a major cloud migration, a cyber insurance renewal) to justify the extra rigor.

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

## A second worked example, walked all the way to a decision

*Risk*: "Our customer support tool stores customer PII with no field-level encryption."

- **Inherent risk**: Medium likelihood (requires a breach of the support tool itself, which has its own defenses), High impact (PII exposure, regulatory notification obligations) → High.
- **Existing controls**: vendor-managed encryption at rest, access restricted to support staff via SSO, audit logging on record access.
- **Residual risk**: Low likelihood, Medium impact → Medium.
- **Options considered**: Mitigate (push the vendor for field-level encryption — costly, months of vendor negotiation), Accept (document the current residual risk as acceptable given existing controls and the vendor's own SOC 2 report), Transfer (confirm cyber insurance covers a breach originating from this specific vendor).
- **Decision made**: Accept for now, re-review in 6 months or immediately if the vendor's SOC 2 report shows any relevant control gaps, with the security lead as the named owner of the acceptance.

Notice this decision isn't "the safest possible option" — it's the *documented, owned, time-bound* option, which is what separates real risk management from either recklessness or paralysis.

## 🧪 Hands-on lab — build a mini risk register

1. Pick three risks relevant to a project you actually work on (or a hypothetical small company).
2. For each, score likelihood and impact (High/Medium/Low) and compute a rough overall severity.
3. For each, choose one of the four treatments (accept/mitigate/transfer/avoid) and justify it in one sentence.
4. For your "accept" risk (pick one even if none obviously fit), write the full acceptance record: owner, date, expiry/review date, and reasoning.
5. Pick one risk and walk it through inherent vs. residual scoring the way the worked examples above do — what controls already exist, and how much do they actually move the score?

:::challenge Test yourself
1. Why do auditors care almost entirely about residual risk rather than inherent risk?
2. A manager says "we'll just accept all our low-priority risks and move on" without writing anything down. What's missing, and why does it matter?
3. In the second worked example, why is "Accept for now, re-review in 6 months" a stronger answer than either "fix it immediately" or "ignore it"?
:::

## Key terms

- **Risk register** — the master tracked list of identified risks, scores, owners, and treatments
- **Inherent risk** — the risk level assuming no controls exist
- **Residual risk** — the risk level remaining after existing controls are accounted for
- **FAIR** — Factor Analysis of Information Risk, a common quantitative risk methodology
- **Risk treatment** — the chosen response to a risk: accept, mitigate, transfer, or avoid

## Recap

Risk management is a documented, repeatable decision process — score it, treat it, own it, and revisit it — not a one-time exercise or a gut feeling. The four treatment options are all legitimate; the skill is matching the right one to each risk and writing the reasoning down clearly enough that someone else could review and challenge it later.

???refs
- [NIST Risk Management Framework](https://csrc.nist.gov/projects/risk-management) — the federal standard risk process
- [FAIR Institute](https://www.fairinstitute.org/) — the leading quantitative risk methodology referenced above
- [ISO 31000](https://www.iso.org/iso-31000-risk-management.html) — the general international risk management standard
???
