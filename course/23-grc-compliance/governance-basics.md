# Security Governance Basics

Governance is the "who decides, and how" layer of security. Without it, even good technical controls drift — nobody owns keeping them alive.

## What governance actually covers

- **Ownership** — who is accountable for security outcomes? (Often a CISO, but in smaller companies it might be a single engineering lead wearing many hats.)
- **Policy** — the documented rules the organisation has committed to (acceptable use, access control, incident response, data classification).
- **Structure** — committees, review boards, and reporting lines that make sure security decisions get made and don't just live in one person's head.
- **Oversight** — how leadership (and sometimes the board) gets visibility into security posture and risk.

:::warning
A policy that exists only as a PDF nobody reads isn't governance — it's paperwork. Real governance means the policy is followed, reviewed, and enforced.
:::

## The governance hierarchy

Most mature security programs have a layered structure:

1. **Policy** — high-level statement of intent ("We will encrypt data at rest and in transit").
2. **Standard** — the specific, measurable rule that implements the policy ("All databases must use AES-256 encryption").
3. **Procedure** — the step-by-step instructions to meet the standard ("Run this Terraform module to enable encryption on a new RDS instance").
4. **Guideline** — recommended (not mandatory) advice ("Consider rotating keys every 90 days").

This hierarchy matters because auditors and regulators ask for exactly this structure — and because it lets you change *how* you do something (procedure) without rewriting *what* you're committed to (policy).

## Who's actually in the room

- **CISO / Head of Security** — owns the program, reports risk to leadership.
- **Security Steering Committee** — cross-functional (legal, engineering, HR, finance) group that reviews major risk decisions.
- **Data Protection Officer (DPO)** — required under some laws (e.g. GDPR) for handling personal-data risk specifically.
- **Internal Audit** — checks that controls are actually operating as documented, independent of the team that built them.

## A governance red flag worth knowing

If the same team designs a control, implements it, *and* audits itself with no independent check, that's a segregation-of-duties failure — one of the most common findings in real audits. Governance exists partly to prevent exactly this.

## Why this matters even if you're not "in GRC"

Every engineer eventually runs into governance: the security review that blocks a launch, the policy that says production access requires MFA, the change-management process before a deploy. Understanding *why* these exist — not just that they're annoying — makes you far more effective working within (or around, safely) a security program.
