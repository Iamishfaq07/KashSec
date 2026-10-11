# Multimodal Attack Vectors

The llm-red-teaming-playbooks lesson (later in this path) briefly flags multimodal input as needing dedicated test cases. This lesson goes deep into exactly why — as models increasingly accept images, audio, and file uploads alongside text, the attack surface this path has covered so far (all fundamentally text-based) expands in genuinely new directions, directly connecting to the indirect-prompt-injection-deep-dive lesson's coverage of untrusted content entering a model's context.

## Why multimodal inputs aren't just "more input formats"

Directly connecting to the transformer-architecture-deep-dive lesson: a multimodal model doesn't process an image as a fundamentally separate thing from text — modern vision-language models convert image content into token-like representations that get fed into essentially the same attention mechanism processing the text prompt, meaning content extracted from an image can influence the model's response in a manner structurally similar to text in the prompt itself, just via a different input pathway with different human-visibility characteristics.

## Image-based prompt injection

The most direct multimodal attack: embedding text within an image that a model's vision capability reads and processes as though it were part of the prompt — a screenshot containing a small block of instructional text in the corner, invisible or easily overlooked to a human glancing at the image, but fully legible to the model's vision component. This directly extends the indirect-prompt-injection lesson's core problem (untrusted content entering context and being treated as instruction) into a channel that's genuinely harder for a human reviewer to spot during a quick visual check than equivalent text would be.

## Steganographic and adversarial-perturbation techniques

Directly connecting to the poisoning-and-adversarial-ML lesson's adversarial-example coverage: some multimodal attacks go further than plainly visible embedded text, using **steganographic** techniques (hiding data within an image's pixel-level structure, invisible to human perception entirely) or **adversarial perturbations** (small, carefully calculated pixel modifications designed to influence a specific model's internal processing in a targeted way) — both representing a meaningfully higher sophistication tier than simply writing visible text into a corner of an image.

## Audio and voice-based attack surfaces

As voice-interactive AI assistants become more common, **audio-based injection** introduces its own distinct considerations: spoken instructions embedded within audio content the model transcribes and processes (background audio in a video call, an audio file uploaded for summarization) can inject instructions exactly like image-embedded text does, and audio carries an additional wrinkle — a human reviewing a transcript summary might see only the model's interpretation of the audio, not the raw audio itself, making a hidden or subtly-embedded spoken instruction potentially even less likely to be caught during review than a visible image-based one.

## File upload and metadata vectors

Directly connecting to the llm-supply-chain-attacks lesson's document-handling coverage: files uploaded for an AI system to process (PDFs, Word documents, spreadsheets) carry attack surface beyond their visible content — document metadata, hidden form fields, or embedded objects can all potentially reach a model's context if the application's document-processing pipeline extracts and includes them, even when a human reviewing the document's visible content sees nothing unusual at all.

## Why defenses have to be modality-specific

:::warning Text-focused defenses don't automatically transfer to other modalities
An input classifier trained specifically to recognize suspicious text patterns (from the jailbreak-defenses-and-guardrails lesson) has no inherent ability to recognize an equivalent attack pattern embedded within an image or audio file unless it was specifically trained on that modality too — this is exactly why a genuinely thorough security review of a multimodal AI application needs dedicated, modality-specific testing for every input type the system actually accepts, rather than assuming text-focused defensive measures provide equivalent protection across every other input channel by default.
:::

:::challenge Test yourself
Why might a hidden instruction embedded in an uploaded image be genuinely harder for a human reviewer to catch than the equivalent instruction embedded as plain text in a chat message?
<details><summary>Show answer</summary>When an attacker embeds a malicious instruction directly as visible text in a chat message, a human reviewing the conversation log or the application's input can simply read the full message and immediately notice the suspicious instruction sitting in plain sight. An image, by contrast, is something a human typically perceives holistically and quickly — glancing at a screenshot or photo doesn't naturally involve reading every pixel with the same systematic scrutiny as reading a line of text, meaning a small block of instructional text placed in a corner, rendered in a low-contrast color, or sized small relative to the rest of the image can easily go unnoticed by a human doing a normal visual review, even though it's fully legible to the model's vision component processing the same image at the pixel level. This asymmetry — full model visibility into content that receives only partial human scrutiny — is exactly the property that makes image-based (and similarly, audio-based) prompt injection genuinely more insidious than the equivalent plain-text attack, and it's precisely why dedicated multimodal test cases in a red-teaming playbook can't simply be assumed to be redundant with thorough text-based testing.</details>
:::

## Key terms

- **Image-based prompt injection** — embedding instructional text within an image, legible to a model's vision capability but easily overlooked by a human reviewer.
- **Steganographic technique** — hiding data within an image's pixel-level structure, invisible to human perception entirely.
- **Modality-specific defense** — the requirement that input/output classifiers and other defenses be independently trained and tested for each input type a system accepts.

## Recap

- Multimodal models process image, audio, and text content through structurally similar mechanisms, meaning non-text content can influence output much like text prompts do.
- Image-based injection exploits the gap between full model visibility into pixel-level content and only partial human scrutiny during a quick visual review.
- Audio and file-upload vectors introduce their own distinct considerations, including reduced human visibility into raw content versus a model's processed interpretation.
- Text-focused defenses don't automatically transfer to other modalities, requiring dedicated, modality-specific testing for every input type a system accepts.

**Next up →** [AI red-teaming methodology](#/lesson/18-ai-security/ai-red-teaming)
