# Forensics — The Log Hunt

**Category:** Forensics · **Difficulty:** Easy

## Scenario

A small company's SSH server has been acting strangely — higher-than-normal load overnight, and a support ticket mentions "weird login attempts." You've been handed a trimmed excerpt from `/var/log/auth.log` and asked to determine whether an attack actually succeeded, and if so, from where.

## Provided data

```
Mar 14 02:14:01 web01 sshd[1122]: Failed password for admin from 203.0.113.77 port 51223 ssh2
Mar 14 02:14:03 web01 sshd[1122]: Failed password for admin from 203.0.113.77 port 51224 ssh2
Mar 14 02:14:05 web01 sshd[1122]: Failed password for admin from 203.0.113.77 port 51225 ssh2
Mar 14 02:14:07 web01 sshd[1122]: Failed password for root from 203.0.113.77 port 51226 ssh2
Mar 14 02:14:09 web01 sshd[1122]: Failed password for root from 203.0.113.77 port 51227 ssh2
Mar 14 02:19:44 web01 sshd[1130]: Failed password for deploy from 198.51.100.14 port 40011 ssh2
Mar 14 02:31:18 web01 sshd[1122]: Failed password for admin from 203.0.113.77 port 51298 ssh2
Mar 14 02:31:20 web01 sshd[1122]: Failed password for admin from 203.0.113.77 port 51299 ssh2
Mar 14 02:31:22 web01 sshd[1122]: Accepted password for admin from 203.0.113.77 port 51300 ssh2
Mar 14 02:31:22 web01 sshd[1122]: pam_unix(sshd:session): session opened for user admin
Mar 14 02:45:09 web01 sshd[1130]: Failed password for deploy from 198.51.100.14 port 40099 ssh2
Mar 14 09:02:11 web01 sshd[1140]: Accepted publickey for deploy from 198.51.100.14 port 40501 ssh2
```

## Your task

Determine: (1) which IP address successfully broke in, and (2) what type of attack this log represents. The flag encodes the attacker's IP address.

:::challenge Analyze the log
<details><summary>Hint 1</summary>Scan for the word <code>Accepted</code> — that's the line where a login attempt actually succeeded, as opposed to the many <code>Failed password</code> lines around it. There are two "Accepted" lines here — only one of them is preceded by a long run of failures from the same source.</details>
<details><summary>Hint 2</summary>Notice that <code>203.0.113.77</code> tries multiple different usernames (<code>admin</code>, then <code>root</code>, then back to <code>admin</code>) in rapid succession (2-second intervals), repeatedly, over many minutes — this pattern has a specific name distinct from a normal failed login. Compare this to the <code>198.51.100.14</code> entries, which eventually succeed via <code>publickey</code> authentication instead of a password at all.</details>
<details><summary>Show full answer</summary>The log shows a classic <strong>brute-force attack</strong> from <code>203.0.113.77</code> — rapid, repeated password attempts against multiple usernames (<code>admin</code>, <code>root</code>) from the same source, which eventually succeeds (<code>Accepted password for admin from 203.0.113.77</code> at 02:31:22). The <code>198.51.100.14</code> entries are a red herring by design: a legitimate deploy user occasionally mistyping their password, who later logs in successfully using SSH key-based (<code>publickey</code>) authentication — a completely normal pattern, not an attack. The distinguishing signals for the real attack are: (1) many failed attempts in tight succession, (2) multiple different usernames tried from one source (username enumeration/spraying behavior a legitimate user would never exhibit), and (3) an eventual password-based success immediately following a burst of failures from that same IP.</details>
:::

## The flag

The flag encodes the attacker's IP address with dots replaced by dashes:

```
KASHSEC{203-0-113-77}
```

## Bonus round — what happened after the login?

The attacker successfully authenticated at `02:31:22`. Here's the next few lines of the log, previously trimmed from the excerpt above:

```
Mar 14 02:31:45 web01 sudo:     admin : TTY=pts/0 ; PWD=/home/admin ; USER=root ; COMMAND=/usr/bin/cat /etc/shadow
Mar 14 02:32:10 web01 sudo:     admin : TTY=pts/0 ; PWD=/home/admin ; USER=root ; COMMAND=/usr/sbin/useradd -m backup_svc
Mar 14 02:32:31 web01 sudo:     admin : TTY=pts/0 ; PWD=/home/admin ; USER=root ; COMMAND=/usr/sbin/usermod -aG sudo backup_svc
```

:::challenge What is the attacker doing, and why does it matter for your incident response?
<details><summary>Show answer</summary>This is <strong>post-exploitation persistence</strong>, exactly the pattern covered in Path 09.6: the attacker first dumps <code>/etc/shadow</code> (harvesting every password hash on the system for offline cracking, Path 06.5's territory), then creates a brand-new user account (<code>backup_svc</code> — deliberately named to look like a legitimate service account rather than an obvious backdoor) and immediately adds it to the <code>sudo</code> group, granting it full administrative rights. This means simply resetting the <code>admin</code> account's password is nowhere near sufficient remediation — the attacker has planted an entirely separate, fully-privileged account that survives the original compromised credential being fixed. A real incident response here requires finding and removing <em>every</em> artifact the attacker created, not just closing the original entry point — precisely the "eradication" phase from Path 11.7's DFIR six-phase model, and exactly why a full timeline reconstruction (not just identifying the initial breach) matters so much.</details>
:::

## Why this matters beyond the CTF

This exact pattern — a burst of failed logins across multiple usernames from one source, followed by a success — is one of the most common indicators of compromise a SOC analyst reviews, and it's exactly what an **IDS/IPS** (Path 08) or a **SIEM** correlation rule is built to flag automatically in a real environment. Distinguishing a real attack from normal "noisy" user behavior (like the legitimate `deploy` user's occasional typos) is a genuinely important skill — over-alerting on every failed login buries analysts in false positives, while under-alerting misses real breaches. Path 11's **Digital Forensics & IR** lesson and its DFIR lab go deeper into this exact kind of log-based investigation.

:::tip Real-world response after a finding like this
Identifying the compromise is only step one. In a real incident, the next steps would be: force a password reset (or better, move to key-based auth entirely) for the compromised account, check what that session actually did after logging in (via further log/command-history review), block the attacking IP at the firewall, and document the full timeline — precisely the workflow covered in Path 09's **Reporting** and Path 11's **DFIR** lessons.
:::

**Next up →** [Web — Forge the Token](#/lesson/14-ctf-challenges/web-jwt-forge)
