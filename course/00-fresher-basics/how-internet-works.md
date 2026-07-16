# How the internet works

The internet feels like magic — you type a few words and a page appears half a world away in under a second. It isn't magic. It's an enormous, extremely well-organized relay race between computers, and once you understand the stages of that race, a huge chunk of "hacker stuff" you'll see later (man-in-the-middle attacks, DNS spoofing, HTTPS, VPNs) stops being mysterious and starts being obvious.

## The journey of a single web request

Say you type `google.com` into your browser. Here's what actually happens, step by step:

```mermaid
sequenceDiagram
    participant You as Your Device
    participant DNS as DNS Server
    participant ISP as Router/ISP
    participant Server as google.com's Server

    You->>DNS: "What's the address for google.com?"
    DNS-->>You: "It's 142.250.80.14"
    You->>ISP: Send request to 142.250.80.14
    ISP->>Server: Forward the request (through many routers)
    Server-->>ISP: Here's the webpage
    ISP-->>You: Deliver the webpage
    You->>You: Browser renders the page
```

1. **DNS lookup** — your device doesn't actually know where "google.com" lives. It asks a **DNS (Domain Name System)** server, which works like a phone book, translating human-friendly names into numeric **IP addresses** (e.g., `142.250.80.14`).
2. **Routing** — your request is broken into small chunks called **packets** and sent out through your router, then through your Internet Service Provider (ISP), then through a chain of other routers across the internet — often a dozen or more "hops" — until it reaches the destination server.
3. **The server responds** — the destination computer (a server, which is just a computer that's always on and waiting for requests) processes your request and sends the webpage back, broken into packets again.
4. **Your browser renders it** — the packets are reassembled, and your browser turns the raw HTML/CSS/JavaScript into the page you see.

All of this — DNS lookup, routing across dozens of hops, reassembly — typically happens in well under a second. That speed is exactly why it feels instantaneous, even though a huge relay of machines was involved.

## IP addresses — every device's "postal address"

Every device connected to the internet has an **IP address**, a unique numeric identifier so other computers know where to send data back to. There are two formats in use today:

- **IPv4** — the older, more familiar format: four numbers separated by dots, e.g. `142.250.80.14`. There are only about 4.3 billion possible IPv4 addresses, and we've essentially run out.
- **IPv6** — the newer format, e.g. `2607:f8b0:4005:80a::200e`, with a vastly larger address space designed to never run out.

### Public vs. private IP addresses, and why your home router matters

Not every device has its own globally unique IP address directly. Inside your home, your phone, laptop, and smart TV each get a **private IP address** (usually something starting with `192.168.` or `10.`) — only meaningful *within* your home network. Your router itself has one **public IP address** that represents your entire household to the rest of the internet, and uses a technique called **NAT (Network Address Translation)** to figure out which of your internal devices each incoming reply is actually meant for.

```mermaid
flowchart LR
    A["Your laptop\n192.168.1.5"] -->|request| R[Your Router\nNAT + one public IP]
    B["Your phone\n192.168.1.8"] -->|request| R
    R -->|appears as ONE\npublic IP address| I[Internet]
```

This matters for security in a genuinely practical way: your home router's NAT accidentally provides a real, useful side benefit — devices behind it generally aren't directly reachable from the open internet unless you (or malware) specifically configure the router to forward a connection through (a technique called **port forwarding**). This is one reason your home network feels a bit "sheltered" compared to a device with a direct public IP address, like a cloud server.

## What a "port" is, briefly

A single IP address can run many different services at once, distinguished by **port numbers** — think of the IP address as a building's street address, and the port number as which specific apartment or office within it. Web traffic conventionally uses port 80 (unencrypted HTTP) or 443 (encrypted HTTPS); email, file transfer, and countless other services each have their own conventional ports. This is only a brief preview here — Path 02 dedicates an entire lesson to ports, since they matter enormously once you start scanning networks and understanding what services are actually exposed on a given machine.

## Why security matters at every step

Every stage of that journey is a potential attack point:

| Stage | What can go wrong |
|---|---|
| **DNS lookup** | An attacker can lie about the answer (**DNS spoofing**), sending you to a fake site that *looks* like the real one. |
| **Routing / the network in between** | An attacker positioned on the network path can read or alter your traffic (**man-in-the-middle attack**) if it isn't encrypted. |
| **The server itself** | If the destination server is compromised or malicious, it can serve you fake content or malware. |
| **Your own device** | Malware already on your machine can intercept requests before they even leave, or after they arrive. |

This is exactly why **HTTPS** (the padlock icon in your browser) exists — it encrypts traffic between you and the server so that even if someone is watching the network in between, they can't read or tamper with it. A **VPN (Virtual Private Network)** adds another layer, encrypting *all* your traffic and routing it through a trusted server, hiding your activity from your ISP and from anyone else on your local network (like on public Wi-Fi). Path 09 of this course covers VPNs in much more depth, including exactly what they do and don't actually protect against.

:::tip
When you type a website address, your browser is silently asking a DNS server for the real numeric address *before* it can send anything — that lookup is invisible to you, but it happens on nearly every request.
:::

:::warn Public Wi-Fi is a shared room, not a private line
On open (password-free) public Wi-Fi, other people on the same network can potentially see unencrypted traffic. HTTPS protects the content of what you send, but a VPN adds extra protection for *which sites* you're even visiting. Never do sensitive logins (banking, work accounts) on open public Wi-Fi without a VPN if you can help it.
:::

## Who actually owns "the internet"?

A genuinely common beginner question: no single company or government owns the internet. It's a decentralized network of networks, held together by voluntary cooperation between ISPs, and by organizations like **ICANN**, which coordinates the domain name system and IP address allocation globally, so that "google.com" reliably means the same thing no matter which country you're browsing from. This decentralization is deliberate — it's part of why the internet is remarkably resilient to any single point of failure, even though it also makes globally coordinated security responses to internet-wide threats genuinely difficult to organize.

## 🧪 Hands-on lab — trace your own request

1. Open a terminal (Windows: Command Prompt or PowerShell; macOS/Linux: Terminal).
2. Run a DNS lookup by hand:
   ```bash
   nslookup google.com
   ```
   You should see an IP address in the response — that's DNS doing its job.
3. Trace the actual path your request takes across the internet:
   ```bash
   # Windows
   tracert google.com

   # macOS / Linux
   traceroute google.com
   ```
4. Count how many "hops" (intermediate routers) your request passes through before reaching Google's servers. It's usually somewhere between 8 and 20 — a genuinely surprising number for something that feels instant.
5. Open your browser, visit any HTTPS website, and click the padlock icon next to the address bar to see the certificate details — this is the proof that your connection to that specific site is encrypted.
6. Find your own device's private IP address (Windows: `ipconfig`; macOS/Linux: `ifconfig` or `ip addr`) and separately search "what is my IP" in a browser to see your router's public IP address — confirm they're genuinely different numbers, directly demonstrating this lesson's NAT discussion.

:::challenge Test yourself
If DNS is just "asking a server for an IP address," why is DNS spoofing (an attacker lying about that answer) such a dangerous attack — even if the real destination server is perfectly secure?
<details><summary>Show answer</summary>Because DNS spoofing happens <em>before</em> you ever reach the real server — if an attacker can trick your device into believing a fake IP address is the correct one for, say, "yourbank.com," your browser will happily connect to the attacker's server instead, which can display a near-perfect copy of the real site to steal your login credentials. The real server being secure is irrelevant if you never actually reach it. This is exactly why HTTPS certificates matter: a fake site can copy the look of a real one, but it generally cannot present a valid certificate for a domain it doesn't own, which is your main defense against this class of attack.</details>
:::

## Key terms

- **DNS (Domain Name System)** — translates domain names into IP addresses.
- **IP address** — a device's unique numeric address on the internet; public (internet-facing) or private (local network only).
- **NAT (Network Address Translation)** — lets many devices share one public IP address via a router.
- **Port** — a number identifying which specific service on a device a connection is meant for.
- **Packet** — a small chunk of data that gets routed across the network.
- **HTTPS** — encrypted web traffic, shown as a padlock icon in the browser.
- **VPN** — encrypts and routes all of your device's traffic through a trusted server.
- **Man-in-the-middle attack** — intercepting or altering traffic between two parties.

## Recap

- Visiting a website involves DNS lookup → routing through many hops → the server responding → your browser rendering the page.
- Every device has an IP address; DNS exists so humans don't have to memorize them. Private IPs (behind your router's NAT) differ from your one public-facing IP.
- Ports let one IP address run many different services at once — covered fully in Path 02.
- Every stage of the journey (DNS, the network path, the server, your own device) is a potential attack point.
- HTTPS encrypts the content of your connection; a VPN adds a further layer of privacy over the network path (Path 09 goes deep on this).
- No single entity owns the internet — it's a decentralized, cooperatively-run network of networks.

???refs
- [How DNS Works (comic)](https://howdns.works/) — a genuinely fun, illustrated explanation of DNS.
- [Cloudflare: What happens when you type a URL into your browser?](https://www.cloudflare.com/learning/dns/what-is-dns/) — a solid, free deep dive.
- [ICANN: What does ICANN do?](https://www.icann.org/resources/pages/what-2012-02-25-en) — a free, official overview of how internet-wide coordination actually works.
???

**Next up →** [Files, folders & organizing yourself](#/lesson/00-fresher-basics/files-folders-you)
