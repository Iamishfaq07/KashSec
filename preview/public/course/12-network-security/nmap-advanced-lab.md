# Advanced Nmap Lab

Nmap's basics get you a list of open ports. This lab pushes into the details that turn a scan into genuinely useful reconnaissance — the difference between "port 80 is open" and "port 80 is running Apache 2.4.41 with a known CVE," which is the level of detail real assessments need.

## Lab environment

Use your own Kali VM against a local vulnerable target (Metasploitable 2, referenced throughout this course, is ideal) on host-only networking, or an online lab platform like TryHackMe/Hack The Box Academy that provides legal scan targets.

## Tasks

1. **Compare a full TCP connect scan against a SYN scan.**
   ```bash
   nmap -sT target        # full TCP connect scan (completes the full handshake)
   sudo nmap -sS target   # SYN scan (the "half-open" scan, needs root)
   ```
   Time both, and note that `-sS` is generally faster and stealthier — it never completes the TCP handshake covered in Path 02, meaning many logging systems (which only log fully-established connections) never record it, unlike `-sT`.
2. **Use service version detection and OS detection.**
   ```bash
   nmap -sV -O target
   ```
   `-sV` doesn't just report "port 22 is open" — it actively probes to identify *which* service and version is listening (`OpenSSH 7.6p1`, for instance), which is exactly the information you'd then cross-reference against known CVE databases. `-O` attempts to fingerprint the underlying operating system based on subtle differences in how different OS network stacks respond.
3. **Run NSE scripts for vulnerability scanning.** Nmap's Scripting Engine (NSE) includes hundreds of community-written scripts, including many specifically for vulnerability detection:
   ```bash
   nmap --script vuln target
   ```
   This can take a while but often directly flags known vulnerabilities by name — a huge time-saver compared to manually cross-referencing every service version by hand.
4. **Scan a range and export results.**
   ```bash
   nmap -sV -oA full_scan 192.168.1.0/24
   ```
   The `-oA` flag saves output in all three formats simultaneously (normal, XML, and grepable) — the XML format in particular is what many other tools (including some vulnerability scanners) expect as input, making it the standard "handoff" format between recon and later analysis stages.

5. **Cross-reference a found service version against a real CVE database.** Take one specific service+version Nmap identified in task 2 (say, an older OpenSSH or Apache version) and manually search the [NVD (National Vulnerability Database)](https://nvd.nist.gov/) or `searchsploit` on Kali for known CVEs affecting that exact version:
   ```bash
   searchsploit apache 2.4.41
   ```
   This is the manual step NSE's `--script vuln` scripts automate for you — doing it by hand once, deliberately, builds a real understanding of what that automation is actually doing under the hood, and how CVE/CVSS (Path 10.2) connect to a specific line in your scan output.

:::tip Always start broad, then narrow
A common, efficient real-world pattern: run a fast scan across all 65,535 ports first (`nmap -p- target`) just to see what's open, *then* run a slower, more detailed `-sV -O --script vuln` scan against only those specific open ports. Scanning all ports with full detail from the start wastes enormous time on the 65,000+ ports that turn out to be closed.
:::

:::challenge Write a scan report
Run a full scan against your lab target and write a short report: every open port found, the service and version on each, any flagged vulnerabilities from the NSE script scan, and — for the single most concerning finding — a brief explanation of the real-world risk it represents.
:::

## Key takeaway

Nmap's real power isn't the initial port list — it's version detection and NSE scripting turning "here's what's open" into "here's specifically what's running and what's known-vulnerable about it," which is the actual information a real assessment needs to prioritize next steps.

**Next up →** [Advanced Wireshark Lab](#/lesson/12-network-security/wireshark-advanced-lab)
