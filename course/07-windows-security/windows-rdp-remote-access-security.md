# RDP & Remote Access Security

Windows Security Settings covered the Firewall in general terms. This lesson zooms in on one specific service worth its own dedicated attention: **Remote Desktop Protocol (RDP)** — genuinely one of the single most commonly attacked Windows services in the real world.

:::danger
Internet-exposed RDP is one of the single most common initial-access vectors in real-world ransomware incidents. If you take away exactly one thing from this lesson, make it this: RDP should never be directly reachable from the open internet without additional protection layered in front of it.
:::

## What RDP actually is, and why it's such a common target

**RDP** lets a user remotely control a Windows machine's full desktop over the network — genuinely useful for legitimate remote work and IT administration, which is exactly why it's enabled so widely, and exactly why attackers scan the internet constantly looking for exposed RDP ports (3389 by default). An exposed RDP service, combined with a weak or reused password (Path 00's passwords lesson), gives an attacker a full, interactive desktop session — not just a foothold, but often complete control.

## How attackers actually find and abuse exposed RDP

- **Mass internet scanning** — automated tools continuously scan the entire internet for machines with port 3389 open, the same "fishing with a giant net" pattern the why-it-matters lesson back in Path 01 described
- **Credential stuffing and brute-forcing** — once an exposed RDP service is found, attackers try leaked or common password lists against it, exactly the credential-attack pattern covered in Path 01's cyberattacks overview
- **Ransomware deployment** — RDP compromise is one of the most frequently cited initial-access methods in real ransomware incident reports, precisely because a working RDP session gives an attacker everything needed to move further into a network from there

## Practical RDP hardening

- **Never expose RDP directly to the internet** — this is the single highest-impact fix; if remote access is genuinely needed, route it through a VPN (Path 00's Wi-Fi lesson) or a Zero Trust Network Access solution (Path 24) instead of a raw open port
- **Enable Network Level Authentication (NLA)** — requires authentication to complete *before* a full remote session is even established, closing off a category of pre-authentication attacks
- **Enforce strong passwords and, where possible, MFA** on any account with RDP access — the same fundamentals from Path 00's passwords lesson apply with extra force here
- **Change the default port** — a minor, "security through obscurity" measure on its own, but it does meaningfully reduce noise from the most basic automated scanners, as a supplementary layer rather than a primary defense
- **Enable account lockout policies** — limiting how many failed login attempts are tolerated before an account locks, directly slowing brute-force attempts

## Other remote access surfaces worth the same scrutiny

RDP is the most notorious example, but the same underlying principle — remote access services deserve extra hardening scrutiny — applies to **SSH** (if enabled on Windows), **WinRM** (Windows Remote Management, used heavily for PowerShell remoting), and any third-party remote-support tool installed on a machine. Each is a legitimate, useful capability that becomes a serious liability the moment it's exposed without proper controls around it.

:::challenge Diagnose an exposure
A small business's server has RDP enabled with a strong 16-character password, but the server sits directly on the internet with port 3389 open to any source address, and no VPN or NLA configured.

<details><summary>Hint</summary>Does a strong password alone address every risk category this lesson covered — internet exposure, pre-authentication attacks, and brute-force protection?</details>
<details><summary>Show answer</summary>A strong password helps against brute-forcing specifically, but it doesn't address the core problem: the service is directly internet-reachable at all, which exposes it to every automated scanner and any future vulnerability discovered in RDP itself (RDP has had serious remote-code-execution vulnerabilities in the past, independent of password strength). The real fix is architectural, not just credential strength: remove direct internet exposure entirely by routing access through a VPN, enable NLA to require pre-authentication, and add account lockout policies as defense in depth. A strong password is necessary but nowhere close to sufficient on its own here.</details>
:::

## 🧪 Hands-on lab — audit RDP configuration

On a Windows machine or VM you control, check whether Remote Desktop is enabled (Settings → System → Remote Desktop), confirm whether Network Level Authentication is required, and check the Windows Firewall rules governing port 3389 to see exactly what source addresses are currently permitted.

:::challenge Test yourself
1. Why is exposed RDP such a common initial-access vector in real ransomware incidents?
2. What does Network Level Authentication add that a plain RDP connection doesn't have?
3. Name one remote access surface besides RDP that deserves the same hardening scrutiny.
:::

## Key terms

- **RDP (Remote Desktop Protocol)** — a Windows protocol allowing full remote control of a machine's desktop over the network.
- **Network Level Authentication (NLA)** — a security feature requiring authentication before a full RDP session is established.
- **WinRM (Windows Remote Management)** — a remote management protocol used heavily for PowerShell remoting.

## Recap

RDP is one of the single most commonly attacked Windows services in the real world, precisely because a compromised session hands an attacker full interactive control — and internet-exposed RDP is a frequently cited initial-access vector in real ransomware incidents. Never exposing RDP directly to the internet, enabling NLA, enforcing strong authentication, and applying the same scrutiny to other remote access surfaces (WinRM, SSH, third-party tools) closes off one of the highest-impact, lowest-effort attack paths a Windows environment can have.

???refs
- [CISA — Remote Desktop Protocol (RDP) Security Guidance](https://www.cisa.gov/news-events/cybersecurity-advisories) — search CISA's advisories for current RDP-specific guidance
???

**Next up →** [Windows Event Viewer](#/lesson/07-windows-security/windows-event-viewer)
