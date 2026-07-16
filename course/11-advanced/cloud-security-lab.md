# Cloud Security Lab

This lab turns the concepts from the **Cloud security** lesson — IAM misconfiguration, exposed storage, and the instance metadata service (IMDS) — into hands-on practice against a purpose-built vulnerable environment, safely and legally.

## Recommended platform

**[flAWS.cloud](http://flaws.cloud/)** — a free, legal, deliberately vulnerable AWS environment built specifically for learning cloud security, walking you through a chain of realistic S3 and IAM misconfigurations level by level, with hints available at every stage if you get stuck. No AWS account or cost required to play.

For a second environment once you've finished flAWS, **[flAWS2.cloud](http://flaws2.cloud/)** continues with more advanced Lambda and container-focused scenarios. TryHackMe's and Hack The Box's cloud-focused rooms/machines are good next steps once you're comfortable here.

## Tasks

1. **Complete flAWS.cloud Levels 1–3** — these cover misconfigured public S3 buckets and directory listing exposure, the single most common real-world cloud misconfiguration reported in breach disclosures.
2. **Complete Level 4**, which introduces the **EC2 instance metadata service (IMDS)** — a core concept from the main lesson. Pay attention to *why* an SSRF vulnerability becomes so much more dangerous specifically on cloud infrastructure (hint: it's about what IMDS exposes at `http://169.254.169.254/`).
3. **Continue through as many levels as you can** (there are 6 total on the original flAWS.cloud) — each one chains a new AWS-specific misconfiguration onto the last, mirroring how real cloud breaches typically escalate through multiple small issues rather than one dramatic flaw.
4. **Document each level as you go** — for every level, write one sentence describing the specific misconfiguration and one sentence describing the real-world fix (e.g., "Bucket policy allowed public `ListBucket` → fix: block public access at the bucket and account level").

:::tip Use the AWS CLI, not just the browser
Several flAWS levels are far more instructive when solved with the AWS CLI (`aws s3 ls s3://bucket-name --no-sign-request` for public buckets) rather than just clicking through a browser — this mirrors the actual tooling used in real cloud security assessments and cloud-focused bug bounty hunting.
:::

:::challenge Report it like a real finding
Pick the single level you found most interesting and write it up as if it were a real bug bounty report: **Title**, **Severity** (use the CVSS reasoning from Path 09's Reporting lesson), **Steps to reproduce**, **Impact**, and **Fix**. This is exactly the deliverable a real cloud security assessment produces.
:::

## Key takeaway

Cloud misconfigurations are overwhelmingly about **defaults and permissions**, not exotic exploits — a publicly readable S3 bucket or an over-permissioned IAM role requires no "hacking" at all, just noticing what was left open. This is precisely why cloud security assessments spend so much time on configuration review rather than traditional exploitation.

**Next up →** [Containers & Kubernetes Lab](#/lesson/11-advanced/containers-k8s-lab)
