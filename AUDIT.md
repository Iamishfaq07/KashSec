# Lesson reliability and course audit

## Lesson-aligned AppSec checks — 2026-10-29

All 18 AppSec lessons now have dedicated questions keyed by stable lesson IDs. The static and preview readers share generated question data. Broader quiz-bank practice is labeled as path practice because it may cover material from a later lesson. Answers are optional and do not modify quiz scores or reading completion.

`npm run test:lesson-checks` and `npm run test:preview-checks` validate the question data against the current lesson catalog and source headings, then exercise wrong and correct answers, feedback focus, retries, source-section review, navigation, refresh, screen widths, and finishing without answering. This checks the authored AppSec material and interaction; it does not establish factual accuracy of the entire course.

The preview lesson grid also constrains article width so wide code and diagrams scroll within the lesson on phones.

The root static academy and the React app under `preview/` were checked separately. The root deployment excludes the separate prototype and internal tooling, so server source is not published as static website content.

## Changes

- Recover required lesson-renderer dependencies, reject HTML error responses, retain readable fallbacks and offer retry. Preview requests have a timeout, cancellation on navigation and a bounded return-visit cache.
- Add Finish & continue, saving notes and completion before advancing. Preserve responsive-menu focus and keep onboarding from covering damaged-progress recovery controls.
- Update reading progress once per animation frame and reveal tall blocks correctly on small screens.
- Sanitize both Markdown renderers. Fix preview formatted headings, duplicate anchors, contents links, Vite JSON imports and quiz state when changing banks.
- Simplify beginner study instructions, remove unsupported retention-pyramid percentages, clarify Kerberoasting and correct stale course-coverage documentation.
- Patch sanitizer dependencies, Better Auth and Vite. Better Auth 1.7 uses a shared `/api/auth/oauth2` base so the broker's registered callback URLs stay unchanged. Older cached clients' session, sign-in and sign-out requests are normalized to the new API.
- Wire the missing preview auth API and activate its existing database migration. Initialize auth after the database is ready, without an unobserved background rejection. Bundle the embedded database's WASM/data files for the compiled server.
- Replace the install page's missing images with readable platform instructions. Serve KashSec icons at 180, 192 and 512 pixels, including a maskable icon, and use KashSec's configured name in the manifest and install page.

## Repeatable checks

From the root: `npm ci`, `npm run build`, then `python3 -m http.server 8000`.

- `npm run test:data`: lesson files, internal links, quiz coverage, generated artifacts, and lab/tool route wiring.
- `npm run test:audit`: render all 485 lessons with the browser sanitizer and open all 42 lab routes, collecting JavaScript errors. Included in CI.
- `npm run test:cdn`: blocked CDNs, failed requests/scripts, timeouts, retry, reading fallbacks, notes, progression and tall blocks.
- `npm test`: the existing full regression suite. Per-feature checks also cover navigation, accessibility, offline packs, recovery, planner, investigations, playground, starting guide, practice return, flashcards, review, exams, search and tasks.

For the preview: `npm --prefix preview ci` and `npm --prefix preview run dev`.

- `npm run test:preview-lessons`: retry, finish/continue, all 485 lesson renders, sanitization and heading anchors.
- `npm run test:preview-platform`: old/new auth endpoints, OAuth initialization with unchanged callback URLs, cookie-bearing untrusted-origin rejection, manifest, icons and the mobile install page. It does not follow the broker's authorization URL or sign in to an external provider.
- `npm --prefix preview test`: 255 passing tests; four optional platform-authoring-document checks are skipped explicitly because those external documents are not shipped with this application. Unit fixtures no longer inherit the real app's metadata or assume template authentication defaults.
- `npm --prefix preview run typecheck` and `npm --prefix preview run build:dev`: TypeScript and compiled output, without running deployment database migrations against an external database.
- After building, `npm run test:preview-runtime`: temporarily remove a generated embedded-database asset, check that failed auth leaves lessons usable, restore it and check auth recovery. The test uses a separate local process, forces the embedded database and restores the asset in `finally`.

Set `CHROMIUM_PATH` to use system Chromium. Preview browser checks use port 8080 by default; `PREVIEW_BASE` selects another local server.

## Findings and limits

Both complete dependency audits report zero vulnerabilities at verification time. Local coverage includes all 485 lesson renders in each frontend, all 42 main-site lab routes, and the interactions described above. Course files and quiz banks exist for all 26 paths.

Rendering and route checks do not establish that every technical explanation or every possible lab answer is correct. The two beginner study lessons and specific lab wording were revised; the full course has not received a line-by-line subject-matter review. External VM labs and a real upstream-provider OAuth sign-in were not executed.

PR #40 was merged as `c49fa04`, and its loading fixes were verified on the live site. GitHub Actions still cannot start because of the account's billing/spending limit. Vercel deployment is passing.

## Reader experience follow-up

The next change adds optional reading-place hints for unfinished lessons, bounded to 30 entries on this device. Hints are not completion records and are not synced; completing a lesson, choosing Start from the top, or resetting progress clears them. Changed lesson hashes prevent outdated hints from being applied. Navigation owns scroll restoration, so reopening a lesson never jumps without the reader choosing Continue reading.

Progress measures the article instead of notes and footer, using a composited transform instead of changing layout width. The sidebar creates lesson links for the active path first and fills other paths on demand. Adjacent-lesson prefetch starts only on focus, hover or touch, keeps at most two short-lived entries, consumes each once and respects data-saving/slow connections. Failed or non-Markdown responses are discarded. Mobile contents start compact and keep focus at the selected section. Clipboard denial selects the code, and failed note persistence is reported honestly.

