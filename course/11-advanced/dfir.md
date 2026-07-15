# Digital forensics & incident response

Everything so far in this course has largely been offensive — finding and exploiting weaknesses. **DFIR** flips the perspective: when a real incident happens, how do you figure out exactly what occurred, contain it, and recover — while preserving evidence properly enough to support legal or insurance action if needed?

## What DFIR actually covers

**DFIR** combines two closely related disciplines:

- **Digital Forensics** — the rigorous, evidence-preserving process of examining digital systems to reconstruct what happened.
- **Incident Response (IR)** — the operational process of detecting, containing, eradicating, and recovering from a security incident.

```mermaid
flowchart LR
    Prep["1️⃣ Preparation"] --> Detect["2️⃣ Detection &<br/>Analysis"]
    Detect --> Contain["3️⃣ Containment"]
    Contain --> Eradicate["4️⃣ Eradication"]
    Eradicate --> Recover["5️⃣ Recovery"]
    Recover --> Lessons["6️⃣ Lessons Learned"]

    style Prep fill:#111927,color:#8496A6,stroke:#8496A6
    style Detect fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Contain fill:#2b1010,color:#E05548,stroke:#E05548
    style Eradicate fill:#2b1010,color:#E05548,stroke:#E05548
    style Recover fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style Lessons fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
```

