# Linux Forensics Basics Lab

This lab is a first, gentler pass at the same skill Path 11's DFIR Lab covers in depth later: investigating a Linux system for signs of compromise. Everything here uses only commands built into virtually every Linux system — no special tools required.

## Tasks

1. **Check running processes and network connections.**
   ```bash
   ps aux                    # every running process, with owner and command
   ss -tulpn                 # listening ports and the process bound to each
   ```
   Look specifically for anything unfamiliar: a process you don't recognize running as `root`, or a listening port you can't account for.
2. **Look at user accounts and login history.**
   ```bash
   cat /etc/passwd            # every account on the system
   last                       # recent login history
   lastb                      # recent failed login attempts (if logged)
   ```
   An unfamiliar account in `/etc/passwd`, or a login history entry from an unexpected time or source, are both classic first indicators worth investigating further.
3. **Examine logs in /var/log.** Focus especially on `/var/log/auth.log` (Debian/Ubuntu) or `/var/log/secure` (RHEL/CentOS) for authentication events — this is the same file format used in this course's CTF Zone forensics challenge, so the brute-force pattern you learned to spot there applies directly here.
   ```bash
   grep "Failed password" /var/log/auth.log | tail -20
   grep "Accepted password" /var/log/auth.log | tail -20
   ```
4. **Find recently modified or suspicious files.**
   ```bash
   find / -mtime -1 -type f 2>/dev/null    # files modified in the last 24 hours
   find / -perm -4000 -type f 2>/dev/null  # SUID binaries (from the privesc lesson)
   ```
   A recently modified system binary, or a new SUID binary you didn't create, both warrant close attention.

:::tip Build a mental baseline first
Real incident response is far easier when you already know what "normal" looks like for a given system — the processes that always run, the accounts that should exist, the typical login pattern. Run through these same four commands on your own everyday machine right now (nothing suspicious expected), just to build the habit of noticing what a "clean" baseline actually looks like before you ever need to spot an anomaly against it.
:::

:::challenge Write an incident summary
Imagine you've been asked to investigate a Linux server after a report of "unusual activity." Using the four task categories above (processes/connections, users/logins, logs, modified files) as your checklist, write a short summary of what you'd check and, for at least one category, what a genuinely suspicious finding would look like versus a benign one.
:::

## Key takeaway

Linux forensics fundamentals don't require exotic tools — `ps`, `ss`, `last`, `grep`, and `find` cover an enormous amount of ground, and knowing exactly what "normal" looks like on a system you're responsible for is often more valuable than any single tool, because it's what lets you actually recognize when something's wrong.

**Explore more →** [Path 04 — Programming & Python](#/lesson/04-python)
