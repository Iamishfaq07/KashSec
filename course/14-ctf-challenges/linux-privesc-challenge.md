# Linux — The Privesc Puzzle

**Category:** Linux/Privesc · **Difficulty:** Medium

## Scenario

You have low-privileged SSH access to a training box as user `analyst`. Your goal, as in a real privilege escalation scenario, is to find a path from this limited account to `root` — and read the flag sitting in `/root/flag.txt`, which only `root` can access.

## Provided data

The very first thing any privesc checklist tells you to run — and exactly what you did:

```
analyst@kashsec-box:~$ sudo -l
Matching Defaults entries for analyst on kashsec-box:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User analyst may run the following commands on kashsec-box:
    (root) NOPASSWD: /usr/bin/find
```

```
analyst@kashsec-box:~$ cat /root/flag.txt
cat: /root/flag.txt: Permission denied
```

## Your task

You're allowed to run exactly one binary as root, with no password required: `/usr/bin/find`. `find` is not an obvious "hacking tool" — but it has a well-documented feature that turns this into full root access.

:::challenge Work out the escalation
<details><summary>Hint 1</summary>This exact scenario — a seemingly harmless binary allowed via passwordless <code>sudo</code> that turns out to grant full root access — is common enough in real environments that there's an entire public database cataloging which common Unix binaries can be abused this way, and exactly how. Path 11's Linux privesc lesson mentions this resource by name.</details>
<details><summary>Hint 2</summary><code>find</code> supports an <code>-exec</code> flag, letting it run an arbitrary command against every file it matches. Since you're allowed to run <code>find</code> itself as root via <code>sudo</code>, any command you chain onto it with <code>-exec</code> also runs as root.</details>
<details><summary>Hint 3</summary>You don't need to actually search for anything meaningful — <code>find</code> just needs *a* starting point to search from before its <code>-exec</code> clause fires. A common pattern is pointing it at a small, guaranteed-to-exist location, then using <code>-exec</code> to spawn a shell instead of doing anything with the found files.</details>
<details><summary>Show full answer</summary>The classic GTFOBins technique for <code>find</code> is:
<pre>sudo find /etc/hostname -exec /bin/sh \; -quit</pre>
This tells <code>find</code> to "search" starting at <code>/etc/hostname</code> (a file guaranteed to exist on virtually any Linux system, used here purely as a valid starting argument) and, for the match it finds, <code>-exec</code> a shell (<code>/bin/sh</code>) instead of doing anything file-related — <code>-quit</code> stops after the first result so it doesn't loop. Because the entire <code>find</code> process (including everything it spawns via <code>-exec</code>) is running as <code>root</code> thanks to the passwordless sudo rule, the spawned shell is <em>also</em> root. From that root shell, <code>cat /root/flag.txt</code> now succeeds.</details>
:::

## The flag

```
KASHSEC{f1nd_3xec_1s_a_r00t_sh3ll}
```

## Why this matters beyond the CTF

This is not a contrived puzzle — `find`, `vim`, `less`, `awk`, `python`, and dozens of other everyday Unix binaries have documented `sudo`-abuse techniques exactly like this one, catalogued publicly on **GTFOBins**, a resource you'll see referenced repeatedly throughout Path 03 and Path 11. The underlying lesson generalizes far beyond `find` specifically: **any binary granted elevated privilege inherits the full power of every feature that binary has** — including features (like arbitrary command execution via `-exec`) that have nothing to do with the reason it was granted `sudo` access in the first place. Real system hardening means auditing `sudo -l` output against GTFOBins during every privilege review, not just trusting that a "safe-sounding" binary is actually safe in a privileged context.

:::tip This is a real first step in almost every CTF and pentest
Running <code>sudo -l</code> the moment you land on any Linux box — as this challenge opened with — is one of the single highest-value, lowest-effort privilege escalation checks that exists. Automated enumeration tools like **LinPEAS** (covered in Path 03's Advanced Terminal Lab) run this check automatically alongside dozens of others, but understanding what to do with the result manually, as you just did, is the skill that actually matters.
:::

## Bonus round — a second sudo rule, no GTFOBins entry needed

Suppose the box instead gave you this `sudo -l` output:

```
User analyst may run the following commands on kashsec-box:
    (root) NOPASSWD: /usr/bin/systemctl restart backup-agent.service
```

No file-search flags, no obvious `-exec`-style feature — `systemctl` restarting one specific service doesn't look like an escalation path at all.

:::challenge Is a narrowly-scoped sudo rule like this actually safe?
<details><summary>Hint</summary>What determines <em>what</em> actually runs when that service restarts? Is that something the sudo rule controls, or something defined somewhere else entirely — somewhere <code>analyst</code> might have write access to?</details>
<details><summary>Show answer</summary>It depends entirely on <strong>who can write to the service's unit file</strong> (typically under <code>/etc/systemd/system/</code>) or whatever script/binary that unit file points to. <code>sudo</code> only restricts <em>which command</em> <code>analyst</code> can run as root — it says nothing about the <em>contents</em> of <code>backup-agent.service</code> itself. If <code>analyst</code> can write to that unit file (check with <code>ls -la /etc/systemd/system/backup-agent.service</code>) or to the script it executes, they can point it at anything — including <code>ExecStart=/bin/sh -c "chmod u+s /bin/bash"</code> — then trigger it with the permitted <code>sudo systemctl restart</code> command, and it runs as root. This is exactly the same underlying lesson as the main challenge, generalized: <strong>a narrowly-scoped sudo rule is only as safe as everything that command's execution actually depends on</strong> — file permissions, environment variables, config file contents — not just the command name itself. Real privesc enumeration checks all of these layers, not just the sudoers entry in isolation.</details>
:::

## 🎓 Section complete

You've now worked through all seven challenges in the CTF Zone — Web (IDOR and JWT forgery), Crypto (layered encoding and known-plaintext XOR cryptanalysis), Forensics (log analysis), Misc (hidden data), and Linux privilege escalation. This is genuinely representative of what a real CTF competition or authorized penetration test day-to-day looks like: methodical enumeration, hypothesis testing, and applying concrete technical knowledge under uncertainty. When you're ready for the next level, TryHackMe and Hack The Box (referenced throughout this course) offer hundreds more challenges across exactly these same categories.

???refs
- [GTFOBins](https://gtfobins.github.io/) — the definitive, community-maintained database of Unix binary privesc techniques.
- [CryptoPals](https://cryptopals.com/) — the gold-standard free cryptography challenge set, including the exact known-plaintext XOR technique used in this section.
- [PicoCTF](https://picoctf.org/) and [TryHackMe](https://tryhackme.com/) — continue practicing across all of these categories and more.
???

**Explore more →** [Back to all paths](#/course) · [Your progress & certificate](#/progress)
