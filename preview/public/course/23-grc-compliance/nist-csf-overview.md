# NIST Cybersecurity Framework (CSF) Overview

The NIST CSF is a US-government-originated but globally used framework — far more common as a practical, non-certifiable reference model than ISO 27001, especially in the US private sector.

:::tip
It's common for a company to use NIST CSF internally to organise its program, while pursuing ISO 27001 or SOC 2 externally for formal certification. They're not competitors — they overlap and reinforce each other.
:::

## Why it's different from ISO 27001

ISO 27001 is something you get *certified against* by a third-party auditor. NIST CSF is a **voluntary framework** — there's no official "NIST CSF certified" badge. Instead, organisations use it as a common language to describe their security maturity and communicate it to leadership, regulators, and partners.

| | ISO 27001 | NIST CSF |
|---|---|---|
| Certifiable? | Yes, by accredited third-party auditors | No — self-assessed or consultant-assessed |
| Origin | International standards body | US government (NIST) |
| Structure | Clauses + Annex A controls | Six functions + categories/subcategories |
| Common use | External proof for customers/regulators | Internal program organisation, gap analysis |
| Best for | "We need a certificate to close this deal" | "We need a shared language to talk about maturity" |

## The six functions (CSF 2.0)

NIST CSF 2.0 (2024) organises everything into six top-level functions:

1. **Govern (GV)** — the newest function (added in 2.0): strategy, roles, policy, risk management oversight. This ties CSF much closer to real governance than the original 2014 version.
2. **Identify (ID)** — know your assets, risks, and business context.
3. **Protect (PR)** — safeguards: access control, training, data security.
4. **Detect (DE)** — find security events as they happen.
5. **Respond (RS)** — contain and manage an active incident.
6. **Recover (RC)** — restore capabilities and services after an incident.

Each function breaks down into categories and subcategories — hundreds of specific outcomes you can map your controls against.

:::warn
A common misreading is treating the six functions as a strict sequence — Identify, then Protect, then Detect, and so on. In reality all six operate continuously and simultaneously. An organisation is always identifying new assets, always protecting existing ones, always detecting, always ready to respond and recover — CSF is a wheel, not a timeline.
:::

## Maturity Tiers

CSF also scores an organisation's overall approach on four tiers:

- **Tier 1 — Partial**: ad hoc, reactive, undocumented.
- **Tier 2 — Risk Informed**: risk management practices exist but aren't organisation-wide.
- **Tier 3 — Repeatable**: formally approved policies, consistently applied.
- **Tier 4 — Adaptive**: continuously improving based on lessons learned and predictive indicators.

Most companies honestly sit at Tier 1 or 2 — knowing this helps you set realistic expectations rather than assuming everyone should be Tier 4.

## A practical use: gap analysis

A common real-world GRC task is a **CSF-based gap analysis**: for each of the ~100+ subcategories, rate current maturity (0–4), identify the target maturity, and produce a prioritised roadmap to close the biggest gaps. This is often the very first deliverable a new GRC hire or a security consultant produces for a client.

## A worked example: a mini gap analysis

Say a small company assesses two subcategories:

| Subcategory | Current tier | Target tier | Gap | Priority action |
|---|---|---|---|---|
| PR.AC — Access control | 1 (Partial) | 3 (Repeatable) | Large | Implement SSO + quarterly access reviews |
| DE.CM — Continuous monitoring | 2 (Risk Informed) | 2 (Risk Informed) | None | No action needed this cycle |

The point of scoring both current *and* target tier is that not every subcategory needs to reach Tier 4 — a company with modest resources deliberately sets realistic targets and focuses effort where the gap is both large and high-impact, rather than trying to max out every category at once. This is the same prioritization discipline from the risk management lesson, applied specifically to maturity rather than individual risks.

## How it maps to what you already know

- "Identify" overlaps with asset management and threat modeling (Path 22).
- "Protect" overlaps with most of the technical paths in this course (access control, crypto, network security).
- "Detect" and "Respond" map directly to blue-team content — SOC monitoring, incident response.
- "Recover" maps to disaster recovery and business continuity — a topic GRC owns more than any other team.

Understanding CSF gives you a mental map for organising *everything else you've learned in this course* into one coherent security program.

## 🧪 Hands-on lab — score a mini gap analysis

1. Pick a hypothetical small organisation (or a real one you're familiar with).
2. Choose four subcategories, one from each of Identify, Protect, Detect, and Respond (you can find the official subcategory list on NIST's CSF site).
3. For each, assign a current tier (1–4) based on a realistic guess, and a target tier.
4. Write one concrete action that would move each subcategory one tier higher.
5. Rank your four actions by priority, explaining your reasoning — which gap matters most given limited time and budget?

:::challenge Test yourself
1. Why is NIST CSF not something a company can get "certified" in, unlike ISO 27001?
2. Explain why treating the six CSF functions as a strict sequence is a misreading of the framework.
3. In the mini gap analysis example, why does DE.CM staying at Tier 2 with "no action needed" make sense, rather than being a red flag?
:::

## Key terms

- **NIST CSF** — the Cybersecurity Framework, a voluntary six-function model for organising a security program
- **Gap analysis** — comparing current maturity against target maturity to produce a prioritised roadmap
- **Maturity tier** — CSF's four-level scale (Partial, Risk Informed, Repeatable, Adaptive) for scoring program maturity
- **Govern (GV)** — the function added in CSF 2.0 tying the framework directly to organisational governance

## Recap

NIST CSF gives organisations a shared, non-certifiable vocabulary for describing security maturity across six continuously-operating functions, and it's especially useful as the internal organising structure a company runs even while pursuing a certifiable standard like ISO 27001 or SOC 2 externally. The gap-analysis exercise — current tier vs. target tier, prioritised — is the single most common real-world deliverable built on top of it.

???refs
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework) — the official framework site
- [NIST CSF 2.0 Quick Start Guide](https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-20/final) — a practical implementation reference
???
