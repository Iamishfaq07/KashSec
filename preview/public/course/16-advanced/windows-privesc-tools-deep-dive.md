# Windows Privilege Escalation Tools, Deep Dive

The Windows privilege escalation lesson introduced WinPEAS and the Potato family of exploits. This lesson goes deeper into the tooling and the token-based mechanics behind them, directly connecting to the previous lesson's Linux tool coverage as the Windows-side counterpart of the exact same enumeration-first discipline.

## WinPEAS mirrors LinPEAS, on Windows-specific vectors

**WinPEAS** performs the same systematic, color-coded enumeration philosophy as LinPEAS (previous lesson), but checks Windows-specific vectors instead: service permissions, registry autoruns, scheduled tasks, stored credentials in unattended-install files, and token privileges — the same "automate the manual checklist, then verify manually" relationship applies here just as directly.

## Service misconfigurations, the most common real-world finding

A genuinely frequent real-world Windows privesc path: a Windows service configured to run as `SYSTEM` (the highest privilege level) but with a service binary path that's writable by a lower-privileged user — replacing that binary (or, if the path contains unquoted spaces, planting a malicious executable at an ambiguous path Windows will resolve incorrectly) means the next service restart executes attacker-controlled code as `SYSTEM`, directly parallel to the writable-cron-job technique from the previous lesson's Linux coverage.

## The Potato family, actually explained

Directly connecting to Path 14's exploit-development-basics lesson on the gap between vulnerability and exploit: the **Potato** exploit family (JuicyPotato, RoguePotato, PrintSpoofer, and successors) all abuse a specific category of Windows privilege — a service account holding `SeImpersonatePrivilege` can be tricked into authenticating as `SYSTEM` to an attacker-controlled component, then that authentication token gets captured and reused (impersonated) to run commands as `SYSTEM`. This is a genuinely different mechanism from the Linux techniques covered previously — it exploits how Windows handles privileged token impersonation, not a filesystem permission gap.

## Tokens, briefly — why this matters

Windows access control fundamentally revolves around **access tokens** — an object representing a user or service's identity and privileges, attached to every process that user or service runs. A privilege like `SeImpersonatePrivilege` grants a process the ability to impersonate another security context's token under specific conditions; the Potato exploits' entire mechanism is manipulating exactly that impersonation capability, which is why understanding tokens conceptually (even without deep internals knowledge) makes the Potato family's actual mechanism click rather than remaining a black-box "just run the tool" technique.

## Credentials in unexpected places

Directly connecting to Path 00's password-hygiene lesson from the defender's side: Windows systems frequently retain plaintext or weakly-encoded credentials in surprising locations — `unattend.xml` files left over from automated OS deployment, PowerShell command history, or credentials cached in the registry from legacy autologon configuration. WinPEAS specifically checks these locations because they remain a genuinely common, embarrassingly simple real-world finding.

:::challenge Test yourself
Why does the Potato exploit family require `SeImpersonatePrivilege` specifically, rather than working against any service account?
<details><summary>Show answer</summary>The Potato techniques don't exploit a filesystem or configuration weakness the way the writable-service-binary-path technique does — they exploit a very specific Windows security feature: the ability for a process holding <code>SeImpersonatePrivilege</code> to impersonate the security context of another entity that authenticates to it, under certain conditions. The exploit chain works by tricking a privileged Windows component (historically, a COM/DCOM or NTLM-relay-adjacent mechanism, depending on the specific Potato variant) into authenticating as <code>SYSTEM</code> to something the attacker's process controls, at which point the attacker's process — because it holds that specific impersonation privilege — can capture and reuse that <code>SYSTEM</code>-level authentication token as its own. A service account that lacks <code>SeImpersonatePrivilege</code> entirely has no mechanism available to capture and reuse that token even if the same authentication trick could be triggered, which is exactly why checking for this specific privilege (via <code>whoami /priv</code>) is one of the very first things a Windows privilege escalation enumeration should do.</details>
:::

## Key terms

- **WinPEAS** — the Windows-specific counterpart to LinPEAS, automating enumeration of Windows privilege escalation vectors.
- **Access token** — a Windows object representing a user or service's identity and privileges, attached to every running process.
- **SeImpersonatePrivilege** — a Windows privilege enabling a process to impersonate another security context's authentication token, the mechanism the Potato exploit family abuses.

## Recap

- WinPEAS applies the same enumeration-then-verify philosophy as LinPEAS, targeted at Windows-specific vectors like service permissions and stored credentials.
- Misconfigured service binary paths running as SYSTEM are a direct Windows parallel to the writable-cron-job Linux technique.
- The Potato exploit family works by abusing SeImpersonatePrivilege to capture and reuse a SYSTEM-level authentication token, a fundamentally token-based mechanism rather than a filesystem permission gap.

**Next up →** [Active Directory attacks](#/lesson/16-advanced/active-directory)
