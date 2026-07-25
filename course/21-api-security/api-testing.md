# How to actually test APIs

Theory is useless without a practical testing workflow. Here's a battle-tested approach you can use on real targets (bug bounty, pentests, or your own apps) — it pulls together every vulnerability class covered earlier in this path into one repeatable process.

:::tip
The best API testers don't memorize a hundred payloads — they run the same small set of questions (who's allowed, what fields, what limits, what happens on error) against every single endpoint, methodically. Consistency beats cleverness here.
:::

## 1. Discover the attack surface

- **Official documentation** — OpenAPI/Swagger, Postman collections, GraphQL introspection
- **Traffic** — proxy the mobile app or SPA with Burp / mitmproxy / Caido and watch every call
- **JavaScript files** — many SPAs embed API routes and even keys
- **Wayback / gau / katana** — historical endpoints that may still be alive
- **Wordlists** — `api`, `v1`, `v2`, `internal`, `admin`, `graphql`, `graphiql`, `swagger`

Discovery matters more for APIs than for classic web apps, because — as the "improper inventory management" category from the OWASP Top 10 lesson pointed out — old, undocumented, or "internal" endpoints frequently keep working long after everyone stopped thinking about them.

## 2. Map authentication

- How do you obtain a token? (login, OAuth, API key portal)
- Where is the token sent? (Authorization header, cookie, query parameter)
- Can you use the token from a different IP / device?
- What happens when the token expires or is revoked?

## 3. Core test cases (do these on every interesting endpoint)

| Test | What you're looking for |
|------|-------------------------|
| Change object ID to another user's | BOLA |
| Replay a privileged request with a low-privilege token | BFLA |
| Add extra fields on create/update | Mass assignment |
| Remove or alter authorization header | Proper 401 vs 200 |
| Send unexpected content types / huge payloads | Parsing & DoS issues |
| Change HTTP method | Method-based authorization bypass |
| Explore sequential IDs | Predictable object references |

Notice this table is essentially a checklist version of every lesson so far in this path — that's deliberate. Testing an API well means walking this list against *every* endpoint, not just the ones that look interesting at a glance.

## 4. Tooling that actually helps

- **Burp Suite / Caido** — the daily driver for interactive testing
- **Postman / Insomnia** — great for organizing collections and environments
- **Nuclei** — excellent for known API misconfigurations and technology fingerprints
- **GraphQL tools** — GraphQL Voyager, InQL, Clairvoyance
- **ffuf / gobuster** — content discovery
- **Your own scripts** — once you find a pattern, automate the rest

## 5. A practical workflow for a new target

1. Create two accounts (or one normal + one elevated if possible)
2. Map all endpoints while using the application normally
3. For every endpoint that takes an ID → test BOLA
4. For every endpoint that looks privileged → test with the low-privilege account
5. For every create/update → test mass assignment
6. Look at every response for excessive data
7. Check rate limits on login, password reset, and expensive operations
8. If GraphQL exists → introspection + nested query + field-level auth tests

## A worked example: applying the workflow

Say you're given a fresh target: a project-management SaaS API. Following the workflow:

1. Register two free accounts, A and B, on separate projects.
2. Use the app normally as A: create a project, add a task, invite a teammate. Capture every API call in Burp.
3. For `GET /api/v1/projects/{id}`, swap in B's project ID while authenticated as A → returns B's project data. **BOLA found.**
4. For `POST /api/v1/projects/{id}/archive` (an owner-only action in the UI), call it as a non-owner member of A's project → succeeds anyway. **BFLA found.**
5. For `PATCH /api/v1/tasks/{id}`, add an unexpected `"assignedRole":"owner"` field → check whether it sticks. **Mass assignment candidate.**
6. Review the raw JSON for `GET /api/v1/users/me` → notice it includes `stripeCustomerId`, never shown in the UI. **Excessive data exposure.**

Four distinct, real finding categories, found in under an hour, entirely by working the checklist systematically rather than guessing.

## 6. Reporting tips

A good API finding report contains:

- Exact request & response (with redacted secrets)
- Two different users demonstrating the broken authorization
- Clear impact ("any user can read any other user's invoices")
- Suggested fix (object-level check, allow-list, etc.)

## 🧪 Hands-on lab — full workflow on a vulnerable API

1. Pick a deliberately vulnerable API lab (crAPI, vAPI, Damn Vulnerable GraphQL Application, or PortSwigger's API labs).
2. Run steps 1–8 of the practical workflow above against it, keeping written notes as you go.
3. For every finding, write a mini-report following the four bullet points in the reporting tips section.
4. Compare your finding count and categories against the OWASP API Top 10 list from earlier — how many categories did you personally trigger?

:::lab
Pick a deliberately vulnerable API lab (crAPI, vAPI, Damn Vulnerable GraphQL Application, or PortSwigger's API labs). Work through the core test cases above and write a short report for at least one BOLA finding.
:::

:::challenge Test yourself
1. Why does creating two accounts before you start testing matter more for APIs than for a typical single-user web app test?
2. In the worked example above, which finding would you report first, and why — rank by likely impact.
3. What's one reason automated scanners alone tend to under-perform on API testing compared to a human working the manual workflow above?
:::

## Key terms

- **Attack surface mapping** — the discovery phase of identifying every reachable endpoint before testing begins
- **Proxy (Burp/Caido)** — a tool that sits between client and server, letting you inspect and modify every request
- **Content discovery** — using wordlists and tools (ffuf, gobuster) to find undocumented paths
- **Two-account testing** — the core technique behind finding BOLA/BFLA: perform an action as one user, replay as another

## Recap

The highest-value API bugs are still found with two browser profiles, a proxy, and systematic ID changing. Tools help you scale; they don't replace understanding the application. Run the same checklist against every endpoint, and the majority of your findings will fall into the categories this entire path has already covered.

???refs
- [PortSwigger API testing](https://portswigger.net/web-security/api-testing)
- [crAPI (OWASP)](https://github.com/OWASP/crAPI)
- [OWASP Web Security Testing Guide — API Testing](https://owasp.org/www-project-web-security-testing-guide/) — a broader methodology reference
???
