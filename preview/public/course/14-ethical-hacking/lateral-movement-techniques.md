# Lateral Movement Techniques

The post-exploitation lesson mentioned pivoting briefly. This lesson goes deeper into **lateral movement** specifically — how an attacker (or authorized tester) with a foothold on one system actually reaches other systems on the same network, directly connecting to Path 12's segmentation-in-practice lesson from the attacker's side of that exact defense.

## Why lateral movement matters, revisited

Path 12's network-segmentation lesson already framed segmentation as a defense against lateral movement without fully explaining the offensive technique it defends against. This lesson closes that loop: an initial compromised system is rarely the actual target — it's a foothold used to reach more valuable systems elsewhere on the network.

## Credential reuse: the most common real-world technique

Directly connecting to Path 00's password-reuse warning, now from an attacker's perspective: if the same local administrator password is reused across many machines (a genuinely common real-world IT practice, done for convenience), compromising one machine's credentials often grants access to many others simultaneously — a single organizational habit turning one compromise into a network-wide problem.

## Pass-the-Hash: using a hash without cracking it

A genuinely important Windows-specific technique: **Pass-the-Hash** exploits the fact that some Windows authentication protocols accept a password's *hash* directly, without ever needing the actual plaintext password — meaning an attacker who extracts password hashes from one compromised machine (directly connecting to Path 07's Active-Directory lesson's Kerberos coverage) can authenticate to other systems using just that hash, never needing to crack it into a human-readable password at all.

## Remote execution tools

Directly connecting to Path 03's SSH lesson and Path 07's RDP lesson: the exact same remote-access protocols organizations legitimately use for administration are also the tools lateral movement relies on — **PsExec**, **WMI**, and legitimate remote-administration tools all let an attacker with valid (often stolen) credentials execute commands on other systems, blending in with genuinely normal administrative activity.

## Living off the land: using what's already there

**Living off the land** describes using an environment's own legitimate, pre-installed tools (PowerShell, WMI, and other built-in administrative utilities) rather than introducing new, potentially detectable malware — directly connecting to Path 03's bash-scripting and Path 07's PowerShell coverage, since the exact same tools this course taught for legitimate administration are what makes this technique so hard to distinguish from normal activity.

## Why detection focuses on behavior, not just tools

Directly connecting to Path 24's UEBA/behavioral-analytics lesson: since lateral movement frequently uses legitimate credentials and legitimate administrative tools, signature-based detection (looking for "known bad" tools) is genuinely insufficient — detecting an unusual pattern (a workstation account suddenly authenticating to a dozen other machines it's never touched before) requires the behavioral-baseline approach that lesson described.

:::challenge Test yourself
Why is Pass-the-Hash considered a genuinely significant technique, rather than just a minor variation on regular credential theft?
<details><summary>Show answer</summary>Regular credential theft requires an attacker to actually recover a usable, plaintext password — either by cracking a stolen hash (a potentially slow, sometimes infeasible process against a strong password, per Path 00's hashing coverage) or by capturing it directly through some other means. Pass-the-Hash bypasses this entire cracking step: because certain Windows authentication protocols accept the hash itself as sufficient proof of authentication, an attacker who extracts hashes from a compromised machine's memory can immediately authenticate to other systems using those hashes directly, with no need to ever determine the actual underlying password at all — turning what would otherwise be a potentially slow or uncertain cracking process into immediate, guaranteed lateral access, which is exactly why this technique remains such a significant, well-known finding in real Windows-network penetration tests.</details>
:::

## Key terms

- **Lateral movement** — using an initial compromised foothold to reach additional systems on the same network.
- **Pass-the-Hash** — authenticating using a stolen password hash directly, without needing to crack it into plaintext.
- **Living off the land** — using an environment's own legitimate, pre-installed tools rather than introducing new malware.

## Recap

- Lateral movement is the offensive technique Path 12's network-segmentation lesson was specifically designed to contain, closing the loop between that defensive coverage and the attacker perspective.
- Credential reuse, Pass-the-Hash, and living-off-the-land techniques using legitimate remote-administration tools are the most common real-world approaches.
- Because lateral movement frequently uses legitimate credentials and tools, effective detection requires behavioral baselining (Path 24) rather than signature-based tool detection alone.

**Next up →** [Pivoting & Tunneling](#/lesson/14-ethical-hacking/pivoting-and-tunneling)
