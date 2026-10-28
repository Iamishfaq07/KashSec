# SAST, DAST and SCA: Choose the Right Check

Three common kinds of scanning answer different questions. Use them together with code review, security requirements, and tests of the application's own rules.

- **SAST** reads source code or another code representation without running the application.
- **DAST** tests a running application through its exposed interfaces.
- **SCA** identifies third-party components and checks them against information such as known vulnerabilities and licenses.

A clean result from any of these means only that the tool reported no issue within its configuration and coverage.

## SAST: follow risky code patterns

Static Application Security Testing can find patterns such as untrusted input reaching a database query, file operation, or system command. Examples include CodeQL and Semgrep.

It can run early, often on a pull request, and may identify a file and line to review. Its usefulness depends on language support, framework models, rules, and the build context. False positives and missed issues are both possible.

```python
# Unsafe: input becomes SQL syntax.
query = "SELECT id FROM users WHERE name = '" + name + "'"
row = db.execute(query).fetchone()

# SQLite example: bind values as data.
row = db.execute("SELECT id FROM users WHERE name = ?", (name,)).fetchone()
```

The second query prevents input from changing the SQL structure in this lookup. It does not decide whether the current user may read the selected record. That needs a separate authorization rule.

A scanner that recognizes the framework may distinguish these cases. When triaging a finding, follow the input and the actual operation; do not dismiss it just because the source appears internal.

## DAST: test reachable behavior

Dynamic Application Security Testing sends requests to a running application. Examples include OWASP ZAP and Burp Suite's automated testing tools.

DAST can detect injection, configuration problems, and some authentication or access-control flaws. It only tests the behavior it can reach. A scanner that never signs in has not tested the signed-in area.

Dynamic results can still be misleading. Caching, test data, redirects, mistaken assumptions about permissions, and scanner heuristics can produce false positives or false negatives. Confirm important findings with a reproducible request and expected behavior.

For an access-control review, provide separate test accounts with different permissions. A generic scan does not automatically understand who should own an invoice or approve a transfer.

## SCA: identify component risk

Software Composition Analysis inspects dependency information or artifacts. Tools such as Dependabot, Dependency-Check, and Trivy can report known vulnerabilities associated with detected components.

An advisory match is a starting point for triage, not a complete impact assessment. Check:

1. The exact package and installed version, including transitive dependencies.
2. The advisory's affected versions and required conditions.
3. Whether the affected functionality is reachable in this application.
4. A supported update or other mitigation, with compatibility tests.
5. Who owns the decision and when it will be reviewed again.

Do not claim a vulnerable dependency is harmless solely because one call was not found by a simple text search. Dynamic loading, optional features, and incomplete analysis can hide usage.

## Compare the questions, not a fixed score

| Check | Needs a running application? | Useful evidence | Important limit |
|---|---|---|---|
| SAST | Usually no | Input-to-operation flow, file and line | Models may miss or misunderstand the framework |
| DAST | Yes | Request, response, and observed behavior | Unvisited routes and roles remain untested |
| SCA | Usually no | Component/version and advisory match | Application impact still needs context |
| Manual design review | No | Trust boundaries and abuse cases | Depends on the scope and reviewers |
| Authorization regression test | Depends on test level | Allowed and denied behavior | Covers only the cases and integration it exercises |

Some tools can find symptoms of a design flaw. None can establish that all business rules are correct. A password-reset design or approval workflow still needs targeted review and tests.

## Put checks where the feedback is useful

```text
Small code change
    ↓
Unit/security regression tests + focused SAST + dependency checks
    ↓
Build and review the artifact
    ↓
Staging: authenticated DAST and role-based integration tests
    ↓
Release decision with owned exceptions
    ↓
Production feedback and dependency monitoring
```

This is an example, not a requirement to run every scanner on every commit. Measure execution time and noise. Agree which verified, high-confidence issues block a change, and how exceptions expire. Keep fast checks close to the pull request and schedule broader checks where they fit.

## Practice with a small evidence table

Use the downloadable **AppSec Fix & Verify Lab** later in this path as a guaranteed local starting point. Review the SQL construction and the unused `actor` argument. Predict which issue a generic static rule might find and which needs knowledge of the ownership rule. Then use the tests to check your prediction.

For a separate, optional dynamic-testing exercise, run a deliberately vulnerable application such as OWASP Juice Shop on your own machine. Follow its current setup guide and bind published ports to loopback. For example:

```bash
docker run --rm -d --name kashsec-juice-shop -p 127.0.0.1:3000:3000 bkimminich/juice-shop
```

Only test this local instance or an explicitly authorized target. In ZAP, a baseline/passive scan reports issues in traffic it observes; it is not the same as a full active scan or a two-user authorization test. Record the routes and roles you actually exercised. A local application's dependencies and findings change over time, so there is no fixed finding count to match.

Stop the container when finished:

```bash
docker stop kashsec-juice-shop
```

If you choose an external scanner, follow its supported installation and licensing guidance. Those optional tools are not required for the self-contained Python lab.

| Finding | Source | Evidence checked | Decision and owner |
|---|---|---|---|
| SQL construction | Review or SAST | Untrusted value reaches the query | Bind parameters; application team |
| Missing owner rule | Review and two-user test | Another customer can read the record | Enforce authorization; application team |
| Component advisory | SCA | Version and affected conditions | Update, mitigate, or time-bound exception |

## Key terms

- **SAST** — static analysis of code without running the application
- **DAST** — dynamic testing of a running application through its interfaces
- **SCA** — analysis of third-party components and associated risks
- **Coverage** — the code, components, routes, roles, or behaviors a check actually examined

## Ready to advance

- [ ] I can explain what each scan actually examined.
- [ ] I know why zero findings is not proof of security.
- [ ] I can name evidence needed to confirm a dependency alert.
- [ ] I will keep authorization tests even when scanner results are clean.

???refs
- [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/)
- [OWASP Juice Shop setup](https://help.owasp-juice.shop/part1/running.html)
???
