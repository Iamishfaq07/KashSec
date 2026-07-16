# Threat Hunting Lab

Threat hunting flips the usual security posture on its head: instead of waiting for an alert, you proactively assume a breach has already happened somewhere in your environment and go looking for evidence of it. This lab practices that hypothesis-driven mindset directly, using the same log-analysis skill this course's CTF Zone forensics challenge introduced.

## Lab approach

You'll need sample log data to hunt through — reuse the `auth.log` style data from this course's **CTF Zone forensics challenge**, or generate your own by setting up a small lab VM, deliberately performing a few "attacker-like" actions on it yourself (a brute-force attempt, an unusual login time, a new user account creation), and then hunting through the resulting logs cold, as if you didn't already know what you'd find.

## Tasks

1. **Hunt for lateral movement.** Lateral movement — an attacker moving from one compromised system to another inside a network — often leaves telltale signs: unusual authentication patterns between internal hosts, a service account logging in interactively (which it normally never does), or a login from a host that doesn't typically communicate with the target. Scan your log sample for any login events between systems/accounts that seem unusual given normal patterns.
2. **Look for unusual authentication patterns.** Beyond lateral movement specifically: logins at unusual hours (2am from an account that normally only logs in during business hours), impossible travel (the same account authenticating from geographically distant locations within a short window), or a sudden spike in authentication volume from one account.
3. **Detect living-off-the-land techniques.** Modern attackers increasingly avoid dropping obvious malware, instead abusing legitimate, pre-installed system tools (PowerShell, `certutil`, `wmic` on Windows; `curl`, `base64`, `cron` on Linux) to carry out malicious actions — this is called **living off the land (LOTL)**, and it's specifically designed to blend into normal administrative activity. Look through your sample data for any legitimate tool being used in a context that doesn't fit normal usage (e.g., `curl` downloading and immediately executing a file, rather than just fetching a page).
4. **Create simple detection rules or queries.** Turn at least one of your findings into a reusable rule — even a plain-language description like "alert if the same account has 5+ failed logins across 3+ different usernames within 2 minutes" is a legitimate first draft of a real SIEM correlation rule.

:::tip Threat hunting starts with a hypothesis, not a random search
Real threat hunting doesn't mean scrolling through logs hoping something looks wrong — it starts with a specific, testable hypothesis: "if an attacker has compromised our web server, I'd expect to see outbound connections to unusual destinations from that host." You then go verify or disprove that specific hypothesis against the data. Structure your hunt this way rather than browsing aimlessly.
:::

:::challenge Write three hunting hypotheses
Before touching any data, write three specific, testable hypotheses about what a compromise might look like in your environment (e.g., "if credential stuffing succeeded against any account, I'd expect a burst of failures immediately followed by a success from the same source"). Then go validate each one against your sample data — for each, state clearly whether it was confirmed, disproven, or inconclusive, and why.
:::

## Key takeaway

Threat hunting is a mindset shift as much as a technique: **assume compromise, then go look for evidence, rather than waiting for a tool to tell you something's wrong.** This proactive posture catches slow, careful attackers — the kind who deliberately avoid tripping automated alerts — that purely reactive detection consistently misses.

**Next up →** [Threat Modeling Lab](#/lesson/11-advanced/threat-modeling-lab)
