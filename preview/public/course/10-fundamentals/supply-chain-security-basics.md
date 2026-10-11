# Supply Chain Security Basics

The malware lesson covered how malicious software actually behaves. This lesson covers a specific, increasingly significant way malware (and other compromise) actually reaches an organization in the first place: through the **supply chain** — the vendors, software, and third parties an organization depends on and implicitly trusts.

## What "supply chain" means in a security context

A **supply chain attack** compromises an organization not by attacking it directly, but by attacking something it *depends on* — a software vendor, an open-source library, a hardware component, a managed service provider — and using that trusted relationship as the actual delivery mechanism. This is directly analogous to Path 03's coverage of package repositories: when you `apt install` a package, you're extending trust to that repository's entire chain of maintainers and infrastructure, not just the specific software you asked for.

## Why this attack pattern is so effective

Organizations invest heavily in defending their own perimeter and internal systems, but a supply chain attack sidesteps all of that by compromising something already *inside* the trust boundary before the attack even begins — a legitimate software update, signed with a legitimate vendor's genuine credentials, delivered through the organization's own normal, trusted update process. Path 25's OT/ICS supply-chain lesson covered this exact pattern (Stuxnet's reported USB delivery vector); this lesson generalizes it to IT environments broadly.

## Real categories of supply chain risk

- **Compromised software updates** — an attacker compromises a vendor's build or distribution system, and the malicious code rides along in an otherwise-legitimate, properly-signed update (the SolarWinds incident is a widely-cited real-world example)
- **Vulnerable open-source dependencies** — modern software commonly depends on dozens or hundreds of open-source libraries, any one of which could contain a vulnerability (or, less commonly, be deliberately compromised by a malicious contributor) — directly connecting to Path 22's DevSecOps material on software composition analysis
- **Third-party service providers** — a managed IT provider, a cloud service, or a contractor with access to an organization's systems represents an extension of that organization's own attack surface, not a separate concern
- **Hardware supply chain risk** — less common but genuinely real, involving compromised components introduced somewhere in the manufacturing or distribution process before hardware ever reaches its final owner

## Practical mitigations

- **Vendor security assessment** — evaluating a vendor's own security practices before extending trust to them, exactly the practice Path 25's OT/ICS lesson recommended for industrial equipment vendors
- **Software Bill of Materials (SBOM)** — a detailed inventory of every component and dependency within a piece of software, letting an organization quickly determine whether a newly disclosed vulnerability in a specific library actually affects them
- **Least privilege for third-party access** — a vendor or contractor should have access to exactly what they need, for exactly as long as they need it, directly extending the least-privilege principle from throughout this course
- **Monitoring vendor and dependency updates** — treating a third-party update with the same scrutiny (where feasible) as internally-developed code, rather than assuming "it came from a trusted vendor" is sufficient on its own

:::challenge Test yourself
Why does a supply chain attack often succeed even against organizations with genuinely strong perimeter defenses?
<details><summary>Show answer</summary>Perimeter defenses (firewalls, network segmentation, access controls) are built to stop <em>unauthorized</em> traffic and actors from getting in — but a supply chain attack arrives disguised as something the organization already trusts and has explicitly permitted: a legitimate, properly-signed software update from a vendor relationship that predates the attack entirely. The malicious code doesn't need to breach the perimeter at all, because it's delivered through a channel (the vendor's own update mechanism) that the organization's own defenses were specifically configured to allow. This is exactly why supply chain security requires a fundamentally different set of controls — vendor assessment, SBOMs, monitoring dependencies — rather than simply strengthening the same perimeter defenses that were never actually positioned to catch this specific attack pattern in the first place.</details>
:::

## Key terms

- **Supply chain attack** — compromising an organization by attacking a trusted vendor, dependency, or third party it relies on.
- **Software Bill of Materials (SBOM)** — a detailed inventory of a software product's components and dependencies.

## Recap

- Supply chain attacks compromise a trusted vendor, dependency, or third party rather than attacking an organization directly, sidestepping perimeter defenses entirely by riding in through an already-trusted channel.
- Real risk categories include compromised software updates, vulnerable open-source dependencies, third-party service providers, and (less commonly) hardware.
- Vendor assessment, SBOMs, least privilege for third-party access, and treating trusted updates with appropriate scrutiny are the practical mitigations.

**Next up →** [Passwords & hashing](#/lesson/10-fundamentals/passwords-hashing)
