# Turn Security Goals into Testable Requirements

“Make the app secure” is a goal, not a requirement. A developer needs to know what the app must do. A reviewer needs evidence that it does it.

By the end of this lesson, you will turn a vague goal into a small set of requirements with owners, tests, and evidence.

## Start with one feature

Imagine an invoice download feature. A signed-in customer asks for invoice `101`.

Ask four questions before choosing a scanner:

1. What are we protecting? Invoice amounts, customer identity, and billing details.
2. Who may use it? The customer who owns the invoice, plus any explicitly approved support role.
3. What could go wrong? Another customer changes the invoice ID and reads someone else's data.
4. How will we prove the rule? Test with two separate customer accounts, not just one successful login.

The risk determines the requirement. The tool is a way to collect evidence.

## Use OWASP ASVS as a checklist of requirements

The **Application Security Verification Standard (ASVS)** describes security requirements for web applications and services. The **OWASP Top 10** is an awareness list of common risk categories. They serve different purposes: use the Top 10 to start a discussion, and ASVS to make that discussion testable.

Use a published ASVS release, such as **5.0.0**, and record its version. Requirement identifiers can change between releases. Copy the exact identifier and wording from that release when you make a formal mapping; do not invent an ASVS number from memory.

ASVS has verification levels. Choose the level and applicable requirements based on the application's risk, with the people responsible for that risk. A small checklist does not establish that the entire application meets an ASVS level.

## Write acceptance criteria that can fail

| Requirement for the invoice feature | Evidence | Owner |
|---|---|---|
| The server derives customer identity from a validated session, not a request's `owner` field | Authentication integration test and review of session handling | Application team |
| A customer can read only invoices they own | Two-user positive and negative authorization tests | Application team |
| Invoice lookup uses bound query parameters | Code review plus input-handling tests | Application team |
| Missing and unauthorized invoices reveal no invoice contents | Response and body assertions for both cases | Application team |
| Billing details and session tokens do not enter application logs | Log review with synthetic data | Operations and application teams |

These are example acceptance criteria, not quoted ASVS requirements. Map each one to the appropriate requirement in your chosen release.

Notice the negative tests. “Customer A can read invoice A” proves the feature works. It does not prove that customer B cannot read invoice A.

## Keep a small evidence record

A useful record includes:

```text
Feature: customer invoice download
Requirement: server checks invoice ownership on every read
Standard: ASVS 5.0.0; exact requirement ID copied from release
Owner: billing application team
Evidence: test name, reviewed commit, test result
Status: implemented / gap / not applicable with explanation
Review again: when the permission model or download flow changes
```

An exception also needs an approver, a reason, a compensating control where possible, and an expiry date. “The scanner passed” is not an exception process.

## What a green pipeline does not prove

A passing test applies to the behavior and version it actually exercised. It does not prove every endpoint has the same check. A clean dependency scan says nothing about a custom ownership rule. A signed build can still contain a design flaw.

Combine requirement review, automated tests, targeted manual review, and production feedback. Keep the scope of each claim clear.

## Practice: make one vague statement useful

Take “file uploads must be safe” and write three acceptance criteria. For each, name a test and its owner. Consider file size, permitted types, storage location, and who can download the result. Explain what still needs manual review.

### Check your answer

A strong answer might require an enforced size limit, storage outside executable or public application paths, and an authorization check before every download. A file extension allowlist alone is not enough. Each rule should have a test that fails when the protection is removed.

## Key terms

- **Acceptance criterion** — a specific behavior that can be checked and can fail
- **Verification evidence** — a recorded test or review result tied to a requirement and version
- **ASVS** — OWASP security requirements for verifying web applications and services

## Ready to advance

- [ ] I can explain why a risk category is different from a testable requirement.
- [ ] I wrote at least one test where access must be denied.
- [ ] My evidence names a version, a test, and an owner.

Next, use threat modeling to find requirements that a checklist may miss.

???refs
- [OWASP ASVS](https://asvs.owasp.org/) — published releases and verification requirements
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) — permission checks and authorization tests
???
