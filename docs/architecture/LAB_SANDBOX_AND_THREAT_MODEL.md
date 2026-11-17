# Lab sandbox and trust

## Fix & Verify

The invoice exercise is a pure function in the page. It does not fetch, does not run student Python, and does not embed the vulnerable handler in the top-level origin as HTML from the user. Choices are four enums. Notes are stored as text and escaped when rendered.

The downloadable expert lab (`tenant-boundary`) is unchanged and still runs only if the learner executes it locally.

## Research and CertLab

External links use `rel="noopener noreferrer"`. Research bodies are text, not HTML from the network. Certification questions are public by design and labeled formative.

## Not in this change

No new file upload, no community Markdown renderer, no server-side grader, and no outbound proxy.
