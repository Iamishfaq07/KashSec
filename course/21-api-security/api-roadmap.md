# Your API Security Roadmap

You now have the mental models and a practical testing process. Here’s how to keep growing.

## Immediate next steps (next 2–4 weeks)

1. Finish the capstone lab on crAPI or an equivalent vulnerable API
2. Re-test one of your own projects (or a friend’s) with the dual-account method
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

## Career angles

- **AppSec / Product Security** — API reviews are a core part of the job
- **Bug Bounty** — API bugs (especially BOLA) pay consistently
- **Penetration Testing** — almost every modern assessment includes APIs
- **Cloud / Platform Security** — service-to-service APIs and IAM

## Recommended resources

- OWASP API Security Project
- PortSwigger Web Security Academy (API & GraphQL paths)
- “Hacking APIs” by Corey Ball (book)
- crAPI + vAPI for continuous practice
- Real bug-bounty write-ups that mention BOLA / IDOR / mass assignment

## Final mindset

Every time you see an API call, ask:

> “If I change the ID, or replay this as another user, or add an extra field — what happens?”

That single habit will find more real vulnerabilities than most automated scanners.

You now have the foundation. Go break (authorized) things safely and build the muscle memory.

---

**Path complete.**  
Return to the [course roadmap](#/roadmap) or jump into a [practice track](#/tracks).
