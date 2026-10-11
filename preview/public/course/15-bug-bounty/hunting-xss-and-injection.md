# Hunting XSS & Injection Bugs

The previous lesson focused entirely on access control — IDOR is about *who can see whose data*. This lesson covers the other major beginner-accessible bug category: injection flaws, directly connecting to Path 11's XSS and SQL injection lessons, now applied specifically to bug bounty hunting methodology rather than classroom theory.

## Why XSS remains one of the most commonly paid findings

Despite being one of the oldest web vulnerability classes (Path 11), **Cross-Site Scripting** remains a consistently common, consistently paid bug bounty finding — modern frameworks reduce it significantly through automatic output encoding, but genuinely reduce, not eliminate: raw HTML rendering features, custom sanitization logic, and older or less-maintained parts of large applications all remain common sources of real, exploitable XSS.

## Where to actually look for it

- **Search fields and error messages** — reflected input is often echoed back verbatim in "no results found for [your search]" messages, a classic and still-common reflected XSS source
- **Rich text / comment fields** — anywhere a user can submit formatted content (markdown editors, comment boxes, profile bios) is a candidate for stored XSS, generally the higher-severity variant since it affects every subsequent viewer, not just the submitter
- **URL parameters reflected into the page** — directly connecting to the recon pipeline's `gau` output, which surfaces historical URLs frequently containing exactly the kind of reflected parameters worth testing systematically
- **File upload / SVG uploads** — SVG files can contain embedded JavaScript, a genuinely underappreciated stored-XSS vector many applications' upload validation misses entirely

## A practical XSS testing payload progression

```
"><script>alert(document.domain)</script>
"><img src=x onerror=alert(document.domain)>
javascript:alert(document.domain)
```

Starting with a simple proof-of-concept alert (using `document.domain`, not just a static string, to prove the payload actually executed in the target's own origin) before escalating to something demonstrating real impact — directly connecting to the report-writing lesson's emphasis on concrete impact over a bare proof-of-concept alone.

## SQL injection: less common in modern apps, still valuable when found

Path 11's SQL injection coverage explained why parameterized queries have made classic SQLi rarer in well-maintained modern applications — but "rarer" isn't "gone," and when a genuine SQLi is found in a bug bounty program, it's typically rated critical, since the impact (full database access, in the worst case) is severe by nearly every severity framework. `sqlmap` (Path 11) remains the standard tool for confirming and exploiting a suspected injection point once manual testing has identified a promising parameter.

## Why manual testing still beats automated scanners here

Directly connecting to the automation-nuclei lesson later in this path: automated scanners like nuclei are excellent at finding *known* vulnerability patterns via templates, but XSS specifically is highly context-dependent — whether a payload executes depends on exactly where in the page it lands (an HTML attribute, a JavaScript string, an already-encoded context), something a generic scanner frequently misses but a human tester probing manually in Burp Repeater (from two lessons back) catches by actually reading the response.

:::challenge Test yourself
Why does testing an XSS proof-of-concept with `alert(document.domain)` specifically, rather than just `alert(1)` or `alert('xss')`, matter for a bug bounty report?
<details><summary>Show answer</summary><code>alert(document.domain)</code> proves something a generic <code>alert(1)</code> doesn't: that the injected script is actually executing within the target application's own browser origin, with access to that origin's <code>document</code> object — which is exactly the access an attacker would need to actually steal session cookies, read page content, or perform actions as the victim user. A triager reviewing a submitted report (from the bb-platforms-deep-dive lesson) needs convincing evidence the vulnerability is real and has genuine impact, not just that some string happened to render in a popup; showing the domain confirms execution context unambiguously and heads off exactly the kind of "can you demonstrate actual impact" clarification request that slows a report down in triage.</details>
:::

## Key terms

- **Reflected XSS** — injected script that executes immediately from the current request, not stored for later victims.
- **Stored XSS** — injected script saved server-side that executes for every subsequent viewer, generally higher severity.
- **SVG upload vector** — embedding executable JavaScript inside an uploaded SVG file, an often-overlooked stored-XSS source.

## Recap

- XSS remains a consistently common, consistently paid finding despite modern framework mitigations, particularly in rich-text fields, search reflections, and file uploads.
- A proof-of-concept using `document.domain` demonstrates real execution context, not just that a popup appeared.
- SQL injection is rarer in modern applications but typically rated critical when genuinely found, with `sqlmap` remaining the standard confirmation tool.
- Manual testing in Burp Repeater catches context-dependent XSS that automated scanners frequently miss.

**Next up →** [Business logic flaws & chaining bugs](#/lesson/15-bug-bounty/logic-and-chains)
