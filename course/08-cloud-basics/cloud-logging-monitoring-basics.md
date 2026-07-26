# Cloud Logging & Monitoring Basics

The identity-access lesson explained who can do what in a cloud account. This lesson covers the equally important other half: knowing what actually *happened* — every action taken, by whom, and when.

:::tip
This lesson is the cloud-specific counterpart to Path 07's Windows Event Viewer lesson and Path 03's Linux log-file coverage — same underlying principle (you can't investigate or detect what you never recorded), applied to a cloud account instead of a single machine.
:::

## The cloud audit log: recording every API call

Every major provider offers a service that logs essentially every action taken within an account — **AWS CloudTrail**, **Azure Monitor / Activity Log**, **Google Cloud Audit Logs**. Because virtually everything in the cloud happens through an API call (creating a VM, modifying a storage bucket's permissions, changing an IAM policy), this audit log captures an extraordinarily complete record: who made the request, what they requested, when, and from where.

:::danger Audit logging is not automatically enabled everywhere by default
A genuinely common real-world finding in cloud security assessments: audit logging exists as a capability, but was never actually enabled for a specific account, region, or service — meaning an investigation after an incident has nothing to work from. Confirming audit logging is actually turned on, account-wide, is one of the highest-value, lowest-effort cloud security checks that exists.
:::

## Monitoring vs. logging: a useful distinction

- **Logging** — the raw record of what happened, stored for later review or investigation
- **Monitoring** — actively watching metrics and logs in something closer to real time, often triggering automated alerts when something crosses a defined threshold or matches a suspicious pattern

Services like **Amazon CloudWatch**, **Azure Monitor**, and **Google Cloud Monitoring** combine both — collecting metrics (CPU usage, error rates, request counts) and logs, then letting you configure alerts that notify a team the moment something looks wrong, rather than only discovering a problem during a later manual review.

## What a security-relevant monitoring setup actually watches for

- **Unusual IAM activity** — a new access key created for a root or highly-privileged account, a permission policy suddenly widened, a login from an unfamiliar geographic location — directly extending the identity-access lesson's least-privilege principle into active, ongoing verification
- **Public exposure changes** — a storage bucket's access policy changing to public, a security group rule opening a port to the entire internet, exactly the misconfiguration patterns the storage and networking lessons warned about, caught the moment they happen rather than discovered later
- **Unusual billing/cost activity** — a sudden, unexplained spike in compute usage, which the next lesson covers as both a cost *and* a security signal simultaneously

## Why this connects directly to incident response

Path 16's incident-response material and Path 22's DevSecOps content both depend on exactly this foundation: a security incident investigation is only as good as the logs actually available to investigate — precisely the same principle the recognizing-Windows-compromise lesson in Path 07 established for individual machines, now applied at the scale of an entire cloud account and every resource within it.

:::challenge Diagnose a gap
A company suffers a cloud security incident — an attacker gained access and created several new IAM users with administrative privileges. During the investigation, the security team discovers that CloudTrail logging had been disabled in one specific AWS region six months earlier, and that's exactly the region where the malicious activity occurred.

<details><summary>Hint</summary>Was this an unlucky coincidence, or does it suggest something about how the attacker chose where to operate?</details>
<details><summary>Show answer</summary>This is very unlikely to be a coincidence — attackers who gain sufficient access commonly check for exactly this kind of gap deliberately, specifically looking for regions or services where logging isn't enabled, precisely because operating there leaves far less evidence for a later investigation to find. This is exactly why the danger callout in this lesson emphasizes confirming audit logging is enabled <em>account-wide</em>, not just in the regions or services a team happens to actively use — an attacker doesn't need to respect which regions your team considers "in scope."</details>
:::

## 🧪 Hands-on lab — design an alert rule

Sketch a monitoring alert rule for a hypothetical cloud account: what specific event or metric would you watch (choose one from this lesson's "security-relevant" list), what threshold or condition would trigger it, and who should be notified when it fires.

:::challenge Test yourself
1. What's the practical difference between logging and monitoring, and why does a mature setup need both?
2. Why is confirming audit logging is enabled account-wide considered such high-value, low-effort work?
3. Why might an attacker specifically target a region or service where logging is known to be disabled?
:::

## Key terms

- **CloudTrail (and equivalents)** — a cloud audit logging service recording nearly every API action taken within an account.
- **CloudWatch (and equivalents)** — a cloud monitoring service combining metrics, logs, and automated alerting.

## Recap

Cloud audit logging (CloudTrail and its equivalents) records essentially every action taken within an account, and monitoring services layer real-time alerting on top of that raw data — but neither protects you if it was never actually enabled in the first place, a surprisingly common real-world gap and exactly the kind of thing an attacker actively looks to exploit. Confirming logging is enabled account-wide, and configuring alerts for the specific security-relevant patterns this lesson named, is foundational preparation for the incident-response work covered in much greater depth in Path 16 and Path 22.

???refs
- [AWS — What is AWS CloudTrail?](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) — the official overview of AWS's audit logging service
???

**Next up →** [Cloud Cost & Billing Security](#/lesson/08-cloud-basics/cloud-cost-billing-security)
