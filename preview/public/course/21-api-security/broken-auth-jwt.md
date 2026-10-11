# Broken Authentication & JWT Attacks

Authentication in APIs usually means tokens — most commonly JWTs. When token handling is weak, an attacker can become any user, including an admin, without ever guessing a password.

:::tip
JWTs are signed, not encrypted. Anyone can Base64-decode the payload and read it — the signature only stops *tampering*, not *reading*. Never put a password, secret, or anything sensitive inside a JWT payload, even a token you fully control.
:::

## Common authentication failures

- No rate limiting on login or password-reset endpoints
- Predictable or long-lived reset tokens
- Tokens that never expire
- Tokens accepted after logout (no denylist / short lifetime)
- Accepting tokens over HTTP
- Weak or default signing secrets

| Failure | Real-world consequence |
|---|---|
| No rate limit on login | Credential stuffing / password spraying at scale |
| Long-lived reset token | A leaked or intercepted reset link stays exploitable for days |
| No token expiry | A stolen token is valid forever, not just until the next login |
| No logout invalidation | "Logging out" is cosmetic — the token still works if replayed |

## JWT crash course

A JWT has three Base64url parts:

```
header.payload.signature
```

Example header:
```json
{"alg":"HS256","typ":"JWT"}
```

Example payload:
```json
{"sub":"42","role":"user","exp":1735689600}
```

The signature proves the token was issued by someone who knows the secret (or private key). Critically: the *client* can decode and read the header and payload trivially — they're just Base64, not encryption. The only thing protecting the payload from tampering is the signature check the server is supposed to perform on every request.

## High-impact JWT attacks

### 1. `alg: none`

Some libraries accept a token whose header says `"alg":"none"` and skip signature verification.
Attacker forges:

```json
{"alg":"none","typ":"JWT"}
.{"sub":"1","role":"admin"}
.
```

This works because some JWT libraries, by default or through misconfiguration, treat `none` as a legitimate algorithm rather than rejecting it outright.

### 2. Algorithm confusion (RS256 → HS256)

If the server uses asymmetric keys (RS256) but the library is tricked into verifying with the *public key* as an HMAC secret, the attacker can sign tokens with the public key. This works because RS256's public key is, by design, public — anyone can fetch it from the API's own JWKS endpoint. If a server's code says "verify this token" without pinning the *algorithm* it expects, and the attacker sends a token claiming `alg:HS256` signed using the public RSA key as if it were an HMAC secret, some libraries will happily verify it as valid.

### 3. Weak HMAC secret

HS256 with a short or common secret can be cracked offline (hashcat, jwt-cracker). A secret like `"secret123"` can be brute-forced in seconds; once an attacker has the secret, they can sign arbitrary tokens with any claims they want, including `"role":"admin"`.

### 4. Kid injection / path traversal

If the `kid` (key ID) header is used to load a key from the filesystem without sanitisation, an attacker can point it at a known file or inject SQL/command content. Example: `"kid": "../../../../dev/null"` might make the server "verify" a signature against an empty key, which some implementations then treat as a valid empty-string signature match.

### 5. Claim tampering when signature is not verified

Classic: change `"role":"user"` → `"role":"admin"` when the server forgets to verify the signature at all — it decodes the token, reads the claims, and trusts them without ever calling the verification function. This is the simplest and most common of all the attacks here, because it requires no cryptographic trickery whatsoever, just a server that skipped a step.

## A worked example, end to end

An API's login endpoint issues:

```json
{"sub":"42","role":"user","exp":1798761600}
```

signed with HS256 and the secret `"changeme"`. An attacker who obtains any valid token (their own account is enough) can:

1. Decode the token to see the exact claim structure
2. Run it through a cracking tool against a common-password wordlist — `"changeme"` is exactly the kind of secret that gets cracked in under a minute
3. Once the secret is recovered, forge a new token: `{"sub":"1","role":"admin","exp":9999999999}`
4. Sign it with the recovered secret and use it to call any endpoint that trusts the JWT's `role` claim

No password was guessed. No vulnerability in the application logic was needed. The entire authentication scheme collapsed because of one weak secret.

## Practical checklist

When you meet a JWT:

1. Decode it (jwt.io or the built-in tool in KashSec Tools).
2. Check `alg`. If it is `none` or unexpected, test.
3. Check `exp` / `nbf` / `iat` — are they enforced?
4. Try the classic `alg:none` attack.
5. If HS256, test for weak secrets.
6. If RS256, test algorithm confusion.
7. Look for sensitive data in the payload (it is only Base64, not encrypted).

:::lab
Use the JWT tool in KashSec (`#/tools/jwt`) to decode tokens you capture in labs. Then try the PortSwigger JWT labs.
:::

## Defenses

- Always verify the signature with a strict allow-list of algorithms — reject anything not on that list, including `none`, explicitly.
- Use strong, rotated secrets or proper asymmetric keys — a randomly generated 256-bit secret, not a memorable phrase.
- Keep lifetimes short; use refresh tokens carefully.
- Never put secrets or passwords in the payload.
- Invalidate tokens on logout / password change when possible — a short-lived access token plus a server-side check on the refresh token is the common practical answer to "how do I revoke a JWT."

:::danger
"We use JWTs so we don't need session state" is a common but dangerous oversimplification. True stateless JWTs cannot be revoked before they expire — which is exactly why most production systems keep the access-token lifetime very short (minutes) and put revocation logic on the longer-lived refresh token instead.
:::

## 🧪 Hands-on lab — attack a JWT

1. Use the KashSec JWT tool (`#/tools/jwt`) or jwt.io to decode a sample JWT and identify its algorithm and claims.
2. Try constructing an `alg:none` version of the token by hand: same header (with `alg` changed to `none`) and payload, base64url-encoded, with an empty signature section.
3. If you have access to a lab environment with a known weak secret, use a tool like `hashcat` or `jwt_tool` to attempt to crack it, then forge a token with elevated claims.
4. Complete at least two of the PortSwigger JWT attack labs linked below, which walk through algorithm confusion and `kid` injection in a safe, legal environment.

:::challenge Test yourself
1. Why is "the payload is Base64-encoded" not a security control, and what should never go inside a JWT payload as a result?
2. Explain algorithm confusion (RS256 → HS256) in your own words — why does the public key being public matter here?
3. A team says "we don't need to check token expiry server-side, the client won't send an expired token." What's wrong with trusting that?
:::

## Key terms

- **JWT** — JSON Web Token
- **alg:none** — the signature-bypass algorithm
- **Algorithm confusion** — tricking RS256 verification into using HS256
- **JWKS** — JSON Web Key Set, the endpoint that publishes an API's public signing keys
- **Refresh token** — a longer-lived token used to obtain new short-lived access tokens, often the only practical place to implement revocation

## Recap

Most JWT attacks succeed because verification is missing, incomplete, or too permissive — not because of exotic cryptography breaks. Treat every token as untrusted until the signature and claims are fully validated, pin the expected algorithm explicitly, and never assume a client-supplied claim like `role` can be trusted without that verification happening first.

???refs
- [PortSwigger JWT attacks](https://portswigger.net/web-security/jwt)
- [jwt.io](https://jwt.io)
- [JWT security best practices (Auth0)](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/) — practical guidance for implementers
???
