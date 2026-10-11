# Identity as the New Perimeter

If the network location can't be trusted, something else has to become the primary control point. In Zero Trust, that's **identity** — a strongly verified, continuously checked answer to "who (or what) is actually making this request?"

:::tip
A useful reframe: identity isn't just "who logged in this morning." In Zero Trust, identity is checked (and can be re-checked) on every meaningful request, not established once at login and then assumed for the rest of the session.
:::

## Why identity became the anchor

Every other Zero Trust control — device checks, network segmentation, authorization decisions — has to be *attached to something*, and that something is almost always "which identity is this." A device policy is meaningless without knowing whose device it is. A least-privilege authorization decision is meaningless without knowing who's asking. Identity is the thread that runs through the entire model.

This is why the phrase "identity is the new perimeter" shows up constantly in Zero Trust material — not because the network stopped mattering, but because identity became the *primary* thing worth defending and verifying, with the network relegated to a secondary signal.

## The building blocks

| Component | What it does | Why it matters here |
|---|---|---|
| Identity Provider (IdP) | Central source of truth for who a user is (Okta, Azure AD/Entra ID, Google Workspace) | Every other system defers to it instead of managing its own separate login |
| Single Sign-On (SSO) | One strong login grants access across many apps | Fewer passwords floating around, one place to revoke access instantly |
| Multi-Factor Authentication (MFA) | A second, independent proof of identity beyond a password | Passwords alone are compromised constantly — phishing, reuse, leaks |
| Conditional Access | Rules that adjust what's allowed based on context (location, device health, risk score) | Turns identity from a yes/no gate into a continuously adjustable dial |

## MFA is necessary, not sufficient

MFA dramatically reduces account-takeover risk — but it is not itself Zero Trust, and not all MFA is equally strong:

- **SMS codes** — better than nothing, but vulnerable to SIM-swapping and interception
- **Authenticator app codes (TOTP)** — meaningfully stronger, still phishable (a fake login page can relay the code in real time)
- **Push notifications** — convenient, but vulnerable to "MFA fatigue" attacks, where an attacker spams push requests hoping a tired user taps "approve" by mistake
- **Hardware security keys (FIDO2/WebAuthn)** — cryptographically bound to the real site, effectively unphishable, currently the strongest widely-deployed option

:::danger
MFA fatigue attacks are not theoretical — they've been used in several major real-world breaches. An attacker with a stolen password sends repeated push notifications, sometimes at 2am, until an annoyed or confused user approves one just to make it stop. The fix isn't "trust users to always say no" — it's number-matching (the app shows a code the user must type, not just tap approve) and rate-limiting how often a login can trigger new pushes.
:::

## Conditional access: identity as a dial, not a switch

A login isn't just "allowed" or "denied" — conditional access lets an organization set rules like:

- Allow access from a managed, patched company laptop with no extra prompt
- Require an additional MFA challenge if the login comes from a new country
- Block access entirely from a device flagged as compromised, regardless of correct credentials
- Require step-up authentication (a fresh MFA prompt) before an already-logged-in user can access something especially sensitive, like payroll data

This is the practical mechanism that makes "continuous verification" real rather than aspirational — the system keeps evaluating context throughout a session, not only at the login screen.

## A worked example: the same login, two different outcomes

Alice logs into the company's HR system from her laptop.

- **Scenario A**: She's on her managed company laptop (patched, EDR agent reporting healthy), in her usual country, during business hours. Conditional access sees low risk and lets the login through with just her usual MFA push.
- **Scenario B**: The same username and correct password are used an hour later from a browser in a country Alice has never logged in from, on a device with no management agent at all. Conditional access flags this as high-risk: it can require a hardware-key challenge Alice's real device would satisfy easily but an attacker likely can't, or block the login outright and alert the security team.

Same credentials, wildly different outcome — because identity in Zero Trust isn't just "did they know the password," it's "does everything about this request look like the real Alice."

## Service identity, not just human identity

Zero Trust identity isn't only about people logging in. Services calling other services need identity too:

- **API keys and static secrets** are the weak version — long-lived, easily leaked, hard to rotate cleanly
- **Short-lived, cryptographically issued service identities** (like SPIFFE/SPIRE, or cloud-native workload identity) are the Zero Trust-aligned version — a service proves who it is with a credential that expires in minutes and was never manually copied anywhere

This connects directly to a theme from the DevSecOps path: preferring OIDC-issued short-lived credentials over static API keys is a Zero Trust principle in practice, even if nobody in that conversation used the phrase "Zero Trust."

## 🧪 Hands-on lab — audit your own MFA posture

1. List every account you have that supports MFA (email, banking, work accounts, social media).
2. For each, note which MFA method you're currently using: none, SMS, authenticator app, push, or hardware key.
3. Identify your single most valuable account (usually your primary email, since it's often the recovery path for everything else) and check: is it using your strongest available MFA method?
4. If any high-value account is using SMS or nothing at all, upgrade it now to at least an authenticator app — this is one of the highest-value 15-minute security improvements available to any individual.
5. Write one sentence on why your primary email deserves stronger MFA than a low-value account you rarely use.

:::challenge Test yourself
1. Why is a hardware security key considered "unphishable" in a way that a 6-digit authenticator app code isn't?
2. Explain how a conditional access policy could let the same correct password succeed in one context and fail in another.
3. Why does Zero Trust care about service-to-service identity, not just human logins?
:::

## Key terms

- **Identity Provider (IdP)** — the central system that authenticates users and issues identity for other applications to trust
- **Conditional Access** — policy rules that adjust access decisions based on real-time context (device, location, risk)
- **MFA fatigue attack** — spamming push-based MFA approvals hoping a user taps "approve" out of annoyance or confusion
- **FIDO2/WebAuthn** — a phishing-resistant authentication standard using hardware-bound cryptographic keys
- **Step-up authentication** — requiring a fresh, stronger authentication challenge before an already-logged-in session can access something more sensitive

## Recap

Identity is the anchor Zero Trust's other controls attach to — but strong identity means more than "has a password": it means phishing-resistant MFA, continuous risk-based evaluation through conditional access, and identity for services as well as people. Getting this layer right is usually the highest-leverage first step in any real Zero Trust rollout, which is exactly why the next lesson builds on it with device trust.

???refs
- [NIST SP 800-63 — Digital Identity Guidelines](https://pages.nist.gov/800-63-4/) — the authoritative reference on authentication assurance levels
- [FIDO Alliance](https://fidoalliance.org/) — the standards body behind FIDO2/WebAuthn hardware key authentication
???
