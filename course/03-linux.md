# Path 03 — Operating Systems & Linux

> **Level:** Beginner · **Lessons:** 11 · **Assumed knowledge:** Paths 01–02.

This is the path where you stop only reading and start *doing*. First we'll understand what an operating system actually is and why security people practically live in **Linux**. Then you'll build your own safe, legal hacking lab by installing **Kali Linux** inside **VirtualBox** — a whole second computer running in a window on your real one. Finally, we'll turn the scary-looking black terminal into a friendly, familiar tool, one command at a time.

Do every lab in this path. The command line is a skill you build with your fingers, not your eyes.

---

## Module 3A — Operating Systems Basics

## Lesson 3.1 — What is an operating system?

### Why this matters
You'll spend your whole career working *on top of* operating systems, and many attacks target them directly. If you don't know what an OS actually does, a lot of security will feel like guesswork.

### The definition
An **operating system** (OS) is the main software that runs a computer. It's the **manager** sitting between you and the physical hardware, quietly making everything work together. When you click an icon, type a key, or save a file, the OS is what actually makes it happen. Without it, a computer is just a lifeless box of parts.

### What the manager actually manages
- **The hardware** — the screen, keyboard, storage, memory, and processor. The OS translates your clicks and keystrokes into instructions the hardware understands.
- **Your programs** — it launches your apps, gives each one a slice of memory and processor time, and stops them crashing into one another.
- **Files** — it organises everything into folders and keeps track of where each file lives on the disk.
- **Access and permissions** — and this is the big one for us: the OS decides **who is allowed to do what**. Which user can read which file, who can install software, who has full control. This is a security system built into the very heart of every computer.

### Why security people care so deeply about the OS
Because the OS controls access, **taking control of the OS usually means taking control of everything on the machine** — the files, the data, the network connections. A giant portion of hacking is about escalating from limited access to full control of the operating system. When you later hear the phrase "getting root" or "getting SYSTEM," it means exactly that: becoming the all-powerful user the OS answers to.

> 💡 Think of the OS as the building manager who holds every key. Convince or trick the manager, and every door in the building opens for you. That's why attackers target it.

### 🚩 Challenge
Name the OS's job that is essentially a built-in security system.

<details><summary>Answer</summary>Managing access and permissions — deciding who is allowed to do what.</details>

### Key terms
- **Operating system (OS)** — the manager software running a computer.
- **Hardware** — the physical parts (screen, disk, processor).
- **Permissions** — the OS rules for who can do what.

### Recap
- The OS is the manager between you and the hardware.
- It runs programs, organises files, and controls hardware.
- Crucially, it decides who is allowed to do what — a built-in security system.
- Controlling the OS usually means controlling the whole machine, which is why attackers target it.

---

## Lesson 3.2 — Windows vs Linux vs macOS

### Why this matters
You'll meet all three operating systems as a security professional — as your own workstation, and as the systems you defend or test. Knowing their characters helps you pick the right tool and understand your targets.

### The big three
- **Windows** — by far the most common on home and office desktops. Familiar, huge software library, and therefore a huge target for attackers simply because so many people use it. Uses a slightly different command line (PowerShell / Command Prompt) and a different permission model (users, groups, and a powerful account called **SYSTEM**).
- **macOS** — Apple's system on MacBooks and iMacs. Under the hood it's built on **Unix**, which makes its terminal feel very similar to Linux — a nice bonus for security work.
- **Linux** — free, open, and endlessly customisable. It runs **most of the world's servers**, most of the internet's infrastructure, and it is the security professional's favourite working environment.

### Why "flavours" of Linux exist
Linux isn't one single product — it comes in many versions called **distributions** (or "distros"), each a different bundling of the same core system. **Ubuntu** and **Debian** are popular general-purpose ones. **Kali Linux** and **Parrot OS** are special distros pre-loaded with hundreds of security tools — you'll install Kali shortly.

### You don't have to abandon your current system
Here's the reassuring part: you do **not** need to wipe your laptop and switch to Linux. In the next module you'll run Linux *inside* your existing Windows or Mac, in a window, using virtualization. You keep everything you have and gain a safe Linux playground on top. Best of both worlds.

### 🚩 Challenge
What's the word for a specific version/bundle of Linux, like Ubuntu or Kali?

<details><summary>Answer</summary>A distribution (or "distro").</details>

