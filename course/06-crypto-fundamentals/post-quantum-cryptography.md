# Post-Quantum Cryptography

Every algorithm covered in this path so far — RSA, Diffie-Hellman, elliptic curve cryptography — relies on math problems that are hard for *today's* computers. This closing conceptual lesson covers a genuinely different kind of computer that's specifically good at exactly those problems, and what the cryptography world is doing about it well before it's a practical threat.

:::tip
This isn't a lesson about something happening tomorrow. Practical, cryptographically-relevant quantum computers likely remain years away — but cryptographic transitions take years to roll out safely too, which is exactly why this preparation is already well underway across the industry today, not something to worry about only once it's urgent.
:::

## What makes quantum computers different, at a conceptual level

A **quantum computer** doesn't just run today's algorithms faster — it can run fundamentally different algorithms that exploit quantum mechanical properties to solve certain specific classes of math problems dramatically faster than any classical computer ever could. Critically, **Shor's algorithm**, a quantum algorithm developed in 1994, can efficiently solve exactly the two hard-math problems that RSA (factoring) and Diffie-Hellman/ECC (discrete logarithm problems) depend on — the same "easy forward, hard to reverse" asymmetry that the asymmetric-encryption and elliptic-curve lessons built their entire security case on.

## "Harvest now, decrypt later" — why this matters today, not just in the future

Even though practical quantum computers capable of running Shor's algorithm at meaningful scale don't yet exist, a real and already-active threat model exists today: an adversary can capture and store encrypted traffic *right now*, and simply wait — decrypting it once sufficiently powerful quantum computers become available. For data that needs to stay confidential for years or decades (government secrets, long-term medical records, some financial data), this "harvest now, decrypt later" threat is a genuine reason to act before quantum computers are actually practical, not after.

## What's actually vulnerable, and what isn't

- **Vulnerable**: RSA and Diffie-Hellman/ECC-based systems — precisely the asymmetric algorithms Shor's algorithm targets, covering the key exchange and digital signature lessons' entire content
- **Less affected**: Symmetric encryption (AES) and hash functions (SHA-256) — a different quantum algorithm (Grover's algorithm) does provide a speedup against these too, but only a much more modest one, generally addressed simply by using larger key/output sizes rather than replacing the algorithms entirely

## What "post-quantum cryptography" actually is

**Post-quantum cryptography (PQC)** refers to new cryptographic algorithms specifically designed to remain secure even against an attacker with a quantum computer — built on entirely different hard math problems (lattice-based problems, hash-based signatures, and others) that Shor's algorithm doesn't help with at all. In 2024, **NIST standardized the first set of post-quantum cryptographic algorithms** (including ML-KEM for key exchange and ML-DSA for digital signatures) after a multi-year public evaluation process, mirroring the same open, adversarially-reviewed standardization process this path has emphasized throughout as the right way to trust a cryptographic algorithm at all.

## Where this is already showing up in practice

Major browsers and cloud providers have already begun deploying **hybrid** key exchange in TLS — combining a traditional method (like ECDHE, from the key-exchange lesson) with a post-quantum algorithm simultaneously, so a connection remains secure as long as *either* method holds, providing protection against the harvest-now-decrypt-later threat today, without fully abandoning battle-tested classical cryptography before post-quantum algorithms have accumulated their own track record.

:::challenge Reason about a migration decision
A government agency handling records that must stay confidential for 50 years is deciding whether to wait for post-quantum cryptography to become more widely deployed before switching, or to start migrating now using hybrid classical/post-quantum encryption.

<details><summary>Hint</summary>Given the "harvest now, decrypt later" threat model, does waiting actually reduce risk here, or does it just delay when the exposure window opens?</details>
<details><summary>Show answer</summary>Given a 50-year confidentiality requirement and the harvest-now-decrypt-later threat, waiting is the riskier choice, not the safer one. Any data encrypted today using only classical algorithms could be captured now and decrypted decades from now once quantum computers mature — well within this agency's 50-year window. Migrating now to hybrid classical/post-quantum encryption protects data being encrypted starting today, while still relying on the well-tested classical algorithm as a safety net in case an unexpected weakness is later found in the newer post-quantum algorithm. This is exactly the reasoning driving early PQC adoption among organizations with genuinely long confidentiality requirements.</details>
:::

## 🧪 Hands-on lab — check your own exposure

Using your browser's developer tools, check whether a major site you visit (many large tech companies have already deployed this) is using a hybrid post-quantum key exchange in its TLS connection — the cipher suite or key exchange details in the connection security panel will sometimes show this explicitly (look for names containing "Kyber" or "ML-KEM").

:::challenge Test yourself
1. Which two algorithm families covered earlier in this path does Shor's algorithm specifically threaten, and why?
2. What is the "harvest now, decrypt later" threat, and why does it matter even before quantum computers are practical?
3. Why does hybrid classical/post-quantum key exchange make sense as a transition strategy, rather than switching entirely to post-quantum algorithms immediately?
:::

## Key terms

- **Quantum computer** — a computer exploiting quantum mechanical properties to solve certain problems dramatically faster than classical computers.
- **Shor's algorithm** — a quantum algorithm capable of efficiently solving the factoring and discrete logarithm problems RSA and Diffie-Hellman/ECC depend on.
- **Post-quantum cryptography (PQC)** — cryptographic algorithms designed to remain secure against quantum computers, standardized by NIST beginning in 2024.
- **Harvest now, decrypt later** — the strategy of capturing encrypted data today to decrypt once quantum computers become capable enough.

## Recap

Quantum computers pose a specific, well-understood future threat to exactly the asymmetric algorithms (RSA, Diffie-Hellman, ECC) this path spent several lessons building intuition for — not because those algorithms are flawed, but because Shor's algorithm efficiently solves the underlying hard math problems they rely on. The "harvest now, decrypt later" threat model means preparation matters today, not just once quantum computers are practical, which is exactly why NIST has already standardized post-quantum algorithms and why hybrid classical/post-quantum deployment is already underway across major browsers and cloud providers.

???refs
- [NIST Post-Quantum Cryptography Standardization](https://csrc.nist.gov/projects/post-quantum-cryptography) — the official standardization project and selected algorithms
???

**Next up →** [Crypto Hands-On Lab](#/lesson/06-crypto-fundamentals/crypto-hands-on-lab)
