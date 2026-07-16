# HTTP & HTTPS

This is the protocol you'll spend the most time with, because most modern hacking is *web* hacking. Every time you open a website, your browser and the site's **server** have a conversation using a protocol called **HTTP** — the HyperText Transfer Protocol. It's the language of the web.

## Request and response

HTTP is a simple back-and-forth. Your browser sends a **request** ("please give me this page"), and the server sends back a **response** (the page).

:::tip THE TWO WORDS TO REMEMBER FOREVER
**Request** and **response.** Almost all web hacking is crafting clever requests and studying the responses. Burn these two words into memory.
:::

## Anatomy of a request

```http
GET /products?id=42 HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: session=abc123
```

- **`GET`** — the *method* (the action).
- **`/products?id=42`** — the *path*, plus a *parameter* named `id` with value `42`.
- The lines below are **headers** — extra info like who you are (`Cookie`) and what browser you use.

### The most common methods

| Method | What it means |
|---|---|
| **GET** | "Give me something" — load a page |
| **POST** | "Here's some data for you" — submit a form, log in |
| **PUT** | "Replace this resource" |
| **PATCH** | "Update part of this resource" |
| **DELETE** | "Delete this resource" |
| **OPTIONS** | "What can I do here?" — used by browsers for CORS |
| **HEAD** | Like GET but response has no body |

GET and POST cover most of what you'll meet early on.

## Anatomy of a response

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 4218
Set-Cookie: session=xyz789; HttpOnly; Secure

<html>
  <body>...</body>
