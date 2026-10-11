# Web — The Wrong Kind of Trust

**Category:** Web · **Difficulty:** Hard

## Scenario

`secure-api.kashsec-labs.test` uses RS256 — asymmetric signing, meant to be the "safe" choice compared to the weak-secret and `alg=none` bugs from this section's earlier challenges. RS256 tokens are signed with a private key only the server holds, and verified with a matching *public* key that anyone can freely download — that's the whole point of asymmetric crypto, and normally it's genuinely solid.

## Provided data

Your valid `guest` token:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9.redacted_rsa_signature
```

The server's public key, published (as intended) at a standard, documented endpoint:

```
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKj34GkxFhD91assKM+PdMDBpG3+
[... key content abbreviated for this exercise ...]
-----END PUBLIC KEY-----
```

A note from the API's changelog:

```
v2.1: Auth service now accepts both RS256 and HS256 tokens for backward
compatibility with the legacy mobile client. Verification library:
jwt.verify(token, key) — key is looked up automatically based on the
token's own declared alg.
```

## Your task

The changelog reveals the actual vulnerability, if you read it precisely. Work out how to turn "the server trusts both algorithms" into a forged admin token.

:::challenge Spot the algorithm confusion
<details><summary>Hint 1</summary>Re-read the changelog's last line very carefully: the verification key is chosen "based on the token's own declared <code>alg</code>." That means the attacker — not the server — effectively picks which key gets used for verification, just by setting the header field.</details>
<details><summary>Hint 2</summary>RS256 uses the private key to sign and the <em>public</em> key to verify. HS256 uses one shared secret for both signing and verifying. If a poorly-written verification function is told "verify this as HS256" and blindly uses whatever key it was configured with — the server's own public RSA key — as if it were a plain HMAC secret string, what could you do with a key that is, by definition, publicly available to anyone?</details>
<details><summary>Show full answer</summary>This is <strong>algorithm confusion</strong>: change the token's header from <code>{"alg":"RS256"}</code> to <code>{"alg":"HS256"}</code>, then compute an HMAC-SHA256 signature using the server's own <em>public</em> RSA key — the exact text from the "Provided data" section above — as the HMAC secret string. If the server's verification code does something like <code>jwt.verify(token, publicKey)</code> without explicitly restricting which algorithm is acceptable, it now reads the forged token's <code>alg:HS256</code> header, treats the same public key it was handed as an HMAC secret, and successfully "verifies" a signature that you — not the server's private key holder — actually produced. Because the public key is, deliberately and correctly, available to absolutely anyone, this collapses the entire asymmetric trust model. Submitting a forged token with payload <code>{"user":"guest","role":"admin"}</code>, signed this way, returns: <code>{"user":"guest","role":"admin","flag":"KASHSEC{c0nfus3_th3_4lg0r1thm_st34l_th3_k3ys}"}</code>.</details>
:::

## The flag

```
KASHSEC{c0nfus3_th3_4lg0r1thm_st34l_th3_k3ys}
```

## Why this matters beyond the CTF

Algorithm confusion is arguably the most conceptually elegant JWT attack in this entire section, because the vulnerability isn't a weak secret or a forgotten debug flag — it's a fundamental misunderstanding, baked into the verification code, about what "the key" is supposed to mean for each algorithm. It has affected real, production JWT libraries historically, precisely because "just call `verify(token, key)`" looks completely reasonable at a glance. Path 21's JWT-attacks lesson covers this as the most advanced of the three classic attacks (alongside `alg=none` and weak secrets) — the fix is for the server to hardcode the *specific* algorithm it expects for a given key, and reject any token that declares a different one, rather than dynamically trusting whatever the token itself claims.

## Bonus round — why doesn't this work against a well-written server?

:::challenge What would a correctly implemented verification function do differently?
<details><summary>Hint</summary>The vulnerability hinges entirely on the server dynamically choosing behavior based on the token's own <code>alg</code> field. What if the server simply never looked at that field to make a decision at all?</details>
<details><summary>Show answer</summary>A correctly implemented server hardcodes the expected algorithm on the verification call itself — for example, <code>jwt.verify(token, publicKey, {algorithms: ["RS256"]})</code> — and immediately rejects any token whose header claims a different algorithm, before ever attempting to verify a signature at all. In that world, a forged <code>alg:HS256</code> token is rejected outright, regardless of what key material an attacker tries to sign it with, because the server never lets the token itself influence which verification path runs. The lesson generalizes well past JWTs: whenever a system's security-critical behavior branches based on client-supplied metadata about how to interpret client-supplied data, that's a structural red flag worth specifically hunting for.</details>
:::

:::danger A pattern worth memorizing
"The client's data tells the server how to verify the client's data" is one of the most reliable smells in all of application security — it shows up in JWT algorithm confusion, in XML parsers trusting embedded DTDs (XXE), in deserialization attacks trusting a type field in the serialized payload, and elsewhere. Whenever you see this shape, assume it's exploitable until proven otherwise.
:::

**Next up →** [Web — A Key of Your Choosing](#/lesson/19-ctf-challenges/jwt-kid-injection)
