# Blockchain & Cryptocurrency Cryptography

Cryptocurrency is, underneath the hype and the price charts, one of the most direct real-world applications of nearly everything this path has taught. This lesson connects the dots — not as investment advice, but as a genuinely useful case study in applied cryptography.

:::tip
Nothing in a blockchain is a new cryptographic primitive — it's hashing, digital signatures, and public/private key pairs, all covered earlier in this path, combined in a specific, clever way to solve a particular problem: how do mutually distrusting parties agree on a shared, tamper-evident record without a central authority?
:::

## Hash chains: the "chain" in blockchain

A **blockchain** is, structurally, a chain of data blocks where each block contains a cryptographic hash (from the hashing-explained lesson) of the *previous* block. This single design choice has a powerful consequence: changing any block, even slightly, changes its hash — which no longer matches what the next block recorded, breaking the chain from that point forward and making the tampering immediately detectable. This is the exact same hash-chain principle used in Path 16's forensics and log-integrity material, applied at massive, decentralized scale.

## Public/private keys as identity and ownership

Cryptocurrency wallets are, at their core, an asymmetric key pair (from the asymmetric-encryption lesson) — your **public key** (or an address derived from it) is where funds are sent, and your **private key** is what proves you're authorized to spend them. There's no username or password in the traditional sense; ownership *is* possession of the private key, which is exactly why "not your keys, not your coins" is such a common phrase in that community, and why private key loss is unrecoverable by design — there's no "forgot password" flow, because there's no central authority to ask.

## Digital signatures: authorizing a transaction

Every cryptocurrency transaction is cryptographically signed (using ECDSA, from the elliptic-curve-cryptography lesson, in Bitcoin and Ethereum specifically) with the sender's private key. Anyone on the network can verify the signature using the sender's public key, confirming the transaction was genuinely authorized by whoever controls that address, without ever needing to see or trust the private key itself — precisely the same signature-verification principle the digital-signatures-certificates lesson introduced, applied to authorizing a financial transfer instead of authenticating a website.

## Consensus: how a decentralized network agrees on the truth

Beyond individual transactions, a blockchain network needs mechanisms to agree on the *order* of transactions without a central authority — this is what **consensus mechanisms** like Proof of Work (Bitcoin) and Proof of Stake (modern Ethereum) actually solve, and it's a genuinely separate problem from the cryptography covered elsewhere in this path. Understanding that "blockchain security" involves both the cryptographic primitives *and* the consensus mechanism is important — a flaw in either layer can compromise the system, even if the other layer is perfectly sound.

## Where crypto (cryptography) meets crypto (cryptocurrency) security incidents, in practice

Real cryptocurrency security incidents rarely come from someone breaking ECDSA or SHA-256 mathematically — they overwhelmingly come from the same categories covered elsewhere in this course: phishing for private keys (Path 00), smart contract logic bugs (a specialized area related to Path 11's web application security), and exchange platforms suffering conventional breaches unrelated to the underlying blockchain cryptography itself. The math tends to hold; the systems and humans around it are where real losses happen — a pattern that should feel familiar by now.

:::challenge Diagnose a real incident category
A cryptocurrency exchange loses millions of dollars in user funds after attackers compromise an employee's laptop through a phishing email and use their access to move funds out of the exchange's wallets.

<details><summary>Hint</summary>Was the underlying blockchain cryptography (hashing, digital signatures, ECDSA) broken here, or was something else entirely the actual failure?</details>
<details><summary>Show answer</summary>The underlying cryptography was never touched — the actual signatures, hashes, and consensus mechanism all worked exactly as designed. This is a <strong>phishing and access-control failure</strong> (covered in Path 00 and Path 14), not a cryptographic one: the attacker obtained legitimate access to keys or systems that were authorized to move funds, rather than breaking any mathematical guarantee. This pattern — the crypto math holding perfectly while the surrounding human and system security fails — is genuinely the dominant cause of real cryptocurrency losses, which is exactly why this lesson emphasizes it directly rather than leaving it as an assumption.</details>
:::

## 🧪 Hands-on lab — trace a real transaction

Using a public blockchain explorer (a search for "Bitcoin block explorer" or "Etherscan" will surface options), look up any recent transaction and identify: the sending address, the receiving address, and the transaction hash. Note how this maps directly onto the public-key-as-identity and hash-chain concepts from this lesson.

:::challenge Test yourself
1. What specific cryptographic concept from earlier in this path does "each block contains the previous block's hash" directly build on?
2. Why does losing a private key mean permanently losing access to cryptocurrency funds, with no recovery option?
3. Why do most real cryptocurrency thefts not actually involve breaking any cryptographic algorithm?
:::

## Key terms

- **Blockchain** — a chain of data blocks, each cryptographically linked to the previous one via a hash, making tampering detectable.
- **Consensus mechanism** — the method a decentralized network uses to agree on transaction order and validity (e.g., Proof of Work, Proof of Stake).
- **Private key (in cryptocurrency)** — the cryptographic secret that proves ownership and authorizes spending, with no recovery mechanism if lost.

## Recap

Cryptocurrency and blockchain technology are, structurally, a real-world composition of concepts already covered in this path — hash chains for tamper-evidence, asymmetric key pairs for ownership, and digital signatures for authorizing transactions — combined with a separate consensus layer to achieve agreement without a central authority. Real-world losses overwhelmingly come from phishing, access-control failures, and smart contract bugs rather than the underlying cryptographic math breaking, a pattern worth remembering well beyond this specific application.

???refs
- [Bitcoin Whitepaper (Satoshi Nakamoto)](https://bitcoin.org/bitcoin.pdf) — the original document describing how these pieces combine
???

**Next up →** [Post-Quantum Cryptography](#/lesson/06-crypto-fundamentals/post-quantum-cryptography)
