# Network Forensics Basics

The Wireshark lesson taught you to capture and read live traffic. This lesson covers the closely related, genuinely distinct discipline of investigating a captured packet file *after* an incident — reconstructing what actually happened from a saved `.pcap` file, directly building toward Path 16's DFIR material.

## Live analysis vs. forensic analysis

Watching Wireshark's live capture window is genuinely useful for understanding traffic in real time, but a real investigation usually starts differently: given a `.pcap` file captured *before* you were called in — from a compromised firewall, an IDS alert (from the ids-ips-siem lesson), or a network tap that happened to be running — what actually happened during that recorded window?

## Following a TCP stream: reconstructing a full conversation

Wireshark's "Follow TCP Stream" feature reassembles every packet belonging to one specific connection into the actual data exchanged, in order — turning a scattered list of individual packets back into something resembling the original conversation, whether that's an HTTP request/response pair or a plaintext protocol exchange.

## What to actually look for in a forensic capture

- **Unusual destination addresses or ports** — traffic to an unfamiliar external IP, or on a port that doesn't match the expected protocol (HTTP traffic on a non-standard port, for instance), often signals command-and-control activity or data exfiltration
- **DNS queries for suspicious domains** — a burst of DNS lookups for algorithmically-generated-looking domain names is a well-documented pattern associated with malware using **domain generation algorithms (DGAs)** to locate its command-and-control server
- **Large or unusual outbound data transfers** — a sudden spike in outbound traffic volume, especially to an external destination, can indicate data exfiltration in progress
- **Plaintext credentials** — exactly the packet-sniffing risk Path 05 warned about: a capture containing plaintext HTTP Basic Auth headers or unencrypted login form submissions reveals a genuine, immediately actionable finding

## Extracting files from a capture

Network forensics tools (including Wireshark's own "Export Objects" feature) can reconstruct entire files — images, documents, executables — that were transferred as part of the captured traffic, letting an investigator recover exactly what was actually sent across the wire, not just infer it from metadata alone.

## Why timestamps and correlation matter

A single packet capture rarely tells the whole story on its own — correlating capture timestamps against other evidence (the authentication logs from Path 03's logging lesson, the Windows Event Viewer records from Path 07) builds a genuinely complete timeline of an incident, directly connecting network-level evidence to the host-level evidence covered throughout earlier paths.

:::challenge Test yourself
Why might a burst of DNS queries for seemingly random, algorithmically-generated domain names be a stronger indicator of malware activity than a single suspicious-looking query?
<details><summary>Show answer</summary>Malware using a <strong>domain generation algorithm (DGA)</strong> generates many candidate domain names on a schedule, trying each one in turn until it finds one the attacker has actually registered and pointed at their command-and-control infrastructure — this defeats simple blocklisting, since the malware doesn't rely on one single, static, easily-blocked domain. A single unusual DNS query could have a completely innocent explanation (a typo, an unusual but legitimate service), but a rapid burst of many queries for domains that look randomly generated, most of which fail to resolve at all, is a genuinely distinctive pattern that legitimate applications essentially never produce — making it a much stronger, more specific indicator worth investigating than any single query in isolation.</details>
:::

## Key terms

- **Follow TCP Stream** — a Wireshark feature reassembling a connection's packets into the actual data exchanged.
- **Domain Generation Algorithm (DGA)** — a technique malware uses to generate many candidate command-and-control domain names, evading simple blocklisting.

## Recap

- Network forensics investigates a captured packet file after the fact, distinct from live traffic monitoring, and directly sets up Path 16's DFIR material.
- Unusual destinations, DGA-pattern DNS queries, large outbound transfers, and plaintext credentials are the key things to look for in a forensic capture.
- Correlating packet-capture timestamps against host-level logs (authentication logs, Event Viewer records) is what turns isolated network evidence into a genuinely complete incident timeline.

**Next up →** [ARP Spoofing, Hands-On](#/lesson/12-network-security/arp-spoofing-hands-on)
