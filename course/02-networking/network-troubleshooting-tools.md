# Network Troubleshooting Tools

Every concept in this path so far has been explained on paper. This lesson hands you the actual command-line tools for looking at a real network directly — the same small toolkit both network administrators and security practitioners reach for constantly.

## ping: is anything even there?

**`ping`** sends a small test message to a target address and waits for a reply, measuring whether the target is reachable at all and roughly how long the round trip takes.

```
ping 8.8.8.8
```

A successful ping confirms basic connectivity exists; no reply could mean the target is down, unreachable, or — increasingly common — deliberately configured to ignore ping requests as a minor security measure.

## traceroute / tracert: which path did this actually take?

Building directly on the routing-basics lesson's hop-by-hop concept, **`traceroute`** (Linux/Mac) or **`tracert`** (Windows) reveals every router hop between your device and a destination, showing exactly which path your traffic actually travels.

```
traceroute google.com
```

This is genuinely useful for diagnosing where a connection is actually failing or slowing down along a multi-hop path, rather than only knowing the final destination is unreachable without any sense of where along the way the problem lives.

## nslookup / dig: asking DNS directly

Building on the DNS lesson, **`nslookup`** (all platforms) or **`dig`** (Linux/Mac, generally more detailed) lets you directly query DNS and see exactly what a domain name currently resolves to.

```
nslookup example.com
dig example.com
```

This is a genuinely practical way to verify a suspicious redirect or check whether DNS spoofing (from the network-attacks lesson) might be in play — comparing what a domain *should* resolve to against what your specific network is actually returning.

## ipconfig / ifconfig / ip: what does my own network look like?

**`ipconfig`** (Windows) or **`ifconfig`**/**`ip addr`** (Linux/Mac) shows your own device's network configuration — your IP address, default gateway, and more, directly surfacing the concepts from the IP-addresses and routing-basics lessons on your own real machine.

```
ipconfig        (Windows)
ip addr         (modern Linux)
ifconfig        (Mac, older Linux)
```

## netstat: what's actually connected right now?

**`netstat`** shows active network connections on your device — genuinely useful for spotting the kind of unexpected outbound connection Path 07's recognizing-compromise lesson described as a real indicator of malware activity.

```
netstat -an
```

## Putting it together: a realistic troubleshooting sequence

A genuinely common real-world diagnostic sequence, worth internalizing as a pattern rather than memorizing as separate disconnected commands: `ping` to confirm basic reachability → `traceroute` to see where along the path things break down if ping fails → `nslookup`/`dig` to rule out a DNS problem specifically → `ipconfig`/`ifconfig` to confirm your own device's configuration is actually correct in the first place.

:::challenge Test yourself
A user reports "the website won't load." Using this lesson's tools, describe a sensible order to diagnose the problem, and what each step would rule in or out.
<details><summary>Show answer</summary>A sensible sequence: first, run <code>ipconfig</code>/<code>ifconfig</code> to confirm the device itself has a valid IP address and default gateway configured — no point troubleshooting further if the device isn't even properly connected to its own local network. Next, <code>ping</code> the default gateway to confirm basic local network connectivity, then ping a known-reliable external address (like <code>8.8.8.8</code>) to confirm broader internet reachability. If both succeed, run <code>nslookup</code> or <code>dig</code> against the specific website's domain to check whether it resolves to a sensible IP address — a DNS problem specifically would explain "the website won't load" even with otherwise-working internet connectivity. If DNS resolves correctly but the site still won't load, <code>traceroute</code> to that specific IP address can reveal exactly where along the path the connection is actually failing.</details>
:::

## Key terms

- **ping** — tests basic reachability and round-trip time to a target address.
- **traceroute/tracert** — reveals every router hop between your device and a destination.
- **nslookup/dig** — directly queries DNS to see what a domain currently resolves to.

## Recap

- `ping`, `traceroute`, `nslookup`/`dig`, `ipconfig`/`ifconfig`, and `netstat` form a small, genuinely practical toolkit for diagnosing real network problems.
- Each tool maps directly onto a concept already covered in this path — routing, DNS, IP addressing — turning abstract knowledge into something you can actually check on a real network.
- A sensible troubleshooting sequence moves from "is my own device configured correctly" outward to "is the specific destination reachable," rather than guessing randomly.

**Next up →** [DNS Lab](#/lesson/02-networking/dns-lab)
