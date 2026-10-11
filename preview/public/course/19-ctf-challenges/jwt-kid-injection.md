# Web — A Key of Your Choosing

**Category:** Web · **Difficulty:** Hard

## Scenario

`multi-tenant.kashsec-labs.test` rotates signing keys per deployment and uses the JWT header's `kid` (Key ID) field to tell the server which key to verify a given token against — a legitimate, widely used pattern for supporting multiple valid keys at once. You've captured a valid token and noticed something about how `kid` is being used.

## Provided data

Your token, decoded:

```json
// header
{"alg": "HS256", "typ": "JWT", "kid": "keys/2024-prod.pem"}
// payload
{"user": "guest", "role": "user"}
```

An internal engineering wiki page (leaked in an earlier recon step against this fictional target) describing the key-lookup service:

```
Key lookup service (internal): given a "kid" value, reads the corresponding
file from /etc/jwt-keys/{kid} and returns its raw bytes as the HMAC secret.
No allow-list of valid kid values currently implemented (tracked: JIRA-881).
```

A short list of predictable, world-readable files that commonly exist on this kind of server:

```
/etc/jwt-keys/../../../../dev/null
/etc/jwt-keys/../../../../etc/hostname
```

## Your task

The key-lookup service reads a file path built directly from the token's own `kid` header, with no validation. Work out how to make it read a file *you* already know the exact contents of — then forge a token signed with that known content as the HMAC secret.

:::challenge Chain the path traversal into a forgery
<details><summary>Hint 1</summary>This is a path traversal bug (the same category from Path 11 and this section's own Linux/privesc challenge), just reached through a JWT header field instead of a URL or file-upload parameter. <code>../</code> sequences let you climb out of the intended <code>/etc/jwt-keys/</code> directory.</details>
<details><summary>Hint 2</summary>You don't need to read anything secret — you need to read a file whose <em>exact contents</em> you can predict with total confidence, so you can compute a matching HMAC-SHA256 signature yourself. <code>/dev/null</code> is a classic choice: it's always empty, on essentially every Unix-like system, guaranteed.</details>
<details><summary>Show full answer</summary>Setting the header's <code>kid</code> to <code>../../../../dev/null</code> makes the vulnerable key-lookup service resolve and read <code>/etc/jwt-keys/../../../../dev/null</code> — which path-traversal-collapses down to just <code>/dev/null</code>, a file guaranteed to be empty on virtually any Unix-like system. The server then uses those zero bytes (an empty string) as the HMAC-SHA256 secret to verify your token. Since you know the "secret" is empty, you can forge a completely new token: header <code>{"alg":"HS256","typ":"JWT","kid":"../../../../dev/null"}</code>, payload <code>{"user":"guest","role":"admin"}</code>, signed with HMAC-SHA256 using an empty-string secret — something anyone can compute locally with no guessing involved. The server verifies it as fully legitimate. Submitting it returns: <code>{"user":"guest","role":"admin","flag":"KASHSEC{k1d_tr4v3rs4l_1s_st1ll_tr4v3rs4l}"}</code>.</details>
:::

## The flag

```
KASHSEC{k1d_tr4v3rs4l_1s_st1ll_tr4v3rs4l}
```

## Why this matters beyond the CTF

`kid` injection is a real, documented JWT attack class, and it's a genuinely elegant example of how a legitimate, sensible-sounding feature (supporting multiple signing keys via a lookup field) becomes a vulnerability the instant the field feeding that lookup isn't validated. It combines two bug classes covered separately elsewhere in this course — path traversal (Path 11, and this section's Linux privesc-style challenges) and JWT trust confusion (this section's earlier two JWT challenges) — into a single chained exploit, which is exactly the kind of multi-step thinking real bug bounty hunting and CTF "hard" challenges both reward. Path 21's JWT-attacks lesson names this pattern explicitly, alongside `alg=none` and algorithm confusion, as the third member of the classic JWT attack trio.

## Bonus round — a variant using SQL instead of a filesystem

Some real-world `kid`-lookup implementations query a database instead of reading a file — for example, `SELECT key FROM signing_keys WHERE id = '{kid}'`, built via raw string concatenation.

:::challenge What would you try against a SQL-backed kid lookup instead?
<details><summary>Hint</summary>This should look extremely familiar from Path 11's SQL injection material — the vulnerable pattern is identical, just fed by a JWT header instead of a login form field.</details>
<details><summary>Show answer</summary>Against a SQL-backed lookup, a <code>kid</code> value like <code>' UNION SELECT 'known-value' -- </code> could manipulate the query to return an attacker-chosen, fully known string as the "key" instead of a real, secret one — after which the exact same forgery technique from the main challenge applies: sign a new token using that known value as the HMAC secret. This is the same root cause as the filesystem version (an unvalidated, client-controlled field driving a sensitive lookup) expressed through a completely different vulnerability class (SQL injection instead of path traversal) — proof that the underlying "don't let client input control a trust decision" lesson is the transferable skill, not memorizing any single specific payload.</details>
:::

:::tip A field named for convenience, not security
<code>kid</code> exists to make legitimate key rotation easier for server operators — it was never designed as a security boundary. Any time a convenience feature ends up making a security-relevant decision (which key to trust) based on unvalidated client input, that convenience feature has quietly become an attack surface, whether or not its original designers thought of it that way.
:::

**Next up →** [Web — Name Your Own Price](#/lesson/19-ctf-challenges/logic-price-tamper)
