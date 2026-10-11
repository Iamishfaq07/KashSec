# Files & folders

You navigate, read, and search files constantly during real work. This lesson is the toolbelt: the small handful of commands that cover 90% of what you'll ever do to files in Linux.

## The Linux filesystem shape

Everything in Linux lives under a single root, written as `/`. There are no "C:\" or "D:\" drives — extra drives get **mounted** into the tree at specific folders.

```
/
├── bin      → essential command binaries (ls, cat, cp)
├── boot     → boot loader files
├── dev      → device files (disks, terminals)
├── etc      → system configuration
├── home     → user home folders (/home/kali)
├── lib      → shared libraries
├── media    → mount points for removable media
├── mnt      → mount points for manual mounts
├── opt      → optional software
├── proc     → live info about the kernel and processes
├── root     → the root user's home
├── sbin     → system binaries (need root)
├── tmp      → temporary files (wiped on reboot)
├── usr      → user programs and data
└── var      → variable data: logs, mail spool, databases
```

You don't need to memorise this — but three folders matter constantly:

- **`/etc`** — where config lives. Attackers and defenders both dig here.
- **`/home/<you>`** — your personal folder. Where your work goes.
- **`/var/log`** — where nearly all system logs live. First stop when investigating.

## Navigation — pwd, cd, ls

```bash
pwd            # where am I?
cd /etc        # go to /etc
cd             # jump home (~) with no arguments
cd ..          # go up one folder
cd ../..       # go up two folders
cd -           # go to the previous folder you were in
ls             # list files here
ls -l          # long format: permissions, size, date
ls -la         # include hidden files (start with .)
ls -lh         # human-friendly sizes (K, M, G)
ls /etc/ssh    # list a specific folder
```

**Paths** come in two flavours:

- **Absolute** — starts with `/`, meaning "from the root." Example: `/etc/ssh/sshd_config`.
- **Relative** — starts from where you are. Example: `notes/day1.md`.

## Creating, moving, copying, deleting

```bash
mkdir project           # make folder
mkdir -p a/b/c/d        # make nested folders in one go
touch file.txt          # create empty file (or update its timestamp)
cp file.txt copy.txt    # copy
cp -r folder1 folder2   # copy a folder and its contents (recursive)
mv old.txt new.txt      # rename or move
mv file.txt /tmp/       # move into another folder
rm file.txt             # delete a file (careful — no recycle bin!)
rm -r folder            # delete a folder and everything in it
rm -rf folder           # forceful. Genuinely dangerous. Read on.
```

:::danger THE MOST FEARED COMMAND
`rm -rf /` (or `rm -rf ~`) will happily delete everything you have. There is no undo in Linux. Modern shells warn on `/`, but not always on subfolders or scripts using variables that resolve to empty strings.

**Habit:** double-check the target before running `rm -r`, and never run destructive commands as root without pausing.
:::

## Reading files

```bash
cat file.txt              # dump whole file to screen
less file.txt             # scrollable view (q to quit, / to search)
head -n 20 file.txt       # first 20 lines
tail -n 20 file.txt       # last 20 lines
tail -f /var/log/syslog   # follow a log live (Ctrl+C to stop)
wc -l file.txt            # count lines
file mystery.bin          # tell me what kind of file this is
```

## Finding things

Two commands do most of what you need:

```bash
find / -name "*.conf" 2>/dev/null
# find files by name; 2>/dev/null hides "permission denied" noise

find /home -type f -mtime -1
# files modified in the last day

find / -perm -4000 -type f 2>/dev/null
# SUID binaries — huge for privesc (Path 16!)

locate sshd_config
# instant search using a pre-built index; run 'sudo updatedb' first
```

### find's -exec flag — a preview of something important later

Beyond just locating files, `find` can run a command against every result it finds using `-exec`:

```bash
find /home -name "*.log" -exec grep -l "error" {} \;
# find every .log file, then grep each one for "error"
```

This is genuinely powerful for legitimate administration — but it's also exactly the mechanism this course's CTF Zone privesc challenge and Path 16's privilege escalation lab exploit: if `find` itself is ever run with elevated privileges (via `sudo`), whatever `-exec` launches inherits that same elevated privilege. Filing this pattern away now will make that later material click immediately instead of feeling like a brand-new trick.

## grep — the search command you'll live in

`grep` finds text *inside* files or streams. It is the single most-used security tool that isn't in the security toolbox.

```bash
grep "password" file.txt              # lines containing "password"
grep -i "PASSWORD" file.txt           # case-insensitive
grep -r "api_key" /home/kali/         # recursive through a folder
grep -n "error" /var/log/syslog       # show line numbers
grep -v "info" /var/log/syslog        # invert: lines WITHOUT "info"
grep -E "user|admin" file.txt         # extended regex; OR
```

## Pipes and redirection — where the power lives

The single Unix idea that changes everything: **the output of one command can be the input of the next**, joined by `|` (pipe).

```bash
# Show only ssh-related lines from a big log:
cat /var/log/auth.log | grep sshd

# Count them:
cat /var/log/auth.log | grep sshd | wc -l

# Top-10 IPs that tried to log in as root:
grep "Failed password for root" /var/log/auth.log \
  | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head
```

Redirection sends output to files instead of the screen:

