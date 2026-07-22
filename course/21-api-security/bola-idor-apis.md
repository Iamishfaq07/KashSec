# BOLA / IDOR in APIs

Broken Object Level Authorization (BOLA) is the single most common and most impactful API vulnerability. It is the API version of IDOR.

## The pattern

```http
GET /api/v1/invoices/8831
Authorization: Bearer <your-token>
```

If changing `8831` to another number returns someone else's invoice, the authorization check is missing or incomplete.

## Why it is so common

Developers correctly authenticate the user ("is this a valid token?") but forget the second question:

> "Is *this* user allowed to access *this specific object*?"

Many frameworks make the first check easy and the second check easy to forget.

## Hunting techniques

### 1. Two-account method (gold standard)

1. Create Account A and Account B.
2. With Account A, create or note an object (invoice, message, document).
3. Capture the request that fetches that object.
4. Replay it with Account B's token.
5. If it succeeds → BOLA.

### 2. Horizontal vs vertical

- **Horizontal** — same privilege level, different users (Alice reads Bob's data).
- **Vertical** — lower privilege accessing higher privilege objects (user reads admin data).

### 3. Predictable identifiers

Sequential IDs, UUIDs that leak creation time, email addresses, usernames — anything an attacker can guess or enumerate.

### 4. Nested resources

```http
GET /api/users/42/orders/7
```

Even if `/users/42` is protected, `/orders/7` might not re-check ownership.

### 5. Different HTTP methods

Sometimes `GET` is protected but `PUT`, `PATCH`, or `DELETE` is not (or vice-versa).

## Real example

```http
GET /api/v2/documents/doc_9f3a2
Authorization: Bearer eyJ...
```

Response contains another user's tax document. Changing the ID is enough.

## Defenses

1. **Always authorize on every object access** — never trust the client to only request its own IDs.
2. Prefer opaque, unguessable IDs *and* still perform the ownership check.
3. Use centralized authorization middleware or policy engines (e.g. OPA, CASL, framework policies) so the check cannot be forgotten on a single endpoint.
4. Log and alert on cross-tenant access attempts.

:::danger
Hiding the ID or using UUIDs is **not** a fix. Authorization is the fix.
:::

## Lab idea

In any lab or intentionally vulnerable API (crAPI, vAPI, Damn Vulnerable RESTful API, etc.):

1. Register two users.
2. Create a resource with user A.
3. Attempt to read/update/delete it with user B.
4. Document the request, response, and impact.

## Key terms

- **BOLA** — Broken Object Level Authorization
- **IDOR** — Insecure Direct Object Reference (older term, same idea)
- **Horizontal privilege escalation** — same role, different user data

## Recap

BOLA is almost always present when authorization is implemented per-endpoint by hand. Treat every object reference as guilty until proven authorized.

???refs
- [OWASP API1:2023](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- [PortSwigger IDOR labs](https://portswigger.net/web-security/access-control/idor)
???