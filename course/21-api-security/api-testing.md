# How to actually test APIs

Theory is useless without a practical testing workflow. Here’s a battle-tested approach you can use on real targets (bug bounty, pentests, or your own apps).

## 1. Discover the attack surface

- **Official documentation** — OpenAPI/Swagger, Postman collections, GraphQL introspection
- **Traffic** — proxy the mobile app or SPA with Burp / mitmproxy / Caido and watch every call
- **JavaScript files** — many SPAs embed API routes and even keys
- **Wayback / gau / katana** — historical endpoints that may still be alive
- **Wordlists** — `api`, `v1`, `v2`, `internal`, `admin`, `graphql`, `graphiql`, `swagger`

## 2. Map authentication

- How do you obtain a token? (login, OAuth, API key portal)
- Where is the token sent? (Authorization header, cookie, query parameter)
- Can you use the token from a different IP / device?
- What happens when the token expires or is revoked?

## 3. Core test cases (do these on every interesting endpoint)

| Test | What you’re looking for |
|------|-------------------------|
| Change object ID to another user’s | BOLA |
| Replay a privileged request with a low-privilege token | BFLA |
| Add extra fields on create/update | Mass assignment |
| Remove or alter authorization header | Proper 401 vs 200 |
| Send unexpected content types / huge payloads | Parsing & DoS issues |
| Change HTTP method | Method-based authorization bypass |
| Explore sequential IDs | Predictable object references |

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

## 6. Reporting tips

A good API finding report contains:

- Exact request & response (with redacted secrets)
- Two different users demonstrating the broken authorization
- Clear impact (“any user can read any other user’s invoices”)
- Suggested fix (object-level check, allow-list, etc.)

## Key takeaway

The highest-value API bugs are still found with two browser profiles, a proxy, and systematic ID changing. Tools help you scale; they don’t replace understanding the application.

:::lab
Pick a deliberately vulnerable API lab (crAPI, vAPI, Damn Vulnerable GraphQL Application, or PortSwigger’s API labs). Work through the core test cases above and write a short report for at least one BOLA finding.
:::

???refs
- [PortSwigger API testing](https://portswigger.net/web-security/api-testing)
- [crAPI (OWASP)](https://github.com/OWASP/crAPI)
???