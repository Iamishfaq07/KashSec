# IP addresses

A letter needs an address. On a network, that address is the **IP address**. Almost everything in hacking starts with finding the right address to look at — so this concept is foundational.

## What an IP address looks like

Every device on a network gets an **IP address** (IP = "Internet Protocol") so the network knows where to deliver its letters. The common kind looks like four numbers separated by dots:

```
192.168.1.20
```

Each number ranges from **0 to 255**, so addresses run from `0.0.0.0` to `255.255.255.255`. That's about four billion possibilities — sounds huge, but the world actually ran out, which is why a newer, much larger system called **IPv6** exists. Those addresses are longer, full of letters and colons like `2001:db8::1`.

For learning, the four-number style (called **IPv4**) is all you need.

:::note IPV4 VS IPV6
Both are in active use — most home networks still use IPv4 internally. If you see an address with colons like `fe80::1`, that's IPv6. You'll meet it more as you progress.
:::

## Private vs public — the building analogy

This trips up many beginners, so let's nail it with an apartment-building analogy.

~~~svg Private and public IP addresses
<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">
  <g font-size="12">
    <!-- Building -->
    <rect x="40" y="60" width="240" height="220" rx="8" fill="#111927" stroke="#EFA43A" stroke-width="2"/>
    <text x="160" y="45" text-anchor="middle" fill="#EFA43A" font-weight="700">Your home</text>
    <!-- Flats -->
    <rect x="60" y="80" width="90" height="45" rx="4" fill="#152131" stroke="#3FB6A8"/>
    <text x="105" y="98" text-anchor="middle" font-size="18">📱</text>
    <text x="105" y="118" text-anchor="middle" fill="#3FB6A8" font-size="10">192.168.1.20</text>
    <rect x="170" y="80" width="90" height="45" rx="4" fill="#152131" stroke="#3FB6A8"/>
    <text x="215" y="98" text-anchor="middle" font-size="18">💻</text>
    <text x="215" y="118" text-anchor="middle" fill="#3FB6A8" font-size="10">192.168.1.21</text>
    <rect x="60" y="140" width="90" height="45" rx="4" fill="#152131" stroke="#3FB6A8"/>
    <text x="105" y="158" text-anchor="middle" font-size="18">📺</text>
    <text x="105" y="178" text-anchor="middle" fill="#3FB6A8" font-size="10">192.168.1.22</text>
    <rect x="170" y="140" width="90" height="45" rx="4" fill="#152131" stroke="#3FB6A8"/>
    <text x="215" y="158" text-anchor="middle" font-size="18">🖨</text>
    <text x="215" y="178" text-anchor="middle" fill="#3FB6A8" font-size="10">192.168.1.23</text>
    <text x="160" y="212" text-anchor="middle" fill="#8496A6" font-size="10">Private IPs (flat numbers)</text>
    <!-- Router -->
    <rect x="115" y="230" width="90" height="40" rx="4" fill="#2b1f0a" stroke="#EFA43A"/>
    <text x="160" y="255" text-anchor="middle" font-size="18">📮</text>
    <!-- Arrow to internet -->
    <line x1="285" y1="170" x2="360" y2="170" stroke="#E9EEF3" stroke-width="1.5" marker-end="url(#a2)"/>
    <defs><marker id="a2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#E9EEF3"/></marker></defs>
    <text x="322" y="160" text-anchor="middle" fill="#8496A6" font-size="10">Router</text>
    <text x="322" y="185" text-anchor="middle" fill="#8496A6" font-size="10">translates</text>
    <!-- Internet cloud -->
    <ellipse cx="500" cy="170" rx="130" ry="80" fill="#111927" stroke="#E05548" stroke-width="2"/>
    <text x="500" y="130" text-anchor="middle" fill="#E05548" font-weight="700" font-size="13">🌐 The Internet</text>
    <text x="500" y="165" text-anchor="middle" fill="#E9EEF3" font-size="14" font-weight="600">203.0.113.42</text>
    <text x="500" y="185" text-anchor="middle" fill="#8496A6" font-size="10">Public IP (street address)</text>
    <text x="500" y="205" text-anchor="middle" fill="#8496A6" font-size="10">One address for the whole home</text>
  </g>
</svg>
~~~

Imagine a large apartment building on a street:

- **Private IP** — your **flat number inside the building**. It only makes sense *inside* your home network. Your phone might be `192.168.1.20`, your laptop `192.168.1.21`. These same numbers are reused in millions of homes because they never leave the building.
- **Public IP** — the **building's street address** that the postal service uses. The whole internet sees this single address for your entire home. Your router holds the public IP and cleverly sorts incoming mail to the right flat inside using a process called **NAT** (Network Address Translation).

### The private IP ranges

There are three "private" address ranges you'll see everywhere:

