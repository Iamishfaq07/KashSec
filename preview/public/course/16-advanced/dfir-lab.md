# Digital Forensics & IR Lab

The DFIR lesson covered the theory — NIST 800-61's phases, the tools of the trade. This lab gets you actually reconstructing an incident timeline from real artifacts, which is the core skill the job is built on.

## Recommended tools

- **[Volatility 3](https://github.com/volatilityfoundation/volatility3)** — free, industry-standard memory forensics framework.
- **[Autopsy](https://www.autopsy.com/)** — free, GUI-based disk forensics platform (built on The Sleuth Kit).
- A **sample memory image** — Volatility's own repo and several public forensics training sites host free, legal sample memory dumps specifically for practice (search "Volatility sample memory image" for current CTF-style practice files).

## Tasks

1. **Analyze a memory dump for suspicious processes.** Using Volatility 3, run a process listing against a sample image:
   ```bash
   vol -f memory.dmp windows.pslist
   ```
   Look for anything that doesn't belong: a process with a misspelled name mimicking a real system process (`scvhost.exe` instead of `svchost.exe`), a process running from an unusual path (`C:\Users\Public\` instead of `C:\Windows\System32\`), or a parent-child relationship that doesn't make sense (e.g., `cmd.exe` spawned by `outlook.exe`).
2. **Pull network connections from memory.** Still in Volatility:
   ```bash
   vol -f memory.dmp windows.netscan
   ```
   Cross-reference any suspicious external IPs against process names from Task 1 — malware often maintains an active connection back to infrastructure controlled by the attacker (command-and-control).
3. **Examine a disk image for deleted files or artifacts.** Load a sample disk image into Autopsy and use its deleted-files recovery feature — deleted doesn't mean gone; file system metadata often persists long after a file is "deleted," which is exactly why forensic recovery works.
4. **Reconstruct a timeline.** Using whatever timestamps you've gathered across memory and disk artifacts (process creation times, file modification times, network connection times), build a simple chronological table: what happened, in what order. This timeline *is* the actual deliverable of most real forensic investigations.

5. **Extract IOCs and check them against threat intel.** From your Task 1/2 findings, pull out the suspicious process name, file path, and any external IPs into a simple list, then check each IP against a free reputation source like [AbuseIPDB](https://www.abuseipdb.com/) or VirusTotal (Path 16.6's tool, applied here to network indicators instead of files). Confirming an IOC against external threat intelligence, rather than relying purely on "this looks weird," is exactly the extra verification step that turns a hunch into a defensible finding.

:::tip Work from a copy, always
Real forensic practice never analyzes evidence directly — always work from a verified copy (in a real investigation, verified with a cryptographic hash to prove it wasn't altered) and preserve the original untouched. This "forensic soundness" principle matters even in lab practice, because building the habit now prevents a career-ending mistake later.
:::

:::challenge Write it up as a real incident report
Using your findings from all four tasks, write a short incident report with the sections used throughout Path 14's Reporting lesson: **Executive Summary**, **Timeline**, **Indicators of Compromise (IOCs)** found (suspicious process names, IPs, file paths), and **Recommendations**. This is exactly the artifact a real DFIR engagement produces for stakeholders.
:::

## Key takeaway

Forensics is fundamentally about **reconstructing a story from fragments** — no single artifact (a process list, a network connection, a deleted file) tells the whole story alone, but correlating several together, in the right order, does. That correlation skill is what separates a junior analyst running tools from a senior investigator who can actually explain what happened.

**Next up →** [Malware Analysis Lab](#/lesson/16-advanced/malware-analysis-lab)
