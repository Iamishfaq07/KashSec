# Building an AppSec Program from Scratch

You have the tools and the practices. Now you need the program — the people, process, and governance that make security sustainable across many teams and repositories, instead of depending entirely on one person's memory and goodwill.

:::tip
This lesson is written for the person who is asked to "own application security" for an organisation that previously had little or none. If that's not your job title yet, treat it as the interview-ready framework for what a good AppSec leader actually does — this comes up often in senior security interviews.
:::

## The job of an AppSec program

1. Reduce the number of serious vulnerabilities that reach production
2. Reduce the time it takes to fix the ones that do (MTTR)
3. Make secure defaults the path of least resistance for developers
4. Provide evidence for customers, auditors, and leadership

Notice what's *not* on this list: "run every possible scanner" and "review 100% of pull requests" aren't goals, they're tactics. A program measured only by tool count can look busy while none of these four outcomes actually improve.

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

:::warn
Do not try to jump straight to Level 3. An organisation with no application inventory that buys a policy-as-code gate will just block builds mysteriously with no one able to explain why, and the whole program will get disabled within a month. Maturity is sequential for a reason — each level depends on the trust and infrastructure the previous one built.
:::

## Concrete first 90 days

1. **Inventory** — list services, owners, languages, data sensitivity. You cannot secure what you don't know exists, and in most organisations more services exist than anyone expects.
2. **Quick wins** — Dependabot / SCA + secret scanning everywhere. Both are low-effort, low-noise, and immediately demonstrate value with almost no developer friction.
3. **Triage process** — one place for findings, clear severity definitions, SLAs. Without this, "quick wins" step 2 just generates a pile of alerts nobody owns.
4. **Champion pilot** — 2–3 teams with a named security champion. Start small enough to actually support them well; a champions program launched across 40 teams at once gets 40 half-hearted volunteers.
5. **Design review office hours** — make it easy to ask before building. A standing weekly slot where any team can bring a design question removes the friction of "filing a ticket to talk to security."
6. **One metric leadership cares about** — e.g. "critical vulns older than 30 days". Pick something concrete enough to report a trend line on by day 90.

## A concrete first-90-days timeline

| Week | Focus |
|---|---|
| 1–2 | Build the inventory; interview 5–6 team leads about what they own and what worries them |
| 3–4 | Turn on SCA + secret scanning everywhere; nothing blocking yet, just visibility |
| 5–6 | Stand up the triage process and severity definitions; start routing findings somewhere real |
| 7–8 | Recruit champion pilot teams; run the first design-review office hours |
| 9–12 | Publish the first metrics dashboard; report the first trend line to leadership |

## Governance without bureaucracy

- Severity definitions everyone understands — "critical" should mean the same thing to a developer, a security engineer, and an auditor
- Written SLAs (e.g. critical = 7 days, high = 30 days)
- Exception process with expiry dates (no permanent "accept the risk" without review) — an exception that never expires is a policy, not an exception
- Regular reporting that is short and decision-oriented, using the metrics discipline from the previous lesson

## What failure looks like, and why

The most common way an AppSec program fails is not lack of budget — it's lack of trust. A program that ships noisy tools without triage burns developer goodwill in month one, and every subsequent ask — even reasonable ones — gets read as "the security team slowing us down again." Trust, once burned, is far more expensive to rebuild than it was to earn in the first place. This is why the 90-day plan above deliberately puts "quick wins with low noise" before anything that blocks a build.

## 🧪 Hands-on lab — write your own first-90-days plan

Pick a real or hypothetical organisation (10–50 engineers, some mix of services, no existing AppSec function).

1. Write the inventory questions you'd ask in week 1 — what exactly do you need to know about each service?
2. Pick your two "quick wins" for weeks 3–4. Justify why these two specifically, and not others.
3. Draft severity definitions for Critical/High/Medium/Low in one sentence each, concrete enough that two different engineers would classify the same finding the same way.
4. Pick the one Level-2 capability you'd build toward first after the 90 days, and explain why it's next rather than any of the others.

:::challenge Test yourself
1. An organisation with no application inventory wants to buy an automated policy-as-code gate immediately. What's your advice, and why?
2. Explain in one sentence why "run every scanner available" is not, by itself, a good AppSec program goal.
3. Why does an exception process need expiry dates rather than being a one-time "accept the risk" decision?
:::

## Key terms

- **MTTR** — Mean Time To Remediate
- **Security champion** — developer who is the security liaison for their team
- **Policy as code** — encoding security rules so pipelines can enforce them automatically
- **Maturity model** — a staged framework (like the ladder above) for assessing and growing a program deliberately rather than all at once
- **SLA** — the agreed time window for fixing a finding of a given severity

## Recap

An AppSec program is a product, not a checklist — it has users (developers), it needs trust to be adopted, and it needs a roadmap. Start with inventory and quick automated wins, build trust with developers before asking for anything that blocks their work, measure what matters, and grow maturity deliberately instead of buying every tool at once.

???refs
- [OWASP SAMM](https://owaspsamm.org/) — the Software Assurance Maturity Model, the basis for the ladder above
- [BSIMM](https://www.bsimm.com/) — the Building Security In Maturity Model, based on real-world program data
???
