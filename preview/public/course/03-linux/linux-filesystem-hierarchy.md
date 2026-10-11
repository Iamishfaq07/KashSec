# The Linux Filesystem Hierarchy

The terminal-basics lesson got you moving around Linux. This lesson explains the actual map you're navigating — why `/etc` holds what it holds, why `/var` is named that, and why knowing this layout matters far beyond just finding files.

## Everything starts at `/`

Unlike Windows' separate drive letters (`C:`, `D:`), Linux has a single unified tree starting at the **root directory**, written simply as `/`. Every file and every other storage device, no matter how it's physically connected, gets mounted somewhere within this one tree.

## The directories worth knowing by name

```
/
├── bin, sbin   → essential command binaries
├── etc         → system-wide configuration files
├── home        → personal directories, one per user
├── var         → variable data: logs, caches, spool files
├── tmp         → temporary files, often cleared on reboot
├── usr         → installed software and its own bin/lib subfolders
├── root        → the root user's own home directory (not the same as /)
├── dev         → device files, representing hardware
└── proc        → a virtual filesystem representing running processes
```

- **`/etc`** — genuinely the single most security-relevant directory on the system. Nearly every configuration file that determines how a service behaves lives here, including `/etc/passwd` and `/etc/shadow` from the users-permissions lesson
- **`/var/log`** — where most system and application logs live, directly setting up the logging-basics lesson later in this path
- **`/tmp`** — world-writable by design, which makes it a genuinely common location for both legitimate temporary files *and* a landing spot attackers target when dropping malicious files, since any user can write there
- **`/proc`** — not a real directory on disk at all; it's a live, virtual window into the kernel's view of every running process, letting you inspect a process's memory maps, open files, and command line just by reading files under `/proc/<pid>/`

## Why this layout matters for security specifically

Knowing the filesystem hierarchy means knowing where to look during an investigation, and knowing what "normal" looks like well enough to spot what isn't. A suspicious executable sitting in `/tmp` or an unfamiliar file appearing in `/etc/cron.d/` (previewed here, covered fully in the cron-and-scheduling lesson) are both meaningful findings specifically *because* you understand what those locations are supposed to contain.

:::danger World-writable directories are a real, recurring attack surface
`/tmp` and similarly permissioned world-writable locations are frequently abused for privilege escalation techniques (a preview of the deeper coverage in Path 16's Linux privesc lab) — a script running as root that carelessly reads or executes a file from `/tmp` without verifying who put it there is a genuine, recurring real-world vulnerability pattern.
:::

:::challenge Test yourself
Why is `/etc` considered the single most security-relevant directory on a Linux system?
<details><summary>Show answer</summary><code>/etc</code> holds nearly every system-wide configuration file that determines how services actually behave — from user account definitions (<code>/etc/passwd</code>) to network configuration to which services start automatically. An attacker who can modify files in <code>/etc</code> can often reconfigure how the entire system behaves without needing to touch a single binary or exploit any software vulnerability at all — simply changing a configuration file can be enough to create a backdoor, weaken authentication, or redirect traffic. This is exactly why file integrity monitoring tools frequently watch <code>/etc</code> specifically, and why unexpected changes there are treated as a high-priority investigation finding.</details>
:::

## Key terms

- **Root directory (`/`)** — the single top-level directory containing Linux's entire unified filesystem tree.
- **`/proc`** — a virtual filesystem exposing live information about running processes.
- **World-writable directory** — a directory any user can write to, such as `/tmp`, a recurring target for attack techniques.

## Recap

- Linux organizes everything under one unified tree starting at `/`, unlike Windows' separate drive letters.
- `/etc` (configuration), `/var/log` (logs), `/tmp` (temporary, world-writable files), and `/proc` (live process information) are the directories most worth knowing by name for security work.
- Understanding this layout is what lets you recognize when something's out of place — exactly the skill an investigation or a privilege-escalation hunt depends on.

**Next up →** [Files & folders](#/lesson/03-linux/files-and-folders)
