# Bluetooth & IoT Network Security

The Wi-Fi security lesson covered the network most people think of first. This lesson covers the growing category of devices connecting through other means entirely — Bluetooth, and the broader IoT device population Path 02's VLAN lesson already flagged as a segmentation priority.

## Bluetooth: convenient, and historically weak

Bluetooth's security has improved significantly across its versions, but several well-documented vulnerability classes remain genuinely worth knowing:

- **Bluejacking** — sending unsolicited messages to nearby Bluetooth devices, largely a nuisance rather than a genuine security threat
- **Bluesnarfing** — unauthorized access to data (contacts, messages) on a Bluetooth-enabled device, exploiting implementation flaws rather than the protocol's core design
- **BlueBorne** — a well-documented 2017 vulnerability class allowing an attacker to take control of a device over Bluetooth without any pairing or user interaction at all, affecting billions of devices across multiple operating systems before patches rolled out

## Why Bluetooth pairing security matters

Directly connecting to Path 00's Wi-Fi lesson's brief mention: leaving Bluetooth discoverable when not actively pairing a new device provides no benefit and real exposure — a discoverable device is actively broadcasting its presence to anything nearby, including an attacker specifically scanning for vulnerable devices.

## IoT devices: the security afterthought category

Path 02's switches-and-VLANs lesson already named the core issue: IoT devices (smart thermostats, cameras, doorbells) are frequently built with weaker security practices than general-purpose computers — infrequent firmware updates, weak or hardcoded default credentials, and limited security review before shipping.

## The Mirai botnet: what happens at scale

A genuinely important real-world case study: the **Mirai botnet** compromised hundreds of thousands of IoT devices in 2016, exploiting nothing more sophisticated than default, unchanged credentials, then used that combined army of compromised devices to launch some of the largest DDoS attacks (covered fully later in this path) ever recorded at the time. This incident is exactly why "change default credentials" — a theme this course has repeated since Path 00 — carries such outsized real-world weight: a mistake that seems individually minor, repeated across enough devices, becomes a genuinely massive collective threat.

## Practical IoT and Bluetooth security

- **Change default credentials on every IoT device**, without exception — directly the Mirai lesson, applied proactively
- **Isolate IoT devices on their own VLAN**, exactly Path 02's recommendation, containing any single device's compromise
- **Disable Bluetooth discoverability** and unnecessary services when not actively in use
- **Keep IoT firmware updated** where the manufacturer actually provides updates — and factor firmware update history into purchasing decisions in the first place

:::challenge Test yourself
Why did the Mirai botnet's exploitation of default credentials — a genuinely simple, unsophisticated technique — result in such a massive real-world impact?
<details><summary>Show answer</summary>Mirai's technique wasn't sophisticated at all — it simply tried a short list of common default username/password combinations against internet-reachable IoT devices, exactly the "fishing with a giant net" pattern from Path 01's why-it-matters lesson. The massive impact came not from the technique's cleverness but from its scale: an enormous number of IoT devices shipped with the exact same unchanged default credentials, meaning one simple, automatable technique succeeded against hundreds of thousands of devices simultaneously, each contributing to a combined botnet capable of launching DDoS attacks at a scale no single compromised device ever could. This is a genuinely important lesson about aggregate risk: an individually low-severity mistake (one unchanged default password) becomes a systemic, large-scale threat once repeated across a large enough population of devices — exactly why "change default credentials" gets repeated so insistently throughout this entire course.</details>
:::

## Key terms

- **BlueBorne** — a 2017 Bluetooth vulnerability class allowing device takeover without pairing or user interaction.
- **Mirai botnet** — a 2016 IoT botnet built by exploiting default credentials at massive scale, used for record-breaking DDoS attacks.

## Recap

- Bluetooth has genuine, documented vulnerability classes (bluesnarfing, BlueBorne), and disabling unnecessary discoverability meaningfully reduces exposure.
- IoT devices remain a systemic weak point, frequently shipping with weak default security practices — the Mirai botnet is the definitive real-world case study of what happens when that weakness gets exploited at scale.
- VLAN isolation, changed default credentials, and firmware update discipline are the practical mitigations, directly extending principles from earlier in this course.

**Next up →** [DNS Attacks, Hands-On](#/lesson/12-network-security/dns-attacks-hands-on)
