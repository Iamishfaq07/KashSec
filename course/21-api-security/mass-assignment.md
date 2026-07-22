# Mass Assignment & Excessive Data Exposure

Two related (and extremely common) problems that appear when APIs accept or return more than they should.

## Mass Assignment

**Definition:** The API automatically binds client-supplied fields to internal objects without an allow-list, letting an attacker set properties they should never control.

### Classic example

Registration endpoint expects:

```json
{ "email": "user@example.com", "password": "..." }
```

Attacker sends:

```json
{ "email": "user@example.com", "password": "...", "isAdmin": true, "role": "admin" }
```

If the framework or code does `User.create(req.body)` (or equivalent), the attacker just became an admin.

### Where it appears

- ORMs and frameworks that auto-bind request bodies (Rails, Laravel, Node ORMs, etc.)
- “Update profile” endpoints that accept any field
- GraphQL mutations that expose too many writable fields

### How to prevent it

1. **Allow-list** the fields that may be set from the client
2. Never pass the raw request body straight into a model create/update
3. Use DTOs / explicit input types
4. Mark sensitive fields as non-writable at the model layer

## Excessive Data Exposure

**Definition:** The API returns more data than the client needs (or should be allowed to see), relying on the front-end to hide it.

### Classic example

```json
GET /api/users/me
{
  "id": 42,
  "name": "Alice",
  "email": "alice@example.com",
  "passwordHash": "$2b$10$...",          // 💥
  "internalNotes": "VIP - do not ban",  // 💥
  "ssn": "123-45-6789"                  // 💥
}
```

The mobile app only displays name and email, but the extra fields are still in the response for anyone who looks.

### Why it happens

- “We’ll filter it on the client”
- Re-using the same serializer for admin and user views
- Returning entire database rows for convenience

### How to prevent it

- Explicit response schemas / serializers per use-case
- Never return password hashes, tokens, internal flags, or PII that isn’t required
- Review every new field added to a response

## Quick testing tips

**Mass assignment:**
- Intercept a legitimate create/update request
- Add extra fields (`isAdmin`, `role`, `balance`, `verified`, etc.)
- See if they stick

**Excessive data exposure:**
- Look at the raw JSON of every response
- Compare what the UI shows versus what the API returned
- Check for fields that sound sensitive

## Key takeaway

Both problems come from the same root: **the server trusted the client too much and was too generous with data**. Explicit allow-lists for input and explicit schemas for output fix the large majority of cases.

???refs
- [OWASP API3:2023 Broken Object Property Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)
- [OWASP API6:2023 Unrestricted Access to Sensitive Business Flows](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)
???