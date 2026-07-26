# APIs & JSON

Modern web apps are basically two things stitched together: a JavaScript UI in your browser, and a set of **APIs** on a server. Learn to see the APIs and you see the real attack surface.

## What "API" actually means

**API** = Application Programming Interface. On the web, it usually means: **a URL that returns data (JSON) instead of a whole HTML page**.

Compare:

- `https://example.com/products` — returns HTML for a browser to render.
- `https://example.com/api/products` — returns JSON for another program to consume.

The second is an API. It's what the site's own JavaScript calls, what mobile apps call, and what integrations use.

## JSON in 60 seconds

JSON (JavaScript Object Notation) is text that looks like this:

```json
{
  "user": {
    "id": 42,
    "username": "alice",
    "roles": ["user", "editor"],
    "is_admin": false,
    "email": "alice@example.com"
  },
  "orders": [
    { "id": 101, "total": 29.99, "status": "shipped" },
    { "id": 102, "total": 15.00, "status": "processing" }
  ]
}
```

Six data types: **object** `{}`, **array** `[]`, **string** `"..."`, **number**, **boolean** `true/false`, **null**. That's all of JSON. Learn to read this and you can read 99% of modern web APIs.

## REST — the common style

Most public APIs follow a style called **REST**. It uses HTTP methods to mean specific things:

| Method | Meaning | Example |
|---|---|---|
| **GET** | Read | `GET /api/users/42` — get user 42 |
| **POST** | Create | `POST /api/users` (body has new user) |
| **PUT / PATCH** | Update | `PATCH /api/users/42` (body has changes) |
| **DELETE** | Delete | `DELETE /api/users/42` |

Resource identifiers appear in the path (`/users/42`), and data flows in the body as JSON. Learn to read a URL as *"which noun, which action?"* and you can read most REST APIs at a glance.

## Anatomy of an API call

```http
POST /api/orders HTTP/1.1
Host: shop.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "product_id": 101,
  "quantity": 2,
  "shipping_address_id": 7
}
```

And the response:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "order_id": 102,
  "status": "confirmed",
  "total": 59.98
}
```

Three things worth noticing:

1. **Auth in a header.** Not a form, not a cookie — a `Bearer` token. Very common on modern APIs.
2. **Content-Type: application/json** on both sides.
3. **HTTP status codes** carry real meaning — `201 Created` isn't just `200`, it says "made a new thing." APIs use status codes richly.

## Calling an API from Python — the payoff

Because APIs are just HTTP, you can call them from any language. Python's `requests` library makes it a breeze:

```python
import requests

# Simple GET
r = requests.get("https://api.github.com/repos/anthropics/anthropic-sdk-python")
print(r.status_code)                      # 200
data = r.json()                           # parses JSON into a Python dict
print(data["name"], data["stargazers_count"])

# Authenticated POST
headers = {"Authorization": "Bearer YOUR_TOKEN"}
payload = {"title": "Bug found", "body": "Details..."}
r = requests.post("https://api.example.com/issues",
                  json=payload, headers=headers)
