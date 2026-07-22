# AppSec Program Capstone Lab

You will design a lightweight AppSec program for a fictional (or real) organisation.

:::lab
**Scenario**: A mid-size product company has ~40 engineers, 25 services (mostly TypeScript and Python on AWS), no formal AppSec function, and customers starting to ask security questionnaires. You have been asked to stand up AppSec in 90 days.
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

Define what Critical / High / Medium / Low mean in plain language, and the target fix times.

### 3. Pipeline sketch

Describe where SCA, SAST, secret scanning, and (optionally) DAST will run, and what blocks a merge vs what only creates a ticket.

### 4. Exception process

How does a team temporarily accept a risk? Who approves? How long does the exception last?

## Stretch goals

- Draft a short "Secure development baseline" (10–15 bullet points) teams can self-assess against.
- Sketch a dashboard layout (even on paper) with the metrics from the previous lesson.

## Reflection questions

1. Where would you spend your first week?
2. What would you deliberately *not* do in the first 90 days?
3. How would you get developers to trust the new scanners?

## Recap

This lab forces the prioritisation and communication skills that real AppSec leadership requires. The technical controls only work when the program around them is clear and lightweight.

???refs
- [OWASP SAMM](https://owaspsamm.org/)
- [NIST SSDF](https://csrc.nist.gov/Projects/ssdf)
???