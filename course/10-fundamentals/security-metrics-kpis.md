# Security Metrics & KPIs

You've now covered a huge range of security fundamentals — controls, vulnerability management, incident response, policy, physical security. This lesson closes the loop with a genuinely under-taught but essential question: how do you actually know whether any of it is *working*?

## Why "we have security controls" isn't the same as "we're secure"

Every earlier lesson in this path described controls and processes — but having a control in place says nothing about whether it's *effective*. This is precisely the gap the security-policies-and-awareness lesson identified between having a policy and actually following it, generalized here to the entire security program: measurement is what separates a genuine security posture from a collection of well-intentioned but unverified assumptions.

## Common security metrics worth knowing by name

- **MTTD (Mean Time to Detect)** — on average, how long between an incident starting and someone actually noticing it? Directly reflects the maturity of the detective controls from the security-controls-types lesson
- **MTTR (Mean Time to Respond/Resolve)** — on average, how long from detection to actually containing and resolving an incident? Reflects the effectiveness of the incident-response process from earlier in this path
- **Patch compliance rate** — what percentage of systems are actually up to date with available security patches, directly measuring the vulnerability-management lifecycle in practice, not just in policy
- **Phishing simulation click-through rate** — what percentage of employees click a simulated phishing test, tracked over time to measure whether security awareness training is actually changing behavior

## Why trends matter more than any single snapshot number

A single metric captured once tells you very little — an MTTD of "4 hours" is meaningless without context: is that improving or getting worse? How does it compare to similar organizations? The real value of security metrics comes from tracking them consistently **over time**, revealing whether a security program is genuinely improving, stagnant, or quietly getting worse despite continued investment.

## Why choosing the wrong metrics can be actively misleading

:::danger Measuring the wrong thing can look like progress while security actually worsens
A team that's measured purely on "number of vulnerabilities patched per month" might rationally prioritize easy, low-severity patches over harder, more critical ones — technically improving their metric while leaving the organization's most dangerous exposures unaddressed. This is exactly why the vulnerability-management lesson's point about prioritizing by actual exposure, not just raw count, matters directly here too: metrics shape behavior, and poorly chosen metrics can shape it in the wrong direction entirely.
:::

## Connecting metrics back to the whole path

Every metric named in this lesson maps directly onto an earlier lesson's concept: MTTD measures detective-control effectiveness, MTTR measures incident-response maturity, patch compliance measures the vulnerability-management lifecycle in practice, and phishing click-through rate measures whether security-awareness training is genuinely working rather than just being delivered. This lesson isn't introducing a separate topic — it's the measurement layer sitting on top of everything else this path has taught.

:::challenge Test yourself
Why might an organization that only tracks "number of security policies published" be measuring the wrong thing, even though publishing policies is genuinely valuable work?
<details><summary>Show answer</summary>The number of policies published measures <em>output</em> — how much documentation exists — rather than <em>outcome</em>, whether those policies are actually followed, enforced, and effective at reducing real risk, exactly the gap the security-policies-and-awareness lesson described between having a policy and actually living up to it. An organization could publish dozens of thorough, well-written policies while enforcement remains inconsistent and actual security posture doesn't meaningfully improve — the metric would show impressive, growing numbers while genuine risk stays flat or even worsens. A more meaningful metric would track something closer to actual outcomes: policy compliance audit results, or a reduction in the specific incident types a given policy was written to prevent — measuring whether the policy is actually working, not just whether it exists.</details>
:::

## Key terms

- **MTTD (Mean Time to Detect)** — the average time between an incident starting and it being detected.
- **MTTR (Mean Time to Respond/Resolve)** — the average time from detection to full incident resolution.
- **Patch compliance rate** — the percentage of systems actually up to date with available security patches.

## Recap

- Having security controls in place says nothing about whether they're actually effective — measurement is what closes that gap.
- MTTD, MTTR, patch compliance, and phishing simulation click-through rates are standard metrics, each directly measuring a concept covered earlier in this path.
- Metrics matter most as trends over time, not single snapshots, and choosing the wrong metric can actively incentivize the wrong behavior — a genuine risk worth designing around deliberately.

**Next up →** [Risk Assessment Lab](#/lesson/10-fundamentals/risk-assessment-lab)
