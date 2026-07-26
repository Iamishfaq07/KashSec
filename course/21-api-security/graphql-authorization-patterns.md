# GraphQL Authorization Patterns

The GraphQL security lesson covered introspection, nested query abuse, and field-level authorization at an introductory level. This lesson goes deep specifically into how field-level authorization actually gets implemented correctly (and where it commonly breaks), directly connecting to the BOLA-and-BFLA lesson's core object/function-level authorization distinction, now applied to GraphQL's uniquely flexible query structure.

## Why GraphQL's flexibility creates a genuinely different authorization surface

Directly connecting to the REST-vs-GraphQL lesson: a REST API's authorization surface is bounded by its fixed set of endpoints — you check authorization once per endpoint definition. GraphQL's single endpoint accepts client-defined queries requesting an arbitrary combination of fields across an arbitrary combination of connected types in one request, meaning authorization can't be checked once "at the endpoint" — it has to be checked at the level of individual **fields** and **resolvers**, since the same query shape can legitimately request very different combinations of sensitive and non-sensitive data.

## Field-level authorization, illustrated

```graphql
query {
  user(id: 42) {
    name        # Public — anyone can see this
    email       # Private — only the user themselves or an admin
    salary      # Highly sensitive — only HR admins
    orders {
      total     # Private — only the user or an admin
    }
  }
}
```

A single query can request fields with three genuinely different authorization requirements simultaneously — the naive mistake is checking "is this user authenticated" once at the top and assuming that's sufficient, when each field actually needs its own independent check evaluated at resolution time.

## Where field-level authorization commonly breaks

- **Checking at the query root only** — verifying the requesting user can access `user(id: 42)` generally, but never re-checking whether they specifically should see the nested `salary` field once inside that object
- **Inconsistent authorization across resolvers written by different developers** — directly connecting to the api-gateway-security lesson's "inconsistent enforcement across teams" point, one resolver correctly checks field-level access while another, written later under deadline pressure, doesn't
- **Authorization logic duplicated instead of centralized** — copy-pasting the same permission check into every resolver that needs it means a fix applied to one location doesn't propagate to the others, a classic maintenance trap directly connecting to Path 04's DRY-principle coverage

## The directive-based authorization pattern

A genuinely robust, common approach: using **GraphQL directives** — custom annotations directly in the schema definition — to declare authorization requirements as part of the schema itself, rather than scattering permission checks throughout individual resolver function bodies:

```graphql
type User {
  name: String
  email: String @auth(requires: SELF_OR_ADMIN)
  salary: Float @auth(requires: HR_ADMIN)
}
```

This pattern moves authorization from imperative, easy-to-forget code scattered across resolvers into declarative, schema-visible policy — a reviewer scanning the schema can immediately see every field's access requirement in one place, rather than having to trace through separate resolver implementations to verify enforcement actually happened.

## Batching and the N+1 authorization problem

Directly connecting to the api-testing lesson's DataLoader/batching coverage for performance: a genuinely subtle authorization gap can emerge from performance-optimization patterns — if a batching layer fetches data for many objects in a single underlying query (to avoid the classic "N+1 query" performance problem), authorization checks written to run per-individual-object can accidentally get skipped or short-circuited by the batching optimization if the two systems weren't designed together carefully, meaning a well-intentioned performance fix can silently introduce an authorization bypass.

## Authorization at the connection/edge level, not just the node level

A genuinely GraphQL-specific consideration: authorization sometimes needs to apply to the *relationship* between two objects, not just each object individually — a user might be authorized to see a specific `Order` object generally, but not authorized to see it specifically in the context of another user's `orders` connection field, if that relationship itself reveals information (like "this order belongs to this specific other user") beyond what viewing the order in isolation would.

:::challenge Test yourself
Why does checking authorization only at a GraphQL query's root object (rather than at each individual field) create a genuine security gap, even when the root-level check itself is implemented correctly?
:::

## Key terms

- **Field-level authorization** — authorization checks evaluated per individual field at resolution time, not just once per query or endpoint.
- **Directive-based authorization** — declaring access requirements directly in the GraphQL schema using custom directives, rather than scattering checks across resolver code.
- **N+1 authorization gap** — an authorization bypass introduced when batching optimizations skip per-object checks meant to run individually.

## Recap

GraphQL's flexible, client-defined query structure means authorization can't be checked once per endpoint the way REST allows — it must be evaluated at the level of individual fields and resolvers. Common failures include checking only at the query root, inconsistent enforcement across resolvers, and duplicated rather than centralized logic. Directive-based authorization declared in the schema itself provides a more robust, auditable pattern, and batching optimizations built for performance need careful design to avoid silently skipping per-object authorization checks.

???refs
- [GraphQL — Authorization patterns](https://graphql.org/learn/authorization/)
- [OWASP — GraphQL Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
???
