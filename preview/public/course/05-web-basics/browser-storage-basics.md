# Browser storage basics

The cookies-sessions lesson covered cookies specifically. This lesson covers the other ways a website can store data directly in your browser — genuinely important to know both as a developer and as someone assessing a web application's security.

## localStorage: simple, persistent key-value storage

```javascript
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");   // "dark"
```

**localStorage** persists indefinitely (until explicitly cleared) and is accessible only to scripts running on the same origin (the same-origin-policy lesson explains exactly what that means). Unlike cookies, localStorage data is *never* automatically sent to the server with every request — it stays entirely client-side unless a script explicitly reads and sends it.

## sessionStorage: the same idea, but temporary

**sessionStorage** works identically to localStorage, except it's cleared automatically when the browser tab closes — genuinely useful for data that should only persist for one browsing session, like a multi-step form's in-progress state.

## Why storing sensitive data in localStorage is a real, common mistake

:::danger A genuinely common real-world vulnerability
Storing an authentication token or session identifier in localStorage, rather than in a properly configured cookie, is a widespread real-world mistake — because unlike a cookie with the `HttpOnly` flag (which the cookies-sessions lesson should have introduced), localStorage is fully readable by *any* JavaScript running on the page, including malicious JavaScript injected through an XSS vulnerability. A successful XSS attack against a page storing its auth token in localStorage can trivially steal that token; the same attack against a properly `HttpOnly`-flagged cookie cannot, since `HttpOnly` cookies are specifically inaccessible to JavaScript entirely.
:::

## IndexedDB: for genuinely large amounts of structured data

**IndexedDB** is a more powerful, database-like browser storage option for applications needing to store significant amounts of structured data client-side (an offline-capable app, a large cached dataset) — genuinely overkill for simple key-value needs, but worth recognizing by name since you'll encounter it in more complex web applications.

## Comparing the storage options

| Storage type | Sent to server automatically? | Persists after tab closes? | Accessible to JavaScript? |
|---|---|---|---|
| Cookie (no HttpOnly) | Yes, every request | Depends on expiry | Yes |
| Cookie (HttpOnly) | Yes, every request | Depends on expiry | No |
| localStorage | No | Yes | Yes |
| sessionStorage | No | No | Yes |
| IndexedDB | No | Yes | Yes |

:::challenge Test yourself
Why does storing an authentication token in localStorage create meaningfully more risk from an XSS attack than storing it in an `HttpOnly` cookie?
<details><summary>Show answer</summary>An <code>HttpOnly</code> cookie is specifically designed to be inaccessible to JavaScript entirely — even if an attacker successfully injects malicious JavaScript onto the page through an XSS vulnerability, that script has no way to read the cookie's value, since the browser enforces this restriction at a level JavaScript simply can't bypass. localStorage, by contrast, has no equivalent protection — <em>any</em> JavaScript running on the page, including injected malicious code, can freely read and exfiltrate whatever is stored there. This means an XSS vulnerability that would be relatively contained against a properly <code>HttpOnly</code>-protected session becomes a full account-takeover vector the moment the same application stores its authentication token in localStorage instead — the underlying XSS bug is identical, but its real-world impact is dramatically different depending on where the sensitive token actually lives.</details>
:::

## Key terms

- **localStorage** — persistent, client-side key-value storage, readable by any JavaScript on the page.
- **sessionStorage** — identical to localStorage but cleared when the browser tab closes.
- **IndexedDB** — a more powerful, database-like client-side storage option for larger structured data.

## Recap

- localStorage and sessionStorage provide simple, persistent (or session-length) client-side storage, never automatically sent to the server.
- Storing sensitive tokens in localStorage is a genuinely common real-world mistake, since it's fully readable by any JavaScript on the page — including malicious script from a successful XSS attack, unlike a properly `HttpOnly`-flagged cookie.
- IndexedDB handles larger, more structured client-side storage needs, worth recognizing by name in more complex applications.

**Next up →** [Same-Origin Policy & CORS](#/lesson/05-web-basics/same-origin-policy-and-cors)
