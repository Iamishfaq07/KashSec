# Lab sandbox and trust

## Fix & Verify

The invoice exercise is a pure function in the page. It does not fetch, does not run student Python, and does not embed the vulnerable handler in the top-level origin as HTML from the user. Choices are four enums. Notes are stored as text and escaped when rendered.

The downloadable expert lab (`tenant-boundary`) is unchanged and still runs only if the learner executes it locally.

## Research and CertLab

External links use `rel="noopener noreferrer"`. Research bodies are text, not HTML from the network. Certification questions are public by design and labeled formative.

Practice labs in `studio/practice.js` are the same kind of fixture: enums and labels, graded by a pure function. Hints and debriefs are static text. Expert mode hides a hint until a check fails and hides the Northbridge story on the case home. Reset deletes that lab’s saved answers from `kashsec_studio_v1` only.

The analyst shift reads those saved results. It does not receive alerts and it does not send any.

The lesson bridge prepends text to ten existing lessons. It does not change the lesson Markdown.

## Not in this change

No new file upload, no community Markdown renderer, no server-side grader, no account, no classroom, and no outbound proxy.
