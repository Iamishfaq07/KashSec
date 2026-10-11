# Capstone: Secure a Realistic Industrial Network

This closing lesson pulls together everything from the path — control loops, protocols, the Purdue Model, real-world incident patterns, and practical controls — into one applied exercise: assessing and securing a realistic (fictional) industrial facility.

:::tip
Treat this the way a real OT security assessment actually works: you're not being asked to eliminate every theoretical risk, you're being asked to make the specific, prioritized, realistic recommendations that matter most given real constraints — exactly the discipline the practical-controls lesson modeled.
:::

## The scenario: Meridian Water Treatment Facility

Meridian is a mid-size municipal water treatment plant. Current state, based on a walkthrough with their engineering team:

- **Field devices (Level 0/1)**: PLCs controlling chemical dosing pumps and flow valves, communicating via unauthenticated Modbus over a flat internal OT network
- **Supervisory (Level 2)**: A single HMI in the control room, plus a second HMI accessible via a remote-desktop connection some engineers use "for convenience" when off-site — this connection goes directly from a personal laptop into the Level 2 network, with no jump host and no MFA
- **Site operations (Level 3)**: A historian logging chemical dosing and flow data, used for regulatory compliance reporting
- **No DMZ currently exists.** The historian has a direct network share to a Level 4 business reporting server, set up years ago by an engineer who has since left the company, and nobody is entirely sure it's still needed
- **No passive monitoring** — nobody currently has visibility into what's actually talking to what on the OT network
- Engineers mention that the PLCs are old enough that the manufacturer no longer supports them, and replacing them isn't in this year's budget

## Your task

Produce a structured security assessment and prioritized recommendation set, covering:

### 1. Map the findings to the Purdue Model

For each system described above, identify its Purdue level, and specifically flag every place the model's core rule (IT never talks directly to OT) is currently being violated.

### 2. Identify the real-world attack pattern each weakness most resembles

At least two of Meridian's weaknesses closely resemble a failure mode from a real incident covered earlier in this path. Name them specifically and explain the parallel — this is the same "map the incident to the lesson" skill from the real-world-attacks lesson, run in reverse.

### 3. Prioritize your recommendations

Using the practical-controls lesson's priority order (segmentation → monitoring → access control → compensating controls → patching) as your framework, write a ranked list of the top five things Meridian should do, and justify the order — not everything can happen at once, and given the unsupported legacy PLCs, patching them isn't realistically on this list at all.

### 4. Design the specific fix for the remote-access problem

The off-site HMI access is one of the most acute risks described. Propose a specific redesign using concepts from this path (jump host, MFA, DMZ) that preserves the legitimate business need (engineers genuinely need occasional remote access) while closing the current gap.

### 5. Write the one-paragraph pitch to leadership

Following the "connect it to a real trigger" lesson from the real-world-attacks case studies — write a short, concrete paragraph a security lead could use to get budget approval for your top recommendation, referencing a real-world incident pattern this scenario resembles.

## A worked partial example, to calibrate against

Here's a taste of what a strong answer to part 4 looks like, so you have something to compare your own answer against — not to copy:

> Replace the direct personal-laptop-to-Level-2 connection with a jump host placed in a new Level 3.5 DMZ. Off-site engineers connect to the jump host only, authenticate with MFA, and the jump host — not their personal laptop — is the only system with a controlled, monitored path into Level 2. This closes the direct-access gap (mirroring the credential-based pivot pattern from the 2015 Ukraine attack) without removing engineers' genuine ability to respond to issues remotely, and every session through the jump host can be logged for later review.

Notice this answer doesn't say "ban remote access entirely" — it redesigns the access path to be safe *and* still functional, which is the realistic, deployable kind of recommendation this field actually rewards.

## 🧪 This lesson's hands-on lab is the capstone itself

Complete all five parts above as a single written assessment. When you're done, review it against this checklist:

- [ ] Every finding is tied to a specific Purdue level
- [ ] At least two findings are explicitly connected to a real-world incident pattern from this path
- [ ] Your priority order follows segmentation-first, patching-last, and you explain *why* for at least one item
- [ ] Your remote-access redesign preserves the legitimate business need rather than just removing it
- [ ] Your leadership pitch references a concrete, real trigger rather than abstract risk language

:::challenge Test yourself
1. Which of Meridian's weaknesses represents the clearest DMZ-bypass failure, and why?
2. Why is "just replace the unsupported legacy PLCs" not a realistic top-priority recommendation, even though it would technically solve several problems at once?
3. In your remote-access redesign, what specifically stops a compromised personal laptop from directly reaching Level 2, the way it could today?
:::

## Key terms

- **Security assessment** — a structured evaluation of an environment's weaknesses, prioritized recommendations, and the reasoning connecting them
- **Legitimate business need** — the real, valid reason a risky-looking connection or access path exists, which any good redesign must preserve rather than simply eliminate

## Recap

This capstone forces the same discipline every real OT security engagement requires: map findings to a real architecture (Purdue), recognize which real-world incident pattern each weakness echoes, prioritize realistically given genuine constraints (unsupported legacy hardware, real business needs for remote access), and communicate the case for action in terms that connect to a concrete, believable trigger. That combination — technical accuracy plus realistic prioritization plus a clear, actionable pitch — is what separates a useful OT security assessment from a purely theoretical one, and it's the same combination every lesson in this path has been building toward.

???refs
- [NIST SP 800-82 — Guide to Industrial Control Systems Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — the foundational reference for this entire path
- [CISA — Industrial Control Systems](https://www.cisa.gov/topics/industrial-control-systems) — ongoing real-world guidance and advisories
- [CISA — Cross-Sector Cybersecurity Performance Goals](https://www.cisa.gov/cross-sector-cybersecurity-performance-goals) — a practical, prioritized baseline many real organizations use for exactly this kind of assessment
???
