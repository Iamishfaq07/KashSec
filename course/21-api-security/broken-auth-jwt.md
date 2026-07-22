# Broken Authentication & JWT Attacks

Authentication in APIs usually means tokens — most commonly JWTs. When token handling is weak, an attacker can become any user.

## Common authentication failures

- No rate limiting on login or password-reset endpoints
- Predictable or long-lived reset tokens
- Tokens that never expire
- Tokens accepted after logout (no denylist / short lifetime)
- Accepting tokens over HTTP
- Weak or default signing secrets

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

The signature proves the token was issued by someone who knows the secret (or private key).

## High-impact JWT attacks

### 1. `alg: none`

Some libraries accept a token whose header says `"alg":"none"` and skip signature verification.  
Attacker forges:

```json
{"alg":"none","typ":"JWT"}
.{"sub":"1","role":"admin"}
.
```

### 2. Algorithm confusion (RS256 → HS256)

If the server uses asymmetric keys (RS256) but the library is tricked into verifying with the *public key* as an HMAC secret, the attacker can sign tokens with the public key.

### 3. Weak HMAC secret

HS256 with a short or common secret can be cracked offline (hashcat, jwt-cracker).

### 4. Kid injection / path traversal

If the `kid` (key ID) header is used to load a key from the filesystem without sanitisation, an attacker can point it at a known file or inject SQL/command content.

### 5. Claim tampering when signature is not verified

Classic: change `"role":"user"` → `"role":"admin"` when the server forgets to verify the signature.

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

- Always verify the signature with a strict allow-list of algorithms.
- Use strong, rotated secrets or proper asymmetric keys.
- Keep lifetimes short; use refresh tokens carefully.
- Never put secrets or passwords in the payload.
- Invalidate tokens on logout / password change when possible.

## Key terms

- **JWT** — JSON Web Token
- **alg:none** — the signature-bypass algorithm
- **Algorithm confusion** — tricking RS256 verification into using HS256

## Recap

Most JWT attacks succeed because verification is missing, incomplete, or too permissive. Treat every token as untrusted until the signature and claims are fully validated.

???refs
- [PortSwigger JWT attacks](https://portswigger.net/web-security/jwt)
- [jwt.io](https://jwt.io)
???