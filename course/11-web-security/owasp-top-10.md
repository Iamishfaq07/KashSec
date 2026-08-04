# OWASP Top 10 overview

Welcome to applied web security. Before diving into individual bug classes, meet the document that organises the entire field: the **OWASP Top 10**.

## What OWASP is

**OWASP** (Open Worldwide Application Security Project) is a non-profit community producing free, vendor-neutral security resources — tools, documentation, and standards used across the entire industry. The **OWASP Top 10** is their most famous output: a periodically-updated ranking of the most critical web application security risks, based on real-world data contributed by security firms worldwide.

It isn't a top-10 of "bugs" exactly — it's a top-10 of **risk categories**, each covering a cluster of related vulnerability types.

## The 2021 OWASP Top 10 (current edition)

```mermaid
flowchart TB
    A1["A01: Broken Access Control"]
    A2["A02: Cryptographic Failures"]
    A3["A03: Injection"]
    A4["A04: Insecure Design"]
    A5["A05: Security Misconfiguration"]
    A6["A06: Vulnerable & Outdated Components"]
    A7["A07: Identification & Authentication Failures"]
    A8["A08: Software & Data Integrity Failures"]
    A9["A09: Security Logging & Monitoring Failures"]
    A10["A10: Server-Side Request Forgery (SSRF)"]

    style A1 fill:#2b1010,color:#E05548,stroke:#E05548
    style A2 fill:#2b1010,color:#E05548,stroke:#E05548
    style A3 fill:#2b1010,color:#E05548,stroke:#E05548
    style A4 fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style A5 fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style A6 fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style A7 fill:#2b1010,color:#E05548,stroke:#E05548
    style A8 fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style A9 fill:#111927,color:#8496A6,stroke:#8496A6
    style A10 fill:#2b1010,color:#E05548,stroke:#E05548
```

### A01: Broken Access Control — now #1

The most common issue found in real testing. This is the umbrella for **IDOR** (Path 11.4), missing function-level authorization, and privilege escalation via the web. Essentially: the app fails to properly enforce *"is this user allowed to do this specific thing?"* — exactly the authorization concept from Path 05.7.

### A02: Cryptographic Failures

Previously called "Sensitive Data Exposure" — renamed to focus on the *root cause*: missing encryption, weak algorithms, improper key management. Covers everything from unencrypted data in transit to the MD5-for-passwords mistake from Path 10.5.

### A03: Injection

Includes **SQL injection** (Path 11.6), **command injection** (Path 11.7), and cross-site scripting (technically its own category historically, folded in here in 2021). The common thread: untrusted input is interpreted as *code* rather than *data* by some downstream interpreter.

### A04: Insecure Design

A newer category (2021) recognising that some vulnerabilities stem from **missing security controls at the design stage**, not just implementation bugs. E.g., a password-reset flow with no rate limiting by design, regardless of how well the code is written.

### A05: Security Misconfiguration

Default credentials left in place, unnecessary features enabled, verbose error messages leaking stack traces, missing security headers, outdated software with known defaults. Extremely common and often trivially found.

### A06: Vulnerable and Outdated Components

Using libraries/frameworks with known CVEs. This is why **SCA (Software Composition Analysis)** tooling exists — scanning dependency trees for known-vulnerable packages is core AppSec work.

### A07: Identification and Authentication Failures

Weak password policies, missing MFA, session fixation, predictable session tokens, credential stuffing without protection — the authentication half of Path 10.5 and 05.4, now viewed as an application-layer risk category.

### A08: Software and Data Integrity Failures

Trusting data or code without verifying its integrity — insecure deserialization, unsigned/unverified auto-updates, and **CI/CD pipeline compromises** (directly related to real incidents like the `trivy-action` supply-chain compromise from earlier professional context).

### A09: Security Logging and Monitoring Failures

Not detecting or being unable to investigate a breach because logs weren't kept, weren't monitored, or didn't capture the right events. This is why breach detection so often takes **months** in real incidents — the evidence existed but nobody was watching.

### A10: Server-Side Request Forgery (SSRF)

A newer standalone category (previously bundled elsewhere): tricking a server into making requests *on the attacker's behalf* — often to internal-only systems the attacker couldn't otherwise reach. Covered in depth in Path 11.8.

## Why this list changes over time

