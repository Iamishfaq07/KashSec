# What is OT/ICS Security?

Everything else in this course has, implicitly, been about IT — information technology, the systems that process and move data. **OT (Operational Technology)** is a different world entirely: the systems that directly control physical processes — a power grid's circuit breakers, a water treatment plant's chemical dosing pumps, a factory's robotic arms, a pipeline's pressure valves. When OT security fails, the consequence isn't a data breach. It's a blackout, a contaminated water supply, or a physical explosion.

:::tip
The single sentence that reframes everything in this path: **in IT, the worst case is usually data loss or downtime. In OT, the worst case is a person getting hurt, or a city losing power.** Every security trade-off in this field gets weighed against that difference.
:::

## IT vs. OT: not the same problem wearing a different hat

| | IT | OT/ICS |
|---|---|---|
| Primary goal | Confidentiality, then integrity, then availability (classic CIA order) | Availability and safety first — the process must keep running safely |
| Typical lifespan | 3–5 years, replaced routinely | 15–25+ years — a control system installed in 2005 may still be running today |
| Patching | Regular, often automatic | Rare, scheduled around planned outages — sometimes years apart |
| Downtime tolerance | Usually acceptable in planned windows | Often near-zero — stopping a power plant or a hospital's systems has real-world consequences |
| Consequence of compromise | Data theft, financial loss, reputational damage | Physical damage, environmental harm, injury, or loss of life |
| Network exposure | Often internet-facing by design | Historically isolated ("air-gapped"), increasingly connected anyway |

Notice the ordering flip in the very first row. IT security training drills "Confidentiality, Integrity, Availability" (CIA) as the priority order. OT security effectively runs it backwards — a control system that's perfectly confidential but stops the process from running safely has failed at its actual job.

## Why OT security lagged behind IT security

Several factors compound to make OT genuinely harder to secure than IT, not just differently prioritized:

- **Equipment predates modern security thinking entirely.** Many industrial protocols were designed decades ago, when the assumption was "only trusted engineers on a physically isolated network will ever talk to this," with no authentication or encryption built in at all.
- **You cannot simply reboot a power plant to patch it.** A patch that would take an IT server offline for five minutes might, on OT equipment, require a planned outage scheduled months in advance, coordinated with regulators and customers.
- **"It's air-gapped" was a comforting assumption that stopped being true years ago.** Modern OT environments increasingly connect to IT networks for monitoring, remote support, and business reporting — the gap most organizations believe still exists usually has more bridges across it than anyone realizes.
- **The people who understand the physical process (control engineers) and the people who understand security (IT/security teams) have historically been different teams, with different vocabularies, reporting up different chains.**

:::warn
"Our OT network is air-gapped, so we don't need to worry about this" is one of the most common and most dangerous assumptions in this field. Real-world incidents have repeatedly traced back to a "temporary" remote-access connection, a contractor's laptop plugged in for maintenance, or a USB drive — any of which quietly bridges a gap everyone assumed was absolute.
:::

## The vocabulary you'll need

- **ICS (Industrial Control Systems)** — the umbrella term for systems that monitor and control physical processes
- **SCADA (Supervisory Control and Data Acquisition)** — systems that monitor and control processes spread across a large geographic area (a power grid, a pipeline network)
- **DCS (Distributed Control System)** — systems that control a process concentrated in one facility (a single power plant, a single factory)
- **PLC (Programmable Logic Controller)** — the actual "brain" device that reads sensors and controls physical outputs (valves, motors, relays) at the equipment level
- **HMI (Human-Machine Interface)** — the screen an operator actually looks at to monitor and control the process

These aren't interchangeable jargon — SCADA and DCS describe different architectural scopes, and PLCs are the hands-on hardware that ties software decisions to physical reality. Later lessons in this path go much deeper on each.

## A concrete example of the stakes

Consider a water treatment plant that uses a control system to regulate how much chlorine gets added to the water supply. In IT terms, this is "just" a control loop reading a sensor value and adjusting an output. In OT terms, if an attacker (or a bug, or a misconfiguration) manipulates that control loop to add far more chlorine than intended, the consequence isn't a corrupted file — it's contaminated drinking water reaching real people. This exact category of attack — remote manipulation of a water treatment control system — has happened in real incidents, which is precisely why this field treats "worst case" so much more seriously than most IT security training does.

## Where this path is going

- SCADA and industrial control system fundamentals (deeper architecture, components, and how a control loop actually works)
- Common industrial protocols (Modbus, DNP3, and why their design assumptions cause security problems)
- The Purdue Model — the standard reference architecture for segmenting IT from OT
- Real-world ICS attacks and what they teach us (Stuxnet, the Ukraine grid attacks, and others)
- Practical OT security controls that respect the "don't break the physical process" constraint
- A capstone exercise applying the Purdue Model to a realistic industrial network

## 🧪 Hands-on lab — reframe an IT incident as an OT incident

1. Pick a well-known IT security incident you already understand (a ransomware attack, a data breach — anything from earlier in this course).
2. Rewrite the scenario as if it happened to an OT environment instead — what physical process would be affected, and what would the worst-case consequence actually be?
3. Compare your OT version's worst case to the original IT version's worst case. Which one is more urgent to prevent, and why might a security budget still (wrongly) favor IT anyway?
4. Write one sentence explaining why "we'll just patch it during the next scheduled downtime" is a much bigger constraint in OT than it typically is in IT.

:::challenge Test yourself
1. Explain, in your own words, why OT security effectively reverses the classic CIA triad's priority order.
2. Why is "our OT network is air-gapped" often a false sense of security in practice?
3. Name the difference between SCADA and DCS in one sentence each.
:::

## Key terms

- **OT (Operational Technology)** — systems that directly monitor and control physical processes and equipment
- **ICS (Industrial Control Systems)** — the umbrella term for OT systems and their supporting infrastructure
- **Air gap** — a network with no physical or logical connection to other networks, historically assumed (often incorrectly) to protect OT environments
- **PLC (Programmable Logic Controller)** — the hardware device that directly reads sensors and controls physical equipment

## Recap

OT/ICS security is a genuinely different discipline from IT security, not IT security applied to different equipment — the priorities, timelines, and consequences are fundamentally different, and treating OT like slow-moving IT is exactly how real incidents happen. The rest of this path builds out the architecture, protocols, real-world attack history, and practical controls that respect what makes OT different in the first place.

???refs
- [CISA — Industrial Control Systems](https://www.cisa.gov/topics/industrial-control-systems) — the US government's primary ICS security resource hub
- [NIST SP 800-82 — Guide to Industrial Control Systems Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — the foundational technical reference for this entire path
???
