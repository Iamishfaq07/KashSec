# GraphQL Security Basics

The API-security lesson covered traditional REST-style APIs. This lesson introduces **GraphQL**, an increasingly common alternative API architecture with its own genuinely distinct security considerations, before Path 21's dedicated GraphQL introspection lab goes hands-on.

## What GraphQL actually is, briefly

Unlike a REST API's fixed set of endpoints (each returning a predetermined data shape), **GraphQL** exposes a single endpoint where the *client* specifies exactly what data it wants in the request itself:

```graphql
query {
  user(id: "1024") {
    name
    email
    orders {
      id
      total
    }
  }
}
```

This flexibility is genuinely powerful for legitimate application development — a client can fetch precisely the data it needs in one request, rather than making several separate REST calls — but it introduces security considerations that don't have a direct REST equivalent.

## Introspection: GraphQL's built-in self-documentation

Most GraphQL implementations support **introspection** — a query that asks the API to describe its own complete schema: every available field, type, and relationship:

```graphql
query {
  __schema {
    types {
      name
      fields { name }
    }
  }
}
```

Introspection is genuinely useful during development, but left enabled in production, it hands an attacker a complete, automatically-generated map of the entire API's data model — every field, every relationship, every potentially sensitive internal field name — without any of the manual reconnaissance effort the web-recon lesson described for traditional APIs. This exact scenario is what Path 21's GraphQL introspection lab lets you practice hands-on.

## Why GraphQL amplifies some existing vulnerability classes

- **IDOR, but easier to find** — introspection reveals every queryable relationship directly, making the object-level authorization gaps this path has covered repeatedly easier for an attacker to systematically locate
- **Query complexity / depth attacks** — GraphQL's nested query structure allows a maliciously crafted, deeply nested query to force the server to perform an enormous amount of work resolving it, a denial-of-service pattern genuinely specific to GraphQL's query model, unrelated to the "billion laughs" XML attack but conceptually similar in spirit
- **Batching abuse** — some GraphQL implementations allow multiple queries in a single request, which can be abused to bypass rate limiting (Path 21's dedicated lab) designed around counting individual HTTP requests rather than individual queries within a request

## Practical defenses

- **Disable introspection in production** — the single highest-value, lowest-effort GraphQL-specific hardening step
- **Enforce query depth and complexity limits** — rejecting queries that exceed a reasonable nesting depth or computational cost before they're fully executed
- **Apply the exact same object-level authorization checks GraphQL's flexibility doesn't provide automatically** — GraphQL's ability to fetch related, nested data doesn't mean authorization is automatically enforced at every level of that nesting; each resolver needs its own genuine authorization check, exactly the same discipline the IDOR lesson demanded of REST endpoints

:::challenge Test yourself
Why does leaving GraphQL introspection enabled in production hand an attacker a meaningfully bigger advantage than a traditional REST API's lack of built-in self-documentation?
<details><summary>Show answer</summary>A REST API attacker typically has to manually reconstruct the API's structure through the web-recon lesson's techniques — inspecting client-side JavaScript, guessing endpoint patterns, watching network traffic — a genuinely effortful process that reveals the API's shape incrementally and imperfectly. GraphQL introspection, when enabled, directly answers the exact question an attacker would otherwise have to painstakingly reconstruct: it returns the complete schema — every type, every field, every relationship — in a single, machine-readable response, effectively handing over a complete map of the entire API's data model with zero manual reconnaissance effort required. This is exactly why disabling introspection in production is considered such high-value, low-effort hardening — it doesn't fix any underlying vulnerability, but it removes the single easiest reconnaissance shortcut an attacker would otherwise have.</details>
:::

## Key terms

- **GraphQL** — an API architecture where clients specify exactly what data they want in a single flexible query, rather than calling fixed REST endpoints.
- **Introspection** — a GraphQL feature allowing a query to retrieve the API's complete schema.
- **Query depth/complexity attack** — a denial-of-service technique exploiting GraphQL's nested query structure to force excessive server-side work.

## Recap

- GraphQL's flexibility is genuinely powerful, but introspection left enabled in production hands an attacker a complete API map with essentially no reconnaissance effort.
- GraphQL amplifies existing vulnerability classes (IDOR becomes easier to find) and introduces genuinely new ones (query depth attacks, batching-based rate-limit bypass).
- Disabling introspection, enforcing query complexity limits, and applying real per-resolver authorization checks are the practical defenses, and Path 21's dedicated lab lets you practice the introspection-abuse pattern hands-on.

**Next up →** [Web Application Firewalls](#/lesson/11-web-security/web-application-firewalls)