`npm run test:reader` has 16 passing cases covering resume/restart/completion, changed text, blocked storage, article progress, successful and invalid prefetch, data-saving/slow connections, mobile targets, keyboard section links, note persistence status, lazy sidebar links, correct lesson ownership of fallback text, and manual code copying. Existing resilience/navigation/accessibility checks continue to cover the reader.

## Path roadmaps and AppSec expansion

PRs #40 and #41 are merged. This follow-up expands AppSec from 15 to 18 lessons while preserving its existing lesson URLs. New lessons cover testable requirements with ASVS, secure code review, and a downloadable Python Fix & Verify exercise. The introduction and scanner lesson remove unsupported fixed repair costs and categorical scanner accuracy/coverage claims. The program capstone now requires technical evidence as well as a rollout plan.

All 26 paths have four connected stages backed by explicit lesson endpoints, relevant practice links, an evidence artifact, and optional credential recommendations. Stage completion uses existing lesson completion; clicking a stage does not mark it complete. Course completion and external certification eligibility remain separate. Recommendations include direct official-provider guides, role-specific reasons, a dated information review, and preparation/experience notes. CSSLP, CISA, BSCP, and CKS explicitly disclose important requirements. Prices, exam-version guarantees, and employment guarantees are not asserted.

The existing certification tracker is shared by path recommendations and its new path filter. Unknown imported status values fall back safely. Failed local persistence is explained on a path, and filter/focus are preserved after planner status changes. Reading the map requires no diagram library or network service. Static path pages also include the map, evidence, and provider links without JavaScript.

The preview catalog, quizzes, guides, and lesson files are generated from the root source by `generate-preview-content.js`. Data checks require complete, ordered, non-overlapping stage coverage, real practice links, usable credential guidance, and aligned course content in both frontends. The Python exercise uses only synthetic data and an in-memory SQLite database, without starting a server. Its seven tests intentionally demonstrate four failing starter test methods (14 subtest failures) and all pass against the reference implementation. Reference mode is clearly distinguished from verifying a learner's own fix.

Further AppSec corrections fix the secret-scanner installation mismatch, distinguish detection from push protection, use redacted Gitleaks Git scanning, clarify container layer/metadata exposure, and remove abbreviated action-pin examples and assumptions about token defaults. Artifact signatures and provenance are described as verified claims under a trust policy, not guarantees of safe code. The optional external scanner/container exercises were checked against their official documentation but were not installed or executed in this review.

Validation: root build and 59 data checks; roadmap data plus the runnable Python exercise; nine roadmap browser flows, including no-JavaScript layout and navigation; 40 smoke checks; canonical content/safety, 26 auth navigation, 32 refresh-free navigation, 43 UI and 34 navigation-quality checks; two offline-pack, two CDN resilience, 15 lesson resilience, and 16 reader cases. Both renderers processed all 488 lessons safely; all 42 lab routes opened without JavaScript errors. The preview passed typecheck, development-mode production bundling, 255 unit checks (four optional platform-document checks skipped), and browser checks for all 26 mobile roadmaps, lesson navigation, and the Python download.

Freshness generation now normalizes commit timestamps to UTC, matching the build clock and avoiding date-only diffs when the GitHub committer uses a different time zone. This does not label a content change as an editorial review. GitHub Actions billing limits and real provider OAuth/external VM testing limitations from the earlier audit still apply.

## Path discovery and complete offline practice

PR #42 is merged. The next pass fixes an AppSec offline gap: its ZIP previously contained the Markdown exercise instructions but omitted the Python file they referenced. The ZIP now includes the exact exercise file, rewrites its lesson link to the local copy, and includes learning-stage, evidence, and credential guidance in its index. Packs contain no personal completion, note, or certification-plan data. Browser offline saving also explicitly includes listed practice files; the interface distinguishes partial failure and an older worker that cannot yet save them.

ZIP requests use four bounded workers, individual request timeouts and a total deadline, progress, and cancellation. Leaving the page cancels the pack without a delayed download. Failed or HTML responses prevent an incomplete ZIP. The service worker validates both cached and network lesson/practice content, removes bad cached error pages, and does not fetch course content or exercises during installation. Content lookups use path sets/maps instead of scanning the entire lesson registry for every request.

The course finder matches existing path/lesson metadata and relevant credential names, combines query and level filters, and stores the selection in the page URL. It does not fetch lesson bodies or the full search index. Empty results have a reset action; text stays in text fields/textContent, with a bounded query length. The preview finder also searches lesson and credential metadata and preserves query/track choices in its URL. Certification status changes in the main planner update in place, preserve focus and the path filter, and report failed local persistence instead of silently pretending the selection was saved.

New browser checks cover topic/lesson/credential matching, refresh/back/history, keyboard/mobile behavior, untrusted query text, planner storage failure, older worker compatibility, complete ZIP content and relative links, HTML rejection, cancellation/navigation/timeout, partial offline saving, exercise access without a network, and invalid cached lesson recovery. The local fixture server supplies deterministic failures to actual service-worker requests. Existing course content and external provider requirements were not re-reviewed in this pass.

Validation for this pass: seven new discovery/planner checks and seven deterministic offline/ZIP checks pass; all nine roadmap checks, canonical content/safety, 26 auth navigation and 32 refresh-free navigation checks, two original offline-pack cases, 43 UI checks, 34 navigation-quality checks, and 16 reader checks pass. The preview finder passes topic/credential matching, rapid typing, combined filters, refresh, and reset, alongside all 26 mobile roadmap checks and exercise navigation/download. The finder is initially non-interactive until its own client event handlers are ready, independently of saved-progress hydration, so early typing is not silently discarded.
