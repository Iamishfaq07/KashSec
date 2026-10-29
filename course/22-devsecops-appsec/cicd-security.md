# Securing the CI/CD Pipeline

The pipeline that builds and deploys your software is itself a high-value target. If an attacker can run code in CI, they don't need to find a bug in your app at all — they can often reach secrets, production, or every developer who pushes code, in one move.

:::tip
Think of CI/CD as production infrastructure, not a developer convenience. It has credentials, it has network access, and it runs code you didn't necessarily write yourself. Treat it accordingly.
:::

## Why pipelines matter

- They hold cloud credentials, API keys, and signing keys — often with broad scope, because "just make the build work" is a powerful incentive to over-grant permissions
- They can push code or artifacts straight to production, frequently with no human in the loop
- A compromised pipeline is a **supply-chain attack**: instead of attacking one company, an attacker who compromises a popular CI action or a widely-used base image attacks every downstream user at once

## The 2021 Codecov incident, briefly

A real example worth knowing: attackers modified Codecov's bash uploader script, used by thousands of CI pipelines to send test coverage data. The modified script quietly exfiltrated environment variables — which is exactly where CI secrets live — from every pipeline that ran it, for months, before anyone noticed. The incident illustrates how a compromised pipeline dependency can expose credentials even without exploiting the application itself.

## Common CI/CD risks

1. **Secrets in plaintext** in pipeline YAML or environment variables visible in logs
2. **Over-privileged tokens** (e.g. GitHub `write` on all repos, or a cloud key with account-admin scope for a job that only needs to write to one S3 bucket)
3. **Untrusted code execution** — pull requests from forks running privileged workflows, or triggering builds that can read secrets meant for trusted code
4. **Mutable third-party actions** (`uses: some/action@main` instead of a pinned SHA) — the tag can be repointed by the action's maintainer, or by whoever compromises their account, and your pipeline silently runs whatever it now points to
5. **No isolation** between build jobs of different trust levels — a job building a low-trust experimental branch running on the same runner pool with the same secrets as a job deploying to production
6. **Artifact tampering** — no signing or verification of what gets deployed, so a build step that never ran through the real pipeline can be substituted in

:::warn
`pull_request_target` runs in the base-repository context and may have access to privileged tokens and secrets. Do not combine that context with checkout or execution of untrusted pull-request code. Inspect the actual permissions, environments, and code executed; the trigger name alone does not describe the entire trust boundary.
:::

## Hardening checklist

### Secrets

- Store secrets in a proper secret manager (GitHub Secrets, Vault, cloud secret managers) — never in the YAML file itself, never in a `.env` committed "just for now"
- Never echo secrets in logs. Most CI systems mask known secret values automatically, but a secret assembled at runtime (e.g. concatenated into a URL) often slips past the masker
- Prefer short-lived, OIDC-based cloud credentials over long-lived access keys. With OIDC federation, a trusted job can obtain temporary cloud credentials instead of storing a long-lived cloud key in GitHub. The lifetime depends on provider policy; restrict the trust policy to the intended repository, workflow, branch or environment, and audience. Grant `id-token: write` only to the jobs that need it

### Least privilege

- Give each workflow the minimum permissions it needs (`permissions:` in GitHub Actions — set it to `contents: read` by default and add only what a specific job actually requires)
- Separate build and deploy roles — the job that compiles code should not hold the credential that pushes to production; that credential belongs to a separate, more tightly gated job

### Trust boundaries

- Do not run privileged workflows on `pull_request_target` with untrusted code checked out
- Pin actions to the full 40-character commit SHA from a reviewed official release, rather than a branch, version tag, or abbreviated SHA. Keep a version comment for readability and a process for reviewing updates
- Review and vendor critical actions when possible, especially for anything that touches secrets or deploy credentials

### Integrity

- Sign artifacts and, where appropriate, generate provenance. Verify the artifact digest, expected signer or workflow identity, and required provenance policy before deployment
- A valid signature does not mean the software is free of vulnerabilities or that a compromised trusted builder behaved honestly. Decide which identity and build context you trust, and actually enforce that policy
- Use immutable, digested image references (`image@sha256:...`) instead of mutable tags (`image:latest`)

### Visibility

