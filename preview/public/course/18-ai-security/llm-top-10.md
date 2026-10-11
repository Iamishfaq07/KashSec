# OWASP Top 10 for LLM Applications: 2026

**Edition matters.** OWASP published a 2026 edition of its LLM application risk list. The numbers in older reports cannot be read as if they refer to the same risks: for example, LLM03 meant training-data poisoning in the 2023–24 list, while **LLM03:2026 means excessive agency**. Always cite the year with the code. The [OWASP 2026 guide](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) is the source for this lesson.

## The 2026 list at a glance

| Code | OWASP category | What to examine in a real application |
|---|---|---|
| LLM01:2026 | Prompt Injection | Can untrusted prompts, retrieved text, tool results, or media redirect model behavior? |
| LLM02:2026 | Sensitive Information Disclosure | Can responses expose private user data, secrets, or confidential material? |
| LLM03:2026 | Excessive Agency | Can the model invoke tools or change data beyond its legitimate task? |
| LLM04:2026 | Supply Chain | Are models, datasets, packages, and deployment artifacts authentic and trustworthy? |
| LLM05:2026 | Data and Model Poisoning | Can an attacker corrupt training, fine-tuning, retrieval, or model behavior? |
| LLM06:2026 | Unbounded Consumption | Can requests consume disproportionate compute, tokens, money, or capacity? |
| LLM07:2026 | Misinformation | Can confident but false output drive a consequential decision or action? |
| LLM08:2026 | Hidden Context Exposure | Can protected context, prompts, memory, or internal instructions leak? |
| LLM09:2026 | Vector and Embedding Weaknesses | Can retrieval indexing or similarity search cross a trust or tenant boundary? |
| LLM10:2026 | Improper Output Handling | Is model output passed to HTML, code, commands, or queries without validation? |

The list concerns **applications using an LLM**. An autonomous agent also needs the separate [OWASP Top 10 for Agentic Applications:2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/), which focuses on tool use, identity, memory, delegation, and cascading actions. Neither list alone is a complete test plan.

## Follow the trust boundary, not just the prompt

Consider an assistant that summarizes a third-party page and can send email. The page is **data**, not an authorized user instruction. If hidden text on that page persuades the assistant to send a private document, several risks interact:

1. **LLM01**: the page's instructions cross from untrusted content into the assistant's decision-making.
2. **LLM03**: email-sending authority is available to a task that only needs to summarize.
3. **LLM02**: the resulting message discloses private material.

An effective design narrows tool permissions, checks each tool call against the user's actual request, and requires approval for consequential sends. A prompt telling the model to “ignore malicious instructions” is useful context but cannot enforce an authorization boundary by itself.

## Output and retrieval risks

An LLM response is untrusted data. If a website inserts that response directly into HTML, it can create XSS. If an application executes a model-generated SQL statement, it can alter or disclose data. **LLM10:2026** therefore calls for the same concrete controls used elsewhere in this course: context-aware HTML encoding or sanitization, parameterized database operations, and isolation for code execution. The model's confidence does not make its output safe.

Retrieval adds a different boundary. A vector search may return another tenant's private document because of a missing authorization filter, or a poisoned document may rank highly and carry attacker instructions. Treat **LLM09** as a retrieval-system issue and **LLM01** as the instruction-following failure that can follow from a poisoned result. Test both the data-access control and the assistant's behavior.

## Earlier editions are still useful when labeled

The 2023–24 edition listed *Insecure Output Handling* as **LLM02**, *Training Data Poisoning* as **LLM03**, *Model Denial of Service* as **LLM04**, and *Excessive Agency* as **LLM08**. Those topics remain relevant, but their current identifiers are **LLM10:2026**, **LLM05:2026**, **LLM06:2026**, and **LLM03:2026** respectively. The 2025 edition also used a different ordering. When reading an old assessment, preserve its original code and year rather than silently relabeling its evidence.

The 2026 guide broadens prompt-injection examples to include multimodal input and persistent memory. It also treats hidden context more broadly than the older “system prompt leakage” label. These changes reflect how LLM applications now combine models with retrieval, memory, and tools; they do not make earlier case studies useless.

## Practice — assess a coding assistant

Imagine a coding assistant that should read a repository and suggest a patch. It can also run shell commands and publish releases. On a project you own or a toy design, write down:

1. Which permissions are needed for the stated task, and which should be removed? (**LLM03**)
2. What could happen if a README contains instructions aimed at the assistant? (**LLM01**)
3. How will you review code, commands, and any HTML produced by the model before use? (**LLM10**)
4. How will you limit token use and repeated tool calls? (**LLM06**)
5. What evidence would show that a suggested claim is correct before a human acts on it? (**LLM07**)

:::challenge Test yourself
A report from 2023 calls an overly powerful AI tool “LLM08.” Which code names that risk in the 2026 LLM list, and what additional OWASP list should you consult if the tool acts autonomously?

<details><summary>Show answer</summary><strong>LLM03:2026, Excessive Agency.</strong> Also consult the OWASP Top 10 for Agentic Applications:2026. The 2023 code must retain its year when quoted.</details>
:::

## Key terms

- **OWASP LLM Top 10:2026** — the current, versioned risk categories for applications powered by LLMs.
- **Excessive agency** — tool permissions or autonomy greater than the authorized task requires.
- **Improper output handling** — unsafe use of model output by another component.
- **Hidden context exposure** — disclosure of protected instructions, memory, or other internal context.
- **Unbounded consumption** — resource or cost exhaustion through uncontrolled model use.

## Recap

- Name the edition when citing an LLM risk code; several numbers changed between 2023–24, 2025, and 2026.
- Test authorization, retrieval isolation, output handling, and resource limits alongside prompt injection.
- Pair the LLM list with the Agentic Applications:2026 list when the model can take actions.

???refs
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — current guide and downloadable full text.
- [OWASP LLM 2025 list](https://genai.owasp.org/llm-top-10/) — historical comparison.
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — complementary guidance for tool-using agents.
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — broader AI risk-management context.
???

**Next up →** [RAG Security Risks](#/lesson/18-ai-security/rag-security-risks)
