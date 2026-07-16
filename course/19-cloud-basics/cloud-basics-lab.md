# Cloud Basics Hands-On Lab

This capstone lab gets you hands-on with a real, free-tier cloud account before Path 11's more advanced cloud security lab — building comfort with the console and CLI first, so that lab's security-focused content lands on a solid practical foundation.

## Setting up a free-tier account

Create a free account with **[AWS Free Tier](https://aws.amazon.com/free/)** (the most widely referenced provider throughout this path and Path 11) — it provides genuinely usable, if limited, resource allowances for 12 months, sufficient for every task in this lab.

:::warn Set up billing alerts immediately
Before doing anything else, go to **Billing → Budgets** and set up a free billing alert (e.g., notify if spend exceeds $1). Free tier limits are generous but finite, and accidentally exceeding them produces a real charge — a billing alert is a simple, essential safety net worth setting up in your very first five minutes with any cloud account.
:::

## Tasks

1. **Launch a virtual machine (IaaS, hands-on).** Using the EC2 console, launch a free-tier-eligible virtual machine instance. Connect to it via SSH (Path 03's terminal skills apply directly), and confirm you can run basic commands on it — this is IaaS in practice: you're responsible for everything from the OS upward, per this path's shared responsibility lesson.
2. **Create a storage bucket and test its access policy.** Create an S3 bucket, upload a test file, and — critically — practice *both* configurations: first confirm it's private by default (attempting an unauthenticated access should fail), then deliberately make it briefly public to observe the difference, and revert it back to private immediately afterward. This hands-on before/after is the clearest way to internalize Path 19's cloud storage lesson.
3. **Set up a VPC and security group.** Create a VPC with a public and private subnet (per this path's networking lesson's diagram), and configure a security group for your Task 1 instance — first testing an overly permissive rule (`0.0.0.0/0` on a port), observing what that allows, then tightening it to a specific, narrow rule.
4. **Create an IAM user with a least-privilege policy.** Create a new IAM user (not your root account — never use root credentials for day-to-day work) with a custom policy granting access to *only* the S3 bucket from Task 2, nothing else. Confirm using the CLI that this user genuinely cannot access other services.
5. **Audit your own account.** Using `aws iam list-users`, `aws s3api get-bucket-acl`, and `aws ec2 describe-security-groups`, produce a summary of every identity, storage policy, and network rule you've created in this lab — exactly the kind of self-audit that should become habitual before ever considering any cloud environment "done."
6. **Clean up.** Terminate your EC2 instance, delete your test bucket, and remove the IAM user you created — cloud resources left running unintentionally is itself a real, common source of unexpected billing.

7. **Test IMDSv2 enforcement on your instance.** From inside your Task 1 EC2 instance (via SSH), try querying the metadata service both the old way (a plain GET with no token) and the IMDSv2 way (a PUT request for a token, then a GET using that token as a header) — confirm whether your instance's default configuration requires the token-based flow, and if it doesn't, explicitly enable "IMDSv2 required" in the instance's settings and re-test. This hands-on comparison makes Path 19.4's IMDSv2 explanation concrete rather than abstract.
8. **Deliberately trigger and find an IAM privilege escalation gap.** Using the IAM user from Task 4, attempt to grant that user permission to attach policies to itself (`iam:AttachUserPolicy` on its own ARN), then reason through — without actually exploiting it — exactly how that single additional permission would let the user escalate to full account access, directly applying Path 19.5's IAM privilege escalation discussion to a real policy you configured yourself.

:::challenge Write a shared-responsibility breakdown
For everything you built in this lab (the EC2 instance, the S3 bucket, the IAM user, the security group), write out — using the framework from this path's shared responsibility lesson — exactly what AWS was responsible for securing versus what you were responsible for configuring correctly. Be specific about what could have gone wrong at each layer if you'd misconfigured it.
:::

## Where this connects forward

You're now ready for Path 11's cloud security lesson and flAWS lab with genuine hands-on context behind every concept it references — buckets, IAM roles, security groups, and the instance metadata service will all be concrete, not abstract, the moment you encounter them there.

## Key takeaway

Cloud security concepts remain abstract until you've actually clicked through a console, run a CLI command, and watched a misconfiguration produce a real (if contained, free-tier) consequence yourself — this lab's deliberate "create it correctly, then briefly misconfigure it, then fix it again" pattern across storage and networking is exactly the hands-on repetition that makes Path 11's more advanced material land immediately rather than requiring a second pass.

## 🎓 Path complete

You've now covered what cloud computing actually is and the IaaS/PaaS/SaaS spectrum, the major providers and their equivalent services, object storage and bucket misconfiguration risk, VPCs/subnets/security groups and the instance metadata service, IAM and the principle of least privilege applied to cloud identities, the shared responsibility model, and hands-on practice with a real free-tier account. You're now genuinely prepared for Path 11's cloud security material.

???refs
- [AWS Free Tier](https://aws.amazon.com/free/) — the free account tier used throughout this lab.
- [AWS Well-Architected Framework — Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) — free, official, comprehensive guidance for going beyond this lab's scope.
???

**Explore more →** [Path 11 — Advanced Cyber Topics](#/lesson/11-advanced) · [Back to all paths](#/course)
