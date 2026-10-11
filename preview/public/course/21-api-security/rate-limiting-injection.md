# Rate Limiting, Injection & Resource Abuse

Even a correctly authorized API can be abused if it has no limits or if it trusts input too much. Authorization answers "should this specific request succeed," but says nothing about "what happens if this exact same, individually-valid request arrives ten thousand times a second."

:::tip
A useful habit: for every endpoint, ask "what's the most expensive legitimate use of this, and what stops someone from triggering that expensive path over and over?" If the answer is "nothing," you've found a resource-consumption risk before you've even looked for a bug.
:::

## Rate limiting & resource consumption

Without rate limits, an attacker can:

- Brute-force credentials or tokens
- Enumerate object IDs at high speed
- Trigger expensive operations (report generation, PDF rendering, AI inference) thousands of times
- Cause denial of service

### Good practices

- Apply limits per IP, per user, and per API key
- Use different limits for different endpoints (login should be stricter than a public read)
- Return proper `429 Too Many Requests` with a `Retry-After` header
- Consider complexity-based limits for GraphQL

| Endpoint type | Suggested limit style | Why |
|---|---|---|
| Login / password reset | Strict, per-account and per-IP | Brute-force target |
| Object read by ID | Moderate, per-user | Enumeration target |
| Expensive report/export | Very strict, possibly queued | CPU/memory cost per call is high |
| Public search/listing | Loose but present | Still scriptable for scraping |

## Injection in APIs

APIs are still vulnerable to the classic injection families:

| Type | Where it appears |
|------|------------------|
| **SQL / NoSQL injection** | Query parameters, JSON body fields used in database queries |
| **Command injection** | Any field that ends up in a shell command or system call |
| **SSRF** | URL parameters that the server fetches (webhooks, importers, PDF generators) |
| **Path traversal** | File download / upload endpoints |
| **Header injection** | Values reflected into other headers or logs |

A JSON body doesn't change the underlying risk at all — `{"username": "admin' OR '1'='1"}` is just as dangerous going into a SQL query as a form field would be. The wrapping format (JSON vs form-encoded) has no bearing on whether the value is safely parameterized once it reaches the database layer.

### SSRF deserves special attention

Many modern APIs accept a URL from the client ("fetch this page", "import this feed", "generate PDF from this link"). If the server fetches that URL without restrictions, an attacker can reach:

- Cloud metadata services (`169.254.169.254`)
- Internal admin panels
- Redis, databases, or other services on the internal network

**Defenses:** allow-list of domains/schemes, block private IP ranges, use a separate network for outbound fetches, never return the full response body of the fetched resource to the client.

:::danger
A common SSRF bypass is DNS rebinding or redirect chains: the URL passes an initial allow-list check (it resolves to a public IP at validation time), but by the time the server actually fetches it, DNS has been changed to point at an internal address, or the target server issues a redirect to an internal URL. Validate at fetch time, not just at input time, and don't blindly follow redirects.
:::

## A worked example: an unrated PDF export endpoint

An internal reporting tool exposes `POST /api/v1/reports/export`, which accepts a date range and renders a PDF server-side — a CPU- and memory-heavy operation involving a headless browser. There's no rate limit, because "who would call this a thousand times?" A script sends 50 concurrent requests for the largest possible date range. Each one spins up a headless browser instance server-side. Within seconds, the service runs out of memory and every other endpoint on the same host — including the login page — becomes unresponsive. No vulnerability was exploited in the traditional sense; the feature worked exactly as designed, just without any budget on how often it could be triggered.

## Business logic & flow abuse

Not every problem is a missing security control. Sometimes the business flow itself can be abused:

- Applying a coupon multiple times
- Changing the price in the request
- Skipping steps in a multi-step process
- Racing two requests to create an inconsistent state

These are harder to catch with generic scanners and require understanding the application. A classic example: a "redeem coupon" endpoint checks "has this coupon been used?" and then, in a separate step, marks it used. If two requests hit the endpoint at nearly the same moment, both can pass the "not yet used" check before either finishes marking it used — a **race condition** that lets one coupon be redeemed twice. This kind of bug requires understanding the sequence of operations, not just fuzzing a parameter.

## Testing checklist

- [ ] Can I send 1000 requests in a few seconds without being slowed down?
- [ ] Are there any parameters that look like they reach a database or shell?
- [ ] Are there any parameters that look like URLs the server will fetch?
- [ ] Can I replay or reorder steps in a multi-step flow?
- [ ] Do error messages reveal stack traces, SQL, or internal paths?
- [ ] Can I fire two nearly-simultaneous requests at a "one-time" action and have both succeed?

## 🧪 Hands-on lab — probe limits and flows

1. Pick an endpoint you're authorized to test that performs a non-trivial amount of work (search, report generation, an import feature).
2. Script 20–50 rapid sequential requests. Note whether you're ever throttled, and at what point.
3. Find any endpoint that accepts a URL parameter (webhook config, avatar-from-URL, RSS import). Test whether it accepts `http://169.254.169.254/` or `http://localhost/` — **only on a lab/CTF environment you're explicitly authorized to test**, never on production systems without permission.
4. If a multi-step flow exists (checkout, coupon redemption, multi-step signup), try firing two requests for the same "one-time" step within milliseconds of each other and observe whether both succeed.

:::challenge Test yourself
1. Why doesn't wrapping malicious input in JSON instead of a form field make it any safer from injection?
2. Explain the SSRF DNS-rebinding bypass in your own words — why does checking the URL once, at input time, not fully protect the fetch?
3. In the coupon race-condition example, what's the general principle for fixing "check then act" bugs like this?
:::

## Key takeaway

Authorization gets most of the attention (rightly), but an API without rate limits or input validation is still a gift to attackers. Treat every input as hostile, every expensive operation as something that needs a budget, and every "one-time" business action as something that needs to be safe against being triggered twice at once.

## Key terms

- **Rate limiting** — restricting how many requests a client can make in a given time window
- **SSRF** — Server-Side Request Forgery, where the server is tricked into making requests on the attacker's behalf
- **Race condition** — a bug where the outcome depends on the timing of concurrent operations, often exploitable via near-simultaneous requests
- **DNS rebinding** — changing what a hostname resolves to between validation time and use time, bypassing naive URL allow-lists

## Recap

Correct authorization is necessary but not sufficient — an API also needs limits on how often and how heavily each capability can be used, and careful handling of any input that reaches a database, shell, or outbound network call. Business logic abuse, in particular, requires understanding the application's flow, not just fuzzing parameters.

???refs
- [OWASP API4:2023 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [OWASP SSRF Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Race Condition testing guide](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Business_Logic_Testing/07-Test_for_Process_Timing) — how to systematically test for race conditions
???
