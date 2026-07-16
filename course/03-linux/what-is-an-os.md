# What is an operating system?

You'll spend your whole career working *on top of* operating systems, and many attacks target them directly. If you don't know what an OS actually does, a lot of security will feel like guesswork.

## The definition

An **operating system** (OS) is the main software that runs a computer. It's the **manager** sitting between you and the physical hardware, quietly making everything work together.

When you click an icon, type a key, or save a file, the OS is what actually makes it happen. Without it, a computer is just a lifeless box of parts.

~~~svg The OS sits between you and the hardware
<svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="13">
    <rect x="60" y="20" width="580" height="55" rx="8" fill="#111927" stroke="#3FB6A8" stroke-width="2"/>
    <text x="350" y="52" text-anchor="middle" fill="#3FB6A8" font-weight="700">👤 You (and your apps)</text>
    <line x1="350" y1="80" x2="350" y2="100" stroke="#8496A6" stroke-width="1.5" marker-end="url(#a5)"/>
    <rect x="60" y="105" width="580" height="70" rx="8" fill="#2b1f0a" stroke="#EFA43A" stroke-width="2"/>
    <text x="350" y="135" text-anchor="middle" fill="#EFA43A" font-weight="700">🧠 The Operating System (OS)</text>
    <text x="350" y="155" text-anchor="middle" fill="#E9EEF3" font-size="11">Runs programs · Manages files · Talks to hardware · Enforces permissions</text>
    <line x1="350" y1="180" x2="350" y2="200" stroke="#8496A6" stroke-width="1.5" marker-end="url(#a5)"/>
    <rect x="60" y="205" width="580" height="45" rx="8" fill="#111927" stroke="#E05548" stroke-width="2"/>
    <text x="350" y="232" text-anchor="middle" fill="#E05548" font-weight="700">⚙ Hardware (CPU, RAM, disk, screen, network card)</text>
    <defs><marker id="a5" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#8496A6"/></marker></defs>
  </g>
</svg>
~~~

## What the manager actually manages

- **The hardware** — the screen, keyboard, storage, memory, and processor. The OS translates your clicks and keystrokes into instructions the hardware understands.
- **Your programs** — it launches your apps, gives each a slice of memory and processor time, and stops them crashing into each other.
- **Files** — it organises everything into folders and tracks where each file lives on disk.
- **Access and permissions** — the big one for us: the OS decides **who is allowed to do what.** Which user can read which file, who can install software, who has full control. This is a security system built into the very heart of every computer.

## Why security people care so deeply

Because the OS controls access, **taking control of the OS usually means taking control of everything on the machine** — files, data, network connections. A giant portion of hacking is about escalating from limited access to full control.

When you later hear the phrases "**getting root**" (Linux) or "**getting SYSTEM**" (Windows), it means becoming the all-powerful user the OS answers to.

:::tip THE KEYS METAPHOR
Think of the OS as the **building manager who holds every key.** Convince or trick the manager, and every door in the building opens. That's why attackers target it.
:::

## What's inside an OS (a first look)

Without going deep, an OS has a few big pieces:

- **Kernel** — the innermost, most trusted code. Talks to hardware directly. When you hear "kernel exploit," it means someone found a bug there → total control.
- **User space** — where all your normal programs run. Isolated from each other by the kernel.
- **Shell** — the command interface (bash, zsh, PowerShell). What you use in a terminal.
- **Filesystem** — how files are laid out on disk.
- **Drivers** — small programs that let the kernel talk to specific hardware (Wi-Fi card, GPU).

You'll meet all of these more concretely as you go through this path.

## Kernel mode vs. user mode — the privilege boundary that protects everything

Modern CPUs support different privilege levels, often called **rings** — **ring 0** (kernel mode) has unrestricted access to hardware and memory, while **ring 3** (user mode) is deliberately restricted, unable to directly touch hardware or another program's memory. Your normal applications — a browser, a game, a word processor — all run in user mode; only the kernel itself runs in ring 0. When a user-mode program needs something only the kernel can do (open a file, send network data, allocate memory), it makes a **system call** — a tightly controlled, well-defined request to the kernel, which validates it before acting. This boundary is exactly what a **kernel exploit** breaks through: a bug allowing user-mode code to somehow execute with kernel-mode privileges, instantly escalating from "one restricted program" to "total control of the machine" — precisely the escalation Path 11's privilege escalation lessons study in depth.

## The boot process, briefly

When you power on a computer, the OS doesn't appear instantly — it loads through a specific sequence: firmware (BIOS or the more modern UEFI) initializes basic hardware and locates a **bootloader** (GRUB on most Linux systems), which then loads the kernel into memory and hands off control to it. The kernel initializes drivers and core services, then starts the first user-space process, which cascades into starting every other background service and eventually your login screen. This sequence matters for security because it's a common **persistence** target — malware (or a legitimate but malicious modification) that hooks into an early stage of this boot sequence can potentially load before most security software even starts running, referenced again in Path 16's rootkit/bootkit discussion.

:::challenge Test yourself
Name the OS's job that is essentially a built-in security system.

<details><summary>Show answer</summary>Managing <strong>access and permissions</strong> — deciding who is allowed to do what.</details>
:::

## Key terms

- **Operating system (OS)** — the manager software running a computer.
- **Kernel** — the innermost, most trusted part of the OS.
- **Shell** — the command-line interface.
- **User space** — where normal programs run.
- **Root / SYSTEM** — the all-powerful user (Linux / Windows).

## Recap

- The OS is the manager between you and the hardware.
- It runs programs, organises files, controls hardware, and enforces permissions.
- Controlling the OS usually means controlling the whole machine — which is why attackers target it.
- The kernel is its innermost, most trusted part.

???refs
- [Operating system — Wikipedia](https://en.wikipedia.org/wiki/Operating_system) — broad overview.
- [The linux kernel](https://www.kernel.org/) — the official source of the Linux kernel itself.
- [How an OS works — Computerphile (YouTube)](https://www.youtube.com/watch?v=Kf3aLQOXbnk) — a nice friendly video.
???

**Next up →** [Windows vs Linux vs macOS](#/lesson/03-linux/windows-linux-mac)
