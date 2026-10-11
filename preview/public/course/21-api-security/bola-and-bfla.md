# BOLA & BFLA — the two most common API authorization failures

These two items sit at the top of the OWASP API Security Top 10 for a reason: together they account for the largest share of real-world API breaches, and both come from the same root mistake — checking *who* someone is without checking *what they're allowed to touch or do*.

:::tip
A fast mental test for both: authentication answers "who are you?" Authorization answers "are you allowed to do this specific thing, to this specific object?" BOLA and BFLA are both cases where a system stopped after the first question.
:::

## BOLA — Broken Object Level Authorization

Also known as **IDOR** (Insecure Direct Object Reference).

**Definition:** The API lets you access or modify an object just by knowing (or guessing) its identifier, without checking that you are allowed to touch *that particular object*.

### Classic example

```
GET /api/v1/orders/1001     → returns your order
GET /api/v1/orders/1002     → returns someone else's order 💥
```

The server checked that you were logged in, but never checked that order 1002 belongs to you.

### Why it's so common

- Developers test with their own account and never try another user's ID
- Object IDs are sequential or predictable
- Authorization is implemented only at the "feature" level, not the object level
- Microservices trust the upstream service completely — service B assumes service A already checked authorization, and service A assumed service B would

### A second worked example: BOLA through a nested resource

BOLA doesn't only hide in the obvious "change the ID in the URL" case. Consider:

```
GET /api/v1/teams/77/invoices/501
```

A developer correctly checks that the requesting user belongs to team 77. But they forget to check that invoice 501 *actually belongs to* team 77 — it might belong to team 12. If invoice IDs are global and sequential, an attacker on team 77 can simply iterate the invoice ID and read every other team's invoices, despite the team-membership check technically passing every time. This is why "check the parent object" is not the same as "check the specific object being returned."

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

Prefer opaque, non-sequential IDs (UUIDs) as defense-in-depth, but **never rely on obscurity alone** — a UUID stops casual guessing, not a determined attacker who obtained one ID through another channel (a shared link, a leaked log, a previous response).

## BFLA — Broken Function Level Authorization

**Definition:** The API lets a user call an administrative or privileged function they should not have access to.

### Classic example

```
DELETE /api/v1/users/55          → normal user can delete accounts
POST   /api/v1/admin/settings    → normal user can change global settings
```

Often the UI simply hides the button, but the endpoint still works.

### A second worked example: BFLA via HTTP method

An API correctly restricts `POST /api/v1/products/501` (creating a product) to admin roles. But the developer forgot that `DELETE /api/v1/products/501` exists too, wired to the same resource but implemented by a different engineer months later, and never added the same role check. A regular user, simply trying every HTTP method against a resource they can already `GET`, discovers they can delete products outright. This is a common pattern: authorization checks get added method-by-method, and it only takes one missed method to open a hole.

### How to find it

- Look for `/admin`, `/internal`, `/manage`, `/debug` paths
- Try privileged HTTP methods (PUT, DELETE, PATCH) on normal resources, not just the methods the UI actually uses
- Check whether role claims in the JWT are actually enforced server-side, or just used to decide what the UI displays

### How to fix it

- Explicit role/permission checks on every privileged endpoint — for every method, not just the ones you expect to be called
- Deny by default
- Never rely on the front-end to hide functionality — a hidden button is not a security control

## Relationship between the two

| | BOLA | BFLA |
|---|------|------|
| Question | "Can I access *this object*?" | "Can I call *this function*?" |
| Typical impact | Horizontal privilege escalation | Vertical privilege escalation |
| Common in | Multi-tenant apps, marketplaces, SaaS | Admin panels, internal tools |

Many real bugs are a combination of both: a regular user calling an admin-only function (BFLA) against an object that isn't even theirs (BOLA) — for example, a normal user calling `DELETE /api/v1/admin/users/55` and succeeding both because the function had no role check and because there was also no check that user 55 was even related to them.

## 🧪 Hands-on lab — systematic authorization testing

1. Set up (or use) a vulnerable-by-design API lab such as OWASP crAPI or vAPI.
2. Create two separate accounts, A and B.
3. Log requests as A performing every major action the app offers (view profile, view an order, list items, etc.) using a proxy like Burp.
4. Replay each request as B, but keep A's object IDs — this tests BOLA.
5. Separately, take every admin/privileged action you can find documented or discover via the app's own JS/network traffic, and try calling it as a regular user directly — this tests BFLA.
6. For every method on every endpoint you found (GET, POST, PUT, PATCH, DELETE), check whether an unprivileged user can call it even if the UI never exposes a button for it.
7. Document each finding: endpoint, expected authorization, actual behavior.

## Key takeaway

If you only test one class of vulnerability in APIs, test **object-level authorization**. It is responsible for a massive share of real-world API breaches.

:::challenge
Find a public or demo API (or a lab such as crAPI / vAPI). Create two users and systematically change object IDs. Document every place where authorization is missing.
:::

:::challenge Test yourself
1. In the nested-resource example (`/teams/77/invoices/501`), what specifically did the developer's authorization check miss?
2. Explain why "the UI never shows a delete button for regular users" is not a fix for BFLA.
3. Give one concrete reason why using UUIDs instead of sequential IDs reduces but doesn't eliminate BOLA risk.
:::

## Key terms

- **IDOR** — Insecure Direct Object Reference, the older/broader term BOLA is the API-specific version of
- **Horizontal privilege escalation** — gaining access to another user's data at the same privilege level (BOLA's typical impact)
- **Vertical privilege escalation** — gaining a higher privilege level than intended (BFLA's typical impact)
- **Deny by default** — a design principle where access is refused unless explicitly granted, rather than allowed unless explicitly refused

## Recap

BOLA and BFLA are both authorization failures at their core, just checking different things — BOLA checks "which object," BFLA checks "which action." Testing both systematically, across every endpoint and every HTTP method, is the single highest-value activity in API security testing.

???refs
- [OWASP API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- [OWASP API5:2023 Broken Function Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/)
- [OWASP crAPI](https://github.com/OWASP/crAPI) — a free lab built specifically around these vulnerability classes
???