The Top 10 is refreshed roughly every 3-4 years (2013, 2017, 2021 editions; a 2025 edition process began recently), based on aggregated data from dozens of security firms and thousands of real applications. Categories get merged, renamed, or reprioritised as the industry's understanding shifts — access control moving to #1 in 2021 reflects genuinely how common those bugs turned out to be in the real data, more than XSS or injection which used to dominate the top spots.

## What the 2025 refresh is expected to change

As referenced above, OWASP began the process toward a new edition; while the exact final categories aren't locked until release, the underlying trend worth understanding is *why* these refreshes happen at all — not because old categories stop mattering, but because the industry's aggregated testing data shifts as technology shifts. API-first architectures (Path 05's APIs & JSON lesson), widespread cloud misconfiguration (Path 08), and AI/LLM-specific risks (Path 18's dedicated material, and OWASP's own separate "Top 10 for LLM Applications" project) are all putting upward pressure on categories that barely existed as distinct concerns in 2013. Learning the *current* list matters, but learning to read *why* a list changes is the more durable skill — it's the same "which stage of an attack is this abusing" thinking from Path 10's kill chain lesson, just applied to an evolving risk taxonomy instead of a fixed attack sequence.

## How to actually use the Top 10 in practice

- **As a beginner:** it's your syllabus. Each category points to a cluster of concrete, learnable bugs (which the rest of this path covers hands-on).
- **As a pentester:** it's a useful *checklist* to ensure broad coverage, though real engagements go well beyond just these ten categories.
- **As a defender/AppSec engineer**: it's a shared vocabulary for prioritising fixes, mapping SAST/DAST findings to recognisable risk categories, and communicating with non-security stakeholders about *why* something matters.
- **As a bug bounty hunter:** most public program scopes and vulnerability disclosure processes implicitly reference these categories.

## The companion projects worth knowing

OWASP produces much more than just the Top 10:

- **OWASP ASVS (Application Security Verification Standard)** — a much more detailed, testable checklist for verifying application security, often used for formal audits.
- **OWASP Testing Guide** — step-by-step methodology for testing each vulnerability category.
- **OWASP Cheat Sheet Series** — practical, focused guidance on specific topics (you've already been linked several of these throughout this course).
- **OWASP ZAP** — a free, open-source web app security scanner, a great complement to Burp Suite (next lesson).
- **OWASP API Security Top 10** — the API-specific parallel list, mentioned back in Path 05.5.

## 🧪 Lab — Map what you already know

Before moving further into this path, go back through Paths 01–06 and, for each OWASP Top 10 category above, write down **one concept you've already learned** that connects to it. For example:

- A02 (Cryptographic Failures) → "Path 10.5: MD5/SHA-1 are wrong for passwords."
- A07 (Auth Failures) → "Path 05.4: session cookies need HttpOnly/Secure/SameSite."

If you can connect at least 6 of the 10 categories to something you already know, you're in great shape for the rest of this path — you're not starting from zero, you're organising what you already have.

:::challenge Test yourself
Which OWASP Top 10 category moved to the #1 spot in the 2021 edition, and what's the one-sentence definition of the failure it describes?

<details><summary>Show answer</summary><strong>A01: Broken Access Control</strong> — the application fails to properly enforce restrictions on what authenticated users are allowed to do or access, letting them act outside their intended permissions.</details>
:::

## Key terms

- **OWASP** — the non-profit behind the Top 10 and many other free security resources.
- **OWASP Top 10** — the ranked list of the most critical web app security risk categories.
- **ASVS / Testing Guide / Cheat Sheet Series** — OWASP's deeper, more detailed companion resources.
- **SCA (Software Composition Analysis)** — tooling for finding known-vulnerable dependencies (A06).

## Recap

- The OWASP Top 10 organises web application risk into ten shared categories.
- A01 (Broken Access Control) is currently the most common real-world category.
- Injection, misconfig, and outdated components remain persistently common across editions.
- The list evolves based on real aggregated data, not opinion.
- It serves as a syllabus for learners, a checklist for testers, and a vocabulary for defenders.

???refs
- [OWASP Top 10 (2021)](https://owasp.org/Top10/) — the official, current edition.
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) — the detailed verification standard.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — practical guidance, topic by topic.
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) — the API-specific parallel.
???

**Next up →** [Set up Burp Suite](#/lesson/11-web-security/burp-setup)
