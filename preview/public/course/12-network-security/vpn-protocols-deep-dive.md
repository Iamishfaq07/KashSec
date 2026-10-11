# VPN Protocols: A Deep Dive

The firewalls-VPNs lesson introduced VPNs at a conceptual level. This lesson gets specific about the actual protocols implementing that concept, and the genuine tradeoffs between them — directly useful whether you're choosing a personal VPN provider (Path 09) or designing remote access for an organization (Path 24's Zero Trust material).

## What every VPN protocol has to solve

Every VPN protocol, regardless of implementation details, solves the same underlying problem: establishing an encrypted tunnel (directly applying Path 06's cryptography concepts) between two points, so traffic passing through it is protected from anyone observing the network in between.

## OpenVPN: the flexible, widely-supported standard

**OpenVPN** has been the dominant open-source VPN protocol for years, built on the same TLS (Path 06) that secures HTTPS, offering broad platform support and genuine configurability — at the cost of being comparatively complex to configure correctly and not the fastest option available.

## WireGuard: the modern, streamlined alternative

**WireGuard** is a newer protocol built around a dramatically smaller, simpler codebase than OpenVPN — a deliberate design choice, since a smaller codebase is genuinely easier to audit and less likely to hide the kind of subtle vulnerability a full security review might otherwise miss. It uses modern cryptographic primitives (directly connecting to Path 06's elliptic-curve-cryptography lesson) and is generally faster than OpenVPN, which is why it's become the default choice for many newer VPN deployments.

## IPsec: the enterprise and site-to-site standard

**IPsec** operates at the network layer (Path 02's OSI model) rather than as an application, making it a common choice for **site-to-site VPNs** — connecting two entire office networks together as if they were one, rather than connecting a single individual device to a remote network. IPsec is genuinely powerful but has a reputation for being complex to configure correctly, and historical implementations have had their own documented weaknesses.

## Split tunneling, revisited with more depth

Path 24's remote-work lesson already warned that split tunneling — routing only some traffic through the VPN while the rest goes directly to the internet — can recreate an implicit-trust gap. This lesson adds the mechanism: split tunneling is a configuration choice within any of these protocols, not a separate protocol itself, meaning the same underlying tunnel technology can be configured either safely (full-tunnel, everything encrypted) or in a way that reopens exactly the gap Path 24 warned about.

## Why protocol choice matters for real security decisions

- **A smaller, simpler codebase (WireGuard) is generally easier to trust**, directly connecting to Path 06's applied-crypto lesson's "use established, well-reviewed libraries" principle, extended here to protocol implementations themselves
- **Site-to-site vs. remote-access needs genuinely different tooling** — IPsec's network-layer operation suits connecting entire networks; OpenVPN/WireGuard's more application-level approach suits individual remote devices
- **Perfect Forward Secrecy** (from Path 06's key-exchange lesson) should be confirmed as enabled in any VPN configuration, ensuring a compromised long-term key can't retroactively decrypt past VPN sessions

:::challenge Test yourself
Why does WireGuard's smaller codebase represent a genuine security advantage, not just a development convenience?
<details><summary>Show answer</summary>Every line of code in a security-critical system is a potential place for a subtle bug or vulnerability to hide, and a smaller, simpler codebase is both easier for security researchers to fully audit and less likely to contain an undiscovered flaw simply by virtue of having fewer total lines where one could exist. OpenVPN's larger, more flexible codebase, accumulated over many years of feature additions, is harder to review exhaustively — not because OpenVPN is poorly written, but because comprehensive security auditing scales with code complexity. This mirrors the exact same principle Path 06's applied-crypto lesson emphasized for choosing cryptographic libraries: favor implementations that have had thorough, feasible review, and a smaller codebase makes that kind of thorough review genuinely more achievable.</details>
:::

## Key terms

- **OpenVPN** — a widely-supported, TLS-based VPN protocol, flexible but comparatively complex.
- **WireGuard** — a newer, smaller-codebase VPN protocol using modern cryptography, generally faster and easier to audit.
- **IPsec** — a network-layer VPN protocol common for site-to-site connections between entire networks.

## Recap

- OpenVPN, WireGuard, and IPsec all solve the same encrypted-tunnel problem, with genuine tradeoffs in complexity, auditability, speed, and intended use case.
- WireGuard's smaller codebase is a real security advantage, directly connecting to the "prefer well-reviewed implementations" principle from Path 06.
- Split tunneling is a configuration choice within any of these protocols, not a separate protocol — and Path 24 already covered why it can reopen an implicit-trust gap if configured carelessly.

**Next up →** [Network Segmentation in Practice](#/lesson/12-network-security/network-segmentation-in-practice)
