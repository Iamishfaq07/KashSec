# Why API Security Matters

Modern applications are built on APIs. Mobile apps, single-page web apps, microservices, partner integrations, and AI agents all talk through APIs. When an API is broken, the impact is rarely limited to one page — it can expose entire databases, user data, or internal systems.

:::tip
If you only learn one advanced topic after web security, make it API security. Most real bug-bounty and AppSec work today is API work.
:::

## What is an API, really?

An API (Application Programming Interface) is a contract: "send me this request in this shape, and I will return this data."  
Most modern APIs use HTTP and return JSON.

```http
GET /api/v1/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
```

The server replies with JSON. That simple pattern is how almost everything works now.

## Why APIs are a bigger attack surface

1. **They are the real backend** — the browser UI is just a client. Attackers go straight to the API.
2. **They often lack the same defenses** as traditional web pages (no CSRF tokens, weaker rate limits, weaker authorization checks).
3. **They return structured data** — perfect for automated enumeration and data extraction.
4. **Mobile and third-party clients** force the API to be the only security boundary.

## The mental model shift

In classic web apps you worried about:
- XSS in HTML
- SQLi in forms
- Session cookies

In APIs you worry about:
- **Authorization** (can this user access *this* object?)
- **Authentication** (is this token valid and not stolen?)
- **Input validation** of JSON bodies and query parameters
- **Business logic** flaws that only appear when you call endpoints in unexpected order or combinations

## Real-world impact

High-profile breaches in the last few years almost always involved API flaws:
- Broken Object Level Authorization (BOLA) letting anyone read other users' data
- Overly permissive tokens or long-lived JWTs
- GraphQL introspection + deep queries that exhaust resources
- Mass assignment letting users set `role=admin`

:::danger
Never assume "the mobile app will only call the API correctly."  
Anything the mobile app can do, an attacker with Burp or curl can also do — often better.
:::

## What you will learn in this path

- The OWASP API Top 10 (2023)
- BOLA / IDOR in API contexts
- Broken authentication and JWT attacks
- GraphQL security
- Rate limiting, mass assignment, and excessive data exposure
- A practical lab you can run against a vulnerable API

## Key terms

- **API** — the interface clients use to talk to a server
- **BOLA** — Broken Object Level Authorization (the #1 API risk)
- **JWT** — JSON Web Token, a common way to carry identity
- **Mass assignment** — accepting more fields than the developer intended

## Recap

APIs are the real application. Treating them as a second-class citizen is how large data breaches happen. This path gives you the checklist and the hands-on skills that modern AppSec and bug-bounty roles expect.

???refs
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [PortSwigger: API testing](https://portswigger.net/web-security/api-testing)
???