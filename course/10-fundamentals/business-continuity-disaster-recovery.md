# Business Continuity & Disaster Recovery

The incident-response lesson covered *security* incidents specifically. This lesson broadens the lens: what happens when *anything* — a security incident, a natural disaster, a major hardware failure — threatens to stop an organization from operating at all.

## Two related but distinct disciplines

- **Business Continuity Planning (BCP)** — how does the *organization* keep functioning during a disruption? Which processes are critical, and how do they continue (even in a degraded form) while normal operations are restored?
- **Disaster Recovery (DR)** — how do the *specific technical systems* actually get restored? DR is often thought of as the more technical subset of the broader BCP effort, focused specifically on IT infrastructure and data.

## Why this connects directly to backups, revisited at organizational scale

Path 00's backup lesson and Path 07's Windows-specific backup coverage both taught individual-system recovery habits. BCP/DR asks the same underlying question at the scale of an entire organization: if the primary data center burns down, if a critical vendor goes offline, if ransomware encrypts every server simultaneously — what's the actual, tested plan for the organization to keep functioning, not just for one machine to be restored?

## Two numbers every DR plan needs to define

- **RTO (Recovery Time Objective)** — how long can this system realistically be down before the impact becomes unacceptable? A customer-facing payment system might have an RTO of minutes; an internal reporting tool might tolerate a full day
- **RPO (Recovery Point Objective)** — how much data loss is acceptable, measured in time? An RPO of one hour means backups need to run at least hourly, since anything more than an hour old at the moment of failure would be lost

```mermaid
flowchart LR
    A["Last backup"] -->|"RPO: max acceptable\ndata loss window"| B["Incident occurs"]
    B -->|"RTO: max acceptable\ndowntime"| C["System restored"]
```

Different systems genuinely warrant different RTO/RPO targets — not every system needs the same aggressive, expensive recovery guarantees, and defining these numbers explicitly (rather than assuming) is exactly what turns a vague "we have backups" into an actual, measurable recovery plan.

## Why untested plans fail exactly when they're needed most

Directly echoing Path 00's "test your backups, don't just trust them" principle and Path 07's Windows-backup lesson: a BCP/DR plan that's written but never actually tested (through a tabletop exercise or a real failover drill) is genuinely likely to reveal gaps — outdated contact information, a dependency nobody accounted for, a recovery step that assumes access to a system that's itself part of the outage — exactly at the worst possible moment to discover them.

:::challenge Test yourself
A company sets its RPO for a critical database at 4 hours but only actually backs up that database once every 24 hours. What's the real, practical consequence of this mismatch?
<details><summary>Show answer</summary>The company's <em>stated</em> RPO (4 hours) and its <em>actual</em> backup frequency (24 hours) are badly mismatched — meaning if a failure occurs shortly before the next scheduled 24-hour backup, the organization could lose up to a full day's worth of data, nearly six times worse than what the 4-hour RPO target was supposed to guarantee. This is exactly the kind of gap a tested, honest DR plan is designed to catch before it matters: the RPO target should directly determine the actual backup frequency needed to meet it (in this case, backups would need to run at least every 4 hours, not once daily), and any organization that defines an RPO without verifying its actual backup infrastructure can meet it has a plan that looks reassuring on paper but would fail exactly when it's needed most.</details>
:::

## Key terms

- **Business Continuity Planning (BCP)** — planning for how an organization continues functioning during a major disruption.
- **Disaster Recovery (DR)** — the technical subset of BCP focused on restoring IT systems and data.
- **RTO (Recovery Time Objective) / RPO (Recovery Point Objective)** — the maximum acceptable downtime and data loss, respectively, for a given system.

## Recap

- BCP addresses how an organization keeps functioning during a disruption; DR addresses how the underlying technical systems actually get restored.
- RTO and RPO give concrete, measurable targets for downtime and data loss tolerance, turning a vague "we have backups" into an actual, testable recovery plan.
- Untested BCP/DR plans reveal their gaps exactly when they're needed most, echoing the same "test it, don't just trust it" principle this course has applied to backups at every scale.

**Next up →** [Physical Security Basics](#/lesson/10-fundamentals/physical-security-basics)
