# REST vs GraphQL — security differences that matter

Most APIs you’ll meet fall into two camps: **REST** and **GraphQL**. They look different, and their security failure modes are different too.

## REST in one minute

REST treats the API as a collection of **resources** identified by URLs:

```
GET    /api/users/42          → get user 42
PUT    /api/users/42          → replace user 42
PATCH  /api/users/42          → partially update user 42
DELETE /api/users/42          → delete user 42
GET    /api/users/42/orders   → list orders for user 42
```

- Uses standard HTTP methods
- Usually returns JSON
- Versioning is common (`/v1/`, `/v2/`)
- Documentation is often OpenAPI/Swagger

## GraphQL in one minute

GraphQL treats the API as a single endpoint (usually `POST /graphql`) where the **client describes exactly the data it wants**:

```graphql
query {
  user(id: 42) {
    name
    email
    orders {
      id
      total
    }
  }
}
```

The server returns only what was requested. This is powerful for clients and dangerous if authorization is not applied at every field.

## Security comparison

| Concern | REST | GraphQL |
|---------|------|---------|
| **Object-level authorization** | Usually checked per endpoint | Must be checked per field / per resolver |
| **Over-fetching** | Server decides the shape | Client can request deep nested data |
| **Batching / rate limits** | One request ≈ one action | One query can do many things (aliasing, nested queries) |
| **Introspection** | Usually none | Schema is often fully discoverable |
| **Injection surface** | Parameters, body, headers | Query language itself can be abused |
| **Documentation** | OpenAPI (optional) | Schema is the documentation |

## Classic REST problems

- Changing the ID in the path (`/users/42` → `/users/43`) and getting another user’s data (**BOLA / IDOR**)
- Sending extra fields the server didn’t expect (**mass assignment**)
- Missing rate limits on expensive endpoints
- Verbose error messages that leak stack traces or internal IDs

## Classic GraphQL problems

- **Nested query attacks** — a query that expands exponentially and kills the server
- **Field-level authorization missing** — you can request `user { salary }` even if the UI never shows it
- **Introspection left on in production** — attackers get the full schema for free
- **Batching** — many operations in one HTTP request bypass simple rate limits

:::danger
In GraphQL, “the endpoint is authorized” is not enough. Every sensitive field needs its own authorization check.
:::

## What you should do in practice

**For REST:**
- Treat every endpoint as a separate authorization decision
- Use object-level checks (does *this* user own *this* resource?)
- Prefer allow-lists for fields that can be written

**For GraphQL:**
- Disable or heavily restrict introspection in production
- Enforce depth and complexity limits
- Apply authorization inside resolvers, not just at the HTTP layer
- Consider query cost analysis / rate limiting by complexity

## Key takeaway

REST and GraphQL fail in different places, but the root cause is usually the same: **authorization was implemented at the wrong layer or not at all**.

???refs
- [OWASP GraphQL Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
???