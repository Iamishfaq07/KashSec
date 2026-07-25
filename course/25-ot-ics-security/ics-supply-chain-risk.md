# ICS Supply Chain Risk

Every control covered so far assumes the equipment itself, once deployed, is trustworthy — that the PLC does what its documentation says and nothing more. This lesson covers what happens when that assumption fails before the equipment ever reaches the facility.

:::tip
ICS supply chain risk isn't hypothetical caution — it's the exact mechanism behind Stuxnet, covered in the real-world attacks lesson: the malware reportedly reached its target via infected USB media carried through the supply chain, not through a direct network compromise of an air-gapped facility.
:::

## Where ICS supply chain risk actually enters

- **Third-party components** — a PLC vendor's product may itself depend on software libraries or components sourced from other vendors, any of which could introduce a vulnerability or, worse, a deliberate backdoor
- **Firmware updates** — the same official-looking update channel used for legitimate patches is a plausible delivery path for compromised firmware, if a vendor's build or distribution system is itself compromised
- **Removable media and vendor laptops** — exactly the vector Stuxnet reportedly used: media crossing the air gap physically, carried by a person, rather than crossing it over a network
- **System integrators** — the third-party firms that configure and deploy ICS equipment on a customer's behalf often have deep access during installation, access that may not be fully revoked or audited afterward

## Why this is harder to manage than IT software supply chain risk

IT software supply chain security increasingly relies on tools like software bills of materials (SBOMs) and automated dependency scanning. ICS equipment frequently ships as an opaque, proprietary bundle — firmware, embedded software, and hardware from a single vendor, with far less visibility into what's actually inside than a modern software dependency tree provides, and often with equipment that will run unchanged for the 15-20+ year lifespans covered in the fundamentals lesson.

## Practical mitigations

- **Vendor security assessment before procurement** — evaluating a vendor's own security practices (how they build, sign, and distribute firmware; how they handle vulnerability disclosure) as part of the purchasing decision, not as an afterthought
- **Firmware signature verification** — confirming an update genuinely came from the vendor and hasn't been tampered with in transit, wherever the equipment supports it
- **Strict control of removable media** — the same physical discipline that would have mattered against the Stuxnet USB vector: controlled, scanned, single-purpose media for any OT-bound transfer, never a general-purpose USB drive
- **Time-boxed and audited integrator access** — access granted for the duration of a specific installation or maintenance project, explicitly revoked afterward, rather than left open indefinitely

:::challenge Trace an infection path
A facility's engineering workstation gets infected with malware. Investigation shows the malware entered via a USB drive that a system integrator's technician used to transfer configuration files during a legitimate, scheduled maintenance visit two weeks earlier — the drive had been used on the technician's own laptop, which was separately compromised, in between visits to other client sites.

<details><summary>Hint</summary>At which of the mitigations listed above would this specific infection path have actually been stopped, and where did the facility's controls fail?</details>
<details><summary>Show answer</summary>This is a supply chain compromise via the removable-media and third-party-integrator vectors combined — the technician's laptop was compromised at a different client, and the same USB drive carried that compromise into this facility's OT environment during otherwise-legitimate maintenance. Strict removable media control (a single-purpose, facility-owned, scanned drive used only for that transfer — never the technician's personal media crossing between client sites) would have closed this specific path. This is exactly why the mitigation list treats "controlled, scanned, single-purpose media" as a distinct, dedicated control rather than assuming general good hygiene from third parties is sufficient — the technician had no way of knowing their own laptop was compromised, and the facility had no visibility into it either.</details>
:::

## 🧪 Hands-on lab — write a vendor security checklist

Draft a five-item checklist a facility should evaluate before selecting a new ICS equipment vendor, covering at least: firmware update integrity, vulnerability disclosure practices, and third-party component transparency.

:::challenge Test yourself
1. Which real-world attack from earlier in this path is a documented example of the removable-media supply chain vector?
2. Why is visibility into ICS firmware contents typically worse than visibility into a modern software application's dependencies?
3. Why does system integrator access deserve its own specific mitigation, separate from general vendor risk?
:::

## Key terms

- **ICS supply chain risk** — the risk that equipment, firmware, or software is compromised before or during delivery, rather than after deployment
- **System integrator** — a third-party firm that configures and deploys ICS equipment on a customer's behalf, often with deep temporary access

## Recap

ICS supply chain risk covers everything that can go wrong before equipment is even trusted to be trustworthy — compromised firmware, infected removable media (the exact mechanism Stuxnet reportedly used), and third-party integrator access that outlives its legitimate purpose. Because ICS equipment ships with far less internal visibility than modern software and runs unchanged for decades once deployed, the realistic mitigations focus on the points where risk actually enters: vendor vetting before purchase, firmware integrity verification, and strict discipline around removable media and third-party access.

???refs
- [CISA — ICS Supply Chain Guidance](https://www.cisa.gov/topics/industrial-control-systems) — supply chain risk resources for ICS operators
???
