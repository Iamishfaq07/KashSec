# Windows Security Lab

This capstone lab combines every lesson in this path — fundamentals, security settings, Event Viewer, user accounts, the command line, and hardening — into hands-on practice on a real (virtual) Windows machine.

## Setting up your lab

Microsoft provides free, time-limited **Windows evaluation VMs** specifically for testing and development at [developer.microsoft.com/windows/downloads/virtual-machines](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/) — download one and run it in VirtualBox (Path 03's virtualization lesson covers the setup), giving you a completely safe, disposable Windows environment to practice on without risking a real machine.

## Tasks

1. **System reconnaissance.** Using Command Prompt and PowerShell (this path's command line lesson), gather: the exact Windows version (`systeminfo`), all running processes (`Get-Process`), all local user accounts (`Get-LocalUser`), and current network connections (`Get-NetTCPConnection` or `netstat -ano`). Document what a "normal," unmodified baseline looks like.
2. **Account audit.** Using `Get-LocalGroupMember -Group "Administrators"` (this path's user accounts lesson), confirm exactly which accounts have administrative privileges, and check whether the Guest account is enabled.
3. **Simulate and investigate a failed login pattern.** Deliberately attempt to log in with an incorrect password 5 times in a row, then open Event Viewer (this path's dedicated lesson) and find the resulting Event ID 4625 entries in the Security log — confirm you can see your own simulated "attack" reflected in the logs, directly connecting the offensive action to its defensive visibility.
4. **Check startup persistence locations.** Open Task Manager's Startup tab and separately run `Get-CimInstance Win32_StartupCommand` in PowerShell — compare what each shows, and note any registry-based Run key entries (this path's fundamentals lesson) among them.
5. **Perform a full hardening pass.** Using this path's securing-a-Windows-machine checklist, harden your test VM: confirm Defender's real-time protection and controlled folder access, review Firewall rules, enable BitLocker if the edition supports it (or note that it's unavailable on Home edition), and enable Advanced Audit Policy settings.
6. **Verify your hardening worked.** Re-run the PowerShell audit script from the securing-a-Windows-machine lesson and confirm the output reflects your changes — Administrators group membership matches your expectations, and recent Windows Update history shows current patches.

:::challenge Write a full security assessment report
Using everything from this lab, write a short report on your test VM's security posture: baseline findings (Task 1-2), your simulated incident and how it appeared in the logs (Task 3-4), and your hardening actions with before/after comparison (Task 5-6). This mirrors exactly the report structure from Path 09's reporting lesson, adapted for a defensive/hardening assessment rather than an offensive penetration test.
:::

## Where this connects across the course

This path's skills feed directly into several others: Path 11's DFIR and threat hunting labs assume comfort reading Windows logs exactly like this lab practiced; Path 11's Windows privesc lessons target exactly the account and service misconfigurations this path teaches you to audit and fix; and Path 08's SIEM material assumes the Event ID vocabulary from this path's Event Viewer lesson as a starting foundation.

## Key takeaway

A real Windows security assessment isn't fundamentally different in structure from the web or network assessments covered elsewhere in this course — reconnaissance, systematic checking against known risk categories, and clear documentation — just applied to Windows' specific architecture: the Registry, Event Viewer, and PowerShell instead of config files, `auth.log`, and bash.

## 🎓 Path complete

You've now covered Windows architecture and the Registry, built-in security tools (Defender, Firewall, BitLocker, UAC), reading and interpreting the Security log via Event Viewer, the local account and privilege model, both Windows command-line environments, and a complete hardening checklist — capped with hands-on practice on a real Windows VM. Combined with Path 03's Linux foundation, you now have working command-line and security fluency across both major desktop/server operating systems.

???refs
- [Microsoft: Windows evaluation VMs](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/) — free, official, time-limited test VMs used throughout this lab.
- [CIS Benchmarks for Windows](https://www.cisecurity.org/cis-benchmarks) — free, industry-standard, exhaustive hardening guidelines for going beyond this lab's scope.
???

**Explore more →** [Back to all paths](#/course) · [Path 11 — Advanced Cyber Topics](#/lesson/11-advanced)
