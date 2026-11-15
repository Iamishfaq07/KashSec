#!/usr/bin/env node
/* Labs echo what the learner types (a terminal, an invoice id). That text is
   ours to display, never ours to run: markup typed into a lab must appear as
   text, and names like "constructor" must not reach Object.prototype. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
const context = await browser.newContext({serviceWorkers:'block'});
context.setDefaultTimeout(8000);
await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin
  ? route.continue() : route.abort());
await context.addInitScript(() => {
  localStorage.setItem('kashsec_state_v1', JSON.stringify({tourSeen:true, tourDone:true, onboarded:true}));
  window.__injected = 0;
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let passed = 0;
const check = (ok, name) => { assert.ok(ok, name); passed++; };

await page.goto(BASE + '/#/labs/terminal');
const payload = '<img src=x onerror=window.__injected++>';
for (const cmd of [`echo ${payload}`, `ls ${payload}`, 'cd <b>x</b>', 'cat <i>y</i>', 'grep a <u>z</u>',
  'find <s>q</s>', 'history', 'cd __proto__', 'ls']) {
  await page.fill('#termInput', cmd);
  await page.press('#termInput', 'Enter');
}
await page.waitForTimeout(300);
check(await page.evaluate(() => window.__injected) === 0, 'terminal input never runs as script');
check(await page.locator('#termOut :is(img,b,i,u,s)').count() === 0, 'terminal input never becomes markup');
const out = await page.textContent('#termOut');
check(out.includes(payload), 'terminal shows the typed text literally');
check(out.includes('cd: __proto__: No such directory'), 'prototype names are not directories');
check(await page.locator('#termOut .tp-dir').count() > 0, 'real directories still list');

await page.goto(BASE + '/#/labs/idor');
await page.fill('#idorId', 'constructor');
await page.press('#idorId', 'Enter');
check(/404/.test(await page.textContent('#idorResult')), 'IDOR lab treats prototype names as missing invoices');
await page.fill('#idorId', '1043');
await page.press('#idorId', 'Enter');
check(/Priya Sharma/.test(await page.textContent('#idorResult')), 'IDOR lab still exposes the other invoice');

for (const route of ['/#/tools/constructor', '/#/quiz/constructor']) {
  await page.goto(BASE + route);
  await page.waitForFunction(() => /Page not found/.test(document.title));
  passed++;
}
assert.deepEqual(errors, [], 'no browser JavaScript errors');
await browser.close();
console.log(`Lab input escaping: ${passed} checks passed.`);
