# Path 08 — Network Security

> **Level:** Intermediate · **Lessons:** 8 · **Assumed knowledge:** Paths 01–07 (especially networking from Path 02).

You've spent a lot of time inside browsers and web apps. Now we go one layer down and look at the *network itself* — the wire and the air over which everything travels. This is the pentester's classic playground and the defender's daily view. You'll learn to **map** networks with Nmap, **see** packets flow with Wireshark, understand the **firewalls, VPNs, and IDS/IPS** that guard modern networks, and get a serious respect for **Wi-Fi security**. Every hands-on activity uses your own lab, the legal `scanme.nmap.org` target, or your own network — the golden rule still applies.

---

## Lesson 8.1 — Why network security matters

### Why this matters
Every attack you've seen crosses a network. If you can *see* and *shape* the traffic, you understand what's really happening. This is also where a huge chunk of blue-team (defensive) work lives — SOC analysts practically breathe network data.

### The three network security worlds
Network security work splits roughly into three activities:

- **Mapping** — finding what's on a network and what's exposed. What machines, what ports, what services. Nmap lives here.
- **Watching** — observing traffic flowing between machines to understand behaviour, spot attacks, and prove impact. Wireshark and tcpdump live here.
- **Filtering / protecting** — deciding what traffic is allowed and blocking or hiding the rest. Firewalls, VPNs, IDS/IPS live here.

Almost every network security job blends these three in different proportions. A pentester emphasises mapping; a SOC analyst emphasises watching; a network engineer emphasises filtering.

### A first vocabulary sweep
Names you'll meet in this path:

- **Firewall** — the guard at the door filtering allowed traffic.
- **IDS / IPS** — Intrusion Detection / Prevention System. Watches traffic and either alerts (IDS) or blocks (IPS) suspicious activity.
- **VPN** — Virtual Private Network. An encrypted tunnel for your traffic.
- **Proxy** — a middleman that traffic passes through (you already know a proxy: Burp Suite is one).
- **SIEM** — Security Information & Event Management. The system that collects logs and alerts from everywhere so SOC analysts can spot attacks.
- **NAC** — Network Access Control. Rules controlling which devices can join a network.

Don't memorise these — meet them, and they'll stick as we go.

### 🚩 Challenge
What does IDS stand for and how does it differ from IPS?

<details><summary>Answer</summary>IDS = Intrusion Detection System (it alerts). IPS = Intrusion Prevention System (it blocks).</details>

### Recap
- Network security work is mapping + watching + filtering.
- Every attack crosses a network, so this layer is central to both offence and defence.
- Firewalls, IDS/IPS, VPNs, proxies, SIEM, and NAC are common tools you'll keep meeting.

---

## Lesson 8.2 — Scan a network with Nmap

### Why this matters
**Nmap** is the world's most famous scanner. Almost every pentest, CTF, and lab starts with an Nmap scan. It answers the first questions of any engagement: *what's out there, and what doors are open?*

