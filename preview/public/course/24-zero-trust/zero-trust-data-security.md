# Data-Centric Zero Trust

Every lesson so far has protected the *paths* to data — identity, device posture, segmentation, ZTNA. This lesson flips the focus onto the data itself: what happens when the access controls are bypassed anyway, and the data is the last line of defense.

:::tip
A useful mental model: every other Zero Trust control in this path answers "should this request reach the data?" Data-centric controls answer a different question: "if it does reach the data, what can it actually do with it?" Real Zero Trust programs need both.
:::

## Why data-centric controls matter even with everything else in place

Perfect identity verification, perfect device posture checks, and perfect micro-segmentation still leave one gap: a legitimate, verified, healthy device belonging to a legitimate, verified user can still be the source of a data breach — through a compromised session, an insider threat, or simple human error like an accidental share. Data-centric controls are what limits the blast radius *after* every upstream control has already been satisfied.

## The core techniques

- **Data classification** — labeling data by sensitivity (public, internal, confidential, restricted) so every other control downstream can apply rules automatically, rather than requiring a human judgment call every time
- **Encryption at rest and in transit, tied to identity** — modern data-centric encryption increasingly ties decryption rights to the same identity and conditional-access signals covered in the identity-as-perimeter lesson, rather than treating "has the encryption key" and "is authorized right now" as separate questions
- **Data Loss Prevention (DLP)** — automated detection and blocking of sensitive data leaving through unauthorized channels (an unapproved cloud upload, a personal email attachment), enforced continuously rather than relying on a one-time access decision
- **Rights management** — controls that travel *with* the file itself (who can open it, print it, forward it, and for how long), so protection persists even after the file leaves the environment where the access decision was originally made

## How this connects to continuous verification

The continuous verification lesson covered adaptive, in-session risk evaluation. Data-centric controls are where that evaluation actually gets enforced at the point of impact: a session that becomes suspicious mid-stream can have its *data access* restricted immediately — blocking a download or an export — even if outright terminating the session isn't yet justified by the risk signal alone.

:::challenge Design the missing control
A sales employee's laptop passes every device-posture check and their login satisfies MFA. Mid-session, they attempt to export the entire customer database to a personal USB drive — a volume and pattern of access completely inconsistent with their normal daily use.

<details><summary>Hint</summary>Every identity and device check this employee passed was correct and legitimate at login. What kind of control catches a legitimate, authenticated user doing something their role doesn't justify, in the moment it happens?</details>
<details><summary>Show answer</summary>This is exactly the gap data-centric controls close. Data classification would have flagged the customer database as sensitive; DLP monitoring tied to that classification would recognize an export of this volume and destination as anomalous regardless of the user's valid authentication; and continuous verification's risk-scoring could trigger an automatic block or require step-up authentication before the export completes. No identity or device check alone would have caught this — the user genuinely was who they claimed to be, on a genuinely healthy device. The control that matters here operates on the data and the *behavior*, not the identity.</details>
:::

## 🧪 Hands-on lab — classify and control

Pick three types of data a fictional company handles (customer PII, source code, internal financial reports). For each, assign a classification tier and specify one concrete data-centric control (DLP rule, rights-management setting, or encryption policy) appropriate to that tier.

:::challenge Test yourself
1. Why are data-centric controls necessary even when identity and device controls are working correctly?
2. What's the practical benefit of tying decryption rights to the same identity signals used for access decisions elsewhere?
3. How does continuous verification connect to data-centric enforcement in practice?
:::

## Key terms

- **Data classification** — labeling data by sensitivity so downstream controls can apply automatically
- **DLP (Data Loss Prevention)** — automated detection and blocking of sensitive data leaving through unauthorized channels
- **Rights management** — protection that travels with a file itself, persisting beyond the environment where access was originally granted

## Recap

Data-centric controls are the last line of defense in a Zero Trust architecture — the layer that limits damage when every upstream control (identity, device, network) has already been satisfied by a legitimate but misbehaving session. Classification, DLP, and rights management work together to make sure "access was granted" doesn't automatically mean "unlimited use is possible," which is exactly the gap a purely access-focused Zero Trust rollout leaves open.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — includes data-centric considerations within the broader ZTA model
???
