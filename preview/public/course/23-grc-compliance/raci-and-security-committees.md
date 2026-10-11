# RACI & Security Committees

The governance-basics lesson covered who's actually in the room and the policy hierarchy. This lesson goes deep into the specific structural tools that make governance function in practice rather than existing only on an org chart — the **RACI matrix** and formal **security committees** — directly connecting to Path 22's building-appsec-program lesson's governance-without-bureaucracy coverage, since these tools are exactly how that balance actually gets achieved operationally.

## Why governance needs explicit structure, not just goodwill

A genuinely common early-career misconception: assuming that once the right people are generally aware of security's importance, decisions and accountability will naturally sort themselves out. In practice, without explicit structure, security decisions frequently either happen nowhere (everyone assumes someone else owns it) or happen everywhere redundantly (multiple people making conflicting decisions about the same issue) — both genuinely common, costly failure modes this lesson's tools directly address.

## RACI, precisely defined

A **RACI matrix** assigns exactly one of four roles to every relevant person or team for a given decision or task:

| Role | Meaning |
|---|---|
| **Responsible** | Does the actual work |
| **Accountable** | Owns the outcome — exactly one person per decision, the final decision-maker |
| **Consulted** | Provides input before the decision, two-way communication |
| **Informed** | Told about the decision after it's made, one-way communication |

The single most valuable discipline RACI enforces: exactly **one** person holds Accountable for any given decision — directly preventing the "everyone assumes someone else owns it" failure mode, since ambiguity about accountability is structurally eliminated by the matrix's own format.

## A worked RACI example — approving a new SaaS vendor

| Task | Security Team | Legal | Department Requesting Tool | CISO |
|---|---|---|---|---|
| Vendor security questionnaire | R | C | C | A |
| Data processing agreement review | C | R | I | A |
| Final approval decision | C | C | I | A |

Directly connecting to the third-party-vendor-risk lesson: this table makes explicit exactly who does the work (Security runs the questionnaire), who provides input (Legal on the contract, the requesting department on business need), and who's ultimately accountable (the CISO) — eliminating the genuinely common real-world confusion about "wait, who actually approves this?"

## Security committees — where cross-functional decisions actually happen

A **security steering committee** (or similarly named body) provides the recurring, structured forum where security decisions requiring cross-functional input actually get made, rather than happening in ad hoc hallway conversations or getting stuck waiting for an opportunistic meeting. Directly connecting to the governance-basics lesson's "who's in the room" coverage, a well-functioning committee typically includes representation from security, engineering leadership, legal, and sometimes finance — with clear, published meeting cadence and decision authority, not just a standing invite list that rarely actually convenes.

## Why committees fail — and how to prevent it

A genuinely common failure pattern worth naming directly: a security committee that meets regularly but has no actual decision-making authority, existing purely to receive status updates rather than to genuinely deliberate and decide anything — directly connecting to Path 22's metrics-that-matter lesson's trust-building coverage, a committee perceived as a rubber-stamp exercise quickly loses genuine engagement from busy stakeholders who correctly conclude their actual presence isn't changing outcomes. A functioning committee needs real agenda items requiring genuine decisions, not just information broadcast.

## RACI applied to incident response specifically

Directly connecting to Path 16's DFIR lesson: RACI is genuinely valuable applied to incident response specifically, since incident response under real time pressure is exactly when accountability ambiguity causes the most damage — a pre-defined RACI matrix for incident severity tiers (who's Accountable for a critical incident's public communication decision, for instance) removes exactly the kind of confusion that costs precious response time when it matters most.

:::challenge Test yourself
Why does RACI's rule that exactly one person holds "Accountable" for any given decision matter more than simply ensuring many relevant people are generally aware of and involved in that decision?
:::

## Key terms

- **RACI matrix** — a structural tool assigning Responsible, Accountable, Consulted, and Informed roles explicitly for a given decision.
- **Security steering committee** — a recurring, cross-functional forum with genuine decision-making authority for security matters.
- **Accountability ambiguity** — the common governance failure where a decision has no single clear owner, causing it to be made nowhere or redundantly everywhere.

## Recap

Without explicit structure, security decisions predictably fall into two failure modes: made nowhere, or made redundantly and conflictingly everywhere. RACI eliminates accountability ambiguity by assigning exactly one Accountable owner per decision, alongside clearly defined Responsible, Consulted, and Informed roles. Security committees provide the recurring forum where cross-functional decisions actually happen, but only function well when they carry genuine decision-making authority rather than existing as a status-broadcast exercise. Applying RACI to incident response specifically prevents exactly the accountability confusion that costs response time under real pressure.

???refs
- [ISACA — RACI Chart Guidance](https://www.isaca.org/resources)
- [SANS — Building a Security Steering Committee](https://www.sans.org/white-papers/)
???
