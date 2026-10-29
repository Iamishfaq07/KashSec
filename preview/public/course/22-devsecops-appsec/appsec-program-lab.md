# AppSec Program Capstone Lab

You will design a lightweight AppSec program for a fictional (or real) organisation. This lab ties together every lesson in this path — the tool categories, pipeline hardening, secrets/supply chain, threat modeling, metrics, and program design — into one exercise that mirrors what an actual first 90 days on the job looks like.

:::lab
**Scenario**: A mid-size product company has ~40 engineers, 25 services (mostly TypeScript and Python on AWS), no formal AppSec function, and customers starting to ask security questionnaires. You have been asked to stand up AppSec in 90 days.
:::

:::tip
Resist the urge to write an ideal, comprehensive program. The entire point of this path is that a lightweight, trusted, incrementally-adopted program beats an ambitious one that developers route around. Grade yourself on restraint as much as on coverage.
:::

## Your deliverables

### 1. 90-day plan

Write a one-page plan that covers:

- Inventory approach
- Tooling choices (and why)
- Triage / SLA model
- Champion pilot
- One or two metrics you will report to leadership

### 2. Severity & SLA definitions

Define what Critical / High / Medium / Low mean in plain language, and the target fix times. Aim for definitions concrete enough that two different engineers, given the same finding, would classify it the same way — vague definitions are the most common reason SLA programs fail in practice.

### 3. Pipeline sketch

Describe where SCA, SAST, secret scanning, and (optionally) DAST will run, and what blocks a merge vs what only creates a ticket. Be specific about *why* each gate is placed where it is — refer back to the CI/CD hardening lesson's least-privilege guidance for how these jobs should be scoped.

### 4. Exception process

How does a team temporarily accept a risk? Who approves? How long does the exception last, and what happens when it expires unresolved?

## A worked example, to calibrate against

Here's an abbreviated example answer for deliverable #1, so you have something to compare your own plan against — not to copy, since your specifics should differ:

> **Weeks 1–2**: Interview the 6 team leads owning the 25 services. Build a spreadsheet: service name, owner, language, data sensitivity (none/internal/customer PII/payment), internet-facing (Y/N). This alone usually surfaces 2–3 services nobody remembered were internet-facing.
>
> **Weeks 3–4**: Pilot dependency alerts and secret scanning on a few representative repositories, non-blocking. Check repository support, licensing, permissions, noise, and an owner for each alert before expanding.
>
> **Weeks 5–6**: Stand up a single Jira project for all security findings. Define severities (see deliverable #2). Findings route here regardless of source (SCA, manual report, pentest).
>
> **Weeks 7–8**: Recruit 3 champions from the 3 teams with the highest data sensitivity. Run first office hours.
>
> **Weeks 9–12**: Publish a one-page dashboard: SCA coverage %, critical findings older than SLA, count of design reviews run. Report to leadership with a trend, even if it's only 3 weeks of data.

Notice what this plan does *not* attempt in 90 days: no SAST gate that blocks merges, no DAST, no policy-as-code. Those are deliberately deferred for this scenario; they are not universal maturity levels or a rule that every program must follow.

## 5. Include technical evidence

Attach the report from the **AppSec Fix & Verify Lab**. Include the failing behavior, your change, the passing result from your own implementation, and one remaining integration test. Do not submit only a scanner screenshot or the result from reference mode.

Add a small requirements-to-evidence table for the invoice feature: requirement, test or review, result, owner, and reviewed version. Map formal ASVS references to a named release and its exact requirement identifiers.

## Add an expert technical review

Open the [Expert Labs collection](/expert-labs/). Choose the tenant-isolation, webhook, or release-trust case based on your fictional company's risk. Keep your chosen scope small enough to finish.

Attach four items to your program plan:

1. A finding that cites the supplied evidence and separates observed behavior from assumptions.
2. Your implementation change and results from the unchanged tests **without** `--reference`.
3. One allowed case and at least three denied cases, with an explanation of the rule each case proves.
4. A remaining integration risk, an owner, and a follow-up verification step.

A browser self-check score is a prompt to review your reasoning. It does not prove your implementation works. Reference mode tests supplied code, so its passing result is not evidence for your edited starter either.

Decide how your program would track this work: finding owner, affected version, due date, exception expiry if needed, and evidence used to close it. A ticket should not close simply because the next scanner run is green.

## 6. Plan the next learning step

Choose one role to work toward: application security reviewer, product security engineer, or DevSecOps/platform security engineer. List two skills you still need and one project that would demonstrate them. Use the certification options on the path overview if a credential supports that goal. An external exam is optional and is separate from completing this course.

## Stretch goals

- Draft a short "Secure development baseline" (10–15 bullet points) teams can self-assess against.
- Sketch a dashboard layout (even on paper) with the metrics from the previous lesson.
- Write the one-paragraph pitch you'd give a skeptical engineering director who thinks this whole function is unnecessary overhead — make the cost-of-late-fixing argument from the first lesson in this path concrete to your fictional company's numbers.

## Reflection questions

1. Where would you spend your first week?
2. What would you deliberately *not* do in the first 90 days?
3. How would you get developers to trust the new scanners, given that "developers ignore noisy tools" was the single most repeated failure mode across this entire path?
4. A customer's security questionnaire asks "do you have a documented vulnerability management SLA?" Would your 90-day plan let you honestly answer yes by day 90? If not, what's the earliest honest yes?

## Self-check rubric

Before considering this lab complete, check your plan against these questions — they're the same questions a hiring panel or a skeptical CTO would ask:

- [ ] Does your inventory step come *before* your tooling step, not after?
- [ ] Are your first tools non-blocking (visibility first, enforcement later)?
- [ ] Do your severity definitions avoid words like "significant" or "serious" without a concrete example attached?
- [ ] Does your exception process have an actual expiry date, not "review periodically"?
- [ ] Could you defend, out loud, why you picked your one or two leadership metrics over the dozen others available?

If any box is unchecked, revise that section before moving on — these are the exact gaps that turn a good AppSec plan into a program nobody trusts by month three.

## Recap

This lab forces the prioritisation and communication skills that real AppSec leadership requires. The technical controls from earlier in this path only work when the program around them is clear, sequenced sensibly, and lightweight enough that developers engage with it rather than route around it.

???refs
- [OWASP SAMM](https://owaspsamm.org/)
- [NIST SSDF](https://csrc.nist.gov/Projects/ssdf)
- [BSIMM](https://www.bsimm.com/) — real-world data on how mature programs actually sequence their capabilities
???