### Key terms
- **Windows / macOS / Linux** — the three major operating systems.
- **Unix** — the older family macOS and Linux both descend from.
- **Distribution ("distro")** — a specific version of Linux (Ubuntu, Kali, Parrot).

### Recap
- Windows is most common on desktops (and a big target); macOS is Unix-based; Linux runs most servers.
- Linux comes in many distributions; Kali and Parrot are security-focused ones.
- You can run Linux alongside your current OS using virtualization — no need to switch.

---

## Lesson 3.3 — Why hackers love Linux

### Why this matters
There's a reason nearly every security course, tool, and job assumes Linux. Understanding *why* will motivate you to get comfortable with it rather than avoid it.

### The reasons, in plain terms
1. **It's free and open.** Anyone can see, study, and change how it works. That openness means you can understand your tools deeply and even build your own — impossible with closed systems.
2. **It's incredibly powerful from the keyboard.** In Linux you can do enormous things with short typed commands, and — crucially — you can **automate** them by chaining commands into scripts. Almost every hacking tool is really a clever combination of small command-line pieces.
3. **The tools live there.** The overwhelming majority of security tools are built for Linux first (often *only* for Linux). Kali comes with hundreds pre-installed and ready.
4. **It runs the targets.** Since most servers and internet infrastructure are Linux, knowing it helps you both attack and defend the systems you'll actually encounter.
5. **It's transparent.** You can see exactly what's happening — which processes run, what's listening on the network, what every file's permissions are. That visibility is gold for both attackers and defenders.

### The mindset shift
Beginners often fear the terminal because it looks bare and unforgiving. But that bareness is *power*: instead of hunting through menus, you tell the computer precisely what to do and it does exactly that, instantly, repeatably. Once it clicks, going back to clicking through menus feels slow. You're about to make that shift.

> 💡 You don't need to become a Linux expert overnight. You need to become *comfortable and unafraid*. Comfort comes from doing the labs, making mistakes in your safe lab, and slowly building muscle memory.

### 🚩 Challenge
Give one reason security tools are usually built for Linux rather than Windows.

<details><summary>Answer</summary>Any of: it's free and open (easy to build on), it's powerful and scriptable from the command line, most servers run Linux, or it's transparent about what's happening. Any one is correct.</details>

### Key terms
- **Open source** — software whose code anyone can view and modify.
- **Automation / scripting** — chaining commands to run tasks automatically.
- **Kali Linux** — a distro pre-loaded with security tools.

### Recap
- Linux is free, open, powerful from the keyboard, and scriptable.
- Most security tools are built for it, and most targets run it.
- Its transparency helps both attackers and defenders.
- The goal is comfort, not mastery — built through practice.

---

## Module 3B — Build Your Hacking Lab

## Lesson 3.4 — What is virtualization?

### Why this matters
You need a place to practise where breaking things is safe and legal. Virtualization gives you exactly that: a disposable second computer you fully own, living inside your real one.

### The core idea
**Virtualization** is a clever trick: running a whole second computer *inside* your real one, in a window. That simulated computer is called a **virtual machine** (VM). It has its own operating system, its own files, its own network settings — but it's really just software running on your actual machine.

### Why this is perfect for learning security
- **It's safe.** If you break the VM — infect it, misconfigure it, delete everything — your real computer is untouched. You just reset the VM.
- **It's isolated.** Attacks and tools stay *inside* the VM's window and can't reach your real files (as long as you set the network correctly, which we'll cover).
- **It's free.** The software that creates VMs costs nothing.
- **It's disposable and repeatable.** You can take a "snapshot" (a saved state) and jump back to it instantly, or throw a VM away and make a fresh one in minutes.

### The vocabulary
- **Hypervisor** — the software that creates and runs virtual machines. The beginner-friendly free one is **VirtualBox** (by Oracle).
- **Host** — your real computer (the one running VirtualBox).
- **Guest** — the virtual machine running inside it (your Kali, in a moment).
- **Snapshot** — a saved photo of a VM's state you can restore later.

### The professional habit
Real security professionals *never* run risky tools or open suspicious files on their real machine. They always use a VM. You're about to learn the exact same setup the pros use daily. Building this lab is a genuine milestone.

> 💡 Picture a VM as a sealed, transparent box on your desk. You can do anything inside the box — even set off a firework — and your desk stays clean. If the box gets wrecked, you grab a fresh identical box. That safety is what makes fearless learning possible.

