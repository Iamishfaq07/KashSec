# Secrets Management & Software Supply Chain

Two of the most common ways organisations get breached today: leaked secrets and compromised dependencies. Neither requires an attacker to find a bug in your code — both let them walk in through a door your own tooling left open.

:::tip
A useful mental model: a secret is a credential, and once it has touched a place you don't fully control — a public repo, a chat log, a screenshot — treat it as compromised, not "probably fine." Rotation is cheap. Guessing wrong is not.
:::

## Secrets

### Where secrets leak

- Source code and commit history — deleting a secret in a later commit does **not** remove it from history; anyone can `git log -p` and find it
- CI logs and pipeline definitions — a `curl` command with a token in the URL, printed to a public build log
- Container images and layers — a secret set as an `ENV` in an early Docker layer stays in the image even if a later layer removes the file
- Chat, tickets, screenshots — "quickly pasting the API key into Slack so you can test it" is one of the most common leak paths, and the hardest to scan for
- Client-side JavaScript and mobile apps — anything shipped to a browser or a phone is, functionally, public

:::warn
Container image layers are append-only from a history standpoint. `RUN echo $SECRET > /tmp/s.txt` followed by `RUN rm /tmp/s.txt` in a later layer does not remove the secret — it's still sitting in the earlier layer, extractable with `docker history` or by pulling the image and inspecting layers directly.
:::

### Prevention

1. **Pre-commit / pre-receive scanning** (gitleaks, trufflehog, GitHub secret scanning) — catch the secret before it's committed, not after
2. **Central secret stores** with short-lived credentials and audit logs — a vault that issues a token good for one hour is far less valuable to steal than one good forever
3. **Never commit secrets** — use environment injection or volume mounts at runtime instead of baking values into files or images
4. **Rotate** immediately when a leak is detected — not "when convenient." A leaked key is a live incident from the moment of exposure, whether or not you've seen evidence of misuse yet

### Detection

- Enable secret scanning on every repository, including private ones — "private" is not "safe," and private repos get made public by accident more often than people expect
- Monitor public GitHub for your organisation's tokens (GitHub has native support that scans public repos for recognizable token formats from major providers and notifies the provider directly)
- Treat every leaked cloud key as a production incident: rotate it, check access logs for the period it was exposed, and only then investigate root cause

## A worked example

A developer commits a `.env` file containing a database password to a public fork by accident, then deletes it two minutes later in a follow-up commit. What actually happened:

1. The secret is permanently in git history, retrievable by anyone who clones the repo, forever, regardless of the follow-up commit
2. GitHub's own secret-scanning bots typically index new public commits within minutes — often faster than the developer notices the mistake
3. The only correct fix is: rotate the credential immediately, then worry about scrubbing history (which doesn't undo the exposure, it just cleans up going forward)

The two-minute delete gave a false sense that the problem was handled. It wasn't.

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

If your internal package is named the same as a public one, some package managers prefer the public version by default (it looks "newer" or is resolved first, depending on configuration). Attackers register the public name and wait for a misconfigured install to pull their version instead of your internal one — silently running their code inside your build. This exact technique was demonstrated against major companies including Apple, Microsoft, and Tesla in a widely publicized 2021 research disclosure. Use scoped packages (`@yourorg/package-name`) and explicit registry configuration to prevent this.

### Typosquatting in practice

A developer means to `npm install crossenv` but types `npm install cross-env` — or the reverse — and one of the two is a malicious package designed to look like the real one. At install time, `npm` runs the package's install scripts with the same privileges as the developer running the command. There is no sandboxing by default. A single typo can mean full code execution on a developer's machine or a CI runner.

## 🧪 Hands-on lab — find your own exposure

**Part 1 — secrets in history (10 minutes)**
```bash
git clone <a repo you maintain>
cd <repo>
pip install detect-secrets  # or: brew install gitleaks
gitleaks detect --source . -v
```
Even in a repo you believe is clean, check whether any findings surface in old commits, not just the current tree.

**Part 2 — dependency confusion exposure (10 minutes)**
1. List your organization's internal/private package names.
2. For each one, check whether that exact name is already registered on the public npm/PyPI registry.
3. If any are unregistered, that's a live dependency confusion risk — register a placeholder under your org or configure your package manager to explicitly pin the internal registry as the only source for those names.

:::lab
Enable Dependabot or equivalent on a real repository. Triage the first week of alerts — you will quickly see which ones are reachable and which are noise.
:::

:::challenge Test yourself
1. A secret was committed and deleted in the very next commit, five minutes later. Is rotation still necessary? Explain why or why not.
2. Explain dependency confusion in your own words, and name one concrete configuration change that prevents it.
3. Your Docker image was built with a secret passed via `ENV` and later "removed" in a subsequent `RUN rm` layer. Is the secret actually gone from the image? Why or why not?
:::

## Key terms

- **Secret scanning** — automated detection of credentials in code and history
- **Typosquatting** — publishing a malicious package with a name close to a popular one
- **Provenance** — metadata that describes how an artifact was built
- **Dependency confusion** — tricking a package manager into installing a public malicious package instead of an intended private one, by name collision
- **Short-lived credential** — a secret that expires quickly (minutes to hours), limiting the value of theft

## Recap

Treat secrets as production credentials from the moment they are created, and treat every dependency as code you are responsible for, even though you didn't write it. Automation, least privilege, and rapid rotation are the practical defences — and speed of rotation matters more than perfection of prevention, because leaks will still happen.

???refs
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [SLSA](https://slsa.dev/) — supply-chain integrity framework
- [Dependency confusion research (Alex Birsan)](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) — the original disclosure covering Apple, Microsoft, Tesla and others
???
