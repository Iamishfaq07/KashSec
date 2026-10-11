# Metrics That Matter

If you cannot measure it, you cannot improve it — and you cannot defend your budget. The metrics you choose don't just report on your program, they *shape* it: whatever you measure is what your team will optimize for, even when that's not what you meant.

:::tip
Before picking a single metric, ask: "if a team wanted to make this number look good without actually getting more secure, could they?" If yes, you've found a bad metric.
:::

## Bad metrics (common traps)

- **Raw vulnerability counts** — incentivizes hiding or gaming. A team that stops scanning entirely has zero open vulnerabilities. That is not the outcome you want, but it's exactly what this metric rewards.
- **"Number of scans run"** — measures activity, not outcome. You can run a thousand scans against code nobody looks at.
- **Lines of code covered by SAST without regard to quality of findings** — 100% coverage with a ruleset that only checks formatting is worthless coverage.
- **Total findings closed** — a team can close 500 low-severity findings and ignore the 2 critical ones and this metric looks fantastic.

## A concrete example of a metric backfiring

A team is measured on "number of critical findings open." Leadership announces a hard deadline: zero by end of quarter. What actually happens, almost every time: findings get *reclassified* from critical to high, not fixed. The dashboard goes green. The vulnerabilities do not go anywhere. This is Goodhart's Law in action — "when a measure becomes a target, it ceases to be a good measure" — and it's the single biggest risk in building an AppSec metrics program.

## Better metrics

### Coverage

- % of repositories / services with SCA enabled
- % with SAST / secret scanning on the default branch
- % of internet-facing services that had a design review or pentest in the last year

| Metric | What it tells you | What it can't tell you |
|---|---|---|
| SCA coverage % | How many repos are being watched at all | Whether findings in covered repos get fixed |
| SAST on default branch % | Baseline visibility across the org | Whether the ruleset is any good |
| Services pentested / year | Depth of assurance for critical assets | Anything about the other 90% of services |

### Health of the backlog

- Open critical / high vulnerabilities older than the SLA
- Mean (or median) time to remediate critical findings
- Arrival rate vs closure rate of high-severity issues — if arrivals consistently outpace closures, the backlog is growing no matter how busy everyone looks

:::warn
Watch median, not just mean, for remediation time. One 400-day-old finding that nobody owns will drag a mean upward and hide the fact that most findings actually get fixed quickly. Report both, or report median alone if you can only pick one.
:::

### Outcomes

- Serious vulnerabilities found in production / by external researchers (**escape rate**) — this is the metric that most honestly answers "is our program working," because it measures what actually got past every earlier control
- Time from vulnerability disclosure to fix in production
- Percentage of services that meet a defined security baseline

### People & process

- Number of active security champions
- Design reviews completed per quarter
- Developer satisfaction with security tooling (short survey) — a scanner developers hate gets routed around, no matter how good its findings are

## How to use metrics

1. **Pick a small set** (5–7) that leadership can understand. A 40-metric dashboard gets ignored; a 5-metric one gets read every week.
2. **Show trend lines**, not just snapshots. "12 critical findings" means nothing alone. "12, down from 40 last quarter" is a story.
3. **Pair every metric with an action** — "this number is high, therefore we will…". A metric with no attached decision is trivia, not management.
4. **Avoid weaponising metrics against teams** — use them to prioritise support and investment, not to rank-and-shame. Teams that feel punished by a metric will learn to hide from it rather than improve against it.

:::tip
A simple executive slide: "Critical vulnerabilities older than 30 days: 12 → 3 in the last quarter. Coverage of SCA: 40% → 95%." That story gets budget. Nobody in an executive review wants to see a table of 200 raw finding IDs.
:::

## 🧪 Hands-on lab — design a 5-metric dashboard

Pick a real or hypothetical organization (your workplace, a personal project portfolio, or a scenario you invent).

1. List every security metric you could plausibly collect for it — aim for at least 10.
2. For each one, apply the Goodhart's Law test from above: could a team game it without getting more secure? Cross off any that fail.
3. From what's left, pick exactly 5 that together cover coverage, backlog health, and outcomes — don't pick 5 that are all backlog metrics.
4. For each of your 5, write the one sentence of "therefore we will..." that a bad number would trigger.
5. Sketch (in words or a rough table) what the trend line for each metric would look like after a *good* quarter versus a *bad* quarter.

:::challenge Test yourself
1. Your CISO wants a single number that summarizes "how secure are we." Why is this a dangerous request, and what would you offer instead?
2. A team's "time to remediate" metric improved dramatically overnight. List two explanations that mean real progress and two that mean the metric is being gamed.
3. Explain escape rate in one sentence, and explain why it's harder to game than most other AppSec metrics.
:::

## Key terms

- **MTTR** — mean time to remediate
- **Escape rate** — defects that reach production or external discovery, rather than being caught by an earlier control
- **SLA** — service level agreement for fixing findings by severity, e.g. "critical findings fixed within 15 days"
- **Goodhart's Law** — "when a measure becomes a target, it ceases to be a good measure"; the central risk of any metrics program

## Recap

Measure coverage, backlog health, and real outcomes — and pressure-test every candidate metric against Goodhart's Law before you adopt it. Keep the set small, show trends, and always connect numbers to decisions, because a metric nobody acts on is just decoration.

???refs
- [OWASP DefectDojo](https://www.defectdojo.org/) — open-source vulnerability management that helps track many of these metrics
- [Goodhart's Law (overview)](https://en.wikipedia.org/wiki/Goodhart%27s_law) — the underlying risk behind every metrics program
???
