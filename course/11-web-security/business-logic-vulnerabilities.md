# Business Logic Vulnerabilities

Every vulnerability class covered so far in this path — IDOR, XSS, SQL injection — involves the application failing to properly handle malicious *input*. This lesson covers something genuinely different: vulnerabilities where every individual input is perfectly valid, but the *sequence or combination* of otherwise-legitimate actions breaks the application's intended logic.

## Why business logic bugs are structurally different

A **business logic vulnerability** doesn't require malicious payloads, injection strings, or malformed data at all — it exploits a flaw in the application's actual *workflow assumptions*, using entirely legitimate requests in an order or combination the developers never anticipated. This is exactly why automated vulnerability scanners are notoriously bad at finding these bugs — there's no malicious-looking pattern to detect, since every single request looks completely normal in isolation.

## Real examples, drawing on this course's own CTF material

Path 19's CTF Zone includes several challenges built around exactly this category:

- **Price tampering** — a checkout flow trusting a client-submitted price rather than looking it up server-side (Path 19's "Name Your Own Price" challenge)
- **Coupon replay** — a check-then-act race condition letting a single-use coupon be redeemed multiple times (Path 19's "The Coupon That Wouldn't Quit" challenge, and directly connecting to the race-conditions lesson later in this path)
- **Step-skipping** — jumping directly to a checkout confirmation step without completing (or paying for) the steps that should precede it (Path 19's "Two Steps Forward, Zero Back" challenge)

## More business logic patterns worth recognizing

- **Negative value abuse** — a shopping cart quantity field accepting a negative number, potentially causing a refund calculation to work backward in the attacker's favor
- **Workflow bypass** — an approval process with multiple required steps that can be short-circuited by directly calling a later-stage API endpoint the client-side interface doesn't normally expose
- **Rate-limit and quota abuse** — exploiting a limit that's enforced per-account but not per-resource (or vice versa), letting an attacker circumvent an intended usage cap through a technicality the logic didn't anticipate

## Why finding these requires understanding the application, not just attacking it

Unlike injection-based attacks, which follow a repeatable technical pattern regardless of what the application actually does, finding business logic flaws genuinely requires understanding *what the application is supposed to do* well enough to spot where its actual implementation diverges from that intent — a fundamentally different skill than pattern-matching known vulnerability signatures, and one that becomes considerably easier with the systematic recon habits from the web-recon lesson earlier in this path.

:::challenge Test yourself
Why are business logic vulnerabilities notoriously difficult for automated scanners to detect, compared to something like SQL injection?
<details><summary>Show answer</summary>Automated scanners work primarily by recognizing known malicious patterns — a SQL injection payload contains a recognizable structure (quotes, SQL keywords in unexpected places) that a scanner can pattern-match against, regardless of what the underlying application actually does. A business logic vulnerability involves no malicious-looking input at all — every individual request is perfectly well-formed and legitimate on its own; the flaw only becomes apparent when you understand the application's intended <em>workflow</em> and recognize that a particular sequence or combination of otherwise-valid actions produces an outcome the developers never intended. A scanner has no generic way to know what a specific application's business logic is <em>supposed</em> to look like, which is exactly why finding these bugs requires genuine human understanding of the target, not automated pattern-matching.</details>
:::

## Key terms

- **Business logic vulnerability** — a flaw in an application's intended workflow, exploited through legitimate-looking requests in an unanticipated sequence or combination.

## Recap

- Business logic vulnerabilities exploit workflow assumptions, not malformed input — every individual request looks completely legitimate.
- Price tampering, coupon replay, step-skipping, and workflow bypass are common real patterns, directly practiced hands-on in Path 19's CTF challenges.
- Finding these bugs requires genuinely understanding what an application is supposed to do, a fundamentally different skill from pattern-matching known injection signatures.

**Next up →** [Race Conditions in Web Applications](#/lesson/11-web-security/race-conditions-web)
