# Infrastructure as Code (IaC) Security Scanning

The SAST/DAST/SCA lesson covered the core scanning trio applied to application code and dependencies. This lesson covers a fourth, increasingly essential scanning category applied to something genuinely different — the infrastructure definitions themselves — directly connecting to Path 16's cloud-security and IAM-deep-dive lessons, since IaC misconfiguration is frequently how those exact cloud vulnerabilities get introduced in the first place.

## What Infrastructure as Code actually is

**Infrastructure as Code (IaC)** means defining cloud infrastructure (virtual machines, storage buckets, network rules, IAM policies) in version-controlled configuration files — Terraform, CloudFormation, Kubernetes manifests, Pulumi — rather than manually clicking through a cloud provider's console. This is a genuinely positive shift for reliability and repeatability, but it means infrastructure misconfigurations are now defined in code, which means they can (and should) be scanned like any other code, before they're ever actually deployed.

## Why IaC scanning catches what runtime cloud scanning catches too late

Directly connecting to Path 16's cloud-security lesson's publicly-readable-bucket coverage: a storage bucket misconfigured with public read access is a real, exploitable finding whether it's caught by scanning the Terraform file that defines it *before* deployment, or by a cloud security posture management tool discovering it *after* deployment — but catching it in the IaC file itself, before the `terraform apply` command ever runs, means the misconfiguration never actually exists in a live, exploitable state at all, directly connecting to the previous lesson's shift-left economics.

```hcl
# Example: a Terraform misconfiguration an IaC scanner would flag
resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.example.id
  acl    = "public-read"   # Flagged: publicly readable bucket
}
```

## What IaC scanners actually check for

- **Overly permissive IAM policies** — directly connecting to Path 16's iam-deep-dive lesson, wildcard permissions (`Action: "*"`) or overly broad resource scopes defined directly in the IaC file
- **Missing encryption settings** — storage resources, databases, and disks defined without encryption-at-rest explicitly enabled
- **Publicly exposed resources** — security groups, network ACLs, or storage buckets configured with overly permissive public access
- **Hardcoded secrets in configuration** — directly connecting to the secrets-supply-chain lesson, credentials accidentally embedded directly in IaC files rather than referenced from a secrets manager

## Popular IaC scanning tools

**Checkov**, **tfsec**, and **Terrascan** are widely-used, open-source IaC scanners specifically built to parse Terraform, CloudFormation, and Kubernetes manifests, checking them against large, continuously-updated rule sets covering exactly the misconfiguration categories above — genuinely analogous to how SAST tools (the previous lesson) check application source code against known vulnerability patterns, just applied to infrastructure definitions instead.

## Integrating IaC scanning into the pipeline

Directly connecting to the CI/CD-security lesson: IaC scanning belongs as a required check in the same pipeline stage as SAST and dependency scanning — running automatically on every pull request that modifies infrastructure code, blocking merge on high-severity findings exactly the way a SAST failure would, rather than treating infrastructure changes as somehow exempt from the same automated gate application code changes go through.

## Policy as Code — codifying organizational standards directly

A more advanced practice worth knowing: **Policy as Code** tools (Open Policy Agent/OPA being the most widely referenced) let an organization define its own specific security and compliance rules as code, beyond what a generic IaC scanner's default rule set covers — "every S3 bucket in this organization must have versioning enabled" becomes an enforceable, automatically-checked policy rather than a guideline documented somewhere nobody consistently follows.

:::challenge Test yourself
Why does catching a public storage bucket misconfiguration in the Terraform file itself, before deployment, provide a genuinely stronger guarantee than catching the same misconfiguration through runtime cloud security scanning after deployment?
:::

## Key terms

- **Infrastructure as Code (IaC)** — defining cloud infrastructure in version-controlled configuration files rather than manual console changes.
- **IaC scanner** — a tool checking infrastructure definitions against known misconfiguration patterns before deployment.
- **Policy as Code** — codifying an organization's specific security and compliance rules as automatically-enforceable, version-controlled policy.

## Recap

IaC scanning applies the same shift-left, automated-checking philosophy as SAST/DAST/SCA to infrastructure definitions instead of application code, catching misconfigurations before they're ever deployed into a live, exploitable state. Overly permissive IAM policies, missing encryption, public exposure, and hardcoded secrets are the most common checks. Checkov, tfsec, and Terrascan are the standard open-source tools, and Policy as Code extends this further by letting organizations codify their own specific standards as enforceable, automated policy.

???refs
- [Checkov](https://www.checkov.io/) — open-source IaC scanner supporting Terraform, CloudFormation, Kubernetes, and more.
- [Open Policy Agent](https://www.openpolicyagent.org/) — the standard Policy as Code engine.
???
