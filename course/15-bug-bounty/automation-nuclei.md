# Automation with Nuclei

Path 15.3's pipeline introduced Nuclei as one stage among many. This lesson goes deep specifically on Nuclei — writing custom templates, understanding template categories properly, and integrating findings cleanly into your reporting workflow from Path 15.4.

## Why Nuclei specifically deserves deeper study

Unlike most scanners, Nuclei's entire detection logic is defined in **readable, editable YAML templates** — not compiled, closed-source scanning logic. This means you can read exactly what any check does, and more importantly, **write your own** the moment you discover a new vulnerability pattern worth checking for at scale across your entire target list.

## Anatomy of a Nuclei template

```yaml
id: exposed-env-file

info:
  name: Exposed .env File
  author: kashsec
  severity: high
  description: >
    Detects publicly accessible .env files which commonly contain
    database credentials, API keys, and other secrets.
  tags: exposure,config,env

http:
  - method: GET
    path:
      - "{{BaseURL}}/.env"

    matchers:
      - type: dsl
        dsl:
          - "status_code == 200"
          - "contains(body, 'DB_PASSWORD') || contains(body, 'API_KEY') || contains(body, 'SECRET')"
        condition: and
```

```bash
# Run this single custom template against your target list:
nuclei -l live-hosts.txt -t exposed-env-file.yaml
```

Breaking this down:

- **`info`** — metadata: name, severity, description, tags. This is what appears in your scan output and eventual report.
- **`http`** — the actual check: which path(s) to request.
- **`matchers`** — the logic determining a genuine "hit." Here, using Nuclei's **DSL (Domain Specific Language)** to combine two conditions: a 200 status code AND the response body containing telltale secret-related strings.

## Writing a template for something you found manually

The real power: once you manually discover a vulnerability pattern (say, an exposed admin panel at a specific path that a client's dev team apparently forgets to remove across many of their subdomains), **codify it** as a template and sweep your *entire* target list for the same pattern instantly:

```yaml
id: exposed-admin-panel-custom

info:
  name: Custom Exposed Admin Panel Pattern
  author: kashsec
  severity: medium
  tags: exposure,panel,custom

http:
  - method: GET
    path:
      - "{{BaseURL}}/internal-admin-v2/"
      - "{{BaseURL}}/admin-legacy/"
      - "{{BaseURL}}/_internal/dashboard"

    matchers:
      - type: word
        words:
          - "Internal Dashboard"
          - "Employee Portal"
        part: body
```

```bash
nuclei -l all-subdomains.txt -t exposed-admin-panel-custom.yaml -severity medium
```

This is precisely the workflow that turns a single lucky manual discovery into **repeatable, scalable coverage** across every asset in scope — a genuine force multiplier that separates systematic hunters from one-off luck.

## Understanding template categories properly

```bash
# The official template repository is organised by category:
ls ~/nuclei-templates/
# cves/           — checks for specific, named CVEs
# exposures/      — exposed configs, panels, files, tokens
# misconfiguration/ — general security misconfigurations
# vulnerabilities/ — broader vulnerability classes (SSRF, XSS patterns, etc.)
# takeovers/      — subdomain takeover detection (see below)
# default-logins/ — checks for unchanged default credentials
```

### CVE-specific templates — matching Path 14.4's searchsploit workflow

```bash
# Run only CVE templates, cross-referencing your tech-fingerprinted targets:
nuclei -l live-hosts.txt -t cves/ -severity high,critical
```

This directly parallels Path 14.4's `searchsploit` cross-referencing technique, just automated across your entire live-host list rather than checked one service at a time manually.

### Subdomain takeover — a distinct, high-value Nuclei use case

**Subdomain takeover** happens when a subdomain's DNS record (a CNAME) points to a third-party service (like a cloud storage bucket, a hosting platform, or a SaaS tool) that's since been **deprovisioned** — but the DNS record was never cleaned up. An attacker can then claim that same resource on the third-party service themselves, effectively taking control of the organisation's own subdomain.

```bash
nuclei -l all-subdomains.txt -t takeovers/ -severity medium,high
```

```
Example: staging-old.example.com  CNAME  →  some-app.herokuapp.com
         (but the Heroku app was deleted months ago)
         Attacker registers "some-app" on Heroku themselves →
         staging-old.example.com now serves THE ATTACKER'S content
```

Subdomain takeovers are a genuinely popular, high-reward finding category precisely because they're so mechanically detectable (a specific DNS/response pattern) yet frequently missed by organisations managing large numbers of subdomains over time — exactly the kind of "stale infrastructure" finding a broad-scope, wildcard program (Path 15.2) makes newly discoverable.

## Integrating Nuclei output into your reporting workflow

```python
#!/usr/bin/env python3
"""
nuclei-to-report.py — Parse Nuclei's JSON output and generate
draft report skeletons for each finding, following Path 15.4's structure.
"""
import json

def load_findings(path: str) -> list[dict]:
    findings = []
    with open(path) as f:
        for line in f:
            if line.strip():
                findings.append(json.loads(line))
    return findings

def draft_report(finding: dict) -> str:
    info = finding.get("info", {})
    return f"""
## Title
{info.get('name', 'Untitled finding')}

## Summary
Detected via automated scanning at: {finding.get('matched-at', 'unknown URL')}
Severity: {info.get('severity', 'unknown')}
Tags: {', '.join(info.get('tags', []))}

## Steps to Reproduce
1. Send a request to: {finding.get('matched-at', '')}
2. Observe: {info.get('description', 'See template logic for match conditions')}

## Suggested Fix
(Manually add specific remediation guidance based on the finding type)
"""

def main():
    findings = load_findings("nuclei-results.jsonl")
    for i, finding in enumerate(findings):
        report = draft_report(finding)
        with open(f"draft-report-{i}.md", "w") as out:
            out.write(report)
    print(f"[+] Drafted {len(findings)} report skeletons")

if __name__ == "__main__":
    main()
```

```bash
nuclei -l live-hosts.txt -t cves/,exposures/ -jsonl -o nuclei-results.jsonl
python3 nuclei-to-report.py
```

This is a direct, practical extension of Path 04's Python automation skills — turning raw scanner output into **draft report skeletons**, ready for you to manually verify (never submit an unverified automated finding, per Path 15.4's warning), add a proper PoC, and refine before submission.

