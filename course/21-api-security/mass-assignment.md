# Mass Assignment & Excessive Data Exposure

Two related (and extremely common) problems that appear when APIs accept or return more than they should. Together they make up OWASP's API3 category — "broken object property level authorization" — because both are, at heart, a missing check on which *fields* a caller is allowed to touch, rather than which *object*.

:::tip
Think of it as two directions of the same mistake: mass assignment is "the server accepted more than it should have," excessive data exposure is "the server returned more than it should have." Same missing discipline, opposite direction of data flow.
:::

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
- "Update profile" endpoints that accept any field
- GraphQL mutations that expose too many writable fields

### How to prevent it

1. **Allow-list** the fields that may be set from the client
2. Never pass the raw request body straight into a model create/update
3. Use DTOs / explicit input types
4. Mark sensitive fields as non-writable at the model layer

### A second worked example: mass assignment through a "harmless" field

Not every mass-assignment bug is as obvious as `isAdmin`. Consider a "submit expense report" endpoint:

```json
{ "amount": 45.00, "category": "meals", "status": "pending_review" }
```

The frontend only ever sends `amount` and `category` — `status` is meant to be set exclusively by the approval workflow. But the endpoint accepts and stores any field present in the body, so a user submits:

```json
{ "amount": 4500.00, "category": "meals", "status": "approved" }
```

...and their own expense report is instantly self-approved. Nothing about this looks like a classic "admin" field — which is exactly why mass assignment bugs are so easy to miss in code review. Any field that represents workflow state, ownership, or a value the server is supposed to compute is a candidate.

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

- "We'll filter it on the client"
- Re-using the same serializer for admin and user views
- Returning entire database rows for convenience

### How to prevent it

- Explicit response schemas / serializers per use-case
- Never return password hashes, tokens, internal flags, or PII that isn't required
- Review every new field added to a response

:::warn
"We'll filter it on the client" is the single most common excuse behind excessive data exposure, and it fails every time someone bypasses the client entirely — which any attacker with Burp or curl does as a matter of routine. If a field shouldn't be visible, it shouldn't be sent.
:::

## Quick testing tips

**Mass assignment:**
- Intercept a legitimate create/update request
- Add extra fields (`isAdmin`, `role`, `balance`, `verified`, `status`, `ownerId`, etc.)
- See if they stick — check the object afterward, not just the immediate response, since some endpoints silently ignore extra fields in the response but still persist them

**Excessive data exposure:**
- Look at the raw JSON of every response, not the rendered UI
- Compare what the UI shows versus what the API returned
- Check for fields that sound sensitive (`hash`, `internal`, `debug`, `notes`, `raw`, `token`)

## 🧪 Hands-on lab — hunt both bugs in one flow

1. Pick a "create" or "update" action in an app you're authorized to test (profile update, comment creation, expense submission, etc.).
2. Capture the legitimate request in a proxy.
3. Guess and add 5–10 plausible extra fields based on what the object probably has internally (`role`, `status`, `verified`, `price`, `ownerId`, `approved`). Resend and check whether any stuck.
4. Separately, capture a "read" response for the same type of object (e.g. your own user profile) and list every field in the raw JSON.
5. For each field, ask: does the UI display this anywhere? If not, is there a legitimate reason the API still needs to send it to this client?
6. Write a short report: which fields (if any) were writable that shouldn't have been, and which fields (if any) were exposed that shouldn't have been.

:::challenge Test yourself
1. In the expense-report example, what's the one-sentence fix that prevents the `status` field from being attacker-controlled?
2. Why does "the mobile app never displays `passwordHash`" not make it safe to include in the API response?
3. A developer says allow-listing writable fields is "extra work for every endpoint." What's the argument for doing it anyway?
:::

## Key takeaway

Both problems come from the same root: **the server trusted the client too much and was too generous with data**. Explicit allow-lists for input and explicit schemas for output fix the large majority of cases — and both are cheap to build in from the start, expensive to retrofit once dozens of endpoints already auto-bind and auto-serialize everything.

## Key terms

- **Mass assignment** — accepting more input fields than intended, letting a client set properties it shouldn't control
- **Excessive data exposure** — returning more response fields than intended, relying on the client to hide the rest
- **Allow-list** — an explicit list of permitted fields, safer than trying to block a list of forbidden ones
- **Serializer** — the layer responsible for converting an internal object into the JSON actually sent to a client

## Recap

Mass assignment and excessive data exposure are two sides of the same missing discipline: never bind raw client input straight to internal objects, and never serialize entire internal objects straight into a response. An explicit allow-list on the way in and an explicit schema on the way out closes both.

???refs
- [OWASP API3:2023 Broken Object Property Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)
- [OWASP API6:2023 Unrestricted Access to Sensitive Business Flows](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
???
