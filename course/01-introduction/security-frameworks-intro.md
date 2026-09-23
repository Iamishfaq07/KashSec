# Security frameworks: a beginner's map

You'll hear names like "NIST" and "ISO 27001" constantly once you start reading real job postings or security news. This lesson is a short, plain-English introduction — enough to recognize these names and roughly what they're for, well before Path 23's full GRC & Compliance path covers them in real depth.

:::tip
Think of a security framework as a well-tested checklist and shared vocabulary, built by a whole industry's collective experience, so organizations don't each have to invent "how do we do security" completely from scratch.
:::

## Why frameworks exist at all

Without a shared framework, every organization would have to independently decide what "good security" even means — what to check, what to prioritize, how to measure progress. Frameworks solve this by providing a structured, widely-reviewed reference that organizations (and the security professionals working for them) can align to, communicate around, and be measured against.

## The names you'll hear most often, briefly

- **NIST Cybersecurity Framework (CSF)** — a US government-developed framework organized around five (now six) core functions: Identify, Protect, Detect, Respond, Recover (and a newer Govern function). Widely used across industries, not just government, because of its clear, practical structure.
- **ISO 27001** — an international standard for building and running an **Information Security Management System (ISMS)** — essentially, a structured, ongoing program for managing security risk, rather than a one-time checklist. Companies can be formally certified against it, which shows up constantly in vendor security questionnaires and enterprise sales.
- **CIS Controls** — a more concrete, prioritized list of specific technical safeguards (the kind of practical "do this" list beginners often find easiest to start with), maintained by the nonprofit Center for Internet Security.
- **OWASP Top 10** — specific to web application security (you'll meet this one directly and repeatedly starting in Path 11), a regularly updated list of the most critical web security risks.

## How frameworks connect to what you're actually learning in this course

This isn't abstract policy trivia — nearly every technical topic in this course maps to something a framework organizes formally:

| This course teaches... | A framework organizes it as... |
|---|---|
| Strong passwords, MFA (Path 00) | NIST CSF's "Protect" function; several CIS Controls |
| Detecting an active attack (Path 16's threat hunting) | NIST CSF's "Detect" function |
| Incident response (Path 16) | NIST CSF's "Respond" and "Recover" functions |
| SQL injection, XSS (Path 11) | Directly named items on the OWASP Top 10 |

## Why this matters for your career, even as a beginner

Job postings for nearly every security role reference these frameworks by name — "experience with NIST CSF," "familiarity with ISO 27001 controls" — and being able to say "I know that NIST CSF 2.0 organizes security around six core functions, and here's how the technical skills I've built map onto each one" is a genuinely strong signal in an interview, even without formal compliance experience. Path 20's career-prep material and Path 23's full GRC path both build directly on this foundation.

:::challenge Map a control to a framework function
A company deploys a tool that automatically detects unusual login activity and alerts the security team in real time.

<details><summary>Hint</summary>Is this tool preventing an attack from happening, noticing one that's already happening, or helping clean up afterward?</details>
<details><summary>Show answer</summary>This maps to NIST CSF's <strong>"Detect"</strong> function — the tool's job isn't to prevent the login attempt (that would be "Protect," like MFA) or to clean up afterward (that would be "Respond"/"Recover") — it's specifically about noticing that something unusual is happening as it happens. Being able to place a given control into the right framework function, like this, is exactly the kind of structured thinking these frameworks are designed to teach.</details>
:::

## 🧪 Hands-on lab — map your own knowledge

Pick three specific things you've already learned in this course so far (a topic from Path 00 works fine). For each, guess which NIST CSF function (Identify, Protect, Detect, Respond, Recover, Govern) it most naturally belongs to, and write one sentence explaining your reasoning.

:::challenge Test yourself
1. Name the six core functions of the NIST Cybersecurity Framework.
2. What's the practical difference between ISO 27001 and the CIS Controls, in terms of how concrete each one is?
3. Why is the OWASP Top 10 specifically relevant to web application security rather than security in general?
:::

## Key terms

- **NIST CSF** — a widely-used cybersecurity framework organized around six core functions: Identify, Protect, Detect, Respond, Recover, Govern.
- **ISO 27001** — an international standard for building and certifying an Information Security Management System (ISMS).
- **CIS Controls** — a prioritized, concrete list of technical security safeguards.
- **OWASP Top 10** — a regularly updated list of the most critical web application security risks.

## Recap

- Security frameworks provide a shared, well-tested structure so organizations don't reinvent "what good security looks like" from scratch.
- NIST CSF, ISO 27001, CIS Controls, and the OWASP Top 10 are the names you'll encounter constantly — each with a different focus and level of concreteness.
- Nearly every technical skill this course teaches maps onto a specific framework function, which is genuinely useful vocabulary for job interviews.
- Path 23's full GRC & Compliance path covers all of these in much greater depth once you have this beginner-level map.

[NIST's CSF 2.0 overview](https://www.nist.gov/cyberframework/faqs) lists all six current functions; older CSF 1.1 material lists five because Govern was added in 2.0.

**Next up →** [How to actually learn this](#/lesson/01-introduction/how-to-learn)
