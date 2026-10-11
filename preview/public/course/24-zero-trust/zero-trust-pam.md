# Privileged Access Management Under Zero Trust

Every control covered so far in this path applies to ordinary users and services. This lesson covers the highest-stakes identity category of all: privileged accounts — admins, root, domain controllers — where a single compromised credential can undo every other Zero Trust control this path has built.

:::tip
A blunt but accurate way to frame this lesson: **standing privileged access is the single largest gap in most "Zero Trust" rollouts that otherwise look complete.** An organization can nail identity, device posture, and micro-segmentation for its regular workforce and still have a domain admin account with a permanent, always-on, MFA-optional login sitting untouched since the servers were first set up.
:::

## Why privileged accounts break the "never trust, always verify" model by default

Privileged accounts, historically, are exactly the opposite of Zero Trust: broad, standing (always-active) access, often exempted from the MFA and conditional-access policies applied to regular users specifically *because* administrators found those controls inconvenient for frequent, urgent work. That convenience is precisely what makes a compromised privileged credential so devastating — it inherits every exemption that was granted for operational convenience.

## Just-in-Time (JIT) access: the core Zero Trust answer

Instead of a privileged account holding standing access permanently, **Just-in-Time access** grants elevated privilege only for a specific, time-boxed window, requested and approved (often through an automated workflow) at the moment it's actually needed, and automatically revoked afterward. This directly extends the continuous verification lesson's principle — access isn't a permanent grant, it's a continuously re-evaluated state — to the accounts where a mistake matters most.

## The core PAM techniques

- **Just-in-Time elevation** — no standing admin rights; elevation is requested, approved, time-boxed, and logged
- **Privileged session monitoring and recording** — every privileged session is logged and often recorded, since the accounts capable of the most damage deserve the most scrutiny, not an exemption from it
- **Break-glass accounts, tightly controlled** — a small number of emergency-access accounts exist for genuine outage scenarios, but their use triggers immediate alerting and mandatory post-use review, rather than being available as a convenient bypass for routine work
- **Credential vaulting** — privileged credentials are stored in a managed vault rather than memorized or hardcoded, checked out only when needed and rotated automatically afterward, closing off the common failure mode of a privileged password sitting unchanged in a config file for years

:::challenge Evaluate a real PAM gap
An organization has fully implemented Zero Trust for its 500 regular employees — MFA, device posture, conditional access, all enforced. Its 12 domain administrator accounts use a shared password last rotated two years ago, and MFA is technically enabled but exempted "for operational reasons" during business hours.

<details><summary>Hint</summary>What does an attacker's realistic best target look like in this environment, given everything else is well-defended?</details>
<details><summary>Show answer</summary>The domain admin accounts are now the obvious, highest-value target precisely *because* everything else is well-defended — an attacker who can compromise even one of the 12 shared credentials inherits standing, MFA-exempt, broad privileged access that bypasses every other control in the environment. The fix mirrors this lesson's core techniques directly: eliminate the shared password in favor of individual, vaulted, automatically-rotated credentials; remove the business-hours MFA exemption entirely; and replace standing admin access with Just-in-Time elevation so that even a compromised credential doesn't grant usable privilege unless a legitimate elevation request happens to be active at that moment.</details>
:::

## 🧪 Hands-on lab — design a JIT elevation workflow

Sketch a Just-in-Time access workflow for a hypothetical database administrator who occasionally needs production access: what triggers a request, who approves it, how long the elevation lasts, and what gets logged.

:::challenge Test yourself
1. Why do privileged accounts often end up exempted from controls applied to regular users, and why is that dangerous?
2. What does Just-in-Time access change about how elevated privilege is granted?
3. Why does a break-glass account need tighter controls than routine privileged access, not looser ones?
:::

## Key terms

- **Just-in-Time (JIT) access** — elevated privilege granted only for a specific, time-boxed window rather than standing indefinitely
- **Break-glass account** — an emergency-access account intended only for genuine outage scenarios, with mandatory logging and review on use
- **Credential vaulting** — storing privileged credentials in a managed system rather than memorized or hardcoded, checked out only when needed

## Recap

Standing privileged access is one of the largest gaps in Zero Trust rollouts that otherwise look complete — the exact accounts capable of doing the most damage are too often the ones exempted from the controls applied everywhere else. Just-in-Time elevation, session monitoring, tightly controlled break-glass accounts, and credential vaulting bring privileged access management in line with the never-trust-always-verify principle this entire path is built on, closing the gap an attacker would otherwise go looking for first.

???refs
- [NIST SP 800-53 — Privileged Access Management controls](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) — the control family covering privileged access
???
