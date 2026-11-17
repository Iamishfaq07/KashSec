# Baseline audit

Checked against `main` at `bce4c8a` on 18 Nov 2026, after [PR #62](https://github.com/Iamishfaq07/KashSec/pull/62) reverted [PR #57](https://github.com/Iamishfaq07/KashSec/pull/57). The file tree matches `aa1900f` plus that revert commit.

## Confirmed counts

| Item | Count | Source |
|---|---|---|
| Learning paths | 26 | `PATHS` in `app.js` |
| Lessons | 491 | sum of path subs |
| Browser labs | 42 | `LABS` |
| Browser tools | 32 | `TOOLS` |
| Expert labs | 6 | `expert-labs.js` |
| Typed practice tasks | 104 | README and task source |
| Career roadmaps | 21 fields | `CAREER_ROADMAPS` |
| Package version | 2.6.0 | `package.json` |

## Architecture

- Production site is the root static app (`index.html`, `app.js`, generated `lesson/`, `labs/`, `tools/`). `.vercelignore` excludes `preview/`.
- `preview/` is a separate React reader. It is not the live deployment.
- Progress, notes, and drafts stay in `localStorage` unless the learner turns on Supabase sync.
- Generated search, prerender, sitemap, and the service worker must be rebuilt. Do not hand-edit them as the source of truth.

## Keep

Course paths, labs, tools, expert labs, incident workbench, playground, study planner, flashcards, career roadmap (do not split Careers and Roadmap again), offline packs, and the existing certification list in `CERTS`.

## Gap this change starts

The course had no shared skill IDs, no certification workspace with objective status, and no research catalogue with provenance. Certification data was a planner, not a study flow.

## Not re-tested here

- Full Playwright CI, including `tests/navigation-refresh.spec.js` (Ctrl-click popup). It was not executed in this environment.
- Live performance numbers. No Lighthouse score is claimed.
- Whether `npm run build` on a full git history rewrites tool/lab `lastmod` values after `app.js` changes. CI does that check. This clone was shallow when the studio pages were first generated.

## Known limitation

`tasks-source.js` still contains readable low-stakes answers. The new formative CertLab questions are also in the public repo and are labeled as such. They are not a sealed exam.
