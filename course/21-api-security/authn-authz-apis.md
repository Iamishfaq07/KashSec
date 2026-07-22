# Authentication & Authorization in APIs

These two words get mixed up constantly. Getting them right is the foundation of API security.

## Authentication = Who are you?

Proving identity. Common mechanisms in APIs:

| Mechanism | How it works | Common weaknesses |
|-----------|--------------|-------------------|
| **API Key** | Long random string in header or query | Leaked in logs, URLs, client code; often no rotation |
| **Bearer Token (JWT)** | Signed token containing claims | `alg:none`, weak secrets, no expiry, accepting any issuer |
| **OAuth 2.0 / OIDC** | Delegated authorization flow | Misconfigured redirect URIs, token leakage, implicit flow |
| **mTLS** | Client presents a certificate | Complex to manage; rarely used for public APIs |
| **Session cookie** | Classic web session | CSRF if not careful; less common for pure APIs |

### JWT pitfalls (you will see these in the wild)

- Accepting `alg: none`
- Using a weak or leaked secret with HS256
- Not validating `exp`, `nbf`, `iss`, `aud`
- Putting sensitive data in the payload (it is only base64, not encrypted)

## Authorization = What are you allowed to do?

Even after you know *who* the caller is, you still have to decide *what* they can access.

Two levels matter:

1. **Function / endpoint level** — “Can this role call `DELETE /users/{id}`?”
2. **Object level** — “Can this specific user delete *this* particular user record?”

Most real breaches happen at the **object level**.

## Common broken patterns

### 1. Trusting the client
```js
// BAD — the client tells the server “I am user 42”
const userId = req.body.userId;
const data = db.getOrders(userId);
```

### 2. Checking only authentication
```js
// BAD — any logged-in user can read any order
if (!req.user) return 401;
const order = db.getOrder(req.params.id);
```

### 3. Correct pattern
```js
// GOOD — verify ownership or role on the specific object
if (!req.user) return 401;
const order = db.getOrder(req.params.id);
if (order.ownerId !== req.user.id && !req.user.isAdmin) return 403;
```

## Practical rules

- Always derive the identity from a verified token/session, never from the request body or a header the client can freely set.
- Prefer short-lived access tokens + refresh tokens.
- Rotate and revoke secrets.
- Log authentication failures and authorization denials.
- Fail closed: if you’re not sure the caller is allowed, deny.

## Key takeaway

Authentication answers “who?”. Authorization answers “are they allowed to do *this specific thing* to *this specific object*?”. Most API vulnerabilities are failures of the second question.

:::lab
Take any API you use (or a public demo API). Find one endpoint that returns data belonging to a user. Ask yourself: if I change the ID, does the server still give me the data? That single question finds a huge number of real bugs.
:::

???refs
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT best practices (Auth0)](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
???