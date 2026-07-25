# Zero Trust for Third Parties & Vendor Access

Every control in this path so far has assumed the person or device requesting access belongs to your own organization. This lesson covers the harder case: contractors, vendors, and partners who genuinely need access but were never issued a corporate device or a permanent employee identity.

:::tip
Third-party access is a disproportionately common breach vector precisely because it's the case organizations most often solve with a shortcut — a shared VPN credential, a vendor's own unmanaged laptop, standing access granted once and never revisited — that quietly bypasses every Zero Trust control built for the regular workforce.
:::

## Why third-party access resists the standard playbook

- **No corporate-managed device** — the device posture checks from the device-trust lesson assume a device your organization can enroll and inspect; a vendor's own laptop usually isn't one
- **Access needed for a limited, specific purpose** — a contractor typically needs one application or one system, not the broad access an employee accumulates over a career, making over-provisioning both more likely and more damaging
- **Identity lifecycle outside your control** — when a vendor employee leaves *their* company, your organization often has no automatic signal to revoke the access you granted them

## Adapting Zero Trust principles to third parties

- **Federated identity instead of local accounts** — where possible, authenticate third parties through their own organization's identity provider (extending the identity-as-perimeter lesson's trust in a verified identity source) rather than creating and managing yet another local account your team has to remember to disable
- **ZTNA over VPN, especially here** — the ZTNA vs. VPN lesson's core argument applies with extra force to third parties: granting access to one specific application rather than the network avoids ever placing an unmanaged vendor device inside your broader network at all
- **Time-boxed, purpose-scoped access** — third-party access should default to expiring, tied to the specific engagement or contract period, rather than persisting indefinitely on the assumption someone will remember to revoke it
- **Elevated monitoring, not reduced** — precisely because a third party's device can't be verified with the same posture checks as a managed device, the traffic and behavior from that access deserves closer scrutiny, not less

:::challenge Design third-party access for a real scenario
A software vendor's support engineer needs occasional access to troubleshoot one specific internal application, for the duration of a one-year support contract.

<details><summary>Hint</summary>What would a VPN-based, standing-access approach get wrong here, on each of the dimensions this lesson has covered — device trust, scope, and lifecycle?</details>
<details><summary>Show answer</summary>A VPN grant would place an unmanaged, unverifiable vendor device onto the broader network, provide access far broader than "one specific application," and — without a specific and enforced expiration — very likely outlive the contract itself. The Zero Trust-aligned design instead: authenticate the engineer through their own company's identity provider via federation, grant ZTNA-style access scoped to exactly the one application they support (nothing else on the network is ever reachable), set the access to automatically expire at the contract's end date rather than relying on someone remembering to revoke it, and apply elevated session monitoring given the device itself can't be posture-checked the way an internal device can.</details>
:::

## 🧪 Hands-on lab — audit a vendor access policy

List three third-party or vendor accounts (real or hypothetical) with access to a system you're familiar with. For each, note: is the access scoped to a specific need, does it expire, and is the device it's used from ever verified in any way? Identify the biggest gap and propose one concrete fix from this lesson.

:::challenge Test yourself
1. Why does device posture verification usually fail for third-party access, and what does Zero Trust do instead?
2. Why is federated identity often preferable to creating local accounts for vendors?
3. Why does third-party access deserve *more* monitoring, not less, compared to internal employee access?
:::

## Key terms

- **Federated identity** — authenticating a user through their own organization's identity provider rather than creating a separate local account
- **Time-boxed access** — access explicitly scoped to expire at a defined point, rather than persisting indefinitely

## Recap

Third-party and vendor access is a disproportionately common breach vector precisely because it's the case most often solved with a shortcut that bypasses every other Zero Trust control this path has built. Federated identity, ZTNA-style application-scoped access, explicit time-boxing tied to the engagement, and elevated monitoring adapt the same never-trust-always-verify principles to a population your organization can't fully manage the way it manages its own employees and devices.

???refs
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) — covers third-party access considerations within the broader maturity framework
???
