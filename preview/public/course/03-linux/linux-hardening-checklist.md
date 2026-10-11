# A Practical Linux Hardening Checklist

You've now covered users and permissions, package management, SSH, cron, logging, and firewalls. This lesson pulls all of it together into a single, practical checklist — the Linux-side counterpart to Path 07's "Securing a Windows Machine" lesson.

:::tip
Nothing in this checklist is new information — every single item traces back to a specific lesson earlier in this path. The value here is having it all in one place, in a sensible order, the way you'd actually work through it on a real system.
:::

## The checklist

1. **Keep packages updated** — `apt update && apt upgrade` (or your distro's equivalent) on a regular schedule, from the package-management lesson
2. **Remove unused packages** — reduce attack surface by removing software you don't actually need, also from the package-management lesson
3. **Enforce least privilege on user accounts** — no unnecessary `sudo` access, no shared accounts, from the users-permissions lesson
4. **Harden SSH** — disable password authentication in favor of key-based auth, disable direct root login, from the SSH lesson
5. **Enable a default-deny firewall** — `ufw default deny incoming`, explicitly allowing only what's genuinely needed, from the firewall-basics lesson (and remembering not to lock yourself out of a remote session)
6. **Review scheduled jobs** — audit `crontab -l` and system-wide cron locations for anything unfamiliar, from the cron-and-scheduling lesson
7. **Confirm logging is actually working** — check `/var/log` and `journalctl` are capturing what you expect, and consider centralized/remote log forwarding, from the logging-basics lesson
8. **Audit running services** — `systemctl list-units --type=service` to review what's actually running and whether it's genuinely needed, from the process-management lesson
9. **Check for world-writable files in sensitive locations** — `find / -perm -o+w -type f 2>/dev/null` surfaces files any user can modify, connecting back to the filesystem-hierarchy lesson's `/tmp` warning
10. **Review shell scripts for injection risk** — unquoted variables, unsafe `eval` usage, from the shell-scripting-pitfalls lesson

## Automating the checklist: don't rely on memory alone

Directly echoing Path 00's "building good digital habits" lesson: a checklist that lives only in your memory gets skipped under time pressure. Tools like **Lynis** (an open-source Linux security auditing tool) automate much of this checklist, scanning a system and producing a report flagging exactly these kinds of gaps — genuinely worth running periodically rather than relying entirely on manual review.

```bash
lynis audit system
```

## Why order matters here

Notice the checklist's sequence isn't arbitrary: updates and account hygiene come first (foundational, low-risk to change), SSH and firewall hardening come next (higher-impact, needs care not to lock yourself out), and auditing/review steps come last (checking your own work). Working through hardening in a sensible order — rather than randomly — reduces the chance of a mistake locking you out or breaking something mid-process.

:::challenge Test yourself
Why does this lesson recommend confirming SSH key-based authentication actually works *before* disabling password authentication entirely, rather than doing both steps simultaneously?
<details><summary>Show answer</summary>If key-based authentication isn't actually configured correctly — a public key not properly installed, incorrect file permissions on the <code>.ssh</code> directory — and password authentication gets disabled at the same time, you can end up completely locked out of the machine with no working authentication method left at all, especially painful on a remote server with no console access. The safe sequence is: set up and thoroughly test key-based login first, confirm it genuinely works from a fresh connection, and only then disable password authentication as a separate, deliberate follow-up step — directly applying the same "verify before you cut off your own access" caution the firewall-basics lesson gave for enabling default-deny remotely.</details>
:::

## 🧪 Hands-on lab — run the checklist on your own VM

Using the Kali or Ubuntu VM from earlier in this path, work through this lesson's ten-item checklist one item at a time, noting what you find at each step. If Lynis is available in your distro's repositories, install it and compare its automated findings against your own manual review.

## Key terms

- **Lynis** — an open-source Linux security auditing tool that automates much of a hardening review.

## Recap

This checklist consolidates everything covered across this path's earlier lessons — updates, least privilege, SSH hardening, firewalls, cron auditing, logging, service review, filesystem permissions, and shell-script safety — into one practical, sensibly-ordered sequence. Automated tools like Lynis complement, but don't replace, actually understanding *why* each item matters, which is exactly what the rest of this path has been building toward.

???refs
- [Lynis — Linux Security Auditing Tool](https://cisofy.com/lynis/) — the open-source tool referenced in this lesson
???

**Next up →** [Linux Careers & Certifications](#/lesson/03-linux/linux-careers-and-certifications)
