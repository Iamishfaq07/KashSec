# Micro-Segmentation & Network Design

If identity and device posture answer "who can get in," micro-segmentation answers a different, equally important question: "once something is in, how far can it actually go?" This is the "assume breach" principle from the first lesson, made concrete at the network layer.

:::tip
The test for good segmentation: if one server gets fully compromised right now, write down exactly what else an attacker on it could reach. If the honest answer is "most of the network," segmentation has failed, no matter how good the perimeter firewall looks.
:::

## From flat networks to micro-segments

A **flat network** is one where, once you're inside, most systems can talk to most other systems by default. This was common (and honestly, often not deliberately "designed" — it's just what happens when nobody ever restricted internal traffic). The practical consequence: a single compromised workstation in the marketing department can often reach the finance database server directly, because nothing was ever configured to stop it.

**Micro-segmentation** breaks a network into small, deliberately isolated zones — sometimes down to the level of individual workloads — where traffic between segments is denied by default and only explicitly allowed paths are opened.

| Approach | Granularity | Typical unit |
|---|---|---|
| Traditional VLANs | Coarse | Whole departments or floors |
| Subnet-based segmentation | Medium | Groups of related servers |
| Micro-segmentation | Fine | Individual workloads or services |
| Zero Trust micro-segmentation | Finest | Individual requests, evaluated per-flow |

## Default-deny is the whole point

The single most important shift: **default-deny, not default-allow**. In a flat network, the question is "is there a rule blocking this?" In a properly micro-segmented network, the question flips to "is there a rule explicitly allowing this?" — and if not, the traffic simply doesn't happen.

This sounds like a small wording difference. In practice it's the difference between a network where new, unreviewed pathways silently exist by default, and one where every single pathway had to be deliberately requested and approved.

:::danger
Retrofitting default-deny onto an existing flat network is genuinely hard — it usually breaks things nobody remembers configuring, because "it just worked" was never actually documented anywhere. This is exactly why organizations moving toward micro-segmentation typically start with extensive traffic-mapping (watching what actually talks to what for weeks before writing any deny rules) rather than flipping a switch.
:::

## A worked example: a three-tier app, segmented properly

A typical web application has a web tier, an app tier, and a database tier. Under flat networking, once inside, an attacker who compromises the web server might be able to reach the database directly, bypassing the app tier's business logic entirely.

Under micro-segmentation:

- Web tier → app tier: **allowed**, on the specific port the app tier actually listens on
- App tier → database tier: **allowed**, on the specific database port, from app-tier hosts only
- Web tier → database tier: **denied**, full stop — there's no legitimate reason the web tier should ever talk to the database directly
- Database tier → anything outbound: **denied by default** — a compromised database server shouldn't be able to freely exfiltrate data to the internet or pivot elsewhere

If an attacker compromises the web server now, they hit a wall trying to reach the database directly — they'd have to also compromise the app tier through its legitimate, narrower interface, which is a meaningfully harder additional step, and one more chance for detection.

## Software-Defined Perimeter (SDP)

Traditional segmentation is often still tied to physical or virtual network topology (VLANs, subnets, firewall zones). **Software-Defined Perimeter** takes this further: resources aren't just segmented, they're effectively *invisible* to anyone who hasn't been authorized. An unauthenticated scan of the network doesn't see a login page to attack — it sees nothing at all, because the resource never responds until the requester has already proven their identity and authorization out-of-band.

This "deny by default, invisible until authorized" model is a big part of what modern Zero Trust Network Access (ZTNA) products are actually selling — covered in more depth in the next lesson.

## East-west traffic: the blind spot

Security teams have historically spent enormous effort on **north-south traffic** (into and out of the network, at the perimeter) and comparatively little on **east-west traffic** (between systems inside the network). This is backwards from an "assume breach" standpoint — once an attacker is inside, east-west movement is exactly how they turn one compromised laptop into a full breach. Micro-segmentation is fundamentally an east-west control: it doesn't stop the initial break-in as much as it stops what happens *after*.

## 🧪 Hands-on lab — map a network's blast radius

Pick a system you're familiar with (a personal home network, a small app you've built, or a hypothetical company setup).

1. List every device/server/service on it.
2. For each pair, ask honestly: does A actually need to talk to B, or does it just *happen* to be able to right now?
3. Draw (in words or a simple diagram) which connections are genuinely necessary versus which exist only because nothing ever restricted them.
4. Pick the single most sensitive system in your list (a database, a personal NAS, whatever holds the most valuable data). Write down: right now, how many other systems could reach it if compromised? What's the smallest set of explicit rules that would get that number down to just what's actually needed?

:::challenge Test yourself
1. Explain the difference between default-allow and default-deny network segmentation in your own words.
2. In the three-tier app example, why is "web tier → database tier: denied" specifically valuable, even though the web tier can still reach the app tier?
3. Why has east-west traffic historically gotten less security attention than north-south traffic, and why is that a problem under an "assume breach" mindset?
:::

## Key terms

- **Micro-segmentation** — dividing a network into small, isolated zones with default-deny traffic rules between them
- **Default-deny** — a security posture where all traffic is blocked unless explicitly allowed, rather than allowed unless explicitly blocked
- **East-west traffic** — traffic between systems inside a network, as opposed to traffic crossing the perimeter
- **Software-Defined Perimeter (SDP)** — an approach that makes resources invisible/unreachable to unauthorized requesters rather than merely access-controlled

## Recap

Flat networks let a single compromise become a full breach; micro-segmentation limits blast radius by making every internal connection an explicit, deliberate decision instead of a default. Combined with the identity and device-trust layers from the previous two lessons, this is where Zero Trust stops being purely about "who logs in" and starts actively containing what happens after something inevitably goes wrong.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — covers network segmentation as a core architectural component
- [CISA Zero Trust Maturity Model — Networks pillar](https://www.cisa.gov/zero-trust-maturity-model) — maturity stages specifically for network segmentation
???
