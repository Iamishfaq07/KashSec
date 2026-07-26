# Cloud Multi-Account Governance

Every lesson so far has implicitly assumed a single cloud account. This lesson covers how real organizations — beyond a certain size — actually structure their cloud presence: not one account, but many, deliberately, and the governance layer that keeps that structure coherent.

:::tip
This might sound like unnecessary complexity at first. By the end of this lesson, the case for multiple accounts should feel like a natural extension of the least-privilege and blast-radius principles already covered throughout this path — applied at the account level instead of just the permission level.
:::

## Why one account isn't enough at real scale

A single cloud account sharing everything — production and development environments, every team's resources, every project — creates exactly the kind of large blast radius the microsegmentation lesson in Path 24 warned about, just applied to cloud infrastructure: a misconfiguration or compromise anywhere in that one account can potentially reach anything else in it. Real organizations instead adopt a **multi-account strategy**, deliberately splitting resources across separate accounts along meaningful boundaries.

## Common account separation patterns

- **Environment separation** — separate accounts for development, staging, and production, so a mistake or compromise in a development environment (where security controls are often deliberately looser to speed up iteration) can't reach production data or systems at all
- **Team or business-unit separation** — separate accounts per team or department, limiting each team's blast radius to their own resources and making cost attribution and access review far more tractable
- **Workload sensitivity separation** — an account handling regulated or highly sensitive data isolated from an account running a public marketing website, so the security posture and compliance requirements appropriate to each don't have to be uniformly applied everywhere

## Landing zones and account factories

Setting up dozens or hundreds of accounts by hand doesn't scale — real organizations use a **landing zone** (a standardized, pre-configured account template covering baseline security controls, logging, and networking) combined with an **account factory** (automated tooling that provisions new accounts from that template on demand). This ensures every new account starts with the logging (from the previous lesson), IAM baseline, and network configuration a security team has already reviewed and approved, rather than each new account being configured from scratch and potentially missing something important.

## Centralized visibility across many accounts

Splitting resources across many accounts solves the blast-radius problem, but creates a new one: how does a security team maintain visibility across dozens of separate accounts at once? Major providers offer **organization-wide services** (AWS Organizations plus a centralized CloudTrail/Security Hub setup, Azure Management Groups, Google Cloud's resource hierarchy with organization-level policies) specifically to aggregate logging, enforce baseline policies, and provide a single pane of glass across every account in the organization — directly extending the logging-monitoring lesson's principles from a single account to an entire fleet of them.

:::challenge Evaluate a governance gap
An organization has properly separated development and production into different accounts, following this lesson's environment-separation pattern. However, they set up each new account manually and inconsistently over several years, and a recent audit finds that three older accounts never had audit logging enabled at all, while newer accounts do.

<details><summary>Hint</summary>What specific tool from this lesson exists precisely to prevent this kind of inconsistency, and why would it have caught this gap automatically?</details>
<details><summary>Show answer</summary>This is exactly the failure mode a landing zone and account factory are designed to prevent — manual, ad-hoc account setup over time inevitably drifts, with older accounts missing baseline controls (like audit logging) that later became standard practice. A landing zone bakes required controls into the account creation process itself, so every account — old or new — starts from the same reviewed, secure baseline, and an account factory ensures that baseline gets applied consistently rather than depending on whoever happened to set up a given account remembering every required step. The organization's fix here isn't just enabling logging on the three gap accounts — it's establishing (or retrofitting) a proper landing zone so this exact inconsistency can't recur as they continue creating new accounts going forward.</details>
:::

## 🧪 Hands-on lab — design an account structure

For a hypothetical mid-size company with three teams (Engineering, Marketing, Data Science) and separate development/production needs, sketch a multi-account structure using at least two of the separation patterns from this lesson, and identify one organization-wide control (logging, IAM baseline) that should apply uniformly across every account in your structure.

:::challenge Test yourself
1. Why does a single shared cloud account create a large blast radius, in the same sense the microsegmentation lesson used that term?
2. What problem does a landing zone solve that ad-hoc, manual account creation doesn't?
3. Why is organization-wide centralized logging necessary once an organization adopts a multi-account strategy?
:::

## Key terms

- **Multi-account strategy** — deliberately splitting cloud resources across separate accounts along meaningful boundaries to limit blast radius.
- **Landing zone** — a standardized, pre-configured account template covering baseline security, logging, and networking controls.
- **Account factory** — automated tooling that provisions new accounts from a landing zone template.

## Recap

Real organizations at scale don't run everything in one cloud account — they deliberately split resources across many accounts along environment, team, or sensitivity boundaries, directly applying the blast-radius reduction principle covered elsewhere in this course to the account level itself. Landing zones and account factories keep that structure consistent and secure by default as it grows, while organization-wide logging and policy tools solve the visibility challenge that splitting resources across many accounts would otherwise create.

???refs
- [AWS — Organizing Your AWS Environment Using Multiple Accounts](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) — a detailed official whitepaper on this exact topic
???

**Next up →** [The Shared Responsibility Model](#/lesson/08-cloud-basics/shared-responsibility-model)
