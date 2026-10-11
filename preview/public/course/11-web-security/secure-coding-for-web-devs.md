# Secure Coding for Web Developers

Every lesson in this path so far has taught you to think like an attacker. This closing conceptual lesson flips the perspective one final time before the roadmap lesson — pulling together the defensive principles scattered across every earlier lesson into a single, practical reference for the defender's side of the same coin.

:::tip
Nothing in this lesson is new. Every principle here was already stated somewhere earlier in this path, attached to a specific vulnerability. The value here is having them all in one place — genuinely useful as an actual code-review checklist, not just a recap.
:::

## The unifying principle behind nearly every vulnerability in this path

If you trace back through IDOR, XSS, SQL injection, CSRF, XXE, deserialization, and file inclusion, they all share the same root cause, stated in slightly different forms throughout this path: **trusting data or requests without verifying they're actually legitimate.** IDOR trusts a client-supplied ID without checking ownership; XSS trusts unescaped input rendered as HTML; SQL injection trusts unsanitized input concatenated into a query; CSRF trusts a request's origin without a token. Recognizing this single unifying thread is genuinely more valuable than memorizing each vulnerability as an unrelated, isolated fact.

## A consolidated defensive checklist, mapped to where each idea came from

- **Validate and sanitize all input, server-side** — never trust client-side validation (Path 05's web-forms lesson); use allow-lists over blocklists wherever possible (path-traversal and file-inclusion lessons)
- **Use parameterized queries, never string concatenation** — the SQLi lesson's core defense, directly preventing an entire vulnerability class structurally
- **Escape output based on context** — HTML-escape for HTML contexts, exactly what modern frameworks (Path 05's frameworks lesson) do automatically unless a developer explicitly bypasses it
- **Enforce authorization on every single request, server-side** — never assume a client-side check (a hidden button, a disabled UI element) is sufficient, exactly the IDOR lesson's core lesson
- **Use CSRF tokens and SameSite cookies together** — defense in depth applied directly to this specific vulnerability class
- **Set security headers deliberately** — CSP, HSTS, X-Frame-Options, and the rest of the headers-deep-dive lesson's checklist, not left to framework defaults alone
- **Never deserialize untrusted data with a native format** — the deserialization lesson's core rule, preferring JSON wherever feasible
- **Keep dependencies updated** — directly connecting to Path 00's updates lesson and Path 22's software composition analysis material; a perfectly secure application built on a vulnerable, outdated library is still vulnerable
- **Apply least privilege everywhere** — database accounts, service accounts, API tokens — each should have exactly the access it needs, never more, limiting the blast radius when (not if) something eventually goes wrong

## Why "shift left" matters — fixing vulnerabilities before they ship

A concept worth naming directly, since it reframes everything else in this lesson: **shifting security left** means addressing vulnerabilities during development — through secure coding practices, code review, and automated scanning — rather than discovering them later through a penetration test or, worse, an actual breach. Path 22's entire DevSecOps path builds directly on this principle, but the foundation is exactly the coding discipline this lesson has consolidated: a vulnerability that's never written in the first place is categorically cheaper and safer than one caught and fixed later.

:::challenge Test yourself
What's the single unifying root cause connecting IDOR, XSS, SQL injection, and CSRF, despite these being very different-looking vulnerabilities on the surface?
<details><summary>Show answer</summary>Every one of these vulnerabilities ultimately traces back to trusting something — data, a request, an identity claim — without independently verifying it's actually legitimate. IDOR trusts that a client-supplied object ID belongs to the requesting user without checking; XSS trusts that user-supplied content is safe to render as raw HTML without escaping it; SQL injection trusts that user input can be safely concatenated directly into a query without parameterization; CSRF trusts that a request carrying a valid session cookie genuinely reflects the user's deliberate intent, without verifying its actual origin. Recognizing this shared thread is genuinely more useful than memorizing each vulnerability in isolation, because it gives you a single question to ask about <em>any</em> new code you write or review, regardless of which specific vulnerability class it might turn out to resemble: "what am I trusting here, and have I actually verified it?"</details>
:::

## Key terms

- **Shift left** — addressing security during development rather than discovering it later through testing or an actual incident.
- **Defense in depth (applied to code)** — layering multiple independent defensive practices (input validation, output escaping, authorization checks) rather than relying on any single one.

## Recap

- Nearly every vulnerability covered in this path shares the same root cause: trusting data or requests without independently verifying their legitimacy.
- This lesson's checklist consolidates every earlier defensive principle in this path into one practical, code-review-ready reference.
- Shifting security left — building these practices into development itself, rather than only catching issues later — is the foundation Path 22's entire DevSecOps material builds on.

**Next up →** [Your web security roadmap](#/lesson/11-web-security/web-roadmap)
