# Privilege Escalation Methodology

Path 07's Windows privesc-intro lesson and Path 03's Linux privesc coverage each taught platform-specific technique categories. This lesson pulls back to the methodology level — the systematic *process* for finding a privilege escalation path on any system, tying both platforms' specific techniques into one repeatable approach.

## Why methodology matters more than memorizing techniques

A genuinely important shift in thinking: rather than memorizing every specific privesc technique in isolation, a systematic **enumeration-first** methodology finds the actual applicable path on any given system — since which specific technique applies depends entirely on that system's particular misconfigurations, not on a fixed checklist that happens to work everywhere.

## The enumeration-first principle

Before attempting any specific escalation technique, thorough enumeration answers: what's actually running, what permissions does the current user actually have, what's misconfigured on *this specific system*. This directly extends Path 03's `sudo -l` and SUID-search examples into a genuinely systematic first step, rather than isolated tips.

## Automated enumeration tools

- **LinPEAS** (Linux) — automates dozens of the manual checks Path 03's privesc content described (SUID binaries, sudo misconfigurations, writable cron jobs, kernel version), producing a color-coded report highlighting the most promising findings
- **WinPEAS** (Windows) — the direct Windows equivalent, automating checks across services, registry permissions, and scheduled tasks, extending Path 07's privesc-intro material into automated practice
- **PowerUp / Seatbelt** — additional Windows-specific enumeration and situational-awareness tools, commonly used alongside WinPEAS

## Why automated tools don't replace understanding

Directly echoing this path's own vulnerability-scanning-tools lesson: LinPEAS and WinPEAS surface *candidates* — potential privesc paths worth investigating — but understanding *why* each flagged finding actually represents a viable escalation path (exactly the reasoning Path 03's SUID-Python example and Path 07's service-permission example walked through) remains genuinely necessary, since not every flagged item is actually exploitable in every specific context.

## A repeatable methodology, tying it together

1. **System and user enumeration** — what OS/version, what user, what groups, what's already known
2. **Automated scanning** — run LinPEAS/WinPEAS as a broad first pass
3. **Manual verification of promising findings** — confirm a flagged item is genuinely exploitable in this specific context, not just theoretically interesting
4. **Exploitation** — apply the specific technique (from Path 03's or Path 07's technique catalogs) that the enumeration actually surfaced
5. **Re-enumeration at the new privilege level** — privilege escalation is often not a single jump but several smaller steps, each opening up new enumeration possibilities

:::challenge Test yourself
Why does this lesson emphasize "enumeration-first methodology" over memorizing a fixed list of privesc techniques?
<details><summary>Show answer</summary>Which specific privilege escalation technique actually works on a given system depends entirely on that system's own particular misconfigurations — a system with no SUID misconfigurations at all makes the SUID-based techniques from Path 03 completely irrelevant, while a different system might have exactly that gap wide open. Memorizing a fixed technique list without a systematic way to determine which techniques might actually apply to a specific target leaves a tester guessing randomly, trying techniques that may have no relevance at all to the system in front of them. A genuine enumeration-first methodology instead systematically surfaces what's actually present and potentially exploitable on <em>this specific system</em>, then applies the relevant technique from the broader catalog this path has taught — turning privilege escalation from "trying things and hoping" into a structured, evidence-driven process that adapts to whatever the actual target presents.</details>
:::

## Key terms

- **Enumeration-first methodology** — systematically discovering a system's actual configuration and permissions before attempting any specific privilege escalation technique.
- **LinPEAS / WinPEAS** — automated enumeration tools surfacing candidate privilege escalation paths on Linux and Windows respectively.

## Recap

- A systematic, enumeration-first methodology finds the actual applicable privesc path on any given system, rather than relying on memorized techniques that may not apply.
- LinPEAS and WinPEAS automate broad enumeration, but manual verification of what's actually exploitable in context remains genuinely necessary.
- Privilege escalation is often several smaller steps rather than one jump, with re-enumeration at each new privilege level revealing further opportunities.

**Next up →** [Lateral Movement Techniques](#/lesson/14-ethical-hacking/lateral-movement-techniques)
