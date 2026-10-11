# Your API Security Roadmap

You now have the mental models and a practical testing process. Here's how to keep growing — API security is one of the fastest-moving specialties in AppSec, and the gap between "knows the OWASP list" and "finds real bugs quickly" is almost entirely built through repetition.

:::tip
The fastest way to get good at this is volume: test more APIs, on more labs, more often, using the same six-question checklist every time. Depth of practice beats breadth of reading past a certain point.
:::

## Immediate next steps (next 2–4 weeks)

1. Finish the capstone lab on crAPI or an equivalent vulnerable API
2. Re-test one of your own projects (or a friend's) with the dual-account method
3. Read the full [OWASP API Security Top 10](https://owasp.org/API-Security/) and map every item to a concrete test you can perform
4. Add API testing to your bug-bounty or personal lab routine

## Skills to deepen

| Skill | Why it matters | How to practice |
|-------|----------------|-----------------|
| **GraphQL security** | Growing rapidly; different attack surface | Damn Vulnerable GraphQL Application + InQL |
| **OAuth / OIDC flows** | Most modern auth is built on them | PortSwigger OAuth labs + reading real provider docs |
| **gRPC & non-HTTP APIs** | Common in internal microservice environments | Learn protobuf basics and grpcurl |
| **API gateways & WAFs** | Real production defenses | Experiment with rate-limit bypasses and header tricks |
| **Automation** | Scale your testing | Write Nuclei templates and small Python/Go tools |

### Why OAuth deserves special attention next

Everything in this path assumed the token was already issued correctly. OAuth 2.0 / OIDC is the machinery that actually issues those tokens across most modern systems — and misconfigured redirect URIs, weak state parameters, and implicit-flow leftovers are their own well-documented, high-impact bug class. If you found BOLA and JWT attacks interesting, OAuth flow abuse is the natural next specialty, because it sits one layer earlier in the same trust chain.

## Career angles

- **AppSec / Product Security** — API reviews are a core part of the job
- **Bug Bounty** — API bugs (especially BOLA) pay consistently
- **Penetration Testing** — almost every modern assessment includes APIs
- **Cloud / Platform Security** — service-to-service APIs and IAM

## Recommended resources

- OWASP API Security Project
- PortSwigger Web Security Academy (API & GraphQL paths)
- "Hacking APIs" by Corey Ball (book)
- crAPI + vAPI for continuous practice
- Real bug-bounty write-ups that mention BOLA / IDOR / mass assignment

## 🧪 Hands-on lab — build a personal API testing checklist

Before moving on, consolidate everything from this path into one artifact you'll actually reuse:

1. Write out, from memory, the six-question mental model from the "what are APIs" lesson.
2. Under it, list the ten OWASP API Top 10 categories with one test technique each, in your own words — not copied from the lesson.
3. Add your own "first five minutes on a new target" checklist: what do you do the moment you get a new API to test?
4. Save this somewhere you'll actually open again (a notes app, a personal repo) — the goal is a living document you refine every time you test a new API, not a one-time exercise.

:::challenge Test yourself
1. Name the single habit from this lesson that "finds more real vulnerabilities than most automated scanners."
2. Why does OAuth/OIDC sit "one layer earlier" than the JWT attacks covered earlier in this path?
3. Pick one skill from the table above you don't yet have, and write one sentence on how you'd start practicing it this week.
:::

## Final mindset

Every time you see an API call, ask:

> "If I change the ID, or replay this as another user, or add an extra field — what happens?"

That single habit will find more real vulnerabilities than most automated scanners.

You now have the foundation. Go break (authorized) things safely and build the muscle memory.

???refs
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [PortSwigger Web Security Academy — API testing](https://portswigger.net/web-security/api-testing)
- [crAPI (OWASP)](https://github.com/OWASP/crAPI) — the main lab referenced throughout this path
???

---

**Path complete.**
Return to the [course roadmap](#/roadmap) or jump into a [practice track](#/tracks).
