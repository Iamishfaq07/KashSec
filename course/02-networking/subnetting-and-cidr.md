# Subnetting & CIDR notation

The IP-addresses lesson showed you what an address looks like. This lesson answers the next natural question: how does a network know which addresses belong to *it*, versus which addresses live somewhere else entirely?

## Splitting one big address space into smaller networks

A **subnet** is a smaller network carved out of a larger address range — the same way a big office building might be divided into individual floors, each with its own set of room numbers. Splitting a network into subnets lets an organization group related devices together and control exactly how traffic flows between groups (directly setting up the security-groups concept from Path 08's cloud-networking lesson, and the micro-segmentation idea from Path 24).

## Reading CIDR notation

You'll see addresses written like `192.168.1.0/24` constantly once you start working with networks — that `/24` is **CIDR notation** (Classless Inter-Domain Routing), and it tells you exactly how many addresses belong to that specific subnet.

```
192.168.1.0/24
```

The number after the slash tells you how many bits are reserved for the *network* portion of the address — the rest is available for individual *hosts* (devices) within that subnet. A `/24` reserves 24 of the 32 bits in an IPv4 address for the network, leaving 8 bits for hosts — which works out to 256 possible addresses (254 usable, since the first and last are reserved).

:::note A quick reference, no math required
- `/24` → 256 addresses (a typical home network)
- `/16` → 65,536 addresses (a mid-size organization)
- `/8` → 16.7 million addresses (a huge, historical allocation)

Smaller number after the slash = bigger network. This trips up almost everyone the first time.
:::

## Why this actually matters for security work

Subnet boundaries are exactly where firewalls, security groups, and access controls typically get applied — you'll see this pattern constantly starting with Path 08's cloud-networking lesson and Path 12's network security material: "allow traffic from this subnet, block traffic from that one." Understanding CIDR notation isn't optional trivia — it's the actual language most firewall rules, cloud security groups, and network diagrams are written in.

Recognizing a CIDR range also tells you something practical during reconnaissance (covered properly in Path 14): a target organization's public IP range, once identified, tells you roughly how large their internet-facing footprint is.

:::challenge Test yourself
A network is described as `10.0.5.0/24`. Roughly how many individual device addresses does this subnet contain, and is that a small network or a large one compared to a `/16`?
<details><summary>Show answer</summary>A `/24` subnet contains 256 total addresses (254 usable for actual devices), which is a fairly small subnet — typical for a single office, floor, or home network. A `/16`, by contrast, contains 65,536 addresses — 256 times larger. This is the counterintuitive part worth remembering: the <em>smaller</em> the number after the slash, the <em>larger</em> the network, because a smaller number means fewer bits are "used up" reserving the network portion, leaving more bits free for individual hosts.</details>
:::

## Key terms

- **Subnet** — a smaller network carved out of a larger address range.
- **CIDR notation** — the `/number` suffix on an IP address indicating how many bits belong to the network portion.
- **Host bits** — the remaining bits in an address, available for individual devices within a subnet.

## Recap

- Subnets divide a large address space into smaller, manageable, individually-controllable networks.
- CIDR notation (`/24`, `/16`, etc.) tells you exactly how large a given subnet is — smaller number after the slash means a bigger network.
- Subnet boundaries are where security controls (firewalls, security groups) typically get applied, making CIDR fluency a genuinely practical skill.

**Next up →** [NAT & Port Forwarding](#/lesson/02-networking/nat-and-port-forwarding)
