# Practical OT Security Controls

Every earlier lesson in this path has explained why OT is hard to secure: legacy protocols with no authentication, equipment that can't be casually patched, and real-world incidents proving the theoretical risks are genuine. This lesson is the payoff — what actually gets deployed, in what order, given all of those real constraints.

:::tip
The organizing question for every control in this lesson: **does this improve security without threatening the availability and safety of the physical process?** A control that's theoretically stronger but risks an unplanned shutdown often isn't actually the right answer in OT, even when it clearly would be in IT.
:::

## The priority order, and why it's different from IT

In IT security, "patch everything quickly" is close to a default best practice. In OT, patching is often the *last* tool reached for, not the first — because of the deployment and downtime constraints covered in the fundamentals lesson. The realistic priority order looks more like:

1. **Network segmentation** (the Purdue Model, enforced) — the highest-leverage control, because it doesn't touch the fragile legacy equipment at all
2. **Monitoring and detection** — knowing what's happening, especially at DMZ boundaries and on OT network segments, without changing anything about the control systems themselves
3. **Access control** — who and what can reach OT systems at all, and through what specific, narrow paths
4. **Compensating controls around legacy protocols** — since Modbus/DNP3 often can't be fixed directly, controls exist around them instead
5. **Patching** — genuinely important, but scheduled around planned outages, tested extensively beforehand, and often years behind the equivalent IT patch cadence

## Segmentation, enforced (not just diagrammed)

The Purdue Model lesson already covered the architecture. The practical control here is making sure it's real: actual firewall rules between levels, a genuinely restrictive DMZ, and — critically — **regular verification that nobody has quietly bypassed it**, since the DMZ-bypass failure mode from that lesson tends to creep back in over time through well-intentioned shortcuts.

## Passive monitoring: seeing without touching

A defining OT security technique: **passive network monitoring** — observing traffic on a network tap or mirrored port without ever injecting traffic onto the OT network itself. This matters because active scanning (the kind routine in IT vulnerability management) can genuinely crash fragile, decades-old ICS equipment that was never tested against unexpected traffic patterns. Passive monitoring gets visibility — what devices exist, what protocols they're speaking, whether traffic patterns look unusual — without the risk of actively probing equipment that might not handle it gracefully.

:::danger
Running a standard IT vulnerability scanner against an OT network is a well-known way to cause a real outage. Scanners are built and tested against IT equipment; a PLC from the 1990s may simply not have been designed to handle unexpected connection attempts gracefully, and "unexpected downtime caused by the security tool meant to prevent unexpected downtime" is exactly the kind of failure this field takes very seriously.
:::

## Access control for a world that can't always use modern auth

Given that many field devices can't support modern authentication (from the protocols lesson), access control shifts to controlling *who can reach the network segment at all*:

- **Jump hosts / bastion hosts** for any remote or vendor access into OT segments — no direct connection, only through a single, monitored, tightly controlled chokepoint
- **Least privilege for engineering workstations** — the machines that *can* legitimately reprogram a PLC are exactly the machines that need the most protection, since they're the closest thing OT has to "keys to everything"
- **Multi-factor authentication wherever it can actually be supported** — typically at the IT-adjacent layers (engineering workstations, historians, remote access gateways) rather than on the field devices themselves, which usually can't support it at all

## Compensating controls for unauthenticated protocols

Since Modbus and similar protocols can't be retrofitted with authentication at scale, the practical response is controls *around* them:

- **Protocol-aware firewalls / deep packet inspection**: devices that understand Modbus/DNP3 well enough to allow only expected, legitimate function codes and block anything anomalous, even though the protocol itself can't distinguish legitimate from malicious
- **Unidirectional gateways ("data diodes")**: hardware that physically allows data to flow in only one direction — commonly used to let OT data flow *out* to a historian or reporting system while making it physically impossible for anything to flow back *in*. This is a genuinely elegant solution for one-way data needs, because it doesn't rely on a rule being correctly configured — the hardware simply cannot carry traffic the wrong way
- **Anomaly-based detection**: since there's no authentication to check, detection often relies on knowing what "normal" traffic and command patterns look like for a given process, and flagging deviations — directly building on the historian data covered in the fundamentals lesson

## Patching, done the OT way

When patching does happen, it typically involves:

- Testing extensively in a non-production, representative environment first — never patching live safety-critical equipment untested
- Scheduling around planned maintenance windows, sometimes coordinated months in advance with regulators, customers, and multiple internal teams
- Prioritizing based on real exploitability and exposure (a vulnerability in equipment properly isolated by segmentation is a different urgency than one on an internet-reachable device) rather than patching everything on a fixed calendar cadence the way IT often does

## A worked example: securing a legacy PLC that can't be patched at all

Say a facility runs a PLC so old that the manufacturer no longer supports it, and no patch will ever exist. Realistic controls, stacked together:

1. **Segmentation**: the PLC sits on its own tightly restricted network segment, reachable only from the specific engineering workstation that legitimately needs to program it
2. **Passive monitoring**: a network tap watches traffic to and from that segment, alerting on any connection attempt from an unexpected source
3. **Protocol-aware filtering**: a firewall in front of the segment only allows the specific function codes this PLC's normal operation actually uses, blocking anything else even if it's technically valid Modbus
4. **Jump host access control**: the one workstation allowed to reach it requires MFA and is itself monitored closely

No single control here "fixes" the PLC's fundamental lack of authentication — but layered together, they meaningfully reduce the realistic attack surface without ever touching the fragile, unpatchable device itself.

## 🧪 Hands-on lab — design a control stack for a legacy device

Pick a hypothetical legacy PLC controlling something specific (a conveyor belt, a pump station — your choice).

1. List what you know or can reasonably assume about it: no authentication, can't be patched, communicates over Modbus.
2. Design a layered control stack (at least three distinct controls) that reduces risk without touching or patching the device itself.
3. For each control, write one sentence on specifically what attack path or scenario it closes off.
4. Identify the single most important control in your stack, and explain why removing it would leave the largest remaining gap.

:::challenge Test yourself
1. Why does OT security typically prioritize segmentation and monitoring ahead of patching, when IT security usually treats patching as a top priority?
2. Explain why active vulnerability scanning is considered risky against OT networks, and what technique is used instead.
3. What does a unidirectional gateway ("data diode") physically guarantee that a standard firewall rule does not?
:::

## Key terms

- **Passive monitoring** — observing network traffic without injecting any traffic onto the monitored network, avoiding the risk of disrupting fragile equipment
- **Jump host / bastion host** — a single, tightly controlled and monitored system that all remote or vendor access must pass through
- **Unidirectional gateway (data diode)** — hardware that physically allows data flow in only one direction
- **Compensating control** — a control that reduces risk around a weakness that can't be directly fixed

## Recap

Practical OT security accepts the constraints earlier lessons established — legacy protocols that can't be authenticated, equipment that can't be casually patched — and builds layered, non-invasive controls around them: enforced segmentation, passive monitoring instead of active scanning, tightly controlled access chokepoints, and protocol-aware filtering as compensating controls. Patching still matters, but it's the last tool reached for, not the first, precisely because availability and physical safety outrank the "patch it now" instinct that dominates IT security thinking.

???refs
- [NIST SP 800-82 — Guide to Industrial Control Systems Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — comprehensive practical control guidance
- [CISA — Industrial Control Systems](https://www.cisa.gov/topics/industrial-control-systems) — recommended practices and advisories
???
