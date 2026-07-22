# GraphQL Security

GraphQL gives clients the power to ask for exactly the data they need. That power is also an attack surface.

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

## Common GraphQL risks

### 1. Introspection left on in production

```graphql
query {
  __schema {
    types { name fields { name } }
  }
}
```

This reveals the entire schema — every type, field, and relationship. Turn introspection off (or restrict it) in production.

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

### 3. Broken authorization at field level

Even if a user can query `user(id:)`, they may not be allowed to see `ssn` or `internalNotes`. Authorization must be enforced per field / per resolver, not only at the query entrance.

### 4. Batching attacks

Some servers allow arrays of operations in one HTTP request, multiplying the effect of a single BOLA or brute-force attempt.

### 5. Injections via GraphQL

Arguments that end up in SQL, LDAP, OS commands, etc. still need the same parameterised / safe handling you use everywhere else.

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

## Key terms

- **Introspection** — the ability to query the schema itself
- **Resolver** — the function that returns data for a field
- **Query complexity** — a score used to reject expensive queries

## Recap

GraphQL moves a lot of power to the client. That power must be matched by depth limits, field-level authorization, and careful schema exposure.

???refs
- [OWASP GraphQL Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [PortSwigger GraphQL](https://portswigger.net/web-security/graphql)
???