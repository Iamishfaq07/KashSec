# Applied Cryptography: Choosing and Using It Correctly

You now understand the individual algorithms, the attacks against them, and the common implementation mistakes. This lesson is the practical synthesis: what should you actually reach for, as a working developer or security professional, when a real system needs cryptography?

:::danger The single most important rule in this entire path
**Never implement your own cryptographic algorithms or protocols.** Not because you're not smart enough — because cryptographic security depends on decades of adversarial review by the entire global research community, and a novel implementation, however clever, hasn't had any of that scrutiny. This single rule prevents more real-world crypto failures than almost anything else in this lesson.
:::

## Use established libraries, not raw primitives

Rather than manually combining an encryption algorithm, a mode, and a padding scheme yourself (exactly the kind of assembly that produces the mistakes covered in the next lesson), use a high-level, well-reviewed library that handles the details correctly by default:

- **libsodium / NaCl** — widely recommended specifically because its API is designed to make the secure choice the *easy* choice, with sensible defaults and few footguns
- **Language-standard crypto libraries** (Python's `cryptography` package, Java's built-in providers, .NET's `System.Security.Cryptography`) — generally well-maintained and audited, though they expose more low-level choices than libsodium does
- **Avoid libraries that require you to manually pick your own IV generation, padding scheme, and mode of operation** unless you specifically understand why each choice is safe — this is exactly where the common-crypto-mistakes lesson's failures tend to originate

## A practical decision guide

| You need to... | Reach for... |
|---|---|
| Encrypt data so only the intended party can read it | Symmetric encryption (AES-GCM specifically — combines confidentiality and integrity in one step) |
| Two parties who've never met need to agree on a shared secret | Diffie-Hellman / ECDHE key exchange |
| Verify a message hasn't been tampered with, using a shared secret | HMAC |
| Verify a message's authenticity without a shared secret | Digital signatures (ECDSA/EdDSA) |
| Store a password securely | A password hashing algorithm specifically — bcrypt, scrypt, or Argon2, never a general-purpose hash like SHA-256 alone (the hashing lesson explains why) |
| Verify file integrity, not defend against a deliberate adversary | A general-purpose hash like SHA-256 is fine |

## Key management: the part most guides skip

Even a perfectly implemented algorithm fails if the keys around it are handled carelessly:

- **Never hardcode keys or secrets in source code** — a mistake so common and so damaging that Path 22's DevSecOps material and Path 21's API security material both dedicate specific attention to catching it before it ships
- **Use a proper secrets manager** (covered in depth in Path 22) rather than environment files checked into version control
- **Rotate keys periodically**, and have a real plan for what happens if a key is compromised — not just an assumption that it never will be
- **Least privilege for key access** — not every service or person that touches a system needs access to every key it uses

## When cryptography isn't actually the answer

A genuinely important, often-overlooked point: cryptography protects data *in specific states* (in transit, at rest) — it doesn't substitute for proper access control, input validation, or authorization logic. Encrypting a database doesn't stop a SQL injection vulnerability (Path 11) from letting an attacker read data through the application's own legitimate, authorized access path — the encryption is irrelevant if the application itself hands over the plaintext willingly to anyone who asks correctly.

:::challenge Evaluate a design decision
A team building a new internal tool decides to write their own lightweight encryption function rather than adding a dependency on an established library, reasoning that "it's just for internal use, and the extra library adds bloat."

<details><summary>Hint</summary>Does "internal use" change whether decades of adversarial review matter? What's actually at risk if their custom function has a subtle flaw nobody catches?</details>
<details><summary>Show answer</summary>This decision violates the single most important rule in this lesson, and "internal use only" doesn't meaningfully reduce the risk — internal systems still get compromised, and a custom, unreviewed encryption function is exactly the kind of code most likely to contain a subtle, exploitable flaw that a well-reviewed library would have avoided by design. The "bloat" concern is also usually overstated: libraries like libsodium are small and specifically designed for exactly this kind of lightweight use case. The right call is using an established library regardless of how internal or low-stakes the use case seems, precisely because "this seemed low-stakes" is a common thread running through many real-world crypto incidents after the fact.</details>
:::

## 🧪 Hands-on lab — audit a hypothetical system design

For a hypothetical app storing user passwords, encrypting uploaded files, and verifying webhook signatures from a third-party service, specify exactly which cryptographic tool from the decision guide above you'd use for each of the three needs, and justify each choice in one sentence.

:::challenge Test yourself
1. Why is "never implement your own cryptography" considered the single most important rule in applied crypto?
2. Why is a password hashing algorithm like bcrypt the right choice for passwords, while SHA-256 alone is the right choice for file-integrity checks?
3. Why doesn't encrypting a database protect against a SQL injection vulnerability in the application using it?
:::

## Key terms

- **libsodium** — a widely recommended, easy-to-use cryptography library designed to make secure defaults the easy path.
- **Secrets manager** — a dedicated system for storing and controlling access to cryptographic keys and other sensitive credentials.
- **Key rotation** — periodically replacing cryptographic keys to limit the impact of an undetected compromise.

## Recap

Applied cryptography is less about algorithm selection and more about disciplined engineering practice: use established, well-reviewed libraries rather than building your own primitives, choose the right tool for each specific need (the decision guide above), and treat key management — never hardcoding secrets, using a real secrets manager, rotating keys — as equally important as the algorithms themselves. And remember cryptography's actual scope: it protects data in specific states, it doesn't substitute for the access control and input validation covered throughout the rest of this course.

???refs
- [libsodium documentation](https://doc.libsodium.org/) — a practical, well-designed library worth exploring hands-on
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) — concrete, practical implementation guidance
???

**Next up →** [Blockchain & Cryptocurrency Cryptography](#/lesson/06-crypto-fundamentals/blockchain-cryptocurrency-crypto)
