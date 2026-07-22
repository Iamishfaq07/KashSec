# What are APIs and why do they matter for security?

APIs (Application Programming Interfaces) are how modern software talks to other software. When your phone app shows your bank balance, when a website loads comments, when one microservice asks another for user data — an API is doing the work.

In 2026, **most of the attack surface of a modern application is its APIs**, not the classic HTML forms of the 2000s.

## The simple picture

Think of a restaurant:

- The **kitchen** is the server / database / business logic
- The **menu** is the API documentation
- The **waiter** is the API itself — it takes your order (request), talks to the kitchen, and brings back the food (response)

If the waiter never checks whether you’re allowed to order the expensive wine, or if they shout your credit card number across the room, that’s an API security problem.

## Why APIs are different (and often more dangerous)

| Classic web page | Modern API |
|------------------|------------|
| Returns HTML meant for humans | Returns JSON/XML meant for machines |
| Browser helps enforce some rules | Client is often a mobile app or another service you don’t control |
| Session cookies are common | Tokens (JWT, API keys, OAuth) are common |
| One request → one page | One request can return or change a lot of data |

Attackers love APIs because:

1. **They are machine-readable** — easy to script and fuzz
2. **They often expose more data** than the UI shows
3. **Authorization is frequently incomplete** (the classic BOLA/IDOR problem)
4. **They are everywhere** — mobile apps, SPAs, microservices, third-party integrations, IoT

## Core terms you’ll see everywhere

- **Endpoint** — a specific URL + method combination (e.g. `GET /api/v1/users/42`)
- **Request** — what the client sends (method, path, headers, body)
- **Response** — what the server sends back (status code, headers, body)
- **Authentication** — proving who you are
- **Authorization** — proving you’re allowed to do this particular thing
- **Schema** — the expected shape of the data (OpenAPI/Swagger is the most common way to describe it)

## The security mindset for APIs

When you look at any API, ask:

1. Who is allowed to call this endpoint?
2. What data can they see or change?
3. What happens if I change the ID in the URL?
4. What happens if I send unexpected fields or types?
5. Is there any rate limiting or abuse protection?
6. Does the response leak more information than the UI would?

We’ll answer these systematically in the rest of this path.

## Key takeaway

APIs are the new front door. Most real-world breaches in the last few years involved API-level authorization failures, excessive data exposure, or broken authentication — not sophisticated zero-days.

:::tip
If you only remember one thing: **never trust the client**. The mobile app or SPA can be modified. All real security decisions must happen on the server.
:::

???refs
- [OWASP API Security Top 10](https://owasp.org/API-Security/) — the industry checklist we’ll follow throughout this path
- [What is an API? (Mozilla)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction)
???