# Device Trust & Posture Verification

Correct credentials answer "who is this?" They say nothing about "what are they typing on?" A stolen or malware-infected laptop can present perfectly valid credentials — the right username, the right password, even a completed MFA challenge if the malware can relay it. Zero Trust closes this gap by making the **device itself** part of every access decision, not just the human using it.

:::tip
The practical question device trust answers is simple: "even if this login is genuinely the right person, is the machine they're using safe enough to grant this specific access?" Sometimes the honest answer is no, even for the account owner's own real login.
:::

## What "device posture" actually means

Posture is a snapshot of a device's health, checked at login and often continuously afterward:

| Signal | What it tells you |
|---|---|
| OS patch level | Is this device missing critical security updates? |
| Disk encryption | If the device is lost or stolen, is the data protected? |
| EDR/antivirus status | Is endpoint detection actually running, and reporting clean? |
| Management enrollment | Is this a company-managed device the org can push policy to, or an unknown personal device? |
| Jailbreak/root status | Has the device's own security model been deliberately bypassed? |
| Screen lock / passcode | Is there a basic physical-access control in place at all? |

None of these are exotic checks — they're the kind of thing an MDM (Mobile Device Management) or endpoint agent reports automatically, continuously, without the user doing anything.

## Managed vs. unmanaged devices

- **Managed devices**: owned or enrolled by the organization, running an agent that reports posture and can enforce policy (require encryption, push patches, remote-wipe if lost). Zero Trust policy can grant these devices broader access, because their health is actually verifiable.
- **Unmanaged (BYOD) devices**: personal phones and laptops with no agent, no enforced policy, no verifiable posture. Zero Trust doesn't have to *ban* these outright — but it should grant them meaningfully less access, or route them through more restrictive paths (like a browser-isolated view of an app instead of a native client with full local file access).

:::warn
A common real-world mistake: treating "the user completed MFA" as equivalent to "this device is trustworthy." They answer completely different questions. A phished user with a keylogger and a real-time MFA relay can complete MFA successfully on a fully compromised machine. Device posture is the check that catches what identity verification alone cannot.
:::

## Continuous vs. point-in-time checks

Traditional network access control (NAC) often checked posture once, at connection time — plug in, get scanned, get an IP, done for the rest of the session, even if the device gets compromised five minutes later. Zero Trust device trust aims to be continuous:

- Re-check posture periodically during a session, not just at login
- If EDR reports a device just got compromised mid-session, revoke or downgrade its access immediately, without waiting for the user to log out and back in
- Tie access to a live posture signal rather than a one-time attestation that goes stale the moment it's checked

## A worked example: the same user, two devices

Marcus needs to access the internal finance dashboard.

- **From his company laptop**: fully patched, disk encrypted, EDR reporting healthy, enrolled in MDM. Policy: full read/write access, no extra friction.
- **From his personal phone, unmanaged**, while traveling: no posture signal available at all — the org has no idea if it's patched, no idea if it's compromised. Policy: read-only access through a browser-based view with no download capability, and a fresh MFA challenge required, because the org is compensating for a total lack of device trust with tighter controls elsewhere.

Same person, same correct password, meaningfully different access — because the device, not just the identity, is part of the decision.

## Where this fits with existing tools

If you've studied endpoint security or malware analysis elsewhere in this course, device posture checks are the *policy* layer sitting on top of tools you already know: EDR agents, MDM platforms, disk encryption (BitLocker/FileVault), and patch management. Zero Trust doesn't invent new endpoint tooling — it insists that the *signals* those tools already collect actually get used in real-time access decisions, instead of just feeding a compliance dashboard nobody checks until an audit.

## 🧪 Hands-on lab — assess your own device's posture

1. Pick a device you use regularly (personal laptop or phone).
2. Check and record: is the OS fully patched? Is disk/device encryption enabled? Is there a passcode/biometric lock? Is any endpoint protection running?
3. For each "no," write one sentence on the realistic risk it represents (e.g., "no disk encryption" → "if this laptop is stolen, all local files are readable without a password").
4. Pick the single weakest signal and fix it right now if it's quick (enabling disk encryption, setting a passcode) — many of these are five-minute changes with a real security payoff.
5. Imagine this device trying to access a sensitive company system under a Zero Trust policy. Would it be treated as high-trust or low-trust, and why?

:::challenge Test yourself
1. Why is "the user completed MFA" not proof that the device they're using is safe?
2. Give one example of a Zero Trust policy that treats a managed and an unmanaged device differently for the exact same user and account.
3. What's the practical difference between a point-in-time posture check and a continuous one, and why does it matter for a device compromised mid-session?
:::

## Key terms

- **Device posture** — a real-time assessment of a device's security health (patch level, encryption, EDR status, etc.)
- **MDM (Mobile Device Management)** — a platform that enrolls, monitors, and enforces policy on managed devices
- **BYOD** — Bring Your Own Device; personal, typically unmanaged devices used for work access
- **NAC (Network Access Control)** — older network-layer approach to checking device health, historically point-in-time rather than continuous

## Recap

Identity answers "who," device posture answers "on what, and is it safe" — and Zero Trust needs both, continuously, not just at login. A managed, healthy device can reasonably earn broader access; an unmanaged or unhealthy one should get less, regardless of whose correct password unlocked it. This device-level signal is one of the key inputs the next lesson's network segmentation and continuous verification build directly on top of.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — covers device posture as a core policy input
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) — includes a dedicated devices pillar with maturity stages
???
