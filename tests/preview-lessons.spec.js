#!/usr/bin/env node
// Run with the preview dev server on :8080 (npm --prefix preview run dev).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
const BASE = process.env.PREVIEW_BASE || 'http://127.0.0.1:8080';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined});
try {
  const context = await browser.newContext();
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(BASE).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let unavailable = true;
  await page.route('**/course/03-linux/terminal-basics.md', route => unavailable ? route.fulfill({status:503,body:'unavailable'}) : route.continue());
  await page.goto(BASE + '/lesson/03-linux/terminal-basics');
  await page.getByRole('button', {name:'Retry lesson'}).waitFor();
  unavailable = false;
  await page.getByRole('button', {name:'Retry lesson'}).click();
  await page.locator('.prose-lesson .code-block').first().waitFor();
  await page.locator('textarea').fill('A pipe connects commands.');
  await page.getByRole('button', {name:'Finish & continue'}).click();
  await page.waitForURL('**/linux-filesystem-hierarchy');
  await page.locator('.prose-lesson').waitFor();
  const catalog = JSON.parse(fs.readFileSync(new URL('../preview/src/data/catalog.json', import.meta.url)));
  const lessons = catalog.paths.flatMap(path => path.lessons.map(lesson => ({key:`${path.id}/${lesson.id}`,markdown:fs.readFileSync(new URL(`../preview/public/course/${path.id}/${lesson.id}.md`, import.meta.url),'utf8')})));
  const result = await page.evaluate(async lessons => {
    const {renderLesson} = await import('/src/lib/markdown.ts');
    const failures = [];
    for (const {key, markdown} of lessons) {
      try {
        const doc = new DOMParser().parseFromString(renderLesson(markdown), 'text/html');
        if (doc.body.textContent.length < 300) failures.push(`${key}: missing text`);
        if (doc.querySelector('script,iframe,object,embed') || [...doc.querySelectorAll('*')].some(el => [...el.attributes].some(a => /^on/i.test(a.name)))) failures.push(`${key}: unsafe HTML`);
      } catch(error) { failures.push(`${key}: ${error.message}`); }
    }
    const html = renderLesson('## **Repeat**\n\n## **Repeat**\n\n<img src=x onerror="alert(1)"><a href="javascript:alert(1)">bad</a>');
    return {failures,html};
  }, lessons);
  assert.deepEqual(result.failures, []);
  assert.match(result.html, /id="repeat-2"/);
  assert.match(result.html, /<strong>Repeat<\/strong>/);
  assert.doesNotMatch(result.html, /onerror|javascript:/i);
  assert.deepEqual(errors, []);
  console.log(`Preview: retry and finish/continue passed; ${lessons.length} lessons rendered safely; formatted and duplicate headings passed.`);
} finally { await browser.close(); }
