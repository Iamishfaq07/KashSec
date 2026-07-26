# Linux Package Management

The users-permissions lesson mentioned installing software "with apt." This lesson explains what's actually happening underneath that command — and why package management is a genuinely security-relevant topic, not just a way to install software conveniently.

## What a package manager actually does

A **package manager** installs, updates, and removes software, automatically handling **dependencies** (other packages a piece of software needs to function) so you never have to manually track down and install every prerequisite yourself. Different distro families use different package managers:

```bash
apt install <package>      # Debian, Ubuntu, Kali
dnf install <package>      # Fedora, RHEL, Rocky Linux
pacman -S <package>        # Arch Linux
```

## Where packages actually come from: repositories

A **repository** ("repo") is a curated collection of packages a package manager can install from, typically maintained by the distro's project itself or a trusted third party. This trust relationship matters enormously: when you run `apt install`, you're trusting that the repository's maintainers vetted the package, and that the connection between your machine and the repository server wasn't tampered with in transit.

## Package signing: verifying what you're actually installing

Just like the digital-signatures concept from Path 06, most package managers verify a **cryptographic signature** on every package before installing it, confirming the package genuinely came from the trusted repository and wasn't modified in transit or by a compromised mirror server. This is directly why adding an untrusted third-party repository (a genuinely common but risky practice) is a real security decision, not a neutral convenience choice — you're extending trust to a new signing key you may not have carefully vetted.

## Keeping packages updated: the security-critical habit

```bash
apt update      # refresh the list of available package versions
apt upgrade     # actually install available updates
```

This directly extends Path 00's updates-and-backups lesson to the Linux command line specifically: `apt update && apt upgrade` (or the equivalent for your distro) is the single highest-value routine security habit for any Linux system, applying exactly the same "the update you keep dismissing is a real risk" logic from that earlier lesson.

## Removing what you don't need: reducing attack surface

```bash
apt remove <package>        # remove a package, keep its config files
apt purge <package>         # remove a package and its config files
apt autoremove               # remove packages no longer needed as dependencies
```

Every installed package is, in principle, additional attack surface — additional code that could theoretically contain a vulnerability. A genuinely good habit, directly connecting to the least-functionality principle covered throughout this course: periodically reviewing installed packages and removing ones that are no longer actually used.

:::challenge Test yourself
Why does adding an untrusted third-party package repository represent a real security decision, not just a convenience choice?
<details><summary>Show answer</summary>Adding a repository means extending trust to whoever controls that repository's signing key — your package manager will subsequently treat any package signed by that key as legitimate and install it with elevated privileges, no different from packages from your distro's own official repository. If that third party's infrastructure is ever compromised, or if the repository owner is malicious from the start, packages installed from it could contain anything, and your system would have no way to distinguish that from a legitimate update. This is exactly the same trust chain concept from Path 06's digital-signatures lesson — verifying a signature only proves the package came from whoever holds that specific signing key, not that the key-holder is trustworthy in the first place.</details>
:::

## Key terms

- **Package manager** — software that installs, updates, and removes packages while automatically resolving dependencies.
- **Repository** — a curated collection of packages a package manager installs from.
- **Dependency** — another package a piece of software requires in order to function.

## Recap

- Package managers (apt, dnf, pacman) handle software installation and dependency resolution automatically, sourcing packages from trusted repositories.
- Package signing verifies a package genuinely came from its claimed source and wasn't tampered with — directly extending Path 06's digital-signatures concepts to software installation.
- Regularly updating packages is the single highest-value Linux security habit, and removing unused packages reduces overall attack surface.

**Next up →** [Linux Process Management](#/lesson/03-linux/linux-process-management)
