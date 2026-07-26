# Linux Privilege Escalation Tools, Deep Dive

The Linux privilege escalation lesson covered LinPEAS and GTFOBins by name. This lesson goes deeper into how these tools actually work and how to interpret their output — directly connecting to Path 14's privilege-escalation-methodology lesson's enumeration-first principle, now applied specifically to Linux internals.

## LinPEAS isn't magic — it's systematic enumeration

**LinPEAS** works by running dozens of individual enumeration checks (SUID binaries, writable cron jobs, kernel version, sudo configuration, readable credential files) and color-coding results by likely exploitability — yellow for "worth investigating," red for "very likely exploitable." Understanding that it's fundamentally automating the exact manual checks a human would run by hand (not performing some opaque magic) matters because LinPEAS output requires interpretation, not blind trust — a red-highlighted finding still needs to be manually verified before being relied upon.

## Reading LinPEAS output without getting overwhelmed

A genuinely common beginner mistake: running LinPEAS and being paralyzed by hundreds of lines of output. The practical approach is to scan top-to-bottom for color-coded high-confidence findings first (SUID binaries matching a known GTFOBins entry, sudo rules allowing an easily-abused command) before reading every line — directly connecting to the exploitation lesson's "prioritize the reliable path" advice from Path 14.

## GTFOBins, used correctly

The GTFOBins database (referenced in the base lesson) documents, for hundreds of common Unix binaries, the exact command needed to abuse that binary for privilege escalation if it's SUID-set or runnable via sudo. Practical workflow: enumerate SUID binaries (`find / -perm -4000 -type f 2>/dev/null`) or sudo permissions (`sudo -l`), then check each result against GTFOBins directly rather than trying to memorize every entry — the database itself is the reference tool, not something to have memorized.

## Kernel exploits: powerful but risky

Directly connecting to Path 14's exploit-development-basics lesson: an outdated kernel version sometimes has a known, public privilege escalation exploit — but kernel exploits carry genuine risk of crashing the target system entirely, which matters enormously in an authorized engagement (per Path 14's RoE coverage) where system stability itself may be part of the agreed scope. This is exactly why kernel exploitation is typically treated as a last resort after exhausting safer misconfiguration-based paths.

## Writable files and cron jobs

A frequently-missed but high-value check: cron jobs (scheduled tasks) that run as root but execute a script writable by a lower-privileged user — replacing that script's contents (or appending a command) means the next scheduled cron run executes attacker-controlled code with root privileges, entirely without needing any binary exploit at all.

:::challenge Test yourself
Why does a kernel exploit generally get treated as a last resort rather than a first-choice privilege escalation technique, even when a known exploit exists for the target's kernel version?
<details><summary>Show answer</summary>A kernel exploit operates at the deepest level of the operating system, directly manipulating kernel memory to achieve privilege escalation — while genuinely powerful, this also means a failed or imperfect kernel exploit attempt carries real risk of crashing the entire system, not just the specific process being exploited, unlike a misconfiguration-based technique (an abusable SUID binary, a writable cron script) that fails safely if it doesn't work. In an authorized penetration test, causing a system crash is a genuinely serious outcome — it can violate the agreed Rules of Engagement from Path 14, disrupt business operations beyond what was authorized, and in the worst case require an unplanned incident-response conversation with the client about an outage the tester caused. Misconfiguration-based privilege escalation techniques carry no such risk, which is exactly why the standard methodology exhausts those safer options first and reserves kernel exploitation for cases where nothing else works.</details>
:::

## Key terms

- **LinPEAS** — an automated Linux enumeration script that surfaces likely privilege escalation vectors, color-coded by confidence.
- **GTFOBins** — a reference database documenting privilege escalation techniques for common SUID/sudo-abusable Unix binaries.
- **SUID binary** — an executable that runs with its owner's (often root's) privileges regardless of who invokes it.

## Recap

- LinPEAS automates the same manual enumeration checks a human tester would run, and its output still requires manual verification, not blind trust.
- GTFOBins is a lookup reference for exploiting specific SUID/sudo-permitted binaries, not something to memorize wholesale.
- Kernel exploits are powerful but carry genuine system-stability risk, making them a last resort after safer misconfiguration-based paths are exhausted.

**Next up →** [Windows privilege escalation](#/lesson/16-advanced/windows-privesc)
