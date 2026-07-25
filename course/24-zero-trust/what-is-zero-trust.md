# What is Zero Trust?

Zero Trust is a security model built on one uncomfortable admission: the network you're standing on tells you almost nothing about whether you should be trusted. Being "inside the corporate network" used to mean something. Today it means you found the Wi-Fi password, or you're on a VPN, or you're a compromised laptop three hops from someone's home router — the network alone can't tell the difference.

:::tip
The single sentence that captures the whole model: **never trust, always verify — for every request, every time, regardless of where it comes from.** Everything else in this path is detail on top of that sentence.
:::

## The perimeter model it replaced

For decades, network security worked like a castle: a strong wall (the firewall) around a soft, trusted interior. Get past the wall — VPN in, plug into an office ethernet port, get physical access to a building — and you were largely trusted from then on. Internal traffic was often lightly inspected, internal services assumed their callers were legitimate, and a single compromised laptop could often reach far more than it should.

This model had a genuinely reasonable assumption behind it in, say, 1998: employees worked from an office, on company hardware, connecting to servers in that same building. The perimeter was a real, physical thing.

That assumption has been dead for years:

- Employees work from home, coffee shops, airports — "the office network" is one of many networks they touch in a day
- Applications live in multiple clouds, not one data center behind one firewall
- Contractors, partners, and third-party SaaS tools need access too, and they were never inside your perimeter to begin with
- Attackers who get one foothold (a phished laptop, a leaked credential) historically found the *inside* of the network shockingly permissive — this is exactly how a single phishing email turns into a full domain compromise

## The three core principles

1. **Never trust, always verify.** No request is trusted by default because of its network location. Every request — user to app, service to service — is authenticated and authorized on its own merits.
2. **Least privilege access.** Grant the minimum access needed for the task, for the shortest reasonable time, and nothing more. Not "this person is an engineer, give them broad infrastructure access" — "this person needs to deploy service X today."
3. **Assume breach.** Design as if an attacker is already somewhere in your environment. Segment aggressively, log everything, and make lateral movement (the act of hopping from one compromised system to the next) as hard and as visible as possible.

:::warn
"Assume breach" is the principle people skip, because it feels pessimistic. It's actually the most practically useful one — it's the difference between a security program that only tries to keep attackers *out* and one that also limits the damage once someone *is* in, which is the realistic scenario for any organization large enough to be a target.
:::

## What Zero Trust is not

- **Not a single product.** Vendors sell "Zero Trust solutions," but Zero Trust is an architecture and a set of principles, not a box you buy. A vendor selling you "Zero Trust in a box" is selling you one piece of a much larger picture.
- **Not the absence of trust.** Every request still results in a trust decision — Zero Trust just means that decision is made explicitly, continuously, and based on real signals (identity, device health, context), rather than assumed once and never rechecked.
- **Not just about the network.** Network segmentation is one piece. Identity, device posture, application-layer authorization, and data classification all participate.
- **Not a weekend project.** Real Zero Trust adoption is a multi-year journey for most organizations — this path's later lessons cover how to sequence that journey realistically.

## The classic diagram, explained

```
Traditional:  [Internet] --firewall--> [Trusted internal network — mostly unchecked]

Zero Trust:   [Any user/device, any location]
                    │
              Policy Engine (checks identity + device + context, every time)
                    │
              [Specific resource — nothing more]
```

The key shift: in the traditional model, the checkpoint is at the *edge*, once. In Zero Trust, the checkpoint moves to *every individual resource*, and it runs continuously, not just at initial login.

## A concrete before-and-after

**Before (perimeter model).** An engineer VPNs into the corporate network. From that point, their laptop can reach the internal file server, the internal wiki, the build server, and a dozen other internal services — because all of them trust "anything on the internal network" to a significant degree. If that laptop gets compromised by malware from a phishing email, the attacker inherits all of that reach.

**After (Zero Trust).** The same engineer authenticates with MFA to a specific application (say, the build server) through a policy engine that checks: is this really them (strong auth), is their device healthy (patched, EDR running, not jailbroken), and does their role actually need build-server access right now. Getting into the build server grants *only* build-server access — nothing about the wiki or the file server changes, because those are separate authorization decisions the engineer never touched. A compromised laptop now has to defeat that same check again for every other resource it tries to reach, and each attempt is logged and visible.

## Why this matters right now

Three trends made Zero Trust go from "interesting idea" to "default expectation" in about a decade:

- **Remote and hybrid work** made "on the corporate network" meaningless as a trust signal for a huge share of daily traffic
- **Cloud adoption** means most of what you're protecting isn't inside a perimeter you control at all
- **Ransomware and lateral movement** made "assume breach" a lived reality for thousands of organizations, not a hypothetical

## 🧪 Hands-on lab — map your own trust assumptions

You don't need a company network to do this exercise.

1. List every application or service you use regularly (work or personal) — email, a file share, a wiki, a personal cloud drive.
2. For each, write down: how does it currently decide whether to trust a request? ("It's on my home Wi-Fi," "I'm logged into the VPN," "I have a valid session cookie," etc.)
3. Circle any answer that's purely about *network location* rather than *verified identity + device + context*. Those are perimeter-model trust decisions.
4. For one circled item, sketch what a Zero Trust version would check instead (stronger auth? device health? something else?).

:::challenge Test yourself
1. Explain in one sentence why "I'm on the VPN" is a weaker trust signal today than it was twenty years ago.
2. Which of the three core principles most directly limits the damage of a single compromised laptop, and why?
3. A vendor says "install our appliance and you'll have Zero Trust." What's the accurate one-sentence pushback?
:::

## Key terms

- **Perimeter model** — the traditional security approach that trusts traffic based on network location (inside vs. outside a firewall)
- **Lateral movement** — an attacker moving from one compromised system to another inside a network
- **Policy engine** — the component that evaluates every access request against identity, device, and context signals
- **Least privilege** — granting only the minimum access necessary for a given task

## Recap

Zero Trust replaces "trusted because you're inside the network" with "trusted because this specific request was verified, right now, on its own merits." It's built on three principles — never trust/always verify, least privilege, and assume breach — and it's an architecture and a mindset, not a product you buy. The rest of this path builds out each piece: identity, device trust, network segmentation, continuous verification, and how to actually roll this out in a real organization.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — the foundational US government reference
- [Google BeyondCorp research papers](https://cloud.google.com/beyondcorp) — one of the earliest large-scale real-world implementations
???
