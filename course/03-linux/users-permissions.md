# Users, permissions & sudo

The single most important security concept in any OS is **who is allowed to do what**. In Linux this is beautifully explicit. Master this and you understand half of Linux security instantly.

## Users, root, and groups

Every Linux system has:

- **Normal users** — accounts for people or services (like `kali`).
- **`root`** — the all-powerful superuser. Can do anything to anything.
- **Groups** — collections of users, so you can grant rights to a group instead of every user one by one (e.g., the `sudo` group is allowed to run admin commands).

```bash
whoami           # your username
id               # your UID, GID, and group memberships
groups           # groups you belong to
cat /etc/passwd  # all users on the system
cat /etc/group   # all groups
```

`/etc/passwd` is world-readable. Password *hashes* live in `/etc/shadow`, which is only readable by root.

## Sudo — becoming root for one command

Modern Linux discourages logging in as root directly. Instead, users with the right (typically in the `sudo` group) can run a single command with root's power by prefixing it with `sudo`:

```bash
apt update              # fails — normal user can't touch package system
sudo apt update         # works — you're temporarily root for this command
sudo -i                 # open a root shell (careful!)
```

Sudo asks for **your own password**, not root's. It's logged in `/var/log/auth.log`, so misuse leaves a trail.

:::tip THE ROOT PROMPT LOOKS DIFFERENT
When you're a normal user, the prompt ends in `$`. When you're root (via `sudo -i` or the root user directly), it ends in `#`. That single character is a constant reminder: **you can do damage right now — be careful.**
:::

## File permissions — the rwx model

Every file and folder has three sets of permissions for three classes of users:

```
-rwxr-xr--  1  alice  developers  4096  Jan 10  script.sh
│└─┬┘└─┬┘└─┬┘  │      │           │     │       └── name
│  │   │   │   │      │           │     └────────── modified
│  │   │   │   │      │           └──────────────── size
│  │   │   │   │      └──────────────────────────── group
│  │   │   │   └─────────────────────────────────── owner
│  │   │   └─────────────────────────── others' permissions (r--)
│  │   └───────────────────────────── group's permissions   (r-x)
│  └───────────────────────────── owner's permissions       (rwx)
└──────────────────────────── file type (- file, d directory, l link)
```

The three letters mean:

