# Cookies & sessions

HTTP is **stateless** — every request stands alone, and the server has no memory of who you are between requests. So how does a site know you're logged in on page 5 when you logged in on page 1?

The answer: **cookies**. And with cookies come some of the juiciest security bugs on the web.

## Why cookies exist

Imagine every page reload asked you to log in again. Unusable. Servers need a way to say "I know this browser — it's Alice, logged in three minutes ago." Cookies are that memory.

The dance:

```mermaid
sequenceDiagram
    autonumber
    participant B as Browser
    participant S as Server
    B->>S: POST /login {user, password}
    S->>B: Set-Cookie: session=abc123; HttpOnly; Secure
    Note right of B: Browser stores the cookie
    B->>S: GET /profile<br/>Cookie: session=abc123
    S->>B: 200 OK — welcome Alice
    B->>S: GET /orders<br/>Cookie: session=abc123
    S->>B: 200 OK — Alice's orders
```

1. You log in.
2. The server sends `Set-Cookie: session=abc123` in the response.
3. The browser stores that cookie.
4. **Every subsequent request** to that site automatically includes it.
5. The server looks up `abc123` in its session store to know you're Alice.

That single stored value is your **session identifier** — the "key to your account" for the rest of your visit.

## Anatomy of a Set-Cookie header

```http
Set-Cookie: session=abc123def456; Path=/; Domain=example.com;
            Expires=Wed, 15 Jan 2027 12:00:00 GMT;
            HttpOnly; Secure; SameSite=Strict
```

Each part matters, especially for security:

| Attribute | What it means |
|---|---|
| `session=abc123def456` | Name and value |
| `Path=/` | Sent for requests under this path |
| `Domain=example.com` | Sent for this domain (and subdomains if leading dot) |
| `Expires=...` | When the browser should delete it |
| `HttpOnly` | JavaScript **cannot** read this cookie (defends against XSS stealing sessions) |
| `Secure` | Only send over HTTPS |
| `SameSite=Strict\|Lax\|None` | When to send on cross-site requests (CSRF defence) |

The last three are the security-critical flags. Every session cookie should have all three set sensibly.

## Session vs persistent cookies

- **Session cookie** — no `Expires`; deleted when the browser closes.
- **Persistent cookie** — has an `Expires` or `Max-Age`; survives restarts. Used for "remember me."

## Where the actual state lives

Two broad patterns:

### 1. Server-side sessions (traditional)

The cookie is just a random ID — the *real* data lives on the server:

```
Server session store:
abc123def456 → { user_id: 42, role: "user", logged_in_at: ..., cart: [...] }
```

To log someone out server-side, you delete their entry.

### 2. Signed / stateless tokens (JWT etc.)

