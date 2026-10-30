# Lesson reliability and course audit

## Expert case workflow and changed-draft protection — 2026-10-29

The Expert Labs collection now summarizes saved answers and report notes without claiming coding completion. Cases include keyboard-accessible section links and next-case navigation. Before each save, the editor compares the current saved case record with the version it loaded or last saved. A changed record pauses auto-save and preserves the current in-memory report for download. Loading the saved version reads it again and leaves current work intact if storage has become unreadable. Different cases continue to merge independently. This is changed-record detection, not a collaborative text editor or an atomic cross-process merge.

`tests/expert-workflow.spec.js` exercises two real tabs, preservation of the newer saved case, local report export, loading the latest saved draft, failed reload, legacy and malformed draft summaries, keyboard focus without history changes, next-case navigation, narrow screens, and course-score isolation. The same suite runs against the main and preview readers through the existing expert test scripts.

## Expert Labs and deeper AppSec practice — 2026-10-29

Production verification exposed a stylesheet-loading race: the case form could appear before its layout rules, briefly overflowing a narrow screen. Both loaders now wait for the shared stylesheet before mounting, retain a readable static brief on the main site, and offer retry if styling fails. `tests/expert-style.spec.js` delays or rejects the stylesheet and checks immediate 320px fit after recovery in each frontend.

The Labs collection now links to four expert cases covering tenant authorization, webhook integrity/replay, release-artifact trust, and cloud permission scope. Full case briefs are generated as static HTML and included in the sitemap and `llms.txt`. The main academy and preview share the same case module, styling, and downloadable Python exercise; the bundle loads only when the expert collection is opened.

`npm run test:expert` and `npm run test:preview-expert` check the prerequisite links, all four repair starters and supplied references, case reviews, missing-answer recovery, feedback focus, stale-score prevention, draft reload and storage failure, report/evidence/exercise downloads, and screen widths. Main-site coverage also checks no-JavaScript briefs, module-load recovery, and genuine offline case/exercise reopening. Drafts use `kashsec_expert_labs_v1` and are separate from course progress, account sync, and progress backups; the UI and privacy page disclose this and offer report export.

Three AppSec lessons now add deeper technical review tasks and expert-case links. API webhook material distinguishes integrity, freshness, and durable idempotent processing. The cloud lab adds a local option and removes unsupported blanket account/cost and fixed-level claims. The Python exercises are small training models: they do not verify actual release signatures, model the full AWS policy engine, or establish concurrent durable webhook processing. Browser self-check scores do not mark coding work, lessons, or certification complete. External VM/cloud labs were not executed.

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

## Sitewide search reliability and keyboard access

PR #47 is merged. This pass makes the main search page and command palette use the same matcher, with all 42 lab shortcuts generated from the lab catalog instead of a stale 21-item list. The page now includes tool and navigation results. Opening the palette still downloads no lesson-text index; the preview interface likewise waits for a real query before downloading glossary data.

Late search downloads update result regions without rebuilding the search form or repainting an obsolete route. Typed drafts and command selection survive tier completion. Preview and full-index requests each have a 12-second deadline and validate their exported array; full search is attempted even when the preview fails. Failed or partial loading shows a retry action and keeps metadata results available. One-character queries explain the minimum for body search instead of claiming that a download is pending. Highlighting escapes plain text before adding match marks.

Both interfaces have a visible Close button and announce arrow-key selection. The preview dialog now makes background content inert, traps Tab, returns focus to its trigger, scrolls keyboard-selected rows into view, and limits Enter navigation to the search input. Its mobile search button has an accessible name and waits for its event handlers before becoming interactive. Main palette links preserve normal modified-click behavior. Preview home-page path cards use a shrinkable title column to prevent horizontal overflow at 320px.

Regression coverage includes delayed responses across query navigation, preserved input nodes/drafts and command selection, concurrent page/palette consumers, escaped snippets, failed downloads and retry, a genuinely stalled preview, a successful response without the expected index, preview-to-full fallback, all 42 lab shortcuts, and mobile keyboard/focus behavior in both interfaces. This is a navigation and search review; it does not claim a new subject-matter review of every lesson or execution of external labs.

Validation: root generation/build, 59 data checks, 15 existing search checks plus the five new reliability groups, preview search keyboard/mobile checks, 43 UI and 34 navigation-quality checks, canonical routing/content safety, 26 auth-navigation checks, and refresh-free navigation checks. Preview typecheck and production bundling in development mode pass. The GitHub Actions billing restriction documented above remains an external limitation.

## Research-led AI practice and technical SEO — 30 October 2026

