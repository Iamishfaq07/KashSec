# Zero Trust Network Access (ZTNA) vs. Traditional VPN

Every earlier lesson in this path has been mostly conceptual. ZTNA is where Zero Trust principles become a specific, buyable, deployable technology category — and understanding what it actually replaces (and why) is one of the most interview-relevant topics in this entire path.

:::tip
The one-sentence version: a VPN gives you a place on the network; ZTNA gives you access to one specific application, and never puts you "on the network" at all.
:::

## What a traditional VPN actually does

A corporate VPN authenticates a user, then assigns their device an IP address *inside* the corporate network range. From that point forward, the device is — network-wise — treated as if it's plugged into an ethernet port in the office. Whatever that network segment can reach, the VPN-connected device can generally attempt to reach too, subject to whatever internal firewall rules happen to exist (which, per the micro-segmentation lesson, are often far looser than they should be).

This was a reasonable design in an era of flat internal networks and infrequent remote access. It creates two persistent problems:

1. **Broad implicit access.** Connecting to the VPN is a coarse, all-or-nothing decision. It's not "grant access to the specific app I need," it's "grant a foothold on the whole network, then hope internal segmentation limits the blast radius" — and as covered in the segmentation lesson, that internal segmentation is often weaker than assumed.
2. **A single point of compromise with wide reach.** VPN credentials (or a VPN client vulnerability) becoming compromised is a well-worn path to serious breaches, precisely because "on the VPN" has historically meant "on the network," full stop.

## What ZTNA does instead

ZTNA (Zero Trust Network Access) grants access to **one specific application**, after verifying identity, device posture, and policy — without ever placing the device on the broader network at all. The user never gets an internal IP address; they get a narrow, brokered connection to exactly the resource they were authorized for, and nothing else exists from their vantage point.

| | Traditional VPN | ZTNA |
|---|---|---|
| Grants | Network-level access (an IP on the internal network) | Application-level access (one specific app/service) |
| Visibility of other resources | Often broad — much of the internal network is reachable | Effectively invisible — unauthorized resources don't even respond |
| Trust model | Trust established once at connection, largely static after | Continuously re-evaluated (identity + device + context), per the earlier lessons in this path |
| Typical failure mode | A compromised VPN credential can reach far more than intended | A compromised credential is contained to the specific app it was scoped to |
| Segmentation dependency | Relies heavily on internal network segmentation to limit blast radius | Segmentation is closer to inherent in the model itself |

## How ZTNA actually works, at a high level

```
User/device
    │  (identity + device posture checked)
Policy engine / broker
    │  (only if authorized for THIS specific app)
Application  ← direct, brokered connection — nothing else is reachable
```

The broker sits between the user and every application, making a fresh authorization decision per connection request instead of granting broad network reachability once. This is exactly the Software-Defined Perimeter concept from the micro-segmentation lesson, applied specifically to remote access.

## A worked example: the blast radius difference

An attacker steals an employee's VPN credentials via phishing.

**Under a traditional VPN**: the attacker connects, gets an internal IP, and can now attempt to reach whatever that network segment allows — internal wikis, file shares, other servers, anything internal segmentation didn't explicitly block. The actual damage depends entirely on how well-segmented the internal network happens to be, which, realistically, varies a lot.

**Under ZTNA**: the same stolen credentials get the attacker access to *exactly* the specific applications that employee's identity and device posture were authorized for — nothing more. If the employee's real device is required for that authorization (a device certificate, a managed-device check) and the attacker is using their own machine, even the stolen credentials alone aren't enough; they'd also need to defeat the device-trust layer from an earlier lesson. The blast radius is architecturally bounded from the start, not dependent on how well someone configured internal firewall rules years ago.

## Why this matters beyond "it's more secure"

- **Better remote-work experience in practice**: ZTNA often means users connect directly to the specific app they need with less latency than backhauling all traffic through a central VPN concentrator
- **Cleaner third-party and contractor access**: granting a contractor VPN access to "the network" is a scoping nightmare; granting them ZTNA access to exactly two applications is a much smaller, auditable decision
- **No more VPN client as a top attack target**: VPN client software vulnerabilities have repeatedly been high-profile initial-access vectors in real breaches; removing the always-on VPN client from the picture removes that specific attack surface

## What ZTNA doesn't magically solve

ZTNA is a real architectural improvement, not a silver bullet:

- It's only as good as the identity and device-posture signals feeding its policy decisions — garbage signals in, garbage authorization decisions out
- Migrating from VPN to ZTNA is a genuine project, not a flag flip — legacy applications not designed for it may need adaptation
- Vendors market plenty of "ZTNA" products that implement only part of the real model — the same "not a single product" warning from the first lesson applies here directly

## 🧪 Hands-on lab — compare the two models on paper

Pick a hypothetical remote employee who needs access to three internal resources: an internal wiki, a customer database, and a deployment tool.

1. Under a traditional VPN model, describe what network-level access granting VPN connectivity would realistically expose, beyond just those three resources.
2. Under a ZTNA model, describe what the same employee's access would look like instead — be specific about what's visible and what isn't.
3. Now imagine this employee's laptop gets malware. For each model, write one sentence on what the malware could realistically reach using the employee's live session.
4. Which model would you recommend for a contractor who only ever needs the deployment tool, and why?

:::challenge Test yourself
1. In one sentence, explain the core architectural difference between "network-level access" and "application-level access."
2. Why does a VPN client vulnerability represent a bigger single point of failure than a ZTNA broker vulnerability, assuming both are equally likely to have bugs?
3. Name one thing ZTNA does NOT automatically fix, even after a full migration.
:::

## Key terms

- **ZTNA (Zero Trust Network Access)** — a model granting brokered, per-application access rather than broad network-level access
- **VPN concentrator** — the central device/server that terminates VPN connections and routes traffic onto the internal network
- **Broker** — the component in ZTNA that mediates every connection request between a user and a specific application
- **Blast radius** — the scope of what's reachable/damageable if a given credential or device is compromised

## Recap

Traditional VPNs grant broad network presence and rely on internal segmentation to limit damage after the fact; ZTNA grants narrow, per-application access brokered through continuous identity and device checks, bounding blast radius by design rather than by hoping internal firewall rules are good enough. It's the most concrete, deployable expression of everything the earlier lessons in this path have been building toward — which is exactly why it's such a common interview and real-world adoption topic.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — describes the architectural model ZTNA implements
- [CISA Zero Trust Maturity Model — Networks pillar](https://www.cisa.gov/zero-trust-maturity-model) — situates ZTNA within a broader adoption roadmap
???
