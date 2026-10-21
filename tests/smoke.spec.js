#!/usr/bin/env node
/*
 * Browser smoke test — every major route renders without a JS error.
 *
 * Deliberately broad rather than deep: it is a tripwire for "the whole page
 * is blank" / "a rename broke the router", not a replacement for testing
 * individual features. Deep per-feature suites live alongside each change;
 * this is the one that must never go red.
 *
 *   node tests/smoke.spec.js            (expects a server on :8000)
 *   BASE=http://127.0.0.1:9999 node tests/smoke.spec.js
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';

const ROUTES = [
  ['home', '#/'],
  ['course index', '#/course'],
  ['tracks', '#/tracks'],
  ['roadmap', '#/roadmap'],
  ['skill tree', '#/skilltree'],
  ['labs index', '#/labs'],
  ['tools index', '#/tools'],
  ['glossary', '#/glossary'],
  ['flashcards', '#/review'],
  ['daily challenge', '#/daily'],
  ['weekly chains', '#/weekly'],
  ['shuffle quiz', '#/quiz/shuffle'],
  ['missed review', '#/quiz/missed'],
  ['careers', '#/careers'],
  ['career quiz', '#/career-quiz'],
  ['cert tracker', '#/certs'],
  ['interview bank', '#/interview'],
  ['mock interview', '#/interview/mock'],
  ['capstone', '#/capstone'],
  ['progress hub', '#/progress'],
  ['study planner', '#/planner'],
  ['incident workbench', '#/investigations'],
  ['incident case', '#/investigations/mailbox-takeover'],
  ['learning playground', '#/playground'],
  ['starting guide', '#/start'],
  ['network experiment', '#/playground/network'],
  ['encoding experiment', '#/playground/encoding'],
  ['access experiment', '#/playground/access'],
  ['transcript', '#/transcript'],
  ['certificate', '#/certificate'],
  ['changelog', '#/changelog'],
  ['faq', '#/faq'],
  ['path overview', '#/lesson/03-linux'],
  ['lesson', '#/lesson/03-linux/terminal-basics'],
  ['path quiz', '#/quiz/03-linux'],
  ['lab: sqli', '#/labs/sqli'],
  ['lab: idor', '#/labs/idor'],
  ['lab: ssrf', '#/labs/ssrf'],
  ['tool: jwt', '#/tools/jwt'],
  ['tool: cvss', '#/tools/cvss'],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  // CI has no reason to reach third parties; block them so a CDN blip or an
  // ad/analytics endpoint can never turn into a flaky failure.
  await ctx.route('**://cdn.jsdelivr.net/**', r => r.abort());
  await ctx.route('**://*.supabase.co/**', r => r.abort());
  await ctx.route('**://pagead2.googlesyndication.com/**', r => r.abort());
  await ctx.route('**://fonts.googleapis.com/**', r => r.abort());
  await ctx.route('**://fonts.gstatic.com/**', r => r.abort());

  const results = [];
  for (const [name, hash] of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    let rendered = false;
    try {
      await page.goto(`${BASE}/index.html${hash}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(600);
      // "Rendered" = the SPA replaced its loading placeholder with real content.
      rendered = await page.evaluate(() => {
        const app = document.getElementById('app');
        return !!app && app.innerHTML.length > 120 && !/^\s*<div class="loading"/.test(app.innerHTML);
      });
    } catch (e) {
      errors.push(`navigation failed: ${e.message}`);
    }
    const ok = rendered && errors.length === 0;
    results.push({ name, ok, errors, rendered });
    await page.close();
  }

  await browser.close();

  console.log(`\n  Smoke test — ${ROUTES.length} routes against ${BASE}\n`);
  let failed = 0;
  for (const r of results) {
    if (r.ok) { console.log(`  ✓ ${r.name}`); continue; }
    failed++;
    const why = !r.rendered ? 'did not render' : r.errors[0];
    console.log(`  ✗ ${r.name} — ${why}`);
  }
  console.log(`\n  ${results.length - failed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
})();
