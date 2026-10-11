# Insider Threats

The attackers-kill-chain lesson focused on external attackers working their way in. This lesson covers a genuinely different, often under-appreciated risk category: people who already have legitimate access — and what happens when that access gets misused.

## What makes an insider threat structurally different

Every external attack technique covered elsewhere in this course — phishing, exploiting a vulnerability, brute-forcing a password — is fundamentally about *gaining* access an attacker doesn't already have. An **insider threat** starts from the opposite position: the person already has legitimate, authorized access, meaning many of the controls designed to keep unauthorized people out (firewalls, MFA, the entire "who's trying to get in" model) simply don't apply the same way.

## Three broad categories, worth distinguishing

- **Malicious insiders** — someone who deliberately misuses their legitimate access for personal gain, revenge, or on behalf of a competitor or foreign actor
- **Negligent insiders** — someone who causes harm accidentally, through carelessness rather than malice (falling for phishing despite training, misconfiguring a system, losing an unencrypted device)
- **Compromised insiders** — a legitimate account taken over by an external attacker (through phishing, credential theft), who then operates *as* that insider, inheriting all of their legitimate access

Notably, the third category means "insider threat" and "external attacker" aren't always cleanly separate — a successfully phished employee's account, from the system's perspective, looks exactly like a legitimate insider, because at that point, technically, it is one.

## Why insider threats are genuinely harder to detect

An external attacker's activity often stands out against a baseline of "nobody from outside should be doing this at all." An insider's activity blends into normal, expected behavior by default — the same person legitimately accesses the same systems every day, making it genuinely difficult to distinguish "business as usual" from "this same person is now doing something they shouldn't." This is exactly why **behavioral baselining** (a preview of the UEBA concept from Path 24's analytics-and-monitoring lesson) matters so much specifically for insider threat detection — flagging deviations from an individual's *own* established normal pattern, not comparing against a generic rule.

## Practical mitigations

- **Least privilege** (Path 07's users-permissions lesson, and throughout this course) — limiting what any single insider can access in the first place directly limits the damage even a malicious insider can do
- **Separation of duties** — requiring more than one person to complete a sensitive action (a second approver for a large financial transfer), so no single insider can act alone
- **Monitoring and logging** — exactly the audit trail Path 08's logging lesson described, applied here specifically to catch insider misuse, not just external compromise
- **Offboarding discipline** — promptly revoking access when someone leaves an organization; a former employee's still-active credentials are a genuinely common, entirely preventable insider risk

:::challenge Test yourself
Why does a compromised employee account (taken over through phishing) count as a form of "insider threat," even though the actual attacker is an external party?
<details><summary>Show answer</summary>Once an external attacker successfully phishes an employee's credentials, every system the employee's account is legitimately permitted to access becomes accessible to the attacker too — from the system's own perspective, every action taken is performed by a properly authenticated, legitimately-privileged account, with no obvious external-attacker signal like an unfamiliar login source necessarily present (especially if the attacker uses techniques to blend in). This is exactly why this lesson categorizes "compromised insiders" as its own distinct category: the actual person behind the action is an external attacker, but the access, privileges, and behavioral blending-in are functionally identical to a genuine insider, meaning the same detection challenges and mitigations (least privilege, behavioral baselining, monitoring) apply regardless of who's actually behind the keyboard.</details>
:::

## Key terms

- **Insider threat** — risk arising from someone who already has legitimate, authorized access to a system.
- **Separation of duties** — requiring more than one person to complete a sensitive action, preventing any single insider from acting alone.
- **Compromised insider** — a legitimate account taken over by an external attacker, inheriting that account's full legitimate access.

## Recap

- Insider threats — malicious, negligent, or compromised — start from a position of legitimate access, meaning many external-attacker-focused controls don't apply the same way.
- Insider activity blends into normal behavior by default, making detection genuinely harder and behavioral baselining especially valuable.
- Least privilege, separation of duties, monitoring, and prompt offboarding are the practical mitigations, each limiting either the opportunity for misuse or the damage it can cause.

**Next up →** [Malware types explained](#/lesson/10-fundamentals/malware)
