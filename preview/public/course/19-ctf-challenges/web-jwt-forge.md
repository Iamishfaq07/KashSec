# Web — Forge the Token

**Category:** Web · **Difficulty:** Medium

## Scenario

`portal.kashsec-labs.test` uses JWTs for session authentication. You've registered a free `guest` account and captured the token it issues. The app's `/admin` panel returns `403 Forbidden` for your account — but you suspect the server-side validation might be sloppier than it should be.

## Provided data

Your captured token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciIsImV4cCI6MTk5OTk5OTk5OX0.x7Qm2v9ZpL4tR8nK6wF3hB1cJ0yE5uS
```

You also captured this note from the app's public changelog, left over from a debugging session:

```
v0.9.2-beta: temporarily support alg=none tokens for internal QA tooling.
TODO before launch: remove this before it ships to prod. (ticket #4471)
```

Ticket #4471 was apparently never closed.

## Your task

A JWT has three dot-separated parts: **header**.**payload**.**signature**. Decode the token, understand what it says about you, and — using the changelog hint — work out how to forge a token that gets you into `/admin`.

:::challenge Work through the forgery
<details><summary>Hint 1 — decoding the token</summary>Each of the first two segments is separately Base64URL-encoded JSON. Split the token on the dots and decode the first two segments (Base64URL is nearly identical to standard Base64, but uses <code>-</code>/<code>_</code> instead of <code>+</code>/<code>/</code> and typically drops the <code>=</code> padding).</details>
<details><summary>Hint 2 — what alg=none actually means</summary>JWT's <code>alg</code> field in the header tells the server which algorithm to use to verify the signature. The spec technically defines an <code>"alg":"none"</code> option meaning "this token is unsigned, don't verify anything" — intended only for narrow, controlled use cases. A server that still accepts <code>alg=none</code> tokens from untrusted users (exactly what the leaked changelog note suggests happened here) will accept <em>any</em> payload you write yourself, since there's no signature to check at all.</details>
<details><summary>Hint 3 — building the forged token</summary>Construct a new header JSON with <code>{"alg":"none","typ":"JWT"}</code>, and a new payload JSON identical to the original but with <code>"role":"admin"</code> instead of <code>"role":"user"</code>. Base64URL-encode both (no padding), join them with a dot, and — because there's no signature for an unsigned token — leave the third segment completely empty, ending the token with a trailing dot.</details>
<details><summary>Show full answer</summary>Decoding the original payload reveals: <code>{"user":"guest","role":"user","exp":1999999999}</code>. Combined with the changelog's admission that <code>alg=none</code> support was accidentally left enabled, the attack is to build an entirely new, self-signed-in-name-only token: header <code>{"alg":"none","typ":"JWT"}</code> and payload <code>{"user":"guest","role":"admin","exp":1999999999}</code>, both Base64URL-encoded, joined by dots, with an empty third segment. Because the server (per the changelog) still honors <code>alg=none</code>, it skips signature verification entirely and trusts the claims in your self-written payload — including your newly self-granted <code>admin</code> role.</details>
:::

## The forged token

```
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE5OTk5OTk5OTl9.
```

## The flag

```
KASHSEC{alg_none_1s_never_f1ne}
```

## Why this matters beyond the CTF

`alg=none` acceptance is a real, historically significant JWT vulnerability class — it's been found in production applications repeatedly enough that it's explicitly called out in most JWT security guidance. The deeper lesson generalizes far beyond this one bug: **never trust client-supplied metadata about how to verify the client's own data.** The fix, covered in Path 11's **Advanced JWT Lab**, is for the server to hardcode which algorithm(s) it accepts and reject anything else outright — never dynamically trust the `alg` field from the token itself to decide how to validate it.

## Bonus round — spotting the fix

The developers patch the `alg=none` bug. Here's their fix, posted in the same changelog:

```
v0.9.3: Fixed #4471. Server now checks: if (token.header.alg !== decodedExpectedAlg) reject.
decodedExpectedAlg is read from the token's own "kid" (key ID) header field,
which selects which key/algorithm to verify against from our key store.
```

:::challenge Did this actually fix the vulnerability?
<details><summary>Hint</summary>The fix checks the token's <code>alg</code> against an <em>expected</em> algorithm — but where does that expected algorithm actually come from? Is it something the server decided on its own, or something the attacker still gets to influence?</details>
<details><summary>Show answer</summary><strong>No — this is still broken</strong>, just in a subtler way. The server is now checking the <code>alg</code> field against an "expected" value, but that expected value is itself derived from the <code>kid</code> header — a field the <em>attacker still fully controls</em>, since it's part of the token they submit. This is the classic <strong>algorithm confusion</strong> attack mentioned below: if an attacker can point <code>kid</code> at a key the server will treat as an HMAC secret (or otherwise manipulate which key/algorithm gets selected), they can potentially forge a validly-signed token all over again, just through a different manipulation than <code>alg=none</code>. A genuinely correct fix never lets <em>any</em> token-supplied field — not <code>alg</code>, not <code>kid</code>, nothing — influence which algorithm or key the server uses to verify it; the expected algorithm and key must be hardcoded server-side, chosen entirely independently of anything in the incoming token.</details>
:::

:::danger This isn't the only JWT attack worth knowing
Beyond `alg=none`, watch for: algorithm confusion (tricking an RS256-verifying server into checking a signature with the public key as if it were an HMAC secret), weak/guessable HMAC secrets crackable by brute force, and tokens with no expiration ever enforced. Path 11's JWT lab covers all of these in depth — this challenge deliberately isolates just one to keep the puzzle focused.
:::

**Next up →** [Misc — Hidden in Plain Sight](#/lesson/19-ctf-challenges/misc-hidden-headers)
