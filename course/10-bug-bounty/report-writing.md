# Writing effective bug bounty reports

Path 09.7 taught the professional pentest report structure. Bug bounty reporting uses the same underlying discipline, adapted for a faster-moving, higher-volume, triage-driven context. Getting this right directly determines whether you get paid, and how quickly.

## Why bug bounty reports have their own conventions

Unlike a formal pentest report (written once, for one client relationship), a bug bounty report is read by a **triager** — often reviewing dozens of submissions across many researchers and programs — who needs to validate your finding **fast**. A report that takes 30 seconds to understand and reproduce gets triaged (and paid) far faster than one requiring back-and-forth clarification.

## The core structure, bug-bounty-optimised

```markdown
## Title
Reflected XSS in search parameter allows session token theft

## Summary
The `q` parameter on `/search` is reflected into the page without
proper output encoding, allowing arbitrary JavaScript execution in
the context of any user who visits a crafted link.

## Steps to Reproduce
1. Navigate to: `https://example.com/search?q=<script>alert(document.domain)</script>`
2. Observe the JavaScript executes, confirming the injection point

## Proof of Concept
```html
https://example.com/search?q=<script>alert(document.domain)</script>
```
[Screenshot/video showing the alert firing]

## Impact
An attacker could craft a malicious link that, when clicked by a
victim, executes arbitrary JavaScript in their session — enabling
session cookie theft (if not HttpOnly), account takeover, or
further phishing within the trusted domain context.

## Suggested Fix
Apply context-appropriate output encoding to the `q` parameter
before reflecting it into the HTML response. See OWASP's XSS
Prevention Cheat Sheet: [link]

## Severity
Medium — reflected XSS requiring user interaction (link click)
CVSS 3.1: 6.1 (AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N)
```

This mirrors Path 09.7's four-part structure exactly (title/summary, reproduction, impact, remediation) — just formatted for fast triage rather than an executive audience.

## The single most impactful habit: a working Proof of Concept

Recall Path 07's hands-on labs — every technique you practised produced something concrete: a request in Burp Repeater, a specific payload, a specific URL. A bug bounty report's PoC should be **exactly that** — something a triager can literally copy, paste, and immediately observe the same result themselves, with **zero ambiguity**.

```bash
# A genuinely excellent PoC — copy-pasteable, self-contained:
curl -s "https://example.com/api/user?id=1024" \
  -H "Cookie: session=YOUR_TEST_SESSION_HERE" | jq

# Compare to a vague, unhelpful PoC:
# "I found that if you change the ID in the URL you can see other people's data"
```

The `curl` version above requires zero interpretation — a triager runs it, sees the leaked data structure, and validates the finding in seconds. The vague description requires them to reconstruct your exact steps themselves, adding delay and frustration on both sides.

## Video PoCs — increasingly expected for complex bugs

For anything involving multiple steps, timing, or UI interaction (a race condition, a multi-step business logic flaw covered in the next lesson), a short screen recording is often far more convincing and faster to triage than a purely written description:

```bash
# Simple screen recording on Kali using ffmpeg:
ffmpeg -f x11grab -s 1920x1080 -i :0.0 -f pulse -i default poc-video.mp4
```

Many programs explicitly note in their submission guidelines whether video PoCs are preferred for certain vulnerability classes — always check.

## Severity justification — don't just assert it, show your work

Recall Path 09.7's CVSS discipline. In bug bounty specifically, triagers frequently **downgrade** severity if the report doesn't clearly justify the claimed impact:

```markdown
❌ Weak: "This is critical because it's a security vulnerability."

