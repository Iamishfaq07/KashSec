# Zero Trust for APIs & Microservices

The ZTNA lesson covered granting access to applications rather than networks. This lesson goes one layer deeper: applying Zero Trust principles *inside* an application — to the APIs and microservices that talk to each other, often with far less scrutiny than the traffic reaching the application's front door.

:::danger
A common and dangerous assumption: "this traffic is inside our network, between our own services, so it doesn't need the same scrutiny as external traffic." Zero Trust's core principle — never trust, always verify — applies exactly as much to service-to-service traffic as it does to a user logging in from the internet. Path 21's API Security material covers BOLA and mass assignment in detail; this lesson is about the architecture that prevents an attacker who reaches one internal service from moving freely to the next.
:::

## Why internal API traffic deserves Zero Trust treatment

In a traditional perimeter model, once traffic is "inside," it's implicitly trusted. Modern microservice architectures make that assumption dangerous: a single compromised service — through a vulnerable dependency, a misconfigured container, or a stolen credential — becomes a launchpad for reaching every other service it can talk to, if internal traffic isn't independently verified. This is the microsegmentation lesson's blast-radius principle, applied specifically to service-to-service API calls rather than network subnets.

## The core techniques

- **Mutual TLS (mTLS) between services** — both sides of a service-to-service connection cryptographically verify each other's identity, not just the connection's encryption, so a service can't simply claim to be something it isn't
- **Service identity, not network location** — a request is authorized based on *which service* is making it (verified cryptographically) rather than *where it's coming from* on the network, which directly extends the identity-as-perimeter principle down to the microservice layer
- **Per-service least privilege** — each microservice is granted access to only the specific other services and data it genuinely needs, mirroring the default-deny principle from the microsegmentation lesson but enforced at the API layer instead of the network layer
- **API gateways enforcing policy at every hop** — rather than trusting that a request which passed through one gateway is safe for the rest of its journey, policy (rate limits, schema validation, authorization) gets re-checked at each service boundary it crosses

## Service mesh: Zero Trust's practical implementation for microservices

A **service mesh** is the infrastructure layer that commonly implements these principles at scale — automatically injecting mTLS between every service, enforcing fine-grained authorization policy, and giving security teams visibility into every service-to-service call without requiring each individual microservice team to implement this logic themselves. This connects directly to the "Zero Trust in cloud-native environments" lesson's coverage of workload identity — a service mesh is often where that workload identity actually gets enforced.

:::challenge Trace an attack path
An attacker compromises a low-privilege internal reporting service through an outdated dependency. The reporting service, once compromised, attempts to call the customer payment service directly.

<details><summary>Hint</summary>In a flat, implicitly-trusted internal network, what would stop this call? In an API-layer Zero Trust architecture, what specifically would?</details>
<details><summary>Show answer</summary>In a traditional flat internal network, likely nothing — "inside the network" was treated as sufficient trust, and the call would succeed. In a Zero Trust API architecture, the call fails at multiple points: mTLS would require the reporting service to present a valid cryptographic identity, but even if it has one (it's a legitimate service, after all), per-service least privilege means the reporting service was never granted the authorization to call the payment service in the first place — that's simply not part of its function. The API gateway or service mesh enforcing policy at that specific hop rejects the call regardless of network location, containing the compromise to the reporting service alone rather than letting it become a path to the payment system.</details>
:::

## 🧪 Hands-on lab — design a service authorization matrix

For a hypothetical e-commerce system with five microservices (auth, catalog, cart, payment, reporting), draw a simple matrix of which services should be allowed to call which others, applying least privilege. Identify at least one call that a flat-trust network would allow but your matrix correctly denies.

:::challenge Test yourself
1. Why is "the traffic is internal" an unsafe justification for skipping authentication between services?
2. What does mTLS verify that a plain TLS connection to an internal service does not?
3. What role does a service mesh typically play in enforcing Zero Trust between microservices?
:::

## Key terms

- **Mutual TLS (mTLS)** — a TLS handshake where both the client and server cryptographically verify each other's identity
- **Service mesh** — infrastructure that automatically enforces identity, encryption, and authorization policy between microservices

## Recap

Zero Trust doesn't stop at the application's front door — internal, service-to-service API traffic needs the same never-trust-always-verify treatment as any external request, enforced through mTLS, service identity, per-service least privilege, and gateway policy checked at every hop. A service mesh is the common practical implementation, turning these principles into infrastructure every microservice inherits automatically rather than something each team has to build independently — directly containing the blast radius when, not if, one internal service is eventually compromised.

???refs
- [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) — covers workload-to-workload trust models
???
