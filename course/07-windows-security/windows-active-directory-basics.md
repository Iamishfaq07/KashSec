# Windows Active Directory: The Basics

The user-accounts lesson covered individual machine accounts. This lesson introduces the system that manages accounts, permissions, and policy across an *entire organization's* Windows machines at once — foundational knowledge for Path 16's Active Directory attack lab, which assumes you already understand what AD actually is.

:::tip
Nearly every mid-size-or-larger organization running Windows uses Active Directory. Understanding it isn't optional context for a security career — it's close to a baseline expectation, which is exactly why Path 16 builds an entire hands-on attack lab (Kerberoasting, Golden Tickets) directly on top of this lesson's foundation.
:::

## What Active Directory actually is

**Active Directory (AD)** is Microsoft's directory service — a centralized database of every user, computer, and group in an organization, along with the permissions and policies governing them. Instead of each individual Windows machine managing its own separate local accounts (the model the user-accounts lesson covered), AD lets an entire organization's machines share one centralized identity and policy system.

## The core building blocks

- **Domain** — the administrative boundary AD manages; all the users, computers, and resources within one domain share centralized authentication and policy
- **Domain Controller (DC)** — the server actually running Active Directory, holding the full directory database and handling authentication requests for the whole domain — compromising a DC is close to the worst-case outcome in an AD environment, since it grants effective control over everything the domain manages
- **Organizational Units (OUs)** — a way of organizing users and computers into logical groups (by department, by location) so policy can be applied differently to different groups rather than uniformly across the entire domain
- **Groups** — collections of users granted shared permissions together, rather than assigning permissions to each user individually — directly extending the least-privilege principle from the user-accounts lesson to an organizational scale

## How authentication actually works: Kerberos, briefly

AD authentication runs on a protocol called **Kerberos**, which issues time-limited cryptographic tickets (directly building on the digital-signatures and hashing concepts from Path 06) proving a user has already authenticated, rather than requiring a password to be re-sent for every single resource request. This is genuinely elegant — and it's also exactly the mechanism Path 16's Kerberoasting attack targets, by requesting service tickets and attempting to crack the encryption protecting them offline, entirely separate from the authentication server itself.

## Why AD is such a high-value attacker target

A single compromised low-privilege domain account is often just the *starting point* of a real attack, not the goal — because AD's whole design links every account, computer, and permission together in one interconnected graph. An attacker who compromises one ordinary user's laptop can often map out (using tools like BloodHound, previewed here and covered hands-on in Path 16) a path of misconfigured permissions leading step by step toward **Domain Admin** — the account type with effectively unrestricted control over the entire domain.

:::challenge Reason about blast radius
Compare two scenarios: (1) an attacker compromises one user's password on a standalone machine with only local accounts, and (2) an attacker compromises one ordinary user's password on a machine joined to a large organization's Active Directory domain.

<details><summary>Hint</summary>What does the compromised account actually have access to in each scenario — just this one machine, or something bigger?</details>
<details><summary>Show answer</summary>Scenario 1's blast radius is contained to that single standalone machine — the local account has no connection to any other system. Scenario 2 is far more dangerous, even though the initial compromise looks identical from the attacker's perspective: a domain-joined account exists within AD's interconnected permission graph, potentially providing a starting point for further reconnaissance (mapping out group memberships, permissions, and misconfigurations across the entire domain) toward more privileged access, exactly the kind of path-to-Domain-Admin scenario BloodHound is designed to reveal. This is precisely why AD compromise is treated as such a high-severity finding in real security assessments — the interconnectedness that makes AD administratively convenient is the same property that makes a single compromised account potentially dangerous far beyond its own machine.</details>
:::

## 🧪 Hands-on lab — map the concepts

For a hypothetical company with a Sales department and an IT department, sketch a simple AD structure: one domain, two OUs (Sales, IT), and one group each with appropriate permissions. Note which OU would reasonably contain the Domain Controller's own computer account, and why IT staff typically need broader group permissions than Sales.

:::challenge Test yourself
1. What's the relationship between a domain and a Domain Controller?
2. Why does Kerberos use time-limited tickets instead of resending a password for every resource request?
3. Why is a single compromised domain account potentially more dangerous than a single compromised local account?
:::

## Key terms

- **Active Directory (AD)** — Microsoft's centralized directory service managing users, computers, groups, and policy across an organization.
- **Domain Controller (DC)** — the server running Active Directory and handling authentication for its domain.
- **Kerberos** — the ticket-based authentication protocol Active Directory uses.
- **Domain Admin** — the account type with effectively unrestricted control over an entire AD domain.

## Recap

Active Directory centralizes identity and policy management across an entire organization's Windows machines, using Kerberos's ticket-based authentication instead of resending passwords for every resource. Its interconnected structure — domains, Domain Controllers, OUs, and groups — is exactly what makes a single compromised low-privilege account potentially dangerous far beyond its own machine, since AD's permission graph often provides a path toward much higher privilege. This foundation is exactly what Path 16's Active Directory attack lab (Kerberoasting, BloodHound, Golden Tickets) assumes you already understand.

???refs
- [Microsoft — Active Directory Domain Services Overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) — the official technical overview
???

**Next up →** [Windows Group Policy Basics](#/lesson/07-windows-security/windows-group-policy-basics)
