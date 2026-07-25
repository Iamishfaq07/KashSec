# Common Crypto Mistakes

This path has repeatedly emphasized "never roll your own crypto" — but that principle only becomes actionable once you can actually recognize what a crypto mistake looks like in the wild. This lesson catalogs the recurring failure patterns referenced piecemeal throughout this course, gathered in one place.

## Mistake 1: Confusing encoding with encryption

Path 06's very first lesson in this path drew this line sharply, and this course's CTF Zone crypto challenges demonstrated it directly: Base64, hex, and URL-encoding provide **zero confidentiality**. Storing or transmitting sensitive data "encoded" and calling it secure is a genuinely common real-world mistake — Path 13's mobile insecure storage lesson flagged exactly this pattern when hunting through app data.

## Mistake 2: Hardcoded keys and secrets

An encryption scheme is only as secure as its key management — and a key hardcoded directly into application source code (Path 13's APK analysis lesson, Path 17's static analysis lesson both cover finding exactly this via decompilation) means anyone who can read the compiled binary can extract the key and decrypt everything it protects, regardless of how strong the underlying algorithm is.

```mermaid
flowchart LR
    A["Strong algorithm\n(AES-256)"] --> B{Key management}
    B -->|Hardcoded in app/source| C["Effectively worthless —\nanyone can extract it"]
    B -->|Properly secured\n(Keystore/Keychain, HSM,\nsecrets manager)| D[Actually secure]
```

## Mistake 3: Weak or outdated algorithms

Using MD5 or SHA-1 for anything security-relevant (Path 06's hashing lesson covered why both are now considered broken), or a genuinely custom, unreviewed cipher — this course's CTF Zone's XOR challenge exists specifically to build intuition for exactly why homegrown symmetric ciphers fail so easily against basic cryptanalysis. Always prefer well-established, widely-reviewed algorithms (AES, RSA, SHA-256, bcrypt) over anything invented in-house or chosen simply because it's unfamiliar to attackers ("security through obscurity," a principle that fails reliably once an algorithm's details become known — and they usually do).

## Mistake 4: Reusing values that must be unique

Many encryption schemes require a value (often called a **nonce** or **IV — initialization vector**) that must be unique *every single time* data is encrypted with a given key, even though it doesn't need to be secret. Reusing this value — a genuinely common implementation bug — can catastrophically weaken or completely break the encryption's security guarantees, depending on the specific mode of operation involved (Path 06's symmetric encryption lesson covered ECB mode's related but distinct pattern-leakage problem).

## Mistake 5: Insufficient randomness

Cryptographic keys, nonces, and salts (Path 06's hashing lesson) all depend on genuine unpredictability. Using a weak, predictable random number generator — or worse, a fixed/hardcoded "random" seed — for anything cryptographic means an attacker who can predict or guess that supposedly-random value can potentially reconstruct keys or bypass protections entirely. Always use your platform's dedicated cryptographically-secure random number generator (never a general-purpose one meant for things like game logic or shuffling a playlist) for anything security-relevant.

## Mistake 6: No integrity protection alongside encryption

Encryption alone protects **confidentiality** (no one can read the data) but not necessarily **integrity** (no one can tamper with it undetected) — these are genuinely separate properties. Modern authenticated encryption modes like **AES-GCM** provide both simultaneously; using an older mode that only provides confidentiality, without a separate integrity check, can let an attacker modify ciphertext in ways that produce predictable, exploitable changes to the decrypted plaintext, even without ever learning the encryption key itself.

## Mistake 7: Trusting client-supplied crypto metadata

This is exactly the root cause behind Path 11's `alg: none` JWT vulnerability, revisited here in its general form: never let untrusted input dictate *how* to verify or decrypt that same input. A server that reads an `algorithm` field from a client-supplied token and dynamically decides which verification method to use, based on what the client itself claims, hands an attacker direct control over their own verification process — the fix, as established in Path 11, is always hardcoding the expected algorithm/scheme server-side and rejecting anything else outright.

## Mistake 8: Trusting a library's insecure defaults without checking

A subtler variant worth calling out on its own: many cryptography libraries, especially older ones, ship with historically weak options as their **default** setting purely for backward compatibility — a library's default cipher mode might still be ECB (Path 06.2's classic mistake), its default key derivation might use far too few iterations for modern hardware, or its default random number source might not actually be cryptographically secure on every platform it runs on. Developers who call an encryption library's most obvious, simplest function — assuming "it's a security library, so it must be secure by default" — can end up with exactly the mistakes catalogued above, not because they made an active bad choice, but because they never overrode a bad default they didn't know existed. This is precisely why reading a cryptography library's documentation specifically for its default parameters, rather than assuming sane-by-default behavior, is a genuinely important habit — and why modern, well-designed libraries (like libsodium/NaCl, which deliberately expose almost no configurable parameters at all) increasingly try to make the *only* easily-reachable option the secure one, removing the "insecure default" failure mode by design rather than relying on developers to read documentation carefully every time.

:::tip The meta-lesson across all eight mistakes
Every single mistake in this lesson has the same underlying shape: **implementation and key management failures, not flaws in the underlying cryptographic algorithms themselves.** AES, RSA, and SHA-256 are all, when used correctly, genuinely unbroken — the enormous majority of real-world "crypto failures" you'll encounter in security work come from exactly the eight categories above, not from anyone actually breaking the math.
:::

:::challenge Audit for these patterns
Revisit Path 13's mobile APK analysis lesson and Path 17's static analysis lesson — both taught you to grep decompiled code for strings and suspicious patterns. Using that same skill, list which of this lesson's 8 mistakes each technique would most directly help you find in a real app or binary, and why.
:::

## Key terms

- **Nonce / IV (initialization vector)** — a value required to be unique per encryption operation, though not necessarily secret.
- **Authenticated encryption** — an encryption mode (like AES-GCM) providing both confidentiality and integrity protection together.
- **Security through obscurity** — relying on an algorithm or method's secrecy rather than genuine cryptographic strength, an approach that fails once details become known.

## Recap

- Nearly every real-world "crypto broke" story traces back to implementation and key management mistakes, not flaws in the underlying algorithms.
- The eight recurring patterns — encoding confused with encryption, hardcoded keys, weak algorithms, reused nonces, weak randomness, missing integrity protection, trusting client-supplied crypto metadata, and blindly trusting insecure library defaults — cover the overwhelming majority of real-world crypto vulnerabilities.
- This lesson ties together crypto-adjacent findings from across this entire course (Path 11's JWT lesson, Path 13's mobile storage lesson, Path 17's static analysis lesson) as instances of these same seven patterns.

???refs
- [OWASP Cryptographic Failures (Top 10 category)](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/) — the official category covering this exact territory in real web applications.
- [Cryptographic Right Answers](https://gist.github.com/tqbf/be58d2d39690c3b366ad) — a widely-referenced, practical "what to actually use" cheat sheet.
???

**Next up →** [Applied Cryptography: Choosing and Using It Correctly](#/lesson/06-crypto-fundamentals/applied-crypto-in-practice)
