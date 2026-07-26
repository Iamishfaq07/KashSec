# Other Compliance Frameworks: PCI-DSS, HIPAA & Beyond

The SOC 2 and audits lesson covered the framework most B2B SaaS companies encounter first. This lesson broadens the picture to the other major compliance frameworks a GRC practitioner genuinely needs working familiarity with, since real GRC careers rarely stay confined to a single framework for long — directly connecting to Path 21's api-security-standards-and-frameworks lesson's point that these regulations carry direct legal weight beyond best practice.

## Why one framework rarely covers an entire organization

A genuinely common real-world situation: a healthcare technology company processing payment card data alongside protected health information needs to satisfy **PCI-DSS** and **HIPAA** simultaneously, potentially alongside SOC 2 for its enterprise customers and state-level data privacy laws for its consumer users — each framework has genuinely different scope, requirements, and enforcement mechanisms, and a GRC practitioner working at such a company needs to understand how they overlap and where they diverge.

## PCI-DSS — payment card data, with real enforcement teeth

**PCI-DSS (Payment Card Industry Data Security Standard)** applies to any organization that stores, processes, or transmits payment card data, with requirements around encryption, network segmentation, access control, and regular vulnerability scanning — directly connecting to Path 15's report-writing lesson's CVSS coverage, PCI-DSS explicitly mandates quarterly vulnerability scans and annual penetration testing by a qualified assessor. Unlike some frameworks that are effectively voluntary market requirements, PCI-DSS non-compliance carries genuine contractual and financial consequences directly from the payment card networks themselves, including potentially losing the ability to process card payments at all.

## HIPAA — healthcare data, with a genuinely different enforcement model

**HIPAA (Health Insurance Portability and Accountability Act)** governs protected health information in the US, with the **Security Rule** specifically covering technical and administrative safeguards. A genuinely important distinction from PCI-DSS: HIPAA enforcement is primarily complaint-driven and breach-driven, through the Department of Health and Human Services' Office for Civil Rights, rather than through a continuous certification-and-audit cycle the way SOC 2 or ISO 27001 operate — meaning a HIPAA compliance program's evidence and documentation practices matter enormously specifically because they become the primary defense if an actual breach investigation occurs, rather than being regularly externally verified in the interim.

## GDPR and state privacy laws — data protection with extraterritorial reach

Directly connecting to Path 21's rag-security-risks lesson's data-protection-regulation point: **GDPR (General Data Protection Regulation)**, the EU's data protection law, applies to any organization processing EU residents' personal data regardless of where that organization itself is based — a genuinely important extraterritorial reach that surprises organizations who assume geography alone determines applicability. US state-level privacy laws (California's CCPA/CPRA and similar laws in other states) increasingly create a genuinely fragmented compliance landscape, where an organization operating across multiple US states may need to satisfy several distinct, not-quite-identical state requirements simultaneously.

## The overlapping-controls reality

:::tip Most frameworks share far more than they differ
A genuinely practical insight that makes multi-framework compliance manageable rather than overwhelming: the large majority of actual technical and procedural controls (access control, encryption, incident response, vendor risk management — nearly everything this path has covered) genuinely overlap across PCI-DSS, HIPAA, SOC 2, ISO 27001, and GDPR, even though each framework describes and names them somewhat differently. Directly connecting to the nist-800-53-control-families lesson's control-mapping coverage, a well-designed compliance program builds its actual technical and procedural controls once, then maps that single implementation to whichever specific frameworks' language and evidence requirements a given audit needs — rather than maintaining entirely separate, duplicated control implementations per framework.
:::

## Choosing which frameworks actually matter for a given organization

A genuinely practical GRC skill: determining which frameworks are actually legally required (based on data types handled and jurisdictions operated in) versus which are market-driven requirements (SOC 2, frequently required by enterprise customers even without a specific legal mandate) versus which are aspirational best-practice adoption without either legal or contractual pressure — correctly triaging this distinction is exactly the kind of judgment call that separates a genuinely valuable GRC professional from someone simply working through a generic checklist without understanding why each item actually matters for this specific organization.

:::challenge Test yourself
Why does building a single, well-designed set of technical and procedural controls, then mapping that implementation to multiple frameworks' specific language, represent a genuinely more efficient approach than maintaining separate control implementations for each framework independently?
:::

## Key terms

- **PCI-DSS** — the payment card industry's security standard, with real contractual enforcement directly from card networks.
- **HIPAA Security Rule** — the US healthcare data protection framework, enforced primarily through complaint- and breach-driven investigation rather than continuous audit.
- **Extraterritorial reach** — a regulation's applicability based on whose data is processed, not where the processing organization is based, as with GDPR.

## Recap

Most real organizations need to satisfy multiple compliance frameworks simultaneously, each with genuinely different scope and enforcement mechanisms. PCI-DSS carries direct financial and contractual enforcement from payment networks; HIPAA is primarily complaint- and breach-driven; GDPR and state privacy laws apply based on whose data is processed, not organizational location, creating a genuinely fragmented multi-jurisdiction landscape. The large majority of actual technical controls overlap across frameworks, making a single well-designed implementation, mapped to each framework's specific language, far more efficient than maintaining separate implementations — and correctly triaging which frameworks are legally required versus market-driven is a genuinely valuable GRC skill.

???refs
- [PCI Security Standards Council](https://www.pcisecuritystandards.org/)
- [HHS — HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [GDPR official text](https://gdpr-info.eu/)
???
