#!/usr/bin/env node
/* Every lab and tool takes typed input and shows something back. This types
   an HTML payload into every text field of every lab and tool, presses
   Enter and every visible button, and fails if the payload ever runs in the
   site itself. The one place script is meant to run is the Web App lab's
   reflected-XSS demo, and only inside its sandboxed iframe.

   Hits are recorded through a Playwright binding rather than a page global,
   so a button that reloads the page cannot erase the evidence. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const ids = name => {
  const m = app.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\];`));
  assert.ok(m, `${name} found in app.js`);
  return [...m[1].matchAll(/\{\s*id:\s*'([^']+)'/g)].map(x => x[1]);
};
const routes = [...ids('LABS').map(i => `/#/labs/${i}`), ...ids('TOOLS').map(i => `/#/tools/${i}`)];
assert.ok(routes.length > 40, `found ${routes.length} labs and tools`);
const SANDBOXED_DEMO = '/#/labs/webapp';
const FIELDS = '#app :is(input[type=text],input:not([type]),input[type=search],input[type=url],input[type=email],textarea)';

const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
const problems = [];

async function fuzz(route) {
  const context = await browser.newContext({serviceWorkers:'block'});
  await context.route('**/*', r => new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
  await context.addInitScript(() => {
    localStorage.setItem('kashsec_state_v1', JSON.stringify({tourSeen:true, tourDone:true, onboarded:true}));
    window.alert = () => {}; window.confirm = () => false; window.prompt = () => null;
  });
  const hits = new Set();
  await context.exposeBinding('__hit', (source, tag) =>
    hits.add(`${tag} in ${source.frame === source.page.mainFrame() ? 'main page' : 'iframe'}`));
  const page = await context.newPage();
  page.setDefaultTimeout(1500);              // fields and buttons: fail fast
  page.setDefaultNavigationTimeout(20000);   // page loads: four run at once
  try {
    await page.goto(BASE + route, {waitUntil:'networkidle'});
    // Round 0 types the payload bare; round 1 prefixes "echo " for terminals.
    for (let round = 0; round < 2; round++) {
      for (const [i, field] of (await page.$$(FIELDS)).entries()) {
        try {
          await field.fill(`${round ? 'echo ' : ''}"'><img src=x onerror=__hit('field${i}.${round}')>`);
          await field.dispatchEvent('input');
          await field.press('Enter');
        } catch {}
      }
      for (const button of (await page.$$('#app button:not([disabled])')).slice(0, 25)) {
        try { if (await button.isVisible()) await button.click({timeout:800}); } catch {}
      }
      await page.waitForTimeout(250);
      if (!page.url().endsWith(route.slice(1))) await page.goto(BASE + route, {waitUntil:'networkidle'});
    }
    await page.waitForTimeout(300);
  } catch (error) {
    problems.push(`${route}: could not be exercised (${error.message.split('\n')[0]})`);
  }
  for (const hit of hits) {
    if (route === SANDBOXED_DEMO && hit.endsWith('in iframe')) continue;
    problems.push(`${route}: payload ran (${hit})`);
  }
  await context.close();
}

const queue = [...routes];
await Promise.all(Array.from({length:4}, async () => { while (queue.length) await fuzz(queue.shift()); }));
await browser.close();
assert.deepEqual(problems, [], 'typed input never runs as script on the site');
console.log(`Lab input fuzz: ${routes.length} labs and tools, no input ran as script.`);
