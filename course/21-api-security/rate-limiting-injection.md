# Rate Limiting, Injection & Resource Abuse

Even a correctly authorized API can be abused if it has no limits or if it trusts input too much.

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

## Injection in APIs

APIs are still vulnerable to the classic injection families:

| Type | Where it appears |
|------|------------------|
| **SQL / NoSQL injection** | Query parameters, JSON body fields used in database queries |
| **Command injection** | Any field that ends up in a shell command or system call |
| **SSRF** | URL parameters that the server fetches (webhooks, importers, PDF generators) |
| **Path traversal** | File download / upload endpoints |
| **Header injection** | Values reflected into other headers or logs |

### SSRF deserves special attention

Many modern APIs accept a URL from the client (“fetch this page”, “import this feed”, “generate PDF from this link”). If the server fetches that URL without restrictions, an attacker can reach:

- Cloud metadata services (`169.254.169.254`)
- Internal admin panels
- Redis, databases, or other services on the internal network

**Defenses:** allow-list of domains/schemes, block private IP ranges, use a separate network for outbound fetches, never return the full response body of the fetched resource to the client.

## Business logic & flow abuse

Not every problem is a missing security control. Sometimes the business flow itself can be abused:

- Applying a coupon multiple times
- Changing the price in the request
- Skipping steps in a multi-step process
- Racing two requests to create an inconsistent state

These are harder to catch with generic scanners and require understanding the application.

## Testing checklist

- [ ] Can I send 1000 requests in a few seconds without being slowed down?
- [ ] Are there any parameters that look like they reach a database or shell?
- [ ] Are there any parameters that look like URLs the server will fetch?
- [ ] Can I replay or reorder steps in a multi-step flow?
- [ ] Do error messages reveal stack traces, SQL, or internal paths?

## Key takeaway

Authorization gets most of the attention (rightly), but an API without rate limits or input validation is still a gift to attackers. Treat every input as hostile and every expensive operation as something that needs a budget.

???refs
- [OWASP API4:2023 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [OWASP SSRF Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
???