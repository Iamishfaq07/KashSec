# Choosing a Linux distro for security work

The why-linux lesson explained why Linux dominates security tooling in general. This lesson answers the next question: which specific **distribution** ("distro") should you actually reach for, and why does the answer change depending on what you're doing?

## What a distro actually is

A Linux **distribution** packages the Linux kernel together with a specific selection of software, a package manager, and default configuration choices — Linux itself is just the kernel; everything else is the distro's choice. This is why "Linux" isn't one operating system, but a whole family of them, each optimized for different priorities.

## The distros you'll actually encounter in security work

- **Kali Linux** — this course's default choice, built specifically for penetration testing and security research, pre-loaded with hundreds of offensive security tools
- **Parrot OS** — a genuine Kali alternative with a similar tool selection, generally lighter on system resources and with a stronger built-in focus on privacy and anonymity tooling
- **Ubuntu / Debian** — general-purpose distros you'll encounter constantly as *targets*, not attack platforms — the servers you're securing or testing are far more likely to run one of these than Kali
- **REMnux** — a specialized distro purpose-built for malware analysis (Path 17), pre-loaded with reverse-engineering and static/dynamic analysis tools rather than offensive pentesting tools

## Why "attack platform" and "target system" are different choices

A genuinely important distinction beginners often miss: Kali is designed to *attack* or *test* other systems — it's not designed to be hardened and exposed to the internet itself. A production web server, by contrast, should run a general-purpose, hardened distro like Ubuntu Server or Debian, configured defensively (a preview of what the hardening-checklist lesson later in this path covers), never Kali.

:::tip
A useful mental shortcut: Kali/Parrot are for the **attacker's or tester's own machine**. Ubuntu/Debian/RHEL are for **the systems being tested or run in production**. Confusing the two — running Kali as a production server, or trying to hack from a locked-down Ubuntu box missing all the tools — makes everything harder than it needs to be.
:::

## Enterprise and specialized distros worth knowing by name

- **Red Hat Enterprise Linux (RHEL) / CentOS / Rocky Linux** — common in corporate and government environments, valued for long-term support and enterprise-grade stability
- **Alpine Linux** — a minimal, security-focused distro popular specifically as a base for containers (connecting directly to Path 16's containers material), since a smaller base image means a smaller attack surface

:::challenge Test yourself
Why would running Kali Linux as a public-facing production web server be a poor security decision, despite Kali being a "security-focused" distro?
<details><summary>Show answer</summary>Kali is optimized and hardened for a completely different purpose than a production server: it ships with hundreds of offensive tools pre-installed, often runs services and configurations optimized for a tester's convenience rather than a locked-down attack surface, and its documentation and community support assume it's being used in a controlled lab environment, not directly exposed to the internet. A production server needs the opposite priorities — minimal installed software, hardened default configuration, and a distro (like Ubuntu Server or RHEL) specifically designed and widely tested for exactly that defensive, internet-facing role. "Security-focused" describes two very different things depending on whether you're the one testing or the one being tested.</details>
:::

## Key terms

- **Linux distribution (distro)** — the Linux kernel packaged together with a specific software selection, package manager, and configuration choices.
- **Attack platform** — a distro configured for offensive security testing (Kali, Parrot), not intended for production exposure.

## Recap

- A distro is the kernel plus a specific bundle of software and defaults — Kali, Parrot, Ubuntu, and RHEL all share the same underlying kernel but serve very different purposes.
- Attack-platform distros (Kali, Parrot) are for the tester's own machine; general-purpose, hardened distros (Ubuntu Server, RHEL) are for the systems actually being run or defended.
- Specialized distros (REMnux for malware analysis, Alpine for minimal container images) exist because different security tasks genuinely benefit from different default tooling and footprint.

**Next up →** [What is virtualization?](#/lesson/03-linux/virtualization)
