# What is DevSecOps?

DevSecOps is the practice of integrating security into every stage of the software delivery lifecycle — not bolting it on at the end.

:::tip
The goal is not to slow developers down. The goal is to make the secure path the easy path. Every decision in this path should be judged against that sentence.
:::

## Why the old model broke

For most of software history, security was a **gate**. You built something for six months, then a security team reviewed it for two weeks, then you argued about the findings, then you shipped anyway because the launch date had already been announced.

That worked — barely — when releases happened twice a year. It collapsed completely once teams started deploying multiple times a day. You cannot run a two-week manual review against a pipeline that ships forty times a week. The gate either becomes a rubber stamp, or it becomes the thing everyone routes around.

There's also a cost argument, and it's the one that actually moves budgets. The later a defect is found, the more expensive it is to fix:

| Found during | Roughly what it costs to fix | Why |
|---|---|---|
| Design | Minutes — change a diagram | Nothing has been built yet |
| Coding | Under an hour — change a function | The author still has the context in their head |
| Testing / CI | Hours — re-open, re-fix, re-review | Context switch, new PR, new review cycle |
| Production | Days to weeks | Incident response, customer comms, possible breach notification, emergency patch |

The exact multipliers get argued over endlessly, but the direction is not controversial: **the cheapest bug is the one that never gets written.**

## From DevOps to DevSecOps

**DevOps** shortened the loop between writing code and running it in production — CI/CD, infrastructure as code, monitoring, and a culture where the team that builds a thing also runs it.

**DevSecOps** adds security controls into that same loop so that:

- Vulnerabilities are found early, when they are cheap to fix
- Security requirements are visible to developers in tools they already use
- Compliance evidence is generated automatically instead of assembled by hand
- The security team scales through automation instead of a ticket queue

Note what it is *not*: it is not "hire more security engineers", and it is not "buy a scanner". Both can be part of it; neither is sufficient on its own.

## Security at every stage

```
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor
         ↑______ security activities at every stage ______↑
```

Instead of a single review at the end, each stage carries its own controls:

| Stage | Security activity | What it catches |
|---|---|---|
| Plan | Threat modeling | Design flaws — the ones you cannot patch later |
| Code | Secure coding standards, pre-commit hooks, IDE plugins | Hardcoded secrets, obvious injection patterns |
| Build | SAST, SCA | Vulnerable code paths, vulnerable dependencies |
| Test | DAST, API security tests | Runtime and configuration issues |
| Release | Artifact signing, policy gates | Unapproved or tampered builds |
| Deploy | IaC scanning, admission control | Misconfigured infrastructure |
| Operate | Runtime protection, WAF | Live attacks |
| Monitor | Logging, alerting, detection | Everything the other stages missed |

A useful sanity check: if your organisation only has activity in one or two rows, you don't have DevSecOps — you have a tool.

## What good looks like

- Developers get fast, actionable feedback in their pull requests, not in a PDF a month later
- Critical issues block the pipeline; lower-severity ones create tickets with a due date
- Security champions exist inside product teams, so security has a presence without attending every standup
- Metrics (mean time to remediate, escape rate, coverage) are visible to leadership
- The AppSec team spends its time on design review and hard problems, not chasing basic findings

## What bad looks like

- Security is a gate that appears two days before release
- Tools produce thousands of findings nobody triages, so the backlog becomes decoration
- Developers learn to ignore the scanners, or discover the `--no-verify` flag
- "We do DevSecOps" means "we bought a SAST tool"

:::warn
The single most common failure mode is **alert fatigue**. A scanner reporting 4,000 issues of which 30 are real trains an entire engineering org to ignore security output. A noisy tool is worse than no tool, because it also burns your credibility — and credibility is the only currency an AppSec team actually has.
:::

## A concrete before and after

**Before.** A developer adds a new file-upload endpoint. It ships. Four months later a pentest finds it accepts arbitrary file types and stores them in a web-accessible directory. The fix requires changing the storage layer, which affects three other features. It takes two sprints and a retro.

**After.** The same developer opens the PR. The SAST job flags the unrestricted file write and links to the internal guidance. A pre-merge check notes the new endpoint has no threat model entry and pings the team's security champion. The developer changes eleven lines before anyone else has even reviewed it. Total cost: twenty minutes.

Same bug, same developer. The entire difference is *when they found out*.

## 🧪 Hands-on lab — map your own pipeline

You don't need a company to do this. Pick any project you have on GitHub, or use this course's own repository.

1. Write out the eight stages above in a note.
2. For each stage, write down what security activity currently happens. For most personal projects the honest answer for most rows is "nothing" — that's fine, and it's the point of the exercise.
3. Pick the **one** stage where adding a control would catch the most realistic problem for that project. For most small web projects, that's dependency scanning at build time.
4. Enable exactly that one thing. On GitHub, turning on Dependabot alerts takes about ninety seconds under **Settings → Code security**.
5. Look at what it reports, and for each finding ask the triage question: *is this reachable from my code, and what would an attacker actually gain?*

Step 5 is the real skill. Anyone can switch a scanner on; the job is deciding what matters.

:::challenge Test yourself
1. Your company deploys twice a day and has one security engineer for 60 developers. Why can't that engineer manually review every release, and what should they do instead?
2. A SAST tool reports 2,000 findings on its first run and your manager wants them all fixed this quarter. What's wrong with that plan, and what would you propose?
3. Name one security activity that belongs in the "Plan" stage, and explain why doing it later costs significantly more.
:::

## Where this path goes

You'll learn the major tool categories (SAST, DAST, SCA), how to put them into CI/CD safely, how to handle secrets and supply chain risk, how to threat-model, and finally how to build and measure an AppSec program that actually works.

## Key terms

- **CI/CD** — Continuous Integration / Continuous Delivery (or Deployment)
- **Shift left** — moving security earlier in the lifecycle, where fixes are cheaper
- **Security champion** — a developer who acts as the security point person for their team
- **Alert fatigue** — the state where so many alerts are false or unactionable that people stop reading them
- **Escape rate** — the proportion of vulnerabilities that reach production rather than being caught earlier

## Recap

DevSecOps is culture plus process plus automation. Tools alone are not enough, and tools without triage or good developer experience actively make things worse. Success isn't measured by how many findings you produce — it's measured by how fast real risk gets fixed, and how rarely it reaches production at all.

???refs
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) — the community reference for building this out
- [NIST SSDF (SP 800-218)](https://csrc.nist.gov/Projects/ssdf) — the Secure Software Development Framework, increasingly cited in contracts
- [Building Secure and Reliable Systems](https://sre.google/books/building-secure-reliable-systems/) — free online; chapter 1 makes the culture argument well
???
