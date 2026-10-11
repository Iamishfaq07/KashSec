# Threat Hunting Fundamentals

The DFIR lesson covered how to respond once an incident is already detected. This lesson covers the proactive discipline that exists specifically to find what hasn't triggered any alert at all — directly connecting to Path 24's UEBA/behavioral-analytics lesson, since threat hunting is the human-driven investigative practice built on top of exactly that behavioral-baseline foundation.

## Why threat hunting exists at all

A genuinely important, sobering premise: any detection system — SIEM rules, EDR signatures, UEBA baselines — only catches what it was specifically designed or trained to catch. **Threat hunting** is the proactive, hypothesis-driven practice of actively searching for evidence of compromise that existing automated detection missed entirely, operating on the assumption that a sufficiently capable attacker (directly connecting to Path 14's living-off-the-land techniques) can and does evade automated detection deliberately.

## Hunting is hypothesis-driven, not random browsing

The core methodology distinguishing threat hunting from simple log review: a hunter starts with a specific, falsifiable **hypothesis** — "if an attacker used Kerberoasting against our domain in the last 30 days, what evidence would that leave, and does it exist in our logs?" (directly connecting to Path 16's kerberos-attacks-deep-dive lesson) — rather than open-endedly browsing logs hoping something looks suspicious. A good hypothesis is grounded in specific attacker techniques, often drawn directly from the MITRE ATT&CK framework's documented technique library.

## The MITRE ATT&CK framework as a hunting roadmap

MITRE ATT&CK organizes real-world adversary behavior into tactics (the attacker's goal — persistence, lateral movement) and techniques (the specific method — a Registry Run key from the malware-persistence lesson, DCSync from the AD-persistence lesson). A mature hunting program works systematically through relevant ATT&CK techniques, asking for each one: "do we have visibility to detect this, and have we actually looked?" — turning the entire framework into a structured hunting checklist rather than just a reference for after-the-fact incident classification.

## A worked hunting example

1. **Hypothesis**: "An attacker with a compromised low-privilege account attempted Kerberoasting against our domain."
2. **Data needed**: Windows Security Event ID 4769 (Kerberos service ticket requests) across all Domain Controllers.
3. **Query**: filter for 4769 events using RC4 encryption (a weaker, more crackable cipher than AES, and a genuine red flag if AES is the domain's configured standard) at unusual volume from a single account.
4. **Investigate hits**: for any account matching that pattern, check whether the volume and timing is consistent with a legitimate application's behavior or looks like automated ticket harvesting.
5. **Conclude and document**: whether or not evidence of the hypothesized activity is found, document the hunt itself — a "hunted for X, found nothing" result is still genuinely valuable, since it confirms detection coverage for that specific technique.

## Why "found nothing" is still a valuable outcome

:::tip A completed hunt with no findings isn't a wasted hunt
Directly connecting to Path 23's GRC/compliance framing of continuous improvement: a hunt that concludes "we have visibility into this technique and found no evidence of it" measurably improves an organization's confidence in its actual detection coverage — distinct from simply assuming coverage exists without ever verifying it. Threat hunting programs that only report findings when something bad is found create a perverse incentive to hunt less rigorously; tracking hunts completed (regardless of outcome) as a genuine metric avoids that trap.
:::

## Hunting versus incident response, distinguished

Directly connecting back to the DFIR lesson: incident response is fundamentally reactive, beginning after detection (automated or human) has already occurred; threat hunting is proactive, actively searching before any alert has fired at all. In practice, a successful hunt that *does* find evidence of compromise transitions directly into the DFIR lesson's incident response process — the two disciplines are sequential partners, not competing alternatives.

:::challenge Test yourself
Why does a hypothesis-driven approach produce more valuable threat hunting than open-ended log browsing, even for an experienced analyst?
<details><summary>Show answer</summary>Modern environments generate an overwhelming volume of log data — far more than any human could meaningfully review without a specific, narrowing focus — meaning open-ended browsing tends to either miss genuinely subtle evidence buried in noise, or waste significant analyst time on log entries that turn out to be entirely benign. A specific, falsifiable hypothesis (grounded in a known attacker technique from a framework like MITRE ATT&CK) narrows the search to exactly the data source and pattern that technique would actually produce if present, letting the analyst build a targeted, repeatable query rather than relying on pattern recognition alone across an unmanageable volume of unrelated data. This also makes hunting programs measurable and improvable over time in a way open-ended browsing never can be — a specific hypothesis either gets confirmed, refuted, or reveals a genuine visibility gap (data that would be needed to test it isn't even being collected), each of which is a concrete, actionable outcome that open-ended review rarely produces as cleanly.</details>
:::

## Key terms

- **Threat hunting** — the proactive, hypothesis-driven search for evidence of compromise that automated detection missed.
- **MITRE ATT&CK** — a framework organizing real-world adversary tactics and techniques, used as a systematic hunting roadmap.
- **Hunting hypothesis** — a specific, falsifiable statement about a possible attacker technique, tested against actual log data.

## Recap

- Threat hunting proactively searches for compromise evidence that automated detection systems missed, operating on the assumption that capable attackers evade automation deliberately.
- Effective hunts are hypothesis-driven, grounded in specific techniques from frameworks like MITRE ATT&CK, rather than open-ended log browsing.
- A hunt concluding "found nothing" is still a genuinely valuable outcome, confirming actual detection coverage rather than assumed coverage.
- Hunting and incident response are sequential partners — a successful hunt that finds evidence transitions directly into the DFIR process.

**Next up →** [Choosing your specialisation](#/lesson/16-advanced/specialise)
