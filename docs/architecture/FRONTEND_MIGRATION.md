# Frontend

The canonical learner app remains the root static site. `preview/` is unchanged and still excluded from the Vercel output.

New screens live in `studio/ui.js`, imported from `route()` for studio hashes. `generate-studio.js` writes the crawlable shells after prerender so a full build does not drop them.

Each public studio object also has a crawlable path, for example `/skills/foundations.cia/`, `/practice/oauth/`, `/certlab/security-plus/`, `/research/owasp-api/`, `/cybercity/soc/`, and `/coach/bola/`. Opening that path loads the same screen as the hash. Progress is still local.

Existing hash aliases and progress keys are unchanged.
