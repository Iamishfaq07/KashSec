# Threat Modeling in the SDLC

Threat modeling is the practice of thinking about what can go wrong *before* you write or ship the code. Done well, it prevents entire classes of bugs instead of finding them later — it's the one activity in this whole path that operates purely on design, before a single line exists to scan.

:::tip
The question threat modeling answers is not "is this code secure?" — that's what scanners are for. It's "is this *design* secure, even if every line of code is implemented perfectly?"
:::

## Why it belongs in DevSecOps

Scanning tools find known patterns. Threat modeling finds design flaws — the expensive ones that scanners miss entirely, because there's nothing pattern-matchable about them:

- Broken authorization logic ("any logged-in user can view any other user's invoice by changing an ID in the URL")
- Dangerous trust boundaries ("the internal admin API trusts any request from inside the VPC, and the VPC also contains the marketing website's contractor-managed CMS")
- Missing abuse controls ("the password reset endpoint has no rate limit, so it can be used to enumerate every registered email address")

None of these are a vulnerable function call. A SAST tool has nothing to flag. This is exactly the gap the "Side by side" table in the SAST/DAST/SCA lesson pointed at — none of the scanners find design flaws, and this lesson is the answer to that gap.

## A lightweight process that works

You do not need a week-long workshop for every feature. A 30–60 minute session with the right questions is often enough, and doing it lightweight and often beats doing it heavyweight and rarely.

### 1. Diagram the system

Draw the main components and data flows (users, browsers, APIs, databases, third parties, admin tools). A simple data-flow diagram is enough — boxes and arrows on a whiteboard, not a formal UML document.

### 2. Identify assets & trust boundaries

What are you protecting (credentials, PII, money, admin functions)? Where does trust change (internet → app, app → database, service A → service B)? Every arrow that crosses a trust boundary is a place where an attacker gets to act.

### 3. Enumerate threats

Use a simple framework:

- **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege)
- Or just ask: "What can an attacker with a browser / a stolen token / access to this service do that we don't want?"

| STRIDE category | Plain-language question | Example finding |
|---|---|---|
| Spoofing | Can someone pretend to be another user or service? | No mutual TLS between two internal services that assume they trust each other |
| Tampering | Can someone modify data they shouldn't? | Price sent from client and trusted by the server on checkout |
| Repudiation | Can someone deny doing something, with no way to prove otherwise? | Admin actions not logged with who/when |
| Information disclosure | Can someone see data they shouldn't? | Error messages leaking stack traces with internal paths |
| Denial of service | Can someone make this unavailable? | An endpoint with no rate limit that triggers an expensive database query |
| Elevation of privilege | Can someone gain more access than they should have? | A "become this user" support tool with no audit trail or scoping |

### 4. Decide mitigations

For each high-impact threat, decide a control (or accept the risk with a documented reason). "We know about this and are accepting it because X" is a legitimate outcome — it's the undocumented, unconsidered risks that cause incidents.

### 5. Track and revisit

Put the results where the team can see them (ticket, ADR, security design review note). Revisit when the design changes — a threat model for the system as it existed six architecture changes ago is not describing the system you're actually running.

## Worked example: a file-upload feature

A team is adding "upload your profile photo." A 30-minute threat model surfaces:

- **Trust boundary**: uploaded file content is fully attacker-controlled, even though it "just" looks like an image
- **Tampering**: what stops someone uploading a `.php` or `.jsp` file with a `.jpg` extension?
- **Information disclosure**: if uploads are stored at a predictable URL pattern, can one user enumerate other users' private photos?
- **Denial of service**: what stops someone uploading a 4GB file, or a "zip bomb" image, repeatedly?

Decided mitigations: validate file content (not just extension) against actual image magic bytes, store uploads outside the web root with randomized non-guessable names, enforce a size limit server-side, and re-encode images on upload rather than serving the uploaded bytes directly. All four are cheap to build now and expensive to retrofit after the feature has shipped — this is the "before and after" cost curve from the first lesson in this path, applied concretely.

## When to threat model

- New high-risk features (auth, payments, admin, data export, file upload)
- Major architectural changes
- Before a penetration test (so the test can focus on residual risk instead of things a 30-minute session would have caught for free)

## Common pitfalls

- Only security people in the room → developers disengage, and the model reflects the security team's guesses about the system rather than the builders' actual knowledge of it
- Massive documents nobody reads → prefer short, living notes over a 40-page threat model template that gets filled out once and never opened again
- Treating it as a one-time gate instead of a recurring design habit — a system's threat model goes stale the moment the architecture changes and nobody updates it

:::danger
The most dangerous outcome of threat modeling is not "we missed a threat" — it's "we found threats, wrote them down, and never assigned an owner or a decision." A threat model that produces no action is worse than not having done one, because it creates the appearance of due diligence without the substance.
:::

## 🧪 Hands-on lab — threat model a real feature

Pick a feature from a project you're working on, or use "users can reset their password by email" as a stand-in if you don't have one handy.

1. Draw the data flow: user → browser → app server → email service → database. Mark where trust changes.
2. Walk through all six STRIDE categories against this flow. For each, write down at least one concrete threat — even a rough one.
3. For your three highest-impact threats, write a one-line mitigation each.
4. For one threat you decide *not* to mitigate right now, write the "accepted because..." justification a real team would need to write down.
5. Time yourself. If this took under 45 minutes, you've just demonstrated that lightweight threat modeling is genuinely fast enough to do routinely.

:::challenge Test yourself
1. A team says "we don't need to threat model, we already run SAST and DAST on everything." What's wrong with that reasoning?
2. Using STRIDE, name one threat category that a "forgot password" feature is especially prone to, and explain why.
3. Why is "accept the risk with a documented reason" a legitimate outcome of threat modeling, rather than a failure to fix everything?
:::

## Key terms

- **STRIDE** — a common threat-classification mnemonic (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege)
- **Trust boundary** — a place where the level of trust changes, and where an attacker gets leverage
- **Abuse case** — a use case written from the attacker's point of view, the mirror image of a user story
- **Data-flow diagram** — a simple diagram of components and how data moves between them, the usual starting point for a threat model
- **Residual risk** — whatever risk remains after mitigations are applied, which is what a pentest should actually be checking

## Recap

Threat modeling is design-time security — the one control in this path that catches problems no scanner ever will. A short, focused session early prevents findings that would otherwise appear in production or in a pentest report, but only if it produces owned, tracked decisions rather than a document nobody revisits.

???refs
- [OWASP Threat Modeling](https://owasp.org/www-community/Threat_Modeling)
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/)
- [Elevation of Privilege card game](https://shostack.org/games/elevation-of-privilege) — a free, low-friction way to run a STRIDE session with a team new to the practice
???