- **r** = read (list a folder's contents / read a file)
- **w** = write (add or delete inside a folder / modify a file)
- **x** = execute (enter a folder / run a file as a program)

## Changing permissions — chmod

Two ways to write permissions with `chmod`:

**Symbolic** (readable):

```bash
chmod u+x script.sh      # give the user (owner) execute
chmod g-w file           # remove write from the group
chmod o-r secret.txt     # deny others the ability to read
chmod a+r public.txt     # everyone can read
```

**Numeric** (each digit is a bitmap: r=4, w=2, x=1):

```bash
chmod 755 script.sh      # rwxr-xr-x — owner all, others read/execute
chmod 644 file.txt       # rw-r--r-- — owner read/write, others read
chmod 600 secret.txt     # rw------- — only owner can read/write
chmod 700 ~/.ssh         # rwx------ — SSH's private folder
```

Quick conversion table:

| Digit | Binary | Meaning |
|---|---|---|
| 0 | --- | none |
| 1 | --x | execute only |
| 2 | -w- | write only |
| 3 | -wx | write + execute |
| 4 | r-- | read only |
| 5 | r-x | read + execute |
| 6 | rw- | read + write |
| 7 | rwx | full |

`755` and `644` are the two you'll type most often.

## Changing owner and group — chown

```bash
sudo chown alice file.txt              # change owner
sudo chown alice:developers file.txt   # change owner and group
sudo chown -R kali:kali ~/project      # recursive on a folder
```

Changing ownership needs root.

## SUID, SGID, and the sticky bit — the security clue

Beyond rwx there are three special bits:

- **SUID** (Set User ID) — when set on an executable, it runs with the **owner's** privileges regardless of who runs it. Shown as `s` in the owner's execute slot: `-rwsr-xr-x`. Used for programs like `passwd` (needs to write `/etc/shadow` even for normal users).
- **SGID** (Set Group ID) — same idea but for group. Shown in the group's execute slot.
- **Sticky bit** — on a folder, prevents users from deleting each other's files. Shown as `t` in others' execute slot. Set on `/tmp`.

```bash
ls -l /usr/bin/passwd
# -rwsr-xr-x  1  root  root  ... /usr/bin/passwd
#     ^ that s means SUID root

# Find every SUID binary on the system (privesc clue!):
find / -perm -4000 -type f 2>/dev/null
```

:::danger SUID IS A PRIVESC GOLDMINE
A SUID binary owned by root that has any exploitable behaviour (like an old version, or one that spawns a shell) can turn a low-privileged user into root. This is huge in Path 16. Sites like **GTFOBins** catalogue every abusable SUID binary. Sneak preview: `sudo -l` on a target and see if `find`, `vim`, or `less` are in the list.
:::

## Linux capabilities — a more modern, finer-grained alternative to SUID

SUID is genuinely all-or-nothing — a SUID binary runs with the *entire* privilege set of its owner, even if it only needs one small piece of that power. Modern Linux offers **capabilities** as a more surgical alternative: splitting root's traditionally monolithic power into dozens of individual, independently grantable privileges (`CAP_NET_BIND_SERVICE` to bind low-numbered network ports, `CAP_DAC_OVERRIDE` to bypass file permission checks, and many more). A binary can be granted just the one specific capability it genuinely needs, rather than full root-equivalent power via SUID — a direct, practical application of least privilege at the binary level. Check a binary's granted capabilities with:

```bash
getcap -r / 2>/dev/null
```

Just like SUID binaries, an unexpectedly powerful capability grant on the wrong binary is a genuine privilege escalation vector — Path 16's Linux privilege escalation lesson covers this alongside SUID as part of the same systematic enumeration checklist.

## Installing software — the package manager

Kali (Debian-based) uses **`apt`**. This is how you install, remove, and update:

```bash
sudo apt update                     # refresh the list of available packages
sudo apt upgrade -y                 # apply all upgrades
sudo apt install nmap -y            # install a package
sudo apt remove nmap                # uninstall
sudo apt search "port scanner"      # search for something
apt show nmap                       # info about a package
```

Other distros:

- **Ubuntu/Debian** → `apt`
- **Fedora/RHEL/CentOS** → `dnf` (or `yum` on older)
- **Arch** → `pacman`
- **Alpine** → `apk`

The commands differ; the *concept* is identical.

## 🧪 Lab — Practise permissions

```bash
# 1. Make a private secret file
echo "my secret notes" > secret.txt
chmod 600 secret.txt          # only you can read/write
ls -l secret.txt              # verify: -rw-------

# 2. Make a shared team file
sudo mkdir /srv/team
sudo chown kali:kali /srv/team
chmod 770 /srv/team           # rwxrwx--- — you and group only

# 3. Hunt SUID binaries
find / -perm -4000 -type f 2>/dev/null | head
# Read a few. Compare to https://gtfobins.github.io/ — do any look interesting?

# 4. Install a new tool for later paths
sudo apt install seclists -y
ls /usr/share/seclists    # a huge wordlist collection you'll use in Path 11/10
```

:::challenge Test yourself
A file's permissions show as `-rwxr-xr--`. Which class of users cannot execute it?

<details><summary>Show answer</summary>Others (people not the owner and not in the group). The "others" triplet is <code>r--</code> — read only, no execute.</details>
:::

## Key terms

- **root / UID 0** — the all-powerful superuser.
- **sudo** — run one command as root, using *your* password.
- **rwx** — read / write / execute.
- **`chmod` / `chown`** — change permissions / ownership.
- **SUID / SGID / sticky** — special bits with big security implications.
- **apt** — Debian's package manager.
- **GTFOBins** — reference of exploitable SUID/sudo binaries.

## Recap

- Every file has an owner, group, and rwx bits for three classes.
- Use `sudo` for admin actions; you get logged and audited.
- SUID binaries running as root are a classic privesc path — hunt with `find / -perm -4000`.
- `apt install` adds tools; keep the system updated with `apt upgrade`.

???refs
- [Linux file permissions — Red Hat](https://www.redhat.com/sysadmin/linux-file-permissions-explained) — clear reference with examples.
- [GTFOBins](https://gtfobins.github.io/) — the essential SUID / sudo abuse database.
- [sudo manual](https://www.sudo.ws/docs/) — official docs.
- [Explainshell — chmod](https://explainshell.com/explain?cmd=chmod+755+file) — paste any command, get every flag explained.
???

**Next up →** [Your first bash script](#/lesson/03-linux/bash-scripting)
