# OT Asset Inventory & Visibility

Every control covered so far — segmentation, monitoring, vulnerability triage — depends on one unglamorous prerequisite: knowing exactly what's actually on your OT network. This lesson covers why that's harder than it sounds, and how it's actually done.

:::tip
A recurring finding in real ICS security assessments: the facility's official network diagram and the facility's *actual* network rarely match. Undocumented devices, forgotten test connections, and vendor-installed equipment nobody logged are the norm, not the exception.
:::

## Why OT asset inventory is uniquely hard

- **Decades of accumulated equipment** — some OT networks have devices installed before anyone thought to document them, some from vendors who no longer exist
- **Active scanning is risky** (from the practical controls lesson) — the exact technique IT uses to auto-discover assets can crash the fragile equipment OT needs to inventory
- **Shadow connections** — a vendor's temporary remote-support laptop, plugged in for a single maintenance visit and never disconnected, is a genuinely common way an undocumented device ends up permanently on an OT segment

## Passive discovery: inventory without touching anything

Building directly on the passive monitoring technique from the practical controls lesson, passive asset discovery tools watch network traffic on a mirrored port and build an inventory purely from what devices *say* — protocol handshakes, MAC addresses, firmware version strings that some protocols expose voluntarily — without ever sending a single probe packet themselves. This gets real, current inventory data with none of the risk active scanning carries.

## What a real inventory needs beyond "it's a PLC"

A useful OT asset inventory records more than device presence:

- **Make, model, and firmware version** — the exact detail needed to check a device against a CISA ICS advisory
- **Network segment and expected communication partners** — the baseline "normal" that anomaly-based monitoring compares against
- **Criticality to the physical process** — a sensor feeding a display is a different priority than a controller feeding a safety-relevant actuator

:::challenge Spot the gap
A facility's official asset inventory lists 40 PLCs. A passive discovery tool deployed for one week identifies 47 distinct devices communicating on the OT network.

<details><summary>Hint</summary>What are the realistic explanations for a gap this size, and why does each one matter from a security standpoint even if it turns out to be "nothing malicious"?</details>
<details><summary>Show answer</summary>The seven undocumented devices could be anything from a forgotten vendor diagnostic laptop to an engineering workstation nobody logged to, in a worse case, something genuinely unauthorized. Regardless of the specific explanation, **every one of those seven devices was previously invisible to every other control in this path** — they weren't in scope for vulnerability triage, weren't accounted for in segmentation design, and their traffic wasn't part of the monitoring baseline. This is exactly why asset visibility is treated as a prerequisite control, not an optional nice-to-have: every other control's effectiveness is capped by how complete the underlying inventory actually is.</details>
:::

## 🧪 Hands-on lab — design a passive discovery rollout

Sketch a plan for deploying passive asset discovery across a hypothetical three-segment OT network (Level 0/1 field devices, Level 2 control room, Level 3 DMZ). For each segment, specify where you'd place the network tap or mirrored port and what you'd expect a "normal" device list to look like.

:::challenge Test yourself
1. Why is active network scanning specifically discouraged for OT asset discovery?
2. Name two pieces of information a useful OT asset inventory records beyond "a device is present."
3. Why does incomplete asset visibility undermine the effectiveness of segmentation and monitoring controls, even if those controls are otherwise well-designed?
:::

## Key terms

- **Passive asset discovery** — building a device inventory purely from observed network traffic, without sending any probe packets
- **Shadow connection** — an undocumented device or link, often left behind after temporary vendor or maintenance access

## Recap

Every OT security control covered in this path — segmentation, monitoring, vulnerability triage — is only as effective as the asset inventory underneath it, and OT's scanning constraints mean that inventory has to be built passively, from observed traffic, rather than through the active discovery techniques IT security takes for granted. Undocumented "shadow" devices are the norm in real facilities, not the exception, which is exactly why asset visibility is treated as foundational rather than optional.

???refs
- [CISA — Guidance on OT Asset Inventory](https://www.cisa.gov/resources-tools/resources/layering-network-security-through-segmentation) — asset visibility as a segmentation prerequisite
???
