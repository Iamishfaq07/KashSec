# IIoT & Cloud Convergence

Every control in this path so far assumes OT stays cleanly separated from IT and the internet, connected only through a carefully controlled DMZ. This lesson covers the trend actively working against that assumption: the Industrial Internet of Things, and the growing pressure to pipe OT data straight into cloud platforms.

:::tip
IIoT and cloud convergence aren't inherently unsafe — they deliver real value (predictive maintenance, remote monitoring, cross-site analytics). The risk is in *how* that connectivity gets built: as a disciplined, one-way, well-architected data path, or as a shortcut that quietly erodes everything the Purdue Model was designed to enforce.
:::

## What's actually changing

- **IIoT sensors** — small, cheap, network-connected sensors deployed directly on equipment, often by operations or facilities teams rather than IT/OT security, sometimes with their own built-in cellular or Wi-Fi connectivity that bypasses the carefully designed network architecture entirely
- **Cloud-hosted historians and analytics** — instead of the on-premises historian covered in the fundamentals lesson, some facilities now stream process data directly to a cloud platform for advanced analytics, dashboards, or predictive maintenance models
- **Vendor cloud dashboards** — equipment vendors increasingly offer "check your device's health from anywhere" cloud portals, which requires that specific device to phone home to the internet

## Why this quietly breaks the Purdue Model

The Purdue Model's entire logic depends on a small number of well-controlled, well-monitored paths between OT and the outside world — the DMZ. A single IIoT sensor with its own cellular modem, installed directly on a Level 1 device by a well-meaning operations engineer trying to get better data, creates a completely new, likely unmonitored path that bypasses the DMZ, the segmentation, and every control built around it entirely. Cloud convergence done carelessly recreates the exact "someone plugged a laptop straight into the OT network" bypass failure mode the Purdue Model lesson warned about — just wearing a more modern-sounding name.

## Doing it safely

- **Route everything through the DMZ, even cloud traffic** — cloud connectivity should still flow through the same monitored, controlled boundary as everything else, not bypass it via an independent cellular or Wi-Fi connection
- **One-way data flow wherever possible** — the same unidirectional gateway principle from the practical controls lesson applies directly: data flows out to the cloud for analytics, with no path back in to anything safety- or control-relevant
- **Inventory and approve IIoT devices before deployment** — treating a new sensor as a new network asset requiring the same vetting as any other OT equipment, not a harmless add-on that operations can install without security review
- **Vendor cloud portals reviewed like any other third-party access** — the same system-integrator scrutiny from the supply chain lesson applies to a vendor's cloud dashboard requiring an outbound connection from OT equipment

:::challenge Evaluate a real deployment
An operations team, frustrated with slow approval processes, installs a batch of cellular-connected vibration sensors directly on production equipment to feed a predictive-maintenance dashboard, without looping in the OT security team.

<details><summary>Hint</summary>What does "cellular-connected" specifically mean for where this data path sits relative to every control this path has already covered — segmentation, monitoring, asset inventory?</details>
<details><summary>Show answer</summary>These sensors sit completely outside every control this path has covered: they're not in the asset inventory, their traffic doesn't pass through the DMZ so it's invisible to DMZ-boundary monitoring, and their cellular connectivity means the carefully designed network segmentation is irrelevant to them entirely — they have their own independent path to the internet. This is exactly the "well-intentioned shortcut" pattern the Purdue Model lesson warned recreates the DMZ-bypass failure mode. The fix isn't refusing the operations team's legitimate need for better data — it's bringing IIoT deployment under the same review, inventory, and one-way-data-flow discipline as every other OT connectivity decision, ideally with an approval process fast enough that teams don't feel pressure to route around it.</details>
:::

## 🧪 Hands-on lab — design a safe IIoT rollout

Sketch a safe version of a predictive-maintenance IIoT deployment: where sensor data should flow, what boundary it should cross through, and what control (from earlier in this path) prevents it from becoming a new unmonitored bypass path.

:::challenge Test yourself
1. Why can a single IIoT sensor with its own cellular connection undermine an otherwise well-designed Purdue Model architecture?
2. What's the safest data-flow pattern for piping OT data to a cloud analytics platform?
3. Why should IIoT devices go through the same vetting process as any other new OT equipment?
:::

## Key terms

- **IIoT (Industrial Internet of Things)** — network-connected sensors and devices deployed on industrial equipment, often independently of traditional OT/IT architecture
- **Convergence** — the increasing connection between OT data and IT/cloud systems, valuable for analytics but risky if it bypasses existing security architecture

## Recap

IIoT and cloud convergence deliver real operational value, but only when built with the same discipline as every other OT-to-outside-world connection this path has covered: routed through the DMZ, one-way wherever possible, and inventoried and approved before deployment. Left unmanaged, a single well-intentioned cellular sensor can quietly recreate the exact DMZ-bypass failure mode that careful Purdue Model segmentation was designed to prevent — which is exactly why convergence needs to be a security-reviewed architecture decision, not an operations-team shortcut.

???refs
- [CISA — Securing IIoT in Critical Infrastructure](https://www.cisa.gov/topics/industrial-control-systems) — guidance on IIoT and cloud convergence risk
???
