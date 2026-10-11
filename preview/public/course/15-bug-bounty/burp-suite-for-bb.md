# Burp Suite for Bug Bounty Workflow

The recon pipeline lesson covered automated discovery tools like subfinder and httpx. This lesson covers the manual-testing counterpart most bounty hunters live in daily — directly connecting to Path 10's Burp Suite introduction, now applied specifically to bug bounty workflow rather than general web-app testing.

## Recon output feeds directly into Burp

The recon pipeline's output — a list of live hosts and discovered endpoints from `httpx` and `gau` — isn't the finish line, it's the input to this lesson's actual manual testing phase. A genuinely common beginner mistake is treating automated recon as sufficient on its own; the real vulnerability hunting mostly happens after that list exists, working through it manually in Burp.

## Proxy setup, revisited for scale

Path 10 covered basic Burp proxy configuration. For bug bounty work specifically, **Target > Scope** configuration matters enormously more: adding a program's exact in-scope domains (from the previous lesson's scope-reading discipline) to Burp's scope settings means every other tab — Proxy history, Repeater, the Logger — can filter to only in-scope traffic, directly preventing the accidental out-of-scope testing the previous lesson warned about.

## Repeater — the actual bug-hunting workhorse

Nearly all manual bug bounty testing happens in **Repeater**: capturing a request, sending it to Repeater, then methodically modifying parameters, headers, and values to observe how the application responds to each variation. This is the exact mechanism behind the hunting-idor lesson's two-account method — changing an ID parameter and resending is a Repeater operation, performed dozens or hundreds of times across a single target.

## Burp extensions worth knowing

- **Autorize** — automatically resends every captured request as a lower-privileged user, directly automating the two-account IDOR-hunting method this path teaches manually
- **Param Miner** — discovers hidden, unlinked parameters a target's code processes but never exposes in its visible UI, often a rich source of overlooked functionality
- **Logger++** — retains and lets you search across the full history of requests/responses, useful when a pattern only becomes visible after testing dozens of endpoints

## Building a testing checklist inside Burp

A genuinely practical habit: using Burp's **Comments** feature (right-click any request in history) to mark endpoints as "tested — auth checked," "tested — IDOR checked," or "needs revisit," directly connecting to the systematic, checklist-driven testing culture Path 10's OWASP Testing Guide references — turning ad-hoc clicking around into a methodical, repeatable process that scales across a target with hundreds of endpoints.

:::tip Burp Suite Community is genuinely sufficient to start
The paid Professional edition adds the active scanner and several time-saving extensions, but Community Edition's Proxy, Repeater, and Intruder are fully sufficient to find real, payable bugs — a genuinely low barrier to entry worth knowing before assuming a paid license is a prerequisite for serious bounty hunting.
:::

:::challenge Test yourself
Why does configuring Burp's Target > Scope specifically matter for bug bounty work, beyond just organizing the traffic view?
<details><summary>Show answer</summary>Beyond simple organization, scope configuration directly connects to the legal boundary the previous lesson emphasized: a bug bounty program only authorizes testing against its explicitly listed in-scope assets, and accidentally sending a crafted, potentially aggressive Repeater request to an out-of-scope domain (a third-party integration, an unrelated subdomain that happened to appear in browsing history) genuinely risks the same authorization problem as manually typing a request to the wrong target. Configuring scope correctly means Burp's various views (Proxy history, the Logger, and critically, tools like Intruder that send many automated requests) can filter or restrict activity to only the domains actually authorized for testing, turning a manual discipline ("remember to only test in-scope things") into a tool-enforced one that's much harder to violate by accident during a long, multi-hour testing session.</details>
:::

## Key terms

- **Target Scope** — Burp's configuration restricting which domains its tools operate against.
- **Repeater** — Burp's tool for manually modifying and resending individual requests, the primary bug-hunting workhorse.
- **Autorize** — a Burp extension automating privilege-comparison testing across two accounts.

## Recap

- Recon output feeds directly into manual Burp testing — automated discovery finds the targets, Burp is where the actual vulnerability hunting happens.
- Repeater is the core workhorse tool, and it's the literal mechanism behind the two-account IDOR method taught later in this path.
- Configuring Target Scope correctly turns the previous lesson's legal-boundary discipline into a tool-enforced habit, not just a manual one to remember.

**Next up →** [Writing effective bug bounty reports](#/lesson/15-bug-bounty/report-writing)