## Critical discipline: automated findings still require manual verification

:::danger NEVER SUBMIT UNVERIFIED SCANNER OUTPUT
Recall Path 15.4's explicit warning against "spamming low-quality/automated-scanner output." Nuclei is a phenomenal **discovery** tool but produces false positives, and even true positives often need manual investigation to determine *actual* exploitability and impact before they're submission-ready. Always manually verify every automated finding — confirm it with Burp, understand the real impact, and write a proper PoC — before ever submitting it as a report.
:::

## Detecting blind vulnerabilities with Interactsh

Nuclei's built-in **Interactsh** integration extends its detection well beyond simple response-matching, directly addressing the blind SSRF and blind command injection scenarios from Path 11's lessons. Rather than checking a response body for a specific string, a template can inject a unique, per-scan callback URL into a request and then watch a free, hosted out-of-band service for any resulting DNS or HTTP interaction — proving execution happened even when the vulnerable response never shows any visible sign of it:

```yaml
id: blind-ssrf-check
info:
  name: Blind SSRF via webhook parameter
  severity: high
http:
  - method: POST
    path:
      - "{{BaseURL}}/api/webhook-test"
    body: '{"url": "http://{{interactsh-url}}"}'
    matchers:
      - type: word
        part: interactsh_protocol
        words:
          - "http"
```

This is the exact same detection principle as manually setting up a Burp Collaborator listener (Path 14's advanced exploitation lab) — just automated and scalable across an entire target list rather than one manual check at a time, making it possible to sweep hundreds of endpoints for blind vulnerabilities that would otherwise require painstaking one-by-one manual confirmation.

## Keeping your template library updated

```bash
# Update the official community template repository regularly —
# new templates are added constantly as new vulnerability patterns emerge:
nuclei -update-templates

# Check what's new since your last update:
nuclei -tl | wc -l    # count total available templates
```

## 🧪 Lab — Write and deploy your own custom template

1. Recall any manual finding pattern you've noticed across your labs so far in this course (an exposed `.git/` directory, a specific error page pattern, a default login page).
2. Write a Nuclei YAML template detecting that exact pattern, following the structure shown in this lesson.
3. Test it against `testphp.vulnweb.com` or your own lab environment first to confirm it works as expected, with no false positives.
4. If you have access to your shortlisted program's in-scope assets (Path 15.2), run your custom template across the full live-host list generated by Path 15.3's pipeline.

Building even one working custom template is a genuinely significant milestone — it demonstrates you understand detection logic deeply enough to codify it yourself, not just run tools others have built.

:::challenge Test yourself
A Nuclei scan flags a "high severity" finding on one of your targets. What's the correct next step before drafting a bug bounty submission?

<details><summary>Show answer</summary><strong>Manually verify the finding first.</strong> Confirm the vulnerability is genuinely exploitable (not a false positive), understand its actual real-world impact on this specific target, and construct a proper, concrete Proof of Concept (per Path 15.4's guidance) — never submit raw automated scanner output directly as a report. Automated tools are discovery aids, not submission-ready evidence on their own.</details>
:::

## Key terms

- **Nuclei template** — a YAML-defined detection check specifying request logic and match conditions.
- **DSL (Domain Specific Language)** — Nuclei's expression syntax for combining match conditions.
- **Subdomain takeover** — claiming control of a subdomain via a stale DNS record pointing to a deprovisioned third-party service.
- **Template categories** — cves/, exposures/, misconfiguration/, vulnerabilities/, takeovers/, default-logins/.

## Recap

- Nuclei's open, readable YAML templates let you codify manually-discovered patterns into scalable, repeatable checks.
- Template categories map directly onto different discovery goals — CVE matching, exposure detection, subdomain takeovers.
- Subdomain takeover is a mechanically detectable, high-reward finding category well-suited to broad wildcard scopes.
- Integrating Nuclei's JSON output into Python-based report drafting (Path 04's skills) streamlines the workflow from discovery to submission.
- Every automated finding requires manual verification before submission — Nuclei accelerates discovery, not final validation.

???refs
- [Nuclei official documentation](https://docs.projectdiscovery.io/tools/nuclei/overview) — comprehensive template writing guide.
- [Nuclei Templates repository](https://github.com/projectdiscovery/nuclei-templates) — the full community template library.
- [Can I Take Over XYZ?](https://github.com/EdOverflow/can-i-take-over-xyz) — the definitive reference for subdomain takeover patterns by service provider.
- [ProjectDiscovery — Nuclei template writing guide](https://docs.projectdiscovery.io/templates/introduction) — official deep-dive documentation.
???

**Next up →** [Mobile & API bug bounty](#/lesson/15-bug-bounty/mobile-and-api-bb)
