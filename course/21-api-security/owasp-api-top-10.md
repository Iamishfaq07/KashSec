# OWASP API Top 10 (2023)

The OWASP API Security Top 10 is the shared checklist the industry uses for API risk. Learn these ten categories and you can systematically assess almost any modern API.

:::note
This is the 2023 edition. It is different from the classic OWASP Web Top 10 — APIs have their own failure modes.
:::

## The list at a glance

| # | Risk | One-line summary |
|---|------|------------------|
| API1 | Broken Object Level Authorization | User can access objects they shouldn't |
| API2 | Broken Authentication | Weak or broken login / token handling |
| API3 | Broken Object Property Level Authorization | User can read or write sensitive fields |
| API4 | Unrestricted Resource Consumption | No rate limits → DoS or expensive abuse |
| API5 | Broken Function Level Authorization | Regular user can call admin endpoints |
| API6 | Unrestricted Access to Sensitive Business Flows | Automation of high-value actions (buy, vote, etc.) |
| API7 | Server Side Request Forgery | API fetches attacker-controlled URLs |
| API8 | Security Misconfiguration | Default configs, verbose errors, open CORS |
| API9 | Improper Inventory Management | Shadow / zombie APIs still running |
| API10 | Unsafe Consumption of APIs | Trusting data from third-party APIs blindly |

## API1 — Broken Object Level Authorization (BOLA)

The classic IDOR, but for APIs.

```http
GET /api/v1/orders/1042
Authorization: Bearer <alice-token>
```

If Alice can change `1042` to `1043` and see Bob's order, that is BOLA.

**Fix**: every request that touches an object must check that the authenticated user is allowed to access *that specific object*.

## API2 — Broken Authentication

- Weak password policies
- No rate limiting on login / password reset
- JWT with `alg:none` or weak secrets
- Tokens that never expire
- Predictable password-reset tokens

## API3 — Broken Object Property Level Authorization

Even if the user is allowed to see the *object*, they may not be allowed to see or change every *property*.

Example: a user can update their profile, but the API also accepts `"isAdmin": true` or returns the full internal user object including password hashes.

## API4 — Unrestricted Resource Consumption

No rate limits, no payload size limits, no pagination limits. Attackers can:
- Brute-force tokens
- Exhaust CPU with expensive GraphQL queries
- Fill storage with large uploads

## API5 — Broken Function Level Authorization

A normal user discovers `/api/admin/users` or `/api/v1/export-all` and the endpoint only checks that *someone* is logged in, not that they are an admin.

## API6 — Unrestricted Access to Sensitive Business Flows

Buying limited items, booking seats, submitting votes, claiming coupons — anything that has business value and can be automated. Rate limits and CAPTCHAs help, but design-level controls are better.

## API7 — Server Side Request Forgery (SSRF)

The API takes a URL (or a host) from the user and fetches it. Classic targets: cloud metadata (`169.254.169.254`), internal admin panels, Redis, etc.

## API8 — Security Misconfiguration

Verbose error messages, open CORS (`Access-Control-Allow-Origin: *` with credentials), default credentials, unnecessary HTTP methods enabled, missing security headers.

## API9 — Improper Inventory Management

Old API versions (`/v1`, `/v2`, `/internal`) still running, undocumented endpoints, debug endpoints left open in production.

## API10 — Unsafe Consumption of APIs

Your service calls a third-party API and trusts the response completely — no validation, no size limits, no schema checks. A compromised or malicious upstream can poison your system.

:::lab
Take any public or lab API you have access to and map each endpoint against this list. Even a simple mental checklist already surfaces the highest-risk places.
:::

## Key terms

- **BOLA** — Broken Object Level Authorization
- **Function Level Authorization** — checking the *action*, not just the object
- **Shadow API** — an undocumented or forgotten endpoint still reachable

## Recap

Memorise these ten categories. When you test an API, walk through them deliberately. Most real findings fall into API1, API2, API3, or API5.

???refs
- [OWASP API Security Project](https://owasp.org/API-Security/)
- [API Security Top 10 2023 PDF](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
???