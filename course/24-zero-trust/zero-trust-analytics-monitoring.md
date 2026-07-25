# Analytics & Monitoring for Zero Trust

Every control in this path — identity, device, network, application, data — generates signal. This lesson covers the piece that ties them together: the analytics layer that turns those separate signals into the risk-based decisions the continuous-verification lesson described.

:::tip
Zero Trust without strong analytics is just a collection of independently configured controls that happen to sit next to each other. The analytics layer is what makes them behave as a *system* — where a weak signal from one pillar (an unusual login location) combines with a weak signal from another (an unusual data access pattern) to produce a strong, actionable risk score that neither signal alone would justify.
:::

## Why single-signal decisions aren't enough

A login from an unfamiliar country isn't automatically malicious — plenty of legitimate travel produces exactly that signal. A large data export isn't automatically malicious either — some jobs require it routinely. Evaluated in isolation, most individual signals are too noisy to act on confidently. Evaluated *together*, an unfamiliar-location login followed shortly by an unusual data export from an account that's never done either before is a very different picture — and building that combined picture requires an analytics layer, not a set of independent alerting rules.

## User and Entity Behavior Analytics (UEBA)

**UEBA** builds a behavioral baseline for every user and entity (including the non-human service identities from the API-security lesson) — normal login times, normal data access volume, normal application usage — and flags deviations from that individual baseline, rather than comparing everyone against one fixed, generic rule. This directly extends the continuous-verification lesson's adaptive risk scoring: UEBA is frequently the engine actually computing that risk score behind the scenes, using inputs from every other pillar this path has covered.

## What feeds the analytics layer

- **Identity signals** — login location, time, device used, MFA method, from the identity-as-perimeter lesson
- **Device posture signals** — compliance state, patch level, from the device-trust-posture lesson
- **Network and application signals** — which services were accessed, from where, via the microsegmentation and ZTNA lessons
- **Data signals** — classification-tagged access and DLP events, from the data-centric Zero Trust lesson
- **Privileged access signals** — elevation requests and privileged session activity, from the PAM lesson

A mature Zero Trust analytics layer correlates across all five of these, which is exactly why the maturity model treats analytics maturity as a marker of overall program maturity rather than a standalone pillar of its own — it's the connective tissue between the pillars.

:::challenge Correlate the signals
Three individually unremarkable events occur within twenty minutes: (1) a login from a new device that passes MFA, (2) a device posture check that comes back "compliant" but with an unusually old patch report timestamp, (3) an attempt to access a customer database the user has never touched before.

<details><summary>Hint</summary>Would any single one of these three events alone justify blocking the session? What changes when an analytics layer considers all three together?</details>
<details><summary>Show answer</summary>Individually, none of these three events would typically justify blocking access — new devices happen, slightly stale posture reports happen, and job roles genuinely change. Correlated together by a UEBA-style analytics layer, the combination is a meaningfully different signal: a new device, with a posture check that's technically compliant but suspiciously stale (worth investigating on its own), immediately followed by access to a sensitive resource this specific user has never touched. This is exactly the kind of composite risk score the continuous-verification lesson described being used for step-up authentication or a temporary data-access restriction — not because any one signal is damning, but because the combination deviates sharply from this user's established baseline.</details>
:::

## 🧪 Hands-on lab — design a correlation rule

Pick two signal types from different pillars (for example, an identity signal and a data signal). Write a one-sentence correlation rule that would flag a session as elevated risk only when *both* signals are present together, and explain why neither alone should trigger the same response.

:::challenge Test yourself
1. Why are single-signal alerts often too noisy to act on confidently by themselves?
2. What does UEBA baseline behavior *against*, and why does that matter compared to a single fixed rule for all users?
3. Why is the analytics layer described as "connective tissue" between the five Zero Trust pillars rather than a pillar of its own?
:::

## Key terms

- **UEBA (User and Entity Behavior Analytics)** — analytics that build an individual behavioral baseline and flag deviations from it, for both human users and non-human service identities
- **Composite risk score** — a risk evaluation combining multiple signals across pillars, rather than any single signal in isolation

## Recap

The analytics layer is what turns Zero Trust's separate identity, device, network, application, and data controls into a coordinated system rather than a collection of independently configured pieces — correlating individually weak, noisy signals into the composite risk scores that drive the continuous, adaptive access decisions this entire path has been building toward. UEBA's individual behavioral baselining is the typical engine behind this correlation, and its maturity is one of the clearest real-world markers of how genuinely integrated — versus merely deployed — a Zero Trust architecture actually is.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — covers the policy engine's role in synthesizing signals across trust algorithm inputs
???
