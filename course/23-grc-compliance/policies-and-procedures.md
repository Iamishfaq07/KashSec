# Writing Policies People Actually Follow

Writing a security policy is easy. Writing one that survives contact with a busy engineering team is the actual skill.

## Why most security policies fail

- **Too vague to act on** ("Use strong passwords" — how strong, enforced how?)
- **Written for auditors, not employees** — dense legal language nobody reads.
- **No owner** — nobody's job to keep it updated as the business changes.
- **No enforcement mechanism** — a rule with no consequence or technical control behind it is a suggestion.

:::warning
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

## A before/after example

**Before**: "Employees must use secure passwords."

**After**: "All employee accounts must be protected by a password meeting the organisation's password standard (minimum 12 characters, or a passphrase) *and* multi-factor authentication, enforced automatically through the identity provider (Okta/Azure AD). Exceptions require written approval from the CISO and expire after 90 days."

The second version is specific, testable by an auditor, and tells an engineer exactly what to build.

## Policy vs. procedure — keep them separate

Bundling "why we do this" (policy) with "exactly how to do it" (procedure) makes a document that goes stale fast — the how-to steps change constantly (a new tool, a new UI), but the underlying commitment doesn't. Keep the policy short and stable; put the step-by-step instructions in a separate, more frequently updated procedure or runbook.

## Getting buy-in before you publish

The best practical technique: draft the policy, then walk it past the team who'll actually have to follow it *before* it's finalised. Their pushback ("this will break our on-call process") usually reveals real problems that a purely top-down policy would have missed — and reviewing with them turns the policy from "something imposed on us" into something they helped shape, which massively improves real-world compliance.

## Core policies almost every organisation needs

Acceptable Use, Access Control, Data Classification & Handling, Incident Response, Vendor/Third-Party Risk, Business Continuity & Disaster Recovery, and an Information Security Policy that ties them all together at the top.
