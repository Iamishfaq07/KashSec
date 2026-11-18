# Implementation tracker

| Phase | Status | What landed |
|---|---|---|
| 0 Baseline | partial | Audit written from the reverted main. Full Playwright suite not run |
| 1 Skills graph and routes | implemented | Nineteen skills, crawlable studio URLs, and an optional goal and time on the existing start guide. Not the full 491-lesson map |
| 2 CertLab | implemented for three starter tracks | Plans, coverage, comparison, original questions, review queue for missed answers. Not a full blueprint dump |
| 3 Research vault | partial | 19 cards, filters, provenance, correction link to the contact page. No submissions |
| 4 Signature lab | partial | Northbridge desks, nine graded practice labs with hint, reset, and debrief, help levels, and a six-case analyst shift. Mobile storage is specified, not interactive |
| 5 Skill Passport | partial, local only | Markdown and JSON download, plus career gaps against all 21 existing roadmaps. Mobile has no mapped skill, because there is no phone lab. No account, no public profile, no instructor review |
| 6 Classrooms, live model, public writeups | blocked on this static site | No account system and no moderation service. The offline coach, glossary, and help levels are the substitute |

## Risks

- Vendor pages will go stale. `verifiedOn` has to be updated by a person.
- A shallow git clone must not be used to regenerate the whole sitemap.
- Formative answers are public. Do not describe them as proctored.
