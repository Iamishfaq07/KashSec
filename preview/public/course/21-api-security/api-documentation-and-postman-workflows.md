# API Documentation & Postman Workflows

The api-testing lesson covered a recon-to-report methodology conceptually. This lesson gets genuinely practical about the specific tooling most real-world API testers and developers actually live in day to day — **Postman** and OpenAPI-driven workflows — directly connecting to Path 10's Burp Suite coverage, since Postman functions as the API-specific counterpart to Burp's general web-testing role.

## Why documentation is itself a security-relevant starting point

Directly connecting to the api-security-standards-and-frameworks lesson's OpenAPI coverage: a genuinely productive first step when testing any API isn't jumping straight to attack payloads — it's obtaining the most complete, accurate documentation available (an OpenAPI/Swagger spec, a Postman collection shared by the target, or reconstructed documentation from observed traffic) and systematically working through every documented endpoint, parameter, and expected response before improvising anything. Undocumented behavior is genuinely interesting, but documented behavior tested thoroughly and systematically catches the majority of real, common findings.

## Postman collections as a testing artifact, not just a convenience tool

A **Postman collection** — an organized, saved set of API requests, often including example values, authentication setup, and environment variables — serves double duty: it's a genuinely practical way to organize testing work, and it becomes a reusable artifact itself, directly connecting to Path 15's recon-pipeline lesson's "your tooling compounds" principle. A well-organized collection built while testing one API becomes a template accelerating the next similar engagement.

## Environment variables — testing across dev/staging/production safely

A genuinely important practical habit: using Postman's **environment variables** (a base URL, an auth token, common test IDs) rather than hardcoding specific values into every individual request. This isn't just convenience — directly connecting to Path 14's rules-of-engagement-deep-dive lesson's scope precision, cleanly separating environments through variables meaningfully reduces the risk of accidentally sending a testing payload to a production endpoint when you meant to target staging, a genuinely easy, costly mistake to make with hardcoded URLs scattered across dozens of saved requests.

## Automating systematic checks with Postman's test scripts

Directly connecting to the api-breach-case-studies lesson's "disciplined basics" theme: Postman supports writing small JavaScript test scripts that run automatically after each request, letting you systematically check for common issues across every endpoint in a collection — verifying every response includes expected security headers, checking that error responses don't leak stack traces or internal paths, or confirming that requesting another user's object ID consistently returns a 403 rather than the object's data (a direct, automatable BOLA check).

```javascript
// Simplified Postman test script sketch
pm.test("No stack trace leaked in error response", function () {
    pm.expect(pm.response.text()).to.not.include("at java.lang");
});
pm.test("Object-level authorization enforced", function () {
    pm.response.to.have.status(403);
});
```

## Newman — running Postman collections outside the GUI

Directly connecting to Path 22's CI/CD security lesson: **Newman** is Postman's command-line collection runner, letting the exact same test scripts and collections built interactively in the GUI run automatically as part of a CI/CD pipeline — meaning a security testing collection built once during a manual engagement can be integrated into automated regression testing, catching a reintroduced BOLA vulnerability the moment a code change reintroduces it, rather than only during periodic manual re-testing.

## Importing an OpenAPI spec directly — the fastest path to full coverage

The single most efficient practical workflow this lesson can offer: most modern API testing tools, Postman included, can directly **import an OpenAPI specification** and automatically generate a complete request collection covering every documented endpoint, parameter, and expected response shape — turning what would otherwise be hours of manually recreating each request by hand into minutes, and ensuring genuinely complete coverage of everything the API's own documentation claims exists, directly connecting to the api-versioning-and-shadow-APIs lesson's inventory-completeness concern.

:::challenge Test yourself
Why does automating a BOLA check as a Postman test script, then running it repeatedly via Newman in CI/CD, provide meaningfully more value than a single manual test performed once during an initial engagement?
:::

## Key terms

- **Postman collection** — an organized, reusable set of saved API requests, itself a compounding testing artifact.
- **Newman** — Postman's command-line runner, enabling collections to run automatically in CI/CD pipelines.
- **OpenAPI import** — automatically generating a complete request collection directly from an API's OpenAPI specification.

## Recap

Obtaining and systematically working through the most complete available documentation catches the majority of real findings before any improvisation. Postman collections, environment variables, and automated test scripts turn ad-hoc manual testing into an organized, reusable, and eventually automatable workflow. Newman extends that same testing logic into continuous, CI/CD-integrated regression checks, and importing an OpenAPI spec directly is the fastest path to comprehensive endpoint coverage.

???refs
- [Postman Learning Center](https://learning.postman.com/)
- [Newman — command-line collection runner](https://github.com/postmanlabs/newman)
???
