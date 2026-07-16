# What is a computer really?

Before you can secure a computer, you need to know what one actually is — not the marketing version, the *engineering* version. A computer is a machine that stores instructions and data as numbers, and executes those instructions blindingly fast, one tiny step at a time. Everything else — the desktop, the icons, the apps — is just a friendly costume built on top of that simple idea.

This matters for security because **every single attack you'll ever study in this course eventually boils down to one thing**: making a computer execute instructions its owner never intended, or making it reveal data it was supposed to protect. You can't understand *how that happens* until you understand what a computer fundamentally is.

## The four pieces that make up every computer

- **Hardware** — the physical parts you can touch: the processor (CPU), memory (RAM), storage (hard drive/SSD), and input/output devices (keyboard, screen, network card).
- **Software** — the instructions that tell the hardware what to do. This ranges from a single script you write, to a game, to the browser you're reading this in.
- **Operating System (OS)** — the "boss" program (Windows, macOS, Linux, Android, iOS) that manages hardware, runs other software, and enforces rules about who can do what.
- **Data** — the actual information being processed and stored: your photos, your passwords, this lesson's text, everything.

```mermaid
flowchart TB
    A[You] -->|gives instructions via| B[Applications]
    B -->|requests resources from| C[Operating System]
    C -->|controls| D[Hardware: CPU, RAM, Storage, Network]
    D -->|executes instructions on| E[Data]
    E -->|results shown back to| A
```

## The CPU: a very fast, very literal employee

The **CPU (Central Processing Unit)** is the part that actually *does* things. It doesn't understand English, or even the programming language a developer wrote — it only understands a tiny vocabulary of raw numeric instructions called **machine code**. Everything you interact with — a website, a game, an app — eventually gets translated down into millions of these tiny steps, executed billions of times per second.

The CPU is also completely obedient and has zero judgment. It will execute *any* valid instruction it's given, without asking "should I?" That single fact is the root of almost every security vulnerability in this course: attackers aren't fighting the CPU, they're finding ways to get *their own* instructions into a place the CPU will execute them.

## Memory vs. storage — a distinction that trips everyone up

- **RAM (memory)** — fast, but *temporary*. Whatever a program is actively working on lives here. Turn the power off, and it's gone.
- **Storage (hard drive / SSD)** — slower, but *permanent*. Your files, installed apps, and the OS itself live here, surviving a restart.

Think of storage as a filing cabinet and RAM as your desk — you pull a folder out of the cabinet (storage) onto your desk (RAM) to actually work on it, and put it back when you're done.

:::tip
Your phone is also a computer — it has a CPU, RAM, storage, and an OS (iOS or Android), just squeezed into your pocket. Everything about hardware/software/OS in this lesson applies to it directly.
:::

## Binary — how a computer "thinks"

At the very bottom, a computer only knows two states: on and off, represented as `1` and `0`. This is called **binary**. Every photo, password, video, and piece of text you've ever seen on a screen is, underneath, an enormous sequence of 1s and 0s — grouped into 8-bit chunks called **bytes**.

```
The letter "A" in binary:  01000001
The letter "B" in binary:  01000010
```

You don't need to memorize binary to work in security, but knowing it exists — and that *everything* eventually reduces to it — demystifies a lot of what feels like "hacker magic" later in this course (encoding, encryption, and file formats all sit on top of this idea).

## Why this matters for security

Every attack you'll study eventually touches one or more of these four pieces:

- **Hardware attacks** — physically stealing a device, tampering with a USB port, or exploiting a chip-level flaw.
- **Software attacks** — tricking an application into running code it shouldn't (this is most of what this course covers: SQL injection, XSS, buffer overflows, malware).
- **OS attacks** — exploiting the "boss" program itself to gain more control than you should have (privilege escalation).
- **Data attacks** — stealing, corrupting, or holding data hostage (data breaches, ransomware).

Understanding this map is genuinely useful: whenever you learn a new attack later in this course, you can ask "which of these four is this actually targeting?" — and it will click into place much faster.

## 🧪 Hands-on lab — meet your own machine

You don't need any special tools for this one — just your own computer.

1. **Windows**: press `Ctrl + Shift + Esc` to open Task Manager, click the **Performance** tab. **macOS**: open **Activity Monitor** (search with Spotlight, `Cmd + Space`). **Linux**: open a terminal and run `htop` or `top`.
2. Find your CPU usage, RAM usage, and how much storage is free.
3. Open a few apps (a browser, a text editor) and watch RAM usage climb in real time — that's your "desk" filling up.
4. Close them again and watch it drop back down.
5. Find out what OS version you're running (Windows: `winver`; macOS: **About This Mac**; Linux: `uname -a`). Knowing your exact OS version matters a lot in security — vulnerabilities are usually tied to specific versions.

:::challenge Test yourself
If RAM is temporary and storage is permanent, why do you sometimes lose unsaved work when an application crashes, but a file you already saved is still there afterward?

<details><summary>Show answer</summary>An open, unsaved document only exists in RAM while you're editing it — the moment the application crashes, that memory is wiped and the changes are gone. A file you've already saved has been written to storage, which survives independently of whether the application (or even the whole computer) is running. This is exactly why "save often" is good advice, and it's also why forensic investigators can often recover files from a device's storage even after a crash — but almost never recover unsaved changes that only ever lived in RAM.</details>
:::

## Key terms

- **Hardware** — the physical components of a computer.
- **Software** — instructions that tell hardware what to do.
- **Operating System (OS)** — the program that manages hardware and runs other software.
- **CPU** — the component that executes instructions.
- **RAM** — fast, temporary working memory.
- **Storage** — slower, permanent memory (hard drive/SSD).
- **Binary** — the 1s-and-0s representation everything reduces to.

## Recap

- A computer is hardware + software + an OS managing it all, working on data.
- The CPU executes instructions with zero judgment — it does whatever it's told, which is the root of most security vulnerabilities.
- RAM is temporary working memory; storage is permanent.
- Every attack you'll learn in this course targets hardware, software, the OS, or data — usually some combination.

???refs
- [How Computers Work — Crash Course Computer Science](https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo) — a genuinely excellent, free video series covering everything from binary to operating systems.
- [MDN: What is a computer?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) — Mozilla's beginner-friendly overview of how computers and the web fit together.
???

**Next up →** [How the internet works](#/lesson/00-fresher-basics/how-internet-works)
