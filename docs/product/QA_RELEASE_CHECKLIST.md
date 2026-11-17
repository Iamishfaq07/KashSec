# QA checklist for this studio slice

Run:

```bash
node tests/studio.spec.js
node --check app.js
node --check studio/model.js
node --check studio/ui.js
node --check generate-studio.js
```

Also run `npm run test:data` after `node generate-studio.js` so the new sitemap URLs still parse.

Browser pass, done manually or with Playwright when a server is up:

- `/certlab/` lists three plans. Opening Security+ rebuilds a plan and stores it after reload. A wrong formative answer marks that objective review due.
- `/cybercity/` opens the tester desk, the analyst desk, and the cloud desk. The analyst filter can be narrowed to the single cross-tenant line. The host is `billing.northbridge.test` only. The case note says "Not checked" for a desk you have not run.
- `/passport/` shows auto-verified only after a fixture passes, and `/coach/` answers "what next" without calling a model.
- A wrong answer shows the explanation. The page says the score is formative.
- `/research/` hides cards when a topic filter is pressed. “Not re-fetched” stays visible on those cards.
- `/skills/` explains the next skill from the marks in `kashsec_studio_v1` only.
- `/fix-verify/` fails the default policy and passes the session / owner / same-tenant policy.
- At 320px width the plan form fits without a horizontal page scrollbar.
- Existing `#/roadmap` still opens the career roadmap.

Do not claim `npm test` passed unless that command was run.
