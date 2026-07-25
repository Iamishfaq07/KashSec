# Linux — The Binary That Betrayed Root

**Category:** Linux/Privesc · **Difficulty:** Medium

## Scenario

You have low-privileged SSH access to a training box as user `intern`. This section's earlier privesc challenge covered `sudo` misconfiguration specifically — this one is a different vector entirely: the **SUID bit**, a completely separate way an ordinary binary can end up running with root's privileges.

## Provided data

Your `sudo -l` check comes back empty this time — no path there:

```
intern@kashsec-box:~$ sudo -l
Sorry, user intern may not run sudo on kashsec-box.
```

But a standard privesc enumeration step turns up something else:

```
intern@kashsec-box:~$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/mount
/usr/bin/python3.9
```

```
intern@kashsec-box:~$ ls -la /usr/bin/python3.9
-rwsr-xr-x 1 root root 5471288 Jan 14  2025 /usr/bin/python3.9
```

## Your task

`find ... -perm -4000` lists every file with the **SUID bit** set — meaning it runs with the *file owner's* privileges (here, `root`), regardless of who executes it. `passwd`, `sudo`, and `mount` having SUID set is completely normal and expected. `python3.9` having it set is not — that's the misconfiguration. Turn this into a root shell and find the flag in `/root/flag.txt`.

:::challenge Turn a SUID interpreter into a root shell
<details><summary>Hint 1</summary>The SUID bit doesn't care what the binary <em>is</em> — only that its owner is root and the bit is set. A general-purpose scripting language interpreter running with root's privileges can be told to execute arbitrary code, and that code inherits the interpreter's effective privileges.</details>
<details><summary>Hint 2</summary>Python has a built-in way to replace the current process with a new shell process, inheriting whatever privileges the calling process currently holds. Look into Python's <code>os</code> module — specifically a function for executing another program in place of the current one.</details>
<details><summary>Show full answer</summary>Because <code>/usr/bin/python3.9</code> is SUID-root, running <code>/usr/bin/python3.9 -c 'import os; os.setuid(0); os.system("/bin/sh")'</code> spawns a shell that inherits root's effective privileges — the SUID bit means the Python interpreter itself started with root's permissions, and explicitly calling <code>os.setuid(0)</code> makes that privilege permanent for the shell it then launches, rather than just temporary/effective. From that root shell, <code>cat /root/flag.txt</code> returns: <code>KASHSEC{su1d_1nterpret3rs_4re_r00t_sh3lls}</code>. This is a textbook entry from GTFOBins, a well-known public reference cataloging exactly which common Unix binaries can be abused this way when SUID, sudo-permitted, or otherwise misconfigured — Python, along with dozens of other everyday tools (find, vim, less, awk, and more), appears on that list precisely because these general-purpose tools almost always offer some built-in way to execute arbitrary commands.</details>
:::

## The flag

```
KASHSEC{su1d_1nterpret3rs_4re_r00t_sh3lls}
```

## Why this matters beyond the CTF

SUID misconfiguration is one of the most common real-world Linux privilege escalation vectors, and it's genuinely easy to introduce by accident — a system administrator running `chmod u+s` on a binary to solve one specific permissions headache, without fully reasoning through what that binary can actually be made to do once it inherits root. Path 03's Linux fundamentals and Path 16's Linux Privilege Escalation lesson both cover SUID enumeration (`find / -perm -4000`) as a standard first step in any real Linux privesc assessment — right alongside the `sudo -l` check this section's earlier challenge focused on. A thorough real-world assessment always checks both vectors, since a target hardened against one is often still wide open on the other.

## Bonus round — why is Python especially dangerous here, compared to a narrower tool?

:::challenge What makes an interpreter a uniquely bad thing to leave SUID?
<details><summary>Hint</summary>Compare Python to something like <code>/usr/bin/passwd</code>, which is also SUID-root but isn't a privesc vector at all in normal use. What's fundamentally different about what each program is <em>capable</em> of doing?</details>
<details><summary>Show answer</summary><code>passwd</code> is SUID-root by design, but its entire functionality is narrowly scoped to one specific, carefully-controlled task (changing a password with proper validation) — it has no general mechanism for an ordinary user to make it do anything else. A full scripting language interpreter, by contrast, is Turing-complete and deliberately designed to run arbitrary code on command — that's its entire purpose. Making a general-purpose interpreter SUID is fundamentally different from making a narrow, purpose-built utility SUID, because the interpreter's "intended functionality" and "arbitrary code execution" are the same thing. This is exactly why GTFOBins treats interpreters (Python, Perl, Ruby, Lua, and others) as some of the highest-value SUID/sudo misconfiguration targets on the entire list.</details>
:::

:::tip A five-second real-world check
Running <code>find / -perm -4000 -type f 2>/dev/null</code> on any Linux system you're authorized to review takes seconds and immediately reveals every SUID binary present — cross-referencing the results against a resource like GTFOBins is one of the highest-value, lowest-effort steps in any real privilege escalation assessment.
:::

**Next up →** [Solution Write-ups: The Template Every Good CTF Player Uses](#/lesson/19-ctf-challenges/ctf-writeup-template)
