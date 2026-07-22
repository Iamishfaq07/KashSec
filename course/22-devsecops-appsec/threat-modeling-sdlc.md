# Threat Modeling in the SDLC

Threat modeling is the practice of thinking about what can go wrong *before* you write or ship the code. Done well, it prevents entire classes of bugs instead of finding them later.

## Why it belongs in DevSecOps

Scanning tools find known patterns. Threat modeling finds design flaws — the expensive ones that scanners miss (broken authorization logic, dangerous trust boundaries, missing abuse controls).

## A lightweight process that works

You do not need a week-long workshop for every feature. A 30–60 minute session with the right questions is often enough.

### 1. Diagram the system

Draw the main components and data flows (users, browsers, APIs, databases, third parties, admin tools). A simple data-flow diagram is enough.

### 2. Identify assets & trust boundaries

What are you protecting (credentials, PII, money, admin functions)? Where does trust change (internet → app, app → database, service A → service B)?

### 3. Enumerate threats

Use a simple framework:

- **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege)
- Or just ask: "What can an attacker with a browser / a stolen token / access to this service do that we don't want?"

### 4. Decide mitigations

For each high-impact threat, decide a control (or accept the risk with a documented reason).

### 5. Track and revisit

Put the results where the team can see them (ticket, ADR, security design review note). Revisit when the design changes.

## When to threat model

- New high-risk features (auth, payments, admin, data export, file upload)
- Major architectural changes
- Before a penetration test (so the test can focus on residual risk)

## Common pitfalls

- Only security people in the room → developers disengage
- Massive documents nobody reads → prefer short, living notes
- Treating it as a one-time gate instead of a recurring design habit

:::tip
The best threat models are done by the people who are building the system, with a security person facilitating. Ownership stays with the team.
:::

## Key terms

- **STRIDE** — a common threat-classification mnemonic
- **Trust boundary** — a place where the level of trust changes
- **Abuse case** — a use case written from the attacker's point of view

## Recap

Threat modeling is design-time security. A short, focused session early prevents findings that would otherwise appear in production or in a pentest report.

???refs
- [OWASP Threat Modeling](https://owasp.org/www-community/Threat_Modeling)
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/)
???