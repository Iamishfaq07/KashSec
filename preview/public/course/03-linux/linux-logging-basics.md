# Linux Logging Basics

The filesystem-hierarchy lesson pointed to `/var/log` as where logs live. This lesson explains what's actually in there, how to read it, and why this is the exact foundation the linux-forensics-lab at the end of this path builds on — directly paralleling Path 07's Windows Event Viewer coverage.

## Where Linux logs actually live

```
/var/log/auth.log      # authentication events (Debian/Ubuntu)
/var/log/secure         # authentication events (RHEL/CentOS)
/var/log/syslog         # general system messages
/var/log/apache2/       # web server logs, if Apache is installed
```

Different distros and services organize logs slightly differently, but `/var/log` is always the starting point.

## journalctl: reading systemd's unified log

Modern systemd-based systems (from the process-management lesson) also maintain a unified, structured log accessible through `journalctl`:

```bash
journalctl                    # view the full log
journalctl -u ssh              # view logs for a specific service (e.g., SSH)
journalctl --since "1 hour ago"  # filter by time
journalctl -f                  # follow the log live, as new entries arrive
```

`journalctl`'s structured, filterable format is often more convenient than manually grepping through plain-text log files, especially when investigating a specific service or time window.

## Reading authentication logs: your first real investigation

`/var/log/auth.log` (or `secure`) records every login attempt, successful or failed — directly applying the text-processing lesson's toolkit to a genuinely realistic security task:

```bash
grep "Failed password" /var/log/auth.log | tail -20
grep "Accepted password" /var/log/auth.log
```

A pattern of repeated `Failed password` entries from the same source address is the Linux-side equivalent of the failed-login-pattern Path 07's Event Viewer lesson taught you to recognize on Windows — a potential brute-force attempt worth investigating further.

## Why logging configuration itself is a security decision

Exactly like Path 08's cloud-logging lesson warned that audit logging isn't automatically enabled everywhere, Linux logging has its own version of this gap: log rotation settings that delete logs too aggressively, services not configured to log security-relevant events at all, or `journalctl`'s storage limits silently discarding older entries — any of these can leave you with nothing to investigate after an incident, precisely when you need it most.

:::danger Attackers actively clear or tamper with logs
A sufficiently privileged attacker will frequently attempt to clear or edit logs to cover their tracks — directly connecting to the log-analysis and incident-response material in Path 16. This is exactly why **centralized, remote log forwarding** (sending logs to a separate system the attacker can't easily reach, even if they compromise the original machine) is considered a real security best practice, not just an operational convenience.
:::

:::challenge Test yourself
Why might an organization specifically forward its logs to a separate, remote logging system rather than relying solely on logs stored locally on each machine?
<details><summary>Show answer</summary>Logs stored only locally on a machine are entirely within an attacker's reach the moment they compromise that machine with sufficient privilege — a sophisticated attacker can simply edit or delete the log entries documenting their own activity, exactly the "clearing tracks" behavior this lesson described. Forwarding logs to a separate, remote system in near-real-time means that even if the original machine is fully compromised afterward, the log entries already sent to the remote system remain intact and available for investigation — the attacker would need to separately compromise the remote logging system too, a meaningfully higher bar. This is precisely the same principle behind Path 08's cloud audit-logging coverage, applied to on-premises Linux infrastructure.</details>
:::

## Key terms

- **journalctl** — the command for querying systemd's unified, structured log.
- **auth.log / secure** — the log files recording authentication events on Debian-based and RHEL-based systems respectively.
- **Centralized logging** — forwarding logs to a separate remote system, protecting them from tampering even if the original machine is compromised.

## Recap

- `/var/log` and `journalctl` are the two primary ways to read Linux logs, directly paralleling Path 07's Windows Event Viewer coverage.
- Authentication logs specifically reveal login attempt patterns, letting you spot the same kind of brute-force signal Path 07 taught for Windows.
- Logging configuration is itself a security decision — and centralized, remote log forwarding protects against attackers clearing their own tracks after a compromise.

**Next up →** [Linux Firewall Basics](#/lesson/03-linux/linux-firewall-basics)
