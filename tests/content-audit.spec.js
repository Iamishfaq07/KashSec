#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8000';
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const extract = name => new Function(app.match(new RegExp(`const ${name} = \\[[\\s\\S]*?\\n\\];`))[0] + `; return ${name};`)();
const paths = extract('PATHS');
const labs = extract('LABS');
const lessons = paths.flatMap(path => path.subs.map(sub => ({
  key: `${path.id}/${sub.id}`,
  markdown: fs.readFileSync(new URL(`../course/${path.id}/${sub.id}.md`, import.meta.url), 'utf8'),
})));
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
try {
  const context = await browser.newContext();
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin ? route.continue() : route.abort());
  // Block registration without Playwright's injected serviceWorker getter,
  // which itself throws inside the intentionally sandboxed XSS frame.
  await context.route('**/sw.js', route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack}`));
  await page.goto(BASE + '/lesson/03-linux/terminal-basics.html');
  await page.locator('#content .code-win').first().waitFor();
  const failures = await page.evaluate(lessons => lessons.flatMap(({key, markdown}) => {
    try {
      const html = enrichMarkdown(markdown);
      const root = document.createElement('div');
      root.innerHTML = html;
      if (!root.querySelector('h1') || root.textContent.length < 300) return [`${key}: missing heading or substantial text`];
      if (root.querySelector('script,iframe,object,embed') || [...root.querySelectorAll('*')].some(el => [...el.attributes].some(a => /^on/i.test(a.name)))) return [`${key}: unsafe HTML`];
      return [];
    } catch (error) { return [`${key}: ${error.message}`]; }
  }), lessons);
  assert.deepEqual(failures, [], 'every lesson renders readable, sanitized content');
  for (const lab of labs) {
    await page.goto(`${BASE}/labs/${lab.id}.html`);
    await page.waitForFunction(() => document.getElementById('app')?.innerText.trim().length > 100);
    assert.doesNotMatch(await page.locator('#app').innerText(), /Page not found|Coming soon/i, lab.id);
  }
  assert.deepEqual(errors, [], 'no lesson or lab JavaScript errors');
  console.log(`Content audit: ${lessons.length} lessons rendered safely; ${labs.length} lab routes opened without JavaScript errors.`);
} finally { await browser.close(); }
