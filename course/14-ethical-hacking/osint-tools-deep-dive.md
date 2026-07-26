# OSINT Tools, Deep Dive

The recon lesson introduced OSINT tools like crt.sh and Shodan by name. This lesson goes deeper into the actual OSINT methodology and additional tools, directly connecting to Path 09's digital-footprint material from the opposite perspective — this time, you're the one doing the gathering.

## OSINT as reconnaissance, not just curiosity

**OSINT (Open Source Intelligence)** gathering is the systematic collection of publicly available information about a target — directly the professional, authorized application of the exact aggregation-risk concept Path 09 taught individuals to be wary of about their own digital footprint. Everything that made an individual's oversharing dangerous in Path 09 makes an organization's oversharing exploitable here.

## People-focused OSINT

- **Employee enumeration** — LinkedIn and company "About us" pages reveal employee names and roles, useful for both technical reconnaissance (guessing email address formats) and social engineering pretext development (covered in this path's dedicated lesson)
- **Metadata in published documents** — PDFs, Word documents, and images published by an organization frequently retain metadata (directly connecting to Path 19's EXIF CTF challenge) revealing internal usernames, software versions, and sometimes internal file paths
- **Breach data** — checking whether an organization's employee email addresses appear in known breaches (Have I Been Pwned, from Path 00) reveals potentially reused, exposed credentials worth testing during a later phase (with explicit RoE authorization, per the previous lesson)

## Infrastructure-focused OSINT

- **Certificate transparency logs** (crt.sh, from the recon lesson) — reveal every subdomain a certificate authority has ever issued a certificate for, often exposing internal or staging subdomains never meant to be publicly known
- **Shodan and Censys** — search engines indexing internet-connected devices and services, letting a researcher find an organization's exposed infrastructure without ever sending a single packet to the target directly
- **GitHub and code repository search** — searching for an organization's name or domain across public code repositories frequently reveals accidentally committed credentials or internal configuration details, directly connecting to Path 04's secure-coding lesson's warning about hardcoded secrets ending up in version control

## Google dorking, briefly formalized

Advanced search operators (`site:`, `filetype:`, `intitle:`) let a researcher find specific, sometimes sensitive content indexed by search engines that an organization never intended to be easily discoverable — genuinely one of the oldest OSINT techniques, still surprisingly effective against organizations that haven't reviewed what search engines have actually indexed about them.

## Why passive recon matters specifically

Every technique in this lesson is **passive** — gathering information without ever directly interacting with the target's own systems, meaning it typically requires no special authorization at all (it's already public), unlike the active scanning covered in the scan-and-enumerate lesson. This distinction genuinely matters for RoE scoping (from the previous lesson): passive OSINT often happens before formal authorization is even finalized, since it involves no direct interaction with the target whatsoever.

:::challenge Test yourself
Why might certificate transparency logs (crt.sh) reveal subdomains an organization never intended to be publicly discoverable?
<details><summary>Show answer</summary>Modern web browsers require publicly trusted TLS certificates (from Path 06) to be logged in public certificate transparency logs as a security measure, specifically so anyone can audit which certificates have been issued for which domains — a genuinely good security practice for detecting fraudulently issued certificates, but with a side effect: every subdomain that's ever had a certificate issued for it, including internal admin panels, staging environments, or forgotten legacy services never meant for public awareness, becomes permanently, publicly discoverable through these logs. An organization might believe <code>staging-admin.example.com</code> is obscure and effectively hidden simply because it's not linked from anywhere public, but the moment a certificate was issued for it, that assumption of obscurity was already false — exactly the kind of gap systematic OSINT recon is specifically designed to find.</details>
:::

## Key terms

- **OSINT (Open Source Intelligence)** — systematically gathering publicly available information about a target.
- **Passive reconnaissance** — gathering information without directly interacting with the target's own systems.
- **Google dorking** — using advanced search operators to find specific, sometimes unintentionally exposed content.

## Recap

- OSINT applies Path 09's aggregation-risk lesson from the attacker's authorized perspective, systematically gathering an organization's publicly discoverable exposure.
- People-focused OSINT (employee enumeration, document metadata, breach data) and infrastructure-focused OSINT (certificate transparency, Shodan, code repository search) cover the two major categories.
- Passive recon requires no direct target interaction and typically no special authorization, distinct from the active scanning covered in the next phase.

**Next up →** [Scanning & enumeration](#/lesson/14-ethical-hacking/scan-enumerate)
