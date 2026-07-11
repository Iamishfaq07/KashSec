# Path 11 — Advanced Cyber Topics

> **Level:** Advanced · **Lessons:** 8 · **Assumed knowledge:** Paths 01–10.

You've got the fundamentals, the web, the network, the pentest methodology, and a bug bounty craft. Now we enter the areas where senior salaries live — the advanced skills real engagements demand and that separate a competent hacker from a valuable one. We'll cover **privilege escalation on Linux and Windows**, the enormous world of **Active Directory attacks**, **cloud security** across AWS/Azure/GCP, **container and Kubernetes security**, an introduction to **malware analysis**, and **digital forensics & incident response**. Each is a career by itself; this path gives you the mental map and a serious first push into each.

**Golden rule as always:** every technique is practised on lab machines you own, TryHackMe / Hack The Box / HackTheBox Academy content, or in-scope authorised engagements. Never on anything else.

---

## Lesson 11.1 — Linux privilege escalation, in depth

### Why this matters
In Path 09 you touched on privesc briefly. In serious engagements — and in most CTFs and OSCP-style boxes — you'll do it constantly. Mastering the *patterns* means you land on any Linux box and immediately know what to check.

### The four broad categories of Linux privesc
Every Linux privesc technique fits into one of these buckets. Learn to *categorise* first, then techniques become far easier to remember.

1. **Credential misuse** — reusable secrets in files, environment, history, or memory.
2. **Misconfigured privilege granters** — sudo rules, SUID binaries, capabilities, cron jobs.
3. **Kernel & software vulnerabilities** — known CVEs in the kernel or in privileged services.
4. **Trust and integrity failures** — writable PATH components, weak file permissions, LD_PRELOAD tricks.

### The enumeration checklist (do this every time)
When you land on a Linux box as a low-privileged user, run through this list. Automated tools do it in seconds but every senior tester also knows the manual view.

```bash
# --- Identity & environment ---
id; whoami; groups; hostname
uname -a               # kernel version — matters for kernel exploits
cat /etc/os-release    # distro and version

# --- Sudo abuse (the biggest single win) ---
sudo -l                # what CAN you run with sudo?

# --- SUID / SGID binaries ---
find / -perm -4000 -type f 2>/dev/null   # SUID
find / -perm -2000 -type f 2>/dev/null   # SGID
getcap -r / 2>/dev/null                  # Linux capabilities

# --- Scheduled tasks ---
cat /etc/crontab
ls -la /etc/cron.*
systemctl list-timers

# --- Interesting files ---
cat /etc/passwd; ls -la /etc/shadow  # (readable shadow = jackpot)
ls -la /root                          # often gives away perms
find / -writable -type f 2>/dev/null | grep -v /proc

# --- Credentials in the wild ---
history; cat ~/.bash_history
grep -r "password" /etc 2>/dev/null
find / -name "id_rsa" 2>/dev/null     # SSH private keys
env                                    # env vars sometimes leak secrets

# --- Running processes & sockets ---
ps -ef; ss -tulnp
```

### The automated helpers
Two scripts every practitioner reaches for:

- **LinPEAS** (`peass-ng/linpeas.sh`) — the community-standard Linux privesc enumerator. Colours findings by likelihood.
- **linux-smart-enumeration (LSE)** — leaner alternative, less noise.

Run them, then *read the output* — don't just skim colours. Every "yellow" is a lead worth chasing.

### The techniques you'll use most

