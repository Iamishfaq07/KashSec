# Elliptic Curve Cryptography

The asymmetric-encryption lesson covered RSA, built on the hardness of factoring large numbers. This lesson covers the other major approach in wide modern use — **Elliptic Curve Cryptography (ECC)** — built on a completely different hard math problem, and increasingly the default choice for new systems.

:::tip
You don't need to understand the underlying elliptic curve math deeply to use this lesson well. What matters practically: ECC provides equivalent security to RSA using dramatically smaller keys, which is exactly why it's become the modern default for TLS, SSH, cryptocurrency wallets, and passkeys (from Path 00's passwords lesson).
:::

## What an elliptic curve actually is, at a glance

An **elliptic curve** is a specific type of mathematical curve with a special property: given any two points on the curve, there's a well-defined way to "add" them together to get a third point, also on the curve. This "point addition" operation, repeated many times starting from a fixed public point, is easy to compute forward but extremely hard to reverse — you can easily compute "start at point G, add it to itself 47 times" but given only the starting point and the final result, recovering "47" is computationally infeasible at real-world key sizes. That asymmetry — easy forward, hard to reverse — is the exact same shape of hard problem RSA relies on with factoring, just built from different math.

## Why smaller keys matter in practice

A 256-bit ECC key provides roughly the same real-world security as a 3072-bit RSA key. This isn't a minor efficiency detail — smaller keys mean:

- **Faster computation** — meaningfully less CPU work for every handshake, signature, and verification, which matters enormously at the scale of a server handling millions of connections
- **Smaller data to transmit** — smaller certificates, smaller handshake messages, genuinely faster page loads at scale
- **Practical for constrained devices** — IoT devices, smart cards, and mobile devices with limited processing power can run ECC where full-size RSA would be noticeably slower

## Where you'll actually encounter ECC

- **ECDHE** — the ephemeral Diffie-Hellman key exchange from the previous lesson, built on elliptic curves rather than the original modular-exponentiation approach, and now the standard in modern TLS
- **ECDSA / EdDSA** — elliptic-curve digital signature algorithms, an alternative to RSA signatures covered in the digital-signatures lesson, used throughout SSH keys and increasingly TLS certificates
- **Passkeys** — the passwordless authentication method from Path 00 generates elliptic-curve key pairs by default on most modern platforms
- **Cryptocurrency** — Bitcoin and Ethereum both use ECDSA (specifically the secp256k1 curve) to sign transactions, which the blockchain-and-cryptocurrency lesson later in this path covers directly

## A word on curve choice — not all curves are equal

Not every elliptic curve is equally trustworthy. Some curves have publicly known, well-vetted parameters with no evidence of manipulation (**Curve25519** is widely regarded as one of the most trusted, designed specifically to avoid the kind of subtle implementation pitfalls older curves were vulnerable to); others, historically, have drawn suspicion over how their specific parameters were chosen, without full public justification. This is exactly why the applied-crypto lesson later in this path repeats a recurring theme: **use well-vetted, standard, widely-reviewed implementations rather than choosing obscure parameters yourself.**

:::challenge Compare key sizes
A colleague argues that a system using 2048-bit RSA keys is automatically more secure than one using 256-bit ECC keys, purely because the number is bigger.

<details><summary>Hint</summary>Does "number of bits" mean the same thing across two completely different underlying mathematical problems?</details>
<details><summary>Show answer</summary>This reasoning is incorrect, and it's a genuinely common misconception. Key size only makes sense as a security comparison *within* the same underlying algorithm family — RSA's hardness comes from factoring, ECC's comes from the elliptic curve discrete logarithm problem, and these problems don't get harder at the same rate as key size grows. In practice, a 256-bit ECC key provides security roughly comparable to a 3072-bit RSA key — meaning the 2048-bit RSA key in this scenario is actually somewhat *weaker*, not stronger, despite having a "bigger" number attached to it. Comparing raw bit counts across different algorithms is a meaningless comparison on its own.</details>
:::

## 🧪 Hands-on lab — inspect real ECC usage

Using a browser's developer tools (or an online SSL checker), inspect the certificate details of an HTTPS website you visit regularly, and identify whether it's using an RSA or ECC (often labeled ECDSA) key, and if ECC, which curve.

:::challenge Test yourself
1. What hard mathematical problem underlies elliptic curve cryptography's security?
2. Why does a smaller ECC key provide comparable security to a much larger RSA key?
3. Why does curve choice matter, and what does Curve25519 specifically get right?
:::

## Key terms

- **Elliptic Curve Cryptography (ECC)** — a public-key cryptography approach based on the algebraic structure of elliptic curves over finite fields.
- **ECDSA / EdDSA** — elliptic-curve digital signature algorithms.
- **Curve25519** — a widely trusted, well-vetted elliptic curve designed to avoid common implementation pitfalls.

## Recap

ECC provides equivalent security to RSA using dramatically smaller keys, built on a completely different hard math problem (the elliptic curve discrete logarithm problem, rather than factoring). That efficiency is exactly why it's become the modern default across TLS, SSH, passkeys, and cryptocurrency — but, as with all cryptography, curve choice matters: well-vetted, standard curves like Curve25519 are the safe default, and rolling your own curve parameters is squarely in "don't do this yourself" territory.

???refs
- [Cloudflare — A (Relatively Easy To Understand) Primer on Elliptic Curve Cryptography](https://www.cloudflare.com/learning/ssl/how-does-public-key-cryptography-work/) — an accessible deeper dive into the underlying math
???

**Next up →** [Hashing Explained](#/lesson/06-crypto-fundamentals/hashing-explained)
