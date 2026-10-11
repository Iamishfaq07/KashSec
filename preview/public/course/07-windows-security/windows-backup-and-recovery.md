# Windows Backup & Recovery

Path 00's updates-and-backups lesson made the general case for backups. This lesson goes Windows-specific — the actual built-in tools, what each one protects against, and the recovery plan every hardened Windows machine should genuinely have ready before it's needed.

:::tip
The securing-a-windows-machine lesson's hardening checklist reduces the *chance* of a successful attack. This lesson covers the plan for when prevention fails anyway — because even a well-hardened machine can still be compromised, and a tested recovery plan is what turns that scenario from a disaster into an inconvenience.
:::

## The Windows-specific backup and recovery tools

- **File History** — automatically backs up copies of files in your libraries, desktop, and contacts to a separate drive over time, letting you restore a previous version of a specific file — useful for accidental deletion or corruption, though it doesn't capture a full system state
- **System Restore** — creates **restore points** capturing system settings and installed software state (not personal files) at a given moment, letting you roll back a problematic change (a bad driver update, a misconfigured setting) without touching personal files at all
- **System Image Backup** — a full, exact copy of an entire drive, including the operating system, installed programs, settings, and files — the closest thing to "rebuild this exact machine from scratch," and the most complete recovery option Windows offers natively
- **OneDrive / cloud backup integration** — syncs specific folders to the cloud continuously, providing the physically-separate copy Path 00's 3-2-1 backup rule calls for, protecting against local device loss or destruction specifically

## Why System Restore is not a substitute for a real backup

A genuinely common misunderstanding worth correcting directly: **System Restore does not protect your personal files, and it is not a defense against ransomware.** It only captures system configuration and installed software state — it does not back up your documents, photos, or other personal data, and modern ransomware frequently deletes or encrypts Windows's own restore points specifically *because* attackers know victims might otherwise rely on them to recover for free.

:::danger
Never treat System Restore as your only backup strategy. It solves a different problem (undoing a bad system change) than the one a real backup solves (recovering personal files after loss, corruption, or ransomware). You need both — they are not interchangeable.
:::

## Building a real recovery plan, not just enabling backup features

- **Follow the 3-2-1 rule** (from Path 00): a local backup (File History or a System Image) plus a physically or logically separate copy (cloud backup, an external drive stored elsewhere)
- **Keep at least one backup offline or immutable** — a backup drive that stays permanently connected to the machine can itself be encrypted by ransomware along with everything else; a drive disconnected between backups, or a cloud service with versioning/immutability, survives an attack that a permanently-attached backup wouldn't
- **Test recovery, not just backup** — exactly the same principle Path 00's updates-and-backups lesson emphasized: an untested backup is only a guess that it will work, and the first time you try to actually restore from it shouldn't be during a genuine emergency
- **Document the recovery process** — a written, step-by-step recovery procedure, so restoring doesn't depend entirely on one person's memory of how it's supposed to work under the stress of an actual incident

:::challenge Evaluate a backup strategy
An organization backs up all its Windows machines to a dedicated backup server that stays permanently connected to the same network as those machines, and hasn't tested a full restore in over a year.

<details><summary>Hint</summary>What happens to this backup strategy specifically in a ransomware scenario, given how ransomware often behaves once it gains network access? And separately, what's the risk in never having tested a restore?</details>
<details><summary>Show answer</summary>This strategy has two serious, independent weaknesses. First, a permanently-connected backup server on the same network is a realistic ransomware target itself — ransomware that spreads across a network specifically seeks out and encrypts backup systems precisely because organizations rely on them for recovery, meaning this backup could be destroyed in the very incident it was meant to protect against. Second, never testing a restore means the organization genuinely doesn't know whether their backups actually work — corrupted backup files, incomplete backup jobs, and configuration drift are all common, silent failure modes that only surface at restore time, which is exactly the wrong moment to discover them. The fix: keep at least one backup copy offline or immutable, and schedule regular test restores as a standing practice, not a one-time setup step.</details>
:::

## 🧪 Hands-on lab — set up and test real recovery

1. On a Windows machine or VM you control, enable File History or configure a System Image backup to an external drive.
2. Create a System Restore point manually, then make a small, reversible system change (like installing a test application) and practice rolling it back.
3. Actually test restoring a single file from your backup, confirming it opens correctly — not just assuming the backup succeeded.

:::challenge Test yourself
1. Why is System Restore not a substitute for a real personal-file backup?
2. Why can a permanently-connected backup drive or server be a liability during a ransomware incident?
3. What does "testing recovery" actually mean, and why does it matter as much as having a backup in the first place?
:::

## Key terms

- **Restore point** — a saved snapshot of Windows system configuration and installed software state, used by System Restore.
- **System Image Backup** — a complete, exact copy of an entire drive including the operating system and all files.
- **Immutable backup** — a backup that cannot be modified or deleted, even by an attacker with otherwise-privileged access, for a defined retention period.

## Recap

Windows provides several distinct backup tools — File History, System Restore, System Image Backup, and cloud sync — each solving a different problem, and understanding which is which prevents the common, dangerous mistake of relying on System Restore as a ransomware defense it was never designed to be. A real recovery plan follows Path 00's 3-2-1 rule, keeps at least one copy offline or immutable specifically because ransomware actively targets connected backups, and is actually tested before it's needed — the same "test it, don't just trust it" principle that applies to every backup strategy in this course.

???refs
- [Microsoft — Backup and restore in Windows](https://support.microsoft.com/en-us/windows/backup-and-restore-in-windows-352091d2-bb9d-3ea3-ed18-52ef2b88cbef) — official documentation on Windows's native backup tools
???

**Next up →** [Windows Privilege Escalation: An Introduction](#/lesson/07-windows-security/windows-privesc-intro)
