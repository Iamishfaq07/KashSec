# Mobile & API Bug Bounty

Every lesson so far in this path has implicitly focused on traditional web applications. This lesson covers the two fastest-growing bug bounty categories beyond that — directly connecting to Path 21's dedicated API Security path, applied here specifically through a bounty-hunting lens.

## Why mobile and API scope is genuinely less competitive

A consistent, practical observation among experienced bounty hunters: mobile app and API endpoints receive dramatically less tester attention than a program's main web application, simply because fewer researchers have built the specific skills this lesson covers — directly connecting to the choose-programs lesson's "less-loved scope" strategy, here applied as a whole testing category rather than just a program selection heuristic.

## API bug bounty essentials

Directly connecting to Path 21's OWASP API Security Top 10 coverage, the highest-value bugs to hunt for specifically in API scope:

- **BOLA (Broken Object Level Authorization)** — the API-specific name for the exact IDOR pattern the hunting-idor lesson taught, now applied to API endpoints rather than web UI parameters
- **Excessive data exposure** — an API endpoint returning far more fields in its response than the calling application's UI actually displays, often leaking internal fields (`is_admin`, `internal_notes`) a developer never intended to expose
- **Mass assignment** — an API accepting and processing more fields in a request body than the developer intended to allow client-controlled, sometimes letting an attacker set a `role` or `isAdmin` field the UI never exposes an option for
- **Broken function-level authorization** — an admin-only API endpoint reachable by a regular authenticated user simply because the server never actually re-checks role on that specific endpoint, even though the UI correctly hides the button

## Finding hidden API endpoints

Directly connecting to the recon-pipeline lesson's `gau`/historical-URL discovery and the Burp lesson's Param Miner extension: mobile apps and single-page web applications both frequently call API endpoints never linked from any visible UI element, discoverable by intercepting the mobile app's own traffic through a proxy (Burp, configured as the phone's network proxy) or by examining a web app's JavaScript bundle for endpoint URLs referenced but never actually rendered as clickable links.

## Mobile-specific testing basics

- **Static analysis of the APK/IPA** — decompiling a mobile app (directly connecting to Path 17's reverse-engineering coverage) frequently reveals hardcoded API keys, internal endpoint URLs, or debug functionality left enabled in production builds
- **Certificate pinning bypass** — many mobile apps implement certificate pinning specifically to prevent proxy interception; bypassing it (via tools like Frida, referenced below) is often a prerequisite before any traffic-based testing can begin at all
- **Insecure local storage** — mobile apps frequently store authentication tokens or sensitive data in local, poorly-protected storage, testable through basic device or emulator filesystem access

## Why this pairs naturally with automation

Directly connecting to the previous lesson's nuclei coverage: nuclei has dedicated templates specifically for common API misconfigurations (exposed Swagger/OpenAPI documentation, GraphQL introspection left enabled in production, common admin API paths) — meaning the same automation-first discovery approach from that lesson applies directly here, just pointed at API-shaped targets instead of traditional web pages.

:::challenge Test yourself
Why does an API endpoint's response sometimes reveal more than the corresponding web UI ever displays, and why does that matter for bug hunting?
<details><summary>Show answer</summary>A typical web application architecture has the frontend UI request data from a backend API, then selectively render only some of the returned fields — a developer building the UI might request a "get user profile" endpoint and only display the name and avatar, while the actual API response quietly includes every field in that user's database record, including ones like <code>is_admin</code>, internal notes, or other users' partial data that were never intended for the calling application to expose to an end user. This matters enormously for bug hunting because the UI's selective rendering creates a false sense that only the displayed fields exist — a tester who only interacts with the rendered page misses this entirely, while a tester who intercepts the raw API response directly (via Burp, exactly as the burp-suite-for-bb lesson taught) sees the full, unfiltered data the backend actually returned, frequently surfacing an excessive-data-exposure finding the UI itself gives no visible hint of.</details>
:::

## Key terms

- **BOLA** — Broken Object Level Authorization, the API-specific name for IDOR.
- **Mass assignment** — an API accepting more client-controlled fields than intended, sometimes including privileged ones.
- **Certificate pinning** — a mobile security control that blocks proxy-based traffic interception unless bypassed first.

## Recap

- Mobile and API scope receive dramatically less tester attention than traditional web UIs, making them a genuinely less competitive specialization.
- BOLA, excessive data exposure, mass assignment, and broken function-level authorization are the highest-value API bug categories.
- Mobile testing requires additional prerequisite skills — APK decompilation and certificate pinning bypass — before traffic-based testing can even begin.
- Nuclei's API-focused templates extend the previous lesson's automation approach directly into this scope.

**Next up →** [Building a bug bounty career](#/lesson/15-bug-bounty/bb-career)
