# What is GRC?

GRC stands for **Governance, Risk, and Compliance** — the discipline of making sure an organisation's security actually matches what it's supposed to do, can prove it, and manages the risks it can't eliminate.

:::tip
If offensive security asks "can I break in?" and defensive security asks "can I detect and stop it?", GRC asks "are we doing the right things, consistently, and can we prove it?" All three questions matter; GRC is the one that keeps the other two honest over time, not just on the day of a pentest.
:::

## Why this is a real, growing career path

Every regulated company — banks, healthcare, SaaS vendors selling to enterprises — needs people who can:

- Translate security into policy and process
- Manage risk decisions the business can actually understand
- Pass audits (SOC 2, ISO 27001, PCI-DSS) without a fire drill every time

It's less "break into systems," more "make sure the system of controls doesn't quietly rot." It pays well, it's in demand, and — unlike a lot of security work — you don't need to be a coder to get in. Some of the strongest GRC professionals come from law, finance, or operations backgrounds and pick up the technical vocabulary along the way, rather than the other direction.

## The three pillars

**Governance** — the structure of decision-making. Who owns security decisions? What policies exist? Is there a security committee, a budget, clear accountability? Without governance, the other two pillars have no foundation: risk decisions get made by whoever's loudest, and compliance becomes a scramble every audit cycle because nobody owns keeping controls current between audits.

**Risk** — identifying, measuring, and deciding what to do about threats to the business (accept, mitigate, transfer via insurance, or avoid). Risk management is really a business-judgment discipline wearing a security hat — the hard part usually isn't finding risks, it's prioritizing which ones actually deserve budget and attention this quarter.

**Compliance** — proving, with evidence, that you're meeting a specific standard (a law, a contract, an industry framework) — not just doing security, but *documenting* that you did it. An auditor doesn't take your word for it; they want the access review spreadsheet, the ticket showing MFA was enabled on this date, the signed policy acknowledgment.

| Pillar | Core question | Typical artifact |
|---|---|---|
| Governance | Who decides, and how? | Org chart, security committee charter, policy approval process |
| Risk | What could go wrong, and how bad? | Risk register, risk scoring matrix |
| Compliance | Can we prove we did it? | Audit evidence, control mapping, signed attestations |

:::warn
A common trap for people new to GRC: treating compliance as the whole job. A company can be fully "compliant" with a framework and still be genuinely insecure, if the framework's controls were checked off superficially rather than actually operated. Compliance is evidence of security, not a substitute for it.
:::

## A concrete example

A company wants to sell software to a hospital. The hospital's legal team asks for a SOC 2 report. That single ask cascades into:

- **Governance**: someone has to own "we will get SOC 2 compliant" as a project
- **Risk**: a risk assessment identifying what could go wrong with patient data
- **Compliance**: actual controls (MFA, encryption, access reviews, incident response plan) implemented, documented, and audited by a third party

None of this requires exploiting a single vulnerability. It requires organisation, writing, and the ability to get busy engineers to actually follow a process.

## Walking the example forward

Say the company's engineering team resists adding quarterly access reviews because "it's busywork." A GRC professional's job here isn't to overrule engineering with authority they don't have — it's to translate the requirement into terms that land: "the hospital's legal team will not sign a contract worth $400k/year without this control being demonstrably in place for at least one full quarter before the audit." That reframing — from "compliance says so" to "this blocks revenue" — is the actual day-to-day skill of GRC work, far more often than writing policy documents in isolation.

## How this path fits with the rest of the course

The earlier paths (Web Security, Network Security, Cloud Security, etc.) teach you *what the risks are* technically. This path teaches you how organisations *manage* those risks systemically — the two skill sets are complementary, and a lot of senior security roles blend both. A technical background is a real asset in GRC, because it lets you tell the difference between a control that's genuinely operating and one that just looks good on paper.

## 🧪 Hands-on lab — map your own "compliance cascade"

1. Pick any software product or service you use regularly (a bank, a SaaS tool, a hospital patient portal).
2. Research (via their public trust/security page, if they have one) what compliance frameworks they claim to follow.
3. For one framework claim, list at least three concrete controls you'd expect to exist behind it (e.g. "SOC 2" → MFA enforcement, encrypted backups, documented incident response).
4. Write one governance question, one risk question, and one compliance question you'd ask that company's security team if you were their new hospital-legal-team customer doing due diligence.

:::challenge Test yourself
1. Explain in one sentence why "we're SOC 2 compliant" does not automatically mean "we're secure."
2. Which of the three GRC pillars would own the decision to accept a known risk rather than fix it, and why does that require business judgment rather than just technical judgment?
3. In the hospital example, why is "translate compliance into revenue impact" often more effective than "compliance says so" when getting engineering buy-in?
:::

## What's ahead in this path

- Governance structures and how security decisions actually get made
- Risk management fundamentals — how to assess and prioritise risk like a professional
- The big three frameworks: ISO 27001, NIST CSF, SOC 2
- Writing policies people will actually follow
- Third-party and vendor risk (the weak link in most breaches)
- GRC tools, certifications, and how to break into the field

## Key terms

- **Governance** — the structure and accountability behind security decision-making
- **Risk register** — a living document tracking identified risks, their severity, and their treatment
- **Compliance framework** — a defined set of controls an organisation attests to following (ISO 27001, SOC 2, NIST CSF, etc.)
- **Control** — a specific, checkable measure implemented to reduce a risk (e.g. "MFA is required for all admin accounts")

## Recap

GRC is the discipline that keeps security decisions organised, risk-informed, and provable — three separate but tightly linked pillars. It's a legitimate, growing career path that rewards clear communication and organisational skill as much as technical depth, and it's the layer that makes sure the technical controls covered elsewhere in this course keep working over time, not just on launch day.

???refs
- [OWASP SAMM](https://owaspsamm.org/) — a maturity model bridging AppSec and governance
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — covered in depth later in this path
- [AICPA SOC 2 overview](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) — the framework behind the hospital example above
???
