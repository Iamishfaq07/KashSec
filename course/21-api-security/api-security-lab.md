# API Security Capstone Lab

This lab pulls together everything from the path. You will systematically test an API using the techniques you have learned.

:::lab
**Goal**: Find and document at least three distinct API issues (BOLA, auth weakness, excess data, mass assignment, missing rate limit, etc.).
:::

## Recommended targets (legal & free)

- [crAPI](https://github.com/OWASP/crAPI) — intentionally vulnerable API from OWASP
- [vAPI](https://github.com/roottusk/vapi)
- [Damn Vulnerable GraphQL Application](https://github.com/dolevf/Damn-Vulnerable-GraphQL-Application)
- PortSwigger Web Security Academy API / GraphQL labs
- Your own local lab if you have one

**Only test systems you own or have explicit permission to test.**

## Suggested methodology

### 1. Recon

- Map all endpoints (Burp sitemap, OpenAPI/Swagger if available, JS files, mobile traffic).
- Note authentication method (JWT, API key, session, OAuth).
- Identify object identifiers (IDs, UUIDs, emails).

### 2. Authentication tests

- Rate-limit login / reset.
- JWT attacks if JWTs are used (`alg:none`, weak secret, claim tampering).
- Token lifetime and logout behaviour.

### 3. BOLA / IDOR

- Two-account testing on every object reference.
- Horizontal and vertical checks.
- Different HTTP methods on the same resource.

### 4. Property-level issues

- Mass assignment on update endpoints.
- Excessive data in responses.

### 5. GraphQL (if present)

- Introspection.
- Nested query depth.
- Field-level authorization.

### 6. Business logic & rate limits

- High-value flows (purchase, invite, vote, coupon).
- Absence of rate limits on expensive operations.

## Deliverable

Write a short report for each finding:

1. **Title** (e.g. "BOLA on GET /api/orders/{id}")
2. **Request / response** (sanitised)
3. **Impact**
4. **Remediation**

This is exactly the skill that turns into bug-bounty reports and professional AppSec write-ups.

## Stretch goals

- Chain two issues (e.g. excess data exposure → account takeover).
- Produce a one-page executive summary as if you were reporting to a client.

## Recap

You now have a repeatable API testing process. Use it on every new API you meet — labs, bug-bounty programs, or (with permission) real products.

???refs
- [OWASP crAPI](https://github.com/OWASP/crAPI)
- [PortSwigger API testing](https://portswigger.net/web-security/api-testing)
???