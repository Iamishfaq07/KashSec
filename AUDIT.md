# Lesson reliability and course audit

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

GitHub Actions could not start: its annotation reports failed account payments or a spending limit. Vercel preview deployment is passing. No production merge or deployment is claimed; PR #40 contains the changes for review.