### 🚩 Challenge
In virtualization terms, what do we call your *real* computer, and what do we call the virtual machine running inside it?

<details><summary>Answer</summary>Your real computer is the host; the virtual machine is the guest.</details>

### Key terms
- **Virtualization** — running a computer inside a computer.
- **Virtual machine (VM)** — the simulated computer.
- **Hypervisor** — software that runs VMs (e.g., VirtualBox).
- **Host / guest** — your real machine vs the VM.
- **Snapshot** — a restorable saved state of a VM.

### Recap
- Virtualization runs a second computer (a VM) inside your real one.
- It's safe, isolated, free, and disposable — perfect for practice.
- The hypervisor (VirtualBox) runs the VM; your machine is the host, the VM is the guest.
- Pros always test in VMs — you're about to do the same.

---

## Lesson 3.5 — Install VirtualBox

### Why this matters
VirtualBox is the free program that will host your Kali practice machine. Installing it is the first concrete step to owning a real lab.

### Before you start
- You need a computer with a bit of spare room: ideally **8 GB of RAM or more** (4 GB can work but will be tight) and **at least 30–40 GB of free disk space**.
- If you're on a very old or low-spec machine, don't worry — Lesson 3.11 covers browser-based alternatives (TryHackMe / Hack The Box) so you can still practise with zero setup.

### 🧪 Lab — Install VirtualBox
1. Open your browser and go to the official site: **virtualbox.org** (always download from the official site, never a random mirror).
2. Click **Downloads**, then choose the package for your system — **Windows hosts**, **macOS hosts**, or your Linux distro.
3. Open the downloaded file to start the installer.
4. Click **Next** through the steps, accepting the defaults. It may warn that your network will briefly disconnect while it sets up a virtual network adapter — that's normal, allow it.
5. If your system asks you to approve or "allow" software from Oracle (common on Windows and Mac), approve it — this is expected and needed for virtualization to work.
6. When it finishes, open VirtualBox. You should see an empty manager window with no machines yet. **That's success** — you now have a hypervisor ready to run VMs.

### If something goes wrong
- **"Virtualization is disabled"** — some computers ship with a setting called **VT-x / AMD-V** turned off in the BIOS. If VirtualBox complains, search "enable virtualization in BIOS" for your specific PC, toggle it on, and reboot. This is the single most common first-time snag.
- **Mac security block** — on macOS you may need to go to System Settings → Privacy & Security and click **Allow** for the Oracle software, then reboot.

> 💡 Don't be discouraged if setup takes a little wrestling — getting a lab working is a rite of passage, and troubleshooting *is* a core security skill. Every professional has fought with a VM at some point.

### 🚩 Challenge
VirtualBox complains that virtualization is disabled. Where do you usually turn it on?

<details><summary>Answer</summary>In the computer's BIOS/UEFI settings — enabling VT-x (Intel) or AMD-V (AMD), then rebooting.</details>

### Recap
- Download VirtualBox only from the official virtualbox.org.
- Install it with the default options; approve the network adapter and any Oracle prompts.
- An empty VirtualBox window means success.
- If it fails, the usual fix is enabling VT-x/AMD-V virtualization in the BIOS.

---

## Lesson 3.6 — Install Kali Linux in VirtualBox

### Why this matters
Kali Linux is the security professional's toolbox — hundreds of tools in one distro. Getting your own Kali VM running is the moment your lab becomes real.

### The easy route: a pre-built image
Installing an OS from scratch can be fiddly, so Kali kindly provides a **pre-built VirtualBox image** — a ready-made machine you simply import. This skips the tricky installation entirely. That's the route we'll take.

### 🧪 Lab — Get Kali running
1. Go to the official **kali.org** site, then **Get Kali → Virtual Machines**.
2. Download the **VirtualBox** image (not the VMware one). The file is fairly large, so give it time. It arrives as a `.7z` archive or a ready `.ova` file depending on the option.
   - If it's a `.7z`, extract it (install 7-Zip if needed) to get the VM folder, then in VirtualBox choose **Machine → Add** and select the `.vbox` file.
   - If it's an `.ova`, in VirtualBox choose **File → Import Appliance**, select the `.ova`, and click through the import.
3. You'll now see a **Kali** machine listed in VirtualBox. Select it and click **Start** (the green arrow).
4. Kali boots up. When it asks you to log in, use the default credentials:
   - **Username:** `kali`
   - **Password:** `kali`
