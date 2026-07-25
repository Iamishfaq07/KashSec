# Zero Trust for Remote & Hybrid Work

Zero Trust and remote work grew up together — the perimeter-based model this path opened by describing was already breaking under a distributed workforce before it fully collapsed. This lesson pulls together how the pieces you've already learned combine specifically for remote and hybrid employees.

:::tip
Remote work isn't a special case that needs its own separate security model bolted onto Zero Trust — it's the scenario Zero Trust was substantially designed to handle well from the start. If your architecture needs a different, weaker set of rules for remote employees than for people in the office, that's a sign the architecture isn't actually perimeter-independent yet.
:::

## Why remote work exposed the perimeter model's failure first

The what-is-Zero-Trust lesson opened this path by explaining why the perimeter model broke. Remote work is where that break became impossible to ignore: a home network, a coffee shop Wi-Fi, and a corporate office are not meaningfully different trust zones once "inside the corporate network" stops being a coherent concept at all — remote work simply made that reality visible faster than anything else could have.

## Applying the full stack to a remote employee

- **Identity** — the same MFA and conditional access from the identity-as-perimeter lesson, with location and network signals (an unfamiliar country, an anonymizing VPN) feeding directly into risk-based access decisions
- **Device posture** — arguably more important for remote work than office work, since a remote device is never physically inspectable and personal devices are more likely to be involved (BYOD scenarios), making the device-trust-posture lesson's checks the primary signal of whether a device can be trusted at all
- **ZTNA over VPN** — the ZTNA vs. VPN lesson's argument applies most visibly here: a remote employee gets access to the specific applications they need, never a foothold on the broader corporate network, regardless of which network their laptop happens to be connected to
- **Continuous verification** — a session that starts on a trusted home network and later shows signs of a SIM-swap-enabled account takeover, or an impossible-travel login pattern, gets caught by the same adaptive, in-session risk evaluation the continuous-verification lesson covered — remote work has no "physical office" fallback signal, making this layer do more work than it might in a hybrid scenario

## Split tunneling and the temptation to cut corners

A common remote-work shortcut: **split tunneling**, where only traffic destined for corporate resources routes through the secure connection, and everything else (personal browsing, other services) goes directly to the internet unmonitored. This is efficient, but it recreates a version of the implicit-trust gap the common-pitfalls lesson warned about — the device itself may still be compromised through that unmonitored traffic, and a Zero Trust architecture that only verifies the corporate-bound portion of a session is only partially applying its own principles.

:::challenge Evaluate a hybrid policy
A company gives office-based employees streamlined, low-friction access (device checks run once per day) but requires remote employees to re-verify device posture and re-authenticate every two hours, reasoning that remote work is inherently riskier.

<details><summary>Hint</summary>Does "inside the office" actually provide a meaningfully different trust signal than "at home," under the Zero Trust principles this entire path has built? What does treating them differently imply about the architecture?</details>
<details><summary>Show answer</summary>This policy quietly reintroduces the perimeter model this path opened by rejecting — it treats physical office location as an implicit trust signal, exactly the assumption Zero Trust exists to remove. A consistent architecture applies the same continuous, risk-based verification cadence regardless of location, adjusting frequency based on *actual risk signals* (an anomalous login pattern, a failed device posture check, unusual data access) rather than a blanket assumption that "in the building" is inherently safer. If the office network genuinely offers stronger real signals — say, a managed, monitored corporate network with no BYOD — that's a legitimate input to the risk score, but it should be evaluated the same way for every user, not applied as a flat, location-based double standard.</details>
:::

## 🧪 Hands-on lab — design a remote access policy

Sketch a remote-work access policy using at least four techniques from this path (identity, device posture, ZTNA, continuous verification) and explicitly note where, if anywhere, it treats remote and office-based access differently — and justify each difference with a real risk signal rather than location alone.

:::challenge Test yourself
1. Why did remote work expose the perimeter model's weaknesses before other factors did?
2. What's the risk of split tunneling in a Zero Trust remote-access design?
3. Why is treating "in the office" as inherently more trustworthy than "remote" inconsistent with Zero Trust principles?
:::

## Key terms

- **Split tunneling** — routing only corporate-destined traffic through a secure connection while other traffic bypasses it unmonitored
- **BYOD (Bring Your Own Device)** — employees using personally-owned devices for work, common in remote settings and requiring the same posture verification as corporate-managed devices

## Recap

Remote and hybrid work isn't a special case Zero Trust needs a separate model for — it's close to the scenario the architecture was built around from the start, and applying the full stack (identity, device posture, ZTNA, continuous verification) consistently, regardless of physical location, is what actually delivers on the never-trust-always-verify principle. Any policy that quietly trusts "in the office" more than "at home" without a specific risk signal justifying it has reintroduced the exact perimeter assumption this path opened by explaining had already broken.

???refs
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) — remote workforce considerations across all five pillars
???
