# Jailbreak Defenses & Guardrails

The jailbreaks lesson catalogued attack techniques — role-play framing, encoding, multi-turn escalation. This lesson covers the defensive side: how model developers and application builders actually harden against these techniques, directly connecting to Path 12's defense-in-depth lesson, since no single defensive layer covered here is sufficient alone.

## RLHF hardening — the first, foundational layer

Directly connecting to the jailbreaks lesson's RLHF reference: model developers continuously incorporate discovered jailbreak techniques back into safety training itself — every well-documented technique (the specific DAN persona framing, for instance) becomes training data teaching the model to recognize and resist that specific pattern in future versions. This is exactly why the base lesson noted that older, simpler techniques are "more of a baseline test than a sophisticated attack" against modern models — the arms race between jailbreak discovery and safety retraining is continuous and ongoing.

## Input-side classifiers — a separate defensive layer

Beyond the model's own trained behavior, many production AI applications add a **separate, dedicated classifier model** that screens incoming prompts *before* they ever reach the main model — specifically trained to recognize jailbreak attempt patterns (unusual encoding, role-play framing markers, instruction-override language) and block or flag suspicious requests independently of whatever the main model's own judgment concludes. This adds genuine defense-in-depth: even if a jailbreak technique successfully fools the main model's safety training, a well-tuned input classifier operating on a different, independently-trained basis may still catch it.

## Output-side classifiers — catching what slips through

Symmetrically, **output classifiers** screen the model's generated response *before* it's shown to the user — checking whether the actual output content violates policy, regardless of whether the input looked suspicious or not. This catches a genuinely important edge case: a cleverly-crafted prompt that doesn't trigger the input classifier but somehow still produces a policy-violating response gets caught at this second checkpoint instead, directly mirroring the defense-in-depth principle of never relying on a single control point.

## Constitutional AI and self-critique approaches

A more architecturally-integrated approach: some models are trained to critique and revise their own draft responses against an explicit set of principles (sometimes called a "constitution") before finalizing an answer — effectively building a form of self-review directly into the generation process itself, rather than relying entirely on a separate external classifier. This connects directly to why some jailbreak techniques that successfully bypass a model's *initial* instinct sometimes still fail, because a self-critique step catches the problematic content on a second pass.

## Rate limiting and behavioral monitoring, applied to jailbreak attempts

Directly connecting to Path 24's UEBA/behavioral-analytics lesson: an account or session making unusually many jailbreak-pattern-matching requests in a short window (many role-play or encoding attempts in sequence) is itself a detectable behavioral signal, independent of whether any individual attempt actually succeeds — exactly the same "unusual pattern over time" detection philosophy that lesson applied to network behavior, here applied to conversational interaction patterns instead.

## Why layered defense, not a single fix, is the realistic goal

:::tip No single layer is claimed to be sufficient on its own
Directly connecting to Path 12's defense-in-depth principle generally: RLHF hardening, input classifiers, output classifiers, self-critique, and behavioral monitoring each catch a different subset of attempts and each have known bypass techniques individually — the honest, professionally accurate claim any of these defenses can make is "meaningfully raises the cost and reduces the success rate of jailbreak attempts," not "makes jailbreaking impossible." This connects directly to the ai-red-teaming lesson's coverage of why continuous, adversarial testing against a real deployed system remains necessary even after every defensive layer here has been implemented.
:::

:::challenge Test yourself
Why do input-side and output-side classifiers provide meaningfully different protection, rather than one simply being a redundant duplicate of the other?
<details><summary>Show answer</summary>An input classifier evaluates the user's prompt <em>before</em> the main model ever processes it, looking for known suspicious patterns in how the request is phrased — but it has no visibility into what the main model would actually generate in response, meaning a genuinely novel jailbreak phrasing that doesn't match any known suspicious pattern can slip past the input classifier entirely, even if it later successfully manipulates the main model into producing a policy-violating response. An output classifier, by contrast, evaluates the actual generated content itself, completely independent of how cleverly or unusually the original request was phrased — it doesn't need to recognize the jailbreak <em>technique</em> at all, it only needs to recognize that the <em>resulting content</em> violates policy, which is a fundamentally different and complementary detection task. This is precisely why defense-in-depth calls for both layers together: the input classifier catches known attack patterns cheaply and early, while the output classifier provides a technique-agnostic safety net catching violations regardless of how the attacker got there, each compensating for exactly the blind spot the other has.</details>
:::

## Key terms

- **Input/output classifiers** — separate models screening prompts before processing or responses before display, independent of the main model's own judgment.
- **Constitutional AI / self-critique** — training a model to review and revise its own draft responses against explicit principles before finalizing an answer.
- **Defense-in-depth for AI safety** — combining multiple independent defensive layers, none individually sufficient, mirroring Path 12's general security principle.

## Recap

- RLHF hardening continuously incorporates newly-discovered jailbreak techniques back into safety training, an ongoing arms race.
- Input and output classifiers provide complementary, non-redundant protection — one catches known attack patterns early, the other catches violating content regardless of technique.
- Self-critique approaches build a review step directly into generation, catching some attempts that slip past initial instinct.
- No single layer is sufficient alone; the realistic, honest goal is meaningfully raising attack cost and reducing success rate through layered defense.

**Next up →** [The OWASP LLM Top 10](#/lesson/18-ai-security/llm-top-10)