</html>
```

The first line has a **status code** telling you how it went.

### Status code families — learn these!

You'll watch these constantly during testing:

| Family | Meaning | Common ones |
|---|---|---|
| **1xx** | Info (rare) | 100 Continue |
| **2xx** | ✅ Success | **200 OK**, 201 Created, 204 No Content |
| **3xx** | ↪ Redirect | 301 Moved, **302 Found**, 304 Not Modified |
| **4xx** | ❌ Your error | **400 Bad Request**, **401 Unauthorized**, **403 Forbidden**, **404 Not Found**, **429 Too Many Requests** |
| **5xx** | 💥 Server error | **500 Internal Server Error**, 502 Bad Gateway, 503 Service Unavailable |

:::tip 5XX = YOU TOUCHED SOMETHING
When you see a 500 during testing, it often means the server crashed on your input — a big hint that a bug might live there. 403 says "you're not allowed" (interesting: it means something IS there). 404 usually means "not there at all."
:::

## HTTP versions

- **HTTP/1.1** — the classic, still very common.
- **HTTP/2** — binary, multiplexed, faster; widely deployed.
- **HTTP/3** — over QUIC (UDP under the hood!), even newer, growing fast.

Modern browsers pick the best version automatically. Same *semantics* (methods, headers, status codes) across all three.

## The 'S' is for Secure

Plain HTTP sends everything in **plain text**. Remember packets travel shared roads where others might read them? With plain HTTP, anyone in the middle — on the same Wi-Fi or along the route — could read everything, including your password as you type it.

**HTTPS** fixes this. The 'S' stands for **Secure**: the whole conversation is **encrypted** using **TLS** — scrambled into gibberish only your browser and the real server can unscramble.

~~~svg HTTP vs HTTPS on the wire
<svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="12">
    <!-- HTTP -->
    <rect x="30" y="30" width="140" height="180" rx="8" fill="#111927" stroke="#E05548" stroke-width="2"/>
    <text x="100" y="55" text-anchor="middle" fill="#E05548" font-weight="700" font-size="15">HTTP (port 80)</text>
    <rect x="45" y="70" width="110" height="130" rx="4" fill="#080c12" stroke="#E05548" stroke-dasharray="3"/>
    <text x="100" y="95" text-anchor="middle" fill="#E9EEF3" font-size="11">POST /login</text>
    <text x="100" y="115" text-anchor="middle" fill="#E9EEF3" font-size="11">user=alice</text>
    <text x="100" y="135" text-anchor="middle" fill="#E05548" font-size="11" font-weight="700">pass=hunter2</text>
    <text x="100" y="180" text-anchor="middle" fill="#8496A6" font-size="10">Readable!</text>
    <!-- HTTPS -->
    <rect x="200" y="30" width="140" height="180" rx="8" fill="#111927" stroke="#3FB6A8" stroke-width="2"/>
    <text x="270" y="55" text-anchor="middle" fill="#3FB6A8" font-weight="700" font-size="15">🔒 HTTPS (port 443)</text>
    <rect x="215" y="70" width="110" height="130" rx="4" fill="#080c12" stroke="#3FB6A8" stroke-dasharray="3"/>
    <text x="270" y="95" text-anchor="middle" fill="#8496A6" font-size="11">a3f9b2c0e1d4</text>
    <text x="270" y="115" text-anchor="middle" fill="#8496A6" font-size="11">7e8c2a1b6d5f</text>
    <text x="270" y="135" text-anchor="middle" fill="#8496A6" font-size="11">4b9a0c1e3d7</text>
    <text x="270" y="180" text-anchor="middle" fill="#3FB6A8" font-size="10">Encrypted!</text>
    <!-- Arrow to explanation -->
    <text x="500" y="80" text-anchor="middle" fill="#E9EEF3" font-weight="600">🔐 TLS wraps HTTP</text>
    <text x="500" y="105" text-anchor="middle" fill="#8496A6" font-size="11">1. Certificate check</text>
    <text x="500" y="125" text-anchor="middle" fill="#8496A6" font-size="11">2. Key exchange</text>
    <text x="500" y="145" text-anchor="middle" fill="#8496A6" font-size="11">3. Encrypted channel</text>
    <text x="500" y="170" text-anchor="middle" fill="#EFA43A" font-size="11">The padlock 🔒</text>
    <text x="500" y="185" text-anchor="middle" fill="#8496A6" font-size="10">= this is working</text>
  </g>
</svg>
~~~

- **HTTP** — plain text; anyone in the middle can read it. Never for anything private.
- **HTTPS** — encrypted; safe from eavesdroppers. What virtually all real sites use today.

## The TLS handshake (in one paragraph)

When you connect over HTTPS, the browser and server perform a **TLS handshake** first: the server presents a **certificate** proving its identity (signed by a trusted Certificate Authority), they agree on a session key, and then all future traffic is encrypted with that key. If the certificate is missing, expired, or from an untrusted CA — the browser shows a scary red warning.

:::danger NEVER CLICK THROUGH CERTIFICATE WARNINGS
On a real site, a certificate warning often means someone is trying to intercept your connection (a **man-in-the-middle** attack). Don't click "proceed anyway" on sites where you'll enter passwords or personal data.
:::

## Idempotency and "safe" methods — a distinction that matters for testing

Two properties worth understanding about HTTP methods, since they directly affect how you test safely: a method is **safe** if it's not supposed to change anything on the server (GET, HEAD — just retrieving data), and a method is **idempotent** if calling it multiple times has the same effect as calling it once (GET, PUT, DELETE all qualify — deleting the same resource twice leaves it deleted either way; POST notably does *not* qualify, since submitting the same form twice might create two separate orders). This matters directly in testing: automated scanners and tools like Burp's Intruder (Path 07) are generally safe to run against GET requests repeatedly, but running the same destructive POST request many times during testing can have real, compounding side effects on the target application — worth being deliberate about, especially during authorized testing where causing unintended damage reflects poorly regardless of your actual intentions.

## HTTP headers worth knowing

You'll live in these when testing:

| Header | Purpose |
|---|---|
| `Host` | Which domain you're asking (a server may host many) |
| `Cookie` / `Set-Cookie` | Session state |
| `User-Agent` | What browser you claim to be |
| `Content-Type` | Format of the body (`application/json`, etc.) |
| `Authorization` | Auth tokens (e.g., `Bearer <JWT>`) |
| `Referer` | Where you came from |
| `X-Forwarded-For` | Original IP through proxies (sometimes trusted, always risky) |
| `Strict-Transport-Security` (HSTS) | Force HTTPS from now on |
| `Content-Security-Policy` (CSP) | Restricts what a page can load and run |

## 🧪 Lab — Watch requests happen

1. Open any website in your browser.
2. Press **F12** to open Developer Tools, and click the **Network** tab.
3. **Refresh** the page and watch the list of requests appear.
4. Click one request and explore: its **method** (GET/POST), its **status code**, its **headers**, and the **response**. You're now looking at raw HTTP — the exact thing web hackers study.

We go deep on DevTools in **Path 05**.

:::challenge Test yourself
You send a request and get back a **500 Internal Server Error**. What does that suggest as a tester?

<details><summary>Show answer</summary>The server crashed on your input — you *touched something*. That's often a hint that a bug may live in that endpoint. Investigate what specifically caused it.</details>
:::

## Key terms

- **HTTP** — the web's request/response protocol.
- **Request / response** — what your browser sends and the server returns.
- **GET / POST / PUT / DELETE** — different HTTP methods.
- **Header** — extra info attached to a request or response.
- **Status code** — the 2xx / 3xx / 4xx / 5xx result of a request.
- **HTTPS / TLS** — encrypted HTTP (the padlock).
- **HSTS** — forces future HTTPS connections.

## Recap

- HTTP is the web's language: your browser requests, the server responds.
- Requests have methods, paths, parameters, and headers; responses have status codes.
- Plain HTTP is readable in the middle; HTTPS encrypts everything with TLS.
- Request-and-response is the heart of web hacking — you'll build on this constantly.

???refs
- [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — the definitive friendly reference.
- [HTTP status codes explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — bookmark it.
- [How HTTPS actually works — HowHTTPS.works](https://howhttps.works/) — comic-style TLS explainer.
- [SSL Labs test](https://www.ssllabs.com/ssltest/) — check the HTTPS quality of any site.
???

## 🎉 You've finished Path 02

You now understand networks, IP addresses, ports, packets & OSI layers, protocols, TCP vs UDP, DNS, and HTTP/HTTPS. This is the true foundation under every attack and defence — you can picture how data moves and where an attacker fits in.

**Next up →** [DNS Lab](#/lesson/02-networking/dns-lab)
