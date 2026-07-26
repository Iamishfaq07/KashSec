# Cloud & Modern Networking

Every concept in this path so far describes physical networking as it's existed for decades — physical routers, physical switches, physical cables. This lesson covers how those same concepts get reimplemented in software once a network moves into the cloud, directly connecting back to Path 08's cloud-networking-basics lesson.

## Software-Defined Networking (SDN): the router without the box

**Software-Defined Networking (SDN)** separates the *decision* of where traffic should go from the physical hardware that actually moves it — in a cloud environment, there's no physical router sitting in a rack that you can point to; routing decisions happen in software, defined through configuration and API calls rather than physical cabling and hardware switches. This is exactly why a cloud VPC (from Path 08) can be created, reconfigured, or destroyed in seconds — you're never waiting on physical equipment to be racked and cabled.

## Virtual networks and overlay networking

A **virtual network** (a VPC in AWS, a VNet in Azure) recreates the subnetting, routing, and isolation concepts from earlier in this path entirely in software, running on top of a cloud provider's actual physical infrastructure. **Overlay networking** takes this a step further — creating a logical network that spans across different underlying physical networks (even different data centers or cloud regions) as if they were one seamless local network, invisible to anything running on top of it.

## Containers need networking too

Path 08's compute lesson introduced containers. Each container typically gets its own virtual network interface, and container orchestration platforms (Kubernetes, referenced throughout Path 16's containers lab) manage an entire virtual networking layer — virtual switches, virtual routing, and container-to-container communication rules — entirely in software, applying every concept from this path (subnets, routing, firewall-style rules) at a scale and speed no physical network could ever match.

## Why this matters: the concepts transfer, the implementation doesn't

The genuinely important insight this lesson is building toward: **everything in this path — IP addressing, subnetting, routing, firewalls, DNS — still applies in a cloud or containerized environment.** What changes is *how* those concepts get implemented: not physical cables and hardware, but API calls, configuration files, and software running at massive, elastic scale. A security professional who deeply understands the physical networking fundamentals this path has covered can apply that same understanding to a cloud environment they've never worked in before, precisely because the underlying concepts transfer even when the implementation looks completely unfamiliar at first glance.

:::challenge Test yourself
Why does understanding physical networking fundamentals (routing, subnetting, firewalls) remain valuable even for someone who will spend their entire career working exclusively in cloud environments?
<details><summary>Show answer</summary>Cloud networking reimplements the exact same underlying concepts — routing decisions, subnet boundaries, traffic filtering — in software rather than physical hardware, but the concepts themselves don't change. A security professional who understands <em>why</em> a subnet boundary matters, <em>why</em> default-deny firewall rules are stronger than default-allow, and <em>how</em> routing decisions get made can apply that understanding directly to a cloud VPC's security group rules, a Kubernetes network policy, or an SDN configuration — even without prior exposure to that specific platform's interface — because they're reasoning about the same fundamental problem the physical-networking version of this course covered first. Someone who only learned "click here in this specific cloud console" without the underlying fundamentals has much shakier ground to stand on the moment they encounter an unfamiliar platform or a genuinely novel problem.</details>
:::

## 🧪 Hands-on lab — trace the parallels

For three concepts from earlier in this path (subnetting, routing, firewalls), write one sentence identifying the cloud-networking equivalent from Path 08 that implements the same underlying idea in software.

## Key terms

- **Software-Defined Networking (SDN)** — separating network routing decisions from physical hardware, controlled instead through software.
- **Overlay network** — a logical network spanning multiple underlying physical networks, appearing as one seamless network to anything running on top of it.

## Recap

Cloud and container networking reimplement every fundamental concept from this path — addressing, subnetting, routing, firewalls — entirely in software, running at a scale and speed physical hardware alone could never match. The underlying concepts transfer completely even when the implementation looks unfamiliar, which is exactly why the physical-networking fundamentals this path has built are genuinely durable knowledge, not something that becomes obsolete the moment you start working in the cloud.

???refs
- [AWS — VPC networking components](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html) — see the physical-networking concepts from this path reimplemented in a real cloud platform
???

**Next up →** [Network Security Careers & Certifications](#/lesson/02-networking/network-certifications-careers)
