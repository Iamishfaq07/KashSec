# Security Policies & Awareness Training

The phishing lesson showed exactly how attackers manipulate people. This lesson covers the organizational side of the same coin: the policies and training programs organizations build specifically to make that manipulation less likely to succeed.

## What a security policy actually is

A **security policy** is a formal, documented statement of an organization's security requirements and expectations — not a technical control itself, but the administrative control (from the security-controls-types lesson) that defines what technical and behavioral standards *should* exist in the first place. A password policy, an acceptable-use policy, and a remote-work security policy are all examples you've likely encountered, often without thinking of them by this name.

## Why policy matters even though it's "just paper"

A policy alone doesn't stop an attack — but it does several genuinely important things: it creates a documented, defensible standard an organization can be held accountable to (relevant to Path 23's GRC/compliance material), it gives employees clear expectations rather than ambiguous guesswork, and it provides the actual justification for the technical controls built on top of it — an MFA requirement enforced through technology exists *because* a policy decided MFA should be required in the first place.

## Security awareness training: turning policy into behavior

**Security awareness training** teaches employees to recognize and respond appropriately to real threats — directly building on Path 00's phishing-recognition material and this path's own phishing lesson, but delivered at organizational scale, often including simulated phishing exercises that test whether training is actually translating into real behavior change.

:::tip Why simulated phishing tests matter
An organization that trains employees on phishing recognition but never actually tests whether that training worked is measuring intent, not outcome. A simulated phishing campaign — a deliberately crafted, harmless test email sent internally — provides a genuine, measurable signal about whether the training actually changed real-world behavior, and identifies specifically who might benefit from additional, targeted training.
:::

## The gap between having a policy and actually following it

A genuinely common real-world finding in security assessments: an organization has a well-written password policy requiring MFA everywhere, but enforcement is inconsistent, exceptions accumulate informally over time, and nobody actually audits compliance against the policy's own stated requirements. A policy that exists on paper but isn't actually enforced or measured provides essentially none of the protection it was written to provide — directly connecting to the security-metrics lesson later in this path, which covers actually measuring whether security programs work as intended.

:::challenge Test yourself
Why might an organization with a well-written, comprehensive security policy still suffer a preventable security incident?
<details><summary>Show answer</summary>A policy is a documented statement of intent and expectation — it has no inherent enforcement mechanism of its own. If the policy isn't actually backed by enforced technical controls (an MFA requirement that's genuinely enabled everywhere, not just recommended), consistent training that measurably changes behavior, and regular auditing to confirm actual compliance, the gap between what the policy <em>says</em> should happen and what actually <em>does</em> happen in practice is exactly where preventable incidents occur. A policy is necessary — it defines what "good" looks like and justifies the controls built on top of it — but it's not sufficient on its own; it needs to be actively enforced, trained, and measured to translate from a document into genuine behavior change and technical reality.</details>
:::

## Key terms

- **Security policy** — a formal, documented statement of an organization's security requirements and expectations.
- **Security awareness training** — organization-wide training teaching employees to recognize and respond to real security threats.
- **Simulated phishing campaign** — a deliberate, harmless internal test measuring whether phishing-recognition training actually changed real behavior.

## Recap

- A security policy defines organizational expectations and justifies the technical controls built on top of it — it's an administrative control, not a technical one.
- Security awareness training turns policy into practiced behavior, and simulated phishing campaigns provide a genuine, measurable test of whether that training actually worked.
- A policy that exists but isn't enforced, trained, and audited provides little real protection — the gap between documented intent and actual practice is exactly where preventable incidents happen.

**Next up →** [Protect yourself: practical hardening](#/lesson/10-fundamentals/protect-yourself)
