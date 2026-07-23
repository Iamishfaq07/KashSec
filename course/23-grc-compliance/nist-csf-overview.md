# NIST Cybersecurity Framework (CSF) Overview

The NIST CSF is a US-government-originated but globally used framework — far more common as a practical, non-certifiable reference model than ISO 27001, especially in the US private sector.

## Why it's different from ISO 27001

ISO 27001 is something you get *certified against* by a third-party auditor. NIST CSF is a **voluntary framework** — there's no official "NIST CSF certified" badge. Instead, organisations use it as a common language to describe their security maturity and communicate it to leadership, regulators, and partners.

:::tip
It's common for a company to use NIST CSF internally to organise its program, while pursuing ISO 27001 or SOC 2 externally for formal certification. They're not competitors — they overlap and reinforce each other.
:::

## The six functions (CSF 2.0)

NIST CSF 2.0 (2024) organises everything into six top-level functions:

1. **Govern (GV)** — the newest function (added in 2.0): strategy, roles, policy, risk management oversight. This ties CSF much closer to real governance than the original 2014 version.
2. **Identify (ID)** — know your assets, risks, and business context.
3. **Protect (PR)** — safeguards: access control, training, data security.
4. **Detect (DE)** — find security events as they happen.
5. **Respond (RS)** — contain and manage an active incident.
6. **Recover (RC)** — restore capabilities and services after an incident.

Each function breaks down into categories and subcategories — hundreds of specific outcomes you can map your controls against.

## Maturity Tiers

CSF also scores an organisation's overall approach on four tiers:

- **Tier 1 — Partial**: ad hoc, reactive, undocumented.
- **Tier 2 — Risk Informed**: risk management practices exist but aren't organisation-wide.
- **Tier 3 — Repeatable**: formally approved policies, consistently applied.
- **Tier 4 — Adaptive**: continuously improving based on lessons learned and predictive indicators.

Most companies honestly sit at Tier 1 or 2 — knowing this helps you set realistic expectations rather than assuming everyone should be Tier 4.

## A practical use: gap analysis

A common real-world GRC task is a **CSF-based gap analysis**: for each of the ~100+ subcategories, rate current maturity (0–4), identify the target maturity, and produce a prioritised roadmap to close the biggest gaps. This is often the very first deliverable a new GRC hire or a security consultant produces for a client.

## How it maps to what you already know

- "Identify" overlaps with asset management and threat modeling (Path 22).
- "Protect" overlaps with most of the technical paths in this course (access control, crypto, network security).
- "Detect" and "Respond" map directly to Path 15/blue-team content — SOC monitoring, incident response.
- "Recover" maps to disaster recovery and business continuity — a topic GRC owns more than any other team.

Understanding CSF gives you a mental map for organising *everything else you've learned in this course* into one coherent security program.
