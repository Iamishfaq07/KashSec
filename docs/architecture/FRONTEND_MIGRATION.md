# Frontend

The canonical learner app remains the root static site. `preview/` is unchanged and still excluded from the Vercel output.

New screens are a module, `studio/ui.js`, imported from `route()` only when the hash is `#/certlab`, `#/research`, `#/skills`, or `#/fix-verify`. Crawlable shells are `certlab/index.html`, `research/index.html`, `skills/index.html`, and `fix-verify/index.html`, written by `generate-studio.js` after prerender so a full build does not drop them.

Existing hash aliases and progress keys are unchanged.
