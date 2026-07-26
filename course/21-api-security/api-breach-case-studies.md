# Real-World API Breach Case Studies

The why-API-security lesson listed BOLA, JWT issues, GraphQL abuse, and mass assignment as recurring themes in high-profile breaches. This lesson walks through how those patterns actually played out in real, publicly documented incidents — because seeing the exact mechanics of a real breach makes the abstract category concrete in a way a checklist alone can't.

## Why studying real breaches matters more than memorizing categories

The OWASP API Top 10 (next lesson) gives you the vocabulary. Real breach post-mortems give you the *mechanism* — the specific sequence of small, individually-reasonable engineering decisions that combined into a severe, exploitable flaw. Almost no real API breach is a single, obviously catastrophic bug; it's usually a chain of small gaps, each defensible on its own, that an attacker strings together.

## Pattern 1 — the sequential ID enumeration breach

A recurring shape across multiple large, publicly reported incidents: an API endpoint that returns a user's profile or order data based on a sequential numeric ID, with no server-side check that the requesting user actually owns that ID. An attacker with one valid, authenticated session simply increments the ID — `/api/users/1001`, `/api/users/1002`, `/api/users/1003` — and scripts it into a loop, extracting an entire user database in minutes. This is BOLA, exactly as the why-API-security lesson described, but seeing it as a real production incident (rather than a lab exercise) makes clear how quickly a single missing `WHERE user_id = current_user.id` clause scales into a mass breach.

## Pattern 2 — the internal API accidentally left public

A genuinely common shape: an API endpoint built for internal, trusted use (an admin dashboard, an internal tool) gets deployed on the same public-facing infrastructure as customer-facing endpoints, with the assumption that "nobody will find the URL" serving as the only actual access control. Directly connecting to the shadow-and-zombie-APIs lesson later in this path, this specific pattern — security through obscurity as the sole real control — recurs across breach post-mortems with striking consistency, since URL discovery (through client-side JavaScript, mobile app decompilation, or simple guessing) defeats it trivially.

## Pattern 3 — the long-lived token that outlived its purpose

Directly connecting to the broken-auth-jwt lesson: several notable breaches trace back to authentication tokens issued with no meaningful expiration, or a revocation mechanism that existed on paper but wasn't actually enforced consistently across every service consuming that token. A token stolen months earlier (through an unrelated, seemingly minor incident) remained fully valid and usable, turning what should have been a contained, time-limited exposure into an open-ended one.

## Pattern 4 — GraphQL introspection left enabled in production

Directly connecting to the graphql-security lesson: a genuinely common real-world finding is a GraphQL API with introspection (the ability to query the schema itself, discovering every available field and type) left enabled in a production environment, when it was only ever intended for development convenience. This single misconfiguration hands an attacker a complete, self-documenting map of the entire API's data model, dramatically accelerating every subsequent stage of an attack.

## The common thread across every pattern

:::danger Every pattern here is a missing server-side check, not a sophisticated exploit
None of these patterns require advanced technical sophistication to exploit — sequential ID incrementing, trying an obvious internal-sounding URL, replaying an old token, or querying an exposed schema are all trivial, low-skill actions. The sophistication, when it exists at all in these breaches, is almost always on the *defensive* side that failed to exist — a missing authorization check, a missing token expiration policy, a missing production configuration review — not on the attacker's side. This is exactly why this path emphasizes systematic checklists (the OWASP API Top 10, next) over exotic technique: most real API breaches are caught by disciplined basics, not clever detection.
:::

## 🧪 Hands-on lab — reconstruct a breach chain

1. Research one publicly documented API breach (search "API breach post-mortem" or "API vulnerability disclosure writeup" — several security vendors and affected companies have published detailed technical breakdowns).
2. Identify which OWASP API Top 10 category (or categories — many real breaches combine more than one) the root cause maps to.
3. Write a one-paragraph summary of the specific chain of decisions that led to the breach, in your own words, as if explaining it to a non-technical stakeholder.

:::challenge Test yourself
1. Why does "nobody will find this URL" fail as a real access control, given how APIs actually get discovered in practice?
2. In the sequential ID pattern, what's the one specific server-side change that would have prevented the breach entirely?
3. Why does GraphQL introspection left enabled in production accelerate every other stage of an attack, not just the reconnaissance stage?
:::

## Key terms

- **Post-mortem** — a detailed technical writeup explaining the root cause and timeline of a security incident.
- **Security through obscurity** — relying on secrecy of implementation details (like an undocumented URL) as the sole access control.
- **Breach chain** — the sequence of individually small gaps that combine into a severe, exploitable vulnerability.

## Recap

Real API breaches are almost never a single catastrophic bug — they're chains of small, individually defensible engineering shortcuts that combine into severe exposure. Sequential ID enumeration, internal APIs left publicly accessible, long-lived unrevoked tokens, and exposed GraphQL introspection are recurring, well-documented shapes across real incidents. None require sophisticated attacker technique — they're caught (or missed) by disciplined basics, which is exactly the checklist-driven approach this path builds toward next.

???refs
- [OWASP API Security — Real World Examples](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [HackerOne Hacktivity — API vulnerability reports](https://hackerone.com/hacktivity?querystring=API)
???
