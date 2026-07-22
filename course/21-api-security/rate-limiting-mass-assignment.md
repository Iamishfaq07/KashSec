# Rate Limiting, Mass Assignment & Excessive Data Exposure

Three related problems that appear constantly in real APIs.

## 1. Missing or weak rate limiting (API4)

Without rate limits an attacker can:

- Brute-force login, OTP, or password-reset endpoints
- Enumerate IDs or tokens at high speed
- Trigger expensive operations (report generation, AI calls, SMS) at scale

### What good rate limiting looks like

- Per-IP *and* per-account limits
- Stricter limits on authentication and password-reset flows
- Clear `429 Too Many Requests` responses with `Retry-After`
- Backend enforcement (not only API gateway cosmetics)

:::tip
When testing, try both unauthenticated and authenticated flooding. Limits often differ.
:::

## 2. Mass assignment (API3)

The API binds the entire JSON body to an internal object.

```json
PUT /api/users/me
{
  "name": "Alice",
  "email": "alice@example.com",
  "isAdmin": true,
  "balance": 999999
}
```

If the framework blindly maps fields, the attacker just became admin or rich.

### How to find it

1. Look at the response of a legitimate update — note every field returned.
2. Add privileged or unexpected fields to the request body.
3. Check whether they stuck.

### Fix

Explicit allow-lists of fields the client is allowed to set. Never bind the raw request body to a sensitive model.

## 3. Excessive data exposure (API3)

The API returns full internal objects and relies on the client to ignore sensitive fields.

```json
{
  "id": 42,
  "email": "alice@example.com",
  "passwordHash": "$2b$12$...",
  "ssn": "123-45-6789",
  "internalNotes": "VIP – do not call"
}
```

Mobile apps and SPAs often show only a subset, but the full object is still on the wire.

### Fix

Return only the fields the client needs. Use DTOs / response serializers. Treat every extra field as a potential vulnerability.

## Practical workflow

For every state-changing endpoint:

1. Capture a legitimate request.
2. Add extra JSON properties (role, admin, balance, verified, etc.).
3. Inspect the full response for sensitive fields you did not ask for.
4. Check rate limits on auth and high-value endpoints.

## Key terms

- **Mass assignment** — binding untrusted input directly to internal objects
- **Excessive data exposure** — returning more data than the client should see
- **Rate limiting** — restricting how often an action can be performed

## Recap

These three issues are easy to introduce and easy to test for. Make them part of every API review checklist.

???refs
- [OWASP API3:2023](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)
- [OWASP API4:2023](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
???