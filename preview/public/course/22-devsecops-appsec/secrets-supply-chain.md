# Secrets Management & Software Supply Chain

Two of the most common ways organisations get breached today: leaked secrets and compromised dependencies. Neither requires an attacker to find a bug in your code — both let them walk in through a door your own tooling left open.

:::tip
A useful mental model: a secret is a credential, and once it has touched a place you don't fully control — a public repo, a chat log, a screenshot — treat it as compromised, not "probably fine." Rotation is cheap. Guessing wrong is not.
:::

## Secrets

### Where secrets leak

- Source code and commit history — deleting a secret in a later commit does **not** remove it from history; anyone can `git log -p` and find it
- CI logs and pipeline definitions — a `curl` command with a token in the URL, printed to a public build log
- Container images and layers — a secret passed through Dockerfile `ENV` or `ARG` can persist in image metadata or build history; a secret written into a file in one layer can remain in that layer even if a later layer deletes the file
- Chat, tickets, screenshots — "quickly pasting the API key into Slack so you can test it" is one of the most common leak paths, and the hardest to scan for
- Client-side JavaScript and mobile apps — anything shipped to a browser or a phone is, functionally, public

:::warn
Container image layers are append-only from a history standpoint. `RUN echo $SECRET > /tmp/s.txt` followed by `RUN rm /tmp/s.txt` in a later layer does not remove the secret — the file bytes can remain in the earlier layer. Inspecting image layers can recover them; `docker history` alone does not necessarily display the file contents. Use BuildKit secret mounts for build-time secrets and avoid writing their contents into an image layer.
:::

### Prevention

1. **Local hooks and push protection** — tools such as Gitleaks can scan locally; supported provider push-protection features can block recognized secrets before accepting a push. Detection-only scanning may run after a commit or push. Check the tool, coverage, and repository plan
2. **Central secret stores** with short-lived credentials and audit logs — a vault that issues a token good for one hour is far less valuable to steal than one good forever
3. **Never commit secrets** — use environment injection or volume mounts at runtime instead of baking values into files or images
4. **Rotate** immediately when a leak is detected — not "when convenient." A leaked key is a live incident from the moment of exposure, whether or not you've seen evidence of misuse yet

### Detection

- Use secret detection on public and private repositories. Check feature availability and licensing; where a provider feature is unavailable, consider a local or CI scanner with a named alert owner
- Monitor public GitHub for your organisation's tokens (GitHub has native support that scans public repos for recognizable token formats from major providers and notifies the provider directly)
- Treat every leaked cloud key as a production incident: rotate it, check access logs for the period it was exposed, and only then investigate root cause

## A worked example

A developer commits a `.env` file containing a database password to a public fork by accident, then deletes it two minutes later in a follow-up commit. What actually happened:

1. The deletion commit leaves the earlier commit containing the secret. Other clones, forks, logs, or caches may retain it even after a history rewrite
2. The exposure window matters, but do not wait for a scanner alert: not every credential format is detected and there is no universal detection-time guarantee
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
| Lockfiles + integrity hashes | Constrain dependency resolution and detect some content changes; not a guarantee that dependencies are trustworthy |
| Private package mirrors / allow-lists | Reduce exposure to public registry attacks |
| Signed commits & protected branches | Support source review and identity/integrity checks under an enforced policy |
| Artifact signing & verification | Check an artifact against the expected digest and signer/build policy |
| SLSA / provenance | Record and verify build-origin claims with an appropriate trust model |

### Dependency confusion

If your internal package is named the same as a public one, some package managers prefer the public version by default (it looks "newer" or is resolved first, depending on configuration). Attackers register the public name and wait for a misconfigured install to pull their version instead of your internal one — silently running their code inside your build. This exact technique was demonstrated against major companies including Apple, Microsoft, and Tesla in a widely publicized 2021 research disclosure. Use scoped packages (`@yourorg/package-name`) and explicit registry configuration to prevent this.

### Typosquatting in practice

An attacker publishes a package with a name close to a legitimate package. A typo can select the attacker's code. Verify the exact package name, publisher, registry, and necessity before adding it; do not install lookalikes just to compare them. Package-manager lifecycle scripts may run during installation, depending on the package and install policy, so installation itself can execute untrusted code.

## 🧪 Hands-on lab — find your own exposure

**Part 1 — secrets in history (10 minutes)**
```bash
# First install Gitleaks using its official installation guide.
# Run inside a local repository you own or are authorized to assess.
gitleaks version
gitleaks git --redact .
```
The command checks Git history and redacts detected secret values in its output. Review the installed version's help if your CLI differs. A finding can produce a non-zero exit status; distinguish a detected candidate from a setup error. Do not paste raw credentials into reports, tickets, or this course. Installing a different scanner, such as `detect-secrets`, does not install the `gitleaks` command.

**Part 2 — dependency confusion exposure (10 minutes)**
1. List your organization's internal/private package names.
2. For each one, check whether that exact name is already registered on the public npm/PyPI registry.
3. An unregistered public name alone does not prove exploitability. Inspect how the package manager resolves the name, including registry mappings, scopes, fallback behavior, and lockfiles. Configure the intended private source explicitly; merely reserving a public name or adding a scope is not a complete control.

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
- [Gitleaks installation and Git scanning](https://github.com/gitleaks/gitleaks)
- [Docker build secrets](https://docs.docker.com/build/building/secrets/)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [SLSA](https://slsa.dev/) — supply-chain integrity framework
- [Dependency confusion research (Alex Birsan)](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) — the original disclosure covering Apple, Microsoft, Tesla and others
???
