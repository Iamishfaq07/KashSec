# AppSec and DevSecOps: Where to Start

**Application security (AppSec)** is the work of making software resist misuse: clear security requirements, safe design and code, useful testing, and fixes that hold up after release.

**DevSecOps** brings that work into the normal delivery process. Security feedback reaches the people building and running the software while they can act on it.

You do not need to buy a platform to begin. Start with one application, one owner, and one important risk.

## What you will build in this path

By the end, you should have a small portfolio of connected evidence:

1. A security requirements checklist for one feature.
2. A threat model showing its data flows and trust boundaries.
3. A code-review finding, a fix, and regression tests.
4. A pipeline sketch with clear permissions and useful checks.
5. A realistic 90-day AppSec plan with owners and a way to measure progress.

The path mixes technical work with program design. If Python or HTTP is unfamiliar, use the linked prerequisite paths first. Nothing is locked.

## Why review only at the end is difficult

A late security review can discover a design problem after several teams depend on it. Fixing it may need changes to permissions, data storage, tests, documentation, and deployment.

Earlier feedback often reduces that rework, but there is no universal cost multiplier or fixed time to repair a bug. A design defect may take weeks to resolve; a production configuration issue may take minutes. Measure your own environment instead of promising a specific saving.

## Follow one feature through delivery

Consider an invoice download feature:

| Stage | Useful security question | Evidence |
|---|---|---|
| Plan | Who may read each invoice? | An explicit permission rule |
| Design | Where does trusted user identity come from? | A small data-flow diagram |
| Code | Are SQL values bound and permissions checked? | Review and two-user tests |
| Build | What dependencies and build permissions are used? | Reviewed manifest, scan results, pipeline configuration |
| Test | Can one customer read another's invoice? | A negative integration test |
| Release | Is this the artifact we reviewed? | Artifact identity and provenance checks |
| Operate | Can we detect misuse and repair a bad release? | Safe logs, alerts, and a tested response plan |

Each row answers a different question. A scanner result cannot replace the permission rule. A signed artifact can still contain vulnerable code.

## Who does what?

- **Developers** implement and test the application behavior.
- **AppSec reviewers** help identify risks, review important flows, and verify fixes.
- **Platform and operations teams** maintain build permissions, deployment controls, and operational visibility.
- **Product or risk owners** decide priorities and approve documented exceptions within their authority.

Small teams may share these roles. The important part is that an action has a named owner and a clear next step.

## A practical first control

Choose one high-risk behavior, such as changing an account email or reading a private invoice. Write an allowed case and a denied case. Review the code that enforces the rule. Keep a regression test when you fix a gap.

Then add automation that helps the team repeat this work. Start checks in reporting mode when their reliability is unknown. Use blocking rules for agreed, high-confidence problems with a clear fix and an exception process. A severity label alone is not enough to design a release gate.

## Common traps

- Collecting findings before agreeing who will investigate them.
- Calling an application secure because a scan returned zero results.
- Sending developers an alert without the affected location, evidence, or a suggested action.
- Adding a gate that has no timeout, owner, or way to handle an urgent release.
- Publishing a policy that nobody can test or explain.

## Practice: map one small project

Pick a project you own, or use the fictional invoice feature. Write five lines: what it does, what data matters, who can access it, where it is deployed, and who would fix a bug. Add one possible abuse case and one test that could catch it.

You now have a useful starting point for requirements and threat modeling.

## Key terms

- **AppSec** — the practice of reducing security risk in application design, implementation, and operation
- **DevSecOps** — integrating security work into the normal software delivery process
- **SDLC** — the software development lifecycle, from planning through maintenance

## Ready to advance

- [ ] I can explain AppSec and DevSecOps without naming a product.
- [ ] I chose one feature and wrote one access rule.
- [ ] I named who would implement and verify a fix.

???refs
- [NIST Secure Software Development Framework](https://csrc.nist.gov/Projects/ssdf)
- [OWASP SAMM](https://owaspsamm.org/)
- [OWASP ASVS](https://asvs.owasp.org/)
???
