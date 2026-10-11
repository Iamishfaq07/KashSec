# Cookies & Sessions Lab

The main lesson explained *why* cookies and sessions exist. This lab has you actually inspect, break, and understand real session mechanics using nothing but your browser's built-in tools.

## Lab tasks

1. **Inspect cookies in DevTools.** Open DevTools (`F12`) → **Application** tab (Chrome) or **Storage** tab (Firefox) → **Cookies**. Log into any site you have an account on and find the session cookie — usually named something like `session`, `sessionid`, `PHPSESSID`, or a framework-specific name. Note its value: a long, effectively random-looking string is exactly what you'd expect from a securely generated session token.
2. **Test for insecure cookie flags.** Still in that same cookie inspector, check for three critical flags: **HttpOnly** (prevents JavaScript from reading the cookie — a key XSS mitigation), **Secure** (the cookie is only ever sent over HTTPS, never plain HTTP), and **SameSite** (controls whether the cookie is sent on cross-site requests, a core CSRF defense). Test a few different sites you use and note how many get all three right — you'll likely be surprised how inconsistent this is even among major sites.
3. **Attempt session behavior testing in a safe lab.** Using PortSwigger's free Web Security Academy (referenced throughout Path 11), work through one of their session-related labs — session fixation (where an attacker sets a victim's session ID *before* they log in, then reuses it after) is a great first one to understand hands-on.
4. **Understand server-side validation.** Open your browser's Network tab, find any authenticated request, and note that the *only* thing proving who you are on every single request is that cookie value being sent along automatically — there's no re-typing your password each time. This is exactly why protecting that one value (via HttpOnly, Secure, and proper session expiration) matters so much.

5. **Decode a JWT you find.** If any site you use stores a JWT (rather than an opaque random session ID) in a cookie or `localStorage`, copy its value to [jwt.io](https://jwt.io/) (or better, a local decoder, so you never paste a real production token into a third-party site) and read the decoded header and payload. Note what claims it carries — `sub`, `role`, `exp` — and think about what would happen if the signature check were ever skipped or the signing key were weak, the exact class of bug Path 11's JWT material covers in depth.
6. **Compare logout behaviour.** Log into a test account, copy its session cookie value somewhere safe, then log out through the site's normal UI. Try pasting the old cookie value back in (a private/incognito window is a clean way to test this). If the page still shows you logged in, the server never actually invalidated the session — it just told your browser to forget the cookie, which is a meaningfully weaker form of "logout" than most users assume.

:::tip Try tampering with a cookie value yourself
In a lab environment you're authorized to test (PortSwigger's labs are ideal for this), try manually editing a cookie value in DevTools — even something as simple as changing a numeric user ID stored in a cookie — and reload the page. If the app blindly trusts what it receives, you've just found a real vulnerability class covered directly in Path 11's IDOR lesson.
:::

:::challenge Document a session vulnerability
Using a PortSwigger lab (or another legal, purpose-built vulnerable target), find and exploit one session-related flaw — a missing `HttpOnly` flag combined with a reflected XSS, a predictable session token, or a session fixation issue. Write it up: what the flaw was, how you exploited it, and what the real-world impact would be for actual users.
:::

## Key takeaway

Session cookies are, functionally, the single credential proving your identity on every request after login — the three flags (`HttpOnly`, `Secure`, `SameSite`) exist specifically to protect that one value from the three most common ways it gets stolen or abused (script access, network interception, and cross-site forgery), and checking for them takes seconds once you know where to look.

**Next up →** [Browser DevTools Lab](#/lesson/05-web-basics/devtools-lab)