This six-phase model (based on NIST's incident response framework) is the DFIR analogue of Path 09's five-phase penetration testing methodology — a repeatable, professional structure rather than ad-hoc firefighting.

## Phase 1: Preparation

Everything done **before** an incident occurs to make response actually possible:

- Logging properly configured and centralised (recall Path 08.5's SIEM concepts) — you cannot investigate what wasn't logged.
- An incident response plan, with clear roles and escalation paths, documented and rehearsed **before** a real crisis.
- Baseline system images/configurations documented, so "what's different from normal" can actually be determined.

## Phase 2: Detection & Analysis

Recognising that an incident is actually occurring — often via the SIEM alerts and correlation rules from Path 08.5, or an external notification (a customer report, a law enforcement tip, a bug bounty report per Path 10 revealing active exploitation).

### The forensic principle: preserve, then analyse — never the reverse

:::danger THE CARDINAL RULE OF DIGITAL FORENSICS
Never analyse original evidence directly — always work from a **verified forensic copy**, preserving the original completely untouched. Investigating directly on a live, compromised system risks altering timestamps, overwriting deleted-but-recoverable data, or destroying evidence needed for legal proceedings.
:::

```bash
# Creating a forensic disk image with proper integrity verification:
dd if=/dev/sdb of=evidence-image.dd bs=4M status=progress
sha256sum /dev/sdb > original-hash.txt
sha256sum evidence-image.dd > image-hash.txt
# Compare — they MUST match, proving the image is a perfect, unaltered copy
```

This hash-verification step directly echoes Path 03.6's file integrity lesson — here applied with legal, evidentiary weight. A mismatched hash means the image cannot be trusted as an accurate representation of the original evidence.

### Chain of custody

For any incident with potential legal consequences, a documented **chain of custody** records exactly who handled evidence, when, and what was done to it at every step — essential for evidence to remain admissible if a case ever goes to court, and generally good practice even when litigation isn't anticipated.

### Memory forensics

Live system memory (RAM) contains enormously valuable, entirely **volatile** evidence — running processes, network connections, encryption keys, and malware that may never touch disk at all (recall Path 06.4's "fileless malware" concept):

```bash
# Capturing memory for later analysis (must happen BEFORE shutting down
# a potentially-compromised system, since RAM contents are lost on power-off):
# Using tools like FTK Imager, WinPMEM, or LiME (Linux Memory Extractor)

# Analysing a memory capture with Volatility (the standard memory forensics framework):
volatility3 -f memory-dump.raw windows.pslist
volatility3 -f memory-dump.raw windows.netscan
```

**Volatility** lets you reconstruct running processes, network connections, and even extract injected malicious code directly from a memory image — often revealing far more than disk-based analysis alone, especially against sophisticated, memory-resident threats.

### Timeline analysis

Reconstructing **exactly** what happened, in order, across the incident:

```bash
# log2timeline/plaso — builds a unified, chronological timeline from
# many different log sources and filesystem metadata simultaneously:
log2timeline.py timeline.plaso /path/to/evidence-image.dd
psort.py -o l2tcsv -w timeline.csv timeline.plaso
```

A properly-built timeline directly answers the questions every stakeholder asks first: *when did the attacker first gain access? What did they do, and in what order? When were they finally contained?* — precisely mapping onto the kill chain concept from Path 06.3, now reconstructed from real evidence rather than theorised in the abstract.

## Phase 3: Containment

Stopping the incident from causing further damage, **while preserving evidence** wherever possible:

- **Short-term containment** — immediate isolation (network segmentation, Path 08.1's concept, applied urgently) to stop active damage without necessarily destroying evidence.
- **Long-term containment** — more thorough measures (rebuilding affected systems from clean images, rotating all potentially-compromised credentials) while a permanent fix is prepared.

For AD-specific incidents (Path 11.3), this is exactly where the **KRBTGT password rotation (twice)** becomes critical — without it, an attacker who's forged a Golden Ticket retains persistent access even after every other containment step.

## Phase 4: Eradication

Completely removing the attacker's presence — every backdoor, every persistence mechanism (recall Path 09.6's persistence concept, now from the defender's side), every malicious account created.

## Phase 5: Recovery

Restoring systems to normal operation, ideally from known-clean backups (Path 06.7's 3-2-1 backup rule proving its full value here), with enhanced monitoring during the recovery period specifically watching for any signs the attacker retained access despite eradication efforts.

## Phase 6: Lessons Learned

A genuinely critical, often-skipped final phase: a **blameless post-incident review** answering:

- How did the attacker actually get in? (Root cause, not just symptoms.)
- What detection gaps allowed this to go unnoticed for as long as it did?
- What specific, concrete changes will prevent a recurrence?

This feeds directly back into Phase 1's preparation for the *next* incident — DFIR is a continuous cycle, not a one-time linear process.

## Building your own DFIR practice environment

```bash
# SANS SIFT Workstation — a free, pre-configured Linux distribution
# with the full standard DFIR toolkit already installed:
# (Volatility, log2timeline/plaso, Autopsy, and more)

# Autopsy — a free, GUI-based digital forensics platform, good starting
# point for disk image analysis specifically:
autopsy
```

## 🧪 Lab — A mini incident timeline exercise

Using your Kali VM (treating it as a hypothetical "compromised" system from your earlier Path 09/11 labs):

1. Review your own bash history, auth logs, and any files created during previous labs in this course:
```bash
cat ~/.bash_history
sudo cat /var/log/auth.log 2>/dev/null || sudo journalctl -u ssh
find / -newer /etc/hostname -type f 2>/dev/null | head -50
```
2. Attempt to reconstruct a rough timeline: when did you first gain a foothold in your Metasploitable labs (Path 09.5)? What commands did you run afterward, in what order?
3. Write a short "incident summary" as if this were a genuine investigation — what happened, when, and what containment/eradication steps would you recommend if this had been a real, unauthorized compromise.

This exercise — looking at your **own** prior lab activity through a forensic investigator's lens — is a genuinely effective way to internalise how much (or how little) evidence ordinary system usage leaves behind, directly informing both your offensive OPSEC awareness and your defensive logging priorities going forward.

:::challenge Test yourself
Why must a forensic investigator always work from a verified disk image copy rather than analysing the original, potentially-compromised system directly?

<details><summary>Show answer</summary>Analysing a live system directly risks <strong>altering evidence</strong> — accessing files changes their access timestamps, running additional processes could overwrite deleted-but-recoverable data in unallocated disk space, and any interaction with a potentially still-active attacker's tooling could trigger anti-forensic or destructive behaviour. Working from a <strong>hash-verified copy</strong> preserves the original completely untouched, ensuring the evidence remains both accurate and legally admissible if the incident ever leads to legal or insurance proceedings, while still allowing thorough, even destructive, analysis techniques on the copy itself.</details>
:::

## Key terms

- **DFIR** — Digital Forensics and Incident Response, combining evidence-preservation with operational incident handling.
- **Chain of custody** — documented record of who handled evidence and when, essential for legal admissibility.
- **Memory forensics / Volatility** — analysing volatile RAM contents, revealing evidence that never touches disk.
- **Timeline analysis / log2timeline** — reconstructing chronological incident events from multiple log sources.
- **IOC (Indicator of Compromise)** — revisited from Path 11.6, the artifacts extracted during DFIR feeding detection efforts elsewhere.

## Recap

- DFIR's six-phase model (preparation through lessons learned) mirrors Path 09's methodology, applied to defensive incident handling.
- The cardinal forensic principle: always work from a verified, hash-matched copy, never the original evidence directly.
- Memory forensics (Volatility) reveals volatile evidence, especially critical against fileless/memory-resident threats.
- Containment must balance stopping active damage against preserving evidence for later analysis.
- The lessons-learned phase closes the loop, feeding directly back into improved preparation for future incidents.

???refs
- [NIST SP 800-61 — Computer Security Incident Handling Guide](https://csrc.nist.gov/pubs/sp/800/61/r2/final) — the official US six-phase framework referenced throughout this lesson.
- [Volatility Foundation](https://volatilityfoundation.org/) — the standard memory forensics framework.
- [SANS SIFT Workstation](https://www.sans.org/tools/sift-workstation/) — a free, pre-configured DFIR toolkit distribution.
- [Autopsy](https://www.autopsy.com/) — free, GUI-based digital forensics platform.
???

**Next up →** [Choosing your specialisation](#/lesson/11-advanced/specialise)
