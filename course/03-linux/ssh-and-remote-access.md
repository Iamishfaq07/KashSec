# SSH & Remote Access

Every lesson so far has assumed you're sitting directly at the machine. This lesson covers **SSH**, the tool that lets you securely operate a Linux machine from anywhere — and directly parallels Path 07's RDP-security lesson, covering the Linux equivalent of that exact same remote-access risk category.

## What SSH actually is

**SSH (Secure Shell)** provides an encrypted connection to a remote machine's command line, directly applying the TLS-style cryptography concepts from Path 06 — everything you type, and everything the remote machine sends back, travels encrypted, protected against the packet-sniffing risk covered in Path 02.

```bash
ssh username@remote-host
```

## Password authentication vs. key-based authentication

- **Password authentication** — the simplest option, but vulnerable to exactly the credential-stuffing and brute-force risks Path 00's passwords lesson covered, especially against internet-exposed SSH
- **Key-based authentication** — a public/private key pair (directly applying Path 06's asymmetric-encryption concepts) where your private key stays on your own machine and only the corresponding public key is placed on the server, meaning there's no password to guess, phish, or brute-force at all

```bash
ssh-keygen -t ed25519          # generate a new key pair
ssh-copy-id username@remote-host   # install your public key on the server
```

:::tip Key-based auth is the real-world standard for good reason
Most professionally-managed Linux servers disable password authentication for SSH entirely, requiring key-based authentication instead — directly eliminating the entire brute-force and credential-stuffing attack category, the same way Path 00's passkeys coverage described eliminating phishable passwords entirely.
:::

## SSH as a genuinely high-value attacker target

Directly mirroring Path 07's RDP lesson: internet-exposed SSH is one of the most commonly scanned and attacked services on the internet, precisely because a successful login often grants a full, interactive command-line session on the target.

## Practical SSH hardening

- **Disable password authentication**, requiring key-based auth exclusively
- **Disable direct root login** (`PermitRootLogin no`) — forcing an attacker to compromise a normal user account *and* separately escalate privilege, rather than getting full root access from a single successful login
- **Change the default port** — the same minor, supplementary "reduce automated scanner noise" benefit Path 07's RDP lesson described, not a primary defense on its own
- **Use fail2ban or similar tools** — automatically banning source addresses after repeated failed login attempts, directly applying the account-lockout principle from Path 00's passwords lesson at the network level

## SSH tunneling: a genuinely useful (and sometimes risky) side feature

SSH can also forward other network traffic through its encrypted connection — a technique called **tunneling**, useful for securely accessing an internal service through an SSH connection. Worth knowing it exists, since it's both a legitimate administrative tool and, in the wrong hands, a way to route otherwise-blocked traffic through an unexpected path — precisely the kind of thing a security review of SSH configuration should account for.

:::challenge Test yourself
Why does key-based SSH authentication eliminate an entire category of attack that password authentication remains vulnerable to?
<details><summary>Show answer</summary>Key-based authentication removes the password entirely from the equation — there's nothing to guess, phish, or reuse from a different breach, since authentication depends on possessing the correct private key rather than knowing a secret string. Credential stuffing and brute-force attacks specifically target passwords; against key-based authentication, an attacker without the actual private key file has no viable path in at all, regardless of how many attempts they make or how weak a "password" might otherwise have been. This is exactly the same fundamental shift Path 00's passkey coverage described for account logins generally, applied here to server access specifically.</details>
:::

## Key terms

- **SSH (Secure Shell)** — an encrypted protocol for remotely operating a machine's command line.
- **Key-based authentication** — SSH authentication using a public/private key pair instead of a password.
- **fail2ban** — a tool that automatically bans source addresses after repeated failed login attempts.

## Recap

- SSH provides encrypted remote command-line access, directly applying Path 06's cryptography concepts to everyday Linux administration.
- Key-based authentication eliminates the password-guessing attack category entirely, and is the real-world professional standard.
- Internet-exposed SSH is a top attacker target for exactly the same reasons Path 07 flagged RDP — disabling password auth, disabling root login, and using tools like fail2ban meaningfully harden it.

**Next up →** [Linux Cron & Scheduling](#/lesson/03-linux/linux-cron-and-scheduling)
