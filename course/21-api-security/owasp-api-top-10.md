# OWASP API Top 10 (2023)

The OWASP API Security Top 10 is the shared checklist the industry uses for API risk. Learn these ten categories and you can systematically assess almost any modern API — this list is the backbone the rest of this path is built on.

:::note
This is the 2023 edition. It is different from the classic OWASP Web Top 10 — APIs have their own failure modes, and several of these categories (BOLA, broken function-level auth, unsafe consumption) barely have an equivalent in the classic web list.
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

:::tip
Notice the order isn't arbitrary — it's ranked by real-world prevalence and impact. API1 (BOLA) tops the list for a reason: it's the single most commonly found, most damaging, and easiest-to-exploit category across real bug bounty and pentest data.
:::

## API1 — Broken Object Level Authorization (BOLA)

The classic IDOR, but for APIs, and the most common finding in this entire list.

```http
GET /api/v1/orders/1042
Authorization: Bearer <alice-token>
```

If Alice can change `1042` to `1043` and see Bob's order, that is BOLA.

**Fix**: every request that touches an object must check that the authenticated user is allowed to access *that specific object* — not just that they're logged in. This gets its own full lesson right after this one, because it deserves the depth.

## API2 — Broken Authentication

- Weak password policies
- No rate limiting on login / password reset
- JWT with `alg:none` or weak secrets
- Tokens that never expire
- Predictable password-reset tokens

**Example**: a password-reset endpoint issues a 4-digit numeric code with no attempt limit. That's only 10,000 possibilities — trivially brute-forceable in seconds against an unthrottled endpoint.

## API3 — Broken Object Property Level Authorization

Even if the user is allowed to see the *object*, they may not be allowed to see or change every *property*.

Example: a user can update their profile, but the API also accepts `"isAdmin": true` or returns the full internal user object including password hashes. This category folds together what used to be two separate 2019 categories (excessive data exposure and mass assignment) — both are property-level authorization failures, just in opposite directions (reading too much vs. writing too much).

## API4 — Unrestricted Resource Consumption

No rate limits, no payload size limits, no pagination limits. Attackers can:
- Brute-force tokens
- Exhaust CPU with expensive GraphQL queries
- Fill storage with large uploads

**Example**: an endpoint that generates a PDF report accepts an unlimited `rows` parameter. A request for a million-row report can pin a server's CPU for minutes, and a handful of concurrent requests like it can take the service down entirely — no exploit needed, just an unchecked number.

## API5 — Broken Function Level Authorization

A normal user discovers `/api/admin/users` or `/api/v1/export-all` and the endpoint only checks that *someone* is logged in, not that they are an admin.

This differs from BOLA (API1) in an important way: BOLA is about *which object* you can touch; broken function-level auth is about *which action* you can perform at all, regardless of object. A user calling `DELETE /api/v1/users/999` when they should only ever be allowed to `GET` their own record is a function-level failure even before you ask whether 999 belongs to them.

## API6 — Unrestricted Access to Sensitive Business Flows

Buying limited items, booking seats, submitting votes, claiming coupons — anything that has business value and can be automated. Rate limits and CAPTCHAs help, but design-level controls are better.

**Example**: a limited-edition sneaker drop's "add to cart" API has no per-account or per-IP limit. A script can claim all available inventory in the first second, before a human ever loads the page — this is a legitimate, frequently-abused business risk that has nothing to do with a traditional "vulnerability" at all.

## API7 — Server Side Request Forgery (SSRF)

The API takes a URL (or a host) from the user and fetches it. Classic targets: cloud metadata (`169.254.169.254`), internal admin panels, Redis, etc. If your course has covered SSRF in an earlier path, this is the exact same bug class, just reached through a JSON API parameter instead of a web form field.

## API8 — Security Misconfiguration

Verbose error messages, open CORS (`Access-Control-Allow-Origin: *` with credentials), default credentials, unnecessary HTTP methods enabled, missing security headers.

**Example**: a staging API left with debug mode on returns full stack traces on error, including the database connection string in the traceback. An attacker doesn't even need to find a real bug — they just need to trigger any error.

## API9 — Improper Inventory Management

Old API versions (`/v1`, `/v2`, `/internal`) still running, undocumented endpoints, debug endpoints left open in production.

**Example**: `/api/v1/users` was deprecated two years ago in favor of `/api/v2/users`, which added proper authorization checks. Nobody decommissioned `/api/v1/`. It still works, still has the old (missing) authorization logic, and nobody on the current team even remembers it exists — a textbook **shadow API**.

## API10 — Unsafe Consumption of APIs

Your service calls a third-party API and trusts the response completely — no validation, no size limits, no schema checks. A compromised or malicious upstream can poison your system. This is the "supply chain" risk from the DevSecOps path, applied specifically to API responses rather than package dependencies.

:::lab
Take any public or lab API you have access to and map each endpoint against this list. Even a simple mental checklist already surfaces the highest-risk places.
:::

## 🧪 Hands-on lab — build your own checklist

1. Pick a REST API you're authorized to test (a lab API like OWASP crAPI or a vulnerable-by-design app is ideal).
2. For every distinct endpoint you find, write its method and path in a table.
3. Add a column for each of the ten categories above, and mark a quick guess (yes/no/unsure) for whether that endpoint might be vulnerable to it — you're not exploiting yet, just triaging.
4. Pick the three endpoints with the most "yes/unsure" marks and describe, in one sentence each, what you'd test first and why.
5. Compare your list against the ranking order (API1 highest impact/prevalence) — did you prioritize the same way OWASP does, or differently? Why?

:::challenge Test yourself
1. Explain the difference between API1 (BOLA) and API5 (broken function-level authorization) in your own words.
2. A staging API endpoint that was deprecated but never removed is still reachable and has weaker authorization than its replacement. Which category does this fall under, and why does "we don't use that anymore" not make it safe?
3. Why did the 2023 revision merge "excessive data exposure" and "mass assignment" into a single "object property level authorization" category?
:::

## Key terms

- **BOLA** — Broken Object Level Authorization
- **Function Level Authorization** — checking the *action*, not just the object
- **Shadow API** — an undocumented or forgotten endpoint still reachable
- **Zombie API** — a deprecated API version still running and still reachable, often with weaker security than its replacement
- **Business flow abuse** — automated exploitation of a legitimate feature for illegitimate scale (API6)

## Recap

Memorise these ten categories. When you test an API, walk through them deliberately. Most real findings fall into API1, API2, API3, or API5 — but a systematic pass through all ten, rather than jumping straight to your favorite bug class, is what separates a thorough assessment from a lucky one.

???refs
- [OWASP API Security Project](https://owasp.org/API-Security/)
- [API Security Top 10 2023 PDF](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- [OWASP crAPI](https://github.com/OWASP/crAPI) — a free, deliberately vulnerable API for practicing everything in this list
???
