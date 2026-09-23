# API Security Standards & Frameworks

The OWASP API Top 10 lesson gave you the shared vocabulary for API risk categories. This lesson covers the broader landscape of standards and frameworks that vocabulary sits within — directly connecting to Path 23's GRC/Compliance path, since API security increasingly intersects with formal compliance requirements, not just technical best practice.

## Why one checklist isn't the whole picture

The OWASP API Top 10 is genuinely excellent for prioritizing the most common, highest-impact vulnerability categories — but it's deliberately scoped narrowly to vulnerability categories, not the full lifecycle of building, operating, and governing APIs securely at organizational scale. Several complementary frameworks fill in the parts the Top 10 doesn't cover.

## OWASP API Security Top 10 vs. OWASP ASVS

Directly connecting to Path 11's coverage: the **OWASP Application Security Verification Standard (ASVS)** provides a much more granular, testable set of security requirements applicable across web applications generally, including a dedicated API-specific chapter — where the API Top 10 tells you *what categories of risk exist*, ASVS gives you specific, checkable requirements ("verify that all API responses contain a Content-Type header matching the actual content") suitable for a formal security review or audit checklist.

**ASVS 5.0.0** is the current stable edition as of September 2026. Requirement identifiers can move between editions, so a report should name the full version with a requirement, such as `v5.0.0-1.2.5`, rather than citing an unversioned number. Check the [official ASVS project page](https://owasp.org/projects/asvs) before reusing an older checklist.

## NIST guidance for API security

The **NIST Cybersecurity Framework** and related NIST publications (directly connecting to Path 23's GRC coverage of NIST frameworks generally) don't provide API-specific technical checklists the way OWASP does, but they provide the broader risk-management structure many regulated organizations are required to demonstrate compliance against — meaning API security work at a regulated organization (finance, healthcare, government contracting) often needs to be explicitly mapped back to NIST controls, not just to OWASP categories, to satisfy an auditor.

## Industry-specific requirements touching APIs directly

- **PCI-DSS** — directly connecting to Path 23's compliance coverage: any API handling payment card data falls under PCI-DSS requirements, including specific mandates around encryption in transit, access logging, and regular vulnerability scanning that apply on top of general API security best practice
- **HIPAA** — APIs handling healthcare data (increasingly common given health-tech's API-first architecture patterns) carry specific requirements around access controls and audit logging that exceed general API security guidance
- **GDPR/data protection regulations** — an API that returns more personal data than a request genuinely needs (directly connecting to the OWASP API3 "Excessive Data Exposure" category) isn't just a security best-practice violation, it's potentially a genuine regulatory violation with real financial penalty exposure

## OpenAPI/Swagger as a security-relevant artifact, not just documentation

Directly connecting to the api-testing lesson's tooling coverage: the **OpenAPI Specification** (formerly Swagger) — the standard, machine-readable format for describing an API's endpoints, parameters, and responses — increasingly serves double duty as a security artifact. Automated security scanning tools can consume an OpenAPI spec directly to generate test cases systematically, and a genuinely accurate, complete spec functions as a form of the API inventory the shadow-and-zombie-APIs lesson described, making "what does our API actually expose" a documented, verifiable fact rather than tribal knowledge.

## Choosing which framework actually matters for your context

:::tip Frameworks compound, they don't compete
A genuinely important practical point: OWASP API Top 10, ASVS, NIST, and industry-specific regulations aren't competing alternatives to choose between — a well-run API security program typically uses OWASP's categories for day-to-day technical prioritization, ASVS for structured review checklists, and NIST/industry regulations for the compliance mapping a regulated organization's auditors will specifically require. Treating this as "which one framework should we adopt" rather than "how do these layer together" is a common early-career misunderstanding this lesson aims to correct directly.
:::

:::challenge Test yourself
Why might an organization handling payment card data need to satisfy both the OWASP API Top 10 and PCI-DSS requirements, rather than treating OWASP compliance as sufficient on its own?
:::

## Key terms

- **OWASP ASVS** — a granular, testable set of security requirements for web and API applications, complementary to the Top 10's category-level framing.
- **OpenAPI Specification** — the standard machine-readable format for describing an API, increasingly used as a security and inventory artifact.
- **Compliance mapping** — translating technical security findings and controls into the specific language a regulatory framework's auditors require.

## Recap

The OWASP API Top 10 provides essential vocabulary and prioritization but isn't the whole picture — ASVS provides granular, testable requirements, NIST provides broader risk-management structure regulated organizations must demonstrate, and industry-specific regulations (PCI-DSS, HIPAA, GDPR) carry direct legal weight beyond best practice. These frameworks layer together rather than compete, and the OpenAPI Specification increasingly functions as both documentation and a security/inventory artifact.

???refs
- [OWASP Application Security Verification Standard 5.0.0](https://owasp.org/projects/asvs) — current stable release and versioned requirement guidance.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OpenAPI Specification](https://www.openapis.org/)
???
