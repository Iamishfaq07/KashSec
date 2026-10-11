# ISO 27001 Overview

ISO/IEC 27001 is the world's most widely recognised information security management standard. Getting "ISO 27001 certified" is a common ask from enterprise customers and a common GRC career milestone.

:::tip
This is the single most important thing to understand about ISO 27001: it certifies a *process*, not a snapshot. An auditor checks that your ISMS is alive and operating, not just that a policy document exists.
:::

## What it actually is

ISO 27001 isn't a checklist of technical controls — it's a standard for building an **Information Security Management System (ISMS)**: the ongoing process of identifying risks, choosing controls, and continuously improving. The certification proves you *run a system*, not just that you own a firewall.

A useful way to explain this to a skeptical engineer: ISO 27001 doesn't tell you "you must use this specific firewall" — it tells you "you must have a documented, repeatable process for deciding what controls you need, implementing them, checking they work, and improving them." The standard is about the *system that produces good security decisions over time*, not any single decision.

## The core structure

- **Clauses 4–10** — the management-system requirements: context, leadership, planning, support, operation, performance evaluation, improvement. This is the "how you run security as a program" half.
- **Annex A** — a reference set of 93 controls (in the 2022 revision) grouped into four themes: Organisational, People, Physical, Technological. This is the "what controls exist" half.

You don't have to implement every Annex A control — you formally justify which ones apply to your organisation in a document called the **Statement of Applicability (SoA)**, and justify excluding the rest.

| Clause 4-10 area | Roughly answers |
|---|---|
| Context (4) | What's the scope of our ISMS? What are our internal/external issues? |
| Leadership (5) | Is management genuinely committed, with resources and a policy? |
| Planning (6) | What risks did we identify, and what's our treatment plan? |
| Support (7) | Do we have the competence, awareness, and documentation to run this? |
| Operation (8) | Are we actually executing the risk treatment plan day to day? |
| Performance evaluation (9) | Are we measuring whether it's working — internal audits, management review? |
| Improvement (10) | When we find gaps, do we fix them and feed lessons back in? |

## The PDCA cycle

ISO 27001 is built on **Plan–Do–Check–Act**, the same continuous-improvement loop used across quality-management standards:

1. **Plan** — assess risks, decide on controls (produce the SoA).
2. **Do** — implement the controls.
3. **Check** — internal audits, management review, monitor if controls are working.
4. **Act** — fix gaps, improve, repeat the cycle.

:::warn
The most common reason organisations fail their first certification attempt isn't missing technical controls — it's a weak "Check" phase. Auditors specifically look for evidence of internal audits and management reviews that actually happened, with real findings, not a rubber-stamped "everything is fine" report produced the week before the external audit.
:::

## What the certification process looks like

1. Gap assessment against the standard.
2. Implement missing controls and documentation.
3. Internal audit (often required before the external one).
4. **Stage 1 audit** — external auditor reviews documentation readiness.
5. **Stage 2 audit** — external auditor tests whether controls are actually operating.
6. Certification issued (valid 3 years), with annual **surveillance audits** in between.

### What Stage 2 actually looks like in practice

A Stage 2 auditor doesn't just read your access control policy — they'll pull a sample of employees, ask for evidence their access was reviewed on the schedule your policy specifies, and check whether any terminated employees still had active accounts past your own offboarding SLA. This is the difference between Stage 1 (does the paperwork exist and make sense?) and Stage 2 (is the paperwork actually true?) — and it's why organisations that "write the ISMS the week before the audit" almost always fail Stage 2 even after passing Stage 1.

## Examples of Annex A controls

- A.5.1 — Policies for information security
- A.8.1 — User endpoint devices (BYOD, hardening)
- A.5.23 — Information security for use of cloud services
- A.8.24 — Use of cryptography
- A.6.3 — Information security awareness, education and training

Notice these span policy, technical, and people controls — ISO 27001 deliberately doesn't let you "solve" security with only one type of control.

## Why it matters for your career

ISO 27001 knowledge is directly useful for GRC analyst, security manager, and compliance roles — and the certification process itself is a great way to learn how a real security program is documented end-to-end, even if you never sit the Lead Implementer/Auditor exam.

## 🧪 Hands-on lab — build a mini Statement of Applicability

1. Pick a small hypothetical company (a 15-person SaaS startup is a good default).
2. From the Annex A control list (search "ISO 27001:2022 Annex A controls" for the full list), select 8 controls you think are clearly applicable, and 2 you think could reasonably be excluded.
3. For each applicable control, write one sentence on how the company would actually implement it (concrete, not "we will comply").
4. For each excluded control, write the justification an auditor would need to see (e.g. "A.7.x physical server room controls — excluded, we are fully cloud-hosted with no on-premises data center").
5. Pick one control and sketch what Stage 2 evidence an auditor would ask for to verify it's actually operating, not just documented.

:::challenge Test yourself
1. Why does ISO 27001 certify a process rather than a fixed set of technical controls?
2. What's the difference between what a Stage 1 auditor checks and what a Stage 2 auditor checks?
3. A company excludes an Annex A control from their Statement of Applicability. Is that automatically a red flag? Why or why not?
:::

## Key terms

- **ISMS** — Information Security Management System, the ongoing process ISO 27001 certifies
- **Statement of Applicability (SoA)** — the document justifying which Annex A controls apply and which are excluded
- **PDCA** — Plan-Do-Check-Act, the continuous improvement cycle underlying the standard
- **Surveillance audit** — the annual check-in audit between full 3-year recertification cycles

## Recap

ISO 27001 certifies that an organisation runs a genuine, continuously-operating security management system — risk-driven, documented, and independently verified — not that it owns any specific set of tools. The Statement of Applicability and the PDCA cycle are the two concepts worth knowing cold, because they're what every auditor conversation comes back to.

???refs
- [ISO/IEC 27001 official page](https://www.iso.org/standard/27001) — the standard itself
- [ISO 27001 Annex A controls overview](https://www.isms.online/iso-27001/annex-a/) — a practical breakdown of the 93 controls
???
