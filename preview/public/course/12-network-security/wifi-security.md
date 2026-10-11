# Wi-Fi security

Wireless networks broadcast data through the air, reachable by anyone with an antenna in range — no physical cable access required. This fundamental difference from wired networks creates an entirely distinct set of security considerations.

## Why wireless is fundamentally different

On a wired network, an attacker generally needs **physical access** to a cable or switch port. On Wi-Fi, anyone within radio range — a neighbour, someone in a parking lot, another table at a coffee shop — can **passively receive** every packet your device transmits, whether or not they're "on" your network. Security therefore depends almost entirely on **encryption** and **authentication**, since physical access control simply doesn't apply the same way.

## The evolution of Wi-Fi security protocols

```mermaid
flowchart LR
    WEP["❌ WEP<br/>(1997, broken)"] --> WPA["⚠️ WPA<br/>(2003, transitional)"]
    WPA --> WPA2["✅ WPA2<br/>(2004, long-standing standard)"]
    WPA2 --> WPA3["✅✅ WPA3<br/>(2018, current best)"]

    style WEP fill:#2b1010,color:#E05548,stroke:#E05548
    style WPA fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style WPA2 fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style WPA3 fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
```

- **WEP (Wired Equivalent Privacy)** — the original 1997 standard. Cryptographically **broken** — crackable in minutes with freely available tools, regardless of password strength, due to fundamental flaws in its encryption design. If you ever see a WEP network in active use today, it should be considered essentially unprotected.
- **WPA (Wi-Fi Protected Access)** — a rushed transitional fix after WEP's flaws became public, using **TKIP** encryption. Better than WEP but still has known weaknesses; effectively obsolete.
- **WPA2** — the long-standing industry standard since 2004, using **AES-CCMP** encryption, genuinely strong when configured properly. Its main historical weakness was vulnerability to **offline dictionary attacks** against weak pre-shared passwords (not a flaw in the protocol's cryptography itself).
- **WPA3** — the current standard (2018+), addressing WPA2's weak-password weakness directly via **SAE (Simultaneous Authentication of Equals)**, which resists offline dictionary attacks even against weaker passwords, plus stronger encryption and improved protection on open/public networks.

**Practical takeaway:** always use WPA3 if your router and all your devices support it; WPA2 with AES (never TKIP) is the acceptable minimum today. Never use WEP or an open (no password) network for anything you care about.

## WPA2/WPA3 authentication modes

- **Personal (PSK — Pre-Shared Key)** — everyone uses the same shared password. Simple, common for home networks — but if that single password leaks, every device's traffic is potentially at risk, and there's no way to attribute activity to a specific individual.
- **Enterprise (802.1X)** — each user authenticates with their own individual credentials against a central authentication server (RADIUS), typically integrated with company directory services. Standard in corporate environments — allows per-user access control, logging, and instant revocation for a single departing employee without needing to change a shared password for everyone.

## Common Wi-Fi attacks

### Cracking WPA2-PSK handshakes

When a device joins a WPA2-PSK network, it performs a **four-way handshake** with the access point. An attacker can passively capture this handshake, then attempt to crack the password **offline** (without needing to stay connected or interact with the network further):

```bash
# Capture handshake with airodump-ng (part of the aircrack-ng suite, pre-installed on Kali):
sudo airodump-ng wlan0

# Target a specific network once identified:
sudo airodump-ng -c <channel> --bssid <target-bssid> -w capture wlan0

# Optionally, deauthenticate a connected client to force a fresh handshake:
sudo aireplay-ng -0 5 -a <target-bssid> wlan0

# Crack the captured handshake against a wordlist:
aircrack-ng capture-01.cap -w /usr/share/seclists/Passwords/rockyou.txt
```

This is exactly why **password strength matters enormously** for WPA2-PSK networks — a strong, long, unique Wi-Fi password (recall Path 10.5's password lesson) makes offline cracking computationally infeasible, while a weak or common one falls quickly to a wordlist attack.

### Evil twin / rogue access points

An attacker sets up a fake access point broadcasting the **same SSID** (network name) as a legitimate one, hoping victims' devices connect automatically (many devices auto-reconnect to remembered SSIDs without verifying it's genuinely the same physical network). Once connected, the attacker can intercept, modify, or redirect all the victim's traffic — a direct enabler of the man-in-the-middle attacks in the next lesson.

### WPS (Wi-Fi Protected Setup) vulnerabilities

WPS was designed for convenient device pairing (push a button or enter a short PIN) but its **PIN-based** implementation had serious brute-forcing weaknesses in many router models, letting attackers recover the WPA2 password even with a strong passphrase, purely by exploiting the WPS PIN mechanism itself. **Disable WPS** on any router where you have the option — this was already flagged as a practical hardening step back in Path 10.7.

### KRACK — a protocol-level WPA2 flaw

**KRACK (Key Reinstallation Attack)**, disclosed in 2017, exploited a flaw in WPA2's four-way handshake itself (not password strength) allowing traffic decryption under specific conditions. Patched via firmware/OS updates across virtually all major vendors — a good reminder that even well-designed protocols can have implementation-level flaws discovered years later, reinforcing why keeping router firmware updated (Path 10.7) matters.

### PMKID attack — cracking without a client present

A refinement on the four-way handshake capture worth knowing: the **PMKID attack** (discovered in 2018) lets an attacker recover the same crackable material *without waiting for a client to connect or forcibly deauthenticating anyone*. Many access points include the PMKID (a value derived from the network password, used to speed up roaming between access points on the same network) in a single frame sent even to an attacker who simply requests it directly — meaning the entire "deauth a client, wait for a fresh handshake" step from the classic attack above becomes unnecessary. This matters practically because it's stealthier (no disruptive deauth packets that alert anyone monitoring the network) and faster, and it's exactly the kind of "the same underlying password-cracking economics, a quieter delivery mechanism" pattern worth recognising across many attack classes in this course.

## Bluetooth and BLE — wireless security beyond Wi-Fi

Wi-Fi isn't the only wireless protocol carrying real security stakes. **Bluetooth** and **BLE (Bluetooth Low Energy)** — used by everything from wireless headphones to medical devices and smart locks — have their own distinct attack surface: **BlueSnarfing** exploits weak or absent authentication to silently pull data off a paired device, **BlueJacking** sends unsolicited messages to nearby discoverable devices, and various **pairing-downgrade attacks** trick two devices into negotiating a weaker, crackable encryption mode during initial pairing. The core lesson generalises directly from Wi-Fi: any wireless protocol broadcasting through open air needs its own explicit encryption and authentication design, since — exactly as with Wi-Fi — physical proximity alone is often all an attacker needs to start listening. Path 13's mobile security material returns to Bluetooth/BLE attacks in more depth, since mobile devices are the most common real-world Bluetooth attack surface today.

## Defensive best practices, consolidated

- Use **WPA3** where possible, WPA2-AES as the minimum acceptable fallback.
- Use a **long, random, unique** Wi-Fi password — treat it with the same seriousness as any other password (Path 10.5).
- **Disable WPS.**
- Change the router's **default admin credentials** (Path 10.7, Path 10.4's Mirai botnet context).
- Keep router **firmware updated**.
- Use a **separate guest network** for visitors and untrusted IoT devices, isolated from your primary devices.
- For enterprise environments, prefer **802.1X/Enterprise** authentication over shared PSK wherever feasible.
- Be cautious connecting to **public/open Wi-Fi** — assume traffic could be observed; use a VPN (previous lesson) for sensitive activity on untrusted networks.

