# Implementation tracker

| Phase | Status | What landed |
|---|---|---|
| 0 Baseline | partial | Audit written from the reverted main. Full Playwright suite not run |
| 1 Skills graph and routes | implemented | Eleven skills, palette entries, crawlable pages, tests. Not the full 491-lesson map |
| 2 CertLab | implemented for three starter tracks | Plans, coverage, comparison, original questions, review queue for missed answers. Not a full blueprint dump |
| 3 Research vault | partial | 11 cards, filters, provenance. No submissions |
| 4 Signature lab | partial | Northbridge tester, AppSec, analyst, cloud role, assistant boundary, and an incident note. Case export stays blank until a desk is run. No full company org |
| 5 Skill Passport | partial, local only | `/passport/` evidence levels and Markdown download. No account, no public profile, no instructor review |
| 6 Classrooms, AI coach, more certs | deferred | Offline coach at `/coach/` answers three fixed questions. No model |

## Risks

- Vendor pages will go stale. `verifiedOn` has to be updated by a person.
- A shallow git clone must not be used to regenerate the whole sitemap.
- Formative answers are public. Do not describe them as proctored.
