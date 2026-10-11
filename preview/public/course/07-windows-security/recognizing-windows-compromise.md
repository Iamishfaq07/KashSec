# Recognizing a Compromised Windows Machine

The Event Viewer lesson taught you where Windows records evidence. This lesson teaches you what to actually look for — the practical, recognizable signs that a Windows machine has been compromised, before Path 16's full incident-response material goes much deeper.

:::tip
None of the signs in this lesson are proof on their own — each one has a legitimate, non-malicious explanation too. The skill this lesson builds is noticing when *several* of them show up together, which is a much stronger signal than any single indicator alone.
:::

## Unusual process and resource activity

- **Unfamiliar processes in Task Manager** — a process name you don't recognize, especially one using significant CPU or network activity while the machine is supposedly idle
- **Processes running from unusual locations** — legitimate Windows system processes normally run from `C:\Windows\System32`; a process with a system-sounding name running from a temp folder or a user's Downloads directory is a classic red flag
- **Unexpected network connections** — a process making outbound connections to unfamiliar addresses, especially on non-standard ports, visible through Task Manager's network tab or a tool like `netstat`

## Account and authentication anomalies

- **Unexpected new user accounts** — an account you don't recognize, especially one in the Administrators group, is a serious sign someone has established persistent access
- **Failed login attempts you didn't generate** — a pattern of failed logins in the Security log (from the Event Viewer lesson) at times you weren't attempting to log in
- **Password or security setting changes you didn't make** — Windows Defender or Firewall settings silently disabled, or account passwords no longer working as expected

## System behavior changes

- **Unexpected slowdowns or crashes**, especially new and unexplained, can indicate malware consuming resources or a process actively interfering with normal system operation
- **New scheduled tasks** you didn't create — a common persistence mechanism, letting malware survive a reboot by re-launching itself automatically
- **Browser changes you didn't make** — a new default search engine, unfamiliar browser extensions, or a homepage that changed on its own, often signs of adware or a broader compromise

## Where to actually check, step by step

1. **Task Manager** (or the more detailed **Process Explorer** from Sysinternals) — review running processes for anything unfamiliar, paying attention to the "Details" tab for file location
2. **Event Viewer's Security log** — look for unexpected logon events (Event ID 4624/4625) and new account creation (Event ID 4720), directly building on the previous lesson
3. **Task Scheduler** — review scheduled tasks for anything unfamiliar, especially ones set to run at startup or logon
4. **Windows Defender's scan and protection history** — check whether real-time protection has been silently disabled, and review any recent detections that were quarantined or, more concerningly, allowed

## What to do if you genuinely suspect compromise

:::danger
If you have real reason to believe a machine is compromised, disconnect it from the network (unplug the ethernet cable, disable Wi-Fi) before doing anything else — this stops an attacker's ongoing access and prevents malware from spreading further, without destroying evidence the way a full power-off might. Path 16's incident-response lesson covers the full process in depth; for now, know that "isolate first, investigate second" is the correct instinct.
:::

:::challenge Evaluate the evidence
A user reports their laptop "feels slow." Investigation reveals: one unfamiliar process running from `C:\Users\Public\svchost.exe` (note the location — not the legitimate System32 path), a new scheduled task running every hour with no description, and three failed login attempts at 3 AM when the user was asleep.

<details><summary>Hint</summary>Is any single one of these three findings, alone, definitive proof of compromise? What does seeing all three together tell you that one alone wouldn't?</details>
<details><summary>Show answer</summary>Each finding individually has some innocent explanation in isolation, but together they form a strong, coherent picture of compromise. The process name <code>svchost.exe</code> is a legitimate Windows process name — but legitimate <code>svchost.exe</code> only ever runs from <code>C:\Windows\System32</code>, so a file with that exact name running from a user-writable location like <code>C:\Users\Public</code> is a classic malware trick relying on a user glancing at the name without checking the path. Combined with an unexplained recurring scheduled task (a persistence mechanism) and failed logins at an hour the legitimate user wasn't active, this is a strong, multi-signal indicator of compromise — exactly the "several signs together" pattern this lesson emphasizes over any single indicator alone. The correct next step is isolating the machine from the network and escalating, not just removing the one suspicious file and calling it resolved.</details>
:::

## 🧪 Hands-on lab — build your own checklist

Using the four checkpoints from this lesson (Task Manager, Event Viewer, Task Scheduler, Defender history), write yourself a short, repeatable checklist you could run through on any Windows machine you're asked to investigate, noting specifically what "normal" looks like at each checkpoint so you have a baseline to compare against later.

:::challenge Test yourself
1. Why is a process's file location often a stronger compromise indicator than its process name alone?
2. Name two places on a Windows machine where a persistence mechanism might show up.
3. Why should a suspected-compromised machine be disconnected from the network before further investigation, rather than powered off immediately?
:::

## Key terms

- **Process Explorer** — a Sysinternals tool providing more detailed process information than Task Manager alone.
- **Persistence mechanism** — a technique malware uses to survive a reboot and maintain access, such as a scheduled task or startup entry.
- **Isolation** — disconnecting a suspected-compromised machine from the network while preserving its state for investigation.

## Recap

No single sign proves compromise on its own — legitimate-sounding process names, occasional failed logins, and unfamiliar scheduled tasks can all have innocent explanations individually. The real skill is checking multiple sources (Task Manager, Event Viewer, Task Scheduler, Defender history) and recognizing when several signals point the same direction together. When genuine compromise is suspected, isolating the machine from the network first, then investigating, is the correct instinct — and Path 16's full incident-response material builds directly on this foundation.

???refs
- [Sysinternals Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer) — a free, detailed process-inspection tool from Microsoft
???

**Next up →** [Windows User Accounts & UAC](#/lesson/07-windows-security/windows-user-accounts)
