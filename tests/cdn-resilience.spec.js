#!/usr/bin/env node
/*
 * CDN resilience — lesson text must render with cdn.jsdelivr.net unreachable.
 *
 * This guards a real regression: the markdown renderer used to be loaded from
 * a CDN and chained *behind* Mermaid, so a blocked or slow CDN blanked every
 * lesson on the site with "Couldn't load the lesson renderer". marked is now
 * vendored locally and Mermaid is strictly optional, so text must survive.
 *
 *   node tests/cdn-resilience.spec.js        (expects a server on :8000)
 *   BASE=http://127.0.0.1:9999 node tests/cdn-resilience.spec.js
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';

// Lessons chosen deliberately: one with a Mermaid diagram (the case that used
// to break hardest) and one without.
const CASES = [
  ['lesson with a diagram', '#/lesson/03-linux/install-virtualbox', true],
  ['lesson without a diagram', '#/lesson/01-introduction/what-is-cybersecurity', false],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const ctx = await browser.newContext({ serviceWorkers: 'block' });

  // Simulate the CDN being blocked/down. Fonts and Supabase are blocked too so
  // the test never depends on the network.
  for (const pattern of [
    '**://cdn.jsdelivr.net/**',
    '**://fonts.googleapis.com/**',
    '**://fonts.gstatic.com/**',
    '**://*.supabase.co/**',
    '**://pagead2.googlesyndication.com/**',
  ]) await ctx.route(pattern, r => r.abort());

  const results = [];
  for (const [name, hash, expectDiagram] of CASES) {
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/index.html${hash}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2500);
      const r = await page.evaluate(() => {
        const c = document.getElementById('content');
        return {
          rendererError: /Couldn.t load the lesson renderer/.test(c ? c.innerHTML : ''),
          h1: !!(c && c.querySelector('h1')),
          paragraphs: c ? c.querySelectorAll('p').length : 0,
          chars: c ? (c.textContent || '').length : 0,
          rawMermaidLeaked: !!(c && /flowchart |sequenceDiagram/.test(
            [...c.querySelectorAll('.mermaid:not(.mermaid-unavailable)')]
              .map(n => n.textContent).join(''))),
          degraded: c ? c.querySelectorAll('.mermaid-unavailable').length : 0,
        };
      });
      const ok = !r.rendererError && r.h1 && r.paragraphs >= 3 && r.chars > 800 && !r.rawMermaidLeaked
        && (!expectDiagram || r.degraded >= 1);
      results.push({ name, ok, r });
    } catch (e) {
      results.push({ name, ok: false, r: { err: e.message } });
    }
    await page.close();
  }

  await browser.close();

  console.log(`\n  CDN resilience — ${CASES.length} lessons with cdn.jsdelivr.net blocked\n`);
  let failed = 0;
  for (const { name, ok, r } of results) {
    if (ok) { console.log(`  ✓ ${name} — ${r.chars} chars, ${r.paragraphs} paragraphs rendered`); continue; }
    failed++;
    console.log(`  ✗ ${name} — ${JSON.stringify(r)}`);
  }
  console.log(`\n  ${results.length - failed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
})();
