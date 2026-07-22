# BOLA & BFLA — the two most common API authorization failures

These two items sit at the top of the OWASP API Security Top 10 for a reason.

## BOLA — Broken Object Level Authorization

Also known as **IDOR** (Insecure Direct Object Reference).

**Definition:** The API lets you access or modify an object just by knowing (or guessing) its identifier, without checking that you are allowed to touch *that particular object*.

### Classic example

```
GET /api/v1/orders/1001     → returns your order
GET /api/v1/orders/1002     → returns someone else’s order 💥
```

The server checked that you were logged in, but never checked that order 1002 belongs to you.

### Why it’s so common

- Developers test with their own account and never try another user’s ID
- Object IDs are sequential or predictable
- Authorization is implemented only at the “feature” level, not the object level
- Microservices trust the upstream service completely

### How to find it

1. Create two accounts (or use two different roles)
2. Perform an action as user A and capture the request
3. Replay the request as user B, changing only the object ID
4. If you get the data or a successful modification → BOLA

### How to fix it

On every request that touches an object:

```text
if (object.owner != current_user && !current_user.has_permission("read:any")):
    return 403
```

Prefer opaque, non-sequential IDs (UUIDs) as defense-in-depth, but **never rely on obscurity alone**.

## BFLA — Broken Function Level Authorization

**Definition:** The API lets a user call an administrative or privileged function they should not have access to.

### Classic example

```
DELETE /api/v1/users/55          → normal user can delete accounts
POST   /api/v1/admin/settings    → normal user can change global settings
```

Often the UI simply hides the button, but the endpoint still works.

### How to find it

- Look for `/admin`, `/internal`, `/manage`, `/debug` paths
- Try privileged HTTP methods (PUT, DELETE, PATCH) on normal resources
- Check whether role claims in the JWT are actually enforced server-side

### How to fix it

- Explicit role/permission checks on every privileged endpoint
- Deny by default
- Never rely on the front-end to hide functionality

## Relationship between the two

| | BOLA | BFLA |
|---|------|------|
| Question | “Can I access *this object*?” | “Can I call *this function*?” |
| Typical impact | Horizontal privilege escalation | Vertical privilege escalation |
| Common in | Multi-tenant apps, marketplaces, SaaS | Admin panels, internal tools |

Many real bugs are a combination of both.

## Key takeaway

If you only test one class of vulnerability in APIs, test **object-level authorization**. It is responsible for a massive share of real-world API breaches.

:::challenge
Find a public or demo API (or a lab such as crAPI / vAPI). Create two users and systematically change object IDs. Document every place where authorization is missing.
:::

???refs
- [OWASP API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- [OWASP API5:2023 Broken Function Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/)
???