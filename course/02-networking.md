# Path 02 — Networking Fundamentals

> **Level:** Beginner · **Lessons:** 8 · **Assumed knowledge:** Path 01 only.

Almost every attack and every defence you will ever study travels across a **network**. If you don't understand networks, hacking will always feel like magic you're copying without understanding. So this path is one of the most valuable in the whole course. We'll go gently, building from "what even is a network?" up to the protocols that run the entire internet — using everyday pictures the whole way. By the end you'll be able to look at how data moves and actually *see* where an attacker fits in.

Take your time. Do the labs. This is the bedrock.

---

## Lesson 2.1 — What is a network?

### Why this matters
Before attacking or defending anything, you must understand how computers communicate. Networking is the human body that a security "doctor" needs to understand. This lesson gives you the mental model everything else hangs on.

### The simplest definition
A **network** is two or more computers connected together so they can share information. That's genuinely all it is. When your phone messages a friend's phone, when your laptop loads a website, or when you stream a film to your TV, computers are talking over a network.

You're already surrounded by them. Your home Wi-Fi is a small network joining your phone, laptop, and TV. Your workplace has a bigger one. And all these smaller networks are joined into one gigantic global network we call **the internet** — literally an *inter-network*, a network of networks.

### The post office picture
The easiest way to understand how this works is a worldwide **postal system**, because it works almost exactly the same way. To send information to another computer, it's like posting a letter: it needs an **address** so it knows where to go, it gets **carried** step by step across towns and countries, and it eventually **arrives** at the right house.

- **Your devices** (phone, laptop, TV) are the **houses**. Each can send and receive letters.
- **Your router** — the Wi-Fi box from your internet provider — is your **local post office**. Everything you send goes there first, and it forwards your mail out to the world and brings replies back.
- **The internet** is the **worldwide delivery network** — all the roads, sorting centres, and other post offices that carry your letter from your house to any other house on Earth.

### Wired vs wireless — same idea
Devices join a network in one of two ways: with a physical **Ethernet cable** plugged into the router, or wirelessly over **Wi-Fi**. From the network's point of view it barely matters — one uses a physical road, the other uses radio waves through the air — but both are just ways of carrying your "letters" to the local post office.

### A quick tour of the pieces
As you go deeper you'll keep meeting these words, so here's a gentle first look:

- **Router** — your local post office; connects your home to the internet and directs traffic.
- **Switch** — inside bigger networks, a device that connects many computers together locally (think of it as an internal mail room).
- **Modem** — translates your provider's signal (cable, fibre, phone line) into something your router understands.
- **Client** — a device *asking* for something (your laptop loading a page).
- **Server** — a computer *providing* something (the machine hosting the website).

> 💡 **Why a security learner cares:** every message you send, every site you visit, and every attack a hacker launches is a "letter" travelling this postal system. Once you can picture the post office, you can reason about *where* an attacker might read a letter, forge an address, or knock on a door they shouldn't. This model will serve you through the entire course.

### 🚩 Challenge
In the post-office analogy, what real device plays the role of your "local post office"?

<details><summary>Answer</summary>Your router — it takes everything you send and forwards it to the wider internet, and brings replies back to you.</details>

### Key terms
- **Network** — two or more connected computers sharing information.
- **The internet** — a global network of networks.
- **Router** — connects your home network to the internet and directs traffic.
- **Client / server** — the device asking vs the device providing.

### Recap
- A network connects computers so they can share information.
- The internet is a "network of networks."
- It works like a worldwide postal system: devices are houses, your router is the local post office, the internet is the global delivery network.
- Wired and wireless are two ways of carrying the same letters.

---

## Lesson 2.2 — IP addresses: every device's home address

### Why this matters
A letter needs an address. On a network, that address is the **IP address**. Almost everything in hacking starts with finding the right address to look at, so this concept is foundational.

### What an IP address looks like
Every device on a network gets an **IP address** (IP = "Internet Protocol," but you can forget that for now) so the network knows where to deliver its letters. The common kind looks like four numbers separated by dots:

```
192.168.1.20
```

