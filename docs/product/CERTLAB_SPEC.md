# CertLab

Version: starter, 18 Nov 2026. Data lives in `studio/model.js`.

## Tracks

- CompTIA Security+ — SY0-801 and SY0-701 both described. Study the version you will sit.
- OffSec OSCP+ — practical exam and report. The quiz is only a concept check.
- Microsoft SC-200 — three published skill areas. Domain weights are intentionally blank because the English certification page did not list them.

Official URLs and the sentences they support are on each plan. Re-check them when a vendor page changes. `verifiedOn` is the fetch date, not a promise that the exam is unchanged tomorrow.

## Rules

- Questions are original and public. The UI calls them formative.
- Readiness text is “KashSec estimated readiness.” It counts objectives you marked and answers in this browser.
- No prices in INR or USD were added in this track. Older `CERTS` entries may still show previously reviewed USD figures.
- Study plans are rebuilt from minutes per day and an optional exam date. If the plan passes the exam date, the page says so.

## Acceptance covered

A learner can open a track, save a plan, set an objective status, submit the questions, and follow a lesson or lab link. `tests/studio.spec.js` checks the graph, scoring, plan overflow, and the secure invoice policy.
