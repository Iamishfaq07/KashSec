# Writing Policies People Actually Follow

Writing a security policy is easy. Writing one that survives contact with a busy engineering team is the actual skill — and it's a skill that separates GRC professionals whose programs actually work from ones whose policies are decoration.

:::tip
Before writing a single sentence of a new policy, ask: "how will anyone ever check whether this is being followed?" If you can't answer that, the policy isn't ready to write yet — it's still an idea.
:::

## Why most security policies fail

- **Too vague to act on** ("Use strong passwords" — how strong, enforced how?)
- **Written for auditors, not employees** — dense legal language nobody reads.
- **No owner** — nobody's job to keep it updated as the business changes.
- **No enforcement mechanism** — a rule with no consequence or technical control behind it is a suggestion.

:::warn
A policy that contradicts how people actually work will simply get ignored — and worse, it becomes evidence in an incident post-mortem that "the policy existed but wasn't followed," which looks far worse than having no policy at all.
:::

## The anatomy of a good policy document

1. **Purpose** — why this policy exists, in one or two sentences.
2. **Scope** — who and what it applies to (all employees? contractors? specific systems?).
3. **Policy statements** — the actual rules, numbered, specific, testable.
4. **Roles and responsibilities** — who owns enforcement, who approves exceptions.
5. **Exceptions process** — how someone requests a deviation (there's always a legitimate edge case).
6. **Enforcement** — what happens on violation.
7. **Review cadence** — when this gets revisited (annually is standard).

| Section | Bad example | Good example |
|---|---|---|
| Purpose | "Security matters." | "This policy defines how the organisation protects customer PII across its systems." |
| Scope | (missing entirely) | "Applies to all full-time employees, contractors, and any system processing customer data." |
| Enforcement | "Violations may be addressed." | "First violation: manager notification and retraining. Repeat violations: escalation to HR per the employee handbook." |

## A before/after example

**Before**: "Employees must use secure passwords."

**After**: "All employee accounts must be protected by a password meeting the organisation's password standard (minimum 12 characters, or a passphrase) *and* multi-factor authentication, enforced automatically through the identity provider (Okta/Azure AD). Exceptions require written approval from the CISO and expire after 90 days."

The second version is specific, testable by an auditor, and tells an engineer exactly what to build.

## A second before/after: an incident response policy statement

**Before**: "The company will respond appropriately to security incidents."

**After**: "Any employee who suspects a security incident must report it to security@company.com or the #security-incidents Slack channel within one hour of discovery. The on-call security engineer will triage and classify the incident within 30 minutes of report, per the Incident Response Procedure. Incidents classified as Critical trigger the Incident Commander process defined in that procedure."

Notice the second version has concrete timeframes, a specific reporting channel, and a pointer to a separate procedure document rather than trying to cram the entire response process into the policy itself.

## Policy vs. procedure — keep them separate

Bundling "why we do this" (policy) with "exactly how to do it" (procedure) makes a document that goes stale fast — the how-to steps change constantly (a new tool, a new UI), but the underlying commitment doesn't. Keep the policy short and stable; put the step-by-step instructions in a separate, more frequently updated procedure or runbook.

This mirrors the policy hierarchy from the governance lesson earlier in this path: policy → standard → procedure → guideline. A policy document that tries to also be a procedure document usually ends up unable to serve either purpose well.

## Getting buy-in before you publish

The best practical technique: draft the policy, then walk it past the team who'll actually have to follow it *before* it's finalised. Their pushback ("this will break our on-call process") usually reveals real problems that a purely top-down policy would have missed — and reviewing with them turns the policy from "something imposed on us" into something they helped shape, which massively improves real-world compliance.

## Core policies almost every organisation needs

Acceptable Use, Access Control, Data Classification & Handling, Incident Response, Vendor/Third-Party Risk, Business Continuity & Disaster Recovery, and an Information Security Policy that ties them all together at the top.

## 🧪 Hands-on lab — rewrite a vague policy statement

1. Pick one of these deliberately vague policy statements (or write your own): "Data must be protected appropriately," "Access should be limited to those who need it," "Vendors must have adequate security."
2. Rewrite it following the before/after pattern above: specific, testable, with a clear enforcement mechanism.
3. Draft the full seven-section anatomy (purpose through review cadence) for your rewritten statement.
4. Imagine presenting this to the engineering team who has to implement it. Write down one piece of pushback you'd realistically expect, and how you'd revise the policy in response.

:::challenge Test yourself
1. Why is "Employees must use secure passwords" untestable by an auditor, while the rewritten version is?
2. Explain why bundling policy and procedure into one document tends to make the whole document go stale faster.
3. A team pushes back that a new access-control policy will break their on-call rotation. What should happen next, and why is dismissing the pushback usually a mistake?
:::

## Key terms

- **Policy** — a high-level, stable statement of organisational commitment
- **Procedure** — the specific, frequently-updated steps that implement a policy
- **Exceptions process** — the defined path for requesting an approved deviation from policy
- **Enforcement mechanism** — the technical control or consequence that gives a policy statement teeth

## Recap

A good policy is specific, testable, owned, and reviewed on a cadence — and it's written with the people who'll actually follow it, not just handed down to them. The gap between a policy that exists and a policy that's followed is almost always closed by concreteness and buy-in, not by stricter wording.

???refs
- [SANS Information Security Policy Templates](https://www.sans.org/information-security-policy/) — a widely used free starting point
- [NIST SP 800-53 — Policy and Procedures family](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) — the federal controls catalog's take on policy structure
???