| Range | Common use |
|---|---|
| `10.0.0.0` – `10.255.255.255` | Big companies |
| `172.16.0.0` – `172.31.255.255` | Medium networks |
| `192.168.0.0` – `192.168.255.255` | Home networks (very common) |

## Subnet masks and CIDR notation — describing a range of addresses

You'll constantly see addresses written like `192.168.1.0/24` throughout later paths (Path 08's Nmap lessons, Path 19's cloud networking lesson) — that `/24` is **CIDR notation**, and it's worth understanding now rather than treating it as magic later. It describes how many addresses belong to one network: `/24` means the first 24 bits (the first three of the four numbers) identify the network, leaving the last 8 bits free to number individual devices — giving you `192.168.1.0` through `192.168.1.255`, 256 addresses total. A smaller number after the slash means a *larger* range of addresses (`/16` covers 65,536 addresses), which can feel backwards at first but becomes intuitive with practice. This notation is exactly how a penetration test's scope document (Path 09) specifies which entire ranges of addresses are authorized for testing, rather than listing every individual IP by hand.

## Static vs. dynamic IPs — and DHCP

Most devices on a home network don't have a permanently fixed private IP — instead, your router runs a service called **DHCP (Dynamic Host Configuration Protocol)**, automatically assigning each device an available address from its private range whenever it joins the network. This is called a **dynamic IP**, and it can change over time (e.g., after your device reconnects). A **static IP** is manually configured to never change — commonly used for servers, printers, or anything else that other devices need to reliably find at the same address every time. Understanding this distinction matters directly for Path 08's network scanning material: a device you scanned yesterday at `192.168.1.20` might genuinely be a different physical device today if it's using a dynamic IP and simply reconnected.

## Special addresses worth knowing

- `127.0.0.1` — called **localhost** or the **loopback** address. It always means "this very computer." When you build something and test it "on localhost," you're talking to your own machine.
- Addresses ending in `.255` are often **broadcast** addresses (a message to everyone on the local network).
- `0.0.0.0` can mean "all addresses" in some settings.

:::tip LOCALHOST IS YOUR FRIEND
When you install a web server and visit `http://127.0.0.1` or `http://localhost`, you're testing your own machine. That's how you develop and test safely without touching the internet.
:::

## Try it yourself

You can view your device's IP with a single command:

```bash
# Linux or Mac — open a terminal:
ip a

# An older command that also works:
ifconfig

# Windows — open Command Prompt:
ipconfig
```

## 🧪 Lab — Find your addresses

1. Open a terminal (Linux/Mac) or Command Prompt (Windows).
2. Run `ip a` (or `ipconfig` on Windows) and press Enter.
3. The output looks busy — that's normal. Find a line with a number like `192.168.x.x` or `10.x.x.x`. **That's your device's private IP.**
4. Now open a browser and search **"what is my IP"**. The number shown is your **public IP** — the street address the internet sees for your whole home.
5. Notice that ten devices in your home might have ten *private* IPs but only one *public* IP.

## Why attackers care about IPs

To attack or scan a machine, you first need its address — just as a burglar needs to know which house. A huge part of hacking (which you'll learn in the recon lessons) is simply *finding* the right addresses to look at.

- **On a pentest:** you receive a list of IP ranges as your scope.
- **In bug bounty:** you resolve subdomains to IPs and enumerate what's exposed.
- **In defence:** you monitor which IPs your systems talk to — outbound connections to unusual addresses are red flags.

:::challenge Test yourself
Which IP address always means "this very computer I'm sitting at"?

<details><summary>Show answer</summary><code>127.0.0.1</code> — known as localhost or the loopback address.</details>
:::

## Key terms

- **IP address** — a device's address on a network.
- **IPv4 / IPv6** — the older 4-number system and the newer larger one.
- **Private IP** — works only inside your local network (like a flat number).
- **Public IP** — the single address the internet sees for your home.
- **localhost / 127.0.0.1** — "this computer."
- **NAT** — how your router maps between private and public addresses.

## Recap

- IPv4 addresses are four numbers 0–255 separated by dots.
- Private IPs work only inside your home; public IPs face the internet.
- `127.0.0.1` (localhost) always means your own machine.
- NAT lets many devices behind one public IP.

???refs
- [What is an IP address? — Cloudflare](https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/) — clean beginner explanation.
- [IPv4 vs IPv6 — Comparitech](https://www.comparitech.com/net-admin/ipv4-vs-ipv6/) — the differences and why we're moving.
- [Private IP address ranges — Wikipedia (RFC 1918)](https://en.wikipedia.org/wiki/Private_network) — the standards.
- [whatismyipaddress.com](https://whatismyipaddress.com/) — quick public IP + location lookup.
???

**Next up →** [Ports: the doors of a computer](#/lesson/02-networking/ports)