PR #48 is merged. The dated [research record](docs/research-2026-10-ai-seo.md) compares current MCP, OWASP, NIST and Google primary sources with this repository and distinguishes implementation choices from standards requirements. The existing OWASP lesson already covered the 2026 list; this pass adds applied material instead of presenting that list as newly discovered.

The AI path grows from 23 to 26 lessons (491 across the course): MCP/tool authorization, RAG tenant isolation, and AI security release gates. Three quiz questions reinforce these boundaries. Two new expert cases bring the collection to six. Their Python starter/reference suites exercise exact task authority and pre-context document eligibility, with positive legitimate cases as well as denied operations and non-mutation checks. They do not implement a model, token validator, MCP transport, real approval workflow, vector database or cache. Remaining integration risks are explicit in lessons and lab briefs. The AI roadmap covers the added lessons, links both cases, and includes the exact Python exercise in its offline pack. New practice is visible on both homepages.

The public homepage now contains useful, visible initial HTML rather than only a loading message. Counts come from the source catalog. Shared static navigation and supported Markdown fragment links use the app's canonical mapping, while active navigation and refresh-free routing accept both forms. All generated static readers use a single-column layout with shrinkable content and scrollable tables so they are readable before JavaScript, including at 320px. The existing standalone noindex 404 page retains its theme and search, adds AI/expert recovery links, removes a stale lesson count and a false fuzzy-search claim, and safely handles malformed URL escapes. The sitemap has 609 unique canonical entries. Homepage and AI-path share cards were regenerated; unchanged section/path cards are retained.

SEO checks inspect every sitemap page for distinct titles/descriptions, self-canonicals, matching social URLs, readable main content, one main heading, valid JSON-LD and canonical primary links. Browser checks cover no-JavaScript mobile discovery and all new lessons, plus normal client navigation and active states. Existing routing tests now locate both legacy and canonical anchors; their URL, history, auth and document-continuity assertions remain intact. Expert tests now require six cases, and the last-case navigation test follows the new final case.

Google's current documentation retires FAQ rich results and says ordinary SEO fundamentals apply to AI features; no special ranking benefit from llms.txt or guaranteed rich-result display is claimed. Existing semantic markup remains descriptive. Search Console credentials were unavailable: ownership verification, sitemap submission, actual indexing state and search performance measurement remain owner actions documented in the research record. No fabricated verification token, rankings, traffic, reviews, salaries or provider affiliation was added.

Validation: reproducible root generation; 59 integrity checks; all 26 roadmap definitions and shared frontend assets; six failing starter suites and passing references; both interfaces' six-case expert flows, keyboard/mobile layouts and changed-draft protection; eight offline/ZIP cases including the new 28-file AI pack; all 491 lesson bodies rendered safely and all 42 browser-lab routes opened; 609-page SEO checks and no-JavaScript mobile discovery; canonical content safety, 26 auth-navigation and 32 refresh-free navigation checks; 43 UI, 34 navigation-quality and 16 reader checks; preview typecheck, production bundling in development mode and mobile search regression checks. GitHub Actions billing remains an external limitation until the account is fixed.

## Expert case discovery and AI lesson checks

PR #49 is merged. Expert Labs now combines a topic selector, token-based text search and a saved-draft filter. Search uses case metadata and prerequisite names already in the loaded module; it adds no requests. The finder filters existing cards in place, announces the visible count, preserves input focus, and provides an explicit empty state and clear action. Draft status remains separate from implementation completion. Filters apply to the current list and are not saved or included in the URL.

The collection now refreshes draft labels and results when another same-origin tab changes or removes saved case data. If storage becomes unreadable, the draft-only filter is cleared and disabled with an explanation, so inaccessible status cannot hide otherwise usable cases. The main router now disposes the module's collection listener on navigation; the preview already honors the returned disposer. Query text stays in native text inputs and is never rendered as HTML.

The three AI lessons added in PR #49 now have dedicated optional checks covering trusted tool authorization, retrieval eligibility before model context, and legitimate-task success in release evaluation. Each explanation links back to an actual source heading. These checks use the existing accessible retry/review flow and do not award course completion or quiz scores. Both frontends receive the same generated data. Existing AppSec coverage remains complete.

Validation covers all 21 lesson-specific checks in both frontends (18 AppSec plus three AI), including wrong/correct feedback, focus, review targets, retry, mobile widths and finish/continue independence. New finder browser checks cover combined filters, empty/reset states, Enter handling, untrusted text, live changes from a second tab, missing/corrupt/restored storage, navigation cleanup and 320–1440px layouts in both frontends. Existing expert-case, canonical navigation and data checks remain part of validation. The source catalog still has 491 lessons and six expert cases; this pass does not add external services or claim a new subject-matter audit.
