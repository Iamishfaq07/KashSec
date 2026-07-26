# Mobile API Security

The intercepting-mobile-traffic lesson showed you how to see what a mobile app actually sends. This lesson covers what to actually look for once you can — nearly every mobile app is, underneath its interface, a client talking to a backend API, making Path 11 and Path 21's API security material directly, immediately applicable here.

## The mobile app is just another API client

Every vulnerability class from Path 11's web-security path — IDOR, broken authentication, mass assignment (from Path 21) — applies exactly as fully to a mobile app's backend API as to a traditional web application's, since a mobile app is, from the server's perspective, simply another client making HTTP requests. The mobile-specific challenge is entirely about *reaching* that traffic in the first place — exactly what the certificate-pinning-bypass techniques from the previous lesson exist to solve.

## Why mobile apps are a genuinely good target for API testing

A subtle but important point: mobile app backends sometimes receive *less* security scrutiny than a company's main web application, on the mistaken assumption that "the mobile app enforces the rules" — but exactly like Path 05's web-forms lesson taught for client-side validation, any check performed only in the mobile app's own code is trivially bypassable by an attacker who simply talks to the backend API directly, using the exact interception setup from the previous lesson, without the mobile app's client-side logic involved at all.

## API keys and secrets embedded in mobile apps

Directly connecting to the reverse-engineering lesson's warning about hardcoded secrets: a genuinely common mobile-specific finding is an API key or secret embedded directly in the app's code, extractable by anyone through simple decompilation — sometimes a key intended to be secret, sometimes a key that was never meant to be secret in the first place but is being relied upon as if it were an actual access-control mechanism, a mistake this lesson treats as a distinct, common finding worth naming specifically.

## Mobile-specific authentication patterns

- **Refresh tokens stored insecurely** — an authentication token designed to keep a user logged in long-term, if stored in SharedPreferences rather than the Keystore (from the previous lesson), becomes an extractable, long-lived credential
- **Device binding weaknesses** — some apps attempt to tie an authentication session to a specific device, but implement this check client-side only, making it trivially bypassable exactly like any other client-side-only control
- **Certificate pinning as the only defense** — an app relying purely on certificate pinning to protect its API traffic, with no additional server-side authorization checks, is vulnerable the moment pinning is bypassed (the previous lesson's Frida technique) — defense in depth (Path 10) matters here exactly as much as anywhere else in this course

## A practical mobile API testing workflow

1. Set up traffic interception (the previous lesson's Burp Suite / Frida setup)
2. Use the app normally, capturing every API call it makes
3. Replay and modify captured requests directly (bypassing the app's own client-side logic entirely) to test for IDOR, broken authorization, and injection — exactly the Path 11 techniques, applied to traffic captured from a mobile app instead of a browser

:::challenge Test yourself
Why does relying purely on certificate pinning to protect a mobile app's API traffic represent a single point of failure, rather than genuine defense in depth?
<details><summary>Show answer</summary>Certificate pinning protects the <em>transport</em> — preventing a network-level interception (the MITM setups from Path 12) from reading or modifying traffic between the app and its backend. But once pinning is bypassed at the application layer (using Frida to hook and disable the pinning check, exactly the previous lesson's technique), an attacker gains full, direct visibility into every API call the app makes, with nothing else standing in the way if the backend itself doesn't independently verify authorization on each request. If pinning is the <em>only</em> protection — with no server-side authorization checks assuming a request might come from anywhere, no rate limiting, no additional validation — then bypassing that single control grants an attacker essentially unrestricted access to probe the API exactly as this lesson's testing workflow describes. Genuine defense in depth means the backend API is built to be secure even assuming an attacker can see and manipulate every request, not solely relying on the transport-level protection remaining intact.</details>
:::

## Key terms

- **Refresh token** — a long-lived credential keeping a user authenticated, requiring the same secure storage discipline as any other sensitive credential.
- **Device binding** — an attempt to tie an authentication session to a specific device, often implemented (insecurely) only on the client side.

## Recap

- A mobile app's backend API is subject to exactly the same vulnerability classes covered in Path 11 and Path 21 — the mobile-specific challenge is reaching that traffic, not a fundamentally different set of vulnerabilities once you can.
- Hardcoded API keys, insecurely-stored refresh tokens, and client-side-only device binding are common mobile-specific findings within this broader API-security frame.
- Certificate pinning alone is never sufficient defense in depth — a backend API needs to remain secure assuming an attacker can eventually see and manipulate its traffic.

**Next up →** [iOS App Security Basics](#/lesson/13-mobile-security/ios-security-basics)
