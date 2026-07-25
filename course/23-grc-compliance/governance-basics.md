# Security Governance Basics

Governance is the "who decides, and how" layer of security. Without it, even good technical controls drift — nobody owns keeping them alive, and the moment the person who built a control leaves, so does the institutional knowledge of why it exists.

:::tip
A useful test for whether governance is real: pick any security control at random and ask "who would notice if this silently broke, and how long would it take them to find out?" If the honest answer is "nobody, probably never," governance has a gap.
:::

## What governance actually covers

- **Ownership** — who is accountable for security outcomes? (Often a CISO, but in smaller companies it might be a single engineering lead wearing many hats.)
- **Policy** — the documented rules the organisation has committed to (acceptable use, access control, incident response, data classification).
- **Structure** — committees, review boards, and reporting lines that make sure security decisions get made and don't just live in one person's head.
- **Oversight** — how leadership (and sometimes the board) gets visibility into security posture and risk.

:::warn
A policy that exists only as a PDF nobody reads isn't governance — it's paperwork. Real governance means the policy is followed, reviewed, and enforced. Auditors are increasingly good at spotting the difference: ask for the last three access-review tickets, not just the access-review policy document.
:::

## The governance hierarchy

Most mature security programs have a layered structure:

1. **Policy** — high-level statement of intent ("We will encrypt data at rest and in transit").
2. **Standard** — the specific, measurable rule that implements the policy ("All databases must use AES-256 encryption").
3. **Procedure** — the step-by-step instructions to meet the standard ("Run this Terraform module to enable encryption on a new RDS instance").
4. **Guideline** — recommended (not mandatory) advice ("Consider rotating keys every 90 days").

This hierarchy matters because auditors and regulators ask for exactly this structure — and because it lets you change *how* you do something (procedure) without rewriting *what* you're committed to (policy).

| Level | Changes how often | Who approves it |
|---|---|---|
| Policy | Rarely (annually, or on major change) | Leadership / security committee |
| Standard | Occasionally (as technology changes) | Security team |
| Procedure | Frequently (as tools and processes evolve) | Team implementing it |
| Guideline | As needed | Anyone with relevant expertise |

Notice the pattern: the higher up the hierarchy, the harder it should be to change, and the more people should be involved in changing it. A procedure that changes weekly as a team refines its tooling is healthy. A policy that changes weekly means either the policy was written too specifically, or nobody's actually enforcing stability at that level.

## Who's actually in the room

- **CISO / Head of Security** — owns the program, reports risk to leadership.
- **Security Steering Committee** — cross-functional (legal, engineering, HR, finance) group that reviews major risk decisions.
- **Data Protection Officer (DPO)** — required under some laws (e.g. GDPR) for handling personal-data risk specifically.
- **Internal Audit** — checks that controls are actually operating as documented, independent of the team that built them.

## A governance red flag worth knowing

If the same team designs a control, implements it, *and* audits itself with no independent check, that's a segregation-of-duties failure — one of the most common findings in real audits. Governance exists partly to prevent exactly this.

### Worked example

An engineering team implements a code-review requirement (every PR needs a second approver before merge) and is also the team that reports "100% compliance" with this policy to leadership every quarter, based on their own internal tracking. No one outside the team ever samples actual PRs to verify the number. Six months later, an incident review discovers a pattern of self-approved emergency merges that were never counted in the compliance number, because the team's own tracking script silently excluded anything tagged "hotfix." This is exactly the failure segregation of duties exists to catch: the team measuring its own compliance had every incentive, even unintentionally, to under-report gaps.

## Why this matters even if you're not "in GRC"

Every engineer eventually runs into governance: the security review that blocks a launch, the policy that says production access requires MFA, the change-management process before a deploy. Understanding *why* these exist — not just that they're annoying — makes you far more effective working within (or around, safely) a security program.

## 🧪 Hands-on lab — build a policy hierarchy

Pick a security topic you care about (e.g. "how we handle laptops that get lost or stolen").

1. Write one sentence at the **policy** level — the high-level commitment.
2. Write one sentence at the **standard** level — the specific measurable rule.
3. Write a short numbered **procedure** — the actual steps someone follows.
4. Write one optional **guideline** — a recommendation, not a requirement.
5. Identify: who should approve each level, and how often should each realistically be reviewed?

:::challenge Test yourself
1. Why does putting a policy change through a heavier approval process than a procedure change make sense operationally?
2. In the self-reporting compliance example, what's the simplest governance fix that would have caught the "hotfix" exclusion sooner?
3. Name one security control at your own job (or a hypothetical one) and answer: who would notice if it silently broke?
:::

## Key terms

- **Policy hierarchy** — the layered structure of policy → standard → procedure → guideline
- **Segregation of duties** — ensuring no single person or team both performs and self-verifies a control
- **CISO** — Chief Information Security Officer, typically the senior accountable owner for a security program
- **Oversight** — the mechanism by which leadership gets independent visibility into security posture

## Recap

Governance is the structural layer that keeps security decisions accountable, documented, and independently checked — without it, even well-designed controls quietly decay because nobody owns keeping them alive. The policy hierarchy and segregation of duties are the two governance concepts you'll see referenced in nearly every audit framework covered later in this path.

???refs
- [NIST SP 800-53 — Governance controls](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) — a comprehensive federal controls catalog including governance
- [ISACA — Segregation of Duties](https://www.isaca.org/resources/isaca-journal) — professional body covering governance and audit practice
???