**Sudo misconfigurations — check GTFOBins.** [`gtfobins.github.io`](https://gtfobins.github.io) is *the* reference: a searchable list of standard Linux binaries and how to abuse them for privesc. If `sudo -l` shows you can run `vim`, `find`, `awk`, `tar`, `python`, or `less` as root, GTFOBins likely has a one-liner that gets you a root shell. Examples:
```bash
# sudo can run vim → shell escape from within
sudo vim -c ':!bash'

# sudo can run find with any argument
sudo find / -exec /bin/bash \;

# sudo can run less
sudo less /etc/hosts    # then type: !bash
```

**SUID abuse.** A SUID binary runs with its owner's permissions (often root). If a SUID binary is on GTFOBins, it's typically abusable. Even without that: a SUID binary that calls another program without a full path is vulnerable to **PATH hijacking** — put a malicious binary earlier in PATH and it runs as root.

**Linux capabilities.** Instead of SUID (all-or-nothing), Linux capabilities give a program a subset of root powers. A common find is `python3` with `cap_setuid+ep`, allowing:
```bash
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
```

**Writable /etc/passwd.** Rare but devastating: if you can write to `/etc/passwd`, create a new root user with a known password. Craft an entry with `openssl passwd -1` and append.

**Cron / systemd timers.** A root cron running a script *you can write to* → your code runs as root. Always enumerate `/etc/cron*`, users' crontabs, and systemd timers.

**Kernel exploits (last resort).** `uname -a` gives the kernel version; check with `searchsploit "Linux Kernel"` or exploit-db. Risky: crashes are possible. Use only when other paths are exhausted, and take snapshots first in labs.

**Docker/LXD group membership.** If your user is in the `docker` group, you can spin up a privileged container mounting `/` and get root instantly. Same idea for `lxd`.

**Kernel-adjacent tricks.** `LD_PRELOAD` (if `env_keep` allows), `LD_LIBRARY_PATH`, tainted PATH — these are advanced but often present.

### 🧪 Lab — Practise on TryHackMe
1. Do the **Linux PrivEsc** room on TryHackMe (free). It walks every category above with lab machines.
2. Then try **Vulnhub's Kioptrix series** or **HackTheBox** boxes tagged "easy" and Linux. Recreate the enumeration steps by hand before running LinPEAS — that's how the patterns imprint.

### 🚩 Challenge
`sudo -l` shows you can run `/usr/bin/find` as root without a password. Give the one-liner that turns this into a root shell.

<details><summary>Answer</summary>sudo find / -exec /bin/bash \; (from GTFOBins).</details>

### Key terms
- **Privesc** — moving from a low user to root.
- **SUID / SGID / capabilities** — three ways Linux grants elevated rights.
- **GTFOBins** — the go-to reference for sudo/SUID abuse.
- **LinPEAS / LSE** — enumeration scripts.

### Recap
- Categorise: credential misuse, misconfigured privilege granters, kernel/software CVEs, trust/integrity failures.
- Run manual enum plus LinPEAS every time and *read the output*.
- Sudo, SUID, and capability abuses via GTFOBins deliver most beginner privescs.
- Kernel exploits are risky and a last resort; take snapshots in labs.

---

## Lesson 11.2 — Windows privilege escalation

### Why this matters
Almost every enterprise environment runs Windows heavily. Windows privesc is different from Linux — different vocabulary, tools, and traps — and it's essential for any pentester working in real corporates.

### Windows identities you'll meet
Instead of Linux's `root`, Windows has several highly privileged identities:

- **Administrator** — the local admin account on a machine.
- **SYSTEM** — even higher than Administrator; the OS itself. Getting SYSTEM is "root" on a single machine.
- **Domain Admin (DA)** — full control across a whole Active Directory domain (next lesson).
- **Enterprise Admin** — controls a whole forest of domains. Rarely-touched but the ultimate prize.

Windows also has the concept of **integrity levels** (Low, Medium, High, System) and **UAC** (User Account Control) that force even admin users to explicitly elevate.

### The enumeration checklist (Windows edition)
Run from `cmd.exe` or PowerShell:

```powershell
# Identity & context
whoami; whoami /priv; whoami /groups
systeminfo             # OS version, hotfixes, domain
hostname

# Users, groups, network
net user; net localgroup administrators
ipconfig /all; route print; netstat -ano

# Installed software (old versions = CVEs)
wmic product get name,version
Get-WmiObject Win32_Product | Select Name,Version

# Services
sc query
wmic service get name,pathname,startname,startmode
Get-Service | Where-Object {$_.Status -eq "Running"}

# Scheduled tasks
schtasks /query /fo LIST /v
```

### The automated helpers
- **WinPEAS** (`peass-ng/winpeas`) — the equivalent of LinPEAS for Windows.
- **PowerUp** (part of PowerSploit) — powerful PowerShell enumerator.
- **Seatbelt** — a modern C# enumerator by SpecterOps.

### The classic Windows privesc paths

**Unquoted service paths.** A service registered as `C:\Program Files\My App\service.exe` with no quotes — Windows tries `C:\Program.exe`, then `C:\Program Files\My.exe`, then the real one. Drop your binary earlier in the path and it runs as the service's identity (often SYSTEM).

**Weak service permissions.** A service you can modify (`sc config` or `sc start`) lets you point it at your executable. Check with `accesschk.exe`. If you can reconfigure a SYSTEM service, you have SYSTEM.

**Weak registry permissions.** A service whose registry `ImagePath` you can write.

**AlwaysInstallElevated.** If both `HKLM` and `HKCU` have `AlwaysInstallElevated=1`, any MSI installer runs as SYSTEM. Rare but game-over when present.

**Token impersonation.** Certain privileges (`SeImpersonatePrivilege`, `SeAssignPrimaryTokenPrivilege`) let a user impersonate other users. Common on IIS/MSSQL service accounts. Tools like **PrintSpoofer**, **RoguePotato**, and the "Potato" family exploit this to jump to SYSTEM.

**DLL hijacking.** A service or process loads a DLL from a writable folder. Drop your DLL, get code execution.

**Stored credentials.** Windows caches credentials heavily. Look in:
- **Credential Manager** (`cmdkey /list`, `vaultcmd`).
- **`runas /savecred`** — saved creds you can reuse without knowing them.
- **Unattended install files** (`C:\Windows\Panther\Unattend.xml`) — clear-text passwords.
- **Group Policy Preferences (GPP)** cpassword — legacy but still found; decryptable easily.

**Kernel exploits.** Old Windows versions have famous ones (MS16-032, MS17-010 EternalBlue). `systeminfo` + `wesng` or `sherlock.ps1` maps missing hotfixes to exploits.

### 🚩 Challenge
Which Windows privilege on a service account is the classic starting point for the "Potato" family of SYSTEM escalations?

<details><summary>Answer</summary>SeImpersonatePrivilege.</details>

### Key terms
- **SYSTEM / Administrator / DA** — Windows privilege levels.
- **Unquoted service path / weak service perms / DLL hijack** — classic privesc primitives.
- **WinPEAS / PowerUp / Seatbelt** — enum tools.
- **PrintSpoofer / RoguePotato** — token-impersonation exploits.

### Recap
- Windows privesc uses different primitives from Linux: services, tokens, DLL loading, stored credentials.
- WinPEAS is your first enum step; then look at services, tokens, and cached creds.
- SeImpersonatePrivilege → Potato-family → SYSTEM is a classic chain.
- Kernel exploits still work on unpatched systems (EternalBlue lives on).

---

## Lesson 11.3 — Active Directory: the political heart of enterprises

### Why this matters
**Active Directory (AD)** runs identity for most of the world's enterprises. It's the crown jewel of every red-team engagement. AD attacks are almost their own field — deep, layered, and where senior pentesters spend most of their time. This lesson gives you the essential map.

### What Active Directory is
AD is Microsoft's directory service — the central authority for who and what exists on a Windows network. Everything is an **object**: users, groups, computers, printers, shared folders. AD stores their attributes and relationships, and — critically — it authenticates users and grants access via **Kerberos** and **NTLM** protocols.

Every user logs in *to AD*, not to individual machines. That's what makes AD so powerful — and so devastating to compromise.

### Key vocabulary (learn this before you attack)
- **Domain** — a group of AD-managed objects sharing a database.
- **Domain Controller (DC)** — the server hosting AD; the crown jewel.
- **Forest** — a collection of domains sharing a schema and trust relationships.
- **OU (Organisational Unit)** — a folder-like structure for organising objects.
- **GPO (Group Policy Object)** — a set of policies applied to users or computers. Misconfigured GPOs are attack goldmines.
- **NTLM / Kerberos** — the authentication protocols. NTLM is older/weaker; Kerberos is the modern default with tickets.
- **TGT / TGS** — Ticket Granting Ticket (proves you're you) / Ticket Granting Service (proves you can access a service). Kerberos flow.
- **Service Principal Name (SPN)** — an identifier for a service running as a specific account. Used in "Kerberoasting."
- **SAM / NTDS.dit** — where Windows stores password hashes locally / where AD stores them globally.

### The AD attack chain
A typical AD compromise:

1. **Foothold** — often via phishing, a weak public service, or password spraying.
2. **Local privesc** — SYSTEM on the foothold machine (Lesson 11.2).
3. **Credential harvesting** — Mimikatz, LSASS dumps, cached tickets.
4. **AD enumeration** — using **BloodHound** to *see* the attack graph.
5. **Lateral movement** — using stolen creds to move to other machines.
6. **Privilege escalation** — moving up towards Domain Admin.
7. **Persistence** — Golden Ticket, Silver Ticket, DSRM.
8. **Domain domination and impact.**

### BloodHound — the game-changer
**BloodHound** collects AD data (via **SharpHound**) and renders the environment as a *graph* — nodes are users, groups, computers; edges are relationships and access rights. It then answers questions like "shortest path from *any user I've compromised* to Domain Admin?" instantly.

Before BloodHound, this was hours of manual queries. Now it's a click. Every red-teamer runs it early.

```powershell
# Collect data from an AD-joined box
SharpHound.exe -c All

# Load the resulting zip into the BloodHound GUI
# and query: "Shortest Paths to Domain Admins"
```

### The famous AD attacks
- **Password spraying against AD** — one common password (`Winter2024!`) tried against every domain user. Slow enough to dodge lockouts; devastatingly effective.
- **Kerberoasting** — request Kerberos service tickets (TGS) for accounts with SPNs. The ticket is encrypted with the service account's password hash. Crack it offline. Because service accounts often have weak passwords and long-lived rights, this yields high-value creds.
- **AS-REP Roasting** — for users with "Do not require Kerberos preauthentication," you can request an AS-REP directly and crack it offline. No prior credentials needed.
- **NTLM relay** — force a target to authenticate to you, then relay that authentication to another service. Combined with tools like `ntlmrelayx`.
- **Pass-the-Hash / Pass-the-Ticket** — reuse a stolen NTLM hash or Kerberos ticket without needing the plaintext password. Deadly effective.
- **Golden Ticket** — with the `krbtgt` account hash (the AD-wide Kerberos secret), you can *forge* tickets for any user, including admins, that last for years. Total domain compromise.
- **Silver Ticket** — the same idea for a single service. Stealthier than Golden.
- **DCSync** — abusing replication rights to ask a Domain Controller for all password hashes as if you were another DC. Full DA-equivalent hash dump.
- **Constrained/Unconstrained delegation abuse** — exploiting Kerberos delegation misconfigurations to escalate.
- **AD CS attacks** — abusing misconfigured Active Directory Certificate Services (the ESC1–ESC15 techniques from the "Certified Pre-Owned" whitepaper). Currently one of the hottest areas.

### Tooling you'll see everywhere
- **Impacket** — a Python suite of AD attack tools (`secretsdump.py`, `psexec.py`, `ntlmrelayx.py`, `GetUserSPNs.py`, `GetNPUsers.py`, `wmiexec.py`, etc.). Essential.
- **CrackMapExec / NetExec** — one-tool-does-most sweeps and lateral movement.
- **Mimikatz** — legendary Windows credential extractor.
- **Rubeus** — Kerberos abuse from Windows.
- **SharpHound / BloodHound** — enumeration and graphing.
- **certipy** — for AD CS attacks.

### 🧪 Lab — Learn AD safely
This subject needs practice environments. Best free options:
1. **TryHackMe's "Attacking Active Directory"** path — beginner-friendly.
2. **HackTheBox Academy's "Active Directory Enumeration & Attacks"** module.
3. **Build your own home lab.** Windows Server 2019/2022 evaluation + a couple of Windows 10 client VMs. Follow **"GOAD" (Game of Active Directory)** — a free, community-maintained deliberately vulnerable AD lab that mirrors many real attacks.

### 🚩 Challenge
Which AD attack lets you request Kerberos service tickets for accounts with SPNs, then crack them offline for the service account's password?

<details><summary>Answer</summary>Kerberoasting.</details>

### Key terms
- **Domain / DC / forest / OU / GPO** — the AD structural map.
- **NTLM / Kerberos / TGT / TGS / SPN** — the auth mechanics.
- **BloodHound / SharpHound** — graph the AD attack surface.
- **Kerberoast / AS-REP Roast / Pass-the-Hash / Golden Ticket / DCSync** — headline attacks.
- **Impacket / Mimikatz / Rubeus / NetExec / certipy** — the toolbelt.

### Recap
- AD is central to enterprise security and dominates senior offensive work.
- The attack chain: foothold → local privesc → creds → enum (BloodHound) → lateral → privesc → domination.
- Learn Kerberoast, AS-REP Roast, Pass-the-Hash, Golden Ticket, and AD CS attacks first.
- Impacket + BloodHound + Mimikatz is the classic starter toolkit.
- Free labs (TryHackMe, HTB Academy, GOAD) let you practise legally at home.

---

## Lesson 11.4 — Cloud security: AWS, Azure & GCP

### Why this matters
The world's infrastructure has moved to the cloud, and with it the attack surface. Cloud misconfigurations cause huge real-world breaches every month, and **cloud security engineer** is one of the highest-paid roles in security today.

### The shared responsibility model
The single most important cloud security concept. The cloud provider (AWS/Azure/GCP) secures the **infrastructure**; the customer secures **everything they run on it**. When a company gets breached via an "S3 bucket left open to the public," AWS's infrastructure was fine — the customer's *configuration* was the bug.

Roughly:
- **Provider handles:** the physical data centre, hypervisor, network fabric, hardware.
- **Customer handles:** identities, permissions, network policies, data, application security, patching (except for fully managed services), configurations.

### The three big providers at a glance
Different vocabulary for similar ideas:

| Concept | AWS | Azure | GCP |
|---|---|---|---|
| Compute | EC2 | Virtual Machines | Compute Engine |
| Storage | S3 | Blob Storage | Cloud Storage |
| Database | RDS | SQL Database | Cloud SQL |
| Identity | IAM | Entra ID (Azure AD) | Cloud IAM |
| Serverless | Lambda | Functions | Cloud Functions |
| Secrets | Secrets Manager / SSM | Key Vault | Secret Manager |
| Container Orchestration | EKS | AKS | GKE |

Learn AWS deeply first — it's the largest and best-documented — then Azure or GCP as needed.

### The classic cloud misconfigurations (and famous breaches)
- **Publicly readable/writable storage buckets** — the perennial cause of leaks. Capital One (2019), thousands more. Fixed by making buckets private by default and blocking public access at account level.
- **Over-privileged IAM roles** — a role attached to an EC2 instance with `*:*` (permission to do *anything*). Compromise that one instance → full account takeover.
- **Public snapshots / images / databases** — accidentally sharing a database snapshot to "the world."
- **Metadata service abuse (IMDSv1)** — SSRF on a cloud VM reaches `169.254.169.254` and steals the instance's IAM credentials (Path 07). AWS's fix is IMDSv2, which requires a token.
- **Leaked keys in code or git history** — access keys in a public GitHub repo. Attackers *scan for these in real time*.
- **Insecure serverless functions** — Lambda functions with excessive IAM or vulnerable dependencies.
- **Wide-open security groups** — port 22 or 3389 open to `0.0.0.0/0`.
- **Missing MFA on the root account** — the ultimate mistake.

### The attack workflow
When you compromise something in a cloud environment, follow the identity:

1. **What identity am I running as?** (`aws sts get-caller-identity`, or `az account show`).
2. **What can that identity do?** (`aws iam list-attached-role-policies`, `aws iam get-policy-version`).
3. **What resources exist?** (`aws s3 ls`, `aws ec2 describe-instances`).
4. **Can I read secrets?** (`aws secretsmanager list-secrets`, `aws ssm get-parameters-by-path`).
5. **Can I escalate?** — cloud IAM privesc is a rich field with dozens of known paths (see `Pacu` framework).
6. **Can I move laterally?** — assume a more privileged role, SSH into an EC2, hit an admin API.

### The tools every cloud tester learns
- **Pacu** — the AWS exploitation framework (like Metasploit for AWS).
- **ScoutSuite** — multi-cloud security auditor.
- **Prowler** — comprehensive AWS security assessment.
- **cloud_enum** — brute-force discovery of open cloud resources by keyword.
- **CloudFox** — attack-oriented AWS enumeration.
- **kube-hunter / kube-bench** — for Kubernetes (next lesson).
- **cloudsploit** — misconfiguration scanning.

### Learning path
The path most people take:
1. Read AWS's **Well-Architected Framework — Security Pillar** and Azure's **CAF Security** guidance. Understand what *good* looks like.
2. Get an **AWS Solutions Architect – Associate** or **Cloud Practitioner** cert to prove you understand the platform.
3. Study **AWS Security Specialty** and **AWS Certified Security – Specialty** if going deep.
4. Practise offensive on **flAWS.cloud** and **flAWS2.cloud** — free guided AWS-security wargames, tremendously fun.
5. Do TryHackMe's **AWS Cloud Security** path, and HackTheBox's cloud modules.

### 🧪 Lab — Your first cloud pentest game
Do **flAWS.cloud** end-to-end. It's a free, wonderfully paced 6-level guided game teaching real AWS misconfigurations. It's the single best cloud-security starter resource on the internet.

### 🚩 Challenge
An SSRF on an AWS EC2 instance can steal what specifically from the instance metadata service, and what's the fix that mitigates this?

<details><summary>Answer</summary>Temporary IAM credentials attached to the instance's role. The fix is enforcing IMDSv2, which requires a session token that can't be fetched via a simple GET-based SSRF.</details>

### Key terms
- **Shared responsibility model** — provider vs customer duties.
- **IAM (Identity & Access Management)** — cloud identity/permissions system.
- **IMDS / 169.254.169.254** — the instance metadata service; SSRF's cloud prize.
- **Pacu / ScoutSuite / Prowler / CloudFox** — cloud security tools.

### Recap
- Cloud shifts *infrastructure* security to the provider; *configuration* stays yours.
- Common breaches: open buckets, over-permissioned IAM, IMDS abuse via SSRF, leaked keys.
- The workflow: identity → permissions → resources → secrets → escalation → lateral.
- flAWS.cloud is the best free starting point.

---

## Lesson 11.5 — Containers, Docker & Kubernetes security

### Why this matters
Containers and Kubernetes now run huge swathes of modern applications. Their unique architecture creates a distinct attack surface most testers underestimate. Understanding it is quickly becoming table stakes for serious offensive and cloud work.

### The mental model
- **Container (Docker):** a lightweight isolated process bundle that runs the same on any host. Think "a mini VM but faster and simpler."
- **Image:** the read-only blueprint used to spin up containers.
- **Registry:** where images are stored (Docker Hub, private registries).
- **Orchestrator (Kubernetes):** software that runs and schedules containers across many hosts, with declarative configuration.

### Common Docker security issues
- **Running as root inside the container.** If a container is compromised, root inside can attack the kernel itself. Always use non-root users in images (`USER 1000` in Dockerfile).
- **Privileged containers.** A container run with `--privileged` bypasses most isolation — it's practically root on the host.
- **Docker socket exposed** (`/var/run/docker.sock`). If mounted into a container, you can spin up new containers *from* inside — and mount the host filesystem. Instant escape.
- **Insecure registries.** Pulling images over HTTP or from unverified sources allows tampering.
- **Secrets baked into images** — API keys and passwords in a `Dockerfile` or in image layers. Even after removal, they linger in older layers.
- **Vulnerable base images.** An `apt-get update` from three years ago = tons of unpatched CVEs. Rebuild regularly and scan.
- **Kernel sharing.** All containers on a host share the same kernel. A kernel exploit inside one can compromise all.

### Kubernetes attack surface
Kubernetes (`k8s`) is much bigger than Docker and its attack surface reflects that:

- **Exposed API server** — the "front door" of a cluster. Exposed without auth on many pentests.
- **Exposed kubelet** — each node's local API. Sometimes reachable and abused.
- **Weak RBAC** — Kubernetes' Role-Based Access Control. Over-permissive roles are common. `kubectl auth can-i --list` reveals your reach.
- **Pod-to-pod exposure** — flat networks between pods make lateral movement trivial without network policies.
- **etcd exposure** — the cluster's database, containing all secrets. Exposure = full cluster takeover.
- **Service account tokens** — mounted into every pod by default (at `/var/run/secrets/kubernetes.io/serviceaccount/token`). Compromise a pod = get its token.
- **Container escape** — using a container flaw (privileged mode, mounted docker socket, host path mounts) to break out to the node.

### Common attack sequence
1. **Get code execution in a pod** (e.g., web app RCE inside a container).
2. **Enumerate the pod** — read the mounted service account token.
3. **Query the API** — with the token, list pods, secrets, roles: `curl -k -H "Authorization: Bearer $TOKEN" https://kubernetes.default.svc/api/v1/namespaces/default/secrets`.
4. **Look for privileged pods, host mounts, RBAC over-permissions.**
5. **Escape to the node** if any privileged/host-mounted pod is reachable.
6. **From a node, own the cluster** — kubelet gives access to all pods; often equivalent to cluster-admin.

### The tools you'll use
- **Docker Bench for Security** — audits Docker daemon and containers against best practice.
- **Trivy** — scans images and filesystems for vulnerable packages.
- **kube-bench** — audits a Kubernetes cluster against the CIS benchmark.
- **kube-hunter** — hunts for k8s misconfigurations *from an attacker's view*.
- **Peirates** — an in-pod pentesting tool for Kubernetes.
- **Falco** — runtime detection for containers.

### 🚩 Challenge
A Kubernetes pod has been compromised. Where inside the pod's filesystem is its default service account token typically mounted?

<details><summary>Answer</summary>/var/run/secrets/kubernetes.io/serviceaccount/token</details>

### Key terms
- **Container / image / registry / orchestrator** — the container stack.
- **Privileged container** — near-root on the host.
- **Docker socket** — mount = instant escape.
- **RBAC / kubelet / etcd / service account token** — Kubernetes primitives.
- **Trivy / kube-bench / kube-hunter / Peirates** — the toolkit.

### Recap
- Containers share the host kernel; container escapes bypass isolation entirely.
- Docker socket exposure and `--privileged` are the classic escape enablers.
- In Kubernetes, RBAC + service account tokens + network policies are the main defensive levers.
- Trivy, kube-bench, and kube-hunter should be routine.

---

## Lesson 11.6 — Malware analysis basics

### Why this matters
Understanding how malware works turns you from someone who runs security tools into someone who genuinely *sees* what code is doing on a system. Even a basic grasp opens the door to detection engineering, threat intelligence, and incident response.

### The three analysis flavours
- **Static analysis** — examine the malware *without running it*. Read strings, headers, signatures, disassembly.
- **Dynamic analysis** — run the malware in a controlled sandbox and observe what it does (files, registry, network).
- **Reverse engineering** — deep, low-level: disassemble, decompile, and reconstruct the code's logic.

Start with static and dynamic; reverse engineering is a career path all by itself.

### The safe environment (non-negotiable)
Malware analysis is done inside a strictly isolated environment. Baseline:
- A dedicated **VM** (Path 03) with **Host-Only** networking, or completely disconnected.
- **Snapshots** taken before every run; restore afterwards.
- Never do this on your daily machine. Never open real malware on a Bridged network.
- Use **REMnux** (Linux-based malware analysis distro) and/or **FLARE VM** (Windows) — both pre-packed with the standard tools.

### Static analysis techniques
- **File type identification.** `file suspicious.exe`. Real file, or something disguised?
- **Hashes.** `md5sum`, `sha256sum`. Search **VirusTotal** — has this hash been seen before?
- **Strings.** `strings -a suspicious.exe | less`. Look for URLs, IPs, filenames, error messages, suspicious commands.
- **PE analysis** (Windows binaries). Tools like **PEStudio** or **pev** show sections, imports, entropy, embedded resources. High entropy suggests packing.
- **Detect It Easy (DIE)** — identifies packers/compilers/protectors.
- **YARA rules** — text patterns matching known families. Community rules are abundant.

### Dynamic analysis techniques
Run in an isolated VM with monitoring on:
- **Process Monitor (Procmon)** and **Process Hacker** — see file, registry, and process activity live.
- **Regshot** — snapshot the registry before/after execution to see what changed.
- **Wireshark / INetSim** — capture network activity; INetSim fakes internet responses so malware "phones home" and reveals its C2.
- **Any.run** and **Joe Sandbox** — cloud sandboxes with recorded execution reports. Useful when you can't set up locally.

### Reverse engineering (a peek)
- **Ghidra** — NSA's free, powerful disassembler and decompiler.
- **IDA Free / IDA Pro** — the industry standard (Pro is expensive).
- **x64dbg** — an active debugger for Windows.
- **radare2 / cutter** — open-source reversing.

Reverse engineering is its own discipline. Start with tutorials on **crackmes** and **beginner CTF binaries** before touching real malware internals.

### The MITRE ATT&CK link
When you analyse malware, its behaviours map to specific ATT&CK techniques. That mapping is the language you write findings in — it lets defenders build detection.

### 🧪 Lab — Safe first analysis
1. On a **fresh isolated VM** (snapshot first!), download **PEstudio** and a **known-safe malware sample** from **theZoo** or **MalwareBazaar** (both curated, malware-analyst-friendly repositories).
2. Do static analysis first: file type, hash, strings, PE imports. What jumps out?
3. Run it under Procmon and Wireshark. Note file, registry, and network activity.
4. Look up the hash on VirusTotal — see what other analysts have said.
5. Write a short report of behaviours observed. This is real malware analysis.

### 🚩 Challenge
Which two pre-packaged distros are the standard "labs in a box" for malware analysis on Linux and Windows respectively?

<details><summary>Answer</summary>REMnux (Linux) and FLARE VM (Windows).</details>

### Key terms
- **Static / dynamic / reverse engineering** — the three analysis modes.
- **REMnux / FLARE VM** — pre-built analyst distros.
- **YARA** — pattern-matching language for identifying malware families.
- **Ghidra / IDA / x64dbg** — reversing tools.

### Recap
- Analyse malware in a strictly isolated VM with snapshots.
- Static (strings, hashes, PE) then dynamic (Procmon, Wireshark, sandbox) covers most beginner needs.
- Ghidra opens the door to reverse engineering when you're ready.
- Map behaviours to MITRE ATT&CK for defensive value.

---

## Lesson 11.7 — Digital Forensics & Incident Response (DFIR)

### Why this matters
**DFIR** — Digital Forensics & Incident Response — is the detective side of security. When something bad happens, DFIR practitioners find out **what happened, how, and how bad**. It's a high-status, high-skill discipline with strong demand and excellent job security.

### Two connected halves
- **Digital Forensics** — analysing evidence from systems (disks, memory, mobile, cloud) to reconstruct what occurred. Often for legal proceedings, so evidence handling matters.
- **Incident Response** — the operational side: containing an active attack, evicting the attacker, recovering systems.

They overlap heavily; most professionals do both.

### The incident response lifecycle
The industry-standard model (from NIST SP 800-61):

1. **Preparation** — before anything happens: playbooks, tooling, roles, tabletop exercises.
2. **Detection & Analysis** — what happened, when, how bad.
3. **Containment** — stop the bleeding without destroying evidence.
4. **Eradication** — remove the attacker's foothold, malware, and persistence.
5. **Recovery** — restore normal operations safely.
6. **Lessons Learned** — post-incident review; the improvement that pays off next time.

The steady discipline of following this cycle *without shortcuts* is what separates good IR from bad.

### The core forensic artefacts (Windows-heavy)
Real intruders leave traces. The classic ones:
- **Windows event logs** — Security, System, Application, and Sysmon logs record logins, service starts, process creates. Sysmon (from Sysinternals) is *the* free tool to install everywhere.
- **Registry hives** — `HKLM\Software\Microsoft\Windows\CurrentVersion\Run` (persistence), `USRCLASS.dat`, `NTUSER.dat`.
- **Prefetch (`C:\Windows\Prefetch\`)** — evidence of program execution.
- **Amcache / ShimCache** — additional execution evidence.
- **MFT ($MFT)** — the NTFS master file table; records every file, including deleted ones.
- **USN Journal** — file system change record.
- **Browser artefacts** — history, cache, downloads.
- **Memory (RAM)** — running processes, network connections, malware in-memory (invaluable — capture with **DumpIt**, **WinPmem**, or **AVML** on Linux).

Linux equivalents: `journalctl`, `/var/log/auth.log`, `.bash_history`, `/etc/cron*`, `/tmp` contents, mounted `/proc` info.

### Tools of the trade
- **Autopsy / Sleuth Kit** — free disk forensics GUI/CLI.
- **FTK Imager** — free tool for capturing forensic disk images.
- **Volatility** — legendary memory forensics framework.
- **Velociraptor / KAPE** — collect artefacts across many endpoints at once.
- **plaso / log2timeline** — build a "super timeline" combining artefacts.
- **timesketch** — collaborative timeline analysis.
- **Wireshark** — for pcap forensics.

### The chain of custody
If evidence might end up in court, how you handle it matters as much as what you find:
- **Hash** every piece of evidence at collection and again before analysis (proves integrity).
- **Document** who had it, when, and what they did.
- **Never work on originals** — always on verified copies.
- **Keep contemporaneous notes** — dated, signed, timestamped.

Even in non-legal incidents, these habits keep your investigations rigorous.

### Threat hunting
A closely related discipline: proactively looking for attackers who haven't triggered alerts *yet*. Uses hypotheses ("if an attacker were here, what would we see?") and searches logs and endpoints against those hypotheses. Combines forensics skill with SOC tooling.

### 🧪 Lab — Try DFIR for real
- **BlueTeamLabs Online (BTLO)** — investigation challenges with real disk images, pcaps, and memory dumps.
- **LetsDefend** — SOC and IR training with real-world scenarios.
- **CyberDefenders** — free blue-team CTFs.
- **DFIR Madness's "Case 001"** — a full case walkthrough with disk images.
- **Volatility Foundation's** memory samples — practise memory analysis with public samples.

### 🚩 Challenge
Which venerable free memory-forensics framework is the standard for analysing RAM captures?

<details><summary>Answer</summary>Volatility.</details>

### Key terms
- **DFIR** — Digital Forensics & Incident Response.
- **NIST 800-61** — the standard IR lifecycle.
- **Chain of custody** — the disciplined handling of evidence.
- **Sysmon / Volatility / Velociraptor / KAPE / plaso** — the core toolkit.
- **Threat hunting** — proactive search for attackers.

### Recap
- DFIR = detective work: find what happened and evict attackers.
- The lifecycle: Prepare → Detect → Contain → Eradicate → Recover → Learn.
- Windows event logs, registry, prefetch, MFT, and memory are the classic artefacts.
- Volatility, Autopsy, and Velociraptor cover the core tooling.
- BTLO, LetsDefend, and CyberDefenders are excellent free practice grounds.

---

## Lesson 11.8 — Advanced career paths & where to specialise

### Why this matters
You've now touched most of the specialisations that exist. Each of Lessons 11.1–11.7 is a career on its own; nobody is master of all. This closing lesson helps you *choose* wisely so your next years compound.

### The main advanced specialisations
- **Senior Pentester / Red Teamer** — deep AD, post-exploit, evasion. Big money.
- **AppSec Engineer / Bug Bounty Hunter** — depth in code, web, APIs.
- **Cloud Security Engineer / Architect** — multi-cloud, deep IAM, containers.
- **Malware Analyst / Reverse Engineer** — a rarer, prestigious speciality.
- **Threat Intel Analyst** — connects malware, attacker groups, campaigns.
- **DFIR / IR Consultant** — the on-call detective work; incident-heavy.
- **SOC Manager / Detection Engineer** — building detections, running blue teams.
- **Product Security Engineer** — security embedded in a product company (very well paid at big tech).
- **Security Researcher** — publishing, finding CVEs, speaking at DEF CON/BlackHat.

### Choosing a specialisation
Match your temperament, not the salary. Ask yourself:

- Do you like **breaking things creatively**? → offensive.
- Do you like **puzzles and evidence**? → DFIR or malware analysis.
- Do you like **building safe things**? → AppSec, cloud, or product security.
- Do you like **watching for badness**? → SOC / detection.
- Do you like **explaining and organising**? → GRC, management, consultancy.

You don't have to lock in yet — but by the time you have 3–4 years of general security experience, choosing one direction and going deep multiplies your value and pay.

### Signature certifications by track
- **Offensive:** OSCP → OSEP → CRTP/CRTO (AD) → OSWE (web).
- **AppSec:** BSCP (PortSwigger) → OSWE → Certifications from cloud providers.
- **Cloud:** AWS Security Specialty → Azure AZ-500 → Google Professional Cloud Security Engineer.
- **DFIR:** GCFE → GCFA → GNFA.
- **Blue/Threat:** GCIH → GCIA → GCTI.
- **Management:** CISSP → CISM.

Certifications *don't* make skills, but they open doors and structure learning.

### The one habit that beats everything
The people who become senior in security all share one habit: **they write about what they learn**, publicly. Blogs, GitHub, conference talks. Writing forces you to *understand*. Public writing builds a reputation that HR, hiring managers, and peers actively seek out.

Start now, at your current level. Your journey through this course is already interesting to someone starting a step behind you.

### Where next in the course
- **Path 12 — AI & AI Security (coming soon).** The freshest frontier. AI attacks a specialisation of tomorrow.

### 🚩 Challenge
Which "one habit" does this lesson claim beats every other for building a senior security career?

<details><summary>Answer</summary>Writing publicly about what you learn — blogs, GitHub, talks.</details>

### Recap
- The advanced specialisations are all their own careers; nobody masters all.
- Choose by temperament, not by salary — the depth years require it.
- Certifications structure a track; portfolios and writing win the interview.
- Public writing is the shared habit of every senior security professional.

---

## You've finished Path 11 🎉

You now have a serious map of the advanced field: Linux and Windows privesc, the full Active Directory attack surface, cloud (AWS/Azure/GCP), containers and Kubernetes, malware analysis, and DFIR. You've seen the specialisations that separate juniors from seniors, and a plan to pick one that fits *you*.

**Next up → `12-ai-security.md`:** the newest frontier — how large language models work, prompt injection, the OWASP Top 10 for LLMs, and AI red teaming. This is the specialisation of the coming decade.
