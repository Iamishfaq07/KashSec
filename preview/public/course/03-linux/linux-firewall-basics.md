# Linux Firewall Basics

Path 02 covered firewall concepts generally. This lesson gets hands-on with how Linux actually implements them — **iptables** and its modern, friendlier successor **ufw** — directly extending Path 02's default-deny principle to a real, running Linux system.

## iptables: the underlying engine

**iptables** is Linux's traditional firewall tool, working through **chains** of rules that traffic gets evaluated against, in order, the moment it arrives, leaves, or passes through the machine. It's genuinely powerful, but its syntax is notoriously unfriendly for beginners:

```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT     # allow incoming SSH
iptables -A INPUT -j DROP                          # drop everything else
```

## ufw: uncomplicated firewall, living up to its name

**ufw (Uncomplicated Firewall)** sits on top of iptables, providing a genuinely simpler interface for the exact same underlying functionality — the same relationship a Windows Firewall GUI has to its underlying rule engine:

```bash
ufw enable                          # turn the firewall on
ufw default deny incoming           # default-deny, directly from Path 02's lesson
ufw default allow outgoing          # allow outbound by default
ufw allow 22/tcp                    # allow SSH specifically
ufw allow from 192.168.1.0/24       # allow a specific subnet, from Path 02's CIDR lesson
ufw status verbose                  # review current rules
```

## Applying default-deny in practice

The `ufw default deny incoming` command above is the practical, one-line application of exactly the default-deny principle Path 02's firewalls-basics lesson explained in theory: block everything by default, then explicitly permit only the specific, known-necessary traffic (here, SSH) — directly reducing the attack surface of anything you haven't deliberately decided to expose.

## firewalld: the RHEL-family alternative

Red Hat-based distros (from the distros-for-security lesson) typically use **firewalld** instead of ufw, organizing rules around named **zones** (trusted, public, internal) rather than ufw's more direct rule-by-rule approach — functionally similar, worth recognizing by name if you end up working with RHEL/CentOS/Rocky systems specifically.

:::danger A misconfigured firewall on a remote machine can lock you out
A genuinely common, painful mistake: enabling a default-deny firewall on a remote server *before* explicitly allowing the SSH port you're currently connected through, immediately cutting off your own remote access with no easy way back in except physical or console access. Always allow your current connection method explicitly before enabling default-deny on a machine you're not physically sitting in front of.
:::

:::challenge Test yourself
Why does the order of commands matter when configuring `ufw default deny incoming` and `ufw allow 22/tcp` on a remote server you're currently SSH'd into?
<details><summary>Show answer</summary>If you enable <code>ufw default deny incoming</code> before explicitly allowing port 22 (SSH), your current remote connection gets cut off the moment the default-deny rule takes effect — since SSH traffic hasn't been explicitly permitted yet, it falls under the new default-deny policy and gets blocked, including your own already-connected session in many configurations. The safe order is to explicitly allow the port you're currently connected through <em>first</em>, then enable the default-deny policy — ensuring your own access path is already permitted before the more restrictive default takes effect. This exact "don't lock yourself out" caution applies to any remote firewall configuration change, not just ufw specifically.</details>
:::

## Key terms

- **iptables** — Linux's traditional, low-level firewall rule engine.
- **ufw (Uncomplicated Firewall)** — a simplified interface built on top of iptables.
- **firewalld** — the zone-based firewall management tool common on RHEL-family distros.

## Recap

- iptables is the powerful, low-level engine underlying Linux firewalling; ufw and firewalld provide friendlier interfaces on top of it.
- `ufw default deny incoming` is the direct, practical application of Path 02's default-deny principle to a real running system.
- Always explicitly allow your current remote connection method before enabling a default-deny policy on a machine you're not physically in front of — a genuinely common and painful mistake to avoid.

**Next up →** [Your first bash script](#/lesson/03-linux/bash-scripting)
