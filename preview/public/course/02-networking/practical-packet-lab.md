# Practical Packet Analysis Intro

Everything you've learned so far in this path — IP addresses, ports, TCP/UDP, DNS — has been conceptual. This lab makes it real: you'll capture actual packets flowing across your own network and see these concepts in raw form, setting up the deeper packet analysis work in Path 12.

## Simple exercise

1. **Install Wireshark** ([wireshark.org](https://www.wireshark.org/), free) — the industry-standard packet capture and analysis tool, or use an online packet capture simulator if you'd rather not install anything yet.
2. **Start a capture, then visit a website.** Select your active network interface (usually the one showing traffic activity) and start capturing, then open a browser and visit any HTTP (not HTTPS) test site — [http://neverssl.com](http://neverssl.com) exists specifically for this purpose: a real site guaranteed to stay unencrypted for testing and demonstration.
3. **Find the HTTP request and response.** In Wireshark's filter bar, type `http` and press Enter — this narrows thousands of captured packets down to just the HTTP traffic. Click on a `GET` request packet and expand the "Hypertext Transfer Protocol" section to see the raw request exactly as your browser sent it.
4. **Identify source and destination.** For that same packet, look at the IP layer — you'll see your own device's IP as the source and the web server's IP as the destination, plus the source port (usually a random high number, assigned dynamically) and destination port (80 for HTTP).

## What to look for

- **The TCP handshake.** Filter by `tcp.flags.syn==1` to find the very first packet of a connection — you should see a `SYN`, followed shortly by a `SYN, ACK` from the server, followed by your device's final `ACK`. This three-step exchange, referenced in Path 02's TCP vs UDP lesson, is now something you can point to directly in real captured traffic.
- **DNS queries.** Filter by `dns` — you'll see the actual lookup that happened before your browser could even connect, translating the domain name into the IP address used in every subsequent packet.
- **Cleartext data.** On the unencrypted HTTP site from Task 2, right-click the HTTP packet stream and choose "Follow → TCP Stream" — you'll see the entire request and response in plain readable text, including any form data submitted. This is exactly why HTTPS exists: on an encrypted connection, this same view would show only unreadable ciphertext.

5. **Filter by IP and port together.** Try a combined filter like `ip.addr == 8.8.8.8 && udp.port == 53` — narrowing a capture to a specific conversation is exactly how you'd isolate one interesting exchange out of thousands of packets in a real investigation (Path 16's DFIR lab does exactly this at a larger scale).
6. **Check packet sizes against this path's MTU discussion.** In Wireshark's packet list, look at the "Length" column for a few packets carrying a large file download — most should sit right around 1500 bytes or just under, directly matching standard Ethernet's MTU from this path's packets lesson. This is real, observable evidence of fragmentation limits at work, not just a stated fact to memorize.

:::tip Try the same exercise against an HTTPS site
Repeat the capture against any normal HTTPS website and try the same "Follow TCP Stream" trick — you'll see the TCP handshake and the TLS handshake, but the actual HTTP request/response content will be encrypted and unreadable, a very concrete demonstration of what the padlock icon actually protects.
:::

:::challenge Label 10 packets
Capture a fresh session while browsing normally for about 30 seconds, then pick any 10 consecutive packets and label what each one is doing in your own words (e.g., "DNS query for example.com," "TCP SYN starting a new connection," "HTTP GET request for /style.css"). This exercise — translating raw packets into plain-English narrative — is exactly the skill Path 12's Wireshark labs build on.
:::

## Key takeaway

Every concept from this path so far (IPs, ports, TCP handshakes, DNS) is directly observable in a Wireshark capture — network security work is fundamentally about being comfortable reading this raw view instead of only trusting what applications show you on the surface.

**Next up →** [Path 03 — Operating Systems & Linux](#/lesson/03-linux)
