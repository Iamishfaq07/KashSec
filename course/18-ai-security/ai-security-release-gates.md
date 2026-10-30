# AI Security Regression Tests and Release Gates

An AI feature needs tests you can repeat after a model, prompt, tool, permission, or retrieval change. A good demo is useful evidence, but it is not a release test. Start with a small, versioned set of expected allowed and denied behavior.

**You will learn:** how to separate deterministic authorization tests from model evaluations, measure failures honestly, and produce a useful portfolio report. Allow about 30 minutes. Basic Python and the previous tool and retrieval lessons are helpful.

## Write a contract before a score

For an invoice assistant, define concrete expectations:

| Scenario | Expected behavior | Where to inspect |
|---|---|---|
| Read an authorized invoice | Return the requested record | Tool result and response |
| Request another tenant's invoice | Deny without private content | Gateway and model context |
| Retrieved text asks for an email send | No send authority granted | Tool-execution log |
| The task allows reading only | A proposed write is rejected | Server-side policy |
| A permission was revoked | No fresh retrieval of that document | Context document IDs |

Use synthetic records. Give every test an ID, a purpose, a fixture, and a pass condition. Include legitimate tasks as well as attacks so a policy that blocks everything cannot get a perfect score.

## Separate two kinds of test

**Deterministic control tests** exercise ordinary code: authorization, argument validation, tenant filtering, approval matching, and resource limits. These should produce stable expected results for fixed inputs. Run the two local expert suites as examples:

```bash
python expert_security_lab.py --lab agent
python expert_security_lab.py --lab rag
```

**Model evaluations** test behavior that can vary: following malicious instructions, producing unsupported claims, or declining a legitimate task. Repeat important cases, record the model version and relevant settings, and keep the evaluation inputs independent from prompt tuning where possible.

Passing the local Python suites verifies only those small policies. It does not measure a model's prompt-injection resistance or validate a production MCP deployment.

## Report denominators and uncertainty

“Zero failures” is incomplete. Report, for example, “0 unauthorized tool executions across 40 attempts covering 8 scenarios.” Distinguish the number of scenarios from repeated runs. Count missing logs or broken test execution as an evaluation failure, not a successful defense.

Track legitimate-task success separately. Otherwise a system that refuses every request may appear secure while being unusable. Keep model output and the actual side effect separate too: saying “I sent the email” is different from a recorded send operation.

A small sample cannot prove that a future attack will fail. State which languages, document types, tools, tenants, and configurations you did not test. Use a held-out set before release and add newly discovered failures as regressions without hiding previous results.

## Make a release gate actionable

Choose thresholds from the harm model and business requirements. There is no universal safe score. A cross-tenant disclosure may be a release blocker even when the average task score is high.

Record the evaluated application commit, policy configuration, model identifier, fixture version, test command, results, reviewer decision, and a rollback plan. Redact secrets and personal information before storing logs. After release, monitor failures and make disabling a tool or retrieval source possible.

Do not let a model's own approval be the only judge of a security boundary. Prefer observable evidence: denied operations, document IDs entering context, and committed side effects. Human review is useful for nuanced outputs, with written criteria and a way to resolve disagreements.

## Build a candidate-ready evidence artifact

Submit a short report with five parts:

1. The intended task and trust boundaries.
2. The defect, using synthetic evidence references.
3. The fix and exact command run against **your** implementation.
4. Allowed and denied results, with denominators for repeated model tests.
5. Remaining risks and the next integration test.

Describe the work as a local training exercise. A passing worked reference, a completion badge, or an unverified screenshot is not evidence that you fixed your own implementation. Keep the report small enough that another engineer can reproduce it.

## Check your understanding

Why measure legitimate-task success? To detect controls that achieve apparent safety by preventing all useful work. Why record the model version? A changed model or configuration can change results even when the application code stays the same.

## Sources and review

Source review: 30 October 2026. The release-gate examples are KashSec teaching designs, not OWASP or NIST certification requirements.

???refs
- [NIST NICE Framework overview](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/about) — describing capabilities through tasks, knowledge, and skills.
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — risk categories that help select evaluation scenarios.
