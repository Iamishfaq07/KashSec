# Windows Services & Task Manager, for Security

The command-line lesson gave you PowerShell as a tool. This lesson covers two specific things worth investigating with it (and with their GUI equivalents): **services**, the background processes Windows and installed software depend on, and how to actually use **Task Manager** as a security tool rather than just a performance monitor.

:::tip
The recognizing-compromise lesson mentioned unfamiliar processes and services as compromise indicators. This lesson goes deeper — what a service actually is, how it differs from a normal process, and specifically how attackers abuse the service model for persistence.
:::

## What a Windows service actually is

A **Windows service** is a background process that runs independently of any logged-in user — starting automatically at boot, running continuously, with no visible window. Windows itself relies on dozens of services for core functionality, and legitimate installed software (antivirus, backup tools, database servers) commonly installs its own services too.

## Why services matter specifically for security

Services are an attractive target and technique for attackers for a specific structural reason: a malicious service can be configured to start automatically at boot, run with high privileges (often **LocalSystem**, one of the most powerful accounts on a Windows machine), and persist across reboots — combining stealth, privilege, and persistence in one mechanism. This is precisely why "an unfamiliar new service" belongs on the same watch-list as the unfamiliar processes and scheduled tasks the recognizing-compromise lesson covered.

## Inspecting services: the practical tools

- **`services.msc`** — the graphical Services management console, listing every installed service, its startup type, and current status
- **Task Manager's "Services" tab** — a faster, simpler view of the same information, useful for a quick check
- **PowerShell's `Get-Service`** — lets you script and filter service queries, directly building on the command-line lesson, and far more practical than manually scrolling through a GUI list when investigating dozens of services at once

```
PS C:\> Get-Service | Where-Object {$_.Status -eq "Running"} | Sort-Object DisplayName
```

## What to actually look for in a service audit

- **Unfamiliar service names**, especially ones mimicking legitimate Windows service names with slight misspellings or extra characters
- **Services running from unusual file paths** — the exact same red flag from the recognizing-compromise lesson's `svchost.exe`-from-a-temp-folder example, applied specifically to services this time
- **Services set to "Automatic" startup that you don't recognize needing to run at every boot**
- **Services running under highly privileged accounts (LocalSystem) that don't obviously need that level of access** for their apparent function

## Task Manager as a genuine security tool, not just performance monitoring

Beyond the "Processes" tab most people already know, Task Manager's less-visited tabs matter for security review too:

- **"Details" tab** — shows the exact file path a process is running from (the single most important piece of information for spotting the fake-svchost pattern), along with the parent process that launched it
- **"Startup" tab** — lists everything configured to launch automatically when a user logs in, a common and simpler persistence mechanism than a full service
- **"Users" tab** — shows every currently logged-in session, useful for spotting an unexpected concurrent session you didn't start yourself

:::challenge Spot the anomaly
A service named "Windows Update Assistant Service" is set to Automatic startup and running under LocalSystem. Investigating its file path in Task Manager's Details tab shows it's running from `C:\ProgramData\WinUpdate\svc.exe`.

<details><summary>Hint</summary>Where would you expect a genuine, official Windows Update–related service to actually run from, and does this path match?</details>
<details><summary>Show answer</summary>This is a strong indicator of a malicious service disguised with a legitimate-sounding name. Genuine core Windows services run from well-known system paths (typically under <code>C:\Windows\System32</code>), not from a generic, user-writable-adjacent location like <code>C:\ProgramData\WinUpdate</code> with a generically-named executable (<code>svc.exe</code>) that gives no real indication of what it actually does. Combined with LocalSystem privileges and Automatic startup — exactly the persistence-plus-privilege combination this lesson described as the structural reason services are attractive to attackers — this warrants immediate further investigation, following the same isolate-first instinct the recognizing-compromise lesson established.</details>
:::

## 🧪 Hands-on lab — audit your own services

On a Windows machine or VM you control, open `services.msc` and review the list, or run `Get-Service` in PowerShell. Pick five services you don't immediately recognize and look up what each one actually does — building the habit of knowing what "normal" looks like on a machine you're responsible for, before you ever need to spot what's abnormal.

:::challenge Test yourself
1. Why are services a particularly attractive persistence mechanism for attackers, compared to a normal process?
2. What single piece of information in Task Manager's Details tab is most useful for spotting a disguised malicious process or service?
3. Name two ways to inspect the list of installed services on a Windows machine.
:::

## Key terms

- **Windows service** — a background process running independently of any logged-in user, often starting automatically at boot.
- **LocalSystem** — a highly privileged built-in account many Windows services run under.
- **Get-Service** — a PowerShell cmdlet for querying installed services.

## Recap

Windows services combine automatic startup, independence from any logged-in user, and often high privilege — exactly the combination that makes them an attractive persistence and stealth mechanism for attackers, and exactly why an unfamiliar service belongs on the same watch-list as unfamiliar processes and scheduled tasks. `services.msc`, Task Manager's often-overlooked Services and Details tabs, and PowerShell's `Get-Service` are the practical tools for a real service audit — and knowing what "normal" looks like on a machine you're responsible for is what actually makes an abnormal finding recognizable later.

???refs
- [Microsoft — Services documentation](https://learn.microsoft.com/en-us/windows/win32/services/services) — the official technical reference
???

**Next up →** [Securing a Windows Machine](#/lesson/07-windows-security/securing-a-windows-machine)
