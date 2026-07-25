# Crypto — Small Primes, Big Problem

**Category:** Crypto · **Difficulty:** Hard

## Scenario

A fictional legacy internal tool at `kashsec-labs.test` still generates RSA keys with a deliberately small modulus "for speed" — a decision made in 2009 and never revisited. You've intercepted an RSA-encrypted flag along with the public key used to encrypt it.

## Provided data

The public key (modulus `n` and public exponent `e`):

```
n = 3127
e = 3
```

The ciphertext (a single small integer, since the flag was encrypted as one short numeric block for this exercise):

```
c = 201
```

A reminder of how RSA encryption works: `c = m^e mod n`, where `m` is the original numeric message and decryption requires computing the private exponent `d`, which in turn requires knowing the two prime factors of `n`. The flag is built directly from the recovered number `m`, in the form `KASHSEC{d3crypt3d_m_1s_<m>}`.

## Your task

Real RSA moduli are enormous (2048+ bits) specifically because factoring a product of two huge primes is computationally infeasible with current technology. This modulus is tiny — factor it, derive the private key, and decrypt the message.

:::challenge Factor n and complete the RSA math
<details><summary>Hint 1</summary><code>n = 3127</code> is small enough to factor by hand or with a basic script — RSA's entire security rests on this being infeasible at real key sizes, which is very much not the case here. Find the two primes <code>p</code> and <code>q</code> such that <code>p × q = 3127</code>.</details>
<details><summary>Hint 2</summary><code>3127 = 53 × 59</code>. With <code>p</code> and <code>q</code> known, compute Euler's totient: <code>φ(n) = (p-1)(q-1)</code>. Then find <code>d</code>, the modular multiplicative inverse of <code>e</code> modulo <code>φ(n)</code> — the private exponent.</details>
<details><summary>Show full answer</summary>Factoring gives <code>p = 53</code>, <code>q = 59</code>, so <code>φ(n) = 52 × 58 = 3016</code>. Finding the modular inverse of <code>e = 3</code> modulo <code>3016</code> gives <code>d = 2011</code> (since <code>3 × 2011 mod 3016 = 1</code>). Decrypting: <code>m = c^d mod n = 201^2011 mod 3127 = 2222</code> — you can verify this the other direction too: <code>2222^3 mod 3127 = 201</code>, matching the given ciphertext exactly. The recovered number gives the flag <strong>KASHSEC{d3crypt3d_m_1s_2222}</strong> — the small modulus made brute-force factoring (and from there, full private-key recovery) entirely practical, something that would be computationally impossible at real-world RSA key sizes.</details>
:::

## The flag

```
KASHSEC{d3crypt3d_m_1s_2222}
```

## Why this matters beyond the CTF

This challenge is a compressed, hand-computable version of a genuinely real historical vulnerability class: undersized RSA keys, generated for performance reasons or by outdated legacy systems, have been factored in real-world security research and real incidents. Modern guidance (referenced in Path 06's cryptography fundamentals) requires a minimum of 2048-bit RSA keys precisely because factoring becomes infeasible at that scale with any known classical algorithm — the security isn't from RSA being unbreakable in principle, it's from the specific numbers involved being chosen large enough that factoring them would take longer than the useful life of the universe with current computing power.

## Bonus round — why does a small public exponent matter too?

This challenge used `e = 3`, a small public exponent chosen for "efficiency" — a decision independent of the key size itself.

:::challenge What's risky about a small e, even with a properly large modulus?
<details><summary>Hint</summary>Think about what happens if the same short message is encrypted with the same small exponent under three or more <em>different</em> public keys (a real scenario — e.g., the same short message broadcast to multiple recipients, each with their own RSA key but all using <code>e=3</code>).</details>
<details><summary>Show answer</summary>This describes <strong>Håstad's broadcast attack</strong>: if the same message is encrypted with a small public exponent (commonly <code>e=3</code>) under enough different, sufficiently large moduli — mathematically, at least <code>e</code> of them — an attacker can use the Chinese Remainder Theorem to reconstruct the original message without ever factoring any of the moduli at all, even if every individual key is otherwise perfectly secure at full 2048-bit size. This is a genuinely elegant, real cryptographic attack, and it's exactly why modern RSA implementations favor a larger public exponent like <code>65537</code> combined with proper padding schemes (OAEP) — both of which independently close off this specific attack, on top of everything a sufficiently large modulus already provides.</details>
:::

:::tip This challenge is deliberately artificial
Real RSA keys are never this small — this challenge exists purely to make the underlying mathematics tractable to work through by hand or with a basic script, so the "why key size matters" lesson is something you can actually verify yourself rather than just being told. Path 06's cryptography fundamentals lesson covers the real-world key size guidance this challenge is illustrating.
:::

**Next up →** [Forensics — The EXIF Trail](#/lesson/19-ctf-challenges/forensics-exif-trail)
