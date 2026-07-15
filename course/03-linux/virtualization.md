# What is virtualization?

You need a place to practise where breaking things is safe and legal. **Virtualization** gives you exactly that: a disposable second computer you fully own, living inside your real one.

## The core idea

**Virtualization** is a clever trick: running a whole second computer *inside* your real one, in a window. That simulated computer is called a **virtual machine** (VM). It has its own operating system, its own files, its own network settings — but it's really just software running on your actual machine.

~~~svg Host, hypervisor, and guest VMs
<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="12">
    <!-- Physical machine -->
    <rect x="30" y="30" width="640" height="250" rx="10" fill="#0C1119" stroke="#213043" stroke-width="1.5"/>
    <text x="60" y="55" fill="#8496A6" font-size="11">HOST (your real computer)</text>
    <!-- Hardware -->
    <rect x="50" y="220" width="600" height="45" rx="6" fill="#111927" stroke="#E05548"/>
    <text x="350" y="248" text-anchor="middle" fill="#E05548" font-weight="600">⚙ Real hardware (CPU · RAM · disk · NIC)</text>
    <!-- Host OS -->
    <rect x="50" y="170" width="600" height="45" rx="6" fill="#111927" stroke="#8496A6"/>
    <text x="350" y="197" text-anchor="middle" fill="#8496A6" font-weight="600">🪟 Host OS (Windows / macOS / Linux)</text>
    <!-- Hypervisor -->
    <rect x="50" y="120" width="600" height="45" rx="6" fill="#2b1f0a" stroke="#EFA43A"/>
    <text x="350" y="147" text-anchor="middle" fill="#EFA43A" font-weight="700">🔀 Hypervisor (VirtualBox / VMware / KVM)</text>
    <!-- Guest VMs -->
    <rect x="70" y="65" width="180" height="50" rx="6" fill="#0f2b26" stroke="#3FB6A8"/>
    <text x="160" y="95" text-anchor="middle" fill="#3FB6A8" font-weight="600">💻 Guest VM 1</text>
    <text x="160" y="108" text-anchor="middle" fill="#8496A6" font-size="10">Kali Linux</text>
    <rect x="260" y="65" width="180" height="50" rx="6" fill="#0f2b26" stroke="#3FB6A8"/>
    <text x="350" y="95" text-anchor="middle" fill="#3FB6A8" font-weight="600">💻 Guest VM 2</text>
    <text x="350" y="108" text-anchor="middle" fill="#8496A6" font-size="10">Metasploitable (target)</text>
    <rect x="450" y="65" width="180" height="50" rx="6" fill="#0f2b26" stroke="#3FB6A8"/>
    <text x="540" y="95" text-anchor="middle" fill="#3FB6A8" font-weight="600">💻 Guest VM 3</text>
    <text x="540" y="108" text-anchor="middle" fill="#8496A6" font-size="10">Windows AD lab</text>
  </g>
</svg>
~~~

## Why this is perfect for learning security

- **It's safe.** If you break the VM — infect it, misconfigure it, delete everything — your real computer is untouched. You just reset the VM.
- **It's isolated.** Attacks and tools stay *inside* the VM's window and can't reach your real files (as long as you set the network correctly, which we'll cover).
- **It's free.** The software that creates VMs costs nothing.
- **It's disposable and repeatable.** Take a **snapshot** (a saved state) and jump back to it instantly, or throw a VM away and make a fresh one in minutes.

## The vocabulary

- **Hypervisor** — the software that creates and runs virtual machines. The beginner-friendly free one is **VirtualBox** (by Oracle). Alternatives: VMware Workstation Player (free for personal use), Parallels (Mac), Hyper-V (Windows Pro), KVM (Linux).
- **Host** — your real computer (the one running VirtualBox).
- **Guest** — the virtual machine running inside it (your Kali, in a moment).
- **Snapshot** — a saved photo of a VM's state you can restore later.
- **VM image** — a downloadable pre-built VM (like the Kali OVA you'll use).

## Type 1 vs Type 2 hypervisors

- **Type 1 (bare-metal)** — runs directly on the hardware, no host OS underneath. VMware ESXi, Hyper-V Server. Used in data centres.
- **Type 2 (hosted)** — runs as an app on top of your normal OS. **VirtualBox is Type 2.** This is what you'll use.

Type 2 is much easier to set up; Type 1 is more efficient but industrial.

## The professional habit

Real security professionals *never* run risky tools or open suspicious files on their real machine. They always use a VM. You're about to learn the exact same setup the pros use daily. **Building this lab is a genuine milestone.**

:::tip PICTURE IT
A VM is a sealed, transparent box on your desk. You can do anything inside the box — even set off a firework — and your desk stays clean. If the box gets wrecked, you grab a fresh identical box. That safety is what makes fearless learning possible.
:::

## System requirements to check

Before you install VirtualBox, make sure your machine can handle it:

- **RAM:** 8 GB or more is comfortable. 4 GB works but tight.
- **Disk:** 30–40 GB free.
- **CPU:** must support hardware virtualization (VT-x on Intel, AMD-V on AMD) — nearly all modern CPUs do. May need to enable in BIOS (we cover this next lesson).
- If you have less: use **TryHackMe** or **Hack The Box** in your browser instead. The whole course still works.

:::challenge Test yourself
In virtualization terms, what do we call your *real* computer, and what do we call the virtual machine running inside it?

<details><summary>Show answer</summary>Your real computer is the <strong>host</strong>; the virtual machine is the <strong>guest</strong>.</details>
:::

## Key terms

- **Virtualization** — running a computer inside a computer.
- **Virtual machine (VM)** — the simulated computer.
- **Hypervisor** — software that runs VMs (e.g., VirtualBox).
- **Host / guest** — your real machine vs the VM.
- **Snapshot** — a restorable saved state of a VM.
- **Type 1 / Type 2** — bare-metal vs hosted hypervisor.

## Recap

- Virtualization runs a second computer (a VM) inside your real one.
- It's safe, isolated, free, and disposable — perfect for practice.
- VirtualBox (Type 2 hypervisor) runs the VM; your machine is the host, the VM is the guest.
- Pros always test in VMs — you're about to do the same.

???refs
- [Oracle VirtualBox](https://www.virtualbox.org/) — download & docs.
- [VMware Workstation Player](https://www.vmware.com/products/workstation-player.html) — free alternative.
- [What is a hypervisor? — Red Hat](https://www.redhat.com/en/topics/virtualization/what-is-a-hypervisor)
- [Vulnhub](https://www.vulnhub.com/) — free vulnerable VMs to practise on.
???

**Next up →** [Install VirtualBox](#/lesson/03-linux/install-virtualbox)
