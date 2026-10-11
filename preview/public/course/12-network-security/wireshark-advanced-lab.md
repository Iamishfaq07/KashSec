# Advanced Wireshark Lab

Path 02 introduced packet capture at a basic level. This lab, the capstone of Path 12, goes deeper — reconstructing full conversations, extracting files from traffic, and analyzing a capture the way real incident responders and network defenders actually work.

## Lab tasks

1. **Capture traffic during a login and hunt for credentials.** On an intentionally unencrypted test site or lab app (never a real site you don't own — this only works meaningfully against plaintext HTTP anyway), capture while logging in, then filter with `http.request.method == "POST"` and inspect the request body for the submitted credentials in plain text. This is the single most visceral demonstration of why HTTPS exists.
2. **Follow TCP streams to reconstruct a full conversation.** Right-click any packet in a conversation and choose **Follow → TCP Stream** — Wireshark reassembles every fragment of that conversation into one readable view, showing both directions (client requests in one color, server responses in another). This is dramatically faster than manually piecing together dozens of individual packets.
3. **Use display filters effectively.** Beyond the basics, practice combining filters:
   ```
   http and ip.addr == 192.168.1.50
   tcp.flags.syn == 1 and tcp.flags.ack == 0    # only initial SYN packets, no handshake noise
   dns.qry.name contains "example"
   ```
   Efficient filtering is what separates someone who can technically use Wireshark from someone who can actually find what they need in a capture with thousands of packets.
4. **Export objects from a capture.** Under **File → Export Objects → HTTP**, Wireshark can extract every file (image, document, executable) transferred in plain HTTP traffic directly from the capture — genuinely useful both offensively (recovering files from intercepted traffic in an authorized test) and defensively (extracting a suspicious downloaded file for malware analysis, tying directly into Path 16's malware analysis lab).
5. **Analyze a provided capture for anomalies.** Several free sample `.pcap` files exist specifically for training (search "malware traffic analysis pcap" for legitimate, widely used training captures from security research sites). Load one and hunt for anything unusual: unexpected destination ports, repeated connections to the same external IP at regular intervals (a classic beaconing pattern for command-and-control malware), or DNS queries to unusual-looking domains.

6. **Apply a capture filter, then compare to filtering after the fact.** Start a fresh capture with a capture filter set to `port 443` (Capture → Options → Capture filter), generate a mix of HTTP and HTTPS traffic, then stop and confirm only port 443 traffic was ever recorded at all — no amount of display filtering afterward can bring back the HTTP packets that were never captured in the first place. Compare this to capturing everything with no capture filter and using a display filter instead; note how the second approach preserves your ability to change your mind about what to look at, at the cost of a larger capture file.

:::tip Statistics menu is underused by beginners
Wireshark's **Statistics → Conversations** and **Statistics → Protocol Hierarchy** menus give you an instant high-level summary of an entire capture — which hosts talked to which, how much traffic each protocol represents — genuinely useful for quickly orienting yourself in a large, unfamiliar capture before diving into individual packets.
:::

:::challenge Identify 3 interesting findings
Using a sample capture (your own from Task 1/5, or a public training `.pcap`), identify and explain at least 3 interesting things you find — this could be plaintext credentials, an unusual destination, a suspicious repeated connection pattern, or an extracted file. For each, explain in plain language what it means and why it matters.
:::

## Key takeaway

Wireshark's TCP stream reconstruction and object export turn raw packet noise into readable conversations and recoverable files — this is precisely the capability that makes packet capture such a powerful tool for both attackers (intercepting unencrypted data) and defenders (spotting malicious traffic patterns), which is exactly why HTTPS and encrypted protocols generally matter so much.

**Explore more →** [Path 14 — Ethical Hacking](#/lesson/14-ethical-hacking)
