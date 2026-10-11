# Wireless networking basics

Everything covered so far in this path works the same whether devices connect by cable or by air — but wireless networking adds a few genuinely distinct concepts and risks worth understanding on their own terms.

## How Wi-Fi actually works, briefly

A **wireless access point** broadcasts a radio signal that nearby devices can connect to, functioning much like the switch from the previous lesson, except devices connect over radio waves instead of a physical cable. Every Wi-Fi network broadcasts an **SSID** (Service Set Identifier) — the network name you pick from a list when connecting.

## Wi-Fi standards, briefly

You'll see names like **802.11ac** or **802.11ax (Wi-Fi 6)** on router boxes — these are just successive generations of the Wi-Fi standard, each offering faster speeds and better handling of many simultaneous devices. For security purposes, the standard generation matters far less than the *encryption* protocol in use, covered next.

## WPA2, WPA3, and why the encryption standard matters more than the speed

Path 00's Wi-Fi lesson already introduced WPA2/WPA3 as the modern, secure encryption standards, and WEP as an older, broken one worth avoiding entirely. This lesson adds the technical reason why: **WEP's encryption was cryptographically broken** — practical, publicly documented attacks can recover a WEP network's password in minutes, regardless of how strong that password actually is, because the flaw is in the protocol itself, not in password strength. WPA2 and especially WPA3 fixed the underlying cryptographic weaknesses, directly applying the cryptography concepts from Path 06.

## Open networks vs. encrypted networks

An **open network** (no password required) provides zero encryption between your device and the access point — anyone else connected to that same open network can potentially observe unencrypted traffic passing over it, which is exactly why Path 00's Wi-Fi lesson recommended caution on unfamiliar open networks, and why HTTPS (Path 06's TLS-handshake lesson) matters so much regardless of which network you're on.

## Evil twin attacks: a wireless-specific threat

An **evil twin attack** is when an attacker sets up a rogue access point broadcasting the *same* SSID as a legitimate network — a fake "Coffee Shop WiFi" sitting right next to the real one — hoping victims connect to the attacker's version instead, letting the attacker observe or manipulate all resulting traffic. This is precisely the "fake public Wi-Fi network with a plausible name" risk Path 00 warned about, now with the specific technical name and mechanism behind it.

:::danger Your device can't always tell the difference on its own
Devices generally connect based on SSID name and signal strength, not any deeper verification of who's actually running the access point — meaning an evil twin with a strong signal and the right name can genuinely fool an unsuspecting device, or even auto-reconnect a device that's connected to that network name before.
:::

:::challenge Test yourself
Why does WEP's vulnerability matter regardless of how strong the actual Wi-Fi password chosen is?
<details><summary>Show answer</summary>WEP's weakness is in the underlying cryptographic protocol itself — the way it generates and reuses certain values during encryption — not in the specific password chosen. This means a WEP network protected by a genuinely long, random, hard-to-guess password is <em>still</em> breakable through the same documented cryptographic attack, in roughly the same amount of time as a network using a weak password, because the attack doesn't work by guessing the password directly — it exploits a flaw in how WEP encrypts data regardless of what that password actually is. This is exactly why WPA2/WPA3 replaced WEP entirely, rather than WEP simply needing "stronger passwords."</details>
:::

## Key terms

- **SSID** — the broadcast name of a Wi-Fi network.
- **Open network** — a Wi-Fi network requiring no password, providing no encryption between device and access point.
- **Evil twin attack** — a rogue access point broadcasting a legitimate network's name to trick victims into connecting.

## Recap

- Wireless networking works much like wired networking underneath, with radio waves replacing cables.
- WPA2/WPA3 fixed real, documented cryptographic weaknesses in the older WEP standard — this matters more than which generation of Wi-Fi speed standard is in use.
- Open networks provide no encryption of their own, which is exactly why HTTPS matters regardless of network trust.
- Evil twin attacks exploit the fact that devices generally trust a network by name and signal strength alone, without deeper verification.

**Next up →** [DNS: the phonebook](#/lesson/02-networking/dns)
