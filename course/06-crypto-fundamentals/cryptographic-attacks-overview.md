# Common Cryptographic Attacks

The common-crypto-mistakes lesson (later in this path) covers implementation-level errors. This lesson is different — a tour of specific, named attack techniques against cryptographic systems, so you recognize them by name when you encounter them in later paths and real-world security news.

:::tip
None of these attacks require you to be a mathematician to understand at a conceptual level. Each one exploits a specific, identifiable gap between "the algorithm is theoretically secure" and "the system using it was built correctly" — exactly the gap this whole path has been building your intuition for.
:::

## Padding oracle attacks

Block ciphers (from the symmetric-encryption lesson) that don't neatly divide data into exact block sizes use **padding** to fill out the last block. A **padding oracle attack** exploits a system that reveals — even indirectly, through subtly different error messages or response times — whether decrypted padding was valid or invalid. An attacker who can repeatedly probe this "oracle" can, through many careful queries, decrypt an entire ciphertext without ever knowing the key, purely by exploiting what the padding-validity signal leaks.

## Length extension attacks

Some older hash constructions (naive uses of MD5 or SHA-256 in certain modes) let an attacker who knows `hash(secret + message)` compute `hash(secret + message + extra_data)` — extending the original message and producing a *valid* hash for the extended version, without ever knowing the secret itself. This is exactly why modern systems use **HMAC** (a specific, properly constructed way of combining a hash function with a secret key) rather than naively hashing a secret and message together.

## Replay attacks

A **replay attack** doesn't break the cryptography at all — it simply captures a legitimate, validly-encrypted or validly-signed message and resends it later, hoping the system accepts it again as if it were new. A captured, perfectly valid "transfer $100" authorization message, replayed five times, becomes a $500 transfer if nothing prevents reuse. Defenses include **nonces** (numbers used once, rejected if seen again) and timestamps with a short validity window.

## Downgrade attacks

A **downgrade attack** tricks two parties into using a weaker, older cryptographic protocol or algorithm than they'd normally negotiate — exploiting backward-compatibility support for the sake of forcing a genuinely breakable configuration. This is precisely why the TLS-handshake lesson noted that TLS 1.3 removed support for older, weaker cipher suites entirely — every optional weak fallback is a potential downgrade target.

## Side-channel attacks

A **side-channel attack** doesn't attack the mathematics at all — it extracts secret information from *how* an implementation runs: precisely how long an operation takes (**timing attacks**), how much power a device draws, or even sounds a chip makes during computation. These are notoriously hard to defend against because the leak isn't a flaw in the cryptographic algorithm itself, it's in physical implementation details most developers never think to consider.

## Birthday attacks

Named after the counterintuitive "birthday paradox" (in a room of just 23 people, there's better than even odds two share a birthday), a **birthday attack** exploits the same math to find hash collisions (from the hashing-explained lesson) far faster than naive brute force would suggest — this is precisely why hash output length matters so much for collision resistance, and why older, shorter hashes like MD5 became practically breakable well before their theoretical maximum strength would suggest.

:::challenge Diagnose the attack
A web application's error messages differ subtly depending on whether decrypted ciphertext padding was valid: "Invalid request" for bad padding, "Access denied" for good padding but a wrong key. An attacker notices this difference and starts sending thousands of slightly modified ciphertexts, tracking which error message comes back each time.

<details><summary>Hint</summary>What specific attack from this lesson exploits exactly this kind of subtle, indirect signal about padding validity?</details>
<details><summary>Show answer</summary>This is a textbook <strong>padding oracle attack</strong>. The application never intended to leak information about padding validity — but the subtly different error messages act as an "oracle" the attacker can repeatedly query, and through enough carefully chosen queries, an attacker can decrypt the original ciphertext entirely without ever recovering the actual encryption key. The fix isn't stronger encryption — it's eliminating the observable difference entirely: using the exact same generic error message and response time regardless of *why* decryption failed, so there's no signal left to exploit.</details>
:::

## 🧪 Hands-on lab — match the defense to the attack

For each attack in this lesson, write one sentence naming the specific defense that closes it (some are named directly in this lesson — HMAC, nonces, removing weak cipher suite support, constant-time comparison for side-channels, longer hash outputs for birthday attacks).

:::challenge Test yourself
1. What makes a padding oracle attack possible, even when the underlying encryption algorithm itself is secure?
2. Why doesn't a replay attack require breaking any cryptography at all?
3. Why are side-channel attacks considered especially hard to defend against?
:::

## Key terms

- **Padding oracle attack** — decrypting ciphertext by repeatedly exploiting a system that leaks whether decrypted padding was valid.
- **Replay attack** — resending a captured, validly-encrypted message to trick a system into accepting it again.
- **Downgrade attack** — tricking parties into using a weaker protocol or algorithm than they'd normally negotiate.
- **Side-channel attack** — extracting secret information from implementation details (timing, power) rather than breaking the algorithm's math.

## Recap

This lesson's five named attacks — padding oracle, length extension, replay, downgrade, and side-channel/birthday attacks — share a common thread with the common-crypto-mistakes lesson coming up next: the underlying cryptographic algorithms are usually sound, but the systems built around them leak information, allow reuse, or permit weaker fallback configurations that a careful attacker can exploit. Recognizing these attacks by name is exactly what turns "I know what encryption is" into genuine practical crypto literacy.

???refs
- [OWASP — Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/) — the OWASP Top 10 category covering these exact failure patterns in real applications
???

**Next up →** [Common Crypto Mistakes](#/lesson/06-crypto-fundamentals/common-crypto-mistakes)