The cookie itself contains the state, cryptographically signed so it can't be forged:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWxpY2UiLCJyb2xlIjoidXNlciJ9.<signature>
```

That's a **JWT** (JSON Web Token). Anyone can decode the base64 middle and read your claims — the *signature* stops them tampering. Convenient, but JWTs have a long, colourful history of bugs (bad algorithms, weak secrets, `alg: none` tricks). More in Path 11.

## What can go wrong — attacks worth knowing

### Session hijacking

The attacker gets a copy of your cookie and uses it. They're now you.

*How they get it:* XSS (if `HttpOnly` isn't set), HTTP interception (if `Secure` isn't set), physical access to your machine, malware.

*Defence:* `HttpOnly`, `Secure`, HTTPS everywhere, rotate the session on privilege change.

### Session fixation

The attacker gives *you* a session ID they know, tricks you into logging in with it, then reuses the (now-authenticated) ID.

*Defence:* Rotate the session ID on login. Every framework does this by default; ancient hand-rolled code sometimes doesn't.

### CSRF (Cross-Site Request Forgery)

The attacker gets your browser to send a state-changing request while you're logged in. Because cookies attach automatically, the request looks legitimate.

Example: your bank sits at `bank.com` and you're logged in. You visit `evil.com`, which has:

```html
<img src="https://bank.com/transfer?to=attacker&amount=1000">
```

Your browser fetches the "image" — sending your bank cookie along. If bank.com trusts the request purely because the cookie is valid, money moves.

*Defence:* **`SameSite=Lax` or `Strict`** on session cookies (huge win, now default in modern browsers), CSRF tokens on state-changing forms, checking the `Origin`/`Referer` header.

### Cookie tossing / subdomain confusion

Multiple subdomains sharing cookies can accidentally let one subdomain overwrite/read another's cookies. Common in complex platforms.

*Defence:* Careful `Domain` and `Path` scoping, `__Host-` cookie prefix.

### Session timeout and idle expiry

A session that lives forever is a growing liability — every cookie an attacker could ever steal stays valid indefinitely, and a device left logged in at a library or shared computer stays logged in for whoever sits down next. Well-designed sites enforce two separate limits: an **absolute timeout** (the session expires a fixed time after login, e.g. 24 hours, no matter what) and an **idle timeout** (the session expires after a period of *inactivity*, e.g. 30 minutes with no requests). Sensitive actions — changing a password, viewing payment details — often require *re-authentication* even within an otherwise-valid session, precisely because a session cookie alone isn't considered strong enough proof of "this is really the account owner, right now" for high-stakes actions. This same idea — that authentication isn't binary but has different strength requirements for different actions — reappears directly in Path 10's authentication material.

## The __Host- and __Secure- cookie prefixes

Browsers support special cookie name prefixes that come with *enforced* guarantees, closing gaps that the regular flags above leave open:

```http
Set-Cookie: __Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Strict
```

A cookie named `__Host-...` is only accepted by the browser if it also has `Secure` set, has `Path=/`, and has **no** `Domain` attribute at all — which means it can never be sent to a different subdomain, closing exactly the cookie-tossing/subdomain-confusion gap described above. `__Secure-` is a lighter version that only enforces `Secure`. These prefixes are a genuinely underused, cheap way to make a cookie's security properties self-enforcing rather than relying on every developer remembering to configure `Domain` and `Path` correctly by hand.

## Reading cookies as an attacker/defender

In Firefox DevTools:

1. **F12 → Storage → Cookies**.
2. You'll see every cookie the site sets, its value, and its flags.

Look at some real sites. Some things you'll notice:

- Big sites almost universally have `HttpOnly` and `Secure` set on their session cookies.
- Analytics cookies are typically not `HttpOnly` (JS needs to read them).
- Some cookies are outright JWTs — you can decode the middle at [jwt.io](https://jwt.io/) (never paste a *real* production JWT there — copy the structure to a fake token for study).

## The cookie's less-secure cousins

Modern browsers also expose:

- **`localStorage`** — persistent per-origin key-value store. **Not automatically sent** with requests. Great for app state; **bad for auth tokens** because *any* JS on the origin can read it (XSS = game over).
- **`sessionStorage`** — same but wiped on tab close.
- **IndexedDB** — larger structured store.

**Rule of thumb:** put session tokens in **HttpOnly cookies**, not localStorage. This is one of the most common modern SPA design mistakes.

## 🧪 Lab — Explore a real session

1. Open Firefox → visit any site you're logged in to (or make a throwaway account somewhere).
2. F12 → **Storage → Cookies**.
3. Find the session cookie (often named `session`, `sid`, `PHPSESSID`, `connect.sid`, `_appname_session`).
4. Note whether `HttpOnly`, `Secure`, and `SameSite` are set.
5. Delete the cookie. Refresh the page. You should be logged out.
6. (If comfortable) copy the cookie value, log out via the UI, then paste it back in another browser profile. Does the session still work, or did the server invalidate it on logout? A well-designed site kills the server-side session on logout — a lazy one leaves it valid.

Congratulations — you've just done a real session-cookie audit.

:::warn ONLY ON YOUR OWN ACCOUNTS
Session cookies are essentially passwords. Never grab or paste someone else's. Only ever experiment with sessions belonging to accounts you own.
:::

:::challenge Test yourself
Which cookie flag would have prevented JavaScript from stealing the session cookie if XSS were present on the site?

<details><summary>Show answer</summary><code>HttpOnly</code>. When set, the cookie is invisible to <code>document.cookie</code> and thus to any JS running on the page.</details>
:::

## Key terms

- **Session** — the concept of "who this browser is right now."
- **Cookie** — the mechanism the browser uses to remember state per site.
- **Set-Cookie** — the header the server uses to hand out a cookie.
- **HttpOnly / Secure / SameSite** — the three cookie security flags.
- **JWT** — a self-contained signed token.
- **CSRF / session hijacking / fixation** — the three big session-related attacks.
- **localStorage** — persistent JS-readable store; unsuitable for tokens.

## Recap

- HTTP is stateless; cookies give the server a way to remember you across requests.
- Every session cookie should be `HttpOnly`, `Secure`, and `SameSite`.
- Session data is stored server-side by session ID, or client-side via signed JWT.
- Hijacking, fixation, and CSRF are the classic attack classes; modern flags mitigate most.
- Prefer HttpOnly cookies over `localStorage` for auth tokens.

???refs
- [MDN — HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [PortSwigger — CSRF](https://portswigger.net/web-security/csrf)
- [PortSwigger — JWT attacks](https://portswigger.net/web-security/jwt) — the modern reference.
- [Web.dev — SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained)
???

**Next up →** [APIs & JSON](#/lesson/05-web-basics/apis-json)
