# DDoS Attacks & Mitigation

The Mirai case study in the Bluetooth/IoT lesson referenced DDoS attacks without fully explaining the mechanics. This lesson covers exactly how they work, and the layered mitigation strategies real infrastructure uses to withstand them — a direct availability attack against the third leg of Path 01's CIA triad.

## DoS vs. DDoS: a quick distinction

A **DoS (Denial of Service)** attack comes from a single source, attempting to overwhelm a target's capacity to serve legitimate users. A **DDoS (Distributed Denial of Service)** attack does the same thing from many sources simultaneously — often a botnet of compromised devices (exactly the Mirai pattern from the previous lesson) — making it both more powerful and considerably harder to block by simply filtering one attacking IP address.

## Volumetric attacks: overwhelming bandwidth

The simplest category — flooding a target with so much raw traffic volume that its network connection itself becomes saturated, with no capacity left for legitimate requests to get through at all. **Amplification attacks** make this dramatically more efficient: an attacker sends a small request to a third-party server (DNS, NTP) with a spoofed source address matching the victim, and the server's much larger response gets sent directly to the victim — turning a small amount of attacker-generated traffic into a much larger flood.

## Protocol attacks: exploiting connection-handling logic

Path 02's common-network-attacks-overview lesson already introduced the **SYN flood** — exhausting a server's capacity to track pending TCP connections (Path 02's tcp-vs-udp lesson) by initiating many handshakes that never complete, rather than overwhelming raw bandwidth.

## Application-layer attacks: mimicking legitimate traffic

The hardest category to defend against: requests that look completely legitimate individually — a normal-looking HTTP request to a search feature, a normal-looking login attempt — sent in overwhelming volume, exploiting the fact that some legitimate operations are inherently more expensive to process server-side than others (a complex database search versus a static file request).

## Mitigation strategies, layered

- **Over-provisioning and traffic scrubbing** — major CDN and DDoS-protection providers (Cloudflare, AWS Shield) absorb volumetric attacks across globally distributed infrastructure with far more capacity than any single target could reasonably maintain on its own, directly extending Path 05's CDN-caching concepts to a defensive role
- **Rate limiting** — directly connecting to Path 21's rate-limit-bypass lab: limiting how many requests a single source can make in a given window, meaningfully reducing (though rarely eliminating on its own) an application-layer attack's effectiveness
- **Anycast routing** — distributing a single IP address across many physical locations, so attack traffic gets automatically spread across multiple data centers rather than concentrated against one
- **Behavioral analysis** — distinguishing legitimate traffic patterns from attack traffic even when individual requests look valid, directly connecting to Path 24's UEBA/analytics-monitoring lesson's baseline-deviation approach

:::challenge Test yourself
Why are application-layer DDoS attacks generally considered harder to defend against than volumetric attacks, despite typically involving much lower total traffic volume?
<details><summary>Show answer</summary>A volumetric attack is relatively straightforward to identify — an overwhelming flood of traffic, often from recognizable patterns or sources, that scrubbing infrastructure and over-provisioned bandwidth can absorb or filter based on sheer volume and pattern recognition. An application-layer attack, by contrast, consists of requests that are individually indistinguishable from genuine legitimate traffic — the same HTTP methods, the same expected headers, the same apparent user behavior — meaning simple volume-based or pattern-based filtering can't reliably tell attack traffic apart from real users without risking blocking legitimate requests too. Effective defense requires genuine behavioral analysis (recognizing anomalous patterns in otherwise-legitimate-looking traffic) rather than just absorbing or filtering raw volume, which is a fundamentally harder problem — exactly why this category is specifically called out as the hardest to defend against in this lesson.</details>
:::

## Key terms

- **Amplification attack** — using a spoofed source address to trick a third-party server into sending a large response directly to a victim, multiplying attack traffic volume.
- **Anycast routing** — distributing a single IP address across many physical locations, spreading attack traffic automatically.

## Recap

- Volumetric, protocol, and application-layer attacks represent three distinct DDoS categories, each requiring a different defensive approach.
- Amplification attacks turn small attacker-generated traffic into much larger floods by exploiting third-party servers with spoofed source addresses.
- Application-layer attacks are the hardest to defend against, since individual requests look legitimate — genuine behavioral analysis, not just volume filtering, is required to distinguish them from real traffic.

**Next up →** [Cloud Network Security](#/lesson/12-network-security/cloud-network-security)
