# SAST, DAST & SCA — The Core Scanning Trio

Three families of tools form the backbone of most AppSec programs.

## SAST — Static Application Security Testing

Analyses source code or bytecode *without running the application*.

**Strengths**
- Finds issues early (in the IDE or pull request)
- Can reach code paths that are hard to hit dynamically
- Good for injection, crypto misuse, hardcoded secrets, etc.

**Weaknesses**
- Higher false-positive rate
- Needs language / framework support
- Cannot see runtime configuration or environment issues

**Examples**: CodeQL, Semgrep, SonarQube, Checkmarx, Fortify, GitHub Advanced Security

## DAST — Dynamic Application Security Testing

Tests the *running* application from the outside, like an attacker.

**Strengths**
- No source code required
- Finds issues that only appear at runtime (misconfig, auth flaws, some injection)
- Good complement to SAST

**Weaknesses**
- Needs a working environment and realistic coverage
- Can be noisy or slow
- Blind to untriggered code paths

**Examples**: OWASP ZAP, Burp Suite Enterprise, Nuclei, various commercial DAST platforms

## SCA — Software Composition Analysis

Looks at third-party dependencies (npm, Maven, pip, Go modules, etc.) and flags known vulnerabilities (CVEs), license risk, and outdated packages.

**Strengths**
- High signal for known CVEs
- Essential because modern apps are mostly dependencies
- Can block builds on critical vulnerabilities

**Weaknesses**
- Does not find vulnerabilities in *your* code
- Reachability analysis is still maturing (is the vulnerable function actually called?)

**Examples**: Dependabot, Snyk, Black Duck, OWASP Dependency-Check, GitHub Advisory + Dependabot

## How they work together

```
Developer commit
      ↓
SAST + SCA on the PR   ← fast feedback
      ↓
Build & unit tests
      ↓
DAST / API tests in staging
      ↓
Release
```

## Practical advice

1. Start with SCA — highest ROI, lowest noise when configured well.
2. Add SAST with a small set of high-confidence rules; expand gradually.
3. Introduce DAST once you have stable staging environments and auth handling.
4. Always pair tools with triage process and developer education — otherwise findings rot.

:::tip
In GitHub, a practical starter stack is: Dependabot + CodeQL + secret scanning (GitHub Advanced Security).
:::

## Key terms

- **SAST** — static analysis of code
- **DAST** — dynamic testing of a running app
- **SCA** — analysis of third-party components
- **False positive** — a finding that is not a real issue

## Recap

SAST, DAST and SCA cover different angles. Mature programs use all three, tuned so developers trust the results.

???refs
- [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools)
- [GitHub CodeQL](https://codeql.github.com/)
???