print(r.status_code, r.json())
```

This is how nearly every automation tool, integration, and security tool works under the hood.

## Where API security bugs live

APIs deserve their own OWASP top-10 because they have *specific* recurring bug classes:

| Bug class | Shape |
|---|---|
| **BOLA / IDOR** — Broken Object Level Authorization | You access `/api/orders/102` and the server doesn't check whether order 102 belongs to you. |
| **Broken authentication** | Weak tokens, guessable secrets, JWT `alg: none`. |
| **Excessive data exposure** | The API returns the *whole user object* (email, phone, hashed password) and the UI only shows a name. Client can just read the extras. |
| **Broken function-level authorization** | Admin endpoint exists at `/api/admin/users/42/delete` but doesn't check role. |
| **Mass assignment** | POST a JSON with an `is_admin: true` field the server naively accepts. |
| **Unrestricted resource consumption** | No rate limit → brute force, credential stuffing. |
| **Server-side request forgery (SSRF)** | An API endpoint fetches a URL you supply, unfiltered. |

You'll meet each in Path 11. The point today: **APIs are where modern web bugs live, at least as much as the HTML UI.**

## API versioning and forgotten endpoints

APIs rarely stay static — as apps evolve, developers introduce `/api/v2/...` while `/api/v1/...` often keeps running quietly in the background for older mobile app versions still in the wild. Those old, unmaintained versions are a genuinely rich attack surface: a `v1` endpoint might lack a security fix that was only ever applied to `v2`, or might expose a field that `v2` deliberately hid after a privacy review. This is exactly the kind of thing Path 15's recon material teaches you to hunt for — trying `/api/v1/`, `/api/v0/`, `/api/beta/`, and similar guesses against any API you find, since forgotten versions are consistently one of the highest-value things to check in bug bounty recon.

## Rate limiting and pagination — the practical side

Two mundane-sounding API behaviours matter a lot in practice. **Rate limiting** caps how many requests a caller can make in a given window (commonly signalled with `429 Too Many Requests` and headers like `X-RateLimit-Remaining`) — the same defence discussed in Path 04's automation lesson, applied from the server's side this time. **Pagination** controls how much data a single request returns, typically via `?page=2&per_page=50` or a `cursor` parameter — an API that returns *everything* in one unpaginated response isn't just slow, it can hand an attacker your entire user table in a single request if authorization is also missing. Reading how an API paginates and rate-limits tells you a lot about how seriously its developers thought about abuse.

## Finding APIs on a site

Even sites with no "API documentation" have APIs. Every modern SPA is calling them under the hood. Simple approach:

1. Open the site in Firefox → **F12 → Network → XHR/Fetch filter**.
2. Click around. Every API call the UI makes lights up in the panel.
3. For each: right-click → **Copy → Copy as cURL**. You now have a self-contained command that replicates the request from your terminal.

That "Copy as cURL" trick is one of the single most useful bits of web-security workflow. Practise it now.

## Documenting formats you'll see

- **OpenAPI / Swagger** — the standard way of describing REST APIs. Look for `/swagger`, `/openapi.json`, `/api-docs`. Sometimes accidentally exposed on production 👀
- **GraphQL** — a newer style where the client says exactly which fields it wants in a single query. Common bug: enumeration via introspection.
- **gRPC** — high-performance binary API style, mostly internal. Sometimes exposed via `grpc-web`.
- **SOAP** — legacy XML style. Rare in new code, common in enterprise.

REST covers most of what you'll meet as a beginner.

## 🧪 Lab — Explore a real API

Try this in your terminal:

```bash
# 1. A public read-only API
curl -s https://api.github.com/repos/torvalds/linux | head -30

# 2. Same, but pretty-printed with jq (install: sudo apt install jq)
curl -s https://api.github.com/repos/torvalds/linux | jq

# 3. Just extract one field
curl -s https://api.github.com/repos/torvalds/linux | jq '.stargazers_count'

# 4. A Python version:
python3 -c "
import requests
r = requests.get('https://api.github.com/repos/torvalds/linux')
d = r.json()
print(f\"{d['name']}: {d['stargazers_count']} stars, {d['forks_count']} forks\")
"
```

Then try this on any web app you use (start with your own accounts):

1. Firefox → open the app → **F12 → Network → Fetch/XHR**.
2. Do something small (open your profile, load a page).
3. Right-click a request → **Copy as cURL**.
4. Paste into your terminal. Run it. Watch the same API respond.

That's you talking to the API directly, bypassing the entire UI. Every serious web attacker and defender does this daily.

:::challenge Test yourself
A friend says "our API is secure because our web UI hides the delete button unless you're an admin." What one word describes the flaw in that reasoning?

<details><summary>Show answer</summary><strong>Client-side.</strong> All UI hiding is client-side; the API endpoint itself must also enforce the check server-side. Otherwise an attacker just calls the endpoint directly (via cURL, Postman, or any script).</details>
:::

## Key terms

- **API** — a URL that returns data (usually JSON) for a program to consume.
- **REST** — a common HTTP API style using nouns in the path and HTTP verbs for actions.
- **JSON** — the near-universal data format for modern APIs.
- **Endpoint** — a specific API URL that does one thing.
- **Bearer token / API key** — common ways APIs authenticate callers.
- **OpenAPI / Swagger** — standard API description format.
- **BOLA / IDOR** — the biggest API bug class: missing per-object authorization.

## Recap

- Modern apps are UIs + APIs; the API is the real interface.
- JSON is a small, boring, universal data format — learn to read it fluently.
- REST uses HTTP methods to mean create/read/update/delete on resources.
- APIs have distinct bug classes (BOLA, mass assignment, excessive exposure).
- Firefox's "Copy as cURL" is the fastest way to explore any site's API.

???refs
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) — read this at least twice.
- [RESTful API design — freeCodeCamp](https://www.freecodecamp.org/news/rest-api-design-best-practices-build-a-rest-api/)
- [jq manual](https://jqlang.github.io/jq/manual/) — indispensable for JSON on the command line.
- [Postman Learning Center](https://learning.postman.com/) — a friendly UI for exploring APIs.
- [PortSwigger — API testing](https://portswigger.net/web-security/api-testing)
???

**Next up →** [WebSockets & the real-time web](#/lesson/05-web-basics/websockets-realtime-web)
