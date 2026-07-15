# Meet the terminal

Time to demystify the black window with green text. The **terminal** is where the real power lives, and after this lesson you'll be unafraid of it.

## What the terminal actually is

A terminal is a program that takes typed commands, sends them to the OS, and shows you the result. That's it. Every hacking tool you'll ever use is either a terminal command or a program controlled from one.

When you open a terminal, you meet a **prompt** — a short bit of text telling you *who you are and where you are*:

```
kali@kali:~$
```

- **`kali`** (before `@`) — your username.
- **`kali`** (after `@`) — the computer's name (hostname).
- **`~`** — where you are (`~` is shorthand for your home folder).
- **`$`** — you're a normal user. (`#` means you're **root**, the admin.)

## Your first command

Type this and press Enter:

```bash
whoami
```

The terminal replies with your username. You just ran a command and got a result. That's the whole rhythm.

Try a few more:

```bash
pwd     # "print working directory" — shows where you are
ls      # "list" — shows files here
date    # today's date and time
uname -a  # full info about the OS you're on
```

## Anatomy of a command

Every command follows the same shape:

```
command  option(s)  argument(s)
   ↑         ↑           ↑
what to do   how          on what
```

Example:

```bash
ls -l /etc
#  |   |    |
#  |   |    +-- the folder to list (argument)
#  |   +------- long format (option / flag)
#  +----------- the command itself
```

## Getting help — the two most important commands

You will forget things. Every professional does. There are two universal ways to look things up:

```bash
man ls        # the full manual for ls (press q to quit)
ls --help     # a shorter usage summary
```

`man` (short for "manual") is a mini book on every command. Use it constantly. When you finish this lesson, `man man` gets meta and reads you the manual on the manual system.

:::tip THE PROFESSIONAL'S HABIT
Real hackers spend a huge amount of time reading `man` pages and searching. Being lost is normal — being able to find the answer efficiently is the skill.
:::

## Command history — you type less than you think

- **↑ and ↓ arrow keys** — cycle through previous commands.
- **Ctrl+R** then type a few characters — search backwards through history.
- `history` — see the last commands you ran.
- `!42` — re-run command #42 from history.
- `!!` — re-run the previous command (great with `sudo`: `sudo !!` re-runs the last one as root).

## Tab completion — your best friend

Press **Tab** while typing a command or filename and the terminal completes it for you. Press Tab twice to see all matches. This saves enormous amounts of typing and prevents typos.

Try:

```bash
cd /et<Tab>       # completes to /etc/
ls /us<Tab>/bin/ba<Tab>   # completes to /usr/bin/bash
```

## Changing password (do this now)

Remember the default Kali password? Change it:

```bash
passwd
```

You'll be asked for the current password, then a new one twice. Choose something strong — this VM will hold your notes, tools, and eventually possibly bug bounty info.

## Editing text — pick your poison

You'll edit files constantly. Pick one editor now and get comfortable:

- **`nano`** — friendliest for beginners. Commands shown at the bottom of the screen. Save with **Ctrl+O**, quit with **Ctrl+X**.
- **`vim`** — the classic. Steeper learning curve but ubiquitous. Type `vimtutor` for a 30-minute tutorial that pays for itself for life.
- **VS Code** — graphical, if you install it later.

Try nano now:

```bash
nano hello.txt
# Type something, then Ctrl+O to save, Enter to confirm, Ctrl+X to quit.
cat hello.txt   # show its contents
```

## The three streams

Every command has three "streams":

- **stdin** (0) — input, usually from the keyboard.
- **stdout** (1) — normal output, usually to the screen.
- **stderr** (2) — errors, usually also to the screen.

You'll redirect these in the next lesson to build pipelines. For now, know they exist.

## Comfort keys

| Key | What it does |
|---|---|
| **Ctrl+C** | Cancel the running command |
| **Ctrl+D** | Signal end-of-input / logout |
| **Ctrl+L** | Clear the screen (or `clear`) |
| **Ctrl+A** | Jump cursor to start of line |
| **Ctrl+E** | Jump cursor to end of line |
| **Ctrl+U** | Delete from cursor to start |
| **Ctrl+W** | Delete previous word |
| **Ctrl+R** | Reverse-search history |

Memorise these five: **Ctrl+C, Ctrl+L, Ctrl+A, Ctrl+E, Ctrl+R**. They're used constantly.

## 🧪 Lab — Warm up in the terminal

Open a terminal in Kali and run each of these. Read what happens.

```bash
whoami
pwd
ls
ls -la
date
uname -a
cal
echo "Hello from Kali"
history
man ls
# (press q to quit man)
```

Then try:

```bash
mkdir kashsec-notes    # make a folder
cd kashsec-notes       # move into it
touch first-note.txt   # create an empty file
nano first-note.txt    # write something, save with Ctrl+O, exit with Ctrl+X
cat first-note.txt     # print its contents
cd ..                  # go back up
```

You've just navigated, created, edited, and read a file entirely from the keyboard. This is how everything in this course now works.

:::challenge Test yourself
Which command shows the full manual for another command? And how do you exit it?

<details><summary>Show answer</summary><code>man &lt;command&gt;</code>. Exit by pressing <strong>q</strong>.</details>
:::

## Key terms

- **Terminal / shell** — the text interface for typing commands.
- **Prompt** — the `user@host:path$` line waiting for input.
- **Command / option / argument** — the three parts of any command.
- **`man`** — the built-in manual.
- **stdin / stdout / stderr** — the three input/output streams.
- **Tab completion / history** — the two habits that make the terminal fast.

## Recap

- The terminal is just a place to type commands and see results.
- Every command has a shape: `command options arguments`.
- `man` and `--help` are your permanent lookup tools.
- Tab completion and `Ctrl+R` history search cut typing dramatically.
- Change your default Kali password with `passwd`.

???refs
- [Linux Journey — command line basics](https://linuxjourney.com/lesson/the-shell) — beautifully paced walk-through.
- [ExplainShell](https://explainshell.com/) — paste any command, get every flag explained.
- [tldr pages](https://tldr.sh/) — friendlier, example-first alternative to `man`.
- [OverTheWire Bandit levels 0–10](https://overthewire.org/wargames/bandit/) — game-style practice.
???

**Next up →** [Files & folders](#/lesson/03-linux/files-and-folders)
