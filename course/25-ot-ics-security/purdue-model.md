# The Purdue Model: Segmenting IT from OT

The previous lesson ended on a clear conclusion: since industrial protocols often can't be secured at the protocol level, network segmentation carries most of the real defensive weight in OT environments. The **Purdue Model** (formally, the Purdue Enterprise Reference Architecture) is the standard reference framework the entire industry uses to structure that segmentation.

:::tip
Read this lesson alongside the Zero Trust path's micro-segmentation lesson if you've completed it — the Purdue Model is, in effect, a domain-specific, decades-old ancestor of the same "don't let anything reach more than it needs to" thinking, adapted specifically for the constraint that you cannot casually reboot a power plant to test a new firewall rule.
:::

## The levels, from physical process to business systems

| Level | Name | What lives here |
|---|---|---|
| Level 0 | Physical process | Sensors, actuators — the actual physical equipment |
| Level 1 | Basic control | PLCs, RTUs — the controllers directly running the sense-decide-act loop |
| Level 2 | Area supervisory control | HMIs, local SCADA servers |
| Level 3 | Site operations | Historians, engineering workstations, site-level production management |
| Level 3.5 | **Demilitarized Zone (DMZ)** | A dedicated buffer zone — no direct traffic crosses straight from Level 3 to Level 4 |
| Level 4 | Business/IT | Business systems, email, general enterprise IT |
| Level 5 | Enterprise network | Corporate-wide business systems, often internet-connected |

The levels map directly onto the layered architecture from the fundamentals lesson — Level 0/1 is the fast, physical, safety-critical layer; Level 4/5 is ordinary IT. Everything about the model exists to control exactly how (and whether) traffic is allowed to move between them.

## The DMZ is the whole point

**Level 3.5**, the Industrial DMZ, is arguably the single most important concept in this entire lesson. The model's core rule: **IT systems at Level 4/5 should never talk directly to OT systems at Level 0-3.** Instead, anything that genuinely needs to cross that boundary — a historian replicating data for business reporting, a remote-support connection, a patch being staged — passes through the DMZ, where it can be inspected, controlled, and limited to exactly the specific, necessary traffic, with nothing else allowed through.

This is the practical embodiment of the "air gap isn't real anymore, so build a real boundary instead" lesson from the very first lesson in this path. The DMZ doesn't pretend IT and OT never need to connect — it accepts that they do, and makes that connection a single, tightly controlled, monitored chokepoint instead of an unmanaged sprawl of ad-hoc connections.

:::danger
The most common real-world Purdue Model failure isn't "we never built a DMZ" — it's **DMZ bypass**: a well-intentioned engineer sets up a "temporary" direct connection from an OT historian straight to a Level 4 business system, skipping the DMZ entirely, because it's faster and the DMZ rules are inconvenient for their specific need. That temporary connection often quietly becomes permanent, and it's exactly the kind of undocumented bridge that turns an assumed air gap into a real, exploitable path. This is the OT equivalent of the shadow API problem from the API Security path — an unmanaged, undocumented connection nobody remembers exists until it's the reason for a breach.
:::

## A worked example: patching a historian, done right vs. done wrong

A historian at Level 3 needs a security patch. The patch file exists on a Level 4 business network.

**Done wrong**: An engineer copies the patch directly from a Level 4 machine onto a USB drive, or opens a direct network share straight from Level 4 to the Level 3 historian, bypassing the DMZ because "it's just this once." That direct pathway — even if used only once — is a potential foothold: if the Level 4 machine is compromised at the moment of that connection, the OT environment is now directly exposed.

**Done right**: The patch is staged in the Level 3.5 DMZ — perhaps scanned there, verified, and made available only to systems at Level 3 through a controlled, monitored connection that only allows this specific kind of traffic (patch file transfer to a specific historian), not general network reachability. The historian pulls the patch from the DMZ; Level 4 and Level 3 never talk directly at all.

Same outcome (the historian gets patched), fundamentally different risk — because in the second version, even a fully compromised Level 4 system has no direct path to reach anything below the DMZ.

## Why this model is old and still the standard

The Purdue Model dates to the 1990s and it still dominates OT security guidance today — not because nothing better has been proposed, but because it correctly identifies the *shape* of the real problem (many layers with wildly different speed, safety, and update-tolerance requirements, needing a hard boundary between the "can be patched Tuesday night" world and the "cannot be casually touched" world). Newer frameworks (including OT-specific applications of Zero Trust principles) build on top of this same layered thinking rather than replacing it outright.

## Practical segmentation guidance

- **Enforce, don't just diagram.** A Purdue Model diagram that isn't backed by actual firewall rules and monitored traffic flows is decoration, not security — the same "governance without enforcement is paperwork" lesson from the GRC path applies directly here.
- **Every DMZ crossing should be the minimum necessary, explicitly justified.** Not "let's open this port just in case" — a specific, documented, narrowly-scoped exception for a specific, necessary business need.
- **Monitor the DMZ closely.** It's the one place all legitimate IT/OT traffic is *supposed* to converge — which also makes it the highest-value place to detect anything abnormal.
- **Assume someone, eventually, will try to bypass it for convenience.** Plan detection for unauthorized direct connections, not just prevention — because prevention alone, as the DMZ-bypass failure mode shows, tends to erode over time without active monitoring.

## 🧪 Hands-on lab — map a facility onto the Purdue Model

Pick a hypothetical (or research a real, publicly documented) industrial facility — a water treatment plant is a good, well-documented default.

1. List the systems you'd expect to find at each Purdue level, from physical sensors up through enterprise IT.
2. Identify at least two legitimate reasons data or systems would need to cross from OT (Level 0-3) to IT (Level 4-5) — e.g., production reporting, remote vendor support.
3. For each, describe exactly how that crossing should be handled through the DMZ — what specific, narrow traffic should be allowed, and what should explicitly not be.
4. Write one realistic "DMZ bypass" scenario an engineer might be tempted into, and one detection or process control that would catch it.

:::challenge Test yourself
1. What is Level 3.5, and why is "IT never talks directly to OT" the single most important rule in this model?
2. Why does the Purdue Model, despite being decades old, remain the industry-standard reference architecture?
3. In the historian-patching example, what specifically made the "done right" version safer, even though the end result (a patched historian) was identical?
:::

## Key terms

- **Purdue Model (Purdue Enterprise Reference Architecture)** — the standard layered reference architecture for segmenting IT and OT environments
- **Industrial DMZ (Level 3.5)** — a dedicated buffer zone controlling and monitoring all traffic between OT and IT
- **DMZ bypass** — an unauthorized or undocumented direct connection that skips the DMZ, defeating the segmentation the model relies on

## Recap

The Purdue Model gives OT environments a standard, layered structure with one non-negotiable rule at its center: IT and OT should never talk directly, only through a tightly controlled, monitored DMZ. The model is old, but the underlying problem it solves — many layers with wildly different tolerance for disruption, needing a real enforced boundary rather than an assumed air gap — hasn't gone away, which is exactly why it's still the reference every modern OT security control ultimately builds on.

???refs
- [NIST SP 800-82 — Guide to Industrial Control Systems Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — includes detailed Purdue Model reference architecture guidance
- [CISA — Industrial Control Systems](https://www.cisa.gov/topics/industrial-control-systems) — practical segmentation and DMZ guidance for real deployments
???
