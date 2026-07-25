# REST vs GraphQL — security differences that matter

Most APIs you'll meet fall into two camps: **REST** and **GraphQL**. They look different, and their security failure modes are different too — knowing which style you're facing changes exactly which questions you ask first.

:::tip
The one-line summary: REST spreads authorization across many endpoints, so you can miss a check on any one of them. GraphQL concentrates almost everything behind one endpoint, so a missing check at the field level is invisible unless you know to look for it.
:::

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

The server returns only what was requested. This is powerful for clients and dangerous if authorization is not applied at every field — because the query shape is entirely up to the caller, not the server.

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

- Changing the ID in the path (`/users/42` → `/users/43`) and getting another user's data (**BOLA / IDOR**)
- Sending extra fields the server didn't expect (**mass assignment**)
- Missing rate limits on expensive endpoints
- Verbose error messages that leak stack traces or internal IDs

## Classic GraphQL problems

- **Nested query attacks** — a query that expands exponentially and kills the server, because a small amount of query text can request an enormous amount of nested data
- **Field-level authorization missing** — you can request `user { salary }` even if the UI never shows it, because the field exists in the schema and nothing stops a client from asking for it directly
- **Introspection left on in production** — attackers get the full schema for free, including field names and types for parts of the API the UI never uses
- **Batching** — many operations in one HTTP request bypass simple rate limits built around "one request per action"

:::danger
In GraphQL, "the endpoint is authorized" is not enough. Every sensitive field needs its own authorization check. A resolver for `user.orders` might correctly check that you're allowed to see this user's orders, while the resolver for `user.paymentMethods`, added later by a different developer, forgets to.
:::

## A worked example: the nested query attack

```graphql
query {
  users {
    friends {
      friends {
        friends {
          friends { name }
        }
      }
    }
  }
}
```

A query like this, five levels of `friends` deep, can ask the database to compute a combinatorial explosion of relationships — potentially millions of rows of work — from a query that's a few dozen characters long. A REST API has no equivalent: each endpoint does a fixed, predictable amount of work, so this style of attack simply doesn't exist in the same form. This is exactly why GraphQL APIs need depth and complexity limits that REST APIs generally don't.

## Introspection: convenience for developers, gift to attackers

GraphQL's introspection feature lets a client ask the server "what's your entire schema?" — every type, every field, every mutation, all at once. It's genuinely useful during development. Left enabled in production, it hands an attacker the complete map of your API's data model, including fields never exposed anywhere in the UI:

```graphql
query { __schema { types { name fields { name } } } }
```

A single request like this can reveal internal field names such as `internalNotes`, `isTestAccount`, or `debugFlags` — fields that were never meant to be queried by a real client, but exist in the schema all the same.

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

## 🧪 Hands-on lab — compare the two styles hands-on

1. Find (or spin up) a small public GraphQL API — many "awesome-graphql" lists on GitHub link to safe public playgrounds — and try the introspection query above. Note how much of the schema is exposed.
2. Using the same target (or a REST API you're authorized to test), compare: how many separate endpoints would it take to build the equivalent of one moderately nested GraphQL query?
3. Write down, for each style, one sentence answering: "where would a missing authorization check hide, and how would you find it?"

:::challenge Test yourself
1. Why does a REST API rarely need "query depth limits" the way a GraphQL API does?
2. An attacker runs an introspection query against a production GraphQL endpoint and finds a field called `adminNotes` on the `User` type. What should you check next?
3. Explain in one sentence why "the resolver for one field is authorized" doesn't guarantee the resolver for a related field is too.
:::

## Key takeaway

REST and GraphQL fail in different places, but the root cause is usually the same: **authorization was implemented at the wrong layer or not at all**. REST's many small endpoints hide the missing check in plain sight, one at a time; GraphQL's single flexible endpoint hides it inside a resolver tree that's easy to under-review.

## Key terms

- **Resolver** — the GraphQL function responsible for fetching the data for one specific field
- **Introspection** — a GraphQL feature letting a client query the schema itself
- **Query depth** — how many levels of nested fields a GraphQL query requests
- **Over-fetching** — a response containing more data than the client actually needed, common in REST when endpoints return whole objects

## Recap

REST spreads authorization decisions across many endpoints; GraphQL concentrates them behind resolvers on a single endpoint. Both fail the same way in the end — a check that someone assumed happened somewhere else, but didn't happen anywhere.

???refs
- [OWASP GraphQL Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [GraphQL introspection explained](https://graphql.org/learn/introspection/) — the official docs for the feature discussed above
???
