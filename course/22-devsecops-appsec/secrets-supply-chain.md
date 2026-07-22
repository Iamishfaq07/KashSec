# Secrets Management & Software Supply Chain

Two of the most common ways organisations get breached today: leaked secrets and compromised dependencies.

## Secrets

### Where secrets leak

- Source code and commit history
- CI logs and pipeline definitions
- Container images and layers
- Chat, tickets, screenshots
- Client-side JavaScript and mobile apps

### Prevention

1. **Pre-commit / pre-receive scanning** (gitleaks, trufflehog, GitHub secret scanning)
2. **Central secret stores** with short-lived credentials and audit logs
3. **Never commit secrets** — use environment injection or volume mounts at runtime
4. **Rotate** immediately when a leak is detected

### Detection

- Enable secret scanning on every repository
- Monitor public GitHub for your organisation's tokens (GitHub has native support)
- Treat every leaked cloud key as a production incident

## Software supply chain

Your application is mostly other people's code. That code can be:

- Accidentally vulnerable (known CVEs)
- Intentionally malicious (typosquatting, compromised maintainer accounts)
- Hijacked at build time (dependency confusion, compromised CI)

### Practical controls

| Control | Purpose |
|---------|--------|
| SCA (Dependabot, Snyk, etc.) | Known vulnerabilities in dependencies |
| Lockfiles + integrity hashes | Reproducible, tamper-evident installs |
| Private package mirrors / allow-lists | Reduce exposure to public registry attacks |
| Signed commits & protected branches | Protect the source of truth |
| Artifact signing & verification | Ensure what you deploy is what you built |
| SLSA / provenance | Prove how an artifact was produced |

### Dependency confusion

If your internal package is named the same as a public one, some package managers prefer the public version. Attackers register the public name and wait. Use scoped packages and registry configuration to prevent this.

:::lab
Enable Dependabot or equivalent on a real repository. Triage the first week of alerts — you will quickly see which ones are reachable and which are noise.
:::

## Key terms

- **Secret scanning** — automated detection of credentials in code and history
- **Typosquatting** — publishing a malicious package with a name close to a popular one
- **Provenance** — metadata that describes how an artifact was built

## Recap

Treat secrets as production credentials from the moment they are created. Treat every dependency as code you are responsible for. Automation + least privilege + rapid rotation are the practical defences.

???refs
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [SLSA](https://slsa.dev/)
???