✅ Strong: "This IDOR allows any authenticated user (even a free-tier
account) to read the full billing history — including partial credit
card numbers and billing addresses — of any other user by
incrementing a sequential integer ID, with zero rate limiting
observed during testing. Given the sensitivity of financial PII
and the trivial exploitability (no special tooling required, just
URL manipulation), I've rated this Critical per your program's
vulnerability rating taxonomy."
```

Explicitly referencing the **specific program's own published severity taxonomy** (many programs, like Bugcrowd, publish one — see Path 10.1's reference) when justifying your rating shows the triager you've done your homework and are arguing from their own stated criteria, not just your personal opinion.

## What NOT to do — common mistakes that hurt your submission

- **Spamming low-quality/automated-scanner output** without manual verification — most programs explicitly prohibit this, and it damages your reputation on the platform (some platforms track and penalise a poor "signal ratio").
- **Submitting theoretical findings without a working PoC** ("this endpoint might be vulnerable to X, you should check") — a huge fraction of programs will close these as "not applicable" or "needs more info," costing you response cycles even if you're technically correct.
- **Testing against real user data unnecessarily** — recall Path 09.6's "demonstrate, don't exfiltrate" principle, doubly important here since you don't have a direct contractual relationship softening any misstep.
- **Re-submitting a "won't fix" finding repeatedly** without new information — if a triager has made a considered decision, respectfully accept it (or use the platform's formal appeal/mediation process if one exists) rather than resubmitting the same report.
- **Public disclosure before authorization** — nearly every program requires explicit permission before you publish any details publicly, even after the bug is fixed; violating this can result in program bans and, in serious cases, legal consequences.

## Understanding a report's lifecycle states

A submitted report moves through a series of named states on most platforms, and understanding what each one actually means avoids a lot of unnecessary anxiety and misjudged follow-up. **New/Pending** means it hasn't been triaged yet — normal to sit here for hours to days depending on program volume. **Triaged** means a human has validated the finding and it's now in the client's queue for fixing — this is the meaningful "yes, this is real" milestone, even before payment is finalised. **Informative** means the report was read but doesn't meet the bar for a paid finding (often correct-but-low-impact, or already-known behaviour) — worth reading the triager's reasoning carefully rather than assuming a mistake. **Duplicate** and **Not Applicable** are self-explanatory but worth the same careful reading — sometimes a "duplicate" marking references an internal issue you had no way of knowing about, which is a legitimate, if frustrating, outcome rather than an error to dispute. Knowing this vocabulary means you can track your own submissions' health across a program without needing to ask "what does this status mean" every time.

## Handling triager questions and disagreements professionally

```markdown
Triager: "We're unable to reproduce this. Can you provide more detail?"

Good response:
"Thanks for looking into this! Here's a fresh recording showing the
exact steps: [new video link]. I tested this again just now on
2026-07-13 at 14:30 UTC using Firefox 128 — happy to hop on a call
or provide additional detail if useful."

Poor response:
"It clearly works, did you even try it?"
```

Recall Path 09's professional discipline, applied here just as much — triagers are humans doing a high-volume job, and a collaborative, patient tone consistently produces better outcomes (faster resolution, fairer severity assessment, future private program invitations per Path 10.2) than an adversarial one, even when you're confident you're right.

## 🧪 Lab — Rewrite a real report

Go back to 3 disclosed reports you read in Path 10.1's lab (HackerOne Hacktivity). For each:

1. Identify whether it followed the structure in this lesson (title, summary, PoC, impact, fix, severity justification).
2. Note specifically what made the PoC section effective (or not).
3. Pick your weakest-structured example and **rewrite** just its PoC and impact sections to match the standard in this lesson, using only information visible in the original report.

This rewriting exercise builds the exact muscle memory needed to write your own reports quickly and effectively once you find a real, valid bug of your own.

:::challenge Test yourself
A researcher submits: "The login page might be vulnerable to SQL injection, you should check the username field." Why is this likely to be closed quickly as "needs more info" or "not applicable," even if the vulnerability might genuinely exist?

<details><summary>Show answer</summary>There's no <strong>working proof of concept</strong> — no specific payload tried, no specific observed result (an error message, a timing difference, a data leak), nothing the triager can directly verify themselves. A report asserting a vulnerability <em>might</em> exist without demonstrating that it <em>does</em> exist, concretely and reproducibly, places the burden of actually finding and confirming the bug back on the triager — which most programs' guidelines explicitly discourage and will decline to reward, regardless of whether the underlying hunch was technically correct.</details>
:::

## Key terms

- **Triager** — the person (or team) reviewing and validating bug bounty submissions.
- **Proof of Concept (PoC)** — a concrete, reproducible demonstration of the vulnerability, ideally copy-pasteable.
- **Signal ratio** — a researcher's ratio of valid-to-invalid submissions, tracked by some platforms and affecting reputation.
- **Vulnerability Rating Taxonomy** — a program's published severity classification standard (Path 10.1).

## Recap

- Bug bounty reports use the same four-part structure as formal pentest reports, optimised for fast triager validation.
- A concrete, copy-pasteable Proof of Concept is the single highest-impact element of any report.
- Justify severity by referencing the specific program's own published taxonomy, not just personal assertion.
- Avoid theoretical findings, unnecessary real-data access, unauthorized disclosure, and adversarial communication with triagers.
- Professional, patient communication consistently produces better long-term outcomes than confrontation.

???refs
- [HackerOne — How to Write a Great Vulnerability Report](https://www.hackerone.com/vulnerability-management/how-write-great-vulnerability-report) — the platform's own official guidance.
- [Bugcrowd — Vulnerability Rating Taxonomy](https://bugcrowd.com/vulnerability-rating-taxonomy) — referenced severity standard.
- [OWASP — Vulnerability Disclosure Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [Disclose.io](https://disclose.io/) — standardised disclosure and safe harbor resources.
???

**Next up →** [Hunting for IDOR & access control bugs](#/lesson/10-bug-bounty/hunting-idor)
