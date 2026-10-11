# Security frameworks & standards

You'll hear these acronyms constantly in job listings, audits, and workplace conversations. This lesson gives you enough working knowledge to nod along intelligently — and know where to look when you need the real detail.

## Why frameworks exist

Every organisation needs to answer: *"Are we secure enough?"* That's a vague question with no single right answer — so the industry built **frameworks**: structured, widely-agreed sets of controls, processes, and best practices that give a common language and a checklist to work against.

They serve several purposes at once:

- **Guidance** — a starting point instead of building security from scratch.
- **Compliance** — many industries legally *require* adherence to specific frameworks.
- **Communication** — "We're ISO 27001 certified" tells customers and partners something concrete and verifiable.
- **Audit** — a structured basis for a third party to assess your security.

## The major players — a field guide

### NIST Cybersecurity Framework (CSF)

Developed by the US National Institute of Standards and Technology. Organised around five (now six, in CSF 2.0) core functions:

```mermaid
flowchart LR
    Gov[Govern] --> Id[Identify]
    Id --> Pro[Protect]
    Pro --> Det[Detect]
    Det --> Res[Respond]
    Res --> Rec[Recover]

    style Gov fill:#111927,color:#EFA43A,stroke:#EFA43A
    style Id fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Pro fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Det fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Res fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Rec fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
```

- **Govern** — set strategy, policy, and risk expectations.
- **Identify** — know your assets, risks, and vulnerabilities.
- **Protect** — implement safeguards (access control, training, encryption).
- **Detect** — find security events as they happen.
- **Respond** — contain and remediate active incidents.
- **Recover** — restore normal operations and learn from the event.

Widely used across US industry, voluntary but hugely influential — a genuinely useful mental model even outside compliance contexts.

### ISO/IEC 27001

The leading **international** standard for an Information Security Management System (ISMS) — essentially, a formal, certifiable system of policies and controls for managing information security risk. Organisations can be independently **audited and certified** as ISO 27001 compliant, which is often required to do business with larger enterprises or in certain regulated industries.

### SOC 2

An American Institute of CPAs (AICPA) standard, extremely common for **SaaS and technology companies**. A SOC 2 report is produced by an independent auditor assessing controls across five "trust service criteria": Security, Availability, Processing Integrity, Confidentiality, Privacy. Startups pursuing enterprise customers are very often asked "Are you SOC 2 compliant?" as a baseline requirement before a deal proceeds.

### PCI DSS

**Payment Card Industry Data Security Standard** — mandatory for **any organisation that handles credit card data**. Extremely specific technical requirements (network segmentation, encryption of cardholder data, regular vulnerability scanning, restricted access). If you ever work in e-commerce or fintech, you will hear this constantly.

### HIPAA

US law governing protection of health information. **Healthcare providers, and the companies that process their billing, handle protected health information (PHI) and must comply with HIPAA's Security Rule**, covering access controls, audit logging, encryption, and breach notification requirements. If you work in or adjacent to healthcare in the US, this framework is not optional background knowledge — it's operational reality.

### GDPR

The EU's **General Data Protection Regulation** — the most influential privacy law globally, governing how personal data of EU residents must be collected, processed, stored, and protected, with serious financial penalties for violations. Even non-EU companies must comply if they handle EU residents' data — which is most of the internet.

### OWASP

Not a compliance framework in the traditional sense, but the essential **practical reference** for web application security specifically. You'll meet the **OWASP Top 10** (the ten most critical web application security risks) constantly starting in Path 11 — it's less "compliance checkbox" and more "the field's shared, practical vocabulary for common bugs."

### CIS Controls

Where NIST CSF and ISO 27001 are relatively high-level and strategic, the **CIS Critical Security Controls** (from the Center for Internet Security) are deliberately practical and prioritised — an ordered list of specific, concrete actions (inventory your assets, control admin privileges, continuously manage vulnerabilities) roughly ranked by real-world impact. Many smaller organisations without the resources for a full ISO 27001 certification use CIS Controls as a pragmatic "do these things first" starting checklist, and it maps cleanly onto much of Path 12's network security material — firewall configuration, patch management, and access control all show up directly as numbered CIS controls.

### SOC 2 Type I vs Type II — a distinction worth knowing precisely

When someone says "we're SOC 2 compliant," it's worth asking *which type*, because the two mean meaningfully different things. **Type I** is a point-in-time snapshot — an auditor confirms that the described controls exist and are designed appropriately, as of one specific date. **Type II** is far more rigorous: the auditor observes those controls actually *operating effectively* over an extended period, typically 3–12 months, checking evidence throughout rather than just a design review on one day. A Type II report is considerably more meaningful to enterprise customers precisely because it demonstrates sustained practice, not just a policy document that looked good on the day of the audit.

