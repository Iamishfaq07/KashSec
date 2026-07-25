# Why API Security Matters

Modern applications are built on APIs. Mobile apps, single-page web apps, microservices, partner integrations, and AI agents all talk through APIs. When an API is broken, the impact is rarely limited to one page — it can expose entire databases, user data, or internal systems, often in a single automated request.

:::tip
If you only learn one advanced topic after web security, make it API security. Most real bug-bounty and AppSec work today is API work — the browser UI is often the least interesting part of a target.
:::

## What is an API, really?

An API (Application Programming Interface) is a contract: "send me this request in this shape, and I will return this data."
Most modern APIs use HTTP and return JSON.

```http
GET /api/v1/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
```

The server replies with JSON. That simple pattern is how almost everything works now — the same endpoint that serves the official mobile app will happily serve a curl script from anyone who read the API contract off the app's traffic.

## Why APIs are a bigger attack surface

1. **They are the real backend** — the browser or app UI is just a client. Attackers go straight to the API and skip the UI entirely, along with any client-side validation the UI happened to enforce.
2. **They often lack the same defenses** as traditional web pages (no CSRF tokens, weaker rate limits, weaker authorization checks) — a lot of "we secured the website" effort historically stopped at the HTML layer.
3. **They return structured data** — perfect for automated enumeration and data extraction. A vulnerable web page leaks one record per click; a vulnerable API endpoint leaks one record per request, and a script can send thousands per minute.
4. **Mobile and third-party clients** force the API to be the only security boundary, since there's no server-rendered page enforcing anything on the way out.

## The mental model shift

In classic web apps you worried about:
- XSS in HTML
- SQLi in forms
- Session cookies

In APIs you worry about:
- **Authorization** (can this user access *this* object?) — this single question is behind the #1 API vulnerability class, covered in depth two lessons from now
- **Authentication** (is this token valid and not stolen?)
- **Input validation** of JSON bodies and query parameters
- **Business logic** flaws that only appear when you call endpoints in unexpected order or combinations — for example, calling "apply discount" twice, or calling "confirm order" before "add payment method" finishes

| | Classic web app | API |
|---|---|---|
| Primary client | Browser rendering HTML | Any HTTP client — app, script, curl |
| Client-side validation | Often partially trusted | Never trusted; server must recheck everything |
| Typical attack surface | Forms, cookies, rendered pages | Every documented (and undocumented) endpoint |
| Enumeration risk | Moderate — UI friction slows it | High — structured JSON is trivial to script against |
| Common blind spot | XSS, CSRF | BOLA, mass assignment, business logic |

## Real-world impact

High-profile breaches in the last few years almost always involved API flaws:
- Broken Object Level Authorization (BOLA) letting anyone read other users' data by changing an ID
- Overly permissive tokens or long-lived JWTs that stay valid long after a session should have ended
- GraphQL introspection + deep queries that exhaust resources or reveal the entire private schema
- Mass assignment letting users set `role=admin` on their own account, simply because the API accepted a field the client wasn't supposed to send

:::danger
Never assume "the mobile app will only call the API correctly."
Anything the mobile app can do, an attacker with Burp or curl can also do — often better, because they aren't constrained by the app's UI at all. Decompile the app or intercept its traffic once, and every endpoint it calls is now available to script directly, in any order, with any parameters.
:::

## A concrete scenario

An e-commerce app's mobile client calls `PATCH /api/v1/orders/8841` to let a user cancel their own pending order. The mobile UI only ever sends `{"status": "cancelled"}`. But the API accepts any field in the order object, because the developer built the endpoint generically and never restricted what could be updated. An attacker intercepts one request, notices the endpoint also accepts a `total_price` field, and sends `{"total_price": 0.01}` on an order they haven't paid for yet. The UI never offered this option — but the API never checked, either. This single pattern (accepting more than the client is supposed to send) recurs constantly in API security and gets its own dedicated lesson later in this path.

## 🧪 Hands-on lab — see the API behind an app

1. Pick any web app you use regularly (or use the browser DevTools on a site you're allowed to test).
2. Open the Network tab, perform a normal action (search, add to cart, view a profile), and find the underlying API request.
3. Note: what does the request look like without the UI wrapped around it? What parameters does it accept that the UI never exposes as options?
4. Try changing one parameter value (e.g., an ID) to something adjacent (like `42` → `43`) in a tool like Burp's repeater or curl, on an app you're authorized to test, and observe the response. This is the exact technique behind BOLA testing, which you'll formalize in a later lesson.

:::challenge Test yourself
1. Why is "the mobile app enforces this rule" not a security control at all?
2. Name one thing a browser-rendered web page can enforce that an API, called directly, cannot.
3. In the order-cancellation scenario above, what's the one-sentence fix a developer should apply to the `PATCH` endpoint?
:::

## What you will learn in this path

- The OWASP API Top 10 (2023)
- BOLA / IDOR in API contexts
- Broken authentication and JWT attacks
- GraphQL security
- Rate limiting, mass assignment, and excessive data exposure
- A practical lab you can run against a vulnerable API

## Key terms

- **API** — the interface clients use to talk to a server
- **BOLA** — Broken Object Level Authorization (the #1 API risk)
- **JWT** — JSON Web Token, a common way to carry identity
- **Mass assignment** — accepting more fields than the developer intended
- **Enumeration** — systematically trying many values (IDs, usernames) to extract or discover data at scale

## Recap

APIs are the real application. Treating them as a second-class citizen is how large data breaches happen — the browser UI was never the security boundary, the API was, and it's the API that has to enforce every rule the UI merely suggests. This path gives you the checklist and the hands-on skills that modern AppSec and bug-bounty roles expect.

???refs
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [PortSwigger: API testing](https://portswigger.net/web-security/api-testing)
???
