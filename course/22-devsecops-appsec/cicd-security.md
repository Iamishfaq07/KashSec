# Securing the CI/CD Pipeline

The pipeline that builds and deploys your software is itself a high-value target. If an attacker can run code in CI, they can often reach secrets, production, or every developer.

## Why pipelines matter

- They hold cloud credentials, API keys, and signing keys
- They can push code or artifacts to production
- A compromised pipeline is a supply-chain attack

## Common CI/CD risks

1. **Secrets in plaintext** in pipeline YAML or environment variables visible in logs
2. **Over-privileged tokens** (e.g. GitHub `write` on all repos)
3. **Untrusted code execution** — pull requests from forks running privileged workflows
4. **Mutable third-party actions** (`uses: some/action@main` instead of a pinned SHA)
5. **No isolation** between build jobs of different trust levels
6. **Artifact tampering** — no signing or verification of what gets deployed

## Hardening checklist

### Secrets

- Store secrets in a proper secret manager (GitHub Secrets, Vault, cloud secret managers)
- Never echo secrets in logs
- Prefer short-lived, OIDC-based cloud credentials over long-lived access keys

### Least privilege

- Give each workflow the minimum permissions it needs (`permissions:` in GitHub Actions)
- Separate build and deploy roles

### Trust boundaries

- Do not run privileged workflows on `pull_request_target` with untrusted code
- Pin third-party actions to full commit SHAs
- Review and vendor critical actions when possible

### Integrity

- Sign artifacts (Sigstore / cosign, etc.)
- Verify signatures before deploy
- Use immutable, digested image references

### Visibility

- Log and monitor pipeline runs
- Alert on unusual workflow changes or secret access

:::danger
A single over-privileged `GITHUB_TOKEN` or cloud key in CI has caused multiple real-world breaches. Treat pipeline credentials like production credentials.
:::

## Key terms

- **OIDC federation** — exchanging a short-lived pipeline identity for cloud credentials
- **Pinned action** — referencing a GitHub Action by commit SHA, not a moving tag
- **Artifact signing** — cryptographic proof of who built a binary/image

## Recap

Secure pipelines are a prerequisite for secure software delivery. Apply least privilege, pin dependencies, keep secrets out of logs, and monitor the pipeline itself.

???refs
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [SLSA framework](https://slsa.dev/)
???