# What is DevSecOps?

DevSecOps is the practice of integrating security into every stage of the software delivery lifecycle — not bolting it on at the end.

:::tip
The goal is not to slow developers down. The goal is to make the secure path the easy path.
:::

## From DevOps to DevSecOps

**DevOps** shortened the loop between writing code and running it in production (CI/CD, infrastructure as code, monitoring).

**DevSecOps** adds security controls into that same loop so that:

- Vulnerabilities are found early (when they are cheap to fix)
- Security requirements are visible to developers
- Compliance evidence is generated automatically
- The security team scales through automation instead of ticket queues

## The core idea

```
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor
         ↑______ security activities at every stage ______↑
```

Instead of a single "security review" at the end, you have:

- Threat modeling in planning
- Secure coding & pre-commit hooks while coding
- SAST / SCA in the build
- DAST / API tests in the test stage
- Signed artifacts and policy checks before release
- Runtime protection and monitoring in production

## What good looks like

- Developers get fast, actionable feedback in their pull requests
- Critical issues block the pipeline; lower ones create tickets
- Security champions exist inside product teams
- Metrics (MTTR, escape rate, coverage) are visible to leadership
- The AppSec team spends more time on design and hard problems than on chasing basic findings

## What bad looks like

- Security is a gate that appears two days before release
- Tools produce thousands of findings nobody triages
- Developers learn to ignore or bypass the scanners
- "We do DevSecOps" means "we bought a SAST tool"

## Where this path goes

You will learn the major tool categories (SAST, DAST, SCA), how to put them into CI/CD safely, how to handle secrets and supply chain risk, how to threat-model, and finally how to build and measure an AppSec program that actually works.

## Key terms

- **CI/CD** — Continuous Integration / Continuous Delivery (or Deployment)
- **Shift left** — moving security earlier in the lifecycle
- **Security champion** — a developer who is the security point person for their team

## Recap

DevSecOps is culture + process + automation. Tools alone are not enough; tools without triage and developer experience make things worse.

???refs
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
- [NIST SSDF](https://csrc.nist.gov/Projects/ssdf)
???