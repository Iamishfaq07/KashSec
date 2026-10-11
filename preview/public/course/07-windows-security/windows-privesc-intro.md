# Windows Privilege Escalation: An Introduction

Every lesson in this path so far has been defensive — hardening, monitoring, backing up. This closing conceptual lesson flips the perspective, in overview form, to show you what an attacker actually does *after* gaining that first limited foothold this whole path has been trying to prevent — full hands-on technique lives in Path 16's dedicated Windows privesc lab, which assumes exactly this lesson as its starting foundation.

:::tip
"Privilege escalation" isn't one single technique — it's a whole category of methods for turning limited access into greater access. This lesson's job is giving you the map of that category, the same way Path 01's cyberattacks-overview lesson mapped attack types broadly before later paths went deep on each one.
:::

## Why privilege escalation matters even to defenders

An attacker's initial foothold — a phishing-compromised standard user account (Path 00), a webshell dropped through a vulnerable application — is rarely the end goal. The standard-user restrictions the windows-user-accounts lesson described are specifically designed to limit what that initial foothold can actually do. **Privilege escalation** is the process of turning that limited foothold into broader access — ideally, from the attacker's perspective, all the way to SYSTEM or Domain Admin (from the Active Directory lesson).

## Two broad categories: vertical and horizontal

- **Vertical privilege escalation** — gaining *higher* privilege than you started with (standard user → administrator → SYSTEM)
- **Horizontal privilege escalation** — gaining access to a *different* account or resource at roughly the same privilege level (compromising one standard user's data by abusing another standard user's improperly-isolated access)

## Common Windows privesc technique categories, by name

- **Misconfigured service permissions** — if a standard user has write access to a service's executable or configuration (a misconfiguration, not intended design) and that service runs as SYSTEM, replacing the executable grants SYSTEM-level code execution the moment the service restarts — directly building on the services lesson's coverage of LocalSystem-level privilege
- **Unquoted service paths** — a legacy Windows quirk where a service path containing spaces but no surrounding quotes can be exploited by placing a malicious executable earlier in the interpreted path
- **Weak file/folder permissions** — sensitive files or scheduled tasks (from the recognizing-compromise lesson) that a standard user shouldn't be able to modify, but can, due to a permissions misconfiguration
- **Credential exposure** — stored, cached, or improperly protected credentials (in scripts, configuration files, or memory) that grant access to a higher-privileged account
- **Unpatched vulnerabilities** — kernel or service-level vulnerabilities specifically enabling privilege escalation, which is exactly why the patching discipline from Path 00's updates lesson matters at every privilege level, not just for internet-facing services

## How this connects forward to Path 16 and the Active Directory lab

This lesson's vocabulary — vertical/horizontal escalation, service misconfiguration, credential exposure — is exactly the foundation Path 16's Windows privesc lab builds its hands-on exercises on, and it connects directly to this path's own Active Directory lesson: privilege escalation *within* a single machine is often just the first step toward the domain-wide escalation (toward Domain Admin) that Path 16's full Active Directory attack lab covers in depth.

:::challenge Categorize the technique
An attacker with standard-user access discovers that a Windows service configured to run as SYSTEM has its executable file located in a folder the attacker's account has write permission to.

<details><summary>Hint</summary>Which named technique category from this lesson does replacing that executable and restarting the service fall under?</details>
<details><summary>Show answer</summary>This is <strong>misconfigured service permissions</strong> — a form of vertical privilege escalation. The attacker doesn't need to break any authentication or exploit a software vulnerability at all; the misconfiguration (a standard user having write access to a SYSTEM-privileged service's executable) directly hands over an escalation path. Replacing the legitimate executable with a malicious one, then triggering the service to restart, causes the malicious code to run with the service's SYSTEM privileges rather than the attacker's original standard-user privileges — turning a limited foothold into full system control. This exact technique category, and the file-permission auditing that catches it, is covered hands-on in Path 16's Windows privesc lab.</details>
:::

## 🧪 Hands-on lab — reason about defenses, not just attacks

For each of the five technique categories named in this lesson, write one sentence identifying which earlier lesson in this path already covers a relevant defensive control (services auditing, GPO password/account policy, patching discipline, and so on).

:::challenge Test yourself
1. What's the difference between vertical and horizontal privilege escalation?
2. Why is a misconfigured service permission a privilege escalation risk specifically when the service runs as SYSTEM?
3. Why does patching matter for privilege escalation defense, not just for preventing initial compromise?
:::

## Key terms

- **Privilege escalation** — the process of gaining greater access than initially granted, either to a higher privilege level (vertical) or a different account at the same level (horizontal).
- **SYSTEM** — the most privileged built-in Windows account, above even a standard Administrator account.
- **Unquoted service path** — a legacy Windows misconfiguration where an unquoted, space-containing service path can be exploited to run attacker-controlled code.

## Recap

Privilege escalation is the category of techniques that turns an attacker's initial limited foothold — exactly the kind the hardening and monitoring lessons throughout this path try to prevent or detect — into broader access, whether vertical (higher privilege) or horizontal (a different account at the same level). Misconfigured service permissions, unquoted paths, weak file permissions, credential exposure, and unpatched vulnerabilities are the named technique categories worth recognizing now, with full hands-on practice waiting in Path 16's dedicated Windows privesc lab and Active Directory attack lab.

???refs
- [HackTricks — Windows Local Privilege Escalation](https://book.hacktricks.xyz/windows-hardening/windows-local-privilege-escalation) — a comprehensive, widely-used technical reference
???

**Next up →** [Windows Security Lab](#/lesson/07-windows-security/windows-security-lab)