Each of those four numbers ranges from **0 to 255**, so addresses run from `0.0.0.0` up to `255.255.255.255`. That's about four billion possibilities — which sounds huge, but the world actually ran out, which is why a newer, vastly larger system called **IPv6** exists (those addresses are longer, full of letters and colons like `2001:db8::1`). For learning, the four-number style (called **IPv4**) is all you need.

### Two kinds of address: private and public
This trips up many beginners, so let's nail it with the apartment-building analogy. Picture a large building on a street.

- **Private IP** — your **flat number inside the building**. It only makes sense *inside* your home network. Your phone might be `192.168.1.20`, your laptop `192.168.1.21`. These same numbers are reused in millions of homes because they never leave the building. Private ranges start with `192.168.`, `10.`, or `172.16`–`172.31`.
- **Public IP** — the **building's street address** that the postal service uses. The whole internet sees this single address for your entire home. Your router holds the public IP and cleverly sorts incoming mail to the right flat inside.

So when you visit a website: your request leaves your flat (private IP), goes out under the building's street address (public IP), reaches the site, and the reply comes back the same way. Your router translates in both directions — a process called **NAT** (Network Address Translation), which you'll hear about later.

### Special addresses worth knowing
- `127.0.0.1` — called **localhost** or the **loopback** address. It always means "this very computer." When you build something and test it "on localhost," you're talking to your own machine.
- Addresses ending in `.255` are often **broadcast** addresses (a message to everyone on the local network).
- `0.0.0.0` can mean "all addresses" in some settings.

### Try it yourself
You can view your device's IP with a single command. Don't worry about mastering the terminal yet (Path 03 covers it) — just try it:

```bash
# Linux or Mac — open a terminal:
ip a

# An older command that also works:
ifconfig

# Windows — open Command Prompt:
ipconfig
```

### 🧪 Lab — Find your addresses
1. Open a terminal (Linux/Mac) or Command Prompt (Windows).
2. Run `ip a` (or `ipconfig` on Windows) and press Enter.
3. The output looks busy — that's normal. Find a line with a number like `192.168.x.x` or `10.x.x.x`. **That's your device's private IP.**
4. Now open a browser and search **"what is my IP"**. The number shown is your **public IP** — the street address the internet sees for your whole home.
5. Write both down in your notes and label which is which.

