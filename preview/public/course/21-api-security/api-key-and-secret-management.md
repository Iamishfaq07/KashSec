# API Key & Secret Management

The broken-auth-jwt lesson covered token-based authentication in depth. This lesson covers a simpler, older, and genuinely still extremely common authentication mechanism — the **API key** — and the surprisingly frequent ways it goes wrong in practice, directly connecting to Path 22's secrets-supply-chain lesson's coverage of the exact same underlying problem from the DevSecOps side.

## API keys — simpler than OAuth2, with real tradeoffs

An **API key** is a static, long-lived secret string a client includes with every request, typically as a header or query parameter — genuinely simpler to implement than the full OAuth2 flow the previous lesson covered, which is exactly why it remains extremely common for server-to-server API integrations, developer tools, and simpler use cases that don't need OAuth2's delegated-consent model at all.

## The tradeoff: simplicity versus revocability and scope

The core security tradeoff, worth understanding explicitly: an API key is typically **static and long-lived** by design, unlike an OAuth2 access token which is usually short-lived and tied to a specific, narrow scope. This means an API key that leaks remains valid and exploitable until someone specifically notices and revokes it — potentially a very long window — whereas a leaked OAuth2 access token naturally expires on its own within a much shorter timeframe even if nobody notices the leak at all.

## Where API keys actually leak, in practice

Directly connecting to Path 04's secure-coding lesson's hardcoded-secrets warning: the single most common real-world API key exposure is a key committed directly into source code, then pushed to a public (or later-made-public) GitHub repository — automated scanning tools (both defensive ones like GitHub's own secret scanning, and offensive ones attackers run continuously) specifically search public repositories for recognizable API key patterns, meaning a leaked key can be discovered and abused within minutes of being pushed, not just eventually.

- **Committed directly in source code** — the most common pattern, especially in example code, configuration files, or `.env` files accidentally committed
- **Exposed in client-side JavaScript** — an API key meant for server-side use, but accidentally bundled into a web app's client-side code, is visible to literally anyone who views the page source
- **Logged in plaintext** — application logs that record full request headers (including an `Authorization` header carrying an API key) create a persistent, often under-protected copy of the secret
- **Shared insecurely** — a key pasted into a Slack message, an email, or a shared document, outside any dedicated secrets-management system

## Key rotation — the discipline most organizations skip

A genuinely important, frequently-neglected practice: **key rotation** means periodically issuing a new key and retiring the old one on a defined schedule, regardless of whether a leak is known to have occurred — the practical value is limiting the *maximum possible exposure window* even for leaks that were never detected at all. Many organizations issue an API key once, at initial integration setup, and never rotate it again for years, meaning any leak from any point in that entire history remains silently exploitable indefinitely.

## Scoping and rate-limiting API keys individually

Directly connecting to the rate-limiting-injection lesson: treating every API key with the exact same broad permissions and the exact same rate limits misses a genuinely valuable defensive opportunity — issuing keys scoped to only the specific operations a given integration actually needs, and rate-limiting each key individually (rather than only at a global level), means a single leaked key causes contained, bounded damage rather than unlimited access across the entire API surface.

## Dedicated secrets management, briefly

The practical fix for most of this lesson's failure patterns: using a dedicated **secrets manager** (HashiCorp Vault, AWS Secrets Manager, and similar tools, covered in depth in Path 22) rather than environment variables or configuration files checked into source control — a secrets manager provides audit logging (who accessed which secret, when), centralized rotation, and access control independent of the application's own codebase.

:::challenge Test yourself
Why does a leaked, unrotated API key represent a fundamentally different (and often worse) risk profile than a leaked, short-lived OAuth2 access token, even if both are discovered by an attacker at the exact same moment?
:::

## Key terms

- **API key** — a static, long-lived secret string used for simpler authentication than a full OAuth2 flow.
- **Key rotation** — periodically issuing new keys and retiring old ones to bound the maximum possible exposure window.
- **Secrets manager** — dedicated infrastructure for storing, rotating, and auditing access to credentials, independent of application code.

## Recap

API keys trade OAuth2's revocability and narrow scoping for implementation simplicity, meaning a leaked key often remains exploitable far longer than a leaked OAuth2 token. Keys most commonly leak through committed source code, exposed client-side JavaScript, plaintext logging, and insecure sharing. Regular rotation and per-key scoping/rate-limiting bound the damage of leaks that go undetected, and dedicated secrets management tools address most of this lesson's failure patterns structurally rather than relying on developer discipline alone.

???refs
- [OWASP — Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) — official documentation on automated leak detection.
???
