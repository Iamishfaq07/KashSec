# GraphQL Security

GraphQL gives clients the power to ask for exactly the data they need. That power is also an attack surface — everything that made GraphQL attractive to developers (one endpoint, client-shaped queries, self-documenting schema) is exactly what a tester or attacker leans on first.

:::tip
When you land on any GraphQL target, your first move should always be the same: try introspection. It's the single fastest way to understand what an application can actually do, often revealing fields and mutations no UI ever exposes.
:::

## Why GraphQL is different

Instead of many fixed REST endpoints, there is usually one endpoint (`/graphql`) that accepts queries and mutations. The client decides the shape of the response.

```graphql
query {
  user(id: 42) {
    email
    orders {
      id
      total
    }
  }
}
```

This single endpoint model has a security consequence worth internalizing: there's no equivalent of "list the app's endpoints by crawling its routes." The entire attack surface is described by the schema, and the schema is either exposed to you via introspection or it isn't.

## Common GraphQL risks

### 1. Introspection left on in production

```graphql
query {
  __schema {
    types { name fields { name } }
  }
}
```

This reveals the entire schema — every type, field, and relationship. Turn introspection off (or restrict it) in production. Even without introspection, some servers can be probed field-by-field using suggestion errors ("Did you mean `internalNotes`?"), so disabling introspection is a mitigation, not a complete fix.

### 2. Nested / expensive queries (DoS)

```graphql
query {
  posts {
    author {
      posts {
        author {
          posts { ... }
        }
      }
    }
  }
}
```

Deep or wide queries can exhaust CPU and memory. Mitigations: query depth limits, complexity scoring, timeouts, persisted queries.

**Why this matters more than it looks**: a REST API doing the equivalent nested fetch would require the client to make several separate round-trip requests, each individually rate-limitable. A single GraphQL query can express the same nested fetch in one request, which is exactly why depth/complexity limiting has to exist as its own control — normal rate limiting (requests per second) doesn't catch "one enormous request."

### 3. Broken authorization at field level

Even if a user can query `user(id:)`, they may not be allowed to see `ssn` or `internalNotes`. Authorization must be enforced per field / per resolver, not only at the query entrance.

**Worked example**: the `user` query's top-level resolver correctly checks "is the caller allowed to view this user at all?" But `user.paymentMethods` is resolved by a separate function, written by a different engineer six months later, that just returns whatever's in the database without re-checking permission. Since the top-level query passed its check, the nested field never gets asked the question at all. Every additional level of nesting is a fresh opportunity for exactly this gap.

### 4. Batching attacks

Some servers allow arrays of operations in one HTTP request, multiplying the effect of a single BOLA or brute-force attempt. A login mutation that would normally be rate-limited per HTTP request can be sent as an array of 500 login attempts inside one request, testing 500 password guesses while looking to a naive rate limiter like a single call.

### 5. Injections via GraphQL

Arguments that end up in SQL, LDAP, OS commands, etc. still need the same parameterised / safe handling you use everywhere else. GraphQL is a query language for the API, not a substitute for safe handling of whatever the resolver does with an argument internally — a resolver that builds a raw SQL string from a GraphQL argument is exactly as vulnerable as a REST handler doing the same thing.

## Testing tips

1. Run introspection (if enabled) and map the schema.
2. Look for ID-based queries and test BOLA.
3. Try deeply nested queries and large lists.
4. Test mutations the same way you test state-changing REST endpoints.
5. Check whether suggestions / error messages leak schema details.

:::tip
Tools: GraphQL Voyager, InQL (Burp), Altair, GraphiQL, and the browser network tab are enough to get started.
:::

## Defenses (summary)

- Disable or protect introspection in production
- Enforce depth and complexity limits
- Authorize in every resolver
- Use persisted / allow-listed queries for public clients when possible
- Apply the same input validation and output encoding you would for REST

:::danger
"We authorize at the top-level query" is the GraphQL equivalent of "we checked authentication but not authorization" from earlier in this path. Every resolver, at every depth, is a place where a check can be silently missing — and unlike REST's separate endpoints, these are all invisible inside a single `/graphql` URL in your access logs.
:::

## 🧪 Hands-on lab — map and probe a GraphQL API

1. Find a GraphQL playground or lab endpoint (many public "awesome-graphql" repos link to intentionally practice-friendly targets, or use a course lab if available).
2. Send an introspection query and record every type and field returned. Note any field names that sound sensitive or internal.
3. Pick an object-returning query with an ID argument and test BOLA the same way you would on REST: authenticate as two different accounts and swap IDs.
4. Construct a deeply nested query (4–5 levels) against a relational field, if one exists, and observe response time as depth increases.
5. If a mutation exists, test whether it accepts unexpected fields, mirroring the mass-assignment testing approach from the earlier lesson.

:::challenge Test yourself
1. Why doesn't disabling introspection fully close off schema discovery?
2. Explain, using the `user.paymentMethods` example, why authorization at the top-level query is not sufficient in GraphQL.
3. What single technique lets an attacker bypass a rate limiter that only counts "requests per second" against a login mutation?
:::

## Key terms

- **Introspection** — the ability to query the schema itself
- **Resolver** — the function that returns data for a field
- **Query complexity** — a score used to reject expensive queries
- **Persisted query** — a pre-registered, allow-listed query the client references by ID instead of sending arbitrary query text
- **Batching** — sending multiple GraphQL operations in a single HTTP request

## Recap

GraphQL moves a lot of power to the client. That power must be matched by depth limits, field-level authorization enforced in every resolver (not just the top-level query), and careful schema exposure — the same authorization discipline REST needs, applied at a finer grain because one query can touch many objects and fields at once.

???refs
- [OWASP GraphQL Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [PortSwigger GraphQL](https://portswigger.net/web-security/graphql)
- [GraphQL introspection docs](https://graphql.org/learn/introspection/) — official reference for the feature discussed above
???
