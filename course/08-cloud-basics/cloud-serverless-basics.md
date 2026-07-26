# Cloud Serverless Basics

The compute lesson covered VMs and containers — infrastructure you provision and manage, even if the cloud makes that easier than on-premises hardware. This lesson covers a fundamentally different model: **serverless computing**, where you stop thinking about servers at all.

:::tip
"Serverless" doesn't mean there are no servers — there absolutely are, running somewhere in the provider's infrastructure. It means *you* never provision, patch, or manage them; you write code, and the cloud provider handles literally everything else about running it.
:::

## What a serverless function actually is

A **serverless function** (AWS Lambda, Azure Functions, Google Cloud Functions) is a small piece of code that runs in response to a **trigger** — an HTTP request, a new file uploaded to storage (from the cloud-storage-basics lesson), a scheduled time — and automatically stops running the moment it finishes, with the provider handling all the underlying compute provisioning invisibly. You're billed only for the actual execution time, often down to the millisecond, rather than paying for an always-running server whether it's doing useful work or not.

## Why this is such a different mental model

- **No idle capacity to pay for** — unlike a VM (from the compute lesson) that runs continuously whether or not it's handling requests, a serverless function costs nothing when it isn't actively executing
- **Automatic, near-instant scaling** — a serverless function handling one request and one handling ten thousand simultaneous requests both "just work," with the provider automatically running as many parallel instances as needed, without any auto-scaling configuration required
- **No OS patching responsibility** — since you never manage the underlying server, operating-system-level patching (a recurring theme throughout Path 00 and Path 07) becomes entirely the provider's problem, not yours

## Where serverless genuinely shines, and where it doesn't

Serverless is an excellent fit for event-driven, intermittent workloads — processing an uploaded file, responding to an API request, running a nightly scheduled job. It's a poor fit for long-running, continuously-active processes (most providers impose maximum execution time limits per invocation) or workloads needing very fine-grained control over the underlying runtime environment — exactly the cases where the compute lesson's VMs or containers remain the better tool.

## Security considerations specific to serverless

- **Function-level permissions, not instance-level** — each individual function gets its own IAM role (from the cloud-identity-access lesson), and the same least-privilege principle applies with even more precision here: a function that only needs to read from one specific storage bucket should have permissions for exactly that, not broad account-wide access
- **Dependency and supply-chain risk** — serverless functions commonly pull in third-party libraries, and a vulnerability in one of those dependencies is exploitable the moment the function runs, directly connecting to Path 22's software supply-chain security material
- **Event-source misconfiguration** — since functions trigger automatically off events (a file upload, an API call), a misconfigured trigger can expose a function to unintended, unauthenticated invocation far more easily than a traditional server sitting behind a login page

:::challenge Choose the right tool
A company needs to: (1) run a continuously-active web application handling steady, predictable traffic all day, and (2) process and resize an image every time one is uploaded to a storage bucket, which happens sporadically throughout the day.

<details><summary>Hint</summary>Which workload matches serverless's "event-driven, intermittent" sweet spot, and which matches the compute lesson's "continuously running" use case better?</details>
<details><summary>Show answer</summary>Workload (1) — steady, predictable, continuously-active traffic — is generally a better fit for traditional compute (VMs or containers, possibly with auto-scaling from the compute lesson), since the workload runs consistently enough that serverless's per-invocation billing model and cold-start overhead don't offer much advantage over an always-on server sized appropriately for the load. Workload (2) — sporadic, event-triggered image processing — is a textbook serverless use case: a function triggered directly by the storage upload event, running only when needed, with zero cost during the idle periods between uploads. This exact split (steady traffic on traditional compute, event-driven bursts on serverless) is a common, sensible real-world architecture pattern.</details>
:::

## 🧪 Hands-on lab — design a serverless workflow

Sketch a simple serverless architecture for a hypothetical app that needs to send a welcome email every time a new user signs up. Identify the trigger, the function's single responsibility, and the minimal IAM permissions it would actually need.

:::challenge Test yourself
1. What does "serverless" actually mean, given that servers obviously still exist somewhere?
2. Why is serverless a poor fit for a long-running, continuously-active process?
3. Why does function-level IAM permission scoping matter especially in a serverless architecture?
:::

## Key terms

- **Serverless function** — code that runs in response to a trigger, with the cloud provider fully managing the underlying compute.
- **Trigger** — an event (an HTTP request, a file upload, a schedule) that causes a serverless function to execute.
- **Cold start** — the brief delay a serverless function can experience when invoked after being idle, as the provider provisions execution resources.

## Recap

Serverless computing removes server management entirely from your responsibility — you write code, a trigger fires it, and you're billed only for actual execution time — making it an excellent fit for event-driven, intermittent workloads and a poor fit for continuously-active, long-running processes better served by the VMs and containers from the compute lesson. Its security model shifts scrutiny toward function-level IAM permissions, dependency risk, and event-source configuration, rather than the OS-patching concerns that dominate traditional compute security.

???refs
- [AWS — What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) — the official overview of AWS's serverless compute service
???

**Next up →** [Cloud Storage Basics](#/lesson/08-cloud-basics/cloud-storage-basics)
