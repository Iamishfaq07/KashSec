# Metrics That Matter

If you cannot measure it, you cannot improve it — and you cannot defend your budget. Choose metrics that drive the behaviour you want.

## Bad metrics (common traps)

- Raw vulnerability counts (incentivises hiding or gaming)
- "Number of scans run"
- Lines of code covered by SAST without regard to quality of findings

## Better metrics

### Coverage

- % of repositories / services with SCA enabled
- % with SAST / secret scanning on the default branch
- % of internet-facing services that had a design review or pentest in the last year

### Health of the backlog

- Open critical / high vulnerabilities older than the SLA
- Mean (or median) time to remediate critical findings
- Arrival rate vs closure rate of high-severity issues

### Outcomes

- Serious vulnerabilities found in production / by external researchers (escape rate)
- Time from vulnerability disclosure to fix in production
- Percentage of services that meet a defined security baseline

### People & process

- Number of active security champions
- Design reviews completed per quarter
- Developer satisfaction with security tooling (short survey)

## How to use metrics

1. **Pick a small set** (5–7) that leadership can understand.
2. **Show trend lines**, not just snapshots.
3. **Pair every metric with an action** — "this number is high, therefore we will…".
4. **Avoid weaponising metrics against teams** — use them to prioritise support and investment.

:::tip
A simple executive slide: "Critical vulnerabilities older than 30 days: 12 → 3 in the last quarter. Coverage of SCA: 40% → 95%." That story gets budget.
:::

## Key terms

- **MTTR** — mean time to remediate
- **Escape rate** — defects that reach production or external discovery
- **SLA** — service level agreement for fixing findings by severity

## Recap

Measure coverage, backlog health, and real outcomes. Keep the set small, show trends, and always connect numbers to decisions.

???refs
- [OWASP DefectDojo](https://www.defectdojo.org/) — open-source vulnerability management that helps track many of these metrics
???