5. You're now inside Kali Linux! Look for the terminal icon (a black rectangle) in the taskbar and open it. You're ready to learn commands.

### First thing to do in a fresh Kali
A brand-new install is slightly out of date. Open the terminal and run this to update it (we'll explain exactly what it means in Lesson 3.10):

```bash
sudo apt update && sudo apt upgrade -y
```

It'll ask for your password (`kali`) and may take a while — that's normal. Let it finish.

### Common first-time snags
- **Tiny screen / no full screen** — you may need to install "Guest Additions" or set the display scaling; search "Kali VirtualBox full screen" if it bothers you. It's cosmetic; you can learn fine without fixing it immediately.
- **Very slow** — give the VM more RAM (in its Settings → System) if your host can spare it, e.g. 4 GB. Don't give it more than half your total RAM.

> 💡 Congratulations — running your own Kali VM is a genuine achievement and the platform for everything hands-on that follows. Take a screenshot for your notes; it's a nice milestone to look back on.

### 🚩 Challenge
What are the default username and password for a fresh Kali Linux VM?

<details><summary>Answer</summary>Username kali, password kali.</details>

### Recap
- Kali provides a ready-made VirtualBox image so you skip a full install.
- Import it (Import Appliance for `.ova`, or Add for an extracted `.vbox`), then Start it.
- Log in with `kali` / `kali`.
- Update it first with `sudo apt update && sudo apt upgrade -y`.

---

## Lesson 3.7 — Snapshots & staying safe

### Why this matters
Snapshots turn mistakes from disasters into non-events, and correct network settings keep your experiments from ever touching your real devices. These two habits protect your whole learning journey.

### Snapshots: your undo button
A **snapshot** is a saved photo of your VM at a moment in time. If you later break something — misconfigure a tool, infect the VM on purpose to study malware, or just make a mess — you can **restore** the snapshot and jump straight back to the clean state, in seconds. It's the single best habit for a fearless lab.

### 🧪 Lab — Take your first snapshot
1. In VirtualBox, select your Kali machine.
2. Open the **Snapshots** view (a menu/tab near the top-right, sometimes under the machine's menu).
3. Click **Take**, name it something clear like `Fresh install - updated`, and save.
4. Now experiment freely. Whenever you want to reset, right-click the snapshot and choose **Restore**.

### Network isolation: keeping the box sealed
A VM's network setting decides how connected it is to the outside world. For safe learning:

- **NAT** (the default) — the VM can reach the internet (to download tools and updates) but is hidden behind your host, and *cannot* be directly reached from your home network. Good default for most learning.
- **Host-Only** — the VM can talk only to your host and other VMs, with **no internet at all**. Perfect for dangerous experiments (like running real malware or attacking a second vulnerable VM) where you want total isolation.
- **Bridged** — the VM appears as a full device on your real home network. **Avoid this for risky work** — it removes the safety barrier.

> ⚠️ Rule of thumb: use **NAT** for everyday learning and downloading tools. Switch to **Host-Only** when you're doing anything genuinely dangerous, like detonating malware or practising attacks between two VMs. Never put a vulnerable or infected VM on **Bridged**.

### 🚩 Challenge
You want to safely run real malware in your VM with zero chance of it reaching the internet or your home devices. Which network mode should you use?

<details><summary>Answer</summary>Host-Only — it isolates the VM from the internet and your real network entirely.</details>

### Key terms
- **Snapshot** — a restorable saved state of a VM.
- **NAT / Host-Only / Bridged** — VM network modes with increasing exposure.

### Recap
- A snapshot is a save point; restore it to undo any mistake instantly.
- Take a clean snapshot right after setup.
- Use NAT for everyday learning, Host-Only for dangerous experiments, and avoid Bridged for risky work.

---

## Module 3C — Linux Commands & Concepts

## Lesson 3.8 — Meet the terminal (don't be scared)

### Why this matters
The terminal is where security work actually happens. The faster it stops feeling scary, the faster everything else opens up. This lesson demystifies it completely.

### What the terminal actually is
The **terminal** (also called the shell, or command line) is a text window where you type **commands** instead of clicking buttons. That's the whole mystery solved. Each command is a short instruction; you press Enter, and the computer does exactly what you asked, immediately.

It feels intimidating because it's bare — no menus, no buttons, just a blinking cursor. But that bareness is actually *simpler and more precise*: you tell the computer exactly what to do, rather than hunting through menus hoping to find the right option.

### The anatomy of a command
Most commands follow a simple pattern:

```
command  -options  arguments
```

- The **command** is the action (e.g., `ls` to list).
- **Options** (also called flags), usually starting with `-`, tweak how it behaves (e.g., `-l` for a long, detailed listing).
- **Arguments** are what it acts on (e.g., a folder name).

So `ls -l Downloads` means "list (`ls`), in long detailed form (`-l`), the contents of the `Downloads` folder." You'll see this pattern everywhere.

### Your first commands
```bash
whoami      # prints your username
date        # shows the current date and time
clear       # clears the screen (or press Ctrl+L)
```

Type `whoami` and press Enter. It prints your username. **You just ran your first Linux command** — that's genuinely all there is to the terminal.

### Getting help
Two habits will save you constantly:
- Add `--help` after almost any command for a quick summary, e.g. `ls --help`.
- Use `man command` (short for "manual") for the full documentation, e.g. `man ls`. Press `q` to quit the manual.

> 💡 You can't easily break anything just by *looking around* with simple commands like `ls`, `pwd`, and `cd`. So be curious. Type things. Explore. Curiosity in a safe VM is exactly how everyone gets comfortable.

### 🧪 Lab — Break the ice
1. Open the terminal in Kali.
2. Run `whoami`, then `date`, then `clear`.
3. Run `ls --help` and skim what appears — don't worry about understanding it all.
4. Run `man ls`, scroll with the arrow keys, then press `q` to quit.
5. In your notes, write one sentence: what is the terminal?

### 🚩 Challenge
Which command prints your current username?

<details><summary>Answer</summary>whoami</details>

### Key terms
- **Terminal / shell / command line** — the text window for typing commands.
- **Command / option (flag) / argument** — the action, its tweaks, and what it acts on.
- **man / --help** — built-in documentation.

### Recap
- The terminal runs typed commands instead of clicks — simpler and more precise.
- Commands follow the pattern: command, options, arguments.
- `whoami`, `date`, `clear` are gentle starters.
- Use `--help` and `man` for help, and explore fearlessly in your VM.

---

## Lesson 3.9 — Moving around: files, folders & viewing

### Why this matters
Everything in Linux is a file in a folder. Navigating and reading files is the bread and butter of every session — and searching files is how you find secrets on a target.

### The filesystem is a tree
Files live in folders (also called **directories**), arranged like an upside-down tree. The very top is `/`, called **root**. Everything branches out from there. Your personal folder is `/home/kali` (for the `kali` user), which has the shortcut **`~`**.

A few important folders you'll meet:
- `/home` — users' personal folders.
- `/etc` — system configuration files (a treasure trove on a target).
- `/var` — variable data like logs (`/var/log`).
- `/tmp` — temporary files, wiped on reboot.
- `/root` — the home folder of the all-powerful root user.

### Moving and looking
```bash
pwd         # "print working directory" — where am I right now?
ls          # "list" — what's in this folder?
ls -la      # list everything, including hidden files, with details
cd Downloads   # "change directory" — go into Downloads
cd ..       # go up one level
cd ~        # jump to your home folder
cd /        # jump to the very top (root of the tree)
```

### Reading files
```bash
cat notes.txt      # dump a whole file to the screen
less big.log       # scroll through a big file (arrows to move, q to quit)
head -n 20 file    # show the first 20 lines
tail -n 20 file    # show the last 20 lines
tail -f app.log    # "follow" a log live as new lines are added
```

### Searching — the secret-hunting superpower
```bash
grep "password" file.txt        # find lines containing "password"
grep -r "password" /etc/        # search recursively through a whole folder
find / -name "*.conf" 2>/dev/null   # find all .conf files on the system
```

`grep -r` and `find` are two of the most valuable commands you'll ever learn. On a compromised machine, searching for words like `password`, `secret`, `key`, or `token` across config files and code can reveal credentials in seconds.

> 💡 Hidden files start with a dot (`.bashrc`, `.ssh`). They don't show with a plain `ls` — you need `ls -la`. On a target, these dotfiles often hold command history, SSH keys, and saved credentials. Always check them.

### 🧪 Lab — Explore and search
1. Run `pwd` to see where you are, then `cd /` and `ls` to view the top of the tree.
2. Run `cd ~` to return home, then `ls -la` to reveal hidden files.
3. Look inside `/etc`: `ls /etc`. Then peek at a file: `cat /etc/hostname`.
4. Try a search: `grep -r "root" /etc/passwd`. (The `/etc/passwd` file lists user accounts — harmless to read, and a classic recon target.)
5. Note down what `pwd`, `ls -la`, and `grep -r` each do.

### 🚩 Challenge
Which command reveals hidden dotfiles that a plain `ls` won't show?

<details><summary>Answer</summary>ls -la (the -a flag shows "all", including hidden files).</details>

### Key terms
- **Directory** — a folder. The tree starts at `/` (root); `~` is your home.
- **pwd / ls / cd** — where am I / what's here / move.
- **cat / less / head / tail** — ways to read files.
- **grep / find** — search inside files / for files.

### Recap
- The filesystem is a tree from `/`; `~` is home; `/etc` holds configs.
- `pwd`, `ls -la`, and `cd` move you around and reveal hidden files.
- `cat`, `less`, `head`, `tail` read files.
- `grep -r` and `find` are your secret-hunting workhorses.

---

## Lesson 3.10 — Users, permissions, sudo & installing tools

### Why this matters
Linux permissions *are* a security model, and privilege escalation — going from a normal user to root — is one of the most valuable skills in hacking. Installing tools with `apt` is a daily task. This lesson covers both.

### Regular user vs root
Linux is careful about **who** can do **what**. A normal user (like `kali`) can only touch their own things. The **root** user is the all-powerful administrator who can do absolutely anything. To run a *single* command with root power, you put **`sudo`** in front of it:

```bash
whoami            # e.g. "kali" — your normal identity
sudo apt update   # run this ONE command as root (it'll ask your password)
```

"Getting root" — becoming this all-powerful user — is the goal of a huge number of attacks, because root controls the entire machine.

### Reading permissions
Run `ls -l` and you'll see lines beginning like `-rwxr-xr--`. Don't panic — it breaks into four simple parts:

```
-        rwx        r-x        r--
type     owner      group      everyone else
```

- The first character is the **type**: `-` a file, `d` a directory, `l` a link.
- Then three sets of `rwx` — **r**ead, **w**rite, e**x**ecute — for the **owner**, the **group**, and **everyone else**.

So `-rwxr-xr--` means: it's a file; the owner can read/write/execute; the group can read/execute; everyone else can only read. Permissions are simply "who can read, change, or run this."

### Changing permissions and ownership
```bash
chmod +x script.sh    # make a file executable (runnable)
chmod 600 secret.key  # owner read/write only — lock down a sensitive file
chown kali:kali file  # change a file's owner and group
```

> 💡 **Security tie-in:** a file that *everyone* can write to but is owned by root, or a program with a special "SUID" bit set, can often be abused to escalate to root. Finding these is a classic privesc first move: `find / -perm -4000 2>/dev/null` lists SUID programs. You'll go deep on this in Path 11.

### Installing tools with apt
On Linux you don't download installers from random sites. A built-in, trusted "app store" called **apt** fetches software safely with one command:

```bash
sudo apt update              # refresh the list of available software (do this first)
sudo apt install nmap        # install a tool called nmap
sudo apt upgrade             # update everything already installed
sudo apt remove nmap         # uninstall a tool
```

Always run `sudo apt update` before installing, so you get the latest, safest versions. (Kali already ships with most security tools, but `apt` is how you add anything missing.)

### 🧪 Lab — Permissions and installing
1. Run `id` and `whoami` to see your identity and groups.
2. Run `ls -l /etc/passwd` and read its permission string out loud, part by part.
3. Check what you could run as root: `sudo -l`.
4. Install a tool: `sudo apt update` then `sudo apt install sl` (a fun little one), then type `sl` and enjoy.
5. Note down what `sudo`, `chmod +x`, and `apt install` each do.

### 🚩 Challenge
You have a script called `scan.sh` but it won't run. Which command makes it executable?

<details><summary>Answer</summary>chmod +x scan.sh</details>

### Key terms
- **root** — the all-powerful admin user.
- **sudo** — run one command with root power.
- **Permissions (rwx)** — read/write/execute for owner/group/others.
- **chmod / chown** — change permissions / ownership.
- **apt** — Linux's trusted software installer.
- **SUID** — a special bit that can enable privilege escalation.

### Recap
- Normal users are limited; root can do anything, and `sudo` runs one command as root.
- Permissions are read/write/execute for owner, group, and others.
- `chmod` and `chown` change permissions and ownership; SUID files are privesc targets.
- `apt update` then `apt install <tool>` adds software safely.

---

## Lesson 3.11 — Your first bash script (automation)

### Why this matters
Automation is the heart of hacking. A script is just a list of commands saved in a file so you can run them all at once — and every powerful tool is a bigger version of exactly this.

### Pipes and redirection first
Two small ideas make the command line hugely powerful. A **pipe** `|` sends one command's output straight into another. **Redirection** `>` writes output into a file.

```bash
cat access.log | grep 404 | wc -l    # count how many "404" lines are in a log
ls -la > listing.txt                 # save a listing into a file
command 2>/dev/null                  # throw away error messages
cat urls.txt | cut -d/ -f3 | sort -u # extract unique hostnames from a list of URLs
```

That last one is a real recon one-liner: it takes a file of URLs, chops out the host part of each, and gives you a sorted, de-duplicated list. Small tools, chained, do big things.

### Writing a script
A **script** is those commands saved in a `.sh` file. Here's a friendly first one:

```bash
#!/bin/bash
# hello.sh — my first script
echo "Hello! This is my first script."
echo "Today I am learning cybersecurity."
whoami
date
```

The first line `#!/bin/bash` (called the "shebang") tells the system to run the file with bash. Lines starting with `#` are comments — notes for humans, ignored by the computer.

### 🧪 Lab — Write and run a script
1. In the terminal, run `nano hello.sh` to open a simple editor.
2. Type the script above.
3. Save and exit nano: press **Ctrl+O** then Enter (save), then **Ctrl+X** (exit).
4. Make it runnable: `chmod +x hello.sh`.
5. Run it: `./hello.sh` — watch your commands execute in order.
6. **Bonus:** add a loop. Edit the file and add these lines, then run it again:
   ```bash
   for i in 1 2 3; do
     echo "Ping attempt $i"
   done
   ```

### From script to real tool
Here's a genuinely useful mini-tool — a "ping sweep" that finds live machines on a network (run only on a network you own):

```bash
#!/bin/bash
# sweep.sh — find live hosts on a /24 network
for i in $(seq 1 254); do
  ping -c1 -W1 192.168.1.$i >/dev/null 2>&1 && echo "192.168.1.$i is up"
done
```

This loops through 254 addresses, pings each, and prints the ones that answer. That's the same *shape* of code inside real scanning tools — you're already writing what the pros run.

> 💡 Every powerful hacking tool is, at its heart, a bigger and cleverer version of what you just wrote: commands run in sequence and loops repeating work. Automation is the superpower that separates slow, manual work from fast, professional work.

### 🚩 Challenge
In a command line, what does the pipe symbol `|` do?

<details><summary>Answer</summary>It sends the output of one command directly into the next command as its input.</details>

### Key terms
- **Pipe `|`** — feed one command's output into another.
- **Redirection `>`** — write output to a file (`2>/dev/null` discards errors).
- **Script** — commands saved in a `.sh` file to run together.
- **Shebang `#!/bin/bash`** — tells the system to run the file with bash.
- **Loop** — repeat a block of commands.

### Recap
- Pipes chain commands; redirection saves or discards output.
- A script is saved commands; `chmod +x` makes it runnable, `./name` runs it.
- Loops repeat work automatically.
- Real tools are just bigger versions of these building blocks — automation is the key skill.

---

## No spare computer? Practise in the browser

If your machine can't comfortably run a VM, you can still do everything in this course using free, browser-based labs:

- **[TryHackMe](https://tryhackme.com)** — guided, beginner-friendly rooms with a Kali machine in your browser. Start with the "Linux Fundamentals" and "Pre Security" paths — they mirror this path perfectly.
- **[Hack The Box](https://hackthebox.com)** — has a beginner "Starting Point" and an Academy with in-browser labs.

These require no setup and are completely legal to practise on.

---

## You've finished Path 03 🎉

You now understand operating systems, you've built a real, safe hacking lab with Kali in VirtualBox, and you can navigate the Linux command line — moving around, reading and searching files, managing permissions, installing tools, and writing your first scripts. This is a massive milestone; most people never get this far.

**Next up → `04-python.md`:** programming from absolute zero, then Python — where you'll build your first small security tools with your own hands.