## 🧪 Lab — Audit your own Wi-Fi setup

Using your home router's admin panel:

1. Confirm which security protocol is actually configured (WPA2? WPA3? Mixed mode?).
2. Confirm WPS is disabled.
3. Confirm the admin password isn't the factory default.
4. If your router supports it, set up a separate guest network and move any smart-home/IoT devices onto it, isolated from your personal computers and phones.
5. Consider (with your own network, using a USB Wi-Fi adapter that supports monitor mode) trying `airodump-ng wlan0mon` to simply **observe** nearby network names, channels, and encryption types — no attacking, purely passive awareness-building of what's visible in your own environment.

:::danger AUTHORIZATION REQUIRED FOR ANY ACTIVE ATTACK
Capturing handshakes, deauthenticating clients, or attempting to crack passwords is only legal against networks you own or have **explicit written authorization** to test — exactly the legal framework from Path 01. Never run these techniques against a neighbour's network, a coffee shop's Wi-Fi, or any network you don't have clear authorization for, even "just to see if it works."
:::

:::challenge Test yourself
Why does a strong, long Wi-Fi password specifically protect against offline handshake-cracking attacks on WPA2-PSK, even though the attacker only needs to passively capture the handshake once?

<details><summary>Show answer</summary>Once an attacker has captured the four-way handshake, they can attempt to crack it <strong>offline</strong>, trying enormous numbers of password guesses without ever needing to interact with the network again. A short or common password can be found quickly this way (via wordlists or brute force). A long, random password makes the search space so vast that offline cracking becomes computationally infeasible in any practical timeframe — directly mirroring the length-over-complexity password lesson from Path 10.5, just applied to a Wi-Fi context specifically.</details>
:::

## Key terms

- **WEP / WPA / WPA2 / WPA3** — the evolution of Wi-Fi security protocols, WEP fundamentally broken, WPA3 current best practice.
- **PSK vs Enterprise (802.1X)** — shared-password vs individual-credential Wi-Fi authentication modes.
- **Four-way handshake** — the WPA2 connection process, capturable and crackable offline if the password is weak.
- **Evil twin** — a rogue access point impersonating a legitimate network's SSID.
- **WPS** — a convenience pairing feature with a history of serious brute-force vulnerabilities.

## Recap

- Wireless security depends almost entirely on encryption and authentication, since physical access control doesn't apply the same way as wired networks.
- WEP is fundamentally broken; WPA3 is current best practice, WPA2-AES the acceptable minimum.
- A strong, unique Wi-Fi password is the primary defence against offline handshake-cracking attacks.
- Evil twin attacks and WPS vulnerabilities are common real-world Wi-Fi attack vectors beyond password cracking alone.
- All active testing techniques require explicit authorization — this is a legally serious area, not a casual experimentation zone.

???refs
- [Wi-Fi Alliance — WPA3 specification](https://www.wi-fi.org/discover-wi-fi/security) — official protocol documentation.
- [Aircrack-ng official documentation](https://www.aircrack-ng.org/documentation.html) — the standard Wi-Fi security testing suite.
- [KRACK Attacks — official disclosure site](https://www.krackattacks.com/) — the original researcher's detailed writeup.
- [US-CERT — Securing Wireless Networks](https://www.cisa.gov/news-events/news/securing-wireless-networks) — official US guidance.
???

**Next up →** [Bluetooth & IoT Network Security](#/lesson/12-network-security/bluetooth-iot-security)
