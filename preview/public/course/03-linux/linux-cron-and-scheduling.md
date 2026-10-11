# Linux Cron & Scheduling

Path 07 covered Windows Task Scheduler as a common persistence mechanism. This lesson covers Linux's equivalent — **cron** — both as a genuinely essential administrative tool and as exactly the same kind of attacker technique worth recognizing.

## What cron actually does

**cron** runs commands automatically on a defined schedule — a backup script every night, a log rotation every week, a monitoring check every five minutes — without requiring anyone to manually trigger it.

## Reading a crontab entry

```
# minute hour day-of-month month day-of-week command
30    2    *      *      *     /usr/local/bin/backup.sh
```

This example runs `backup.sh` at 2:30 AM, every day, every month — the five time fields (minute, hour, day-of-month, month, day-of-week) let you express nearly any recurring schedule, with `*` meaning "every."

```bash
crontab -l          # list your own scheduled jobs
crontab -e          # edit your own scheduled jobs
sudo crontab -l -u username   # view another user's scheduled jobs (as root)
```

## System-wide vs. per-user cron

Beyond each individual user's own crontab, Linux also supports system-wide scheduled jobs in `/etc/cron.d/`, `/etc/cron.daily/`, and similar locations — directly connecting back to the filesystem-hierarchy lesson's coverage of `/etc` as the single most security-relevant directory on the system.

## Cron as a persistence mechanism

Exactly mirroring Path 07's Windows Task Scheduler coverage: a malicious cron job — added to a compromised user's crontab, or dropped into `/etc/cron.d/` if the attacker has root — will keep re-executing on schedule, surviving a simple process kill or even a reboot, making it a genuine and commonly-used persistence technique in real Linux compromises.

:::danger An unfamiliar cron entry deserves the same scrutiny as an unfamiliar Windows scheduled task
Directly extending the recognizing-compromise habit from Path 07: periodically reviewing `crontab -l` for your own account, and system-wide cron locations under `/etc`, for anything unfamiliar is a genuinely valuable, low-effort investigation habit — particularly after any suspected compromise.
:::

## systemd timers: the modern alternative

Modern Linux systems increasingly use **systemd timers** instead of (or alongside) traditional cron, integrating scheduling directly with the systemd service management covered in the process-management lesson:

```bash
systemctl list-timers        # list all active systemd timers
```

Functionally similar to cron, but tied more tightly into systemd's logging and dependency management — worth recognizing by name even if cron remains more common in casual, day-to-day scripting.

:::challenge Test yourself
Why does a malicious cron job represent a more durable threat than simply running a malicious process directly?
<details><summary>Show answer</summary>A process running directly can be discovered and killed (using the `kill` command from the process-management lesson), and it disappears entirely if the system reboots. A cron job, by contrast, is a standing <em>instruction</em> stored in a crontab file — even if the currently-running instance is killed, the scheduled entry remains, and cron will simply launch it again at the next scheduled time, surviving both a kill and a full reboot. This is exactly why cron (and its Windows Task Scheduler counterpart from Path 07) is such a commonly used persistence mechanism: it doesn't just run malicious code once, it guarantees that code keeps coming back on a schedule until the underlying crontab entry itself is found and removed.</details>
:::

## Key terms

- **cron** — Linux's time-based job scheduler, running commands automatically on a defined recurring schedule.
- **crontab** — the file (per-user or system-wide) defining a set of scheduled cron jobs.
- **systemd timer** — the modern systemd-integrated alternative to traditional cron scheduling.

## Recap

- cron runs commands automatically on a schedule, essential for backups, maintenance, and monitoring — and, in the wrong hands, a durable attacker persistence mechanism that survives both process termination and reboots.
- Both per-user crontabs and system-wide locations under `/etc` deserve periodic review, exactly mirroring the scheduled-task scrutiny Path 07 established for Windows.
- systemd timers are the modern alternative, worth recognizing by name even where cron remains more common day to day.

**Next up →** [Linux Logging Basics](#/lesson/03-linux/linux-logging-basics)
