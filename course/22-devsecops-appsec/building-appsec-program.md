# Building an AppSec Program from Scratch

You have the tools and the practices. Now you need the program — the people, process, and governance that make security sustainable across many teams and repositories.

:::tip
This lesson is written for the person who is asked to "own application security" for an organisation that previously had little or none.
:::

## The job of an AppSec program

1. Reduce the number of serious vulnerabilities that reach production
2. Reduce the time it takes to fix the ones that do (MTTR)
3. Make secure defaults the path of least resistance for developers
4. Provide evidence for customers, auditors, and leadership

## A practical maturity ladder

### Level 0 — Ad hoc
- Security reviews when someone remembers
- No inventory of applications
- Findings live in spreadsheets or nowhere

### Level 1 — Foundations
- Application inventory (what do we actually run?)
- Central intake for security questions and design reviews
- SCA enabled on all repos
- Basic secure-coding guidance published

### Level 2 — Integrated
- SAST + secret scanning in CI for critical services
- Security champions network
- Defined SLAs for critical / high findings
- Lightweight threat modeling on high-risk features
- Metrics dashboard (coverage, open vulns, MTTR)

### Level 3 — Optimising
- Risk-based prioritisation (not all apps equal)
- Automated policy-as-code gates
- Regular purple-team / attack-simulation exercises
- Continuous improvement based on incident and pentest lessons

## Concrete first 90 days

1. **Inventory** — list services, owners, languages, data sensitivity.
2. **Quick wins** — Dependabot / SCA + secret scanning everywhere.
3. **Triage process** — one place for findings, clear severity definitions, SLAs.
4. **Champion pilot** — 2–3 teams with a named security champion.
5. **Design review office hours** — make it easy to ask before building.
6. **One metric leadership cares about** — e.g. "critical vulns older than 30 days".

## Governance without bureaucracy

- Severity definitions everyone understands
- Written SLAs (e.g. critical = 7 days, high = 30 days)
- Exception process with expiry dates (no permanent "accept the risk" without review)
- Regular reporting that is short and decision-oriented

## Key terms

- **MTTR** — Mean Time To Remediate
- **Security champion** — developer who is the security liaison for their team
- **Policy as code** — encoding security rules so pipelines can enforce them automatically

## Recap

An AppSec program is a product. Start with inventory and quick automated wins, build trust with developers, measure what matters, and grow maturity deliberately instead of buying every tool at once.

???refs
- [OWASP SAMM](https://owaspsamm.org/)
- [BSIMM](https://www.bsimm.com/)
???