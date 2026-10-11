# Scope and Legal Boundaries

The choose-programs lesson touched on reading scope carefully. This lesson makes that explicit and legal, not just strategic — directly connecting to Path 14's rules-of-engagement-deep-dive lesson, since a bug bounty program's scope document is functionally the same authorization boundary as a formal pentest's RoE, just written for a much broader, public audience of researchers.

## Scope is the entire legal basis for your testing

Directly connecting to Path 01's CFAA-and-ethics lesson: a bug bounty program's published scope is what transforms otherwise-unauthorized computer access into legally protected security research. Testing outside that scope — even against a system that seems obviously related, even with genuinely good intentions — receives none of that protection, and can expose a researcher to real legal risk regardless of skill or intent.

## Reading a scope document like a contract

- **In-scope assets** — the exact domains, subdomains, IP ranges, or applications explicitly listed as testable
- **Out-of-scope assets** — explicitly excluded systems, often third-party integrations, staging environments the company doesn't control, or acquired subsidiaries not yet fully integrated
- **Prohibited techniques** — nearly every program explicitly prohibits denial-of-service testing, automated scanning above a stated rate limit, and social engineering against staff, even against in-scope systems
- **Safe harbor language** — the specific legal commitment (or lack of one) a program makes not to pursue legal action against researchers who test within scope and report responsibly

## Safe harbor, specifically

A **safe harbor** clause is a program's explicit promise not to initiate legal action against a researcher who stays within scope and follows the disclosure process — directly connecting to Path 01's authorized-access framing, this is the closest a bug bounty program gets to the formal get-out-of-jail letter Path 14 described for contracted pentests. Its absence from a program's policy is a genuine warning sign, not a minor omission.

## Third-party scope: a genuinely common trap

:::danger Testing something that "looks" in scope isn't the same as it being in scope
A company's application frequently integrates third-party services — a payment processor, an analytics platform, a cloud storage bucket hosted under a different domain entirely. Finding a vulnerability in one of these integrations feels like a legitimate finding against the target company, but if that specific asset isn't explicitly listed in scope, testing it may mean testing a completely different organization's infrastructure without their authorization at all — exactly the scope-precision problem Path 14's RoE lesson warned about, here with the added complication that the boundary is often genuinely unclear without careful reading.
:::

## Rate limits and aggressive scanning

Nearly every program specifies acceptable request rates for automated tools, directly connecting to the recon-pipeline lesson's tooling: running `nuclei` or `ffuf` at full aggressive speed against a production system can functionally become a denial-of-service attack even without any malicious intent, violating scope even when the underlying vulnerability being searched for would have been perfectly legitimate to report.

:::challenge Test yourself
Why doesn't good intent protect a researcher who tests a third-party integration that turns out to be outside the program's scope?
<details><summary>Show answer</summary>Authorization under laws like the CFAA (covered in Path 01) is based on whether access was actually granted by the entity that owns the system being tested — not on the tester's subjective belief about whether the testing was reasonable or well-intentioned. A company's bug bounty scope only grants authorization for the specific assets it lists; a third-party service integrated into that company's product is owned and operated by a completely different organization that never granted any authorization at all, regardless of how directly related it appears to the original target. Good intent might affect how a situation is handled after the fact (whether the third party chooses to pursue action, for instance), but it does not retroactively create the authorization that never legally existed — exactly the same principle Path 14's RoE lesson emphasized about accidentally testing a shared hosting environment believed to be in scope.</details>
:::

## Key terms

- **Scope document** — the published list of in-scope/out-of-scope assets and permitted techniques for a bug bounty program.
- **Safe harbor** — a program's explicit legal commitment not to pursue action against researchers who test within scope responsibly.
- **Third-party scope trap** — mistakenly testing an integrated but separately-owned service that isn't actually covered by the program's authorization.

## Recap

- A program's scope document is the entire legal basis for authorized testing — the bug bounty equivalent of Path 14's formal RoE document.
- Safe harbor language is the closest equivalent to a get-out-of-jail letter, and its absence is a genuine warning sign.
- Third-party integrations and aggressive automated scanning are two of the most common, genuinely easy-to-make scope violations.

**Next up →** [Building a recon pipeline](#/lesson/15-bug-bounty/recon-pipeline)
