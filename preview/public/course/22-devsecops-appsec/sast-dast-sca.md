# SAST, DAST & SCA — The Core Scanning Trio

Three families of tools form the backbone of most AppSec programs. They find genuinely different things, which is why mature programs run all three rather than arguing about which is best.

:::tip
The one-line version: **SAST reads your code, DAST attacks your running app, SCA checks everyone else's code that you shipped.**
:::

## SAST — Static Application Security Testing

Analyses source code or bytecode *without running the application*. Think of it as a very pedantic reviewer who has read every line but has never seen the program actually execute.

**Strengths**
- Finds issues early — in the IDE or on the pull request
- Can reach code paths that are hard to trigger dynamically (deep error handlers, rare branches)
- Points at an exact file and line, which makes fixes fast
- Good for injection patterns, crypto misuse, hardcoded secrets

**Weaknesses**
- Higher false-positive rate than the other two
- Needs language and framework support — a tool that doesn't understand your ORM will flag safe code as unsafe
- Cannot see runtime configuration, environment variables, or how the app is actually deployed

**Examples**: CodeQL, Semgrep, SonarQube, Checkmarx, Fortify

### Why SAST produces false positives

Consider this Python:

```python
query = "SELECT * FROM users WHERE id = " + user_id
db.execute(query)
```

SAST correctly flags this as SQL injection. But now consider:

```python
user_id = int(request.args["id"])          # cast to int — no longer attacker-controlled text
query = "SELECT * FROM users WHERE id = " + str(user_id)
db.execute(query)
```

This one is actually safe, because the `int()` cast makes injection impossible. A weaker tool still flags it, because it sees string concatenation feeding `execute()`. Understanding *why* a tool is wrong is what separates useful triage from rubber-stamping.

## DAST — Dynamic Application Security Testing

Tests the *running* application from the outside, the way an attacker would. It doesn't know or care what language you wrote it in.

**Strengths**
- No source code required — works on third-party apps too
- Finds issues that only exist at runtime: misconfiguration, missing headers, auth flaws, server-side behaviour
- Effectively zero false positives for things like "this endpoint returned data without a session" — it either happened or it didn't

**Weaknesses**
- Needs a working, populated environment and realistic coverage
- Slow — a full crawl of a large app can take hours
- Completely blind to code it never manages to reach. If a feature is behind a login it can't perform, that feature is untested.

**Examples**: OWASP ZAP, Burp Suite Enterprise, Nuclei

:::warn
The most common DAST failure is **authentication**. If the scanner can't log in, it tests only your marketing pages and reports a clean bill of health for an application it never actually touched. Always check the coverage report, not just the findings count.
:::

## SCA — Software Composition Analysis

Looks at third-party dependencies (npm, Maven, pip, Go modules) and flags known vulnerabilities, license risk, and outdated packages.

This matters more than people expect. A typical modern web application is **80–90% code you did not write**. Your own logic is a thin shell around a mountain of dependencies.

**Strengths**
- Very high signal — a CVE either affects your version or it doesn't
- Cheap to run and fast
- Can block builds on critical vulnerabilities with little argument

**Weaknesses**
- Finds nothing at all in *your* code
- Reachability analysis is still maturing: is the vulnerable function actually called by your app, or is it in a code path you never touch?

**Examples**: Dependabot, Snyk, OWASP Dependency-Check, Trivy

### The reachability problem

Say `lodash` has a vulnerability in its `template()` function. SCA reports it as critical. But:

- If your code calls `lodash.template()` with user input → genuinely critical, fix now
- If your code only uses `lodash.debounce()` → the vulnerable code is present but never executed

Both look identical in a basic SCA report. Newer tools attempt reachability analysis to tell them apart; until that's reliable, a human has to make the call.

## Side by side

| | SAST | DAST | SCA |
|---|---|---|---|
| Needs source code | Yes | No | Yes (manifest files) |
| Needs a running app | No | Yes | No |
| Runs in a PR | Yes | Rarely — too slow | Yes |
| False positives | Higher | Lower | Low |
| Finds design flaws | No | No | No |
| Finds your bugs | Yes | Yes | No |
| Finds dependency bugs | No | Sometimes | Yes |
| Typical runtime | Minutes | Hours | Seconds |

Note the row every one of them fails: **none of these finds design flaws.** No scanner will tell you that your password reset flow lets anyone reset anyone's password. That's what threat modeling is for, later in this path.

## How they fit together

```
Developer commit
      ↓
SAST + SCA on the PR        ← fast feedback, blocks merge
      ↓
Build & unit tests
      ↓
DAST / API tests in staging ← slower, runs nightly
      ↓
Release
```

## Practical rollout advice

1. **Start with SCA.** Highest return, lowest noise, and the easiest to justify — "this dependency has a known critical CVE" is not a debatable finding.
2. **Add SAST with a small set of high-confidence rules.** Do not enable the full ruleset on day one; you'll generate the 2,000-finding backlog that kills programs. Start with secrets detection and injection, then expand.
3. **Introduce DAST once staging is stable** and you can script authentication properly.
4. **Always pair tools with a triage process.** Findings that nobody owns will rot, and a rotting backlog is worse than nothing because it creates the illusion of coverage.

:::tip
On GitHub, a solid free-tier starter stack is Dependabot (SCA) + CodeQL (SAST) + secret scanning. All three are configurable from the Settings → Code security page, and for public repositories they cost nothing.
:::

## 🧪 Hands-on lab — run all three against one app

Use OWASP Juice Shop, a deliberately vulnerable app built for exactly this.

**SCA (5 minutes)**
```bash
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop
npm install --package-lock-only
npm audit
```
Read the output. Note how many are transitive (dependencies of dependencies) rather than packages you chose.

**SAST (10 minutes)** — install Semgrep and run its default ruleset:
```bash
pip install semgrep
semgrep --config=auto .
```
Pick three findings. For each, decide: real, false positive, or "real but not reachable". Write down your reasoning.

**DAST (15 minutes)** — run the app, then point OWASP ZAP at it:
```bash
docker run -d -p 3000:3000 bkimminich/juice-shop
```
Run a ZAP baseline scan against `http://localhost:3000` and compare its findings to the SAST output.

**The point of the exercise**: notice how little the three lists overlap. That non-overlap is the entire argument for running all three.

:::challenge Test yourself
1. Your SAST tool flags a SQL injection in code that takes input from an internal config file, not from users. Real issue or false positive? What extra information would change your answer?
2. A DAST scan of your app returns zero findings. Name three reasons that might be bad news rather than good news.
3. SCA reports a critical CVE in a library your app depends on, but the vulnerable function is never called. Do you fix it? Argue both sides.
:::

## Key terms

- **SAST** — static analysis of source code, no execution
- **DAST** — dynamic testing of a running application from the outside
- **SCA** — analysis of third-party components against known-vulnerability databases
- **False positive** — a finding that is not actually a real issue
- **Reachability** — whether vulnerable code can actually be executed by your application
- **Transitive dependency** — a dependency of one of your dependencies, which you never chose directly

## Recap

SAST, DAST and SCA cover genuinely different angles, and their findings overlap far less than people expect. Mature programs run all three, tuned so developers trust the results — and none of the three will find a design flaw, which is why scanning alone is never a complete AppSec program.

???refs
- [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools) — comparison of the SAST landscape
- [CodeQL](https://codeql.github.com/) — GitHub's query-based static analysis
- [Semgrep](https://semgrep.dev/) — fast, rule-based, generous free tier
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — the vulnerable app used in the lab above
???
