# SBOM & Software Bill of Materials

The secrets-supply-chain lesson covered typosquatting and dependency confusion as supply-chain attack vectors. This lesson covers the defensive tool increasingly mandated specifically to manage that same supply-chain risk at scale — the **Software Bill of Materials (SBOM)** — directly connecting to Path 23's GRC lesson, since SBOM requirements have moved from best practice into genuine regulatory and contractual mandate in several sectors.

## What an SBOM actually is

A **Software Bill of Materials** is a formal, machine-readable inventory of every component — every library, every dependency, every transitive dependency of those dependencies — that makes up a piece of software, along with version information for each. The concept borrows directly from manufacturing's traditional bill of materials (a parts list for a physical product), applied to software's often-invisible internal composition.

```
Application: PaymentService v2.4.1
├── express@4.18.2
├── jsonwebtoken@9.0.0
│   └── jws@3.2.2
│       └── jwa@1.4.1
├── lodash@4.17.21
└── ... (247 more dependencies)
```

## Why SBOMs became urgent, not just nice-to-have

Directly connecting to the secrets-supply-chain lesson's supply-chain attack coverage: several major, publicly disclosed supply-chain incidents — a widely-used dependency compromised, then silently pulled into thousands of downstream applications that had no way of knowing they depended on it, directly or transitively — made a genuinely uncomfortable fact clear across the industry: most organizations, until fairly recently, couldn't actually answer "are we affected by this vulnerable component?" quickly or confidently, simply because nobody had a complete, accurate inventory of what their software actually contained.

## The transitive dependency problem, specifically

A genuinely important, easy-to-underestimate point: an application's direct dependencies (the ones explicitly listed in its own package manifest) are usually well understood — but each of those dependencies has its own dependencies, and so on, several layers deep. A vulnerability disclosed in a package three or four layers down the dependency tree, one the development team has likely never even heard of directly, can still affect the application just as severely as a vulnerability in a directly-chosen, well-known dependency — an SBOM's entire value proposition is making that full, deep dependency tree visible and queryable, rather than only the top-level list a `package.json` or similar manifest shows.

## SBOM formats — SPDX and CycloneDX

Two standardized, widely-adopted SBOM formats dominate in practice: **SPDX** (Software Package Data Exchange, originally focused on license compliance, now broadly used for security purposes too) and **CycloneDX** (originally purpose-built for security use cases specifically). Both are machine-readable formats designed to be generated automatically as part of a build process and consumed automatically by vulnerability-matching tools, rather than manually maintained documents that inevitably go stale.

## Generating and using SBOMs in practice

Directly connecting to the SAST/DAST/SCA lesson's SCA (Software Composition Analysis) coverage: most modern SCA tools can generate an SBOM directly as part of their normal scanning process — the practical workflow is generating an SBOM automatically on every build (via tools like **Syft**), storing it alongside the built artifact, and then, when a new vulnerability is publicly disclosed in any component, querying stored SBOMs across the entire organization's software inventory to instantly identify every affected application, rather than manually checking each application's dependencies one at a time.

## Regulatory and contractual momentum behind SBOMs

Directly connecting to Path 23's GRC/compliance coverage: SBOM requirements have moved from voluntary best practice into explicit mandate in several contexts — US federal government software procurement now requires SBOMs from vendors under a 2021 executive order, and several industry-specific regulatory frameworks are moving in the same direction. This means SBOM generation is increasingly not just a defensive security practice but a genuine compliance and contractual requirement an AppSec program needs to actively support.

:::challenge Test yourself
Why does a vulnerability disclosed in a transitive dependency several layers deep in an application's dependency tree pose a genuine risk-visibility problem, even for a development team that carefully vets every dependency they directly choose?
:::

## Key terms

- **SBOM (Software Bill of Materials)** — a formal, machine-readable inventory of every component in a piece of software, including transitive dependencies.
- **Transitive dependency** — a dependency of a dependency, often several layers removed from what a development team directly and knowingly chose.
- **SPDX / CycloneDX** — the two dominant standardized, machine-readable SBOM formats.

## Recap

An SBOM provides a complete, machine-readable inventory of every component in a piece of software, including deep transitive dependencies most development teams have never directly examined. This solves a genuine, previously widespread problem: organizations unable to quickly answer whether they're affected by a newly disclosed vulnerability in some component buried deep in their dependency tree. SPDX and CycloneDX are the dominant formats, SCA tools like Syft can generate SBOMs automatically as part of every build, and SBOM requirements have moved into genuine regulatory and contractual mandate in several sectors.

???refs
- [CycloneDX](https://cyclonedx.org/) — a security-focused SBOM standard.
- [CISA — SBOM resources](https://www.cisa.gov/sbom) — official US government guidance and requirements.
- [Syft](https://github.com/anchore/syft) — a widely-used open-source SBOM generation tool.
???
