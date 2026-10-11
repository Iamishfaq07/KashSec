# Building your first home lab

Reading about security only gets you so far — real skill comes from actually doing things, safely, on systems you're allowed to break. This lesson covers how to set up your own practice environment before you dive into the more technical paths ahead.

:::danger
Everything in this lesson is about practicing on systems *you own and control*, in an isolated environment. The golden-rule lesson's permission principle applies here too — a home lab is specifically how you get unlimited "permission," legally and safely, to practice attack and defense techniques.
:::

## What a home lab actually is

A **home lab** is a small, isolated practice environment — usually one or more virtual machines running on your own computer — where you can install vulnerable software, practice attacks, break things, and reset everything back to a clean state whenever you want, all without any risk to a real system or network.

## Virtual machines: the core building block

A **virtual machine (VM)** is a full, isolated "computer inside your computer" — a separate operating system running in software, that behaves like its own independent machine but can be created, copied, or deleted in minutes. This is exactly why VMs are the standard tool for security practice: you can intentionally infect, misconfigure, or break a VM, then simply delete it and start over, with zero risk to your actual computer.

- **VirtualBox** and **VMware Workstation Player** are the two most common free options for running VMs on your own computer.
- **Snapshots** — a feature nearly every VM tool offers — let you save an exact state of a VM and instantly roll back to it later, which is enormously useful when you want to practice the same attack repeatedly from a known clean starting point.

## What to actually install, as a beginner

- **Kali Linux** — a Linux distribution that comes pre-loaded with hundreds of security tools, widely used throughout this course's later labs and in the real security industry
- **A deliberately vulnerable target VM** — projects like **Metasploitable** and **DVWA (Damn Vulnerable Web Application)** are built specifically to be broken into for learning purposes, giving you something legal and safe to practice attacking
- **A second, "clean" VM** running a normal operating system, useful for practicing defensive concepts (patching, monitoring, hardening) rather than only offensive ones

## Isolating your lab network — the step beginners skip

The single most important lab configuration detail: set your VMs to use an **isolated (or "host-only") network** rather than bridging them directly to your home network. This ensures that anything you're deliberately running — a vulnerable web app, malware samples in later paths — can't accidentally reach your real home devices or the wider internet.

:::tip
Getting this right now means you won't have to relearn it later — Path 03's Linux fundamentals, Path 11's web security labs, and nearly every hands-on exercise in this course from here forward assume you have a working, isolated lab environment ready to go.
:::

## 🧪 Hands-on lab — set up your first environment

1. Download and install VirtualBox (or VMware Workstation Player) — both are free for personal use.
2. Download Kali Linux's official VM image and import it into your virtualization software.
3. Configure the VM's network adapter to "Host-only" or "Internal Network" rather than "Bridged," so it's isolated from your home network.
4. Take a snapshot of the freshly installed Kali VM before you do anything else with it — this becomes your clean starting point to roll back to later.
5. Boot the VM once and confirm it starts up successfully.

:::challenge Test yourself
1. Why are VMs specifically well-suited to security practice, compared to installing tools directly on your main computer?
2. What does a snapshot let you do that would otherwise require a full reinstall?
3. Why should a lab's network be isolated rather than bridged to your home network?
:::

## Key terms

- **Home lab** — a small, isolated practice environment for hands-on security learning.
- **Virtual machine (VM)** — a full, isolated operating system running as software inside your real computer.
- **Snapshot** — a saved state of a VM that can be instantly restored later.
- **Isolated/host-only network** — a VM network configuration that prevents traffic from reaching your real home network or the internet.

## Recap

- A home lab, built from virtual machines, is how you get unlimited legal "permission" to practice attack and defense techniques.
- VirtualBox or VMware, plus a Kali Linux VM and a deliberately vulnerable target VM, form a solid beginner setup.
- Snapshots let you instantly reset to a clean state, making repeated practice fast and low-risk.
- Isolating your lab's network is the single most important configuration step, and one this course's labs assume you already have working going forward.

**Next up →** [Joining the security community](#/lesson/01-introduction/joining-the-community)
