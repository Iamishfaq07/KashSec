# API Security Capstone Lab

This lab pulls together everything from the path. You will systematically test an API using the techniques you have learned — BOLA, BFLA, JWT attacks, mass assignment, excessive data exposure, GraphQL risks, rate limiting, and business logic abuse — against a real, deliberately vulnerable target.

:::lab
**Goal**: Find and document at least three distinct API issues (BOLA, auth weakness, excess data, mass assignment, missing rate limit, etc.).
:::

:::tip
Resist the urge to jump straight to the "interesting" endpoints. Run the full methodology below against *every* endpoint you find, even boring ones — some of the best findings in real assessments come from the endpoint everyone assumed was too minor to matter.
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

## A worked example against crAPI

crAPI (Completely Ridiculous API) models a vehicle marketplace and deliberately contains bugs from most of this path's categories. A typical first session might look like:

1. **Recon**: register two accounts (attacker + victim), map the mobile app's traffic through Burp, and note the API uses JWT bearer tokens.
2. **BOLA test**: browse to "my vehicles" as the victim account, capture the `GET /identity/api/v2/vehicle/{vehicleId}/location` request, then replay it as the attacker account with the victim's vehicle ID. If it returns location data — confirmed BOLA, and a genuinely serious one (physical location leak).
3. **JWT check**: decode the bearer token, confirm the algorithm and check whether the signing secret is weak enough to crack offline.
4. **Mass assignment**: on the profile update endpoint, add an unexpected field (e.g. a role or verification flag) and check whether it persists.
5. **Business logic**: crAPI includes a coupon/discount feature — test whether the same coupon code can be applied more than once, or whether the discount amount itself can be manipulated client-side.

Each of these maps directly to a lesson earlier in this path — this lab is where that theory becomes muscle memory.

## Deliverable

Write a short report for each finding:

1. **Title** (e.g. "BOLA on GET /api/orders/{id}")
2. **Request / response** (sanitised)
3. **Impact**
4. **Remediation**

This is exactly the skill that turns into bug-bounty reports and professional AppSec write-ups.

## 🧪 Extended hands-on lab — full capstone run

1. Spin up crAPI locally (its GitHub repo includes docker-compose instructions) or use another target from the list above.
2. Run the full six-section methodology against it, keeping notes as you go — don't skip sections even if you find something early.
3. Document at least three distinct findings using the four-part report format above.
4. For your best finding, write the "chain" stretch goal below even if you don't have a second bug to chain it with — describe hypothetically what a chained attack could look like.
5. Time-box the exercise to roughly 3–4 hours. Real assessments have deadlines; practicing under a rough time constraint builds the right instincts.

:::challenge Test yourself
1. In the crAPI vehicle-location example, why is this BOLA finding rated as more serious than a typical "read someone else's profile name" BOLA?
2. If a coupon can be applied twice due to a race condition, which lesson topic does that map to, and why is it not simply "another BOLA"?
3. Your report has a finding with no clear remediation suggestion yet. What should you do before submitting it?
:::

## Stretch goals

- Chain two issues (e.g. excess data exposure → account takeover).
- Produce a one-page executive summary as if you were reporting to a client.

## Recap

You now have a repeatable API testing process. Use it on every new API you meet — labs, bug-bounty programs, or (with permission) real products. The methodology matters more than any single vulnerability class: recon, authentication, object-level authorization, property-level authorization, GraphQL-specific checks, and business logic — run through in that order, on every target, every time.

???refs
- [OWASP crAPI](https://github.com/OWASP/crAPI)
- [PortSwigger API testing](https://portswigger.net/web-security/api-testing)
- [vAPI](https://github.com/roottusk/vapi) — an alternative vulnerable API lab covering many of the same categories
???
