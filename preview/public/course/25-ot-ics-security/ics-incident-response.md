# ICS Incident Response

Path 16's general incident response lesson covers the standard IT-focused lifecycle. This lesson covers what changes when the "system" being responded to also controls a physical process — where the usual first instinct in IT IR, isolate and contain immediately, can itself cause the exact physical harm the response is trying to prevent.

:::tip
The single hardest judgment call in ICS incident response: **is it safer to keep a possibly-compromised system running under close watch, or to shut it down immediately?** In IT, the answer is almost always "contain now." In OT, an uncontrolled shutdown of the wrong system can be more dangerous than the incident itself.
:::

## Why "pull the plug" isn't automatically the right move

Standard IT incident response often defaults to isolating a compromised host immediately. Applied naively to OT, this can:

- Trigger an **uncontrolled shutdown** of a physical process that needs to be brought down gracefully — a chemical process stopped mid-reaction, or a turbine spun down incorrectly, can cause real physical damage or danger that has nothing to do with the original cyber incident
- Cause a **worse safety outcome** than continuing to run under close monitoring while a controlled shutdown is prepared, particularly if a Safety Instrumented System (previous lesson) is still functioning independently and can catch genuinely dangerous conditions
- **Destroy forensic evidence** needed to understand the incident, if isolation involves powering equipment off entirely rather than isolating network connectivity

## Who's actually in the room for an ICS incident

Real ICS incident response involves people a typical IT incident response team never needs: **process engineers** who understand what a "safe" shutdown sequence for this specific equipment actually looks like, and often **safety officers** with authority over decisions that could affect physical safety. The security team's job shifts from "make the isolation call" to "provide the threat information the people with physical-process authority need to make that call correctly."

## A realistic incident timeline

1. **Detection** — often from the anomaly-based monitoring covered in the practical controls lesson, flagging traffic or commands that don't match the established baseline
2. **Triage with process engineering, not just security** — is the anomaly consistent with a safety-relevant condition, or is it isolated to non-critical systems that can be handled with a standard IT-style response?
3. **Controlled response** — a graceful, planned shutdown sequence if the affected system needs to come offline, coordinated by the people who know that specific process, not an immediate network disconnect
4. **Forensics that respects availability** — collecting logs and evidence in ways that don't require extended downtime on systems that need to keep running
5. **Recovery, tested before returning to production** — exactly like the patching constraints from the practical controls lesson, a compromised system doesn't go back into live production without being verified safe first

:::challenge Make the call
A monitoring alert flags unusual command traffic reaching a PLC that controls a chemical mixing process. The traffic pattern resembles the reconnaissance stage seen in a past real-world ICS attack. The process is currently mid-batch.

<details><summary>Hint</summary>What determines whether the correct move is an immediate hard stop versus a coordinated, closely-monitored shutdown — and who needs to be involved in that decision that a pure security team wouldn't normally include?</details>
<details><summary>Show answer</summary>This is exactly the scenario where process engineers and (if applicable) safety officers need to be looped in immediately, alongside the security team, rather than security making a unilateral isolation call. An uncontrolled stop mid-batch could itself create a hazardous condition depending on the specific chemistry involved — information the security team has no way to evaluate on its own. The realistic response is heightened monitoring plus an urgent, jointly-made decision: either a controlled shutdown sequence specific to this process, or continued closely-watched operation while containment measures (like tightening segmentation around that PLC's segment) are put in place — with the Safety Instrumented System, if present and unaffected, providing a real backstop either way.</details>
:::

## 🧪 Hands-on lab — draft an ICS IR escalation path

Sketch a simple escalation flowchart for a hypothetical facility: who gets notified first when OT-specific monitoring fires an alert, in what order, and at what point (if any) does the decision authority shift from the security team to process engineering or safety officers.

:::challenge Test yourself
1. Why can an immediate, IT-style isolation response sometimes be more dangerous in OT than the incident itself?
2. Who does ICS incident response typically involve that standard IT incident response doesn't?
3. Why does ICS incident forensics need to account for availability constraints in a way IT forensics usually doesn't?
:::

## Key terms

- **Controlled shutdown** — a planned, process-aware sequence for safely bringing a system offline, as opposed to an abrupt disconnect
- **Process engineer** — a specialist who understands the physical behavior and safe operating sequences of a specific industrial process, essential to real ICS incident decisions

## Recap

ICS incident response inherits every constraint this path has already established — safety and availability outrank the "contain immediately" instinct that dominates IT response — and it requires people (process engineers, safety officers) that a standard IT incident response team doesn't typically include. The security team's role shifts from making isolation calls unilaterally to feeding accurate threat information to the people with the physical-process expertise to make that call safely, which is precisely the collaborative model real ICS environments run on.

???refs
- [SANS ICS Incident Response](https://www.sans.org/white-papers/) — search SANS's ICS-specific incident response guidance
???
