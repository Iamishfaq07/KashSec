# Cloud Network Security

Every concept in this path so far has assumed physical or on-premises infrastructure. This closing conceptual lesson bridges directly to Path 08's cloud-networking material, showing exactly how the same principles this path has built get reimplemented once a network moves into the cloud.

## The concepts transfer, exactly as Path 02 predicted

Path 02's cloud-and-modern-networking lesson made this argument for networking fundamentals broadly; this lesson applies it specifically to network *security*: firewalls become **security groups**, VLANs and segmentation become **VPC subnets and network ACLs**, and NAC's device-verification role gets handled through cloud IAM (Path 08) rather than 802.1X port authentication — the underlying security logic is identical, just implemented in cloud-provider configuration instead of physical hardware.

## Security groups: stateful, instance-level firewalls

Directly extending this path's firewalls-VPNs lesson: a **security group** in AWS (or the equivalent in Azure/GCP) is a stateful firewall applied at the individual instance level, following the exact same default-deny, explicit-allow logic covered earlier in this path, just configured through an API call rather than `iptables` rules on a physical machine.

## Network ACLs: subnet-level, stateless filtering

Where security groups operate per-instance and are stateful, **Network ACLs** operate at the subnet level and are stateless — directly applying this path's stateful-vs-stateless distinction from the firewalls-basics material, now as two complementary layers within a single cloud architecture, providing genuine defense in depth (Path 10) within the cloud environment itself.

## Why cloud network security introduces genuinely new risk patterns

- **Misconfigured security groups are a leading real-world cloud breach cause** — a security group accidentally allowing inbound traffic from `0.0.0.0/0` (any address at all) on a sensitive port is the cloud-native equivalent of the exposed-RDP risk Path 07 covered for on-premises Windows machines, and it happens with genuine frequency in real environments
- **The shared responsibility model applies directly** — Path 08's shared-responsibility-model lesson makes clear that network security *configuration* within a cloud account remains the customer's responsibility, even though the underlying physical network infrastructure is the provider's

## Cloud-native DDoS protection, connecting back to the previous lesson

Major cloud providers offer built-in DDoS protection (AWS Shield, Azure DDoS Protection) directly applying the previous lesson's scrubbing and over-provisioning concepts at cloud scale — genuinely one of the practical advantages of cloud infrastructure over a smaller organization's own on-premises capacity to absorb a large-scale volumetric attack.

:::challenge Test yourself
Why is a misconfigured security group allowing inbound access from `0.0.0.0/0` considered structurally similar to the exposed-RDP risk covered in Path 07, despite being a completely different technology?
<details><summary>Show answer</summary>Both represent the exact same underlying mistake: a sensitive service or port made directly reachable from the entire internet, with no restriction to a specific, known, trusted source — Path 07's exposed RDP and a cloud security group open to <code>0.0.0.0/0</code> are structurally identical failures, just occurring in different environments (on-premises Windows infrastructure versus cloud-hosted instances). Both are discovered the same way (automated internet-wide scanning, the "fishing with a giant net" pattern from Path 01), both dramatically increase exposure to credential-stuffing and exploitation attempts, and both have the same fix in principle: restrict access to specific, known source addresses or route it through a properly secured intermediary (a VPN, a bastion host) rather than leaving it open to the entire internet by default. Recognizing this pattern across different technologies is exactly the kind of transferable understanding this course has been building throughout — the same underlying mistake keeps appearing, just wearing different specific configuration syntax each time.</details>
:::

## Key terms

- **Security group** — a stateful, instance-level firewall in cloud environments, following the same default-deny principle as traditional firewalls.
- **Network ACL** — a stateless, subnet-level filtering layer in cloud environments, complementary to security groups.

## Recap

- Cloud network security reimplements every concept this path has covered — firewalls, segmentation, access control — in cloud-provider configuration rather than physical hardware, directly extending Path 02's "concepts transfer, implementation doesn't" principle to security specifically.
- Security groups and Network ACLs provide layered, stateful-plus-stateless defense in depth within a single cloud architecture.
- Misconfigured security groups remain a leading real-world cloud breach cause, structurally identical to the exposed-RDP risk covered for on-premises infrastructure in Path 07.

**Next up →** [Your network security roadmap](#/lesson/12-network-security/netsec-roadmap)
