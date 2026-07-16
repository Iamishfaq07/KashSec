# Threat Modeling Lab

Threat modeling is how security gets built into a system *before* it's built, rather than bolted on afterward through a penetration test. This lab has you produce a real, complete threat model for a realistic feature, using the most widely taught framework in the industry.

## Recommended framework — STRIDE

**STRIDE** (developed at Microsoft, still the most widely taught threat modeling framework today) breaks threats into six categories, each mapped to a security property being violated:

| Letter | Threat | Violates |
|---|---|---|
| **S** | Spoofing | Authentication (pretending to be someone else) |
| **T** | Tampering | Integrity (modifying data or code without authorization) |
| **R** | Repudiation | Non-repudiation (denying an action you actually took) |
| **I** | Information Disclosure | Confidentiality (exposing data to those unauthorized) |
| **D** | Denial of Service | Availability (making a system unusable) |
| **E** | Elevation of Privilege | Authorization (gaining more access than intended) |

## Lab exercise

1. **Choose a simple feature.** A login system is the classic, well-understood choice — small enough to model completely in one sitting, but rich enough to produce threats in every STRIDE category. (A file upload feature, covered in Path 07, is a great second exercise once you've done this once.)
2. **Create a data flow diagram (DFD).** Sketch the feature at a high level: the user's browser, the web server, the authentication logic, and the database, with arrows showing data flowing between them. It doesn't need to be polished — a simple `mermaid` flowchart or even a hand-drawn box diagram is exactly what real threat modeling sessions produce.
   ```mermaid
   flowchart LR
       A[User Browser] -->|username + password| B[Web Server]
       B -->|check credentials| C[(User Database)]
       C -->|match/no match| B
       B -->|session token| A
   ```
3. **Walk each element against STRIDE.** For every arrow and box in your diagram, ask all six STRIDE questions: Could someone spoof this data flow (e.g., is the login form itself vulnerable to being faked via a phishing clone)? Could the credentials be tampered with in transit? Could someone deny having logged in and taken a malicious action? Is anything here exposed that shouldn't be (password hashes, error messages revealing which field was wrong)? Could this endpoint be flooded to deny service? Could a bug here let a regular user gain admin privileges?
4. **Prioritize and mitigate.** For each identified threat, assign a rough severity (Path 09's CVSS/impact reasoning applies directly here) and propose a specific, concrete mitigation — not a vague "add security," but something like "use HTTPS to prevent credential tampering in transit" or "implement rate limiting on the login endpoint to prevent brute-force denial of service."

:::tip Threat modeling works best early and often
The whole point of threat modeling is to catch design-level security issues *before* a single line of code is written — fixing a threat at the design stage costs a diagram change; fixing the same issue after launch costs a patch, a disclosure process, and possibly an incident response. Revisit your threat model whenever the design changes meaningfully, not just once at the start.
:::

:::challenge Produce a real threat model document
Write up your complete threat model for the login system: the data flow diagram, at least one identified threat per STRIDE category (six total, minimum), a severity rating for each, and a specific mitigation for each. This exact document format — DFD plus a STRIDE-categorized threat table — is what real application security teams produce during design review.
:::

## Key takeaway

STRIDE's real value is **systematic coverage** — without a framework, threat brainstorming tends to fixate on whatever attack is currently popular or memorable, missing entire categories. Walking every data flow against all six letters, every time, catches threats an unstructured brainstorm reliably misses.

**Next up →** [Windows Privilege Escalation Lab](#/lesson/11-advanced/windows-privesc-lab)
