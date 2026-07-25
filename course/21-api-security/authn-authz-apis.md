# Authentication & Authorization in APIs

These two words get mixed up constantly. Getting them right is the foundation of API security — nearly every vulnerability class in this path is, at its core, one of these two checks being missing, weak, or applied at the wrong point in the code.

:::tip
A quick way to keep them straight: authentication happens once, at the door. Authorization has to happen again, every single time, for every single thing the caller tries to touch. A system can nail authentication perfectly and still be completely broken if it stops there.
:::

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

(The next lesson in this path goes deep on JWT attacks specifically — this section is the summary, that one is the full toolkit.)

## Authorization = What are you allowed to do?

Even after you know *who* the caller is, you still have to decide *what* they can access.

Two levels matter:

1. **Function / endpoint level** — "Can this role call `DELETE /users/{id}`?"
2. **Object level** — "Can this specific user delete *this* particular user record?"

Most real breaches happen at the **object level** — this is BOLA, the #1 item on the OWASP API Top 10, and it deserves its own dedicated lesson because it's this common.

## Common broken patterns

### 1. Trusting the client
```js
// BAD — the client tells the server "I am user 42"
const userId = req.body.userId;
const data = db.getOrders(userId);
```
Anyone can set `userId` to any value in the request body. This pattern hands identity determination to the exact party who has every incentive to lie about it.

### 2. Checking only authentication
```js
// BAD — any logged-in user can read any order
if (!req.user) return 401;
const order = db.getOrder(req.params.id);
```
This code proves the caller is *someone*, then hands over data belonging to *anyone*. It's a textbook BOLA — technically "secure" in the sense that it requires login, and completely broken in the sense that matters.

### 3. Correct pattern
```js
// GOOD — verify ownership or role on the specific object
if (!req.user) return 401;
const order = db.getOrder(req.params.id);
if (order.ownerId !== req.user.id && !req.user.isAdmin) return 403;
```
The critical addition is one line: fetch the object, then explicitly compare its owner against the verified identity from the token — never from anything the request body claims.

## Where identity should come from

| Source | Trustworthy? | Why |
|---|---|---|
| Verified JWT claim (`sub`) | Yes | Signed server-side, tamper-evident |
| Session lookup on the server | Yes | Server controls the mapping, client only holds an opaque reference |
| Request body field (`userId`) | No | Client fully controls this value |
| A header the client sets (`X-User-Id`) | No | Same problem — client-controlled |
| URL path parameter, unchecked | No | This is exactly what BOLA testing targets |

## A worked scenario: authorization implemented at the wrong layer

An API gateway checks that every request has a valid JWT before forwarding it to a backend service — solid authentication. The backend service, trusting that "the gateway already checked everything," implements no further authorization checks of its own and just serves whatever object ID it's given. Anyone with *any* valid account — even a freshly registered free-tier user — can now request any object ID and get it back, because the only check that ran was "is this person logged in at all," which the gateway already answered, and nobody after it asked the second, harder question.

## Practical rules

- Always derive the identity from a verified token/session, never from the request body or a header the client can freely set.
- Prefer short-lived access tokens + refresh tokens.
- Rotate and revoke secrets.
- Log authentication failures and authorization denials — a spike in 403s from one account is a strong signal of BOLA testing (defensive or malicious) happening against you.
- Fail closed: if you're not sure the caller is allowed, deny.

## 🧪 Hands-on lab — find the missing check

1. Pick an API you're authorized to test (or a lab environment).
2. Find one endpoint that returns data belonging to a specific user (an order, a profile, a document).
3. Log in as two different accounts. Capture a valid request from account A.
4. Replay it as account B, changing only the object ID to something belonging to A.
5. If the server returns A's data, you've found an authorization check that stops at authentication and never reaches the object level — exactly the "bad pattern #2" shown above.
6. Write out, in your own words, the one-line fix that would close the gap, matching the "good pattern #3" structure.

:::challenge Test yourself
1. Explain why "the request has a valid JWT" is authentication evidence, not authorization evidence.
2. In the "wrong layer" scenario above, what's the one sentence you'd tell the backend team to fix the architecture, not just the bug?
3. Why is `X-User-Id` sent by the client never a safe way to determine whose data to return?
:::

## Key takeaway

Authentication answers "who?". Authorization answers "are they allowed to do *this specific thing* to *this specific object*?". Most API vulnerabilities are failures of the second question — and the fix is almost always the same shape: fetch the object first, then explicitly compare it against the verified identity, every single time.

:::lab
Take any API you use (or a public demo API). Find one endpoint that returns data belonging to a user. Ask yourself: if I change the ID, does the server still give me the data? That single question finds a huge number of real bugs.
:::

## Key terms

- **Authentication** — proving who you are
- **Authorization** — proving you're allowed to do a specific action to a specific object
- **Fail closed** — denying access by default when authorization is uncertain, rather than allowing it
- **Bearer token** — a token that grants access to whoever "bears" (presents) it, with no further proof required

## Recap

Authentication and authorization are two separate questions, and a system that only answers the first is not secure — it just feels secure. Every endpoint that touches a specific object needs an explicit, per-object authorization check, derived from a verified identity, never from anything the client merely claims.

???refs
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT best practices (Auth0)](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
???
