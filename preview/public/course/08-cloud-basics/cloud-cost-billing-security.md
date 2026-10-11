# Cloud Cost & Billing Security

Every lesson so far in this path has focused on confidentiality and access. This lesson covers a genuinely distinct — and often overlooked — security concern that's essentially unique to the cloud's pay-as-you-go model: **billing itself as an attack surface**.

:::tip
Recall the CIA triad from Path 01: confidentiality, integrity, *availability*. A billing-focused attack often isn't trying to steal data at all — it's aiming directly at your wallet, and unlike a traditional on-premises breach, a cloud account compromise can generate real, immediate financial damage purely through resource abuse, with no data ever touched.
:::

## Cryptomining abuse: the classic cloud billing attack

A compromised cloud account with sufficient permissions is, from an attacker's perspective, free (to them) compute power — and the single most common thing attackers do with stolen cloud credentials is spin up as many high-powered compute instances as possible to mine cryptocurrency, running up the account owner's bill (sometimes into the tens of thousands of dollars within hours) while the attacker profits from the mined currency. This connects directly back to the compute lesson's coverage of instance types — attackers specifically target the largest, most expensive instance types available, since that's what maximizes their own mining output.

## Why leaked credentials are the usual entry point

The identity-access lesson already named leaked API keys as a leading real-world cloud breach cause. Billing-abuse incidents follow the exact same pattern almost every time: a credential accidentally committed to a public code repository, embedded in a mobile app, or leaked through a misconfigured service, discovered by automated scanning tools attackers run continuously against public code hosting platforms specifically looking for exactly this pattern.

## Practical billing-security controls

- **Billing alerts and budgets** — configuring an alert that fires the moment spending crosses an unexpected threshold, catching abuse within hours rather than discovering it at the end of a billing cycle
- **Service quotas / limits** — many providers let you cap the maximum number or type of resources an account can provision, meaningfully limiting the damage even a fully compromised account can do
- **Never commit credentials to source code** — directly connecting to Path 22's DevSecOps material and the applied-crypto lesson's key-management guidance, and specifically why automated secret-scanning tools exist
- **Least-privilege IAM** (from the identity-access lesson) — a compromised credential that only has permission to read from one storage bucket can't spin up a fleet of expensive compute instances at all, regardless of how the credential leaked

## Cost as a security signal, not just a finance concern

The logging-monitoring lesson mentioned "unusual billing activity" as a security-relevant monitoring target — this lesson is where that connection becomes concrete: a sudden, unexplained spike in compute spending is frequently one of the *earliest* observable signs of a cloud account compromise, sometimes appearing before any other indicator does, precisely because cryptomining abuse specifically wants to maximize resource usage as fast as possible before being detected and shut down.

:::challenge Diagnose an incident from billing alone
A small startup receives a billing alert showing their monthly cloud spend has already exceeded the entire previous year's total spend, only eight days into the current month. Investigation shows dozens of large, GPU-optimized compute instances running in a region the company has never used before, none of which any team member recalls provisioning.

<details><summary>Hint</summary>Given this lesson's coverage of the classic billing-abuse pattern, what's the most likely underlying cause here, and what should the immediate response be?</details>
<details><summary>Show answer</summary>This is a textbook cryptomining abuse incident, almost certainly originating from a leaked credential — the unfamiliar region, the GPU-optimized instance types (ideal for mining), and the extreme, sudden cost spike all match this lesson's described pattern precisely. The immediate response: revoke or rotate the compromised credential immediately, terminate the unauthorized instances, and then investigate how the credential leaked in the first place (checking public code repositories, recent commits, and any services the credential may have been embedded in) — following the same isolate-first-investigate-second instinct established in Path 07's compromise-recognition lesson, adapted to a cloud account instead of a single machine.</details>
:::

## 🧪 Hands-on lab — set up a real billing alert

If you have (or create) a free-tier cloud account, configure a billing alert or budget notification for a low threshold (even $1), confirming you understand exactly how the notification would reach you if triggered. If you don't have an account, sketch the specific threshold and notification method you'd configure and why.

:::challenge Test yourself
1. Why does cryptomining abuse specifically target the largest, most expensive compute instance types available?
2. What's the usual entry point for a cloud billing-abuse incident?
3. Why can a sudden cost spike sometimes be one of the earliest indicators of a cloud account compromise?
:::

## Key terms

- **Billing alert / budget** — a configured notification that fires when cloud spending crosses a defined threshold.
- **Cryptomining abuse** — using a compromised cloud account's compute resources to mine cryptocurrency at the account owner's expense.
- **Service quota** — a provider-enforced limit on the number or type of resources an account can provision.

## Recap

Cloud billing is a genuinely distinct attack surface from the confidentiality-focused breaches covered elsewhere in this course — a compromised account with sufficient permissions can generate real, rapid financial damage through resource abuse (overwhelmingly cryptomining) without ever touching a single piece of data. Billing alerts, service quotas, and — most importantly — the same least-privilege IAM discipline from the identity-access lesson are what actually limit this risk, and unexplained cost spikes deserve the same immediate, isolate-first response as any other compromise indicator covered throughout this course.

???refs
- [AWS — What to do if you notice unauthorized activity](https://aws.amazon.com/premiumsupport/knowledge-center/potential-account-compromise/) — official guidance for exactly this scenario
???

**Next up →** [Cloud Identity & Access Management](#/lesson/08-cloud-basics/cloud-identity-access)
