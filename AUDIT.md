# Lesson reliability and course audit

This change checks the root static site and the React preview app separately.

## Fixed behavior

- The main reader can recover when its sanitizer script fails to load. Markdown is never shown without sanitization.
- Both readers reject HTML error pages returned in place of Markdown. The preview has a 15-second request limit, cancellation on navigation, a retry button, and a bounded cache for return visits.
- Finish & continue saves completion and notes before moving to the next lesson. The main reader uses in-page navigation.
- Reading progress updates once per animation frame. Very tall lesson blocks no longer stay hidden on small screens.
- Preview Markdown is sanitized with DOMPurify. Formatted headings render correctly; repeated headings receive distinct anchors, and the contents list uses the rendered headings.
- Preview course and quiz JSON live in the source tree, where Vite can import them. Quiz attempts remount when switching question banks so old answers cannot become a score for a different quiz.
- Beginner study instructions are shorter and explain the next step. Unsupported learning-pyramid retention percentages were removed. The Kerberoasting lab summary now distinguishes a ticket's encrypted material from a password hash and recommends managed service accounts.

## Repeatable checks

From the repository root, run `npm ci`, `npm run build`, and start `python3 -m http.server 8000`.

- `npm run test:data`: lesson files, internal links, quiz coverage, generated assets, lab/tool route wiring.
- `npm run test:audit`: render all 485 lessons with the actual browser sanitizer and open all 42 lab routes, collecting JavaScript errors. Also runs in CI.
- `npm run test:cdn`: blocked CDNs, failed requests and scripts, timeouts, retry, fallback reading, notes, progression, and tall blocks.
- `npm test`: the wider existing browser regression suite.

For the preview, run `npm --prefix preview ci` and `npm --prefix preview run dev` in another terminal.

- `npm run test:preview-lessons`: retry, finish/continue, all 485 lesson renders, sanitization, formatted headings, duplicate anchors.
- `npm --prefix preview run test:lessons`: failure/retry/cache, HTML fallback rejection, cancellation, timeout.
- `npm --prefix preview run typecheck` and `npm --prefix preview run build:dev`: TypeScript and production compilation without the deployment database migration.

Set `CHROMIUM_PATH` if using a system Chromium rather than Playwright's downloaded browser.

## Limits and existing gaps

These checks establish file coverage, rendering, route availability, and the interactions tested. Opening a lab route does not prove every possible lab answer or simulation behavior is correct. External VM labs and third-party resources were not executed, and all 485 technical explanations have not received a line-by-line subject-matter review.

The preview's existing `npm test` has 180 passing and 15 failing tooling tests, reproduced on unchanged commit `0db7a51` as well as this branch. The failures concern absent `.grok/skills` documentation, template-only PWA/server assets, and template environment defaults. They are separate from the new lesson tests, typecheck, and build. Do not interpret the preview's full tooling suite as green.

The original iframe error in the lab audit came from Playwright's injected service-worker-blocking script inside the intentionally sandboxed XSS frame. The audit now blocks worker registration at the network instead. The app also guards access to unavailable service-worker APIs.
