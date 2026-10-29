# Cloud Security Lab

This lab turns the concepts from the **Cloud security** lesson — IAM misconfiguration, exposed storage, and the instance metadata service (IMDS) — into hands-on practice against a purpose-built vulnerable environment, safely and legally.

## Start locally: prove a narrow permission contract

Before provisioning a cloud target, try [Cloud permissions with a tenant boundary](/expert-labs/cloud-scope.html). You will review an over-broad S3 identity policy, write an allow/deny matrix, repair a small Python access-contract model, and report what the evidence does and does not establish. It needs Python 3.10+ and no cloud account, packages, or spending.

The model is not an AWS IAM engine. In a real account, inspect identity and resource policies, explicit denies, permission boundaries, session policies, organization controls, role trust, and relevant KMS permissions. Keep the principal, policy version, resource, action, and observed result with each test.

## Recommended platform

**[flAWS.cloud](http://flaws.cloud/)** is an intentionally vulnerable AWS learning environment. Check its current setup instructions and the requirements for each level before starting. Some steps require AWS tooling or credentials; do not assume every level is account-free or that resources you provision are free.

For a second environment once you've finished flAWS, **[flAWS2.cloud](http://flaws2.cloud/)** continues with more advanced Lambda and container-focused scenarios. TryHackMe's and Hack The Box's cloud-focused rooms/machines are good next steps once you're comfortable here.

## Tasks

1. **Complete flAWS.cloud Levels 1–3** — these cover misconfigured public S3 buckets and directory listing exposure, the single most common real-world cloud misconfiguration reported in breach disclosures.
2. **Review the later levels' credential and metadata trust boundaries.** Follow the current instructions for the level you choose, rather than assuming a fixed level number teaches IMDS. Explain why SSRF can become a credential-exposure issue when a service can reach an instance metadata endpoint, and what protections would apply to the specific deployment.
3. **Continue through as many levels as you can** (there are 6 total on the original flAWS.cloud) — each one chains a new AWS-specific misconfiguration onto the last, mirroring how real cloud breaches typically escalate through multiple small issues rather than one dramatic flaw.
4. **Document each level as you go** — for every level, write one sentence describing the specific misconfiguration and one sentence describing the real-world fix (e.g., "Bucket policy allowed public `ListBucket` → fix: block public access at the bucket and account level").

5. **Cross-reference each flAWS level against the shared responsibility model.** For every level you complete, explicitly note: was this misconfiguration something AWS's own infrastructure should have prevented, or something squarely within the *customer's* configuration responsibility (per the main lesson's shared responsibility diagram)? You'll notice every single flAWS level falls on the customer side — a genuinely useful, concrete confirmation of just how much of real cloud security risk lives in configuration choices rather than provider-side flaws.

:::tip Use the AWS CLI, not just the browser
Several flAWS levels are far more instructive when solved with the AWS CLI (`aws s3 ls s3://bucket-name --no-sign-request` for public buckets) rather than just clicking through a browser — this mirrors the actual tooling used in real cloud security assessments and cloud-focused bug bounty hunting.
:::

:::challenge Report it like a real finding
Pick the single level you found most interesting and write it up as if it were a real bug bounty report: **Title**, **Severity** (use the CVSS reasoning from Path 14's Reporting lesson), **Steps to reproduce**, **Impact**, and **Fix**. This is exactly the deliverable a real cloud security assessment produces.
:::

## Key takeaway

Cloud misconfigurations are overwhelmingly about **defaults and permissions**, not exotic exploits — a publicly readable S3 bucket or an over-permissioned IAM role requires no "hacking" at all, just noticing what was left open. This is precisely why cloud security assessments spend so much time on configuration review rather than traditional exploitation.

**Next up →** [Containers & Kubernetes Lab](#/lesson/16-advanced/containers-k8s-lab)
