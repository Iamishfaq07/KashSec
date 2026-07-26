# Active Directory Persistence & Detection

The previous lesson explained Kerberos mechanics behind Golden Tickets. This lesson covers what happens after that level of compromise — how attackers maintain long-term access, and how defenders actually catch it — directly connecting to Path 12's defense-in-depth lesson, now applied to the specific, high-stakes domain of AD compromise.

## Why persistence matters more in AD than almost anywhere else

Directly connecting to Path 14's lateral-movement-techniques lesson: once an attacker achieves Domain Admin, they don't just want momentary access — they want to survive password resets, account disabling, and even a partial incident response effort, which is exactly what makes AD persistence techniques a genuinely higher-stakes concern than persistence on any single compromised workstation.

## Golden Ticket persistence, revisited

The previous lesson explained the mechanism; here's why it's so hard to fully remediate: a forged Golden Ticket remains valid until the krbtgt account's password is rotated — and because AD retains the two most recent krbtgt password versions simultaneously (for operational continuity), a single rotation isn't sufficient. Microsoft's official guidance requires rotating krbtgt **twice**, with enough time between rotations for replication to complete across all Domain Controllers, or a Golden Ticket forged with the older hash remains valid.

## DCSync — stealing password hashes without touching a DC's disk

**DCSync** abuses a legitimate Active Directory replication feature: any account with replication permissions (normally reserved for Domain Controllers themselves, but sometimes over-permissioned by misconfiguration) can request password hash data directly from a Domain Controller by *impersonating* a DC during the replication protocol — meaning an attacker with the right permissions can extract every domain user's password hash, including krbtgt, without ever touching a Domain Controller's actual disk or running code on it directly, a significant detection-evasion advantage over dumping hashes locally.

## Skeleton Key — a persistent backdoor password

A more aggressive technique: **Skeleton Key** malware patches a Domain Controller's authentication process in memory to accept a single, attacker-chosen master password for *any* domain account, in addition to that account's real password continuing to work normally — meaning the attacker gains a persistent, universal backdoor while every legitimate user's normal login continues working completely unaffected, making it genuinely hard to notice without specific detection.

## How defenders actually catch this

Directly connecting to Path 16's dfir lesson later in this path: detecting AD persistence relies heavily on specific, well-known event log signatures —

- **Event ID 4769** (Kerberos service ticket requests) at unusual volume or against unusual SPNs — a Kerberoasting indicator
- **Event ID 4662** (object access) against the krbtgt account's replication properties — a DCSync indicator
- **Anomalous replication traffic** from a source that isn't a legitimate Domain Controller — directly connecting to Path 24's UEBA/behavioral-analytics lesson, since this is exactly the kind of "this account has never done this before" pattern behavioral baselining is designed to catch, distinct from any single-event signature

## Why remediation goes far beyond "reset the compromised password"

:::danger A single password reset rarely fully evicts an AD-level attacker
Once Domain Admin-level compromise (and krbtgt hash theft specifically) has occurred, a genuinely complete remediation requires the double krbtgt rotation described above, auditing every account's replication permissions for over-provisioning, and treating every credential in the domain as potentially exposed — not just the specific account initially compromised. This is exactly why real-world AD compromises frequently require a dedicated incident response engagement (Path 16's dfir lesson) rather than a quick fix, and why AD security fundamentals (least privilege, tiered administration) covered earlier in this lesson's parent topic matter so much as prevention.
:::

:::challenge Test yourself
Why is DCSync considered a significant detection-evasion advantage compared to dumping password hashes directly from a compromised Domain Controller's memory or disk?
<details><summary>Show answer</summary>Dumping hashes directly from a Domain Controller (using a tool like Mimikatz against LSASS memory, for instance) requires the attacker to have actually executed code on that Domain Controller — an action that's a well-monitored, high-value target for endpoint detection tools, generating clear evidence of code execution on a critical system. DCSync instead abuses the legitimate Active Directory replication protocol itself: an account with sufficient (often over-provisioned) permissions can simply request replication data from a Domain Controller over the network, exactly as a real, legitimate secondary Domain Controller normally would — meaning the malicious activity looks structurally identical to normal AD replication traffic rather than to a suspicious code-execution event, and no code ever needs to run on the Domain Controller itself at all. This is precisely why detecting DCSync requires monitoring for the specific replication-permission abuse pattern (Event ID 4662 against krbtgt's replication properties) rather than relying on endpoint detection tools that watch for code execution — the attack technique was deliberately designed around abusing a trusted, expected protocol rather than triggering an obviously anomalous action.</details>
:::

## Key terms

- **DCSync** — abusing Active Directory's replication protocol to extract password hashes by impersonating a Domain Controller.
- **Skeleton Key** — malware that patches a Domain Controller's authentication to accept a universal backdoor password alongside real ones.
- **Tiered administration** — a defensive AD model restricting which accounts can administer which tier of systems, limiting lateral escalation.

## Recap

- Golden Ticket persistence requires the krbtgt password to be rotated twice, due to AD's two-generation password retention.
- DCSync extracts domain-wide password hashes by abusing legitimate replication permissions, without ever executing code on a Domain Controller directly.
- Skeleton Key provides a persistent, universal backdoor password that coexists invisibly alongside every real login continuing to work normally.
- Detection relies on specific event log signatures and behavioral baselining rather than any single obvious indicator, and full remediation goes well beyond a single password reset.

**Next up →** [Cloud security fundamentals](#/lesson/16-advanced/cloud-security)
