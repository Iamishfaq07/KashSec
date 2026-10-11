# Practical Reconnaissance Lab

Reconnaissance is where every real engagement actually begins — this lab practices the OSINT (Open-Source Intelligence) techniques covered in the main Phase 1 lesson, using free tools that professionals rely on daily.

## Tools to use

- **Google dorks** — advanced search operators (`site:`, `filetype:`, `intitle:`) that surface publicly indexed information most people never think to search for directly.
- **[Shodan](https://www.shodan.io/)** — a search engine for internet-connected devices and services, not web pages; free tier available.
- **[theHarvester](https://github.com/laramies/theHarvester)** — a free tool that automates gathering emails, subdomains, and names from public sources.
- **Maltego Community Edition** — free graphical OSINT tool for visually mapping relationships between people, domains, and infrastructure.

## Lab tasks

1. **Find public information about a company.** Use a fictional company, your own test domain, or a real organization that publishes a public bug bounty scope (never target a real company without explicit authorization). Try Google dorks like:
   ```
   site:example.com filetype:pdf
   site:example.com intitle:"index of"
   site:linkedin.com "example.com" "security engineer"
   ```
   Each of these surfaces a different category of information — exposed documents, misconfigured directory listings, and employee/org structure, respectively.
2. **Discover subdomains of a target.** Run theHarvester against your target domain:
   ```bash
   theHarvester -d example.com -b all
   ```
   Cross-reference results against `crt.sh` (certificate transparency logs, referenced throughout Path 14's recon lesson) for a second, independent subdomain source — combining multiple sources typically finds more than any single tool alone.
3. **Check for leaked credentials, ethically.** Use [Have I Been Pwned](https://haveibeenpwned.com/) to check whether email addresses associated with your target domain have appeared in known public breaches — a legitimate, widely used reconnaissance step that requires no special access, only public breach data.
4. **Try Shodan on your own infrastructure only.** Search Shodan for a service or IP you own or explicitly control (never someone else's) to see exactly what information is publicly visible about it — banner information, open ports, sometimes even default login pages, all indexed and searchable by anyone.

5. **Search public code repositories for leaked artifacts.** Using your chosen target's organisation name, search GitHub directly for repositories that might belong to employees or the company itself, looking specifically for configuration files, internal documentation, or accidentally-committed credentials — the same technique covered in the main Phase 1 lesson's GitHub reconnaissance section, practiced hands-on here. Note how much of this is simply knowing *where* to look rather than needing any special tooling at all.

:::warn Passive recon only, and only against authorized targets
Every technique in this lab is passive — querying public data sources, not touching the target directly — which keeps it legal and safe even during genuine reconnaissance practice. Still, only run these against a domain you own, a fictional test domain, or a real organization with an explicit, current bug bounty program covering this kind of activity.
:::

:::challenge Document a mini recon report
Pick one target (your own domain is the safest choice) and produce a short report: what subdomains you found, what public documents or exposed information turned up via Google dorking, and — for one specific finding — why it matters from a security perspective (e.g., "an exposed internal wiki subdomain suggests weak access controls on non-production infrastructure").
:::

## Key takeaway

The vast majority of useful reconnaissance information is entirely public and requires no exploitation at all — just knowing where to look and how to search effectively. This is exactly why OSINT is Phase 1 of every real methodology: it's low-risk, often surprisingly high-yield, and shapes every decision made in the phases that follow.

**Next up →** [Reporting Lab](#/lesson/14-ethical-hacking/reporting-lab)