## Quick reference table

| Framework | Focus | Mandatory? | Where you'll meet it |
|---|---|---|---|
| **NIST CSF** | General cyber risk management | Voluntary (US), widely adopted | Any US-connected organisation |
| **ISO 27001** | Information security management system | Voluntary but often required by contract | Global enterprises, certifications |
| **SOC 2** | Trust criteria for service providers | Often demanded by enterprise customers | SaaS, tech startups |
| **PCI DSS** | Payment card data | Mandatory if handling card data | E-commerce, fintech |
| **HIPAA** | Health information | Mandatory (US healthcare) | Healthcare, health tech |
| **GDPR** | Personal data of EU residents | Mandatory (legal) | Anyone processing EU data |
| **OWASP Top 10** | Web app vulnerabilities | Not legal, but industry-standard practice | Every web security role |

## How this actually shows up in your day-to-day work

As a beginner, you won't be *managing* compliance programs — but you'll constantly bump into their downstream effects:

- A pentest report you write might need to map findings to specific **PCI DSS requirements** or **OWASP Top 10** categories.
- A vulnerability you find might need a **CVSS score** (Path 10.2) to help prioritise against a framework's risk thresholds.
- Your **secure SDLC work** (integrating SAST/DAST into pipelines) directly satisfies specific control requirements in most of these frameworks.
- Interview questions frequently probe whether you understand *why* these frameworks exist, not just their names.

## The honest take: frameworks are a floor, not a ceiling

A crucial, sometimes-uncomfortable truth: being "compliant" with a framework means you've met a **minimum baseline**, not that you're actually secure. Plenty of breached organisations were fully compliant with relevant frameworks at the time of their breach. Compliance reduces certain classes of risk and demonstrates due diligence — it doesn't replace genuine security engineering, testing, and vigilance. Treat frameworks as useful structure and a shared vocabulary, never as a substitute for the actual hard work covered throughout the rest of this course.

## 🧪 Lab — Map a familiar company

Pick a company or app you use daily (a bank, a SaaS tool, a healthcare provider). Research (their website often has a "Trust" or "Security" page) and try to answer:

1. Which of the frameworks above do they likely need to comply with, based on their industry?
2. Do they publish any compliance certifications (SOC 2, ISO 27001) publicly?
3. What's one control from NIST CSF 2.0's six functions you can find evidence of on their public site (e.g., a status page = Detect/Recover; a bug bounty program = Protect/Detect)?

This kind of "read between the lines" research is genuinely useful when evaluating vendors or preparing for interviews at a target company.

:::challenge Test yourself
A healthcare technology company handling patient billing data most directly needs to comply with which US framework, and why?

<details><summary>Show answer</summary><strong>HIPAA.</strong> Any organisation handling protected health information (PHI) in the US — including revenue cycle management and billing, even though it's financial rather than clinical data — falls under HIPAA's Security Rule requirements for safeguarding that information.</details>
:::

## Key terms

- **NIST CSF** — Govern/Identify/Protect/Detect/Respond/Recover framework.
- **ISO 27001** — international ISMS certification standard.
- **SOC 2** — trust-criteria audit report common in SaaS.
- **PCI DSS** — mandatory standard for payment card data.
- **HIPAA / GDPR** — health data (US) / personal data (EU) legal requirements.
- **OWASP Top 10** — the field's shared practical vocabulary for web vulnerabilities.

## Recap

- Frameworks give organisations shared structure, a compliance basis, and a communication tool.
- NIST CSF, ISO 27001, SOC 2, PCI DSS, HIPAA, and GDPR each serve different industries and purposes.
- OWASP is the practical, non-regulatory reference every web security professional needs.
- Compliance is a floor, not a ceiling — genuine security work goes well beyond checkbox adherence.

???refs
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework) — official, freely available.
- [ISO/IEC 27001 overview](https://www.iso.org/standard/27001) — the official standards body page.
- [AICPA SOC 2](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) — official overview.
- [PCI Security Standards Council](https://www.pcisecuritystandards.org/) — official PCI DSS documentation.
- [HHS — HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html) — official US guidance.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — bookmark this now, you'll use it constantly from Path 11 onward.
???

## 🎉 You've finished Path 10

You now understand the CIA triad, how to reason about threats/vulnerabilities/risk, the attacker's kill chain, malware categories, password security, social engineering, personal hardening, and the major compliance frameworks shaping the industry. This is the complete conceptual foundation — everything from Path 11 onward is applying these ideas hands-on.

**Next up →** [Security Metrics & KPIs](#/lesson/10-fundamentals/security-metrics-kpis)
