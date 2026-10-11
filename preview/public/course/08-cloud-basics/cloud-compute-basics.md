# Cloud Compute Basics

The providers-overview lesson named IaaS, PaaS, and SaaS. This lesson goes hands-on with the most fundamental IaaS building block across every major provider: **compute** — the actual virtual machines and containers that run your code.

:::tip
Nearly every other cloud service in this path — storage, databases, serverless functions — ultimately runs *on* compute infrastructure somewhere, even when the provider abstracts that away from you. Understanding compute is understanding the foundation everything else sits on.
:::

## Virtual machines in the cloud

A cloud **virtual machine (VM)** — Amazon calls it an **EC2 instance**, Azure a **Virtual Machine**, Google Cloud a **Compute Engine instance** — is conceptually the same thing the home-lab lesson back in Path 01 introduced: an isolated, software-defined computer. The cloud version adds one major difference: you can create, resize, or destroy one in seconds through an API call, rather than needing physical hardware, and you pay only for the time it actually runs.

## Instance types: matching resources to the job

Every provider offers a menu of **instance types** — predefined combinations of CPU, memory, and sometimes specialized hardware (GPUs for machine learning workloads) — letting you pick resources matched to your actual workload rather than over- or under-provisioning. A small web server and a data-processing job that needs to churn through gigabytes of data have very different resource needs, and cloud compute lets you provision each appropriately, then change your mind later without buying new hardware.

## Containers: a lighter-weight alternative

**Containers** (Docker being the dominant technology, covered hands-on in Path 16's containers-and-Kubernetes lab) package an application with everything it needs to run, but share the underlying operating system kernel rather than each running a full separate OS the way a VM does — making them meaningfully faster to start and more resource-efficient than a full VM for many workloads. Cloud providers offer managed container services (ECS/EKS on AWS, AKS on Azure, GKE on Google Cloud) that handle much of the underlying orchestration complexity.

## Auto-scaling: compute that grows and shrinks with demand

A genuinely powerful cloud-native concept the on-premises world struggles to match: **auto-scaling** automatically adds more compute instances when demand rises and removes them when demand falls, based on rules you configure (CPU usage, request count, a schedule). This directly ties into the cost-and-billing lesson later in this path — auto-scaling is both a performance feature and a cost-control mechanism, since you're not paying for idle capacity sized for peak demand around the clock.

## Security considerations specific to cloud compute

- **Unpatched instance images** — a VM launched from an outdated base image inherits every unpatched vulnerability that image shipped with, directly extending Path 00's updates lesson to cloud infrastructure at scale
- **Overly permissive security groups** (covered in depth in the networking lesson) — a compute instance is only as isolated as the network rules actually restricting what can reach it
- **Instance metadata service exposure** — the networking lesson's coverage of this service applies with particular force to compute instances, since a vulnerability in an application running on that instance can sometimes be leveraged to reach the metadata endpoint and steal the instance's own cloud credentials

:::challenge Evaluate a scaling decision
A company runs a web application on a single, large, constantly-running VM sized for their highest expected traffic (Black Friday), even though daily traffic the rest of the year is a small fraction of that peak.

<details><summary>Hint</summary>What does this configuration cost the company during the 360+ days a year that aren't Black Friday, and what cloud-native alternative would this lesson suggest?</details>
<details><summary>Show answer</summary>This configuration wastes significant money for most of the year — the company is paying for peak-capacity compute 24/7, even though that capacity sits mostly idle outside of the actual peak period. An auto-scaling configuration would instead run a smaller baseline of instances most of the time, automatically adding capacity as real demand rises (during Black Friday specifically) and scaling back down afterward — matching actual cost to actual demand, precisely the elasticity advantage that distinguishes cloud compute from traditional fixed-capacity on-premises hardware.</details>
:::

## 🧪 Hands-on lab — compare instance types

Using a cloud provider's public pricing page (no account required), compare the specs and hourly cost of a small general-purpose instance type against a larger, compute-optimized instance type. Identify what kind of workload each would realistically be suited for.

:::challenge Test yourself
1. What's the key structural difference between a container and a full virtual machine?
2. Why does auto-scaling matter for cost, not just performance?
3. Why does the instance metadata service's security matter specifically for compute instances?
:::

## Key terms

- **Instance type** — a predefined combination of CPU, memory, and other resources offered for a cloud compute instance.
- **Container** — a lightweight, isolated application package that shares the underlying OS kernel rather than running a full separate operating system.
- **Auto-scaling** — automatically adjusting the number of running compute instances based on demand.

## Recap

Cloud compute — VMs and containers — is the foundation nearly every other cloud service ultimately runs on, and cloud-native features like instance types and auto-scaling let you match resources to actual workload demand far more precisely (and cost-effectively) than fixed on-premises hardware ever could. The security considerations specific to compute — unpatched images, security group misconfiguration, metadata service exposure — build directly on concepts from earlier in this course, applied at cloud scale.

???refs
- [AWS — What is EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) — the official overview of AWS's compute service
???

**Next up →** [Cloud Serverless Basics](#/lesson/08-cloud-basics/cloud-serverless-basics)
