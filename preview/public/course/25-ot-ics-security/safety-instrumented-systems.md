# Safety Instrumented Systems

Every lesson so far has treated "availability" as OT's top priority above IT's usual confidentiality-first thinking. This lesson covers the layer above even availability: **safety** — the systems whose entire job is preventing a process from harming people, even if the process itself fails.

:::danger
A Safety Instrumented System is not just another OT asset to segment and monitor like any other. It's the last line of defense against physical harm — and it was the specific target in the Triton/Trisis attack covered in the real-world attacks lesson, which makes this the single highest-stakes category of asset in the entire OT environment.
:::

## What a Safety Instrumented System actually does

A Safety Instrumented System (SIS) is a separate, independent control system whose only job is detecting dangerous conditions and forcing the process into a safe state — venting pressure, shutting a valve, cutting power — regardless of what the primary control system (the DCS or PLCs covered in the fundamentals lesson) is doing. The independence is the entire point: if the primary control system is compromised, malfunctioning, or simply wrong, the SIS is designed to catch the dangerous outcome anyway.

## Why SIS independence gets undermined in practice

The theoretical design calls for full separation between the SIS and the primary control network. In real deployments, that separation erodes for understandable operational reasons:

- **Convenience remote access** — an engineer wants to check SIS status without physically walking to the safety system, so a network connection gets added
- **Shared engineering workstations** — the same laptop used to program the DCS also gets used to program the SIS, because buying and securing a second dedicated machine is inconvenient
- **Vendor "helpful" integration** — some SIS vendors sell integration features that bridge the safety network to the process network for easier monitoring, trading the isolation for convenience

Triton/Trisis specifically exploited this kind of eroded separation: the attackers reached the SIS network at all, which the system's design was never supposed to permit.

## The core control: genuine independence

The single highest-value SIS-specific control is maintaining **real, physical or airtight-logical separation** from the process network — not a firewall rule that could someday be misconfigured, but architecture that makes bridging the two networks difficult by design. Where remote visibility into SIS status is genuinely needed, a unidirectional gateway (the data diode from the practical controls lesson) is the right tool: it lets status data flow *out* for monitoring while making it physically impossible for anything to flow *in* and touch the safety logic.

:::challenge Evaluate a proposed change
A facility wants to add a new feature: an app that lets an on-call engineer check SIS status from their phone, from anywhere, at any time.

<details><summary>Hint</summary>What does "check status from anywhere" actually require in terms of network connectivity between the SIS and the outside world — and is that requirement compatible with everything this lesson has said about SIS independence?</details>
<details><summary>Show answer</summary>This is exactly the kind of "helpful" convenience feature that erodes SIS isolation. Remote-from-anywhere access requires *some* path from the SIS network out to the internet-reachable systems the phone app talks to — and every such path is a potential route back in, regardless of how carefully it's designed. The safer version of this feature uses a unidirectional gateway: SIS status data flows one-way out to a reporting system the phone app reads from, with the SIS network itself remaining physically incapable of receiving anything back. The convenience feature is achievable — but only if it's built to preserve one-way isolation rather than create a new bidirectional path into the safety system.</details>
:::

## 🧪 Hands-on lab — audit a hypothetical SIS deployment

List three specific ways SIS isolation commonly erodes in real facilities (three are named in this lesson). For each, write one sentence describing a control that would prevent that specific erosion without eliminating the operational need it was solving.

:::challenge Test yourself
1. What makes a Safety Instrumented System fundamentally different from any other OT asset covered in this path?
2. Why did the Triton/Trisis attack specifically target the SIS rather than the primary DCS?
3. Why is a unidirectional gateway a better fit than a standard firewall rule for exposing SIS status data externally?
:::

## Key terms

- **Safety Instrumented System (SIS)** — an independent control system whose sole function is forcing a process into a safe state when it detects dangerous conditions, regardless of the primary control system's state
- **Isolation erosion** — the gradual, often well-intentioned weakening of a safety system's network separation through convenience features and shared equipment

## Recap

A Safety Instrumented System sits above even availability in the OT priority stack — it's the last line of defense against physical harm, and it's the specific category of asset the Triton/Trisis attack targeted by exploiting eroded network separation. Real SIS security means treating independence as non-negotiable architecture, using tools like unidirectional gateways for any genuinely needed external visibility rather than accepting bidirectional convenience connections that undermine the entire point of having a separate safety system.

???refs
- [CISA — Triton/Trisis Malware Analysis](https://www.cisa.gov/news-events/ics-advisories/icsa-17-347-01) — the incident this lesson builds directly on
???