> 💡 **Why attackers care:** to attack or scan a machine, you first need its address — just as a burglar needs to know which house. A huge part of hacking (which you'll learn in the recon lessons) is simply *finding* the right addresses to look at.

### 🚩 Challenge
Which IP address always means "this very computer I'm sitting at"?

<details><summary>Answer</summary>127.0.0.1 — known as localhost or the loopback address.</details>

### Key terms
- **IP address** — a device's address on a network.
- **IPv4 / IPv6** — the older 4-number system and the newer larger one.
- **Private IP** — works only inside your local network (like a flat number).
- **Public IP** — the single address the internet sees for your home.
- **localhost / 127.0.0.1** — "this computer."
- **NAT** — how your router maps between private and public addresses.

### Recap
- An IP address is a device's address, usually four numbers 0–255 separated by dots.
- Private IPs work only inside your home and are reused everywhere; your public IP is your home's single street address.
- `127.0.0.1` (localhost) always means your own machine.
- Finding addresses is a core first step in hacking.

---

## Lesson 2.3 — Ports: the doors of a computer

### Why this matters
An IP gets you to the right *building*. But a computer runs many services at once, so once your letter arrives, how does it reach the right *department*? Ports. Understanding ports is the heart of scanning — one of the first things every pentester does.

### Ports are numbered doors
A **port** is a number that identifies a specific service on a computer. Picture the building again: the IP gets you to the building, and the **port** is the specific **door** you knock on. The website department is behind one door, email behind another, remote-login behind another. Ports let one machine offer many services without messages getting mixed up.

There are **65,535** possible ports on every machine. That sounds like a lot, but in practice a small set of "well-known" ports are used again and again for the same jobs, everywhere. These are worth becoming familiar with:

| Port | Service | What it's for |
|------|---------|---------------|
| 20/21 | FTP | Transferring files (old, insecure) |
| 22 | SSH | Secure remote login to a command line |
| 25 | SMTP | Sending email |
| 53 | DNS | The internet's phonebook |
| 80 | HTTP | Normal (unencrypted) websites |
| 110 | POP3 | Receiving email (old) |
| 143 | IMAP | Receiving email |
| 443 | HTTPS | Secure websites (the padlock) |
| 445 | SMB | Windows file sharing |
| 3306 | MySQL | A common database |
| 3389 | RDP | Windows remote desktop |

You don't need to memorise the whole table — but `22`, `80`, `443`, and `53` should become second nature.

### Open doors vs closed doors
A port can be **open** (a service is listening behind that door, ready to talk) or **closed** (nothing there). This distinction is the core of a huge amount of security work. Every **open port is a service an attacker can try to interact with** — and possibly find a weakness in. A closed port offers them nothing.

So the *full* address of a service is really two parts: the IP (which building) plus the port (which door). Written together it looks like:

```
192.168.1.20:443
```

That reads as "the secure-web door of the machine at `192.168.1.20`."

> 💡 When you hear a hacker "scanned" a machine, this is exactly it: they knocked on all 65,535 doors to see which open. Each open door is a service to investigate and a potential way in. In Path 08 you'll run **Nmap** to do this for real, legally, on `scanme.nmap.org`.

### 🧪 Lab — Match the ports (paper exercise)
Without looking back, write down what these ports are for: `22`, `80`, `443`, `53`, `3389`. Then scroll up and check yourself. Repeat until you can do all five instantly — these five come up constantly.

### 🚩 Challenge
Secure websites (the padlock ones) listen on which port?

<details><summary>Answer</summary>443 — the secure version of the normal web port, 80.</details>

### Key terms
- **Port** — a numbered door for a specific service (0–65535).
- **Open / closed port** — whether a service is listening there.
- **Well-known ports** — the standard 0–1023 used for common services.

### Recap
- Ports are numbered doors that let one computer run many services at once.
- IP finds the building; the port finds the right door.
- Key ports: 22 SSH, 53 DNS, 80 web, 443 secure web, 3389 remote desktop.
- Open ports are listening services and potential ways in; scanning means knocking on every door.

---

## Lesson 2.4 — Packets: how data actually travels

### Why this matters
Data doesn't travel as one lump — it's chopped into **packets**. A lot of both attacking and defending happens at the packet level, so this is a "click" moment.

### The jigsaw-in-envelopes picture
Imagine mailing a completed jigsaw puzzle, but you may only use small envelopes. So you take the puzzle apart, put each piece in its own envelope, and on every envelope write two things: the destination address, and a number saying which piece it is (piece 1 of 500, 2 of 500…).

You post them all. They might take different routes and arrive out of order — that's fine, because each is numbered, so your friend lays them out and rebuilds the puzzle perfectly. If one envelope is lost, your friend just asks you to re-send *that one piece*, not the whole puzzle.

That's exactly how **packets** work. Each packet is one small envelope carrying a piece of your data:

- Each packet carries a **small chunk** of the overall data.
- Each has a **header** — the writing on the envelope — with the destination IP, source IP, port, and order number.
- Packets can take **different paths** and arrive **out of order**.
- The receiver uses the order numbers to **reassemble** everything.
- If a packet is **lost**, only that one is re-sent.

### The layers (a gentle first look at OSI)
Networking is built in **layers**, each doing one job and wrapping the one above it (called **encapsulation**). You don't need to memorise this yet, but seeing it once helps everything click later. From the wire up:

1. **Physical / Link** — cables, Wi-Fi, hardware (MAC) addresses.
2. **Network** — IP addresses and routing (which road the packet takes).
3. **Transport** — TCP/UDP, ports, reliability.
4. **Application** — HTTP, DNS, SSH — the stuff you actually use.

Your HTTP request sits *inside* a TCP segment, *inside* an IP packet, *inside* an Ethernet frame — like a letter inside an envelope inside a mailbag inside a truck. Wireshark (Path 08) peels these apart for you.

### Why this matters so much for security
Because your data is broken into labelled envelopes travelling shared roads, several security ideas suddenly make sense:

- Someone in the middle could try to **read** your envelopes as they pass — which is why **encryption** (scrambling contents, as HTTPS does) matters so much.
- An attacker could **forge** the address on an envelope to impersonate someone — a trick called **spoofing**.
- A defender can **inspect** packets to spot ones that look malicious.

> 💡 In Path 08 you'll use **Wireshark** to literally open these envelopes and watch every packet flow across a network. Seeing real packets for the first time is a genuine "aha" — the invisible becomes visible.

### 🚩 Challenge
If one packet gets lost on the way, does the whole message need re-sending?

<details><summary>Answer</summary>No — only the single lost packet is re-sent, because each is numbered and can be replaced individually.</details>

### Key terms
- **Packet** — a small numbered chunk of data with a header.
- **Header** — the "writing on the envelope": addresses, port, order number.
- **Encapsulation** — each layer wrapping the one above it.
- **Spoofing** — forging an address to impersonate someone.

### Recap
- Data is split into small packets, each a numbered envelope with a header.
- Packets can take different routes and arrive out of order, then get reassembled; lost ones are re-sent alone.
- Networking is layered (physical → network → transport → application), with encapsulation wrapping each layer.
- Because packets travel shared roads, they can be read, forged, or inspected — the reason encryption and packet analysis exist.

---

## Lesson 2.5 — What is a protocol?

### Why this matters
Computers "talk," but talking only works if both sides follow the same rules. Those rules are **protocols**, and the rest of this path is about the specific ones that run the internet.

### A protocol is just agreed rules
Think of a phone call. There are unspoken rules you both follow: one says "hello" first, you take turns instead of talking over each other, you speak a shared language, and someone says "goodbye" to end it. Without those rules, chaos.

A **protocol** is exactly that idea for computers: an agreed set of rules for how two machines communicate — how they start, what format messages take, how they confirm receipt, and how they end. **Both machines must use the same protocol**, just as two people must share a language.

### Why there are many protocols
Different jobs have different needs, and rules perfect for one job are clumsy for another. Loading a web page, sending an email, and running a live video call all need different rules. So we have many specialised protocols, each tuned to its purpose. You've already met some without realising — remember port 80 for HTTP and 443 for HTTPS? Those ports are the doors where each protocol listens.

Over the next three lessons you'll meet the ones that matter most: **TCP and UDP** (how data is carried), **DNS** (names → addresses), and **HTTP/HTTPS** (how websites load).

> 💡 You don't need to memorise dozens of protocols or their inner workings. As a beginner, just **recognise the main ones and know what each is for.** Recognition, not memorisation.

### Recap
- A protocol is an agreed set of rules for how computers communicate.
- Both machines must use the same one, like sharing a language.
- There are many because different jobs (web, email, video) have different needs.
- You only need to recognise the main ones and what each is for.

---

## Lesson 2.6 — TCP vs UDP

### Why this matters
Almost everything on the internet is carried by one of two protocols: **TCP** or **UDP**. They make opposite trade-offs, and scanning, attacks, and defences behave differently on each.

### TCP — the careful, reliable one
**TCP** is like **registered mail** with delivery confirmation. It makes sure every packet arrives, in the right order, and automatically re-sends anything lost. Nothing is lost; everything arrives complete and correct. The trade-off: all that checking makes it slightly slower.

Because it's reliable, TCP is used whenever **every bit matters**: websites, email, file downloads, remote logins. You wouldn't want half a downloaded file or an email with random missing words.

### UDP — the fast, no-fuss one
**UDP** is like **dropping a postcard in the box**. Write it, send it, move on. No confirmation, no re-sending, no guarantee it arrives — but it's extremely fast and lightweight because it skips the checking.

This is perfect when **speed beats perfection**: live video calls, online games, voice chat. If one video frame is lost, you'd rather the call keep going than freeze while it re-sends an old frame. A tiny glitch beats a delay.

### The TCP three-way handshake
Before TCP sends real data, the two computers do a quick three-step greeting to agree to talk, called the **three-way handshake**:

1. **SYN** — "Hello, can we talk?"
2. **SYN-ACK** — "Yes, can you hear me?"
3. **ACK** — "Yes — let's begin."

You'll hear these terms constantly.

> 💡 **Security ties-in:** port scanners (like Nmap) work by *starting* this handshake with each port to see which answer — a door that completes the handshake is "open." Attackers can also *abuse* it: flooding a server with endless SYN "hello" requests it must try to answer is an attack called a **SYN flood** (a type of denial-of-service).

### A side-by-side
| | TCP | UDP |
|---|-----|-----|
| Reliability | Guaranteed, ordered | None |
| Speed | Slightly slower | Very fast |
| Handshake | Yes (SYN/SYN-ACK/ACK) | No |
| Analogy | Registered mail | Postcard |
| Used for | Web, email, downloads, SSH | Video calls, games, DNS |

### 🚩 Challenge
Which protocol re-sends any lost pieces and guarantees delivery — TCP or UDP?

<details><summary>Answer</summary>TCP — the "registered mail" one that checks everything arrives.</details>

### Key terms
- **TCP** — reliable, ordered delivery (registered mail).
- **UDP** — fast, unchecked delivery (postcard).
- **Three-way handshake** — SYN, SYN-ACK, ACK to start a TCP conversation.
- **SYN flood** — abusing the handshake to overwhelm a server.

### Recap
- TCP is reliable and ordered (web, email, downloads); UDP is fast and unchecked (video, games).
- TCP starts with a three-way handshake: SYN, SYN-ACK, ACK.
- Scanners use the handshake to find open ports; attackers can abuse it with SYN floods.

---

## Lesson 2.7 — DNS: the internet's phonebook

### Why this matters
You type names, computers use numbers. DNS is the translator in between — and it quietly leaks a target's structure, making it a favourite of both attackers and defenders.

### What DNS does
You type `google.com`, but computers find each other using IP addresses like `142.250.190.14`. Something must translate the friendly name into the number. That something is **DNS** (Domain Name System) — think of it as the **internet's phonebook**. You give it a name, it gives back the number. Without it, you'd have to memorise numeric addresses for every site you visit.

### How a lookup works, step by step
When you hit Enter on an address, before the page can load:

1. Your computer asks a **DNS server**: "What's the IP for `google.com`?"
2. The DNS system looks it up (asking bigger phonebooks up the chain if needed) and replies with the number.
3. Your computer now knows the address and sends its real request to the website.
4. All of this takes a fraction of a second, every time, for every site.

### Types of DNS records (a useful glimpse)
DNS stores different kinds of entries, and knowing a few helps in recon:

- **A record** — maps a name to an IPv4 address (the main one).
- **AAAA record** — maps a name to an IPv6 address.
- **MX record** — the mail servers for a domain (reveals the email provider).
- **NS record** — which servers run the domain's DNS.
- **TXT record** — free text, often exposing which services a company uses.
- **CNAME** — an alias pointing one name at another.

### Try it yourself
```bash
# Ask DNS for a website's address:
dig google.com +short

# See its mail servers:
dig google.com MX +short

# The simpler cross-platform version:
nslookup google.com
```

### 🧪 Lab — Explore a domain's phonebook
1. In a terminal, run `dig example.com +short` and note the IP it returns.
2. Run `dig example.com MX +short` — do you see mail servers?
3. Try it on a site you use. Notice how much you can learn about a company's setup from public records alone, without touching their servers.

> 💡 **Why hackers care:** the phonebook quietly reveals structure. By exploring DNS, an attacker can discover forgotten **subdomains** like `mail.company.com`, `test.company.com`, or `old-server.company.com` — each a possible side entrance the owner forgot about. This is a core recon technique in Path 09 and 10.

### 🚩 Challenge
Which DNS record type tells you a domain's mail servers?

<details><summary>Answer</summary>The MX record (Mail eXchange).</details>

### Key terms
- **DNS** — turns names into IP addresses (the internet's phonebook).
- **A / AAAA / MX / NS / TXT / CNAME** — different DNS record types.
- **Subdomain** — a name under a domain, e.g. `mail.company.com`.

### Recap
- DNS turns names into IP addresses; without it you'd memorise numbers.
- A lookup happens automatically before any page loads.
- Records like A, MX, and TXT reveal a target's structure.
- `dig` and `nslookup` let you query DNS, and it's a core recon source for finding subdomains.

---

## Lesson 2.8 — HTTP & HTTPS: how websites load

### Why this matters
Most modern hacking is **web** hacking, and HTTP is the language of the web. Master the request/response idea here and web security later will feel natural.

### Request and response
Every time you open a website, your browser and the site's **server** have a conversation in **HTTP** (HyperText Transfer Protocol). It's a simple back-and-forth: your browser sends a **request** ("please give me this page"), and the server sends a **response** (the page). Remember these two words — almost all web hacking is crafting requests and studying responses.

A request also states *what action* you want. The two you'll see most:

- **GET** — "give me something" (load a page).
- **POST** — "here's some data for you" (submit a login form or comment).

There are others (PUT, DELETE, PATCH) but GET and POST cover most of what you'll meet early.

### The anatomy of a request (a first look)
```
GET /profile?id=42 HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0
Cookie: session=abc123
```
- `GET` — the method (the action).
- `/profile?id=42` — the path, plus a **parameter** named `id` with value `42`.
- The lines below are **headers** — extra info like who you are (`Cookie`) and what browser you use.

### The anatomy of a response
```
HTTP/1.1 200 OK
Content-Type: text/html

<html>...</html>
```
The first line has a **status code** telling you how it went. Learn these families — they're the feedback you watch while testing:

- **2xx** success (200 OK).
- **3xx** redirect (301, 302).
- **4xx** your error (401 unauthorized, 403 forbidden, 404 not found).
- **5xx** server error (500 — often a sign you *touched* something).

### The 'S' is for Secure
Plain HTTP sends everything in **plain text**. Remember packets travel shared roads where others might read them? With plain HTTP, anyone in the middle — on the same Wi-Fi or along the route — could read everything, including your password as you type it.

**HTTPS** fixes this. The 'S' stands for **Secure**: the whole conversation is **encrypted** — scrambled into gibberish only your browser and the real server can unscramble. Anyone reading the packets in the middle sees nonsense. That's what the **padlock** in your address bar means.

- **HTTP** — plain text; anyone in the middle can read it. Never for anything private.
- **HTTPS** — encrypted; safe from eavesdroppers. What virtually all real sites use today.

> ⚠️ **Safety rule:** never type a password, card number, or private detail on a plain `http://` site without the padlock — especially on public Wi-Fi. The padlock isn't decoration; it's the visible sign your data is scrambled in transit.

### 🧪 Lab — Watch requests happen
1. Open any website in your browser.
2. Press **F12** to open Developer Tools, and click the **Network** tab.
3. **Refresh** the page and watch the list of requests appear.
4. Click one request and explore: its method (GET/POST), its status code, its headers, and the response. You're now looking at raw HTTP — the exact thing web hackers study. (More on DevTools in Path 05.)

### 🚩 Challenge
What does the 'S' in HTTPS stand for, and what does it add?

<details><summary>Answer</summary>Secure — it encrypts the whole conversation so eavesdroppers in the middle can't read it.</details>

### Key terms
- **HTTP** — the web's request/response protocol.
- **Request / response** — what your browser sends and the server returns.
- **GET / POST** — "give me something" vs "here's some data."
- **Header** — extra info attached to a request or response.
- **Status code** — the 2xx/3xx/4xx/5xx result of a request.
- **HTTPS** — encrypted HTTP (the padlock).

### Recap
- HTTP is the web's language: your browser requests, the server responds.
- Requests have methods (GET/POST), paths, parameters, and headers; responses have status codes.
- Plain HTTP is readable in the middle; HTTPS encrypts everything.
- Request-and-response is the heart of web hacking — you'll build on this constantly.

---

## You've finished Path 02 🎉

You now understand networks, IP addresses, ports, packets, protocols, TCP vs UDP, DNS, and HTTP/HTTPS — the true foundation under every attack and defence. You can picture how data moves and where an attacker fits in.

**Next up → `03-linux.md`:** operating systems, then building your own safe hacking lab by installing Kali Linux in VirtualBox, followed by a proper tour of the Linux command line.
