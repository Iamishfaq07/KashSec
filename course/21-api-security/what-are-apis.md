# What are APIs and why do they matter for security?

APIs (Application Programming Interfaces) are how modern software talks to other software. When your phone app shows your bank balance, when a website loads comments, when one microservice asks another for user data — an API is doing the work.

In 2026, **most of the attack surface of a modern application is its APIs**, not the classic HTML forms of the 2000s.

:::tip
Every API call you'll ever analyze answers the same three questions: who is asking, what are they asking for, and should they be allowed to have it? Almost every API vulnerability in this path is a broken answer to one of those three.
:::

## The simple picture

Think of a restaurant:

- The **kitchen** is the server / database / business logic
- The **menu** is the API documentation
- The **waiter** is the API itself — it takes your order (request), talks to the kitchen, and brings back the food (response)

If the waiter never checks whether you're allowed to order the expensive wine, or if they shout your credit card number across the room, that's an API security problem.

Extend the analogy a little further: the menu (documentation) might list only the dishes the restaurant *wants* you to order, but the kitchen can often still make things that aren't on the menu if you ask the waiter directly and they're not paying attention. This is exactly how undocumented or "internal" API endpoints get discovered and abused — the fact that something isn't in the public docs doesn't mean the server will refuse it.

## Why APIs are different (and often more dangerous)

| Classic web page | Modern API |
|------------------|------------|
| Returns HTML meant for humans | Returns JSON/XML meant for machines |
| Browser helps enforce some rules | Client is often a mobile app or another service you don't control |
| Session cookies are common | Tokens (JWT, API keys, OAuth) are common |
| One request → one page | One request can return or change a lot of data |

Attackers love APIs because:

1. **They are machine-readable** — easy to script and fuzz. Every field name, every parameter, every response shape is right there in plain JSON, no HTML parsing required.
2. **They often expose more data** than the UI shows. A `GET /users/42` endpoint built to power a profile page might return the user's email, internal role flags, and last-login IP even though the page only displays a name and avatar.
3. **Authorization is frequently incomplete** (the classic BOLA/IDOR problem, covered fully two lessons from now).
4. **They are everywhere** — mobile apps, SPAs, microservices, third-party integrations, IoT devices. Every one of these is a separate client hitting the same API, and the API has to defend itself against all of them equally, including the ones its developers never anticipated.

:::warn
Response over-exposure is one of the easiest API bugs to miss during development, because the developer testing the feature only ever looks at what the *UI displays* — not at the raw JSON the server actually sent. Always inspect the full response body, not just what renders on screen.
:::

## Core terms you'll see everywhere

- **Endpoint** — a specific URL + method combination (e.g. `GET /api/v1/users/42`)
- **Request** — what the client sends (method, path, headers, body)
- **Response** — what the server sends back (status code, headers, body)
- **Authentication** — proving who you are
- **Authorization** — proving you're allowed to do this particular thing
- **Schema** — the expected shape of the data (OpenAPI/Swagger is the most common way to describe it)

## The security mindset for APIs

When you look at any API, ask:

1. Who is allowed to call this endpoint?
2. What data can they see or change?
3. What happens if I change the ID in the URL?
4. What happens if I send unexpected fields or types?
5. Is there any rate limiting or abuse protection?
6. Does the response leak more information than the UI would?

We'll answer these systematically in the rest of this path.

## Worked example: reading a request/response pair

```http
POST /api/v1/comments HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{"post_id": 501, "text": "great article!"}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{"id": 9931, "post_id": 501, "author_id": 42, "author_email": "user42@mail.com", "text": "great article!"}
```

Apply the six questions above to this pair:
- Who's allowed to call it? Anyone with a valid bearer token — but is there a check that `post_id` 501 actually accepts comments, or is publicly visible to this user?
- What can they see/change? They posted a comment — fine. But the *response* includes `author_email`, which the comment UI never displays. That's excessive data exposure, question 6, right there.
- What if the ID changes? What happens if `post_id` points to a private or deleted post?

This is the exact analytical habit the rest of this path builds into muscle memory.

## 🧪 Hands-on lab — map an API from its traffic

1. Open browser DevTools (Network tab) on a web app you're authorized to use.
2. Perform 3–4 different actions (view a list, view a detail page, submit a form, search).
3. For each resulting API call, write down: method, path, and every field present in the *response* body — not just what the UI shows.
4. Circle any response field that doesn't appear anywhere in the rendered page. Each one is a candidate for "the UI hid this, but the API sent it anyway."
5. For one endpoint, note what identifier (ID, slug, token) it uses to select which record to return — this is what you'll target with the BOLA techniques two lessons ahead.

:::challenge Test yourself
1. In the restaurant analogy, what does "the kitchen can make things that aren't on the menu" correspond to in real API terms?
2. Why is "the response contains data the UI doesn't render" still a security bug, even if a normal user would never see it?
3. List the six-question checklist from memory, in your own words.
:::

## Key takeaway

APIs are the new front door. Most real-world breaches in the last few years involved API-level authorization failures, excessive data exposure, or broken authentication — not sophisticated zero-days.

:::tip
If you only remember one thing: **never trust the client**. The mobile app or SPA can be modified, decompiled, or bypassed entirely. All real security decisions must happen on the server.
:::

## Recap

An API is a contract between client and server, but the contract is only as strong as what the server actually enforces — documentation, UI hiding, and client-side checks are suggestions, not security controls. The habit of reading full request/response pairs, not just what the UI shows, is the single most useful skill for everything that follows in this path.

???refs
- [OWASP API Security Top 10](https://owasp.org/API-Security/) — the industry checklist we'll follow throughout this path
- [What is an API? (Mozilla)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction)
???
