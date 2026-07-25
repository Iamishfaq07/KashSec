# Industrial Protocols: Modbus, DNP3, and Why Their Design Causes Security Problems

The previous lesson described the sense-decide-act loop conceptually. This lesson gets concrete about how the pieces actually talk to each other — and why the protocols carrying that conversation are, from a security standpoint, a genuinely different problem than anything covered elsewhere in this course.

:::tip
The single fact that explains almost every protocol-level ICS vulnerability you'll encounter: **most industrial protocols were designed with zero built-in authentication or encryption, because the original threat model assumed only trusted engineers on a physically isolated network would ever send these commands.** That assumption is the root cause, and it's worth remembering every time a new protocol quirk comes up in this lesson.
:::

## Modbus: simple, ubiquitous, and trusting by design

**Modbus** is one of the oldest and most widely deployed industrial protocols, originally developed in 1979. Its enduring popularity comes from genuine simplicity — a small set of function codes for reading and writing data (read a coil, write a register, and a handful of others), transmitted in plain text with no authentication whatsoever.

- **No authentication**: any device that can reach a Modbus-speaking PLC over the network can send it commands. There's no concept of "prove you're allowed to do this" anywhere in the protocol.
- **No encryption**: commands and responses travel in cleartext. Anyone who can observe the traffic can read exactly what's being commanded and what values are being reported.
- **No integrity checking beyond basic error detection**: nothing stops a manipulated packet from being accepted as legitimate, as long as it's well-formed.

In practice, this means: if an attacker can reach a Modbus network segment at all, they can typically read any value and write any command a legitimate engineering workstation could — the protocol itself provides no resistance whatsoever. The only security Modbus has ever had is *network-level* — keeping unauthorized devices off the segment entirely, which is exactly the segmentation problem the Purdue Model lesson tackles next.

## DNP3: built for a harsher environment, with a few more guardrails

**DNP3 (Distributed Network Protocol 3)** is common in utility environments — especially electrical grid and water infrastructure — and reflects lessons learned from operating over less reliable, longer-distance links than Modbus typically assumes:

- Includes better support for time-stamped data and event reporting, useful when readings travel long distances with variable delay
- A newer specification, **DNP3 Secure Authentication**, adds a genuine authentication mechanism — but it's an *optional add-on*, not a mandatory part of the base protocol, and real-world adoption of the secure variant has historically lagged far behind adoption of DNP3 itself

The pattern here repeats across the whole industrial protocol landscape: security extensions exist, but the base, insecure version remains the one actually deployed on a huge share of real infrastructure, because replacing working field equipment is expensive and disruptive in a way that patching a web server never is.

## Side-by-side comparison

| | Modbus | DNP3 |
|---|---|---|
| Original design era | 1979 | 1990s |
| Typical use case | Factory automation, building automation | Utilities — electric grid, water infrastructure |
| Built-in authentication | None | Optional (Secure Authentication extension), rarely deployed |
| Built-in encryption | None | None in base protocol |
| Transport | Often serial, now commonly over TCP/IP too | Serial and TCP/IP |
| Real-world exposure | Frequently found reachable from broader networks than intended | Similarly exposed, especially where legacy remote access exists |

## Why "just add TLS" doesn't simply fix this

A natural instinct from an IT security background: wrap these protocols in TLS and call it solved. In practice this runs into real OT constraints:

- Many field devices have limited processing power — decades-old hardware may not have the computational headroom for modern cryptographic overhead at the required speed
- Retrofitting encryption onto a live, safety-critical control loop risks introducing latency or failure modes that are unacceptable given the "availability and safety first" priority from the first lesson in this path
- A huge installed base of legacy devices simply cannot be upgraded to support it at all — the fix would mean physically replacing equipment across an entire facility or region

This is exactly why OT security leans so heavily on **network-level controls** (segmentation, monitoring, strict access control) rather than "fix the protocol" — the protocol often genuinely can't be fixed at scale without replacing hardware that's expected to run for another decade or two.

:::warn
A common, dangerous assumption: "we use Modbus, but it's on our internal network, so it's fine." The protocol provides zero authentication regardless of network location — the *entire* security of a Modbus deployment rests on nothing reaching that network segment that shouldn't. If segmentation fails even once, the protocol itself offers no second line of defense.
:::

## A worked example: what an unauthenticated write actually looks like

A Modbus "write single register" command is, in essence: function code, register address, value — sent as a simple, well-documented, unauthenticated packet. If an attacker can reach the network segment a PLC is on, crafting and sending that exact packet requires no special exploit, no vulnerability research, and no credentials — just knowledge of the (publicly documented) protocol and the target's address. This is a meaningful difference from most IT vulnerabilities, which typically require finding and exploiting an actual bug. In classic ICS/Modbus attacks, there's frequently no bug to find at all — the protocol is working exactly as designed, and the "vulnerability" is that it was ever reachable by an untrusted party in the first place.

## 🧪 Hands-on lab — read a real Modbus packet capture (conceptually)

You don't need real ICS hardware for this exercise — the goal is understanding the protocol's shape.

1. Research the basic structure of a Modbus "read holding registers" request and response (function code, address, data — publicly documented, safe to look up).
2. Write out, in plain English, what information in that request an attacker could learn just by observing it on the wire (no decryption needed, since there's nothing encrypted).
3. Now do the same for a "write single register" request — what could an attacker change, and what would they need to know to target a specific piece of equipment?
4. Write one paragraph explaining why network segmentation is effectively the *only* real defense for a device that only speaks unauthenticated Modbus.

:::challenge Test yourself
1. Why does Modbus have no built-in authentication, and why does that matter more in 2026 than it did in 1979?
2. Explain why "just add TLS to it" is harder in OT than the equivalent fix would be for a typical IT web service.
3. In the "unauthenticated write" example, why is this not really a "vulnerability" in the traditional bug-hunting sense?
:::

## Key terms

- **Modbus** — one of the oldest and most widely deployed industrial protocols, with no built-in authentication or encryption
- **DNP3** — a protocol common in utility environments, with an optional (rarely deployed) secure authentication extension
- **Function code** — the part of an industrial protocol command that specifies the action being requested (read, write, etc.)
- **Secure Authentication (DNP3)** — an add-on specification providing cryptographic authentication for DNP3, not part of the base protocol

## Recap

Modbus and DNP3 both reflect a design era that assumed trusted, isolated networks — no authentication, no encryption, and commands that any reachable device can send and any observer can read. Retrofitting modern security onto them is genuinely harder than in IT, both technically (device constraints) and practically (an enormous, expensive-to-replace installed base), which is exactly why network-level segmentation — the subject of the next lesson — carries so much of the real-world security burden in these environments.

???refs
- [NIST SP 800-82 — Guide to Industrial Control Systems Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final) — covers Modbus, DNP3, and other industrial protocols in detail
- [CISA — Industrial Control Systems Advisories](https://www.cisa.gov/news-events/cybersecurity-advisories?f%5B0%5D=advisory_type%3A94) — ongoing real-world vulnerability disclosures affecting these protocols
???