### Setup: a legal target you can use freely
The makers of Nmap run a machine at `scanme.nmap.org` **specifically so people can learn**. You can scan it as much as you like — just don't hammer it. For the labs below, we'll use it and your own private network (never anyone else's).

Install (already on Kali):
```bash
nmap --version
```

### Your first scan
```bash
nmap scanme.nmap.org
```

Nmap reports which ports are open, closed, or filtered. Read the output — it's structured and friendly once you know what to look for:

```
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
9929/tcp open  nping-echo
```

Three open ports, each with a service name. Instantly you know: this box takes SSH (port 22), serves a website (80), and runs Nmap's own service (9929). That's a full "which doors are open" picture.

### The most useful flags
- `-sV` — **detect versions.** Not just "http is open" but "Apache 2.4.29 is open." Huge for finding known CVEs.
  ```bash
  nmap -sV scanme.nmap.org
  ```
- `-sC` — run **default scripts** (safe checks). Combined with `-sV` this is the everyday scan:
  ```bash
  nmap -sC -sV scanme.nmap.org
  ```
- `-p` — specify ports:
  ```bash
  nmap -p 22,80,443 scanme.nmap.org      # only these
  nmap -p- scanme.nmap.org               # ALL 65,535 ports (slower but thorough)
  nmap --top-ports 100 scanme.nmap.org   # the 100 most common
  ```
- `-T4` — timing (0 slow-and-stealthy to 5 aggressive). `T4` is a good default for lab work.
- `-sn` — **ping sweep**, no port scan. "Who's alive on this /24?"
  ```bash
  nmap -sn 192.168.1.0/24
  ```
- `-O` — try to guess the OS (needs root, less reliable).
- `-oN result.txt` — save output to a file (there are also `-oX` for XML and `-oA` for all formats).

### The Nmap Scripting Engine (NSE)
Nmap ships with hundreds of small scripts for specific checks. `-sC` runs the safe defaults; you can also target specific scripts:
```bash
nmap --script http-title,http-headers -p 80 scanme.nmap.org
nmap --script vuln scanme.nmap.org   # try to detect known vulnerabilities
```

Explore the scripts in `/usr/share/nmap/scripts/`. Every category (`auth`, `discovery`, `vuln`) is worth browsing when you have a target.

### 🧪 Lab — Real scans
1. Run `nmap scanme.nmap.org` and note the open ports.
2. Run `nmap -sV -sC scanme.nmap.org` — see the extra info from version detection and default scripts.
3. On **your own** private network, run `nmap -sn 192.168.1.0/24` (adjust to your range) and see which devices are alive. Every phone, TV, and laptop shows up.
4. On the same private network, pick a device you own and run `nmap -sV 192.168.1.42`. Learn what your own devices expose.
5. Save an output: `nmap -sV -oN scan.txt scanme.nmap.org`, then `cat scan.txt`.

> ⚠️ **Legal reminder.** `scanme.nmap.org` and your *own* devices are the only places to freely scan. Scanning someone else's network without permission is illegal, however curious you are.

### 🚩 Challenge
Which single Nmap flag combination gives you both version detection *and* the default safe scripts?

<details><summary>Answer</summary>-sV -sC (or the shortcut -A, which also includes OS detection and traceroute).</details>

### Key terms
- **Nmap** — the scanner; comes with Kali.
- **-sV / -sC / -p / -T** — versions / default scripts / ports / speed.
- **NSE** — Nmap Scripting Engine, hundreds of check scripts.
- **`scanme.nmap.org`** — the legal practice target.

### Recap
- Nmap finds open ports and services — the first question of every engagement.
- `-sV -sC` is the everyday combo; `-p-` scans all 65,535 ports.
- NSE scripts do targeted checks, including basic vuln detection.
- Practise on `scanme.nmap.org` and your own network only.

---

## Lesson 8.3 — See traffic with Wireshark & tcpdump

### Why this matters
The first time you *see* real packets flow with your own eyes, networking stops being an abstraction. **Wireshark** is the gold-standard packet analyser and a joy to use. `tcpdump` is its terminal cousin — indispensable on servers with no GUI.

### The idea
Both tools **capture packets** flying across a network interface (your Wi-Fi card, wired connection, or a virtual adapter) and let you *read* them — headers, payloads, everything HTTPS hasn't encrypted. This is how you understand what an app is really doing, spot attacks, and confirm findings.

### Wireshark: the friendly GUI
Kali has Wireshark installed. Open it, and you'll see a list of network interfaces to capture on.

**Your first capture:**
1. Open Wireshark.
2. Double-click your active interface (usually `eth0` or `wlan0`).
3. Open a browser and visit `http://example.com` (plain HTTP for readability).
4. Come back to Wireshark and stop the capture.
5. In the filter bar, type `http` and press Enter. You now see only HTTP traffic — including your request and the server's response, in plain text.

**Reading a packet.** Click any packet; the middle pane expands each protocol layer (Ethernet → IP → TCP → HTTP), and the bottom pane shows the raw bytes. This is Path 02's "encapsulation" idea made real.

### Filters — the real power
Wireshark shows *everything* by default. Filters cut it down to what you care about:

```
http                                 # only HTTP
dns                                  # only DNS queries and answers
tcp.port == 80                       # traffic on port 80
ip.addr == 192.168.1.42              # traffic to or from this IP
http.request.method == "POST"        # only POST requests
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN packets (scan indicators)
```

### tcpdump: the terminal version
Wireshark isn't always available (SSH-only servers, CTFs). Learn `tcpdump` too — it's built into virtually every Linux system.

```bash
sudo tcpdump -i any -n port 80          # HTTP traffic on any interface
sudo tcpdump -i eth0 -w capture.pcap    # save to a file for later
tcpdump -r capture.pcap                 # read a saved capture
```

The `.pcap` file `tcpdump` writes can be opened directly in Wireshark, so you often capture with `tcpdump` on a server and *analyse* with Wireshark on your laptop.

### 🧪 Lab — Watch a login (safely!)
1. In Wireshark, start a capture on your active interface.
2. In a browser, log into a **plain HTTP** test site (find one deliberately for practice — never a real account). PortSwigger's Web Academy has plain-HTTP labs perfect for this.
3. Stop the capture, filter `http.request.method == "POST"`, and look at the login POST — you'll *see* the credentials in the packet. This is exactly why HTTPS exists.
4. Now do the same on an HTTPS site. The traffic is there but the contents are gibberish — the encryption doing its job.

### The security tie-ins
- **Defence.** Wireshark captures are how you *prove* an incident. Was this request malicious? Did data leave? A capture is the evidence.
- **Learning.** Every protocol you meet becomes real when you see actual bytes of it.
- **CTFs.** Many CTF challenges hand you a `.pcap` and ask you to find a flag hidden in the traffic.

> 💡 Get comfortable with the phrase **"packet capture"** (or **pcap**) — it's the shared currency of network security work.

### 🚩 Challenge
On a busy interface Wireshark shows thousands of packets. Which filter shows *only* DNS traffic?

<details><summary>Answer</summary>dns</details>

### Key terms
- **Wireshark / tcpdump** — GUI and terminal packet analysers.
- **Capture / pcap** — the recorded traffic.
- **Filter** — narrows what you see (`http`, `dns`, `tcp.port == 80`).

### Recap
- Wireshark and tcpdump capture and display packets — networking made visible.
- Filters (`http`, `dns`, `ip.addr==`, `tcp.port==`) turn a firehose into signal.
- Plain HTTP shows credentials in packets; HTTPS scrambles them. That's *why* HTTPS.
- `.pcap` files are the evidence and currency of incident work.

---

## Lesson 8.4 — Firewalls, VPNs & proxies

### Why this matters
These three defences are everywhere. Understanding what each does — and doesn't do — separates strong security thinking from vague waves at "protection."

### Firewalls: filtering the door
A **firewall** is a set of rules that decides which traffic is allowed in or out of a network, based on things like source and destination IP, ports, and protocol. It's the guard at the door with a clipboard.

Types:
- **Packet-filtering firewall** — the simplest. Allow or block based on IP/port. Fast; blind to what's actually inside the traffic.
- **Stateful firewall** — remembers connections. Knows the difference between "a reply to your outgoing request" and "an unsolicited incoming packet." Standard for years.
- **Next-generation firewall (NGFW)** — modern; can inspect application-layer content and enforce user-based rules. Almost every enterprise firewall today is one of these.
- **Web Application Firewall (WAF)** — specifically for HTTP traffic to a web app; tries to detect and block attack patterns like SQLi and XSS. Common in front of every real web service.
- **Host-based firewall** — runs on a single machine (Windows Defender Firewall, `ufw`/`iptables` on Linux) rather than at the network edge.

**On Linux, your host firewall is `iptables` (or the friendlier `ufw`):**
```bash
sudo ufw enable
sudo ufw allow 22/tcp     # allow SSH
sudo ufw allow 80/tcp     # allow HTTP
sudo ufw status
```

**Firewalls don't stop everything.** They filter traffic; they can't stop an attack that rides *inside* allowed traffic (a phishing email through allowed SMTP, an SQLi through allowed HTTPS). That's why they're one layer among many — defence in depth (Path 06).

### VPNs: an encrypted tunnel
A **VPN** (Virtual Private Network) is a private, encrypted tunnel between your device and a VPN server. Everything you send is scrambled at your end, travels through your ISP as unreadable noise, and is decrypted at the VPN server before going out to the internet.

Two uses:
- **Corporate VPN** — remote workers connect back to the company network as if they were physically there. This is how a huge number of employees "get into" work resources.
- **Consumer VPN** — hides your traffic from your ISP, hides your real IP from the sites you visit, and lets you appear in another country. Useful on public Wi-Fi; often oversold as a magic bullet.

**A VPN isn't invisibility.** It moves *trust* — from your ISP to the VPN provider. Choose one you'd genuinely trust with your traffic. It also doesn't protect you from browser fingerprinting, malware on your device, or phishing.

### Proxies: middlemen
A **proxy** is a middleman that your traffic passes through. You already know one — **Burp Suite** is a proxy sitting between your browser and the target. Companies also use proxies to filter web browsing, cache popular resources, and enforce policy. A **reverse proxy** sits in front of servers (rather than clients), commonly for load balancing and shielding the real server (Cloudflare and nginx are famous ones).

### Firewalls vs VPNs vs proxies at a glance
| | Firewall | VPN | Proxy |
|---|---|---|---|
| **Job** | Filter allowed traffic | Encrypt & tunnel traffic | Route traffic through a middleman |
| **Who's protected** | The network behind it | You (against ISP/local snoopers) | Depends on setup |
| **Analogy** | Guard at the door | Sealed tunnel between two points | Middleman/messenger |

### 🚩 Challenge
Does a VPN prevent you from being phished?

<details><summary>Answer</summary>No — a VPN only encrypts traffic between you and the VPN server. It doesn't stop a fake login page from stealing your credentials once you type them.</details>

### Key terms
- **Firewall (packet-filtering / stateful / NGFW / WAF / host-based)** — traffic filter.
- **VPN** — encrypted tunnel; corporate or consumer.
- **Proxy / reverse proxy** — middleman on the client / on the server side.
- **iptables / ufw** — Linux firewall tools.

### Recap
- Firewalls filter allowed traffic; they can't stop attacks that ride *inside* allowed traffic.
- VPNs are encrypted tunnels; they move trust rather than eliminate it.
- Proxies are middlemen (Burp is one; Cloudflare is a reverse one).
- These three overlap and complement — none is a magic bullet.

---

## Lesson 8.5 — IDS, IPS & modern detection

### Why this matters
Firewalls decide what's *allowed*; IDS and IPS decide what looks *malicious*. Modern network defence relies on them, and understanding them opens the door to blue-team roles like SOC analyst.

### IDS vs IPS
- **IDS — Intrusion Detection System.** Watches traffic and **alerts** when it sees something suspicious. Passive — it observes.
- **IPS — Intrusion Prevention System.** Same idea, but can **block** the traffic in real time. Active — it interferes.

Both work by matching traffic against **rules** (signatures) or by spotting **anomalies**. A famous open-source example is **Snort / Suricata** — you can literally read the rule files and see how detection works.

### Detection strategies you'll hear about
- **Signature-based** — matches known bad patterns (e.g., a particular byte pattern seen in malware). Fast and accurate, but blind to new attacks.
- **Anomaly-based** — models "normal" for your network and flags deviations. Catches novel attacks but needs good baselines and can be noisy.
- **Behaviour-based / heuristic** — spots suspicious combinations of actions rather than one packet (e.g., login from a new country followed by mass file access).

### The bigger picture: SOC and SIEM
Real defence teams sit in a **SOC** (Security Operations Centre). They watch a **SIEM** — a system that collects logs and alerts from firewalls, IDS/IPS, endpoints, cloud, and applications, and correlates them. Splunk, Elastic (ELK), and Microsoft Sentinel are widely used SIEMs. If SOC work interests you, learning a SIEM (Splunk has great free training) is one of the highest-value moves you can make.

Modern trends also include:
- **EDR / XDR** — Endpoint Detection & Response (and its extended, cross-source version). Modern antivirus that also watches behaviour and lets analysts hunt.
- **NDR** — Network Detection & Response. IDS/IPS's smarter cousin, using ML to spot bad behaviour.
- **SOAR** — Security Orchestration, Automation & Response. Automates common analyst workflows (auto-block an IP that hits three known bad rules, etc.).

### 🚩 Challenge
An IDS sees a suspicious packet. Does it block it? What about an IPS?

<details><summary>Answer</summary>An IDS only alerts — it doesn't block. An IPS can block the traffic in real time.</details>

### Key terms
- **IDS / IPS** — detection / prevention.
- **Snort / Suricata** — famous open-source IDS/IPS engines.
- **Signature / anomaly / behaviour-based** — detection strategies.
- **SOC / SIEM / EDR / XDR / NDR / SOAR** — the ecosystem of modern defence.

### Recap
- IDS alerts; IPS blocks. Both watch traffic for badness.
- Detection is signature-based, anomaly-based, or behavioural.
- SOC teams live in a SIEM correlating alerts across sources.
- EDR/XDR/NDR/SOAR are the modern acronyms in defensive network security.

---

## Lesson 8.6 — Wi-Fi security & wireless attacks

### Why this matters
Wi-Fi is a network transmitted through the air, which changes the attack surface completely — anyone within range can *listen*. Understanding Wi-Fi security is essential for protecting your own life and for pentesting real environments.

### The Wi-Fi security generations
- **WEP** — the original, badly broken since the mid-2000s. If you ever see it, replace it immediately.
- **WPA / WPA2 (personal, with a passphrase)** — the mainstream for years. WPA2 is still very common; weak passphrases can be captured and cracked offline.
- **WPA3** — the modern successor with much stronger protection, especially against offline cracking. Not universal yet, but growing.
- **WPA2/WPA3-Enterprise** — uses a login server (RADIUS) instead of a shared passphrase. Standard in workplaces.

### Common attacks (at a high level)
This is *concept* material — actually performing these outside your own network is illegal in most places.

- **Evil twin** — the attacker sets up a Wi-Fi network with the *same name* as a legitimate one. Devices auto-connect; the attacker sees traffic and can serve fake pages.
- **Deauth attack** — sending forged packets that kick devices off a network, often to force a reconnection (which can leak the handshake for offline cracking).
- **Handshake capture + offline crack** — during a WPA2 connection, a device and access point exchange a handshake. Captured, that handshake can be brute-forced against a wordlist with tools like `hashcat`. Weak passphrases fall in minutes.
- **Rogue AP / karma attack** — a portable AP that pretends to be *whatever network your device is looking for* (`Home_WiFi`, `Airport_Free`, etc.). Devices auto-connect blindly.
- **WPS attacks** — the "Wi-Fi Protected Setup" push-button feature has weaknesses in older routers; if it's on, turn it off.

Tools you'll see in this space (on your *own* Wi-Fi only): `airodump-ng` (packet capture), `airmon-ng` (monitor mode), `aircrack-ng` (cracking), and the modern `hcxdumptool` + `hashcat`.

### Practical safety habits (for you and everyone you help)
1. **Use WPA2 or WPA3** — never WEP.
2. **A long random passphrase** — a wordlist won't crack a passphrase like `Correct-Horse-Battery-Staple-9!`. Length beats complexity.
3. **Update your router firmware** — routers get security patches too.
4. **Change default admin credentials** (the login for the router's web interface).
5. **Disable WPS** and **remote administration** unless you truly need them.
6. **Guest network** for visitors and IoT devices, isolated from your main devices.
7. **Public Wi-Fi:** treat it as hostile. Use HTTPS, or a VPN or your phone hotspot for anything sensitive.

### 🧪 Lab — Audit your own Wi-Fi
1. On your phone or laptop, check what Wi-Fi security your home network uses (Network settings → security type). WPA2 or WPA3 = fine. WEP or open = fix immediately.
2. Log into your router's admin page (typically `192.168.1.1` or `192.168.0.1`). Change the admin password if it's still the default.
3. Check for firmware updates in the router settings and apply any.
4. Disable WPS and remote admin if they're on.
5. Set up a guest network if your router supports it.
6. Note in your journal what you changed. This is real-world security work.

### 🚩 Challenge
Which is more important for resisting offline WPA2 cracking — passphrase length or symbol complexity?

<details><summary>Answer</summary>Length. A long passphrase (many words) is much harder to brute-force than a shorter one full of symbols.</details>

### Key terms
- **WEP / WPA / WPA2 / WPA3** — the Wi-Fi security generations.
- **Evil twin / rogue AP** — fake Wi-Fi impersonating a legitimate one.
- **Deauth attack / handshake capture** — kicking clients off and grabbing the handshake for cracking.
- **WPS** — the push-button feature with known weaknesses; disable it.

### Recap
- Wi-Fi is broadcast, so anyone in range can listen — hence encryption matters.
- Use WPA2/WPA3 with a *long* random passphrase, updated firmware, no WPS, changed defaults.
- Wireless attacks (evil twin, deauth, handshake crack) are concepts here — perform them only on your own Wi-Fi.
- Treat public Wi-Fi as hostile.

---

## Lesson 8.7 — Man-in-the-Middle attacks & how HTTPS defends

### Why this matters
"Man-in-the-Middle" (**MITM**) is the umbrella name for many wireless and network attacks. Once you understand it, encryption stops being magic and starts making obvious sense as a defence.

### The idea
A MITM attack is one where the attacker positions themselves between you and the site you're talking to, so that all your traffic *goes through them*. They can:
- **Read** everything (eavesdrop).
- **Modify** things on the fly (inject malicious content, alter downloads).
- **Impersonate** either side.

Ways attackers get in the middle:
- **ARP spoofing** on a local network — telling all your neighbours "I'm the router, send me everything," and forwarding on so nobody notices.
- **Evil twin Wi-Fi** — you connect through the attacker's fake AP.
- **Rogue DHCP** — handing your device a bad configuration when it joins the network.
- **DNS spoofing** — answering DNS queries with attacker-controlled IPs.
- **BGP hijack / rogue router** — larger-scale variants at the internet's routing layer.

### Why HTTPS beats this in most cases
Recall from Path 02 that HTTPS encrypts and *authenticates* the server (via TLS certificates). Even if an attacker sits in the middle:
- They can't *read* your traffic (it's encrypted).
- They can't *tamper* with it without breaking the encryption.
- They can't *pretend* to be the site without a valid certificate for it. Try, and your browser throws a big scary red warning.

This is why the browser certificate warning is the single most important message you'll ever see. **Never click through it on real sites.** In a real MITM, that warning is often the only thing between you and disaster.

Additional protections you'll meet in real work:
- **HSTS** — a header that tells your browser "always use HTTPS to this site, forever." Prevents downgrade attacks.
- **Certificate pinning** — an app expects one *specific* certificate. Anything else, it refuses.
- **DNSSEC** — signed DNS records to prevent DNS spoofing.
- **DoH / DoT** — DNS over HTTPS / TLS, so your DNS queries themselves are encrypted (thwarts local DNS-based MITM).

### The MITM mindset for a defender
1. Assume the network is hostile — especially on public Wi-Fi.
2. Prefer HTTPS *everywhere*, and never dismiss certificate warnings.
3. Use DoH/DoT if your platform supports it.
4. On corporate networks, be aware that **legitimate interception** may exist (a company MITM proxy inspecting traffic for compliance). It's a security control, not an attack — but it's the same technology.

### 🚩 Challenge
Your browser shows a red "Your connection is not private" warning on a normal-looking site. What might be happening, and what should you do?

<details><summary>Answer</summary>Either the site is misconfigured or someone is attempting a MITM (or intercepting SSL). Either way, do NOT click through — leave the site and, if you're on public Wi-Fi, disconnect.</details>

### Key terms
- **MITM** — attacker sitting between you and the destination.
- **ARP / DNS / DHCP spoofing** — ways of getting into the middle.
- **HSTS / certificate pinning / DNSSEC / DoH / DoT** — defences layered on top of HTTPS.

### Recap
- MITM = attacker inserted between you and the site; can read, modify, or impersonate.
- HTTPS defeats most MITMs by encrypting and authenticating.
- Never click past certificate warnings on real sites.
- HSTS, pinning, DNSSEC, and DoH/DoT harden the defences further.

---

## Lesson 8.8 — Your network-security roadmap

### Why this matters
You now understand mapping (Nmap), watching (Wireshark), filtering (firewalls, VPNs, proxies), detection (IDS/IPS, SIEM), Wi-Fi security, and MITM. This lesson turns that into a plan so you keep sharpening skills across the offensive *and* defensive sides.

### If you're aiming offensive (pentest / red team)
- Do TryHackMe's **"Junior Penetration Tester"** path and Hack The Box's **"Starting Point"** — both lean heavily on network skills.
- Practise Nmap until you can pick the right flags without thinking. Read every host from `nmap -sV -sC` output like a story.
- Learn one C2 framework (e.g., **Sliver** or **Havoc**) in your own lab to understand post-exploitation. (Metasploit is a friendly starter.)
- Aim for the **eJPT** certificate first, then work towards **OSCP** or **CPTS** for a serious credential.

### If you're aiming defensive (SOC / blue team)
- Learn a SIEM. **Splunk Fundamentals** is free and excellent.
- Practise on **LetsDefend** and **Blue Team Labs Online** (BTLO) — investigation scenarios with real logs and pcaps.
- Read every packet in Wireshark until protocol layers feel obvious.
- Aim for the **CompTIA Security+** first, then **CySA+** or **Blue Team Level 1 (BTL1)**.

### If you're aiming for network engineering with security depth
- Learn one platform deeply (Cisco, Juniper, or Fortinet).
- Aim for **CCNA** as a base, then security-focused certs (CCNP Security, Fortinet NSE 4/7).

### Habits shared by all three
- **Notes.** Every scan, every filter, every gotcha.
- **Lab it.** Read about an attack, then reproduce it in your lab. Concepts stick after reproduction, not before.
- **Read incidents.** Post-incident reports (SANS, Mandiant, government CERTs) are a gold mine of realistic network-security stories.
- **Explain it.** Try to teach a friend Nmap or Wireshark. Teaching exposes the gaps in your understanding fast.

### Where next in the course
- **Path 09 — Ethical Hacking:** the full end-to-end methodology tying everything you've learned together.
- **Path 10 — Bug Bounty:** the applied-web side, for people who want a real (paid) outlet.
- **Path 11 — Advanced Topics:** privesc, Active Directory (which is *network* security at its most political), cloud, forensics.
- **Path 12 — AI & AI Security** (coming soon).

### 🚩 Challenge
Name the two free platforms recommended above for practising blue-team investigation with real logs and pcaps.

<details><summary>Answer</summary>LetsDefend and Blue Team Labs Online (BTLO).</details>

### Recap
- Pick a rough direction (offensive / defensive / network engineering) and follow the roadmap that fits.
- Nmap and Wireshark are universal skills — sharpen them constantly.
- SIEMs (especially Splunk) are the fastest defensive career accelerator.
- Notes, lab reproduction, incident reading, and teaching are habits that separate strong learners.

---

## You've finished Path 08 🎉

You've mapped networks with Nmap, seen raw packets with Wireshark, understood the defensive stack (firewalls, VPNs, proxies, IDS/IPS, SIEM), audited your own Wi-Fi, and learned how HTTPS defeats MITM. You now understand security beyond the browser — the whole wire and radio side of the field.

**Next up → `09-ethical-hacking.md`:** we tie it all together with a professional methodology — the 5 phases of ethical hacking, from reconnaissance through reporting. This is the framework real pentesters follow on real engagements.