```bash
ls > list.txt        # save output to file (overwrite)
ls >> list.txt       # append instead
command 2> err.log   # send errors to a file
command > out 2>&1   # send both to the same file
command < input.txt  # read stdin from a file
```

~~~svg Pipes and redirects visualised
<svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="12">
    <text x="350" y="30" text-anchor="middle" fill="#E9EEF3" font-weight="700" font-size="14">Pipe: output of one → input of next</text>
    <rect x="40" y="60" width="140" height="50" rx="6" fill="#111927" stroke="#3FB6A8"/>
    <text x="110" y="90" text-anchor="middle" fill="#3FB6A8" font-family="JetBrains Mono">cat auth.log</text>
    <line x1="185" y1="85" x2="230" y2="85" stroke="#EFA43A" stroke-width="2" marker-end="url(#a7)"/>
    <text x="207" y="75" text-anchor="middle" fill="#EFA43A" font-weight="700">|</text>
    <rect x="235" y="60" width="140" height="50" rx="6" fill="#111927" stroke="#3FB6A8"/>
    <text x="305" y="90" text-anchor="middle" fill="#3FB6A8" font-family="JetBrains Mono">grep Failed</text>
    <line x1="380" y1="85" x2="425" y2="85" stroke="#EFA43A" stroke-width="2" marker-end="url(#a7)"/>
    <text x="402" y="75" text-anchor="middle" fill="#EFA43A" font-weight="700">|</text>
    <rect x="430" y="60" width="140" height="50" rx="6" fill="#111927" stroke="#3FB6A8"/>
    <text x="500" y="90" text-anchor="middle" fill="#3FB6A8" font-family="JetBrains Mono">sort | uniq -c</text>
    <line x1="575" y1="85" x2="620" y2="85" stroke="#EFA43A" stroke-width="2" marker-end="url(#a7)"/>
    <text x="640" y="90" fill="#E9EEF3">📊</text>
    <text x="350" y="150" text-anchor="middle" fill="#E9EEF3" font-weight="700" font-size="14">Redirect: output → file</text>
    <rect x="180" y="180" width="140" height="40" rx="6" fill="#111927" stroke="#3FB6A8"/>
    <text x="250" y="205" text-anchor="middle" fill="#3FB6A8" font-family="JetBrains Mono">ls -la</text>
    <line x1="325" y1="200" x2="365" y2="200" stroke="#EFA43A" stroke-width="2" marker-end="url(#a7)"/>
    <text x="345" y="192" text-anchor="middle" fill="#EFA43A" font-weight="700">&gt;</text>
    <rect x="370" y="180" width="140" height="40" rx="6" fill="#0f2b26" stroke="#3FB6A8"/>
    <text x="440" y="205" text-anchor="middle" fill="#3FB6A8" font-family="JetBrains Mono">files.txt</text>
    <defs><marker id="a7" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#EFA43A"/></marker></defs>
  </g>
</svg>
~~~

Pipes are what let a Linux user do enormous work in one line. Every serious security workflow you'll see uses them heavily.

## Compression & archives

```bash
tar cvf out.tar folder/          # create tar archive
tar xvf archive.tar              # extract tar
tar czvf out.tar.gz folder/      # create gzipped tar
tar xzvf archive.tar.gz          # extract .tar.gz
unzip file.zip                   # extract zip
zip -r out.zip folder/           # create zip
```

## 🧪 Lab — Navigate, search, and save

Run this in your Kali VM:

```bash
# 1. Poke around /etc
cd /etc
ls -la | head
cat /etc/os-release      # what OS is this?

# 2. Search for password mentions in configs
sudo grep -ri "password" /etc/ 2>/dev/null | head -20
# (You'll see lots of legit config; look at what shows up.)

# 3. Chain some pipes
history | grep grep | wc -l     # how many times have you used grep already?

# 4. Save a session log:
uname -a > ~/kashsec-notes/system-info.txt
lsblk >> ~/kashsec-notes/system-info.txt
cat ~/kashsec-notes/system-info.txt
```

You've just done a real recon-style flow with basic commands.

:::challenge Test yourself
What does the pipe symbol `|` do between two commands? Give a one-sentence answer.

<details><summary>Show answer</summary>It sends the standard output of the first command as the standard input of the second command.</details>
:::

## Key terms

- **Absolute vs relative path** — `/etc/passwd` vs `./notes/day1.md`.
- **`grep`** — search for text inside files or streams.
- **`find` / `locate`** — search for files by attributes.
- **Pipe (`|`)** — feed output into another command.
- **Redirect (`>`, `>>`, `<`, `2>`)** — send streams to/from files.
- **`tar`, `zip`, `unzip`** — archives and compression.

## Recap

- Everything in Linux lives under `/`; key dirs are `/etc`, `/home/<you>`, `/var/log`.
- `pwd`, `cd`, `ls`, `cat`, `less` cover most everyday navigation and reading.
- `grep`, `find`, and pipes are the search-and-filter workhorses.
- `rm -rf` has no undo — think twice before running it.

???refs
- [Linux Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html) — the official spec.
- [grep manual](https://www.gnu.org/software/grep/manual/grep.html) — the definitive grep reference.
- [Awk in 20 minutes](https://ferd.ca/awk-in-20-minutes.html) — the natural next step after grep.
- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) — free lectures on the command line and tooling.
???

**Next up →** [Text Processing Tools: Beyond grep](#/lesson/03-linux/linux-text-processing-tools)
