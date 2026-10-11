# Common Network Attacks: An Overview

You now understand how networks are actually built — routers, switches, VLANs, firewalls, DNS, HTTP. This lesson is a map of what goes wrong: the network-layer attack categories worth recognizing by name before Path 12 goes deep on each one hands-on.

:::tip
Just like Path 01's cyberattacks-overview lesson mapped attack types broadly before later paths went deep, this lesson does the same specifically for network-layer attacks — recognition now, hands-on depth later.
:::

## ARP spoofing: lying about who you are on the local network

**ARP (Address Resolution Protocol)** is how devices on the same local network find each other's physical (MAC) addresses. **ARP spoofing** exploits ARP's lack of built-in verification — an attacker on the same local network can send fake ARP messages claiming to be a different device (often the default gateway from the routing-basics lesson), tricking other devices into sending their traffic through the attacker instead, a classic **man-in-the-middle** setup.

## DNS spoofing / cache poisoning

The DNS lesson explains how domain names become IP addresses. **DNS spoofing** feeds a device or DNS server false information, causing a legitimate domain name to resolve to an attacker-controlled IP address instead of the real one — potentially redirecting a victim to a convincing fake login page without them ever noticing the URL bar showing anything wrong, since the domain name itself looks completely correct.

## SYN floods and other DDoS techniques

The tcp-vs-udp lesson covered the TCP handshake. A **SYN flood** abuses that handshake directly — sending a huge volume of connection-initiation requests without ever completing them, exhausting a server's ability to track pending connections and denying service to legitimate users. This is one specific technique within the broader **DDoS (Distributed Denial of Service)** category Path 01 introduced, and Path 12 covers in much greater depth.

## Packet sniffing

**Packet sniffing** is passively capturing and reading network traffic — trivial on an unencrypted network (the open-Wi-Fi risk from the wireless-networking lesson), and one of the exact reasons HTTPS (Path 06) matters as much as it does. The practical-packet-lab later in this path gives you hands-on experience with the legitimate, defensive side of this same technique.

## VLAN hopping and evil twin attacks, briefly revisited

Both already covered by name in earlier lessons in this path — worth remembering they belong to this same broad "network-layer attack" category, alongside everything else in this lesson.

## Why understanding the network layer specifically matters

Many of these attacks succeed precisely because foundational network protocols (ARP, DNS, early TCP/IP design) were built in eras that assumed a smaller, more trusting internet, without built-in authentication or verification. Nearly every defense against them — VLANs limiting ARP spoofing's reach, DNSSEC (a DNS security extension) protecting against spoofing, HTTPS protecting against packet sniffing — is a layer added *on top of* protocols that weren't originally designed with today's adversarial internet in mind.

:::challenge Test yourself
Why can ARP spoofing succeed against devices on the same local network, when those same devices might be well-protected against attacks originating from the internet?
<details><summary>Show answer</summary>ARP was designed decades ago for local networks where every device was generally assumed to be trustworthy, with no built-in mechanism to verify that an ARP message claiming to be from a specific device is actually legitimate. A perimeter firewall (from the firewalls lesson) protects against threats arriving from the internet, but it has no visibility into or control over ARP traffic happening entirely within the local network itself — an attacker who's already gained a foothold on the local network (through a compromised device, a malicious guest on an open Wi-Fi network) can exploit this trust gap regardless of how well-defended the network's internet-facing perimeter is. This is exactly why VLANs, which limit how far a local network's trust actually extends, are such a meaningful defense against this specific category of attack.</details>
:::

## Key terms

- **ARP spoofing** — sending forged ARP messages to intercept local network traffic.
- **DNS spoofing** — providing false DNS responses to redirect traffic to an attacker-controlled destination.
- **SYN flood** — a DDoS technique exhausting a server's connection-tracking capacity via incomplete TCP handshakes.

## Recap

- This lesson is a map, not a deep dive — full hands-on technique lives in Path 12.
- ARP spoofing, DNS spoofing, SYN floods, and packet sniffing all exploit foundational protocols that weren't originally designed with a fully adversarial internet in mind.
- Nearly every real defense against these attacks is a layer added on top of the original protocol — VLANs, DNSSEC, HTTPS — rather than a fix to the underlying protocol itself.

**Next up →** [Network Troubleshooting Tools](#/lesson/02-networking/network-troubleshooting-tools)
