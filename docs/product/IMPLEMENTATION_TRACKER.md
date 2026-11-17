# Implementation tracker

| Phase | Status | What landed |
|---|---|---|
| 0 Baseline | partial | Audit written from the reverted main. Full Playwright suite not run |
| 1 Skills graph and routes | implemented | Eleven skills, palette entries, crawlable pages, tests. Not the full 491-lesson map |
| 2 CertLab | implemented for three starter tracks | Plans, coverage, comparison, original questions, review queue for missed answers. Not a full blueprint dump |
| 3 Research vault | partial | 19 cards, filters, provenance, correction link to the contact page. No submissions |
| 4 Signature lab | partial | Northbridge desks plus nine graded practice labs and a catalog of all 18 requested labs. Mobile storage is specified, not interactive |
| 5 Skill Passport | partial, local only | Markdown and JSON download. No account, no public profile, no instructor review |
| 6 Classrooms, live model, public writeups | blocked on this static site | No account system and no moderation service. The offline coach and glossary are the substitute |

## Risks

- Vendor pages will go stale. `verifiedOn` has to be updated by a person.
- A shallow git clone must not be used to regenerate the whole sitemap.
- Formative answers are public. Do not describe them as proctored.
