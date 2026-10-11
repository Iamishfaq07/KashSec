# API Security Fundamentals

Nearly every vulnerability covered throughout this path — IDOR, injection, CSRF, deserialization — applies just as fully to APIs as to traditional web pages, since an API is ultimately just another way of exchanging HTTP requests and responses. This lesson is a focused summary of how those same concepts apply specifically to APIs, before Path 21's entire dedicated path goes considerably deeper.

## APIs aren't a separate attack surface — they're the same surface, differently shaped

Path 05's APIs-and-JSON lesson explained what an API actually is. The security implication: every attack this entire path has covered has a direct API equivalent — IDOR against an API endpoint returning JSON instead of rendering an HTML page, SQL injection through a JSON request body instead of a form field, CSRF against a state-changing API call instead of a traditional form submission.

## Where API security genuinely differs from traditional web security

- **No visible UI to guide testing** — a traditional web app's structure is somewhat discoverable just by clicking around; an API's endpoints, parameters, and expected data shapes often require reading documentation or actively probing, directly connecting to the web-recon lesson's techniques applied to a less visually guided target
- **Authentication is almost always token-based** — rather than session cookies, most APIs use bearer tokens or API keys, directly connecting to the JWT concepts covered in this path's advanced JWT lab
- **Rate limiting matters even more** — an API is frequently designed for programmatic, high-volume access, making rate-limiting bypass (Path 21's dedicated lab) a genuinely more central concern than for a typical human-browsed web page
- **Mass assignment** — an API that blindly accepts and applies every field in a request body (rather than an explicit allow-list of expected fields) can let an attacker set fields they shouldn't be able to touch, like an `is_admin` flag never intended to be client-settable — covered as a full hands-on lab in Path 21

## The OWASP API Security Top 10, briefly

Just as the OWASP Top 10 (the very first lesson in this path) organizes the most critical web application risks, a parallel **OWASP API Security Top 10** exists specifically for API-focused risks — Broken Object Level Authorization (essentially IDOR, applied to APIs) consistently tops that list, directly reflecting how central the access-control failures this path opened with remain, even in an API-specific context.

## Why understanding this matters even before Path 21

Modern applications increasingly *are* APIs underneath — a React frontend (from Path 05's frameworks lesson) calling a JSON API backend is now the dominant architecture pattern, meaning API security isn't a niche specialization anymore, it's simply where most of this path's vulnerability classes actually live in a genuinely modern application.

:::challenge Test yourself
Why does IDOR (Broken Object Level Authorization) top the OWASP API Security Top 10, given everything covered throughout this path?
<details><summary>Show answer</summary>APIs are frequently designed around returning data by a direct identifier — <code>GET /api/orders/{id}</code>, <code>GET /api/users/{id}</code> — exactly the pattern the IDOR lesson described as the classic vulnerable pattern, and this design is even more common and more central to how APIs work than it is for traditional server-rendered web pages. Combined with the fact that APIs often lack a visible UI hiding or restricting which IDs a client could plausibly request (a traditional web app's UI might only ever generate links to your own resources, providing a thin, easily-bypassed layer of obscurity an API frequently doesn't even have), the object-level authorization check genuinely has to be correct on the server side every single time, with no incidental UI-level protection to fall back on — making this exact vulnerability class both extremely common and consistently high-impact across real-world APIs.</details>
:::

## Key terms

- **Bearer token** — a credential (often a JWT) presented in an API request's Authorization header to prove identity.
- **Mass assignment** — a vulnerability where an API blindly applies every field in a request body rather than restricting to an explicit allow-list.
- **OWASP API Security Top 10** — a parallel to the general OWASP Top 10, focused specifically on API-related risks.

## Recap

- Every vulnerability class covered throughout this path applies directly to APIs, just expressed through JSON request/response bodies instead of HTML forms and pages.
- Token-based authentication, reduced UI-based obscurity, and rate limiting are the areas where API security genuinely diverges from traditional web security.
- Broken Object Level Authorization tops the OWASP API Security Top 10 for good reason — it's the direct API-context version of the IDOR vulnerability this path opened with, and Path 21 covers this entire area in full, hands-on depth.

**Next up →** [GraphQL Security Basics](#/lesson/11-web-security/graphql-security-basics)
