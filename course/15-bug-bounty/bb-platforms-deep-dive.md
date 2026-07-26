# Bug Bounty Platforms, Deep Dive

The what-is-bb lesson named HackerOne, Bugcrowd, and Intigriti in passing. This lesson goes deeper into how these platforms actually operate — the mechanics behind the marketplace, directly connecting to Path 20's freelance-platform coverage as the same intermediary-marketplace model applied to security research specifically.

## Why platforms exist at all

An organization could run a bug bounty program entirely on its own — its own portal, its own triage team, its own payment processing. Most don't, for the same reason most companies use a job board instead of building their own recruiting website: **platforms** (HackerOne, Bugcrowd, Intigriti, YesWeHack) provide the shared infrastructure — submission forms, triage staff, payment processing, and a pool of researchers already vetted and reputation-scored — that would otherwise need to be rebuilt by every single program from scratch.

## The triage layer — the part beginners underestimate

Every submitted report passes through **triage** before it ever reaches the actual client engineering team: a platform (or sometimes client-internal) triager reviews the report, attempts to reproduce it, assigns an initial severity, and either forwards it to the client or requests more information. Directly connecting to the report-writing lesson later in this path: a report a triager can't quickly reproduce gets bounced back with a clarification request at best, or closed as "unable to reproduce" at worst — meaning report quality determines triage speed just as much as the underlying vulnerability's actual severity.

## Reputation and signal — why it compounds

Most platforms track a researcher's **reputation score** — a running signal built from accepted reports, average severity, and false-positive rate — and many private (invite-only) programs use this score to decide who even gets invited to test. This creates a genuinely important early-career dynamic: a beginner's first several reports matter disproportionately, not just for their bounty payout but for the reputation compounding that eventually unlocks access to the higher-paying private programs the choose-programs lesson will cover next.

## Managed vs. self-managed programs

- **Fully platform-managed** — the platform's own triage staff handle first-pass review before anything reaches the client, reducing noise the client engineering team has to deal with directly
- **Client-managed** — the client's own security team triages submissions directly, common among larger organizations with dedicated in-house AppSec capacity
- **Hybrid** — platform triage for an initial pass, escalated to client teams for final severity/payout decisions

## Why this matters for where you start

Directly connecting to the next lesson's program-selection guidance: understanding that private programs are reputation-gated (not just randomly harder to get into) explains why the standard beginner advice is to build reputation on public programs first — it's not just about skill development, it's about the platform's own gating mechanism requiring a track record before better-paying opportunities open up.

:::challenge Test yourself
Why does report quality affect triage speed, not just the eventual bounty payout?
<details><summary>Show answer</summary>A triager's job is to quickly verify whether a reported vulnerability is real and reproducible before forwarding it to the client's engineering team — a report with vague reproduction steps forces the triager to spend extra time (or fail entirely) attempting to recreate the issue themselves, which either delays the report while they request clarification from the researcher or results in the report being closed as unreproducible even if the underlying vulnerability is genuinely real. A precise, complete report (exact steps, exact payload, clear impact) lets the triager verify and forward it quickly, which matters because triage capacity is a genuinely limited resource shared across every researcher submitting to that program — a report that's easy to triage moves faster through the queue purely as a side effect of being easy to verify, independent of the vulnerability's actual underlying severity.</details>
:::

## Key terms

- **Triage** — the review process a submitted report passes through before reaching the client's engineering team.
- **Reputation score** — a platform's running signal of a researcher's accepted reports, severity, and false-positive rate.
- **Private program** — an invite-only bounty program, typically gated by reputation score.

## Recap

- Platforms provide shared triage, payment, and researcher-pool infrastructure that individual programs would otherwise rebuild themselves.
- Triage is the critical first filter every report passes through — report quality affects triage speed independently of underlying severity.
- Reputation compounds over time and gates access to higher-paying private programs, which is why early reports matter disproportionately.

**Next up →** [Choosing programs & scope](#/lesson/15-bug-bounty/choose-programs)
