# IAM, Deep Dive

The cloud security lesson mentioned IAM misconfiguration as a common finding without fully unpacking the mechanics. This lesson goes deep specifically into cloud **Identity and Access Management**, directly connecting to Path 22's Zero Trust identity coverage, since IAM is the practical implementation layer that entire architectural philosophy depends on.

## Why IAM is the actual perimeter in cloud environments

Directly connecting to Path 12's defense-in-depth lesson: in a traditional on-premises network, the network perimeter (firewall, VPN) was the primary security boundary. In cloud environments, that boundary has fundamentally shifted — **IAM policy is the real perimeter**, since every resource (a storage bucket, a database, a compute instance) is reachable over the public internet by default in many configurations, with IAM policy being the actual mechanism deciding who can do what to it.

## The anatomy of an IAM policy

Cloud IAM policies (AWS, Azure, and GCP all use structurally similar models) specify three core elements: **principal** (who — a user, role, or service), **action** (what — `s3:GetObject`, `ec2:TerminateInstances`), and **resource** (which specific object the action applies to), optionally combined with **conditions** (when — only from a specific IP range, only with MFA present). A misconfiguration in any one of these three elements can grant unintended access.

## Privilege escalation via IAM misconfiguration

A genuinely important cloud-specific concept with no direct on-premises equivalent: **IAM privilege escalation** occurs when a user's *existing*, seemingly limited permissions include the ability to modify IAM policy itself — for instance, permission to attach a more permissive policy to their own role, or to create a new access key for a more privileged service account. This means a seemingly low-risk permission grant (`iam:PassRole`, `iam:CreatePolicyVersion`) can be a genuine privilege escalation path, distinct from any traditional software vulnerability — directly connecting to Path 14's privilege-escalation-methodology lesson, applied here entirely through policy misconfiguration rather than any exploited software flaw.

## Overly broad roles: the most common real-world finding

Directly connecting to the least-privilege principle from Path 12: the single most common real-world cloud IAM finding is a role or service account granted `*` (wildcard, meaning "all actions") on a resource, or an entire administrative policy attached when the actual workload only ever needs to read from one specific storage bucket. This happens for an understandable reason — broad permissions are the path of least resistance during initial development — but it means a single compromised credential or exploited application often grants far more access than the actual compromised component ever needed.

## Cross-account and third-party access

Cloud environments frequently grant IAM roles to external, third-party accounts (a monitoring vendor, a CI/CD provider) — directly connecting to Path 22's supply-chain security coverage, since a misconfigured trust policy allowing overly broad cross-account access effectively extends an organization's attack surface to include every third party it's granted access to, whether or not that third party's own security posture has been carefully vetted.

:::challenge Test yourself
Why does the permission `iam:PassRole` specifically represent a potential privilege escalation risk, even though it doesn't directly grant access to any data or resource itself?
<details><summary>Show answer</summary><code>iam:PassRole</code> allows a user or service to attach an existing IAM role to a resource they're creating or configuring (a new compute instance, a new serverless function, for instance) — meaning the user isn't granted that role's permissions directly, but can cause a resource they control to run *with* that role's permissions. If an attacker with only <code>iam:PassRole</code> (and permission to create some compute resource) can pass a highly privileged role — one they could never have been granted directly — onto a new instance or function they fully control, they've effectively gained that privileged role's access indirectly, entirely through a permission that looks harmless in isolation because it never appears to grant direct access to anything itself. This is exactly the kind of non-obvious escalation chain that makes IAM policy review a genuinely specialized skill distinct from simply checking whether a user has an "admin" label — the danger often lives in how individually reasonable-looking permissions combine, not in any single overtly dangerous one.</details>
:::

## Key terms

- **Principal, action, resource, condition** — the four core elements of a cloud IAM policy statement.
- **IAM privilege escalation** — using existing permissions to grant oneself additional, more privileged access via policy modification.
- **iam:PassRole** — a permission allowing a role to be attached to a new resource, a common indirect escalation vector.

## Recap

- IAM policy functions as the real security perimeter in cloud environments, replacing the traditional on-premises network boundary.
- IAM privilege escalation exploits permissions to modify policy itself, a cloud-specific escalation path distinct from any software vulnerability.
- Overly broad wildcard permissions remain the most common real-world cloud IAM finding, born from development-time convenience.
- Cross-account trust relationships extend an organization's effective attack surface to every third party granted access.

**Next up →** [Containers & Kubernetes security](#/lesson/16-advanced/containers-k8s)