- Log and monitor pipeline runs — who triggered it, what changed, what it touched
- Alert on unusual workflow changes or secret access, especially edits to `.github/workflows/` from unexpected authors

:::danger
A single over-privileged `GITHUB_TOKEN` or cloud key in CI has caused multiple real-world breaches. Treat pipeline credentials like production credentials, because functionally, they often *are* production credentials.
:::

## Worked example: a permissions review

Say a workflow has this at the top:

```yaml
permissions: write-all
```

That single line grants the job the ability to write to repo contents, issues, pull requests, packages, deployments, and more — for a job that, on inspection, only builds a Docker image and pushes it to a registry. The fix:

```yaml
permissions:
  contents: read
  packages: write
```

Now, if this workflow is ever compromised (a malicious dependency in the build step, for example), the blast radius is "can push a bad package" instead of "can rewrite any issue, merge any PR, and delete any release." Same build, radically different worst case.

## 🧪 Hands-on lab — audit a real workflow

1. Pick any GitHub repository you maintain (or fork a public one) with a `.github/workflows/` directory.
2. Open each workflow file and answer, for every job: what permissions does it declare? If none are declared, inspect the effective organization/repository defaults and any job-level overrides. Defaults can be restricted; do not assume missing YAML automatically grants write access. Recommend an explicit minimum permission set.
3. Search for any `uses: owner/action@<tag>` where `<tag>` is a branch or version tag rather than a full commit SHA. List them.
4. Check for `pull_request_target` anywhere in the file. If present, confirm the job does **not** also check out `github.event.pull_request.head.sha` or otherwise run fork code.
5. Write a one-paragraph risk summary: if this pipeline were fully compromised today, what could an attacker do with the credentials it holds?

:::challenge Test yourself
1. A workflow triggered on `pull_request_target` checks out the PR's own branch and runs `npm install && npm test`. Why is this dangerous even though it's "just running tests"?
2. Your team pins actions to version tags like `@v3` for readability. What's the actual risk of doing that, and what's the trade-off if you switch to pinning by SHA?
3. Explain, in one sentence, why a build job and a deploy job should generally hold different credentials even if the same team owns both.
:::

## Practice: turn artifact trust into a release rule

“The image is signed” leaves two questions unanswered: **do we trust this build context, and are these the exact bytes we approved?**

Write down the trusted repository, workflow identity, source ref, event, and release environment for your system. Use claims authenticated by the actual verifier. A JSON field named `signature_verified` from an uploaded file is not verification evidence.

Then bind deployment to the approved immutable digest. If verification checks one image but deployment later pulls `latest`, the tag can point to different bytes. The digest in the approval record must come from a trusted decision, not from the same untrusted candidate that asks for approval.

Your regression matrix should include:

1. An approved build context and matching digest: allow.
2. A genuinely signed build from an unexpected repository or workflow: deny.
3. An unexpected source ref, event, or release environment: deny.
4. Missing claims or a mismatch between approved and deployed bytes: deny.

Work through [The signed artifact from the wrong build](/expert-labs/release-trust.html). Its Python exercise evaluates a simplified policy on already-verified metadata. It does not perform cryptographic verification or deploy anything. For production, use your verifier's documented schema and verify that the deployment consumes the selected digest.

## Key terms

- **OIDC federation** — exchanging a short-lived pipeline identity for cloud credentials, without ever storing a long-lived key
- **Pinned action** — referencing a GitHub Action by commit SHA, not a moving tag, so the code that runs can't change out from under you
- **Artifact signing** — cryptographic proof of who built a binary/image, checkable before it's ever deployed
- **`pull_request_target`** — a GitHub Actions trigger that uses the base-repository context; combining its privileges with untrusted code can expose credentials
- **Blast radius** — the scope of damage possible if a given credential or system is fully compromised

## Recap

Secure pipelines are a prerequisite for secure software delivery — a perfectly secure application deployed through a compromised pipeline is not secure at all. Apply least privilege, pin dependencies, keep secrets out of logs, sign and verify artifacts, and monitor the pipeline itself as the production system it actually is.

???refs
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) — GitHub's own hardening guide
- [SLSA framework](https://slsa.dev/) — a maturity model for supply-chain integrity
- [Codecov bash uploader incident writeup](https://about.codecov.io/security-update/) — the real-world case referenced above
???
